/**
 * React hooks for ArtPiece operations using SWR
 *
 * This module provides React hooks for ArtPiece CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states.
 *
 * @namespace CityArtWalks.Actions.ArtPiece.Hooks
 * @fileoverview React hooks for ArtPiece data operations
 * @author Jaimie Garner
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
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect, useCallback } from 'react';

import { debugLog, debugWarn, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @description SWR configuration options to control revalidation behavior.
 *
 * @property {boolean} revalidateIfStale - If false, data will not be revalidated if it is stale.
 * @property {boolean} revalidateOnFocus - If false, data will not be revalidated when the window regains focus.
 * @property {boolean} revalidateOnReconnect - If false, data will not be revalidated when the browser reconnects to the network.
 * @property {boolean} keepPreviousData - If true, previous data will be kept while fetching new data.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

// ==========================================
// CORE CRUD HOOKS (Required Functions)
// ==========================================

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetPaginatedArtPieces
 * @description SWR hook for paginated art pieces with IndexedDB caching support.
 * Corresponds to GET /api/art-piece route.
 *
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.createdBy=''] - Filter by user ID who created the art piece
 * @param {string} [filters.search=''] - Search query for title, description, or artist
 * @param {string} [filters.status=''] - Filter by status (ACTIVE, ARCHIVED, etc.)
 * @param {number} [filters.cityId=''] - Filter by city ID
 * @param {number} [filters.stateId=''] - Filter by state ID
 * @param {number} [filters.countryId=''] - Filter by country ID
 * @param {boolean} [filters.featured=''] - Filter by featured status
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger refresh
 * @returns {Object} Paginated art pieces result with IndexedDB caching
 * @returns {Array} returns.artPieces - Array of ArtPiece objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.artPiecesLoading - Loading state
 * @returns {Error} returns.artPiecesError - Error state
 * @returns {boolean} returns.artPiecesEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedArtPieces(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  // Handle null filters (used to prevent API calls)
  const safeFilters = filters || {};
  const {
    createdBy = '',
    search = '',
    status = '',
    cityId = '',
    stateId = '',
    countryId = '',
    featured = '',
    artistId = '',
  } = safeFilters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    // Return null key to prevent SWR fetch when filters is null
    if (filters === null) {
      return { swrKey: null, cacheKey: null };
    }
    const key = [
      'getPaginatedArtPieces',
      createdBy,
      search,
      status,
      cityId,
      stateId,
      countryId,
      featured,
      artistId,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [
    filters,
    createdBy,
    search,
    status,
    cityId,
    stateId,
    countryId,
    featured,
    artistId,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedArtPieces(
          page,
          rowsPerPage,
          safeFilters,
          token,
          revalidate
        );
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetPaginatedArtPieces',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetPaginatedArtPieces',
          'Failed to fetch paginated art pieces',
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

  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetPaginatedArtPieces',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        } else {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetPaginatedArtPieces',
            `[IndexedDB] Cache miss for ${cacheKey}`
          );
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetPaginatedArtPieces',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      artPieces: Array.isArray(data?.data?.artPieces) ? data.data.artPieces : [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesEmpty:
        !isLoading && (!Array.isArray(data?.data?.artPieces) || data.data.artPieces.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceById
 * @description SWR hook for fetching a single art piece by ID with IndexedDB caching.
 * Corresponds to GET /api/art-piece/[id] route.
 *
 * @param {string|number} id - The unique identifier of the art piece
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} ArtPiece data with loading and error states
 * @returns {Object} returns.artPiece - ArtPiece object or null
 * @returns {boolean} returns.artPieceLoading - Loading state
 * @returns {Error} returns.artPieceError - Error state
 * @returns {boolean} returns.artPieceValidating - Revalidation state
 * @returns {boolean} returns.artPieceEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetArtPieceById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getArtPieceById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getArtPieceById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceById',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceById',
          'Failed to fetch art piece by ID',
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

  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceById',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceById',
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
      artPiece: data?.data || null,
      artPieceLoading: isLoading,
      artPieceError: error,
      artPieceValidating: isValidating,
      artPieceEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceBySlug
 * @description SWR hook for fetching a single art piece by artist slug and art piece slug with IndexedDB caching.
 * Corresponds to GET /api/art-piece/artist/[artistSlug]/[slug] route.
 *
 * @param {string} artistSlug - The artist slug identifier
 * @param {string} artPieceSlug - The art piece slug identifier
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} ArtPiece data with loading and error states
 * @returns {Object} returns.artPiece - ArtPiece object or null
 * @returns {boolean} returns.artPieceLoading - Loading state
 * @returns {Error} returns.artPieceError - Error state
 * @returns {boolean} returns.artPieceValidating - Revalidation state
 * @returns {boolean} returns.artPieceEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetArtPieceBySlug(artistSlug, artPieceSlug, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;
  const { swrKey, cacheKey } = useMemo(() => {
    if (!artistSlug || !artPieceSlug) return { swrKey: null, cacheKey: null };
    const key = ['getArtPieceBySlug', artistSlug, artPieceSlug, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [artistSlug, artPieceSlug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getArtPieceBySlug(
          artistSlug,
          artPieceSlug,
          token,
          revalidate
        );

        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceBySlug',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceBySlug',
          'Failed to fetch art piece by slug',
          {
            error: err.message,
            artistSlug: artistSlug ? '[REDACTED]' : 'none',
            artPieceSlug: artPieceSlug ? '[REDACTED]' : 'none',
            token: token ? '[REDACTED]' : 'none',
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceBySlug',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceBySlug',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            artistSlug: artistSlug ? '[REDACTED]' : 'none',
            artPieceSlug: artPieceSlug ? '[REDACTED]' : 'none',
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, artistSlug, artPieceSlug]);

  return useMemo(
    () => ({
      artPiece: data?.data || null,
      artPieceLoading: isLoading,
      artPieceError: error,
      artPieceValidating: isValidating,
      artPieceEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useCreateArtPiece
 * @description Hook for creating a new art piece with automatic cache invalidation.
 * Corresponds to POST /api/art-piece/create route.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create an art piece
 * @returns {Promise<Object>} returns.result - Created art piece response
 * @throws {Error} When art piece data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCreateArtPiece(token = '') {
  const { mutate } = useSWRConfig();

  return async (artPieceData) => {
    try {
      const result = await requests.createArtPiece(artPieceData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) && (key.includes('artPiece') || key.includes('getPaginatedArtPieces'))
      );

      // Clear IndexedDB cache
      try {
        const cacheKeysToDelete = ['getPaginatedArtPieces', 'getArtPieces'];
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
      debugError(
        'CityArtWalks.Actions.ArtPiece.Hooks.useCreateArtPiece',
        'Failed to create art piece',
        {
          error: error.message,
          artPieceData: artPieceData
            ? artPieceData instanceof FormData
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
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useUpdateArtPiece
 * @description Hook for updating an existing art piece with automatic cache invalidation.
 * Corresponds to PUT /api/art-piece/[id]/update route.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update an art piece
 * @returns {Promise<Object>} returns.result - Updated art piece response
 * @throws {Error} When art piece data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdateArtPiece(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, artPieceData) => {
    try {
      const result = await requests.updateArtPiece(id, artPieceData, token);

      // Invalidate SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPiece') ||
            key.includes('getPaginatedArtPieces') ||
            (key.includes('getArtPieceById') && key.includes(id)) ||
            key.includes('getArtPieceBySlug'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['artPiece', 'getPaginatedArtPieces'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPiece.Hooks.useUpdateArtPiece',
        'Failed to update art piece',
        {
          error: error.message,
          artPieceId: id,
          artPieceData: artPieceData
            ? artPieceData instanceof FormData
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
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useDeleteArtPiece
 * @description Hook for deleting an art piece with automatic cache invalidation.
 * Corresponds to DELETE /api/art-piece/[id]/delete route.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete an art piece
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When art piece ID is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeleteArtPiece(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteArtPiece(id, token);

      // Invalidate SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artPiece') ||
            key.includes('getPaginatedArtPieces') ||
            (key.includes('getArtPieceById') && key.includes(id)) ||
            key.includes('getArtPieceBySlug'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['artPiece', 'getPaginatedArtPieces'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPiece.Hooks.useDeleteArtPiece',
        'Failed to delete art piece',
        {
          error: error.message,
          artPieceId: id,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

// ==========================================
// CUSTOM HOOKS (Non-Core Operations)
// ==========================================

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetAllArtPieces
 * @description Custom business logic hook - not part of standard CRUD
 * // TODO: Review - Custom hook - Verify necessity and standards compliance
 *
 * @param {number} [limit=100] - Max number of art pieces to fetch
 * @param {string} [token=''] - Optional access token
 * @param {number} [revalidate=600] - Revalidation time in seconds
 * @returns {Object} Result including loading states, errors, and list of art pieces
 */
