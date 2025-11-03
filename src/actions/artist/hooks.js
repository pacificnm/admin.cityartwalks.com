/**
 * @file hooks.js
 * @description React hooks for Artist operations using SWR with IndexedDB caching and automatic cache invalidation
 * @namespace CityArtWalks.Actions.Artist.Hooks
 * @version 3.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugWarn, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};


/**
 * SWR hook for paginated artists with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetPaginatedArtists
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for name/description fields
 * @param {string} [filters.status=''] - Status filter (ACTIVE, DELETED, etc.)
 * @param {string} [filters.createdBy=''] - Creator user ID filter
 * @param {string} [filters.cityId=''] - City ID filter
 * @param {string} [filters.stateId=''] - State ID filter
 * @param {string} [filters.countryId=''] - Country ID filter
 * @param {string} [filters.featured=''] - Featured filter
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated artists result with IndexedDB caching
 * @returns {Array} returns.artists - Array of artist objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.artistsLoading - Loading state
 * @returns {Error} returns.artistsError - Error state
 * @returns {boolean} returns.artistsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedArtists(
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
    createdBy = '',
    cityId = '',
    stateId = '',
    countryId = '',
    featured = '',
  } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedArtists',
      search,
      status,
      createdBy,
      cityId,
      stateId,
      countryId,
      featured,
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
    createdBy,
    cityId,
    stateId,
    countryId,
    featured,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    () => requests.getPaginatedArtists(page, rowsPerPage, filters, token, revalidate),
    {
      refreshInterval: revalidateMs,
    }
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
      artists: data?.data?.artists || [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      artistsLoading: isLoading,
      artistsError: error,
      artistsEmpty: !isLoading && (!data?.data?.artists || data?.data?.artists.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * Direct API hook for paginated artists without any caching
 *
 * This hook makes direct API calls without SWR caching, IndexedDB fallback,
 * or memoization. Ideal for admin operations where fresh data is required
 * and cache pollution should be avoided.
 *
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetPaginatedArtistsNoCache
 * @param {Object} [filters={}] - Filter parameters object
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=25] - Number of items per page
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=0] - Revalidate interval (ignored, included for compatibility)
 * @returns {Object} Artists data with loading and error states
 * @returns {Array} returns.artists - Array of artist objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.artistsLoading - Loading state
 * @returns {Error} returns.artistsError - Error state
 * @returns {boolean} returns.artistsEmpty - Empty state
 * @returns {Function} returns.mutate - Refresh function
 */
