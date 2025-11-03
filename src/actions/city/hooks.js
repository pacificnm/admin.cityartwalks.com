/**
 * @file hooks.js
 * @description React hooks for City operations using SWR with IndexedDB caching, automatic cache invalidation, and comprehensive CRUD operations
 * @namespace CityArtWalks.Actions.City.Hooks
 * @version 2.1.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
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
 * SWR hook for paginated cities with IndexedDB caching support.
 * Provides comprehensive filtering, pagination, and caching capabilities for city data.
 *
 * Features:
 * - Paginated city retrieval with configurable page size
 * - Multiple filter options (search, active status, location filters)
 * - SWR-based caching with revalidation control
 * - IndexedDB fallback caching for offline support
 * - Manual refresh capabilities
 * - Comprehensive error handling and logging
 *
 * @function useGetPaginatedCities
 * @memberof CityArtWalks.Actions.City.Hooks
 *
 * @example
 * // Basic usage with pagination
 * const { cities, citiesLoading, paginationMeta } = useGetPaginatedCities(
 *   {},
 *   1,
 *   10,
 *   accessToken
 * );
 *
 * @example
 * // With comprehensive filtering
 * const { cities, citiesLoading, mutate } = useGetPaginatedCities(
 *   {
 *     search: 'San Francisco',
 *     active: true,
 *     stateId: 5,
 *     countryId: 1
 *   },
 *   1,
 *   20,
 *   accessToken,
 *   600
 * );
 *
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for city names
 * @param {boolean} [filters.active] - Filter by active status
 * @param {number} [filters.stateId] - Filter by state ID
 * @param {number} [filters.countryId] - Filter by country ID
 * @param {string} [filters.slug] - Filter by slug
 * @param {string} [filters.createdBy] - Creator user ID filter
 * @param {string} [filters.updatedBy] - Updater user ID filter
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Hook state with cities data and handlers
 */
