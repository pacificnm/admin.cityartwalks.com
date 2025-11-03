/**
 * React hooks for ArtPieceType operations using SWR
 *
 * This module provides React hooks for art piece type CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states.
 *
 * Art piece types represent categories/classifications of art pieces such as "sculpture",
 * "mural", "installation", etc. Each type has a unique name and can be associated with
 * multiple art pieces.
 *
 * @namespace CityArtWalks.Actions.ArtPieceType.Hooks
 * @fileoverview React hooks for art piece type data operations
 * @author Jaimie Garner
 * @version 2.3.0
 *
 * @requires useSWR - SWR library for data fetching and caching
 * @requires useSWRConfig - SWR configuration for cache management
 * @requires React - React hooks (useMemo, useEffect)
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 * @requires CityArtWalks.Lib.IndexedDB - IndexedDB caching utilities
 * @requires requests - ArtPieceType requests functions
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Type-Model} - ArtPieceType model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * SWR hook for paginated art piece types with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useGetPaginatedArtPieceTypes
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for name/description fields
 * @param {string} [filters.status=''] - Status filter (ACTIVE, DELETED, etc.)
 * @param {string} [filters.createdBy=''] - Creator user ID filter
 * @param {string} [filters.featured=''] - Featured filter
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated art piece types result with IndexedDB caching
 * @returns {Array} returns.artPieceTypes - Array of art piece type objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.artPieceTypesLoading - Loading state
 * @returns {Error} returns.artPieceTypesError - Error state
 * @returns {boolean} returns.artPieceTypesEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @throws {Error} When API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedArtPieceTypes(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', status = '', createdBy = '', featured = '' } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedArtPieceTypes',
      search,
      status,
      createdBy,
      featured,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, status, createdBy, featured, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedArtPieceTypes(
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
        debugError(
          'CityArtWalks.Actions.ArtPieceType.Hooks.useGetPaginatedArtPieceTypes',
          'Failed to fetch paginated art piece types',
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtPieceType.Hooks.useGetPaginatedArtPieceTypes',
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

  return useMemo(
    () => ({
      artPieceTypes: data?.data?.artPieceTypes || [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      artPieceTypesLoading: isLoading,
      artPieceTypesError: error,
      artPieceTypesEmpty:
        !isLoading && (!data?.data?.artPieceTypes || data?.data?.artPieceTypes.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single art piece type by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useGetArtPieceTypeById
 * @param {string|number} id - The unique identifier of the art piece type
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Art piece type data with loading and error states
 * @returns {Object} returns.artPieceType - Art piece type object or null
 * @returns {boolean} returns.artPieceTypeLoading - Loading state
 * @returns {Error} returns.artPieceTypeError - Error state
 * @returns {boolean} returns.artPieceTypeValidating - Revalidation state
 * @returns {boolean} returns.artPieceTypeEmpty - Empty state
 * @throws {Error} When API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetArtPieceTypeById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getArtPieceTypeById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getArtPieceTypeById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtPieceType.Hooks.useGetArtPieceTypeById',
          'Failed to fetch art piece type by ID',
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtPieceType.Hooks.useGetArtPieceTypeById',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            id,
          }
        );
      }
    })();
  }, [cacheKey, id, mutate, revalidateMs]);

  return useMemo(
    () => ({
      artPieceType: data?.data || null,
      artPieceTypeLoading: isLoading,
      artPieceTypeError: error,
      artPieceTypeValidating: isValidating,
      artPieceTypeEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook for creating a new art piece type with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useCreateArtPieceType
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create an art piece type
 * @returns {Promise<Object>} returns.result - Created art piece type response
 * @throws {Error} When art piece type data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCreateArtPieceType(token = '') {
  const { mutate } = useSWRConfig();

  return async (artPieceTypeData) => {
    try {
      const result = await requests.createArtPieceType(artPieceTypeData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceType') || key.includes('getPaginatedArtPieceTypes'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['artPieceType', 'getPaginatedArtPieceTypes'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPieceType.Hooks.useCreateArtPieceType',
        'Failed to create art piece type',
        {
          error: error.message,
          artPieceTypeData: artPieceTypeData
            ? artPieceTypeData instanceof FormData
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
 * Hook for updating an existing art piece type with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useUpdateArtPieceType
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update an art piece type
 * @returns {Promise<Object>} returns.result - Updated art piece type response
 * @throws {Error} When art piece type data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdateArtPieceType(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, artPieceTypeData) => {
    try {
      const result = await requests.updateArtPieceType(id, artPieceTypeData, token);

      // Invalidate SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceType') ||
            key.includes('getPaginatedArtPieceTypes') ||
            (key.includes('getArtPieceTypeById') && key.includes(id)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['artPieceType', 'getPaginatedArtPieceTypes'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPieceType.Hooks.useUpdateArtPieceType',
        'Failed to update art piece type',
        {
          error: error.message,
          artPieceTypeId: id,
          artPieceTypeData: artPieceTypeData
            ? artPieceTypeData instanceof FormData
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
 * Hook for deleting an art piece type with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useDeleteArtPieceType
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete an art piece type
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When art piece type ID is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeleteArtPieceType(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteArtPieceType(id, token);

      // Invalidate SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPieceType') ||
            key.includes('getPaginatedArtPieceTypes') ||
            (key.includes('getArtPieceTypeById') && key.includes(id)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['artPieceType', 'getPaginatedArtPieceTypes'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPieceType.Hooks.useDeleteArtPieceType',
        'Failed to delete art piece type',
        {
          error: error.message,
          artPieceTypeId: id,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Combined hook that provides all art piece type mutation functions
 *
 * @memberof CityArtWalks.Actions.ArtPieceType.Hooks
 * @function useArtPieceTypeMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createArtPieceType - Function to create art piece type
 * @returns {Function} returns.updateArtPieceType - Function to update art piece type
 * @returns {Function} returns.deleteArtPieceType - Function to delete art piece type
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useArtPieceTypeMutations(token = '') {
  const createArtPieceType = useCreateArtPieceType(token);
  const updateArtPieceType = useUpdateArtPieceType(token);
  const deleteArtPieceType = useDeleteArtPieceType(token);

  return {
    createArtPieceType,
    updateArtPieceType,
    deleteArtPieceType,
  };
}
