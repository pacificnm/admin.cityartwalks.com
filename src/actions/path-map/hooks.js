/**
 * @namespace CityArtWalks.Actions.PathMap.Hooks
 * @version 2.0.0
 */

import useSWR from 'swr';
import { useMemo, useEffect } from 'react';

import * as requests from './requests';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * Hook to get full list of path maps (non-paginated).
 * @function useGetPathMaps
 */
export function useGetPathMaps(refreshKey) {
  const key = ['getPathMaps'];
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    key,
    requests.getPathMaps,
    swrOptions
  );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const pathMaps = data?.data?.pathMaps || [];
    return {
      pathMaps,
      pathMapsLoading: isLoading,
      pathMapsError: error,
      pathMapsValidating: isValidating,
      pathMapsEmpty: !isLoading && pathMaps.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * Hook to get paginated path maps.
 * @function useGetPaginatedPathMaps
 */
export function useGetPaginatedPathMaps(page = 1, rowsPerPage = 10, search = '', refreshKey) {
  const key = ['getPaginatedPathMaps', page, rowsPerPage, search];
  const { data, isLoading, error, mutate } = useSWR(
    key,
    () => requests.getPaginatedPathMaps(page, rowsPerPage, search),
    swrOptions
  );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const pathMaps = data?.data?.pathMaps || [];
    return {
      pathMaps,
      paginationMeta: data?.meta || { total: 0, page, rowsPerPage },
      isLoading,
      error,
    };
  }, [data, isLoading, error, page, rowsPerPage]);
}

/**
 * Hook to get path map by ID.
 * @function useGetPathMap
 */
export function useGetPathMap(id) {
  const key = ['getPathMap', id];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getPathMap(id),
    swrOptions
  );

  return useMemo(() => {
    const pathMap = data?.data?.pathMap || null;
    return {
      pathMap,
      pathMapLoading: isLoading,
      pathMapError: error,
      pathMapValidating: isValidating,
      pathMapEmpty: !isLoading && !pathMap,
    };
  }, [data, isLoading, error, isValidating]);
}
