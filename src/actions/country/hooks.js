/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for Country.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.Country.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country} - Country entity documentation
 */

import { useMemo, useEffect } from 'react';

import { useBaseHook } from 'src/lib/base-hook';

import { CountryApiClient } from './requests';

// Create a single instance to use across all hooks
const countryApiClient = new CountryApiClient();

/**
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useGetPaginatedCountries
 * @description Hook to get paginated countries with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {boolean} [params.active] - Active status filter
 * @param {boolean} [params.featured] - Featured filter
 * @param {string} [params.continent] - Continent filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.countriesLoading - Loading state
 * @returns {Error} result.countriesError - Error state
 * @returns {boolean} result.countriesValidating - Validation state
 * @returns {boolean} result.countriesEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedCountries(params = {}, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.Country.Hooks');

  const {
    page = 1,
    limit = 10,
    search = '',
    active,
    featured,
    continent,
    createdBy,
    updatedBy,
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      'getPaginatedCountries',
      page,
      limit,
      search,
      active,
      featured,
      continent,
      createdBy,
      updatedBy,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    page,
    limit,
    search,
    active,
    featured,
    continent,
    createdBy,
    updatedBy,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await countryApiClient.getPaginatedCountries(
        { page, limit, search, active, featured, continent, createdBy, updatedBy },
        revalidate
      );
      return response;
    },
    revalidate
  );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const results = data?.results || {};
    return {
      results, // Complete API results object with data, pagination, performance, etc.
      countriesLoading: isLoading,
      countriesError: error,
      countriesValidating: isValidating,
      countriesEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useGetCountry
 * @description Hook to get country by ID with IndexedDB caching.
 *
 * @param {string|number} countryId - The country ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and country data
 * @throws {Error} When countryId is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetCountry(countryId, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.Country.Hooks');

  const { swrKey } = useMemo(() => {
    if (!countryId) return { swrKey: null };
    const key = ['getCountry', countryId, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, countryId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await countryApiClient.getCountry(countryId, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const country = data?.results?.data || null;
    return {
      country,
      countryLoading: isLoading,
      countryError: error,
      countryValidating: isValidating,
      countryEmpty: !isLoading && !country,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useGetCountryBySlug
 * @description Hook to get country by slug with IndexedDB caching.
 *
 * @param {string} slug - The country slug
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and country data
 * @throws {Error} When slug is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetCountryBySlug(slug, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.Country.Hooks');

  const { swrKey } = useMemo(() => {
    if (!slug) return { swrKey: null };
    const key = ['getCountryBySlug', slug, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, slug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await countryApiClient.getCountryBySlug(slug, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const country = data?.results?.data || null;
    return {
      country,
      countryLoading: isLoading,
      countryError: error,
      countryValidating: isValidating,
      countryEmpty: !isLoading && !country,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useCreateCountry
 * @description Hook to create a new country with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (country) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When country data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createCountry = useCreateCountry();
 * await createCountry.mutate(countryData);
 */
export function useCreateCountry() {
  const baseHook = useBaseHook('CityArtWalks.Actions.Country.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (country) => {
      const result = await countryApiClient.createCountry(country);
      return result;
    },
    ['country', 'getPaginatedCountries']
  );
}

/**
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useUpdateCountry
 * @description Hook to update an existing country with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, countryData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When country ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateCountry = useUpdateCountry();
 * await updateCountry.mutate(countryId, updatedCountryData);
 */
export function useUpdateCountry() {
  const baseHook = useBaseHook('CityArtWalks.Actions.Country.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (id, country) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error('useUpdateCountry', 'Country ID is required');
        throw new Error('Country ID is required');
      }

      const result = await countryApiClient.updateCountry(id, country);
      return result;
    },
    ['country', 'getPaginatedCountries']
  );
}

/**
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useDeleteCountry
 * @description Hook to delete a country with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When country ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteCountry = useDeleteCountry();
 * await deleteCountry.mutate(countryId);
 */
export function useDeleteCountry() {
  const baseHook = useBaseHook('CityArtWalks.Actions.Country.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error('useDeleteCountry', 'Country ID is required');
        throw new Error('Country ID is required');
      }

      const result = await countryApiClient.deleteCountry(id);
      return result;
    },
    ['country', 'getPaginatedCountries']
  );
}

/**
 * @memberof CityArtWalks.Actions.Country.Hooks
 * @function useCountryMutations
 * @description Hook that returns all country mutation functions for convenient access.
 *
 * @returns {Object} Collection of all country mutation functions
 * @returns {Function} result.createCountry - Create country mutation function
 * @returns {Function} result.updateCountry - Update country mutation function
 * @returns {Function} result.deleteCountry - Delete country mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createCountry, updateCountry, deleteCountry } = useCountryMutations();
 * await createCountry.mutate(countryData);
 * await updateCountry.mutate(countryId, updatedData);
 * await deleteCountry.mutate(countryId);
 */
export function useCountryMutations() {
  const createCountry = useCreateCountry();
  const updateCountry = useUpdateCountry();
  const deleteCountry = useDeleteCountry();

  return {
    createCountry,
    updateCountry,
    deleteCountry,
  };
}
