/**
 * React hooks for Country operations using SWR and IndexedDB caching.
 *
 * Provides hooks for Country CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation.
 *
 * @namespace CityArtWalks.Actions.Country.Hooks
 * @fileoverview React hooks for Country data operations
 * @author [Your Name]
 * @version 2.1.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Country}
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
 * SWR hook for paginated countries with IndexedDB caching support.
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useGetPaginatedCountries
 * @param {Object} [filters={}] - Filter parameters object
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated countries result with IndexedDB caching
 * @throws {Error} When API request or cache fails
 */
export function useGetPaginatedCountries(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  // Remove deprecated status, use active boolean and featured
  const {
    search = '',
    active = '',
    featured = '',
    createdBy = '',
    updatedBy = '',
    cityId = '',
    stateId = '',
  } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedCountries',
      search,
      active,
      featured,
      createdBy,
      updatedBy,
      cityId,
      stateId,
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
    featured,
    createdBy,
    updatedBy,
    cityId,
    stateId,
    page,
    rowsPerPage,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedCountries(
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
          'CityArtWalks.Actions.Country.Hooks.useGetPaginatedCountries',
          'Failed to fetch paginated countries',
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Country.Hooks.useGetPaginatedCountries',
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
      countries: data?.data?.countries || [],
      paginationMeta: data?.data?.meta || { total: 0, page, rowsPerPage, totalPages: 0 },
      countriesLoading: isLoading,
      countriesError: error,
      countriesEmpty: !isLoading && (!data?.data?.countries || data?.data?.countries.length === 0),
      mutate,
    }),
    [data?.data?.countries, data?.data?.meta, page, rowsPerPage, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single country by ID with IndexedDB caching.
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useGetCountryById
 * @param {string|number} id - The unique identifier of the country
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Country data with loading and error states
 * @throws {Error} When API request or cache fails
 */
export function useGetCountryById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getCountryById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getCountryById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Country.Hooks.useGetCountryById',
          'Failed to fetch country by ID',
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Country.Hooks.useGetCountryById',
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
      country: data?.data || null,
      countryLoading: isLoading,
      countryError: error,
      countryValidating: isValidating,
      countryEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * SWR hook for fetching a single country by slug with IndexedDB caching.
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useGetCountryBySlug
 * @param {string} slug - The unique slug identifier for the country
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Country data with loading and error states
 * @throws {Error} When API request or cache fails
 */
export function useGetCountryBySlug(slug, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!slug) return { swrKey: null, cacheKey: null };
    const key = ['getCountryBySlug', slug, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [slug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getCountryBySlug(slug, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.Country.Hooks.useGetCountryBySlug',
          'Failed to fetch country by slug',
          {
            error: err.message,
            slug: slug ? '[REDACTED]' : 'none',
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
          debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.Country.Hooks.useGetCountryBySlug',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            slug: slug ? '[REDACTED]' : 'none',
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, slug]);

  return useMemo(
    () => ({
      country: data?.data || null,
      countryLoading: isLoading,
      countryError: error,
      countryValidating: isValidating,
      countryEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * Hook for creating a new country with automatic cache invalidation.
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useCreateCountry
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create a country
 * @throws {Error} When country data validation fails or API request encounters an error
 */
export function useCreateCountry(token = '') {
  const { mutate } = useSWRConfig();

  return async (countryData) => {
    try {
      const result = await requests.createCountry(countryData, token);

      mutate(
        (key) =>
          Array.isArray(key) && (key.includes('country') || key.includes('getPaginatedCountries'))
      );

      const cachePatterns = ['country', 'getPaginatedCountries'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Country.Hooks.useCreateCountry',
        'Failed to create country',
        {
          error: error.message,
          countryData: countryData
            ? countryData instanceof FormData
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
 * Hook for updating an existing country with automatic cache invalidation.
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useUpdateCountry
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update a country
 * @throws {Error} When country data validation fails or API request encounters an error
 */
export function useUpdateCountry(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, countryData) => {
    try {
      const result = await requests.updateCountry(id, countryData, token);

      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('country') ||
            key.includes('getPaginatedCountries') ||
            (key.includes('getCountryById') && key.includes(id)) ||
            key.includes('getCountryBySlug'))
      );

      const cachePatterns = ['country', 'getPaginatedCountries'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Country.Hooks.useUpdateCountry',
        'Failed to update country',
        {
          error: error.message,
          countryId: id,
          countryData: countryData
            ? countryData instanceof FormData
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
 * Hook for deleting a country with automatic cache invalidation.
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useDeleteCountry
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete a country
 * @throws {Error} When country ID is invalid or API request encounters an error
 */
export function useDeleteCountry(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteCountry(id, token);

      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('country') ||
            key.includes('getPaginatedCountries') ||
            (key.includes('getCountryById') && key.includes(id)) ||
            key.includes('getCountryBySlug'))
      );

      const cachePatterns = ['country', 'getPaginatedCountries'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.Country.Hooks.useDeleteCountry',
        'Failed to delete country',
        {
          error: error.message,
          countryId: id,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Combined hook that provides all country mutation functions.
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useCountryMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 */
export function useCountryMutations(token = '') {
  const createCountry = useCreateCountry(token);
  const updateCountry = useUpdateCountry(token);
  const deleteCountry = useDeleteCountry(token);

  return {
    createCountry,
    updateCountry,
    deleteCountry,
  };
}