export function useGetPaginatedCities(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', active, stateId, countryId, slug = '', createdBy, updatedBy } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedCities',
      search,
      active,
      stateId,
      countryId,
      slug,
      createdBy,
      updatedBy,
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
    active,
    stateId,
    countryId,
    slug,
    createdBy,
    updatedBy,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedCities(
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
          'CityArtWalks.Actions.City.Hooks.useGetPaginatedCities',
          'Failed to fetch paginated cities',
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
          'CityArtWalks.Actions.City.Hooks.useGetPaginatedCities',
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
      cities: data?.data?.cities || [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      citiesLoading: isLoading,
      citiesError: error,
      citiesEmpty: !isLoading && (!data?.data?.cities || data?.data?.cities.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * Custom hook for fetching active cities with SWR caching.
 * Specialized hook for retrieving only active/published cities.
 * Note: This is a custom hook, not part of standard CRUD operations.
 *
 * Features:
 * - Fetches only active cities
 * - SWR-based caching with revalidation
 * - IndexedDB fallback caching
 * - Comprehensive error handling
 *
 * @function useGetActiveCities
 * @memberof CityArtWalks.Actions.City.Hooks
 *
 * @example
 * // Get active cities for dropdown
 * const { cities, citiesLoading } = useGetActiveCities(accessToken);
 *
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Hook state with active cities data
 */

export function useGetActiveCities(token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getActiveCities', revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getActiveCities(token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.City.Hooks.useGetActiveCities',
          'Failed to fetch active cities',
          {
            error: err.message,
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
          'CityArtWalks.Actions.City.Hooks.useGetActiveCities',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  return useMemo(
    () => ({
      cities: data?.data || [],
      citiesLoading: isLoading,
      citiesError: error,
      citiesValidating: isValidating,
      citiesEmpty: !isLoading && (!data?.data || data?.data.length === 0),
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * SWR hook for fetching a single city by ID with IndexedDB caching.
 * Provides detailed city information for a specific city ID.
 *
 * Features:
 * - Single city data retrieval by unique ID
 * - Conditional fetching (only when ID is provided)
 * - SWR-based caching with revalidation control
 * - IndexedDB fallback caching for offline support
 * - Comprehensive error handling and validation states
 *
 * @function useGetCityById
 * @memberof CityArtWalks.Actions.City.Hooks
 *
 * @example
 * // Fetch specific city
 * const { city, cityLoading, cityError } = useGetCityById(123, accessToken);
 *
 * @param {string|number} id - The unique identifier of the city
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Hook state with city data and loading states
 */
export function useGetCityById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getCityById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getCityById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError('CityArtWalks.Actions.City.Hooks.useGetCityById', 'Failed to fetch city by ID', {
          error: err.message,
          id,
          token: token ? '[REDACTED]' : 'none',
        });
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
          'CityArtWalks.Actions.City.Hooks.useGetCityById',
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
      city: data?.data || null,
      cityLoading: isLoading,
      cityError: error,
      cityValidating: isValidating,
      cityEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Custom hook for fetching city by geographic location path.
 * Retrieves city data using country/state/city slug hierarchy.
 * Note: This is a custom hook for geographic navigation, not part of standard CRUD operations.
 *
 * Features:
 * - Geographic path-based city lookup
 * - Hierarchical slug navigation (country/state/city)
 * - Conditional fetching (only when all slugs provided)
 * - SWR-based caching with revalidation
 * - IndexedDB fallback caching
 *
 * @function useGetCityByLocation
 * @memberof CityArtWalks.Actions.City.Hooks
 *
 * @example
 * // Get city by geographic path
 * const { city, cityLoading } = useGetCityByLocation(
 *   'united-states',
 *   'california',
 *   'san-francisco',
 *   accessToken
 * );
 *
 * @param {string} countrySlug - Country slug identifier
 * @param {string} stateSlug - State slug identifier
 * @param {string} citySlug - City slug identifier
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Hook state with city data
 */
export function useGetCityByLocation(
  countrySlug,
  stateSlug,
  citySlug,
  token = '',
  revalidate = 600
) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!countrySlug || !stateSlug || !citySlug) return { swrKey: null, cacheKey: null };
    const key = ['getCityByLocation', countrySlug, stateSlug, citySlug, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [countrySlug, stateSlug, citySlug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getCityByLocation(
          countrySlug,
          stateSlug,
          citySlug,
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
          'CityArtWalks.Actions.City.Hooks.useGetCityByLocation',
          'Failed to fetch city by location',
          {
            error: err.message,
            countrySlug: countrySlug ? '[REDACTED]' : 'none',
            stateSlug: stateSlug ? '[REDACTED]' : 'none',
            citySlug: citySlug ? '[REDACTED]' : 'none',
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
          'CityArtWalks.Actions.City.Hooks.useGetCityByLocation',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            countrySlug: countrySlug ? '[REDACTED]' : 'none',
            stateSlug: stateSlug ? '[REDACTED]' : 'none',
            citySlug: citySlug ? '[REDACTED]' : 'none',
          }
        );
      }
    })();
  }, [cacheKey, citySlug, countrySlug, mutate, revalidateMs, stateSlug]);

  return useMemo(
    () => ({
      city: data?.data || null,
      cityLoading: isLoading,
      cityError: error,
      cityValidating: isValidating,
      cityEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook for creating a new city with automatic cache invalidation.
 * Provides city creation functionality with comprehensive cache management.
 *
 * Features:
 * - City creation with form data or JSON support
 * - Automatic SWR cache invalidation
 * - IndexedDB cache cleanup
 * - Comprehensive error handling and logging
 * - Form validation support
 *
 * @function useCreateCity
 * @memberof CityArtWalks.Actions.City.Hooks
 *
 * @example
 * // Create new city
 * const createCity = useCreateCity(accessToken);
 * const newCity = await createCity({
 *   name: 'New City',
 *   slug: 'new-city',
 *   stateId: 1,
 *   countryId: 1,
 *   active: true
 * });
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create a city
 */
export function useCreateCity(token = '') {
  const { mutate } = useSWRConfig();

  return async (cityData) => {
    try {
      const result = await requests.createCity(cityData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('city') ||
            key.includes('getPaginatedCities') ||
            key.includes('getActiveCities'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['city', 'getPaginatedCities', 'getActiveCities'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.City.Hooks.useCreateCity', 'Failed to create city', {
        error: error.message,
        cityData: cityData ? (cityData instanceof FormData ? 'FormData' : 'provided') : 'missing',
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Hook for updating an existing city with automatic cache invalidation.
 * Provides city update functionality with comprehensive cache management.
 *
 * Features:
 * - Partial or complete city updates
 * - Automatic SWR cache invalidation for related data
 * - IndexedDB cache cleanup
 * - Form data and JSON support
 * - Comprehensive error handling and logging
 *
 * @function useUpdateCity
 * @memberof CityArtWalks.Actions.City.Hooks
 *
 * @example
 * // Update existing city
 * const updateCity = useUpdateCity(accessToken);
 * const updated = await updateCity(123, {
 *   name: 'Updated City Name',
 *   active: false
 * });
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update a city
 */
export function useUpdateCity(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, cityData) => {
    try {
      const result = await requests.updateCity(id, cityData, token);

      // Invalidate SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('city') ||
            key.includes('getPaginatedCities') ||
            key.includes('getActiveCities') ||
            (key.includes('getCityById') && key.includes(id)) ||
            key.includes('getCityByLocation'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['city', 'getPaginatedCities', 'getActiveCities'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.City.Hooks.useUpdateCity', 'Failed to update city', {
        error: error.message,
        cityId: id,
        cityData: cityData ? (cityData instanceof FormData ? 'FormData' : 'provided') : 'missing',
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Hook for deleting a city with automatic cache invalidation.
 * Provides city deletion functionality with comprehensive cache management.
 *
 * Features:
 * - Permanent city deletion
 * - Automatic SWR cache invalidation for all related data
 * - IndexedDB cache cleanup
 * - Comprehensive error handling and logging
 * - Authorization validation
 *
 * @function useDeleteCity
 * @memberof CityArtWalks.Actions.City.Hooks
 *
 * @example
 * // Delete city
 * const deleteCity = useDeleteCity(accessToken);
 * await deleteCity(123);
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete a city
 */
export function useDeleteCity(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteCity(id, token);

      // Invalidate SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('city') ||
            key.includes('getPaginatedCities') ||
            key.includes('getActiveCities') ||
            (key.includes('getCityById') && key.includes(id)) ||
            key.includes('getCityByLocation'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['city', 'getPaginatedCities', 'getActiveCities'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.City.Hooks.useDeleteCity', 'Failed to delete city', {
        error: error.message,
        cityId: id,
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Combined hook that provides all city mutation functions.
 * Convenient wrapper that aggregates create, update, and delete operations.
 *
 * Features:
 * - Single hook for all city mutations
 * - Consistent authentication token usage
 * - Unified error handling approach
 * - Convenient API for components requiring multiple operations
 *
 * @function useCityMutations
 * @memberof CityArtWalks.Actions.City.Hooks
 *
 * @example
 * // Get all mutation functions
 * const { createCity, updateCity, deleteCity } = useCityMutations(accessToken);
 *
 * // Use any of the functions
 * await createCity(newCityData);
 * await updateCity(123, updateData);
 * await deleteCity(456);
 *
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 */
export function useCityMutations(token = '') {
  const createCity = useCreateCity(token);
  const updateCity = useUpdateCity(token);
  const deleteCity = useDeleteCity(token);

  return {
    createCity,
    updateCity,
    deleteCity,
  };
}

// ==========================================
// BACKWARD COMPATIBILITY ALIASES
// ==========================================

/**
 * @deprecated Use useGetPaginatedCities instead
 * @memberof CityArtWalks.Actions.City.Hooks
 */
export const useGetCities = useGetPaginatedCities;

/**
 * @deprecated Use useGetCityById instead
 * @memberof CityArtWalks.Actions.City.Hooks
 */
export const useGetCity = useGetCityById;