export function useGetPaginatedArtistsNoCache({
  filters = {},
  page = 1,
  rowsPerPage = 25,
  token = '',
  revalidate = 0,
} = {}) {
  const { data, isLoading, error, mutate } = useSWR(
    ['getPaginatedArtistsNoCache', Date.now()], // Always unique key to prevent caching
    () => requests.getPaginatedArtists(page, rowsPerPage, filters, token, revalidate),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 0, // No deduplication
      refreshInterval: 0, // No auto-refresh
    }
  );

  return useMemo(
    () => ({
      artists: data?.data?.artists || [],
      paginationMeta: data?.data?.paginationMeta || {},
      artistsLoading: isLoading,
      artistsError: error,
      artistsEmpty: !isLoading && (!data?.data?.artists || data?.data?.artists.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single artist by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetArtistById
 * @param {string|number} id - The unique identifier of the artist
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Artist data with loading and error states
 * @returns {Object} returns.artist - Artist object or null
 * @returns {boolean} returns.artistLoading - Loading state
 * @returns {Error} returns.artistError - Error state
 * @returns {boolean} returns.artistValidating - Revalidation state
 * @returns {boolean} returns.artistEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetArtistById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getArtistById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getArtistById(id, token, revalidate);
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
      artist: data?.data || null,
      artistLoading: isLoading,
      artistError: error,
      artistValidating: isValidating,
      artistEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * SWR hook for fetching a single artist by slug with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetArtistBySlug
 * @param {string} slug - The unique slug identifier for the artist
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Artist data with loading and error states
 * @returns {Object} returns.artist - Artist object or null
 * @returns {boolean} returns.artistLoading - Loading state
 * @returns {Error} returns.artistError - Error state
 * @returns {boolean} returns.artistValidating - Revalidation state
 * @returns {boolean} returns.artistEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetArtistBySlug(slug, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!slug) return { swrKey: null, cacheKey: null };
    const key = ['getArtistBySlug', slug, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [slug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getArtistBySlug(slug, token, revalidate);
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
      artist: data?.data || null,
      artistLoading: isLoading,
      artistError: error,
      artistValidating: isValidating,
      artistEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

// ===== MUTATION HOOKS =====

/**
 * Hook for creating a new artist with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useCreateArtist
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create an artist
 * @returns {Promise<Object>} returns.result - Created artist response
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useCreateArtist(token = '') {
  const { mutate } = useSWRConfig();

  return async (artistData, revalidate = 600) => {
    try {
      const result = await requests.createArtist(artistData, token, revalidate);

      // Clear SWR cache
      mutate(
        (key) =>
          Array.isArray(key) && (key.includes('artist') || key.includes('getPaginatedArtists'))
      );

      // Clear IndexedDB cache
      try {
        const cacheKeysToDelete = ['getPaginatedArtists'];
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
      throw new Error(`Failed to create artist: ${error.message}`);
    }
  };
}

/**
 * Hook for updating an existing artist with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useUpdateArtist
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update an artist
 * @returns {Promise<Object>} returns.result - Updated artist response
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUpdateArtist(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, artistData, revalidate = 600) => {
    try {
      const result = await requests.updateArtist(id, artistData, token, revalidate);

      // Clear SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artist') ||
            key.includes('getPaginatedArtists') ||
            (key.includes('getArtistById') && key.includes(id)) ||
            key.includes('getArtistBySlug'))
      );

      // Clear IndexedDB cache
      try {
        const cacheKeysToDelete = ['getPaginatedArtists', `getArtistById_${id}`, 'getArtistBySlug'];
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
      throw new Error(`Failed to update artist: ${error.message}`);
    }
  };
}

/**
 * Hook for deleting an artist with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useDeleteArtist
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete an artist
 * @returns {Promise<Object>} returns.result - Deletion response
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useDeleteArtist(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, revalidate = 600) => {
    try {
      const result = await requests.deleteArtist(id, token, revalidate);

      // Clear SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artist') ||
            key.includes('getPaginatedArtists') ||
            (key.includes('getArtistById') && key.includes(id)) ||
            key.includes('getArtistBySlug'))
      );

      // Clear IndexedDB cache
      try {
        const cacheKeysToDelete = ['getPaginatedArtists', `getArtistById_${id}`, 'getArtistBySlug'];
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
      throw new Error(`Failed to delete artist: ${error.message}`);
    }
  };
}

/**
 * Combined hook that provides all artist mutation functions
 *
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useArtistMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createArtist - Function to create artist
 * @returns {Function} returns.updateArtist - Function to update artist
 * @returns {Function} returns.deleteArtist - Function to delete artist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useArtistMutations(token = '') {
  const createArtist = useCreateArtist(token);
  const updateArtist = useUpdateArtist(token);
  const deleteArtist = useDeleteArtist(token);

  return {
    createArtist,
    updateArtist,
    deleteArtist,
  };
}

// ===== CUSTOM BUSINESS LOGIC HOOKS =====
// TODO: Review - Custom hooks - Verify necessity and standards compliance

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetArtist
 * @description Custom business logic hook - not part of standard CRUD
 * TODO: Review - Custom hook - Verify necessity and standards compliance
 * @deprecated Consider using useGetArtistById or useGetArtistBySlug instead
 */
export function useGetArtist(id) {
  const key = ['getArtist', id];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getArtist(id),
    swrOptions
  );

  return useMemo(
    () => ({
      artist: data?.data || null,
      artistLoading: isLoading,
      artistError: error,
      artistValidating: isValidating,
      artistEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetActiveArtists
 * @description Custom business logic hook - not part of standard CRUD
 * TODO: Review - Custom hook - Verify necessity and standards compliance
 */
export function useGetActiveArtists(
  city,
  status,
  search = '',
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600
) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getActiveArtists', city, status, search, page, rowsPerPage, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [city, status, search, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getActiveArtists(
        city,
        status,
        search,
        page,
        rowsPerPage,
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

  return useMemo(
    () => ({
      artists: data?.data?.artists || [],
      paginationMeta: data?.data?.meta || { total: 0, page, rowsPerPage },
      artistsLoading: isLoading,
      artistsError: error,
      artistsValidating: isValidating,
      artistsEmpty: !isLoading && (!data?.data?.artists || data?.data?.artists.length === 0),
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate, page, rowsPerPage]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetArtistCounts
 * @description Custom business logic hook - not part of standard CRUD
 * TODO: Review - Custom hook - Verify necessity and standards compliance
 */
export function useGetArtistCounts(artistId) {
  const key = ['getArtistCounts', artistId];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getArtistCounts(artistId),
    swrOptions
  );

  return useMemo(
    () => ({
      counts: data || {},
      countsLoading: isLoading,
      countsError: error,
      countsValidating: isValidating,
      countsEmpty: !isLoading && !data?.favoriteCount,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGetArtistFeatured
 * @description Custom business logic hook - not part of standard CRUD
 * TODO: Review - Custom hook - Verify necessity and standards compliance
 */
export function useGetArtistFeatured(country, state, city, page = 1, rowsPerPage = 10) {
  const key = ['getArtistFeatured', country, state, city, page, rowsPerPage];

  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getArtistFeatured(country, state, city, page, rowsPerPage),
    swrOptions
  );

  return useMemo(
    () => ({
      artists: data?.data?.artists || [],
      paginationMeta: data?.meta || { total: 0, page, rowsPerPage },
      artistsLoading: isLoading,
      artistsError: error,
      artistsValidating: isValidating,
      artistsEmpty: !isLoading && (!data?.data?.artists || data?.data?.artists.length === 0),
    }),
    [data, isLoading, error, isValidating, page, rowsPerPage]
  );
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useIncrementArtistViewCount
 * @description Custom business logic hook - not part of standard CRUD
 * TODO: Review - Custom hook - Verify necessity and standards compliance
 */
export function useIncrementArtistViewCount() {
  const { mutate } = useSWRConfig();

  return async (id, token = '') => {
    try {
      const result = await requests.incrementArtistViewCount(id, token);

      // Invalidate related caches
      mutate(
        (key) =>
          Array.isArray(key) && (key.includes('artist') || key.includes('getPaginatedArtists'))
      );

      return result;
    } catch (error) {
      throw new Error(`Failed to increment artist view count: ${error.message}`);
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGenerateArtistAIMetaDescription
 * @description Hook for generating AI-powered artist meta descriptions with proper error handling.
 * Corresponds to POST /api/artist/[id]/meta-description route.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to generate AI meta description
 * @returns {Promise<string>} returns.result - Generated meta description text
 * @throws {Error} When artist data is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGenerateArtistAIMetaDescription(token = '') {
  return async (artistId, artistName, biography) => {
    try {
      const result = await requests.generateArtistAIMetaDescription(
        artistId,
        artistName,
        biography,
        token
      );

      debugLog(
        'CityArtWalks.Actions.Artist.Hooks.useGenerateArtistAIMetaDescription',
        'AI meta description generated successfully',
        {
          artistId,
          artistName,
          biographyLength: biography?.length || 0,
          metaDescriptionLength: result?.length || 0,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Artist.Hooks.useGenerateArtistAIMetaDescription',
        'Failed to generate AI meta description',
        {
          error: error.message,
          artistId,
          artistName,
          biographyLength: biography?.length || 0,
          hasToken: !!token,
        }
      );
      throw error;
    }
  };
}

/**
 * @memberof CityArtWalks.Actions.Artist.Hooks
 * @function useGenerateArtistAIMetaKeywords
 * @description Hook for generating AI-powered artist meta keywords with proper error handling.
 * Corresponds to POST /api/artist/[id]/meta-keywords route.
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to generate AI meta keywords
 * @returns {Promise<string>} returns.result - Generated meta keywords text
 * @throws {Error} When artist data is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGenerateArtistAIMetaKeywords(token = '') {
  return async (artistId, artistName, biography) => {
    try {
      const result = await requests.generateArtistAIMetaKeywords(
        artistId,
        artistName,
        biography,
        token
      );

      debugLog(
        'CityArtWalks.Actions.Artist.Hooks.useGenerateArtistAIMetaKeywords',
        'AI meta keywords generated successfully',
        {
          artistId,
          artistName,
          biographyLength: biography?.length || 0,
          metaKeywordsLength: result?.length || 0,
        }
      );

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Artist.Hooks.useGenerateArtistAIMetaKeywords',
        'Failed to generate AI meta keywords',
        {
          error: error.message,
          artistId,
          artistName,
          biographyLength: biography?.length || 0,
          hasToken: !!token,
        }
      );
      throw error;
    }
  };
}
