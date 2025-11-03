/**
 * @file hooks.js
 * @description React hooks for Friend operations using SWR
 *
 * This module provides React hooks for friend relationship CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states.
 * @namespace CityArtWalks.Actions.Friend.Hooks
 * @version 1.0.0
 * @author GitHub Copilot
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Friend-Model} - Friend model documentation
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
 * SWR hook for paginated friends with comprehensive filtering and IndexedDB caching support.
 * Provides efficient friend relationship data fetching with automatic cache management and fallback strategies.
 *
 * Features:
 * - User-based filtering for friend relationships
 * - SWR caching with configurable revalidation
 * - IndexedDB fallback for offline support
 * - Automatic cache invalidation and refresh triggers
 * - Pagination support with metadata
 * - Structured error handling and loading states
 * - Flexible sorting options (createdAt, updatedAt)
 *
 * @async
 * @function useGetPaginatedFriends
 * @memberof CityArtWalks.Actions.Friend.Hooks
 *
 * @example
 * // Basic usage with pagination
 * const { friends, paginationMeta, friendsLoading } =
 *   useGetPaginatedFriends({}, 1, 20);
 *
 * @example
 * // Filter by specific users
 * const result = useGetPaginatedFriends(
 *   {
 *     userId1: '123',
 *     userId2: '456',
 *     sortBy: 'createdAt',
 *     sortOrder: 'desc'
 *   },
 *   1,
 *   10,
 *   accessToken
 * );
 *
 * @param {Object} [filters={}] - Filter parameters object
 * @param {number|string} [filters.userId1] - First user ID
 * @param {number|string} [filters.userId2] - Second user ID
 * @param {'createdAt'|'updatedAt'} [filters.sortBy] - Sort field
 * @param {'asc'|'desc'} [filters.sortOrder] - Sort order
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated friends result with IndexedDB caching
 * @returns {Array} returns.friends - Array of friend relationship objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.friendsLoading - Loading state
 * @returns {Error} returns.friendsError - Error state
 * @returns {boolean} returns.friendsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 */
export function useGetPaginatedFriends(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { userId1, userId2, sortBy = 'createdAt', sortOrder = 'desc' } = filters || {};
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedFriends',
      userId1 ?? '',
      userId2 ?? '',
      sortBy ?? '',
      sortOrder ?? '',
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [userId1, userId2, sortBy, sortOrder, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedFriends(
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
        debugError('CityArtWalks.Actions.Friend.Hooks.useGetPaginatedFriends', err);
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
        debugError('CityArtWalks.Actions.Friend.Hooks.useGetPaginatedFriends', cacheError);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      friends: data?.data?.friends || [],
      paginationMeta: data?.data?.meta || { total: 0, page, rowsPerPage },
      friendsLoading: isLoading,
      friendsError: error,
      friendsEmpty: !isLoading && (!data?.data?.friends || data.data.friends.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate, page, rowsPerPage]
  );
}
