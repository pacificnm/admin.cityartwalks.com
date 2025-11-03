/**
 * @file hooks.js
 * @description React hooks for IndexNowSubmission data fetching, caching, and mutations
 *
 * This module provides comprehensive SWR-based hooks for IndexNowSubmission operations including
 * paginated fetching, individual record retrieval, CRUD operations, queue processing,
 * and statistics with IndexedDB caching support and automatic cache invalidation.
 * @namespace CityArtWalks.Actions.IndexNowSubmission.Hooks
 * @version 1.0.0
 * @author CityArtWalks Development Team
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNowSubmission-Model} - IndexNowSubmission model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#IndexNowSubmission} - Database schema reference
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { emitIndexNowProcess, emitIndexNowListRefresh } from 'src/utils/cache-events';

import { debugLog, debugWarn, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
  dedupingInterval: 30000, // 30 seconds deduplication
};

/**
 * SWR hook for paginated IndexNowSubmissions with IndexedDB caching support.
 *
 * Features:
 * - Comprehensive filtering by search, status, entity type, action, and creator
 * - SWR-based data fetching with automatic revalidation
 * - IndexedDB caching for offline support and performance
 * - Pagination with configurable page size
 * - Manual refresh trigger support
 * - Automatic cache invalidation and refresh support
 *
 * @function useGetPaginatedIndexNowSubmissions
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for url/entityType fields
 * @param {string} [filters.status=''] - Status filter (PENDING, SUBMITTED, FAILED, SUCCESS)
 * @param {string} [filters.entityType=''] - Entity type filter (ARTIST, ART_PIECE, PATH, POST)
 * @param {string} [filters.action=''] - Action filter (CREATED, UPDATED, DELETED)
 * @param {string} [filters.createdBy=''] - Creator user ID filter
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated IndexNowSubmissions result with IndexedDB caching
 * @returns {Array} returns.indexNowSubmissions - Array of IndexNowSubmission objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.indexNowSubmissionsLoading - Loading state
 * @returns {Error} returns.indexNowSubmissionsError - Error state
 * @returns {boolean} returns.indexNowSubmissionsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 */
