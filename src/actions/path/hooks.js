/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for Paths.
 * @author Jaimie Garner
 * @version 2.0.0
 * @namespace CityArtWalks.Actions.Path.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect, useCallback } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests';

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description SWR configuration options to control revalidation behavior.
 *
 * @property {boolean} revalidateIfStale - If false, data will not be revalidated if it is stale.
 * @property {boolean} revalidateOnFocus - If false, data will not be revalidated when the window regains focus.
 * @property {boolean} revalidateOnReconnect - If false, data will not be revalidated when the browser reconnects to the network.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description Hook to get paginated paths with full filtering, caching via IndexedDB.
 * @async
 * @param {Object} params - The pagination and filter parameters
 * @param {number} [params.page=1] - The page number
 * @param {number} [params.rowsPerPage=10] - Number of rows per page
 * @param {string} [params.search=''] - Search term
 * @param {string} [params.status=''] - Status filter
 * @param {string} [params.path_type=''] - Path type filter
 * @param {string|null} [params.created_by=null] - Creator filter
 * @param {string|null} [params.countryId=null] - Country filter
 * @param {string|null} [params.stateId=null] - State filter
 * @param {string|null} [params.cityId=null] - City filter
 * @param {boolean} [params.featured=false] - Featured filter
 * @param {string} [params.token=''] - Optional Bearer token for authorization
 * @param {number} [params.revalidate=600] - Optional ISR revalidate time in seconds
 * @param {*} [params.refreshKey=null] - Key to trigger refresh
 * @returns {Object} Result including loading states, errors, and paginated paths data
 * @function useGetPaginatedPaths
 */
export function useGetPaginatedPaths({
  page = 1,
  rowsPerPage = 10,
  search = '',
  status = '',
  path_type = '',
  created_by = null,
  countryId = null,
  stateId = null,
  cityId = null,
  featured = false,
  token = '',
  revalidate = 600,
  refreshKey = null,
}) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedPaths',
      page,
      rowsPerPage,
      search,
      status,
      path_type,
      created_by,
      countryId,
      stateId,
      cityId,
      featured,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [
    page,
    rowsPerPage,
    search,
    status,
    path_type,
    created_by,
    countryId,
    stateId,
    cityId,
    featured,
    revalidate,
  ]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getPaginatedPaths({
        page,
        rowsPerPage,
        search,
        status,
        path_type,
        created_by,
        countryId,
        stateId,
        cityId,
        featured,
        token,
        revalidate,
      });
      await saveToIndexedDb(cacheKey, response?.data);
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
      const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
      if (cached) {
        debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
        mutate({ data: cached }, false);
      } else {
        debugWarn(`[IndexedDB] Cache miss for ${cacheKey}`);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const paths = data?.data?.paths || [];
    return {
      paths,
      paginationMeta: data?.meta || { total: 0, page, rowsPerPage },
      pathsLoading: isLoading,
      pathsError: error,
      pathsEmpty: !isLoading && paths.length === 0,
    };
  }, [data, isLoading, error, page, rowsPerPage]);
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description Hook to get single path by slug with IndexedDB caching.
 * @async
 * @param {string} slug - The path slug
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and path data
 * @function useGetPathBySlug
 */
