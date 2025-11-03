/**
 * React hooks for ArtPieceQueue operations using SWR
 *
 * This module provides React hooks for art piece queue CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states.
 *
 * @namespace CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @fileoverview React hooks for art piece queue data operations
 * @author Generated
 * @version 1.1.0
 *
 * @requires useSWR - SWR library for data fetching
 * @requires React - React hooks (useMemo, useEffect)
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 * @requires CityArtWalks.Lib.IndexedDB - IndexedDB caching utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue-Model} - ArtPieceQueue model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugError } from 'src/lib/debug';
import {
  saveToIndexedDb,
  loadFromIndexedDb,
  deleteFromIndexedDb,
  buildCacheKeyFromSWRKey,
} from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
  dedupingInterval: 30000,
};

/**
 * SWR hook for paginated art piece queues with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useGetPaginatedArtPieceQueues
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for title/artist/address fields
 * @param {string} [filters.status=''] - Status filter (PENDING, PROCESSING, REVIEWING, APPROVED, REJECTED, PUBLISHED, ERROR)
 * @param {string} [filters.harvestBatchId=''] - Harvest batch ID filter
 * @param {string} [filters.createdBy=''] - Creator user ID filter
 * @param {string} [filters.updatedBy=''] - Updater user ID filter
 * @param {string} [filters.artistName=''] - Artist name filter
 * @param {string} [filters.city=''] - City filter
 * @param {string} [filters.state=''] - State filter
 * @param {string} [filters.country=''] - Country filter
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated art piece queues result with IndexedDB caching
 * @returns {Array} returns.artPieceQueues - Array of art piece queue objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.artPieceQueuesLoading - Loading state
 * @returns {Error} returns.artPieceQueuesError - Error state
 * @returns {boolean} returns.artPieceQueuesEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedArtPieceQueues(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const {
    search = '',
    status = '',
    harvestBatchId = '',
    createdBy = '',
    updatedBy = '',
    artistName = '',
    city = '',
    state = '',
    country = '',
  } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedArtPieceQueues',
      search,
      status,
      harvestBatchId,
      createdBy,
      updatedBy,
      artistName,
      city,
      state,
      country,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [
    search,
    status,
    harvestBatchId,
    createdBy,
    updatedBy,
    artistName,
    city,
    state,
    country,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedArtPieceQueues(
          page,
          rowsPerPage,
          filters,
          token,
          revalidate
        );

        // Save to IndexedDB cache
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetPaginatedArtPieceQueues',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }

        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetPaginatedArtPieceQueues',
          'Failed to fetch paginated art piece queues',
          {
            error: err.message,
            filters,
            page,
            rowsPerPage,
            token: token ? '[REDACTED]' : 'none',
          }
        );
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
          debugLog(
            'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetPaginatedArtPieceQueues',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetPaginatedArtPieceQueues',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const result = {
      artPieceQueues: Array.isArray(data?.data?.artPieceQueues) ? data.data.artPieceQueues : [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      artPieceQueuesLoading: isLoading,
      artPieceQueuesError: error,
      artPieceQueuesEmpty:
        !isLoading &&
        (!Array.isArray(data?.data?.artPieceQueues) || data.data.artPieceQueues.length === 0),
      mutate,
    };

    return result;
  }, [data, isLoading, error, mutate]);
}

/**
 * SWR hook for fetching a single art piece queue by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useGetArtPieceQueueById
 * @param {string|number} id - The unique identifier of the art piece queue
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Art piece queue data with loading and error states
 * @returns {Object} returns.artPieceQueue - Art piece queue object or null
 * @returns {boolean} returns.artPieceQueueLoading - Loading state
 * @returns {Error} returns.artPieceQueueError - Error state
 * @returns {boolean} returns.artPieceQueueValidating - Revalidation state
 * @returns {boolean} returns.artPieceQueueEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetArtPieceQueueById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getArtPieceQueueById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getArtPieceQueueById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetArtPieceQueueById',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetArtPieceQueueById',
          'Failed to fetch art piece queue by ID',
          {
            error: err.message,
            id,
            token: token ? '[REDACTED]' : 'none',
          }
        );
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
          debugLog(
            'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetArtPieceQueueById',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetArtPieceQueueById',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            id,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, id]);

  return useMemo(
    () => ({
      artPieceQueue: data?.data?.artPieceQueue || null,
      artPieceQueueLoading: isLoading,
      artPieceQueueError: error,
      artPieceQueueValidating: isValidating,
      artPieceQueueEmpty: !isLoading && !data?.data?.artPieceQueue,
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );
}

/**
 * TODO: Implement hook for creating a new art piece queue with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useCreateArtPieceQueue
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create an art piece queue
 * @returns {Promise<Object>} returns.result - Created art piece queue response
 * @throws {Error} When queue data validation fails or API request encounters an error
 */
