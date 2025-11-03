/**
 * @file hooks.js
 * @description React hooks for Email operations using SWR with IndexedDB caching support
 * @namespace CityArtWalks.Actions.Email.Hooks
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

import useSWR from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  keepPreviousData: true,
};

/**
 * SWR hook for paginated emails with IndexedDB caching support.
 * Provides email data with pagination, filtering, and automatic caching.
 *
 * Features:
 * - Paginated email fetching with SWR
 * - IndexedDB caching for offline support
 * - Filter support (search, recordType, email, userId)
 * - Automatic revalidation and refresh capabilities
 * - Loading states and error handling
 *
 * @async
 * @function useGetPaginatedEmails
 * @memberof CityArtWalks.Actions.Email.Hooks
 *
 * @example
 * // Basic usage
 * const {
 *   emails,
 *   emailsLoading,
 *   emailsError,
 *   paginationMeta,
 *   mutate
 * } = useGetPaginatedEmails(
 *   { search: 'user@example.com', recordType: 'sent' },
 *   1,
 *   10,
 *   accessToken
 * );
 *
 * @param {Object} [filters={}] - Filter criteria for emails
 * @param {string} [filters.search=''] - Search term for email content
 * @param {string} [filters.recordType=''] - Type of email record
 * @param {string} [filters.email=''] - Email address filter
 * @param {string} [filters.userId=''] - User ID filter
 * @param {number} [page=1] - Page number (1-based)
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Authentication token
 * @param {number} [revalidate=600] - Cache revalidation time in seconds
 * @param {any} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Hook state with emails data and handlers
 */
export function useGetPaginatedEmails(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', recordType = '', email = '', userId = '' } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedEmails',
      search,
      recordType,
      email,
      userId,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, recordType, email, userId, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedEmails(
          page,
          rowsPerPage,
          filters,
          token,
          revalidate
        );
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError('CityArtWalks.Actions.Email.Hooks.useGetPaginatedEmails', err);
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError('CityArtWalks.Actions.Email.Hooks.useGetPaginatedEmails', cacheError);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      emails: data?.data?.emails || [],
      paginationMeta: data?.data?.meta || { total: 0, page, rowsPerPage },
      emailsLoading: isLoading,
      emailsError: error,
      emailsEmpty: !isLoading && (!data?.data?.emails || data.data.emails.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate, page, rowsPerPage]
  );
}
