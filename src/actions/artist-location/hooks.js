/**
 * @file hooks.js
 * @description React hooks for ArtistLocation operations using SWR
 *
 * This module provides React hooks for artist location CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states.
 * @namespace CityArtWalks.Actions.ArtistLocation.Hooks
 * @version 2.0.0
 * @author GitHub Copilot
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtistLocation-Model} - ArtistLocation model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtistLocation} - Database schema reference
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
  dedupingInterval: 30000, // 30 seconds deduplication
};

/**
 * SWR hook for paginated artist locations with comprehensive filtering and IndexedDB caching support.
 * Provides efficient data fetching with automatic cache management and fallback strategies.
 *
 * Features:
 * - Comprehensive filtering options (search, location hierarchy, status filters)
 * - SWR caching with configurable revalidation
 * - IndexedDB fallback for offline support
 * - Automatic cache invalidation and refresh triggers
 * - Pagination support with metadata
 * - Structured error handling and loading states
 *
 * @async
 * @function useGetPaginatedArtistLocations
 * @memberof CityArtWalks.Actions.ArtistLocation.Hooks
 *
 * @example
 * // Basic usage with pagination
 * const { artistLocations, paginationMeta, artistLocationsLoading } =
 *   useGetPaginatedArtistLocations({}, 1, 20);
 *
 * @example
 * // With comprehensive filtering
 * const result = useGetPaginatedArtistLocations(
 *   {
 *     search: 'downtown',
 *     artistId: '123',
 *     cityId: '456',
 *     active: 'true',
 *     primary: 'true'
 *   },
 *   1,
 *   10,
 *   accessToken
 * );
 *
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for name/description fields
 * @param {string} [filters.artistId=''] - Filter by artist ID
 * @param {string} [filters.countryId=''] - Filter by country ID
 * @param {string} [filters.stateId=''] - Filter by state ID
 * @param {string} [filters.cityId=''] - Filter by city ID
 * @param {string} [filters.primary=''] - Filter by primary location status (true/false)
 * @param {string} [filters.active=''] - Filter by active status (true/false)
 * @param {string} [filters.source=''] - Filter by source (manual, art_piece, migration)
 * @param {string} [filters.createdBy=''] - Creator user ID filter
 * @param {string} [filters.updatedBy=''] - Updater user ID filter
 * @param {string} [filters.sortBy=''] - Sort field
 * @param {string} [filters.sortOrder=''] - Sort order (asc, desc)
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated artist locations result with IndexedDB caching
 * @returns {Array} returns.artistLocations - Array of artist location objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.artistLocationsLoading - Loading state
 * @returns {Error} returns.artistLocationsError - Error state
 * @returns {boolean} returns.artistLocationsEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 */