export function useGetAllArtPieces(limit = 100, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getAllArtPieces', limit, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [limit, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getAllArtPieces(limit, token, revalidate);
      if (response && cacheKey) {
        await saveToIndexedDb(cacheKey, response);
        debugLog(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetAllArtPieces',
          `[IndexedDB] Saved data for ${cacheKey}`
        );
      }
      return response;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetAllArtPieces',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        } else {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetAllArtPieces',
            `[IndexedDB] Cache miss for ${cacheKey}`
          );
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetAllArtPieces',
          `[IndexedDB] Error loading cache for ${cacheKey}:`,
          cacheError
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  return useMemo(
    () => ({
      artPieces: Array.isArray(data?.data?.artPieces) ? data.data.artPieces : [],
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty:
        !isLoading && (!Array.isArray(data?.data?.artPieces) || data.data.artPieces.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByArtist
 * @description Fetches art pieces by artist ID.
 *
 * @param {string|number} artistId - The artist ID to filter by
 * @param {string} [token=''] - Optional auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Hook result with artPieces array and loading states
 */
export function useGetArtPieceByArtist(artistId, token = '', revalidate = 600) {
  const key = ['getArtPieceByArtist', artistId, revalidate];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getArtPieceByArtist(artistId, token, revalidate),
    swrOptions
  );

  return useMemo(
    () => ({
      artPieces: Array.isArray(data) ? data : [],
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && (!Array.isArray(data) || data.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByCountry
 * @description Fetches art pieces by country with optional search and featured filter.
 *
 * @param {string} country - Country identifier
 * @param {string} [search=''] - Optional search query
 * @param {boolean|null} [featured=null] - Optional featured filter (true for featured only, false for non-featured only, null for all)
 * @param {string} [token=''] - Optional auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Hook result with artPieces array and loading states
 */
export function useGetArtPieceByCountry(
  country,
  search = '',
  featured = null,
  token = '',
  revalidate = 600
) {
  const key = ['getArtPieceByCountry', country, search, featured, revalidate];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getArtPieceByCountry(country, search, featured, token, revalidate),
    swrOptions
  );

  return useMemo(
    () => ({
      artPieces: Array.isArray(data) ? data : [],
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && (!Array.isArray(data) || data.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByState
 * @description Fetches art pieces by state within a country.
 *
 * @param {string} country - Country identifier
 * @param {string} state - State identifier
 * @param {string} [token=''] - Optional auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Hook result with artPieces array and loading states
 */
export function useGetArtPieceByState(country, state, token = '', revalidate = 600) {
  const key = ['getArtPieceByState', country, state, revalidate];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getArtPieceByState(country, state, token, revalidate),
    swrOptions
  );

  return useMemo(
    () => ({
      artPieces: Array.isArray(data) ? data : [],
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty: !isLoading && (!Array.isArray(data) || data.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByCity
 * @description Fetches art pieces by city with optional search.
 *
 * @param {string} country - Country identifier
 * @param {string} state - State identifier
 * @param {string} city - City identifier
 * @param {string} [search=''] - Optional search query
 * @param {string} [token=''] - Optional auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Hook result with artPieces array and loading states
 */
export function useGetArtPieceByCity(
  country,
  state,
  city,
  search = '',
  token = '',
  revalidate = 600
) {
  const key = ['getArtPieceByCity', country, state, city, search, revalidate];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getArtPieceByCity(country, state, city, search, token, revalidate),
    swrOptions
  );

  return useMemo(
    () => ({
      artPieces: Array.isArray(data?.data?.artPieces) ? data.data.artPieces : [],
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty:
        !isLoading && (!Array.isArray(data?.data?.artPieces) || data.data.artPieces.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceCounts
 * @description Fetches count statistics for an art piece.
 *
 * @param {string|number} artPieceId - The art piece ID
 * @param {string} [token=''] - Optional auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Hook result with counts object and loading states
 */
export function useGetArtPieceCounts(artPieceId, token = '', revalidate = 600) {
  const key = ['getArtPieceCounts', artPieceId, revalidate];
  const { data, isLoading, error } = useSWR(
    key,
    () => requests.getArtPieceCounts(artPieceId, token, revalidate),
    swrOptions
  );

  debugLog(
    'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceCounts',
    `Fetching counts for art piece ID: ${artPieceId}`
  );

  return useMemo(
    () => ({
      counts: data?.data || {},
      countsLoading: isLoading,
      countsError: error,
    }),
    [data, isLoading, error]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useIncrementArtPieceViewCount
 * @description Hook for incrementing art piece view count with cache invalidation.
 *
 * @param {string} [token=''] - Auth token
 * @returns {Function} Increment function with optimized cache invalidation
 */
export function useIncrementArtPieceViewCount(artPieceId, token = '') {
  const { mutate } = useSWRConfig();

  return useCallback(
    async (revalidate = 600) => {
      if (!artPieceId) {
        console.warn('useIncrementArtPieceViewCount: artPieceId is required');
        return null;
      }
      const result = await requests.incrementArtPieceViewCount(artPieceId, token, revalidate);
      // Invalidate relevant caches
      mutate(
        (key) =>
          Array.isArray(key) && (key.includes('artPiece') || key.includes('getPaginatedArtPieces'))
      );
      return result;
    },
    [artPieceId, token, mutate]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByViewport
 * @description Fetches art pieces in a viewport using SWR and IndexedDB caching.
 *
 * @param {Object} viewport - Bounding box with swLat, swLng, neLat, neLng, zoom
 * @param {string} [search=''] - Optional search query
 * @param {string} [token=''] - Optional bearer token
 * @param {number} [revalidate=600] - Revalidation interval in seconds
 * @param {Object} [options={}] - Additional SWR options
 * @returns {Object} Hook result with artPieces in viewport and loading states
 */
export function useGetArtPieceByViewport(
  viewport,
  search = '',
  token = '',
  revalidate = 600,
  options = {}
) {
  const { swLat, swLng, neLat, neLng, zoom } = viewport || {};
  const hasValidViewport = swLat && swLng && neLat && neLng;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!hasValidViewport) return { swrKey: null, cacheKey: null };

    const key = ['getArtPieceByViewport', swLat, swLng, neLat, neLng, zoom, search, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [swLat, swLng, neLat, neLng, zoom, search, revalidate, hasValidViewport]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getArtPieceByViewport(
        { swLat, swLng, neLat, neLng, zoom },
        search,
        token,
        revalidate
      );
      if (response && cacheKey) {
        await saveToIndexedDb(cacheKey, response);
        debugLog(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceByViewport',
          `[IndexedDB] Saved data for ${cacheKey}`
        );
      }
      return response;
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 30000,
      ...options,
    }
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceByViewport',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        } else {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceByViewport',
            `[IndexedDB] Cache miss for ${cacheKey}`
          );
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceByViewport',
          `[IndexedDB] Error loading cache for ${cacheKey}:`,
          cacheError
        );
      }
    })();
  }, [cacheKey, revalidateMs, mutate]);

  return useMemo(
    () => ({
      artPieces: Array.isArray(data?.data?.artPieces) ? data.data.artPieces : [],
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty:
        !isLoading && (!Array.isArray(data?.data?.artPieces) || data.data.artPieces.length === 0),
      artPiecesCount: data?.data?.count || 0,
      viewport: hasValidViewport ? { swLat, swLng, neLat, neLng, zoom } : null,
    }),
    [data, isLoading, error, isValidating, swLat, swLng, neLat, neLng, zoom, hasValidViewport]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGetArtPieceByRadius
 * @description Fetches art pieces within a geographic radius with IndexedDB support.
 *
 * @param {Object} center - Object with `lat` and `lng` properties
 * @param {number} radius - Radius in kilometers
 * @param {string} [search=''] - Optional search filter
 * @param {string} [token=''] - Bearer token for API authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {Object} [options={}] - Optional SWR options
 * @returns {Object} Hook result with artPieces in radius and loading states
 */
export function useGetArtPieceByRadius(
  center,
  radius,
  search = '',
  token = '',
  revalidate = 600,
  options = {}
) {
  const { lat, lng } = center || {};
  const hasValidCenter = lat && lng && radius;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!hasValidCenter) return { swrKey: null, cacheKey: null };
    const key = ['getArtPieceByRadius', lat, lng, radius, search, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [lat, lng, radius, search, revalidate, hasValidCenter]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getArtPieceByRadius(
        { lat, lng },
        radius,
        search,
        token,
        revalidate
      );
      if (response && cacheKey) {
        await saveToIndexedDb(cacheKey, response?.data);
        debugLog(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceByRadius',
          `[IndexedDB] Saved data for ${cacheKey}`
        );
      }
      return response;
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 30000,
      ...options,
    }
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceByRadius',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate({ data: cached }, false);
        } else {
          debugWarn(
            'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceByRadius',
            `[IndexedDB] Cache miss for ${cacheKey}`
          );
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.ArtPiece.Hooks.useGetArtPieceByRadius',
          `[IndexedDB] Error loading cache for ${cacheKey}:`,
          cacheError
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  return useMemo(
    () => ({
      artPieces: Array.isArray(data?.data?.artPieces) ? data.data.artPieces : [],
      artPiecesLoading: isLoading,
      artPiecesError: error,
      artPiecesValidating: isValidating,
      artPiecesEmpty:
        !isLoading && (!Array.isArray(data?.data?.artPieces) || data.data.artPieces.length === 0),
      artPiecesCount: data?.data?.count || 0,
      center: hasValidCenter ? { lat, lng } : null,
      radius,
    }),
    [data, isLoading, error, isValidating, lat, lng, radius, hasValidCenter]
  );
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useArtPieceMutations
 * @description Combined hook that provides all art piece mutation functions.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createArtPiece - Function to create art piece
 * @returns {Function} returns.updateArtPiece - Function to update art piece
 * @returns {Function} returns.deleteArtPiece - Function to delete art piece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useArtPieceMutations(token = '') {
  const createArtPiece = useCreateArtPiece(token);
  const updateArtPiece = useUpdateArtPiece(token);
  const deleteArtPiece = useDeleteArtPiece(token);

  return {
    createArtPiece,
    updateArtPiece,
    deleteArtPiece,
  };
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGenerateArtPieceAIDescription
 * @description Hook for generating AI-powered art piece descriptions with proper error handling.
 * Corresponds to POST /api/art-piece/[id]/description route.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to generate AI description
 * @returns {Promise<string>} returns.result - Generated description text
 * @throws {Error} When art piece data is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGenerateArtPieceAIDescription(token = '') {
  return async (artPieceId, artistName, title) => {
    try {
      const result = await requests.generateArtPieceAIDescription(
        artPieceId,
        artistName,
        title,
        token
      );

      debugLog(
        'CityArtWalks.Actions.ArtPiece.Hooks.useGenerateArtPieceAIDescription',
        'AI description generated successfully',
        {
          artPieceId,
          artistName,
          title,
          descriptionLength: result?.length || 0,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPiece.Hooks.useGenerateArtPieceAIDescription',
        'Failed to generate AI description',
        {
          error: error.message,
          artPieceId,
          artistName,
          title,
          hasToken: !!token,
        }
      );
      throw error;
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGenerateArtPieceAIMetaDescription
 * @description Hook for generating AI-powered art piece meta descriptions with proper error handling.
 * Corresponds to POST /api/art-piece/[id]/meta-description route.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to generate AI meta description
 * @returns {Promise<string>} returns.result - Generated meta description text (max 160 chars)
 * @throws {Error} When art piece data is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGenerateArtPieceAIMetaDescription(token = '') {
  return async (artPieceId, artistName, title, description) => {
    try {
      const result = await requests.generateArtPieceAIMetaDescription(
        artPieceId,
        artistName,
        title,
        description,
        token
      );

      debugLog(
        'CityArtWalks.Actions.ArtPiece.Hooks.useGenerateArtPieceAIMetaDescription',
        'AI meta description generated successfully',
        {
          artPieceId,
          artistName,
          title,
          descriptionLength: description?.length || 0,
          metaDescriptionLength: result?.length || 0,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPiece.Hooks.useGenerateArtPieceAIMetaDescription',
        'Failed to generate AI meta description',
        {
          error: error.message,
          artPieceId,
          artistName,
          title,
          descriptionLength: description?.length || 0,
          hasToken: !!token,
        }
      );
      throw error;
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.ArtPiece.Hooks
 * @function useGenerateArtPieceAIMetaKeywords
 * @description Hook for generating AI-powered art piece meta keywords with proper error handling.
 * Corresponds to POST /api/art-piece/[id]/meta-keywords route.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to generate AI meta keywords
 * @returns {Promise<string>} returns.result - Generated comma-separated meta keywords (max 255 chars)
 * @throws {Error} When art piece data is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGenerateArtPieceAIMetaKeywords(token = '') {
  return async (artPieceId, artistName, title, description, metadata = {}) => {
    try {
      const result = await requests.generateArtPieceAIMetaKeywords(
        artPieceId,
        artistName,
        title,
        description,
        metadata,
        token
      );

      debugLog(
        'CityArtWalks.Actions.ArtPiece.Hooks.useGenerateArtPieceAIMetaKeywords',
        'AI meta keywords generated successfully',
        {
          artPieceId,
          artistName,
          title,
          descriptionLength: description?.length || 0,
          metaKeywordsLength: result?.length || 0,
          metadataKeys: Object.keys(metadata),
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtPiece.Hooks.useGenerateArtPieceAIMetaKeywords',
        'Failed to generate AI meta keywords',
        {
          error: error.message,
          artPieceId,
          artistName,
          title,
          descriptionLength: description?.length || 0,
          metadataKeys: Object.keys(metadata),
          hasToken: !!token,
        }
      );
      throw error;
    }
  };
}