export function useGetPaginatedIndexNowSubmissions(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', status = '', entityType = '', action = '', createdBy = '' } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedIndexNowSubmissions',
      search,
      status,
      entityType,
      action,
      createdBy,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, status, entityType, action, createdBy, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    () => requests.getPaginatedIndexNowSubmissions(page, rowsPerPage, filters, token, revalidate),
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cachedData = await loadFromIndexedDb(cacheKey);
        if (cachedData && (!data || data.length === 0)) {
          debugLog(
            'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetPaginatedIndexNowSubmissions',
            'Loading data from IndexedDB cache',
            {
              cacheKey,
              dataFound: !!cachedData,
            }
          );
          mutate(cachedData, false);
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetPaginatedIndexNowSubmissions',
          'Failed to load from IndexedDB cache',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, data]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  // Save successful data to IndexedDB
  useEffect(() => {
    if (data && cacheKey) {
      saveToIndexedDb(cacheKey, data).catch((saveError) => {
        debugWarn(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetPaginatedIndexNowSubmissions',
          'Failed to save to IndexedDB cache',
          {
            error: saveError.message,
            cacheKey,
          }
        );
      });
    }
  }, [data, cacheKey]);

  return useMemo(
    () => ({
      indexNowSubmissions: Array.isArray(data?.data) ? data.data : [],
      paginationMeta: data?.pagination || {},
      indexNowSubmissionsLoading: isLoading,
      indexNowSubmissionsError: error,
      indexNowSubmissionsEmpty:
        !isLoading && (!Array.isArray(data?.data) || data.data.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single IndexNowSubmission by ID with IndexedDB caching.
 *
 * Features:
 * - ID validation and sanitization
 * - SWR-based data fetching with automatic revalidation
 * - IndexedDB caching for offline support
 * - Error handling and loading states
 * - Authentication support
 * - Automatic cache invalidation
 *
 * @function useGetIndexNowSubmissionById
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @param {string|number} id - The unique identifier of the IndexNowSubmission
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} IndexNowSubmission data with loading and error states
 * @returns {Object} returns.indexNowSubmission - IndexNowSubmission object or null
 * @returns {boolean} returns.indexNowSubmissionLoading - Loading state
 * @returns {Error} returns.indexNowSubmissionError - Error state
 * @returns {boolean} returns.indexNowSubmissionValidating - Revalidation state
 * @returns {boolean} returns.indexNowSubmissionEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function for manual revalidation
 */
export function useGetIndexNowSubmissionById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getIndexNowSubmissionById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    () => requests.getIndexNowSubmissionById(id, token, revalidate),
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cachedData = await loadFromIndexedDb(cacheKey);
        if (cachedData && (!data || !data.data?.indexNowSubmission)) {
          debugLog(
            'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionById',
            'Loading data from IndexedDB cache',
            {
              cacheKey,
              dataFound: !!cachedData,
              indexNowSubmissionId: id,
            }
          );
          mutate(cachedData, false);
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionById',
          'Failed to load from IndexedDB cache',
          {
            error: cacheError.message,
            cacheKey,
            indexNowSubmissionId: id,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, id, data]);

  // Save successful data to IndexedDB
  useEffect(() => {
    if (data && cacheKey) {
      saveToIndexedDb(cacheKey, data).catch((saveError) => {
        debugWarn(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionById',
          'Failed to save to IndexedDB cache',
          {
            error: saveError.message,
            cacheKey,
            indexNowSubmissionId: id,
          }
        );
      });
    }
  }, [data, cacheKey, id]);

  return useMemo(
    () => ({
      indexNowSubmission: data?.data?.indexNowSubmission || null,
      indexNowSubmissionLoading: isLoading,
      indexNowSubmissionError: error,
      indexNowSubmissionValidating: isValidating,
      indexNowSubmissionEmpty: !isLoading && !data?.data?.indexNowSubmission,
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );
}

/**
 * Hook for creating a new IndexNowSubmission with automatic cache invalidation.
 *
 * Features:
 * - IndexNowSubmission record creation with validation
 * - Automatic SWR cache invalidation
 * - IndexedDB cache cleanup
 * - Error handling and debugging
 * - Authentication support
 * - URL and entity validation
 *
 * @function useCreateIndexNowSubmission
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create a IndexNowSubmission
 * @returns {Promise<Object>} returns.result - Created IndexNowSubmission response
 * @throws {Error} When IndexNowSubmission data validation fails or API request encounters an error
 */
export function useCreateIndexNowSubmission(token = '') {
  const { mutate } = useSWRConfig();

  return async (indexNowSubmissionData) => {
    try {
      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useCreateIndexNowSubmission',
        'Creating IndexNowSubmission',
        {
          url: indexNowSubmissionData?.url,
          entityType: indexNowSubmissionData?.entityType,
          entityId: indexNowSubmissionData?.entityId,
          action: indexNowSubmissionData?.action,
          token: token ? '[REDACTED]' : 'none',
        }
      );

      const result = await requests.createIndexNowSubmission(indexNowSubmissionData, token);

      // Clear SWR cache with specific patterns
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('indexNowSubmission') || key.includes('getPaginatedIndexNowSubmissions'))
      );

      // Clear IndexedDB cache manually to prevent stale data
      const cachePatterns = ['indexNowSubmission', 'getPaginatedIndexNowSubmissions'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useCreateIndexNowSubmission',
        'IndexNowSubmission created successfully',
        {
          indexNowSubmissionId: result?.data?.indexNowSubmissionId,
          success: result?.success,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useCreateIndexNowSubmission',
        'Failed to create IndexNowSubmission',
        {
          error: error.message,
          url: indexNowSubmissionData?.url,
          entityType: indexNowSubmissionData?.entityType,
          entityId: indexNowSubmissionData?.entityId,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error; // Always pass through for UI handling
    }
  };
}

/**
 * Hook for updating an existing IndexNowSubmission with automatic cache invalidation.
 *
 * Features:
 * - IndexNowSubmission record updates with validation
 * - Partial update support
 * - Automatic SWR cache invalidation
 * - IndexedDB cache cleanup
 * - Error handling and debugging
 * - Authentication support
 *
 * @function useUpdateIndexNowSubmission
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update a IndexNowSubmission
 * @returns {Promise<Object>} returns.result - Updated IndexNowSubmission response
 * @throws {Error} When IndexNowSubmission data validation fails or API request encounters an error
 */
export function useUpdateIndexNowSubmission(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, indexNowSubmissionData) => {
    try {
      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useUpdateIndexNowSubmission',
        'Updating IndexNowSubmission',
        {
          indexNowSubmissionId: id,
          status: indexNowSubmissionData?.status,
          responseCode: indexNowSubmissionData?.responseCode,
          token: token ? '[REDACTED]' : 'none',
        }
      );

      const result = await requests.updateIndexNowSubmission(id, indexNowSubmissionData, token);

      // Clear SWR cache with specific patterns
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('indexNowSubmission') || key.includes('getPaginatedIndexNowSubmissions'))
      );

      // Clear IndexedDB cache manually to prevent stale data
      const cachePatterns = ['indexNowSubmission', 'getPaginatedIndexNowSubmissions'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useUpdateIndexNowSubmission',
        'IndexNowSubmission updated successfully',
        {
          indexNowSubmissionId: id,
          success: result?.success,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useUpdateIndexNowSubmission',
        'Failed to update IndexNowSubmission',
        {
          error: error.message,
          indexNowSubmissionId: id,
          status: indexNowSubmissionData?.status,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error; // Always pass through for UI handling
    }
  };
}

/**
 * Hook for deleting a IndexNowSubmission with automatic cache invalidation.
 *
 * Features:
 * - IndexNowSubmission record deletion with validation
 * - Automatic SWR cache invalidation
 * - IndexedDB cache cleanup
 * - Error handling and debugging
 * - Authentication support
 * - Cascade deletion support
 *
 * @function useDeleteIndexNowSubmission
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete a IndexNowSubmission
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When IndexNowSubmission ID is invalid or API request encounters an error
 */
export function useDeleteIndexNowSubmission(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useDeleteIndexNowSubmission',
        'Deleting IndexNowSubmission',
        {
          indexNowSubmissionId: id,
          token: token ? '[REDACTED]' : 'none',
        }
      );

      const result = await requests.deleteIndexNowSubmission(id, token);

      // Clear SWR cache with specific patterns
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('indexNowSubmission') || key.includes('getPaginatedIndexNowSubmissions'))
      );

      // Clear IndexedDB cache manually to prevent stale data
      const cachePatterns = ['indexNowSubmission', 'getPaginatedIndexNowSubmissions'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useDeleteIndexNowSubmission',
        'IndexNowSubmission deleted successfully',
        {
          indexNowSubmissionId: id,
          success: result?.success,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useDeleteIndexNowSubmission',
        'Failed to delete IndexNowSubmission',
        {
          error: error.message,
          indexNowSubmissionId: id,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error; // Always pass through for UI handling
    }
  };
}

/**
 * Combined hook that provides all IndexNowSubmission mutation functions.
 *
 * Features:
 * - Complete CRUD operations for IndexNowSubmissions
 * - Queue processing functionality
 * - Automatic cache management
 * - Error handling and debugging
 * - Authentication support
 *
 * @function useIndexNowSubmissionMutations
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createIndexNowSubmission - Function to create IndexNowSubmission
 * @returns {Function} returns.updateIndexNowSubmission - Function to update IndexNowSubmission
 * @returns {Function} returns.deleteIndexNowSubmission - Function to delete IndexNowSubmission
 * @returns {Function} returns.processIndexNowSubmission - Function to process IndexNowSubmission
 */
export function useIndexNowSubmissionMutations(token = '') {
  const createIndexNowSubmission = useCreateIndexNowSubmission(token);
  const updateIndexNowSubmission = useUpdateIndexNowSubmission(token);
  const deleteIndexNowSubmission = useDeleteIndexNowSubmission(token);
  const processIndexNowSubmission = useProcessIndexNowSubmission(token);

  return {
    createIndexNowSubmission,
    updateIndexNowSubmission,
    deleteIndexNowSubmission,
    processIndexNowSubmission,
  };
}

/**
 * Hook for processing IndexNow submissions manually.
 *
 * Features:
 * - Manual submission processing
 * - Automatic cache invalidation
 * - Error handling and debugging
 * - Event emission for cross-component coordination
 * - Authentication support
 * - IndexNow API integration
 *
 * @function useProcessIndexNowSubmission
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @example
 * const processSubmission = useProcessIndexNowSubmission(token);
 *
 * const handleProcess = async (submissionId) => {
 *   try {
 *     const result = await processSubmission(submissionId);
 *     console.log('Processed successfully?:', result);
 *   } catch (error) {
 *     console.error('Processing failed?:', error.message);
 *   }
 * };
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to process submission by ID
 * @throws {Error} When processing fails or submission not found
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - IndexNow integration docs
 */
export function useProcessIndexNowSubmission(token = '') {
  const { mutate } = useSWRConfig();

  return async (submissionId) => {
    try {
      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowSubmission',
        `Processing submission: ${submissionId}`
      );

      const result = await requests.processIndexNowSubmission(submissionId, token, true);

      // Invalidate relevant cache entries - both array-based and string-based keys
      const cacheInvalidated = mutate(
        (key) => {
          // Handle array-based SWR keys (like ['getIndexNowSubmissionById', id, revalidate])
          if (Array.isArray(key)) {
            const keyStr = String(key);
            if (
              keyStr.includes('getIndexNowSubmissionById') ||
              keyStr.includes('getPaginatedIndexNowSubmissions') ||
              key[0] === 'getIndexNowSubmissionById' ||
              key[0] === 'getPaginatedIndexNowSubmissions'
            ) {
              debugLog(
                'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowSubmission.invalidateCache',
                `Invalidating array-based cache key: ${keyStr}`
              );
              return true;
            }
          }
          // Handle string-based keys (like '/api/index-now-submission/...')
          if (typeof key === 'string' && key.includes('/api/index-now-submission')) {
            debugLog(
              'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowSubmission.invalidateCache',
              `Invalidating string-based cache key: ${key}`
            );
            return true;
          }
          return false;
        },
        undefined,
        { revalidate: true }
      );

      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowSubmission.cacheInvalidation',
        `Cache invalidation completed. Keys invalidated: ${cacheInvalidated ? 'Yes' : 'No'}`
      );

      // Force invalidation of specific known patterns
      try {
        // Invalidate all possible pagination cache keys
        mutate(
          (key) => Array.isArray(key) && key[0] === 'getPaginatedIndexNowSubmissions',
          undefined,
          { revalidate: true }
        );

        // Invalidate the specific submission being processed
        mutate(
          (key) =>
            Array.isArray(key) && key[0] === 'getIndexNowSubmissionById' && key[1] === submissionId,
          undefined,
          { revalidate: true }
        );

        debugLog(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowSubmission.forceInvalidation',
          `Forced cache invalidation completed for submission: ${submissionId}`
        );
      } catch (invalidationError) {
        debugError(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowSubmission.invalidationError',
          invalidationError
        );
      }

      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowSubmission.success',
        `Successfully processed submission: ${submissionId}`
      );

      // Emit cache invalidation events for cross-component coordination
      emitIndexNowProcess(submissionId, { success: true, result });
      emitIndexNowListRefresh({ source: 'process-submission', submissionId });

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowSubmission',
        error
      );

      // Emit events even for errors to ensure UI consistency
      emitIndexNowProcess(submissionId, { success: false, error: error.message });
      emitIndexNowListRefresh({ source: 'process-submission', submissionId, error: true });

      throw error;
    }
  };
}

