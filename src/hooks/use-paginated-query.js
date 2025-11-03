import useSWR from 'swr';
import { useMemo, useEffect } from 'react';


/**
 * Reusable paginated SWR hook with support for arbitrary filters.
 *
 * @param {string} key - The SWR cache key base.
 * @param {function} fetcher - Function that receives all params including filters.
 * @param {Object} params - Pagination and filter options.
 * @param {number} params.page - Page number (0-based).
 * @param {number} params.rowsPerPage - Rows per page.
 * @param {any} params.refreshKey - Optional value to trigger refetch.
 * @param {Object} params.filters - Optional object of filter key/value pairs.
 */
export function usePaginatedQuery(
  key,
  fetcher,
  { page = 0, rowsPerPage = 10, refreshKey, filters = {} } = {}
) {
 
  // Combine params into a unique cache key
  const swrKey = [key, page, rowsPerPage, filters];

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    () => fetcher({ page: page + 1, rowsPerPage, ...filters })
  );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    const result = data?.data || {};
    const items = result.data || [];
    const meta = result.meta || {};
    return {
      items,
      meta,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && items.length === 0,
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}