export function useGetPaginatedArtistLocations(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const {
    search = '',
    artistId = '',
    countryId = '',
    stateId = '',
    cityId = '',
    primary = '',
    active = '',
    source = '',
    createdBy = '',
    updatedBy = '',
    sortBy = '',
    sortOrder = '',
  } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedArtistLocations',
      search,
      artistId,
      countryId,
      stateId,
      cityId,
      primary,
      active,
      source,
      createdBy,
      updatedBy,
      sortBy,
      sortOrder,
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
    artistId,
    countryId,
    stateId,
    cityId,
    primary,
    active,
    source,
    createdBy,
    updatedBy,
    sortBy,
    sortOrder,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedArtistLocations(
          page,
          rowsPerPage,
          filters,
          token,
          revalidate
        );
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.ArtistLocation.Hooks.useGetPaginatedArtistLocations',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtistLocation.Hooks.useGetPaginatedArtistLocations',
          'Failed to fetch paginated artist locations',
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
            'CityArtWalks.Actions.ArtistLocation.Hooks.useGetPaginatedArtistLocations',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtistLocation.Hooks.useGetPaginatedArtistLocations',
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
      artistLocations: Array.isArray(data?.data?.artistLocations) ? data.data.artistLocations : [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      artistLocationsLoading: isLoading,
      artistLocationsError: error,
      artistLocationsEmpty:
        !isLoading &&
        (!Array.isArray(data?.data?.artistLocations) || data.data.artistLocations.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single artist location by ID with comprehensive caching and error handling.
 * Provides efficient data retrieval with IndexedDB fallback and automatic cache management.
 *
 * Features:
 * - ID-based artist location lookup
 * - SWR caching with configurable revalidation
 * - IndexedDB fallback for offline support
 * - Automatic cache management
 * - Structured loading and error states
 * - Validation state tracking
 *
 * @async
 * @function useGetArtistLocationById
 * @memberof CityArtWalks.Actions.ArtistLocation.Hooks
 *
 * @example
 * // Basic usage
 * const { artistLocation, artistLocationLoading, artistLocationError } =
 *   useGetArtistLocationById(123);
 *
 * @example
 * // With authentication and custom revalidation
 * const result = useGetArtistLocationById(123, accessToken, 300);
 *
 * @param {string|number} id - The unique identifier of the artist location
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Artist location data with loading and error states
 * @returns {Object} returns.artistLocation - Artist location object or null
 * @returns {boolean} returns.artistLocationLoading - Loading state
 * @returns {Error} returns.artistLocationError - Error state
 * @returns {boolean} returns.artistLocationValidating - Revalidation state
 * @returns {boolean} returns.artistLocationEmpty - Empty state
 */
export function useGetArtistLocationById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getArtistLocationById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getArtistLocationById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.ArtistLocation.Hooks.useGetArtistLocationById',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtistLocation.Hooks.useGetArtistLocationById',
          'Failed to fetch artist location by ID',
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
            'CityArtWalks.Actions.ArtistLocation.Hooks.useGetArtistLocationById',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtistLocation.Hooks.useGetArtistLocationById',
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
      artistLocation: data?.data || null,
      artistLocationLoading: isLoading,
      artistLocationError: error,
      artistLocationValidating: isValidating,
      artistLocationEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * SWR hook for fetching all artist locations for a specific artist with comprehensive caching support.
 * Provides efficient retrieval of artist-specific location data with automatic cache management.
 *
 * Features:
 * - Artist-specific location filtering
 * - SWR caching with configurable revalidation
 * - IndexedDB fallback for offline support
 * - Automatic cache management
 * - Structured loading and error states
 * - Validation state tracking
 *
 * @async
 * @function useGetArtistLocationsByArtist
 * @memberof CityArtWalks.Actions.ArtistLocation.Hooks
 *
 * @example
 * // Basic usage
 * const { artistLocations, artistLocationsLoading, artistLocationsEmpty } =
 *   useGetArtistLocationsByArtist(456);
 *
 * @example
 * // With authentication and custom revalidation
 * const result = useGetArtistLocationsByArtist(456, accessToken, 300);
 *
 * @param {string|number} artistId - The unique identifier of the artist
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Artist locations data with loading and error states
 * @returns {Array} returns.artistLocations - Array of artist location objects
 * @returns {boolean} returns.artistLocationsLoading - Loading state
 * @returns {Error} returns.artistLocationsError - Error state
 * @returns {boolean} returns.artistLocationsValidating - Revalidation state
 * @returns {boolean} returns.artistLocationsEmpty - Empty state
 */
export function useGetArtistLocationsByArtist(artistId, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!artistId) return { swrKey: null, cacheKey: null };
    const key = ['getArtistLocationsByArtist', artistId, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [artistId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getArtistLocationsByArtist(artistId, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.ArtistLocation.Hooks.useGetArtistLocationsByArtist',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.ArtistLocation.Hooks.useGetArtistLocationsByArtist',
          'Failed to fetch artist locations by artist',
          {
            error: err.message,
            artistId,
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
            'CityArtWalks.Actions.ArtistLocation.Hooks.useGetArtistLocationsByArtist',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.ArtistLocation.Hooks.useGetArtistLocationsByArtist',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            artistId,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, artistId]);

  return useMemo(
    () => ({
      artistLocations: data?.data || [],
      artistLocationsLoading: isLoading,
      artistLocationsError: error,
      artistLocationsValidating: isValidating,
      artistLocationsEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook for creating a new artist location with comprehensive validation and automatic cache invalidation.
 * Provides efficient creation operations with immediate cache updates and error handling.
 *
 * Features:
 * - Artist location creation with validation
 * - Automatic SWR cache invalidation
 * - IndexedDB cache cleanup
 * - Comprehensive error handling
 * - Authentication support
 * - Structured response handling
 *
 * @async
 * @function useCreateArtistLocation
 * @memberof CityArtWalks.Actions.ArtistLocation.Hooks
 *
 * @example
 * // Basic usage
 * const createArtistLocation = useCreateArtistLocation(accessToken);
 * const newLocation = await createArtistLocation({
 *   artistId: 123,
 *   cityId: 456,
 *   address: '123 Main St',
 *   primary: true
 * });
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create an artist location
 * @returns {Promise<Object>} returns.result - Created artist location response
 * @throws {Error} When artist location data validation fails or API request encounters an error
 */
export function useCreateArtistLocation(token = '') {
  const { mutate } = useSWRConfig();

  return async (artistLocationData) => {
    try {
      const result = await requests.createArtistLocation(artistLocationData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artistLocation') ||
            key.includes('getPaginatedArtistLocations') ||
            key.includes('getArtistLocationsByArtist'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = [
        'artistLocation',
        'getPaginatedArtistLocations',
        'getArtistLocationsByArtist',
      ];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtistLocation.Hooks.useCreateArtistLocation',
        'Failed to create artist location',
        {
          error: error.message,
          artistLocationData: artistLocationData ? 'provided' : 'missing',
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for updating an existing artist location with comprehensive validation and automatic cache invalidation.
 * Provides efficient update operations with immediate cache updates and targeted invalidation.
 *
 * Features:
 * - Artist location updates with validation
 * - Targeted SWR cache invalidation (including specific ID)
 * - IndexedDB cache cleanup
 * - Comprehensive error handling
 * - Authentication support
 * - Structured response handling
 *
 * @async
 * @function useUpdateArtistLocation
 * @memberof CityArtWalks.Actions.ArtistLocation.Hooks
 *
 * @example
 * // Basic usage
 * const updateArtistLocation = useUpdateArtistLocation(accessToken);
 * const updatedLocation = await updateArtistLocation(123, {
 *   address: '456 Updated St',
 *   primary: false
 * });
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update an artist location
 * @returns {Promise<Object>} returns.result - Updated artist location response
 * @throws {Error} When artist location data validation fails or API request encounters an error
 */
export function useUpdateArtistLocation(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, artistLocationData) => {
    try {
      const result = await requests.updateArtistLocation(id, artistLocationData, token);

      // Invalidate SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artistLocation') ||
            key.includes('getPaginatedArtistLocations') ||
            key.includes('getArtistLocationsByArtist') ||
            (key.includes('getArtistLocationById') && key.includes(id)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = [
        'artistLocation',
        'getPaginatedArtistLocations',
        'getArtistLocationsByArtist',
      ];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtistLocation.Hooks.useUpdateArtistLocation',
        'Failed to update artist location',
        {
          error: error.message,
          artistLocationId: id,
          artistLocationData: artistLocationData ? 'provided' : 'missing',
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for deleting an artist location with comprehensive validation and automatic cache invalidation.
 * Provides secure deletion operations with immediate cache updates and comprehensive invalidation.
 *
 * Features:
 * - Artist location deletion with ID validation
 * - Comprehensive SWR cache invalidation (including specific ID)
 * - IndexedDB cache cleanup
 * - Comprehensive error handling
 * - Authentication support
 * - Structured response handling
 *
 * @async
 * @function useDeleteArtistLocation
 * @memberof CityArtWalks.Actions.ArtistLocation.Hooks
 *
 * @example
 * // Basic usage
 * const deleteArtistLocation = useDeleteArtistLocation(accessToken);
 * await deleteArtistLocation(123);
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete an artist location
 * @returns {Promise<Object>} returns.result - Deletion response
 * @throws {Error} When artist location ID is invalid or API request encounters an error
 */
export function useDeleteArtistLocation(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteArtistLocation(id, token);

      // Invalidate SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('artistLocation') ||
            key.includes('getPaginatedArtistLocations') ||
            key.includes('getArtistLocationsByArtist') ||
            (key.includes('getArtistLocationById') && key.includes(id)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = [
        'artistLocation',
        'getPaginatedArtistLocations',
        'getArtistLocationsByArtist',
      ];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.ArtistLocation.Hooks.useDeleteArtistLocation',
        'Failed to delete artist location',
        {
          error: error.message,
          artistLocationId: id,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Combined hook that provides all artist location mutation functions in a single interface.
 * Offers convenient access to all CRUD operations with consistent authentication and error handling.
 *
 * Features:
 * - Unified mutation interface for all artist location operations
 * - Consistent authentication across all operations
 * - Comprehensive error handling
 * - Automatic cache invalidation for all mutations
 * - Convenient single-hook access to all operations
 *
 * @function useArtistLocationMutations
 * @memberof CityArtWalks.Actions.ArtistLocation.Hooks
 *
 * @example
 * // Basic usage
 * const { createArtistLocation, updateArtistLocation, deleteArtistLocation } =
 *   useArtistLocationMutations(accessToken);
 *
 * // Create operation
 * const newLocation = await createArtistLocation({
 *   artistId: 123,
 *   cityId: 456,
 *   address: '123 Main St'
 * });
 *
 * // Update operation
 * await updateArtistLocation(123, { address: '456 Updated St' });
 *
 * // Delete operation
 * await deleteArtistLocation(123);
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.createArtistLocation - Function to create artist location
 * @returns {Function} returns.updateArtistLocation - Function to update artist location
 * @returns {Function} returns.deleteArtistLocation - Function to delete artist location
 */
export function useArtistLocationMutations(token = '') {
  const createArtistLocation = useCreateArtistLocation(token);
  const updateArtistLocation = useUpdateArtistLocation(token);
  const deleteArtistLocation = useDeleteArtistLocation(token);

  return {
    createArtistLocation,
    updateArtistLocation,
    deleteArtistLocation,
  };
}