/**
 * SWR hook for IndexNow submission statistics with IndexedDB caching.
 *
 * Features:
 * - Statistics data fetching with caching
 * - IndexedDB fallback for offline support
 * - Configurable refresh intervals
 * - Error handling with fallback strategies
 * - Authentication support
 * - Automatic retry mechanisms
 *
 * @function useGetIndexNowSubmissionStats
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @example
 * const { stats, loading, error, refresh } = useGetIndexNowSubmissionStats(accessToken);
 *
 * @param {string} accessToken - JWT access token for authentication
 * @param {number} [refreshInterval=300] - Cache refresh interval in seconds (default: 5 minutes)
 * @returns {Object} Hook result object
 * @returns {Object|null} returns.stats - Statistics data object
 * @returns {boolean} returns.loading - Loading state
 * @returns {Error|null} returns.error - Error object if request failed
 * @returns {boolean} returns.isEmpty - True if no statistics data
 * @returns {Function} returns.mutate - SWR mutate function for manual refresh
 * @returns {Function} returns.refresh - Convenience function for refreshing stats
 * @throws {Error} When accessToken is missing or invalid
 * @throws {Error} When stats API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Statistics} - IndexNow Statistics documentation
 * @see {@link https://swr.vercel.app/docs/getting-started} - SWR documentation
 */