export function useGetPathBySlug(slug, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!slug) return { swrKey: null, cacheKey: null };
    const key = ['getPathBySlug', slug, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [slug, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await requests.getPathBySlug(slug, token, revalidate);
      await saveToIndexedDb(cacheKey, response?.data);
      return response;
    },
    swrOptions
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
      if (cached) {
        debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
        mutate({ data: cached }, false);
      } else {
        debugWarn(`[IndexedDB] Cache miss for ${cacheKey}`);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  return useMemo(() => {
    const path = data?.data || null;
    return {
      path: path || [],
      pathLoading: isLoading,
      pathError: error,
      pathValidating: isValidating,
      pathEmpty: !isLoading && !path,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description Hook for creating path with token support.
 * @async
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Function to create a path
 * @function useCreatePath
 */
export function useCreatePath(token = '') {
  const { mutate } = useSWRConfig();

  return async (path, revalidate = 600) => {
    const result = await requests.createPath(path, token);
    mutate(
      (key) =>
        Array.isArray(key) && (key.includes('getPathBySlug') || key.includes('getPaginatedPaths'))
    );
    return result;
  };
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description Hook for updating path with token support.
 * @async
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Function to update a path
 * @function useUpdatePath
 */
export function useUpdatePath(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, path, revalidate = 600) => {
    const result = await requests.updatePath(id, path, token);
    mutate(
      (key) =>
        Array.isArray(key) && (key.includes('getPathBySlug') || key.includes('getPaginatedPaths'))
    );
    return result;
  };
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description Hook for deleting path with token support.
 * @async
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Function} Function to delete a path
 * @function useDeletePath
 */
export function useDeletePath(token = '') {
  const { mutate } = useSWRConfig();

  return async (id, revalidate = 600) => {
    const result = await requests.deletePath(id, token);
    mutate(
      (key) =>
        Array.isArray(key) && (key.includes('getPathBySlug') || key.includes('getPaginatedPaths'))
    );
    return result;
  };
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description Combined hook for all path mutations with token support.
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @returns {Object} Object containing all mutation functions
 * @function usePathMutations
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function usePathMutations(token = '') {
  const createPath = useCreatePath(token);
  const updatePath = useUpdatePath(token);
  const deletePath = useDeletePath(token);

  return {
    createPath,
    updatePath,
    deletePath,
  };
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description SWR hook for fetching path types with IndexedDB caching
 * @function useGetPathTypes
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Path types data with loading and error states
 * @returns {Array} returns.pathTypes - Array of path type options
 * @returns {boolean} returns.pathTypesLoading - Loading state
 * @returns {Error} returns.pathTypesError - Error state
 * @returns {boolean} returns.pathTypesEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPathTypes(token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getPathTypes', revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [revalidate]);

  const { data, isLoading, error } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPathTypes(token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response, revalidateMs);
        }
        return response;
      } catch (err) {
        debugWarn('CityArtWalks.Actions.Path.Hooks.useGetPathTypes', 'Failed to fetch path types', {
          error: err.message,
          token: !!token,
        });
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached && !data && !isLoading) {
          debugLog(
            'CityArtWalks.Actions.Path.Hooks.useGetPathTypes',
            'Loaded from IndexedDB cache'
          );
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.Path.Hooks.useGetPathTypes',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
          }
        );
      }
    })();
  }, [cacheKey, data, isLoading, revalidateMs]);

  return useMemo(
    () => ({
      pathTypes: data?.data || [],
      pathTypesLoading: isLoading,
      pathTypesError: error,
      pathTypesEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, isLoading, error]
  );
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description SWR hook for fetching path map types with IndexedDB caching
 * @function useGetPathMapTypes
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Path map types data with loading and error states
 * @returns {Array} returns.pathMapTypes - Array of path map type options
 * @returns {boolean} returns.pathMapTypesLoading - Loading state
 * @returns {Error} returns.pathMapTypesError - Error state
 * @returns {boolean} returns.pathMapTypesEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPathMapTypes(token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getPathMapTypes', revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [revalidate]);

  const { data, isLoading, error } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPathMapTypes(token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response, revalidateMs);
        }
        return response;
      } catch (err) {
        debugWarn(
          'CityArtWalks.Actions.Path.Hooks.useGetPathMapTypes',
          'Failed to fetch path map types',
          {
            error: err.message,
            token: !!token,
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached && !data && !isLoading) {
          debugLog(
            'CityArtWalks.Actions.Path.Hooks.useGetPathMapTypes',
            'Loaded from IndexedDB cache'
          );
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.Path.Hooks.useGetPathMapTypes',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
          }
        );
      }
    })();
  }, [cacheKey, data, isLoading, revalidateMs]);

  return useMemo(
    () => ({
      pathMapTypes: data?.data || [],
      pathMapTypesLoading: isLoading,
      pathMapTypesError: error,
      pathMapTypesEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, isLoading, error]
  );
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @description SWR hook for fetching path zoom levels with IndexedDB caching
 * @function useGetPathZoomLevels
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} Path zoom levels data with loading and error states
 * @returns {Array} returns.pathZoomLevels - Array of path zoom level options
 * @returns {boolean} returns.pathZoomLevelsLoading - Loading state
 * @returns {Error} returns.pathZoomLevelsError - Error state
 * @returns {boolean} returns.pathZoomLevelsEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPathZoomLevels(token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getPathZoomLevels', revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [revalidate]);

  const { data, isLoading, error } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPathZoomLevels(token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response, revalidateMs);
        }
        return response;
      } catch (err) {
        debugWarn(
          'CityArtWalks.Actions.Path.Hooks.useGetPathZoomLevels',
          'Failed to fetch path zoom levels',
          {
            error: err.message,
            token: !!token,
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached && !data && !isLoading) {
          debugLog(
            'CityArtWalks.Actions.Path.Hooks.useGetPathZoomLevels',
            'Loaded from IndexedDB cache'
          );
        }
      } catch (cacheError) {
        debugWarn(
          'CityArtWalks.Actions.Path.Hooks.useGetPathZoomLevels',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
          }
        );
      }
    })();
  }, [cacheKey, data, isLoading, revalidateMs]);

  return useMemo(
    () => ({
      pathZoomLevels: data?.data || [],
      pathZoomLevelsLoading: isLoading,
      pathZoomLevelsError: error,
      pathZoomLevelsEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, isLoading, error]
  );
}

/**
 * @memberof CityArtWalks.Actions.Path.Hooks
 * @function useIncrementPathViewCount
 * @description Hook for incrementing path view count with cache invalidation.
 *
 * @param {string} [token=''] - Auth token
 * @returns {Function} Increment function with optimized cache invalidation
 */
export function useIncrementPathViewCount(pathId, token = '') {
  const { mutate } = useSWRConfig();
  return useCallback(
    async (revalidate = 600) => {
      if (!pathId) {
        console.warn('useIncrementPathViewCount: pathId is required');
        return null;
      }
      const result = await requests.incrementPathViewCount(pathId, token, revalidate);
      // Invalidate relevant caches
      mutate(
        (key) => Array.isArray(key) && (key.includes('path') || key.includes('getPaginatedPaths'))
      );
      return result;
    },
    [pathId, token, mutate]
  );
}
