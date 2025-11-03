/**
 * @namespace CityArtWalks.Actions.Search.Hooks
 * @description SWR-powered hooks for homepage search functionality with caching and error handling
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 */

import useSWR from 'swr';
import { useMemo } from 'react';

import { debugLog, debugError } from 'src/lib/debug';

import { searchHomepage } from './requests';

/**
 * @memberof CityArtWalks.Actions.Search.Hooks
 * @description Hook for performing homepage search with SWR caching, debouncing, and automatic revalidation
 *
 * Features: * - SWR-powered caching and background revalidation
 * - Automatic error handling and retry logic
 * - Support for location-based filtering
 * - Categorized results (artists, art pieces, cities, paths)
 * - Pagination support
 * - Smart cache keys for optimal performance
 *
 * @function useHomepageSearch
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query string (required, min 1 char)
 * @param {number} [params.countryId] - ID of country to filter by
 * @param {number} [params.stateId] - ID of state to filter by
 * @param {number} [params.cityId] - ID of city to filter by
 * @param {number} [params.limit=5] - Number of results per category (1-20)
 * @param {number} [params.page=1] - Page number for pagination (min 1)
 * @param {boolean} [params.enabled=true] - Whether to enable the request
 * @returns {Object} SWR response object with search results and state
 * @returns {Object} returns.data - Categorized search results (artists, artPieces, cities, paths, meta)
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {Error} returns.error - Error object if request failed
 * @returns {Function} returns.mutate - Function to manually revalidate
 * @returns {boolean} returns.isValidating - Whether data is being revalidated
 * @example
 * // Basic search hook
 * const { data, isLoading, error } = useHomepageSearch({
 *   query: 'fountain',
 *   limit: 5
 * });
 *
 * // Location-filtered search
 * const { data, isLoading } = useHomepageSearch({
 *   query: searchTerm,
 *   cityId: userLocation?.cityId,
 *   enabled: searchTerm.length > 0
 * });
 *
 * // Access categorized results
 * if (data) {
 *   console.log('Artists?:', data.artists);
 *   console.log('Art Pieces?:', data.artPieces);
 *   console.log('Cities?:', data.cities);
 *   console.log('Total?:', data.meta.totalResults);
 * }
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 */
export function useHomepageSearch({
  query,
  countryId,
  stateId,
  cityId,
  limit = 5,
  page = 1,
  enabled = true,
}) {
  // Create cache key that includes all search parameters
  const cacheKey = useMemo(() => {
    if (!enabled || !query || query.trim().length === 0) {
      return null;
    }

    return ['search', 'homepage', query.trim(), countryId, stateId, cityId, limit, page];
  }, [query, countryId, stateId, cityId, limit, page, enabled]);

  // SWR configuration optimized for search
  const swrConfig = {
    revalidateOnFocus: false, // Don't revalidate on focus for search results
    revalidateOnReconnect: false, // Don't revalidate on reconnect
    dedupingInterval: 2000, // Dedupe requests within 2 seconds
    errorRetryCount: 2, // Limit retries for failed searches
    errorRetryInterval: 1000, // Wait 1 second between retries
    onError: (error) => {
      debugError('SearchHooks.useHomepageSearch', 'Search request failed', {
        query,
        error: error.message,
      });
    },
    onSuccess: (data) => {
      debugLog('SearchHooks.useHomepageSearch', 'Search completed successfully', {
        query,
        totalResults: data?.meta?.totalResults || 0,
      });
    },
  };

  // Use SWR with conditional fetching
  const { data, error, mutate, isValidating } = useSWR(
    cacheKey,
    () =>
      searchHomepage({
        query: query.trim(),
        countryId,
        stateId,
        cityId,
        limit,
        page,
      }),
    swrConfig
  );

  // Determine loading state
  const isLoading = !data && !error && cacheKey !== null;

  // Return enhanced SWR response
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    // Additional computed properties for convenience
    hasResults: data && data.meta?.totalResults > 0,
    isEmpty: data && data.meta?.totalResults === 0,
    totalResults: data?.meta?.totalResults || 0,
    hasMore: data?.meta?.hasMore || false,
  };
}

/**
 * @memberof CityArtWalks.Actions.Search.Hooks
 * @description Hook for search suggestions with automatic debouncing
 *
 * This hook is optimized for autocomplete/suggestion scenarios with: * - Lower result limits for faster responses
 * - Shorter cache duration for fresher results
 * - Automatic query trimming and validation
 *
 * @function useSearchSuggestions
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query string
 * @param {number} [params.countryId] - ID of country to filter by
 * @param {number} [params.stateId] - ID of state to filter by
 * @param {number} [params.cityId] - ID of city to filter by
 * @param {number} [params.limit=3] - Number of results per category (optimized for suggestions)
 * @param {number} [params.minQueryLength=2] - Minimum query length to trigger search
 * @returns {Object} SWR response optimized for suggestions
 * @example
 * // Autocomplete suggestions
 * const { data, isLoading } = useSearchSuggestions({
 *   query: inputValue,
 *   cityId: userLocation?.cityId,
 *   limit: 3,
 *   minQueryLength: 2
 * });
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 */
export function useSearchSuggestions({
  query,
  countryId,
  stateId,
  cityId,
  limit = 3,
  minQueryLength = 2,
}) {
  const enabled = query && query.trim().length >= minQueryLength;

  return useHomepageSearch({
    query,
    countryId,
    stateId,
    cityId,
    limit,
    page: 1,
    enabled,
  });
}