export function useGetIndexNowSubmissionStats(accessToken, refreshInterval = 300) {
  const { swrKey, cacheKey } = useMemo(() => {
    if (!accessToken) return { swrKey: null, cacheKey: null };
    const key = ['getIndexNowSubmissionStats', refreshInterval];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [accessToken, refreshInterval]);

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        debugLog(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionStats',
          'Fetching statistics from IndexNow API'
        );

        const response = await requests.getIndexNowSubmissionStats(accessToken);

        // Cache the data in IndexedDB
        if (cacheKey) {
          saveToIndexedDb(cacheKey, response).catch((saveError) => {
            debugWarn(
              'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionStats.indexedDbSave',
              `Failed to save statistics to IndexedDB: ${saveError.message}`
            );
          });
        }

        debugLog(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionStats.success',
          `Retrieved statistics: ${JSON.stringify(response, null, 2)}`
        );

        return response;
      } catch (requestError) {
        // Try to load from IndexedDB as fallback
        if (cacheKey) {
          try {
            const cachedData = await loadFromIndexedDb(cacheKey);

            if (cachedData) {
              debugWarn(
                'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionStats.fallback',
                'Using cached statistics from IndexedDB due to request failure'
              );
              return cachedData;
            }
          } catch (cacheError) {
            debugWarn(
              'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionStats.cacheFallback',
              `IndexedDB fallback failed: ${cacheError.message}`
            );
          }
        }

        debugError(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useGetIndexNowSubmissionStats.error',
          `Failed to fetch statistics: ${requestError.message}`
        );
        throw requestError;
      }
    },
    {
      ...swrOptions,
      refreshInterval: refreshInterval * 1000, // Convert seconds to milliseconds
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      stats: data?.data || null,
      loading: isLoading,
      error: error || null,
      isEmpty: !isLoading && !data?.data,
      mutate,
      refresh: () => mutate(),
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for processing the entire IndexNow submission queue.
 *
 * Features:
 * - Entire queue processing
 * - Automatic cache invalidation
 * - Error handling and debugging
 * - Event emission for cross-component coordination
 * - Authentication support
 * - Bulk processing capabilities
 *
 * @function useProcessIndexNowQueue
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @example
 * const processQueue = useProcessIndexNowQueue(token);
 *
 * const handleProcessQueue = async () => {
 *   try {
 *     const result = await processQueue();
 *     console.log('Queue processed?:', result);
 *   } catch (error) {
 *     console.error('Queue processing failed?:', error.message);
 *   }
 * };
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to process entire queue
 * @throws {Error} When processing fails or authentication required
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - IndexNow integration docs
 */
export function useProcessIndexNowQueue(token = '') {
  const { mutate } = useSWRConfig();

  return async () => {
    try {
      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowQueue',
        'Processing entire queue'
      );

      const result = await requests.processIndexNowQueue(token, true);

      // Invalidate relevant cache entries
      const cacheInvalidated = mutate((key) => {
        if (Array.isArray(key)) {
          const keyStr = String(key);
          if (
            keyStr.includes('getPaginatedIndexNowSubmissions') ||
            keyStr.includes('getIndexNowSubmissionStats') ||
            key[0] === 'getPaginatedIndexNowSubmissions' ||
            key[0] === 'getIndexNowSubmissionStats'
          ) {
            debugLog(
              'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowQueue.invalidateCache',
              `Invalidating cache key: ${keyStr}`
            );
            return true;
          }
        }
        return false;
      });

      if (cacheInvalidated) {
        debugLog(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowQueue.cacheInvalidation',
          'Cache invalidation completed successfully'
        );
      }

      // Emit cache refresh events
      emitIndexNowListRefresh();
      emitIndexNowProcess();

      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowQueue.success',
        'Queue processing completed successfully',
        result
      );

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.IndexNowSubmission.Hooks.useProcessIndexNowQueue', error);
      throw error;
    }
  };
}

