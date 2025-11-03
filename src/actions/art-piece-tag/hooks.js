/**
 * React hooks for ArtPieceTag operations using SWR
 *
 * This module provides React hooks for art piece tag CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states.
 *
 * Art piece tags are simple name/description entities used to categorize art pieces.
 * They do not have slug fields and use basic integer ID identification.
 *
 * @namespace CityArtWalks.Actions.ArtPieceTag.Hooks
 * @fileoverview React hooks for art piece tag data operations
 * @author Jaimie Garner
 * @version 3.0.0
 *
 * @requires useSWR - SWR library for data fetching
 * @requires React - React hooks (useMemo, useEffect)
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 * @requires CityArtWalks.Lib.IndexedDB - IndexedDB caching utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * SWR hook for paginated art piece tags with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useGetPaginatedArtPieceTags
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for name/description fields
 * @param {string} [filters.active=''] - Active status filter (true/false)
 * @param {string} [filters.createdBy=''] - Creator user ID filter
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated art piece tags result with IndexedDB caching
 * @returns {Array} returns.artPieceTags - Array of art piece tag objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.artPieceTagsLoading - Loading state
 * @returns {Error} returns.artPieceTagsError - Error state
 * @returns {boolean} returns.artPieceTagsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedArtPieceTags(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', active = '', createdBy = '' } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedArtPieceTags',
      search,
      active,
      createdBy,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, active, createdBy, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getPaginatedArtPieceTags(
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
        debugWarn(`[IndexedDB] Error loading cache for ${cacheKey}:`, cacheError);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      artPieceTags: data?.data?.artPieceTags || [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      artPieceTagsLoading: isLoading,
      artPieceTagsError: error,
      artPieceTagsEmpty:
        !isLoading && (!data?.data?.artPieceTags || data?.data?.artPieceTags.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single art piece tag by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useGetArtPieceTagById
 * @param {string|number} id - The unique identifier of the art piece tag
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Art piece tag data with loading and error states
 * @returns {Object} returns.artPieceTag - Art piece tag object or null
 * @returns {boolean} returns.artPieceTagLoading - Loading state
 * @returns {Error} returns.artPieceTagError - Error state
 * @returns {boolean} returns.artPieceTagValidating - Revalidation state
 * @returns {boolean} returns.artPieceTagEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetArtPieceTagById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getArtPieceTagById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getArtPieceTagById(id, token, revalidate);
      if (response && cacheKey) {
        await saveToIndexedDb(cacheKey, response);
        debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
      }
      return response;
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
        debugWarn(`[IndexedDB] Error loading cache for ${cacheKey}:`, cacheError);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  return useMemo(
    () => ({
      artPieceTag: data?.data || null,
      artPieceTagLoading: isLoading,
      artPieceTagError: error,
      artPieceTagValidating: isValidating,
      artPieceTagEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook for creating a new art piece tag with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useCreateArtPieceTag
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create an art piece tag
 * @returns {Promise<Object>} returns.result - Created art piece tag response
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCreateArtPieceTag(token = '') {
  const { mutate } = useSWRConfig();

  return async (artPieceTagData, revalidate = 600) => {
    try {
      const result = await requests.createArtPieceTag(artPieceTagData, token, revalidate);

      // Clear SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceTag') || key.includes('getPaginatedArtPieceTags'))
      );

      // Clear IndexedDB cache
      try {
        const cacheKeysToDelete = ['getPaginatedArtPieceTags'];
        for (const keyPrefix of cacheKeysToDelete) {
          const cacheKey = buildCacheKeyFromSWRKey([keyPrefix]);
          await saveToIndexedDb(cacheKey, null);
          debugLog(`[IndexedDB] Cleared cache for ${cacheKey}`);
        }
      } catch (cacheError) {
        debugWarn('[IndexedDB] Error clearing cache after create?:', cacheError);
      }

      return result;
    } catch (error) {
      // Pass through validation errors for UI display
      if (error.name === 'ZodError') {
        throw error;
      }
      throw new Error(`Failed to create art piece tag: ${error.message}`);
    }
  };
}

/**
 * Hook for updating an existing art piece tag with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useUpdateArtPieceTag
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update an art piece tag
 * @returns {Promise<Object>} returns.result - Updated art piece tag response
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdateArtPieceTag(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, artPieceTagData, revalidate = 600) => {
    try {
      const result = await requests.updateArtPieceTag(id, artPieceTagData, token, revalidate);

      // Clear SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceTag') ||
            key.includes('getPaginatedArtPieceTags') ||
            (key.includes('getArtPieceTagById') && key.includes(id)))
      );

      // Clear IndexedDB cache
      try {
        const cacheKeysToDelete = ['getPaginatedArtPieceTags', `getArtPieceTagById_${id}`];
        for (const keyPrefix of cacheKeysToDelete) {
          const cacheKey = buildCacheKeyFromSWRKey([keyPrefix]);
          await saveToIndexedDb(cacheKey, null);
          debugLog(`[IndexedDB] Cleared cache for ${cacheKey}`);
        }
      } catch (cacheError) {
        debugWarn('[IndexedDB] Error clearing cache after update?:', cacheError);
      }

      return result;
    } catch (error) {
      // Pass through validation errors for UI display
      if (error.name === 'ZodError') {
        throw error;
      }
      throw new Error(`Failed to update art piece tag: ${error.message}`);
    }
  };
}

/**
 * Hook for deleting an art piece tag with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useDeleteArtPieceTag
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete an art piece tag
 * @returns {Promise<Object>} returns.result - Deletion response
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeleteArtPieceTag(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, revalidate = 600) => {
    try {
      const result = await requests.deleteArtPieceTag(id, token, revalidate);

      // Clear SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceTag') ||
            key.includes('getPaginatedArtPieceTags') ||
            (key.includes('getArtPieceTagById') && key.includes(id)))
      );

      // Clear IndexedDB cache
      try {
        const cacheKeysToDelete = ['getPaginatedArtPieceTags', `getArtPieceTagById_${id}`];
        for (const keyPrefix of cacheKeysToDelete) {
          const cacheKey = buildCacheKeyFromSWRKey([keyPrefix]);
          await saveToIndexedDb(cacheKey, null);
          debugLog(`[IndexedDB] Cleared cache for ${cacheKey}`);
        }
      } catch (cacheError) {
        debugWarn('[IndexedDB] Error clearing cache after delete?:', cacheError);
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to delete art piece tag: ${error.message}`);
    }
  };
}

/**
 * Combined hook that provides all art piece tag mutation functions
 *
 * @memberof CityArtWalks.Actions.ArtPieceTag.Hooks
 * @function useArtPieceTagMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createArtPieceTag - Function to create art piece tag
 * @returns {Function} returns.updateArtPieceTag - Function to update art piece tag
 * @returns {Function} returns.deleteArtPieceTag - Function to delete art piece tag
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useArtPieceTagMutations(token = '') {
  const createArtPieceTag = useCreateArtPieceTag(token);
  const updateArtPieceTag = useUpdateArtPieceTag(token);
  const deleteArtPieceTag = useDeleteArtPieceTag(token);

  return {
    createArtPieceTag,
    updateArtPieceTag,
    deleteArtPieceTag,
  };
}
