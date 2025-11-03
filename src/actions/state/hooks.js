/**
 * React hooks for State operations using SWR and IndexedDB caching
 *
 * This module provides React hooks for State CRUD operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states.
 *
 * @namespace CityArtWalks.Actions.State.Hooks
 * @fileoverview React hooks for State data operations
 * @author Jaimie Garner
 * @version 2.1.1
 *
 * @requires useSWR - SWR library for data fetching
 * @requires React - React hooks (useMemo, useEffect)
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 * @requires CityArtWalks.Lib.IndexedDB - IndexedDB caching utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
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
 * SWR hook for paginated states with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useGetPaginatedStates
 * @param {Object} [filters={}] - Filter parameters object
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated states result with IndexedDB caching
 * @throws {Error} When fetching fails or validation errors occur
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 */
export function useGetPaginatedStates(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const revalidateMs = revalidate * 1000;
  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getPaginatedStates', page, rowsPerPage, JSON.stringify(filters), revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [page, rowsPerPage, filters, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedStates(
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
          'CityArtWalks.Actions.State.Hooks.useGetPaginatedStates',
          'Failed to fetch paginated states',
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
          'CityArtWalks.Actions.State.Hooks.useGetPaginatedStates',
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
      states: data?.data?.states || [],
      paginationMeta: data?.data?.meta || { total: 0, page: 1, rowsPerPage: 10, totalPages: 0 },
      statesLoading: isLoading,
      statesError: error,
      statesEmpty: !isLoading && (!data?.data?.states || data?.data?.states.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single state by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useGetStateById
 * @param {string|number} id - The unique identifier of the state
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} State data with loading and error states
 * @throws {Error} When fetching fails or validation errors occur
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 */
export function useGetStateById(id, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;
  const { swrKey, cacheKey } = useMemo(() => {
    if (!id) return { swrKey: null, cacheKey: null };
    const key = ['getStateById', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getStateById(id, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.State.Hooks.useGetStateById',
          'Failed to fetch state by ID',
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
          'CityArtWalks.Actions.State.Hooks.useGetStateById',
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
      state: data?.data?.state || null,
      stateLoading: isLoading,
      stateError: error,
      stateValidating: isValidating,
      stateEmpty: !isLoading && !data?.data?.state,
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );
}

/**
 * SWR hook for fetching a single state by slug with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useGetStateBySlug
 * @param {string} slug - The unique slug identifier for the state
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} State data with loading and error states
 * @throws {Error} When fetching fails or validation errors occur
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 */
export function useGetStateBySlug(slug, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;
  const { swrKey, cacheKey } = useMemo(() => {
    if (!slug) return { swrKey: null, cacheKey: null };
    const key = ['getStateBySlug', slug, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [slug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getStateBySlug(slug, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(`[IndexedDB] Saved data for ${cacheKey}`);
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.State.Hooks.useGetStateBySlug',
          'Failed to fetch state by slug',
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
          'CityArtWalks.Actions.State.Hooks.useGetStateBySlug',
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
      state: data?.data?.state || null,
      stateLoading: isLoading,
      stateError: error,
      stateValidating: isValidating,
      stateEmpty: !isLoading && !data?.data?.state,
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );
}

/**
 * Hook for creating a new state with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useCreateState
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to create a state
 * @throws {Error} When state data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 */
export function useCreateState(token = '') {
  const { mutate } = useSWRConfig();

  return async (stateData) => {
    try {
      const result = await requests.createState(stateData, token);

      // Invalidate SWR cache
      mutate(
        (key) => Array.isArray(key) && (key.includes('state') || key.includes('getPaginatedStates'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['state', 'getPaginatedStates'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.State.Hooks.useCreateState', 'Failed to create state', {
        error: error.message,
        stateData: stateData
          ? stateData instanceof FormData
            ? 'FormData'
            : 'provided'
          : 'missing',
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Hook for updating an existing state with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useUpdateState
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to update a state
 * @throws {Error} When state data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 */
export function useUpdateState(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, stateData) => {
    try {
      const result = await requests.updateState(id, stateData, token);

      // Invalidate SWR cache - target specific keys
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('state') ||
            key.includes('getPaginatedStates') ||
            (key.includes('getStateById') && key.includes(id)) ||
            key.includes('getStateBySlug'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['state', 'getPaginatedStates'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.State.Hooks.useUpdateState', 'Failed to update state', {
        error: error.message,
        stateId: id,
        stateData: stateData
          ? stateData instanceof FormData
            ? 'FormData'
            : 'provided'
          : 'missing',
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Hook for deleting a state with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useDeleteState
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Async function to delete a state
 * @throws {Error} When state ID is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 */
export function useDeleteState(token = '') {
  const { mutate } = useSWRConfig();

  return async (id) => {
    try {
      const result = await requests.deleteState(id, token);

      // Invalidate SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('state') ||
            key.includes('getPaginatedStates') ||
            (key.includes('getStateById') && key.includes(id)) ||
            key.includes('getStateBySlug'))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['state', 'getPaginatedStates'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError('CityArtWalks.Actions.State.Hooks.useDeleteState', 'Failed to delete state', {
        error: error.message,
        stateId: id,
        token: token ? '[REDACTED]' : 'none',
      });
      throw error;
    }
  };
}

/**
 * Combined hook that provides all state mutation functions
 *
 * @memberof CityArtWalks.Actions.State.Hooks
 * @function useStateMutations
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests}
 */
export function useStateMutations(token = '') {
  const createState = useCreateState(token);
  const updateState = useUpdateState(token);
  const deleteState = useDeleteState(token);

  return {
    createState,
    updateState,
    deleteState,
  };
}