/**
 * SWR hook for clearing all pending IndexNow submissions.
 *
 * Features:
 * - Pending queue clearing
 * - Automatic cache invalidation
 * - Error handling and debugging
 * - Event emission for cross-component coordination
 * - Authentication support
 * - Bulk deletion capabilities
 *
 * @function useClearIndexNowQueue
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @example
 * const clearQueue = useClearIndexNowQueue(token);
 *
 * const handleClearQueue = async () => {
 *   try {
 *     const result = await clearQueue();
 *     console.log('Queue cleared?:', result);
 *   } catch (error) {
 *     console.error('Queue clearing failed?:', error.message);
 *   }
 * };
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to clear pending queue
 * @throws {Error} When clearing fails or authentication required
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - IndexNow integration docs
 */
export function useClearIndexNowQueue(token = '') {
  const { mutate } = useSWRConfig();

  return async () => {
    try {
      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useClearIndexNowQueue',
        'Clearing pending queue'
      );

      const result = await requests.clearIndexNowQueue(token, true);

      // Invalidate relevant cache entries
      const cacheInvalidated = mutate((key) => {
        if (Array.isArray(key)) {
          const keyStr = String(key);
          if (
            keyStr.includes('getPaginatedIndexNowSubmissions') ||
            keyStr.includes('getIndexNowSubmissionStats') ||
            key[0] === 'getPaginatedIndexNowSubmissions' ||
            key[0] === 'getIndexNowSubmissionStats'
          ) {
            debugLog(
              'CityArtWalks.Actions.IndexNowSubmission.Hooks.useClearIndexNowQueue.invalidateCache',
              `Invalidating cache key: ${keyStr}`
            );
            return true;
          }
        }
        return false;
      });

      if (cacheInvalidated) {
        debugLog(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useClearIndexNowQueue.cacheInvalidation',
          'Cache invalidation completed successfully'
        );
      }

      // Emit cache refresh events
      emitIndexNowListRefresh();

      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useClearIndexNowQueue.success',
        'Queue clearing completed successfully',
        result
      );

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.IndexNowSubmission.Hooks.useClearIndexNowQueue', error);
      throw error;
    }
  };
}