export function useCreateArtPieceQueue(token = '') {
  const { mutate } = useSWRConfig();

  return async (artPieceQueueData) => {
    try {
      const result = await requests.createArtPieceQueue(artPieceQueueData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceQueue') || key.includes('getPaginatedArtPieceQueues'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['artPieceQueue', 'getPaginatedArtPieceQueues'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPieceQueue.Hooks.useCreateArtPieceQueue',
        'Failed to create art piece queue',
        {
          error: error.message,
          artPieceQueueData: artPieceQueueData
            ? artPieceQueueData instanceof FormData
              ? 'FormData'
              : 'provided'
            : 'missing',
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for updating an existing art piece queue with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useUpdateArtPieceQueue
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update an art piece queue
 * @returns {Promise<Object>} returns.result - Updated art piece queue response
 * @throws {Error} When art piece queue data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdateArtPieceQueue(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, artPieceQueueData) => {
    try {
      debugLog(
        'CityArtWalks.Actions.ArtPieceQueue.Hooks.useUpdateArtPieceQueue',
        `Calling updateArtPieceQueue with token: ${token ? '[TOKEN_PROVIDED]' : '[NO_TOKEN]'}, id: ${id}`
      );
      const result = await requests.updateArtPieceQueue(id, artPieceQueueData, token);

      // Invalidate SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceQueue') ||
            key.includes('getPaginatedArtPieceQueues') ||
            (key.includes('getArtPieceQueueById') && key.includes(id)))
      );

      // Clear IndexedDB cache for common revalidate times
      const commonRevalidateTimes = [600, 300, 1800]; // 10min, 5min, 30min
      await Promise.all(
        commonRevalidateTimes.flatMap((revalidateTime) => [
          // Clear getPaginatedArtPieceQueues cache with different filter combinations
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey([
              'getPaginatedArtPieceQueues',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              1,
              10,
              revalidateTime,
            ])
          ),
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey([
              'getPaginatedArtPieceQueues',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              1,
              25,
              revalidateTime,
            ])
          ),
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey([
              'getPaginatedArtPieceQueues',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              1,
              50,
              revalidateTime,
            ])
          ),
          // Clear specific item cache
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey(['getArtPieceQueueById', String(id), revalidateTime])
          ),
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey(['getArtPieceQueueById', Number(id), revalidateTime])
          ),
        ])
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPieceQueue.Hooks.useUpdateArtPieceQueue',
        'Failed to update art piece queue',
        {
          error: error?.message || 'Unknown error',
          errorName: error?.name || 'Unknown',
          errorCode: error?.code || 'Unknown',
          errorDetails: error?.toString() || 'No error details',
          artPieceQueueId: id,
          artPieceQueueData: artPieceQueueData
            ? artPieceQueueData instanceof FormData
              ? 'FormData'
              : 'provided'
            : 'missing',
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for deleting an art piece queue with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useDeleteArtPieceQueue
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete an art piece queue
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When art piece queue ID is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeleteArtPieceQueue(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteArtPieceQueue(id, token);

      // Invalidate SWR cache - comprehensive invalidation and revalidation
      await mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceQueue') ||
            key.includes('getPaginatedArtPieceQueues') ||
            (key.includes('getArtPieceQueueById') && key.includes(id))),
        undefined,
        { revalidate: true }
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['artPieceQueue', 'getPaginatedArtPieceQueues'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPieceQueue.Hooks.useDeleteArtPieceQueue',
        'Failed to delete art piece queue',
        {
          error: error.message,
          artPieceQueueId: id,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Combined hook that provides all art piece queue mutation functions
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useArtPieceQueueMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createArtPieceQueue - Function to create art piece queue
 * @returns {Function} returns.updateArtPieceQueue - Function to update art piece queue
 * @returns {Function} returns.deleteArtPieceQueue - Function to delete art piece queue
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useArtPieceQueueMutations(token = '') {
  const createArtPieceQueue = useCreateArtPieceQueue(token);
  const updateArtPieceQueue = useUpdateArtPieceQueue(token);
  const deleteArtPieceQueue = useDeleteArtPieceQueue(token);

  return {
    createArtPieceQueue,
    updateArtPieceQueue,
    deleteArtPieceQueue,
  };
}

/**
 * Hook for fetching HTML content for AI processing
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useFetchHtmlForExtraction
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to fetch HTML content
 * @throws {Error} When API request fails
 *
 * TODO: Review - Custom hook - Verify necessity and standards compliance
 */
export function useFetchHtmlForExtraction(token = '') {
  const { mutate: globalMutate } = useSWRConfig();

  return async (sourceUrl, queueId) => {
    try {
      const result = await requests.fetchHtmlForExtraction(sourceUrl, queueId, token);

      debugLog(
        'CityArtWalks.Actions.ArtPieceQueue.Hooks.useFetchHtmlForExtraction',
        `Invalidating cache for queueId: ${queueId} (type: ${typeof queueId})`
      );

      // Convert queueId to both string and number to handle type mismatches
      const queueIdStr = String(queueId);
      const queueIdNum = Number(queueId);

      // Invalidate both SWR cache and IndexedDB cache
      // Use a broader pattern to catch all variations of the cache key
      await globalMutate(
        (key) => {
          if (!Array.isArray(key) || key[0] !== 'getArtPieceQueueById') {
            return false;
          }
          // Check for both string and number versions of the ID
          const keyId = key[1];
          const match = keyId === queueId || keyId === queueIdStr || keyId === queueIdNum;
          if (match) {
            debugLog(
              'CityArtWalks.Actions.ArtPieceQueue.Hooks.useFetchHtmlForExtraction',
              `Found matching cache key: ${JSON.stringify(key)}`
            );
          }
          return match;
        },
        undefined,
        { revalidate: true }
      );

      // Clear IndexedDB cache for common revalidate times
      const commonRevalidateTimes = [600, 300, 1800]; // 10min, 5min, 30min
      await Promise.all(
        commonRevalidateTimes.flatMap((revalidateTime) => [
          // Clear cache for both string and number versions of the ID
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey(['getArtPieceQueueById', queueIdStr, revalidateTime])
          ),
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey(['getArtPieceQueueById', queueIdNum, revalidateTime])
          ),
        ])
      );

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.ArtPieceQueue.Hooks.useFetchHtmlForExtraction', error);
      throw error;
    }
  };
}

/**
 * Hook for extracting data from HTML using AI
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useExtractDataFromHtml
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to extract data from HTML
 * @throws {Error} When API request fails
 *
 * TODO: Review - Custom hook - Verify necessity and standards compliance
 */
export function useExtractDataFromHtml(token = '') {
  const { mutate: globalMutate } = useSWRConfig();

  return async (queueId, htmlFilePath) => {
    try {
      const result = await requests.extractDataFromHtml(queueId, htmlFilePath, token);

      debugLog(
        'CityArtWalks.Actions.ArtPieceQueue.Hooks.useExtractDataFromHtml',
        `Invalidating cache for queueId: ${queueId} (type: ${typeof queueId})`
      );

      // Invalidate both SWR cache and IndexedDB cache
      // Use a broader pattern to catch all variations of the cache key
      // Convert queueId to both string and number to handle type mismatches
      const queueIdStr = String(queueId);
      const queueIdNum = Number(queueId);

      await globalMutate(
        (key) => {
          if (!Array.isArray(key) || key[0] !== 'getArtPieceQueueById') {
            return false;
          }
          // Check for both string and number versions of the ID
          const keyId = key[1];
          const match = keyId === queueId || keyId === queueIdStr || keyId === queueIdNum;
          if (match) {
            debugLog(
              'CityArtWalks.Actions.ArtPieceQueue.Hooks.useExtractDataFromHtml',
              `Found matching cache key: ${JSON.stringify(key)}`
            );
          }
          return match;
        },
        undefined,
        { revalidate: true }
      );

      // Clear IndexedDB cache for common revalidate times
      const commonRevalidateTimes = [600, 300, 1800]; // 10min, 5min, 30min
      await Promise.all(
        commonRevalidateTimes.flatMap((revalidateTime) => [
          // Clear cache for both string and number versions of the ID
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey(['getArtPieceQueueById', queueIdStr, revalidateTime])
          ),
          deleteFromIndexedDb(
            buildCacheKeyFromSWRKey(['getArtPieceQueueById', queueIdNum, revalidateTime])
          ),
        ])
      );

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.ArtPieceQueue.Hooks.useExtractDataFromHtml', error);
      throw error;
    }
  };
}

/**
 * SWR hook for art piece queue statistics with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Hooks
 * @function useGetArtPieceQueueStats
 * @param {string} [token=''] - Authorization token
 * @returns {Object} SWR response with stats data, loading state, error, and mutate function
 * @throws {Error} When stats data validation fails or API request encounters an error
 *
 * @example
 * const { stats, statsLoading, statsError, mutate } = useGetArtPieceQueueStats(token);
 * if (statsLoading) return <div>Loading stats...</div>;
 * if (statsError) return <div>Error: {statsError.message}</div>;
 * return <div>Total items: {stats.totalItems}</div>;
 */
export function useGetArtPieceQueueStats(token = '') {
  const revalidateTime = useMemo(() => Math.floor(Date.now() / 60000), []); // Revalidate every minute

  const swrKey = useMemo(
    () => (token ? ['getArtPieceQueueStats', token, revalidateTime] : null),
    [token, revalidateTime]
  );

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(
    swrKey,
    async () => {
      debugLog(
        'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetArtPieceQueueStats',
        'Fetching stats via SWR'
      );

      // Try IndexedDB first
      const cacheKey = buildCacheKeyFromSWRKey(swrKey);
      const cachedData = await loadFromIndexedDb(cacheKey);

      if (cachedData) {
        debugLog(
          'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetArtPieceQueueStats',
          'Returning cached stats data'
        );
        return cachedData;
      }

      // Fetch from API
      const result = await requests.getArtPieceQueueStats(token);

      // Cache the result
      if (result?.data) {
        await saveToIndexedDb(cacheKey, result);
      }

      return result;
    },
    {
      ...swrOptions,
      refreshInterval: 60000, // Refresh every minute for real-time stats
    }
  );

  // Update cache when data changes
  useEffect(() => {
    if (response?.data && swrKey) {
      const cacheKey = buildCacheKeyFromSWRKey(swrKey);
      saveToIndexedDb(cacheKey, response).catch((cacheError) => {
        debugError(
          'CityArtWalks.Actions.ArtPieceQueue.Hooks.useGetArtPieceQueueStats',
          'Cache save error?:',
          cacheError
        );
      });
    }
  }, [response, swrKey]);

  return {
    stats: response?.data || null,
    statsLoading: isLoading,
    statsError: error,
    mutate,
  };
}
