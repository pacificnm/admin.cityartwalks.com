/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for City.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.City.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City} - City entity documentation
 */

import { useMemo, useEffect } from 'react';

import { useBaseHook } from 'src/lib/base-hook';

import { CityApiClient } from './requests';

const cityApiClient = new CityApiClient();

/**
 * @memberof CityArtWalks.Actions.City.Hooks
 * @function useGetPaginatedCities
 * @description Hook to get paginated cities with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {boolean} [params.active] - Active status filter
 * @param {number} [params.stateId] - State ID filter
 * @param {number} [params.countryId] - Country ID filter
 * @param {string} [params.slug] - Slug filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.citiesLoading - Loading state
 * @returns {Error} result.citiesError - Error state
 * @returns {boolean} result.citiesValidating - Validation state
 * @returns {boolean} result.citiesEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedCities(params = {}, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.City.Hooks');

  const {
    page = 1,
    limit = 10,
    search = '',
    active,
    stateId,
    countryId,
    slug,
    createdBy,
    updatedBy,
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      'getPaginatedCities',
      page,
      limit,
      search,
      active,
      stateId,
      countryId,
      slug,
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
    stateId,
    countryId,
    slug,
    createdBy,
    updatedBy,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await cityApiClient.getPaginatedCities(
        { page, limit, search, active, stateId, countryId, slug, createdBy, updatedBy },
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
      citiesLoading: isLoading,
      citiesError: error,
      citiesValidating: isValidating,
      citiesEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.City.Hooks
 * @function useGetActiveCities
 * @description Hook to get active cities with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and cities data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetActiveCities(revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.City.Hooks');

  const { swrKey } = useMemo(() => {
    const key = ['getActiveCities', revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await cityApiClient.getActiveCities(revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const cities = data?.results?.data || [];
    return {
      cities,
      citiesLoading: isLoading,
      citiesError: error,
      citiesValidating: isValidating,
      citiesEmpty: !isLoading && (!cities || cities.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.City.Hooks
 * @function useGetCityById
 * @description Hook to get city by ID with IndexedDB caching.
 *
 * @param {string|number} id - The city ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and city data
 * @throws {Error} When city ID is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetCityById(id, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.City.Hooks');

  const { swrKey } = useMemo(() => {
    if (!id) return { swrKey: null };
    const key = ['getCityById', id, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await cityApiClient.getCity(id, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const city = data?.results?.data || null;
    return {
      city,
      cityLoading: isLoading,
      cityError: error,
      cityValidating: isValidating,
      cityEmpty: !isLoading && !city,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.City.Hooks
 * @function useGetCityByLocation
 * @description Hook to get city by geographic location (country/state/city slugs) with IndexedDB caching.
 *
 * @param {string} countrySlug - Country slug identifier
 * @param {string} stateSlug - State slug identifier
 * @param {string} citySlug - City slug identifier
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and city data
 * @throws {Error} When slugs are invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetCityByLocation(
  countrySlug,
  stateSlug,
  citySlug,
  revalidate = 600
) {
  const baseHook = useBaseHook('CityArtWalks.Actions.City.Hooks');

  const { swrKey } = useMemo(() => {
    if (!countrySlug || !stateSlug || !citySlug) return { swrKey: null };
    const key = ['getCityByLocation', countrySlug, stateSlug, citySlug, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, countrySlug, stateSlug, citySlug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await cityApiClient.getCityByLocation(
        countrySlug,
        stateSlug,
        citySlug,
        revalidate
      );
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const city = data?.results?.data || null;
    return {
      city,
      cityLoading: isLoading,
      cityError: error,
      cityValidating: isValidating,
      cityEmpty: !isLoading && !city,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.City.Hooks
 * @function useCreateCity
 * @description Hook to create a new city with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (city) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When city data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createCity = useCreateCity();
 * await createCity.mutate(cityData);
 */
export function useCreateCity() {
  const baseHook = useBaseHook('CityArtWalks.Actions.City.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (city) => {
      const result = await cityApiClient.createCity(city);
      return result;
    },
    ['city', 'getPaginatedCities', 'getActiveCities']
  );
}

/**
 * @memberof CityArtWalks.Actions.City.Hooks
 * @function useUpdateCity
 * @description Hook to update an existing city with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, cityData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When city ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateCity = useUpdateCity();
 * await updateCity.mutate(cityId, updatedCityData);
 */
export function useUpdateCity() {
  const baseHook = useBaseHook('CityArtWalks.Actions.City.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (id, city) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error('useUpdateCity', 'City ID is required');
        throw new Error('City ID is required');
      }

      const result = await cityApiClient.updateCity(id, city);
      return result;
    },
    ['city', 'getPaginatedCities', 'getActiveCities']
  );
}

/**
 * @memberof CityArtWalks.Actions.City.Hooks
 * @function useDeleteCity
 * @description Hook to delete a city with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When city ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteCity = useDeleteCity();
 * await deleteCity.mutate(cityId);
 */
export function useDeleteCity() {
  const baseHook = useBaseHook('CityArtWalks.Actions.City.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error('useDeleteCity', 'City ID is required');
        throw new Error('City ID is required');
      }

      const result = await cityApiClient.deleteCity(id);
      return result;
    },
    ['city', 'getPaginatedCities', 'getActiveCities']
  );
}

/**
 * @memberof CityArtWalks.Actions.City.Hooks
 * @function useCityMutations
 * @description Hook that returns all city mutation functions for convenient access.
 *
 * @returns {Object} Collection of all city mutation functions
 * @returns {Function} result.createCity - Create city mutation function
 * @returns {Function} result.updateCity - Update city mutation function
 * @returns {Function} result.deleteCity - Delete city mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createCity, updateCity, deleteCity } = useCityMutations();
 * await createCity.mutate(cityData);
 * await updateCity.mutate(cityId, updatedData);
 * await deleteCity.mutate(cityId);
 */
export function useCityMutations() {
  const createCity = useCreateCity();
  const updateCity = useUpdateCity();
  const deleteCity = useDeleteCity();

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