/**
 * SWR hook for retrying all failed IndexNow submissions.
 *
 * Features:
 * - Failed submission retry functionality
 * - Automatic cache invalidation
 * - Error handling and debugging
 * - Event emission for cross-component coordination
 * - Authentication support
 * - Bulk retry capabilities
 *
 * @function useRetryFailedIndexNowSubmissions
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Hooks
 *
 * @example
 * const retryFailed = useRetryFailedIndexNowSubmissions(token);
 *
 * const handleRetryFailed = async () => {
 *   try {
 *     const result = await retryFailed();
 *     console.log('Failed submissions retried?:', result);
 *   } catch (error) {
 *     console.error('Retry failed?:', error.message);
 *   }
 * };
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to retry failed submissions
 * @throws {Error} When retry fails or authentication required
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - IndexNow integration docs
 */
export function useRetryFailedIndexNowSubmissions(token = '') {
  const { mutate } = useSWRConfig();

  return async () => {
    try {
      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useRetryFailedIndexNowSubmissions',
        'Retrying failed submissions'
      );

      const result = await requests.retryFailedIndexNowSubmissions(token, true);

      // Invalidate relevant cache entries
      const cacheInvalidated = mutate((key) => {
        if (Array.isArray(key)) {
          const keyStr = String(key);
          if (
            keyStr.includes('getPaginatedIndexNowSubmissions') ||
            keyStr.includes('getIndexNowSubmissionStats') ||
            key[0] === 'getPaginatedIndexNowSubmissions' ||
            key[0] === 'getIndexNowSubmissionStats'
          ) {
            debugLog(
              'CityArtWalks.Actions.IndexNowSubmission.Hooks.useRetryFailedIndexNowSubmissions.invalidateCache',
              `Invalidating cache key: ${keyStr}`
            );
            return true;
          }
        }
        return false;
      });

      if (cacheInvalidated) {
        debugLog(
          'CityArtWalks.Actions.IndexNowSubmission.Hooks.useRetryFailedIndexNowSubmissions.cacheInvalidation',
          'Cache invalidation completed successfully'
        );
      }

      // Emit cache refresh events
      emitIndexNowListRefresh();
      emitIndexNowProcess();

      debugLog(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useRetryFailedIndexNowSubmissions.success',
        'Retry operation completed successfully',
        result
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.IndexNowSubmission.Hooks.useRetryFailedIndexNowSubmissions',
        error
      );
      throw error;
    }
  };
}
