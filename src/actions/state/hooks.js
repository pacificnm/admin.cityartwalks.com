/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for State.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.State.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State} - State entity documentation
 */

import { useMemo, useEffect } from 'react';

import { useBaseHook } from 'src/lib/base-hook';

import { StateApiClient } from './requests';

// Create a single instance to use across all hooks
const stateApiClient = new StateApiClient();

/**
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useGetPaginatedStates
 * @description Hook to get paginated states with full filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.search=''] - Search term
 * @param {boolean} [params.active] - Active status filter
 * @param {number} [params.countryId] - Country ID filter
 * @param {string} [params.slug] - Slug filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.statesLoading - Loading state
 * @returns {Error} result.statesError - Error state
 * @returns {boolean} result.statesValidating - Validation state
 * @returns {boolean} result.statesEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedStates(params = {}, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.State.Hooks');

  const {
    page = 1,
    limit = 10,
    search = '',
    active,
    countryId,
    slug,
    createdBy,
    updatedBy,
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      'getPaginatedStates',
      page,
      limit,
      search,
      active,
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
    countryId,
    slug,
    createdBy,
    updatedBy,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await stateApiClient.getPaginatedStates(
        { page, limit, search, active, countryId, slug, createdBy, updatedBy },
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
      statesLoading: isLoading,
      statesError: error,
      statesValidating: isValidating,
      statesEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useGetStateById
 * @description Hook to get state by ID with IndexedDB caching.
 *
 * @param {string|number} id - The state ID
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and state data
 * @throws {Error} When state ID is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetStateById(id, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.State.Hooks');

  const { swrKey } = useMemo(() => {
    if (!id) return { swrKey: null };
    const key = ['getStateById', id, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await stateApiClient.getStateById(id, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const state = data?.results?.data || null;
    return {
      state,
      stateLoading: isLoading,
      stateError: error,
      stateValidating: isValidating,
      stateEmpty: !isLoading && !state,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useGetStateBySlug
 * @description Hook to get state by slug with IndexedDB caching.
 *
 * @param {string} slug - The state slug
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and state data
 * @throws {Error} When slug is invalid or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetStateBySlug(slug, revalidate = 600) {
  const baseHook = useBaseHook('CityArtWalks.Actions.State.Hooks');

  const { swrKey } = useMemo(() => {
    if (!slug) return { swrKey: null };
    const key = ['getStateBySlug', slug, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, slug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = baseHook.useSWRWithCache(
    swrKey,
    async () => {
      const response = await stateApiClient.getStateBySlug(slug, revalidate);
      return response;
    },
    revalidate
  );

  return useMemo(() => {
    const state = data?.results?.data || null;
    return {
      state,
      stateLoading: isLoading,
      stateError: error,
      stateValidating: isValidating,
      stateEmpty: !isLoading && !state,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useCreateState
 * @description Hook to create a new state with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (state) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When state data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const createState = useCreateState();
 * await createState.mutate(stateData);
 */
export function useCreateState() {
  const baseHook = useBaseHook('CityArtWalks.Actions.State.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (state) => {
      const result = await stateApiClient.createState(state);
      return result;
    },
    ['state', 'getPaginatedStates']
  );
}

/**
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useUpdateState
 * @description Hook to update an existing state with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id, stateData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When state ID is missing, data validation fails, or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateState = useUpdateState();
 * await updateState.mutate(stateId, updatedStateData);
 */
export function useUpdateState() {
  const baseHook = useBaseHook('CityArtWalks.Actions.State.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (id, state) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error('useUpdateState', 'State ID is required');
        throw new Error('State ID is required');
      }

      const result = await stateApiClient.updateState(id, state);
      return result;
    },
    ['state', 'getPaginatedStates']
  );
}

/**
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useDeleteState
 * @description Hook to delete a state with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (id) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When state ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteState = useDeleteState();
 * await deleteState.mutate(stateId);
 */
export function useDeleteState() {
  const baseHook = useBaseHook('CityArtWalks.Actions.State.Hooks');

  return baseHook.useMutationWithInvalidation(
    async (id) => {
      // Validate parameters
      if (!id) {
        baseHook.logger.error('useDeleteState', 'State ID is required');
        throw new Error('State ID is required');
      }

      const result = await stateApiClient.deleteState(id);
      return result;
    },
    ['state', 'getPaginatedStates']
  );
}

/**
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useStateMutations
 * @description Hook that returns all state mutation functions for convenient access.
 *
 * @returns {Object} Collection of all state mutation functions
 * @returns {Function} result.createState - Create state mutation function
 * @returns {Function} result.updateState - Update state mutation function
 * @returns {Function} result.deleteState - Delete state mutation function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const { createState, updateState, deleteState } = useStateMutations();
 * await createState.mutate(stateData);
 * await updateState.mutate(stateId, updatedData);
 * await deleteState.mutate(stateId);
 */
export function useStateMutations() {
  const createState = useCreateState();
  const updateState = useUpdateState();
  const deleteState = useDeleteState();

  return {
    createState,
    updateState,
    deleteState,
  };
}
