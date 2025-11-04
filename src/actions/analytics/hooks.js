/**
 * @file hooks.js
 * @description SWR-based data fetching hooks for Analytics.
 * @author Jaimie Garner
 * @version 2.1.0
 * @namespace CityArtWalks.Actions.Analytics.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics} - Analytics entity documentation
 */

import { useMemo, useEffect } from "react";

import { useBaseHook } from "src/lib/base-hook";

import { AnalyticsApiClient } from "./requests";

// Create a single instance to use across all hooks
const analyticsApiClient = new AnalyticsApiClient();

/**
 * Hook for tracking analytics events.
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useTrackEvent
 * @description Hook to track analytics events with validation.
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (eventData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When event data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const trackEvent = useTrackEvent();
 * await trackEvent.mutate(eventData);
 */
export function useTrackEvent() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (eventData) => {
      const result = await analyticsApiClient.trackAnalyticsEvent(eventData);
      return result;
    },
    ["analytics", "getErrors"]
  );
}

/**
 * Hook for updating analytics user mapping.
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useUpdateUserMapping
 * @description Hook to update analytics user mapping with validation and cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (updateData) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When update data validation fails or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const updateUserMapping = useUpdateUserMapping();
 * await updateUserMapping.mutate(updateData);
 */
export function useUpdateUserMapping() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (updateData) => {
      const result = await analyticsApiClient.updateAnalyticsUserMapping(updateData);
      return result;
    },
    ["analytics", "getErrors"]
  );
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useWeeklyUserAnalytics
 * @description Hook to get weekly user analytics with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useWeeklyUserAnalytics(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getWeeklyUserAnalytics", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getWeeklyUserAnalytics(revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useWeeklyPageviewAnalytics
 * @description Hook to get weekly pageview analytics with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useWeeklyPageviewAnalytics(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getWeeklyPageviewAnalytics", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getWeeklyPageviewAnalytics(revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useTopPageViewSegments
 * @description Hook to get top page view segments analytics with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useTopPageViewSegments(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getTopPageViewSegments", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getTopPageViewSegments(revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useErrorsAnalytics
 * @description Hook to get errors analytics with pagination and filtering, caching via IndexedDB.
 *
 * @param {Object} params - Filter parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Results per page limit
 * @param {string} [params.event=''] - Event filter
 * @param {string} [params.type=''] - Type filter
 * @param {string} [params.path=''] - Path filter
 * @param {string} [params.visitorId=''] - Visitor ID filter
 * @param {string} [params.userId=''] - User ID filter
 * @param {string} [params.startDate=''] - Start date filter
 * @param {string} [params.endDate=''] - End date filter
 * @param {string|null} [params.refreshKey=null] - Key to trigger refresh
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and complete API results
 * @returns {Object} result.results - Complete API results object (data, pagination, performance, query metadata)
 * @returns {boolean} result.errorsLoading - Loading state
 * @returns {Error} result.errorsError - Error state
 * @returns {boolean} result.errorsValidating - Validation state
 * @returns {boolean} result.errorsEmpty - Empty state (no data)
 * @returns {Function} result.mutate - SWR mutate function
 * @throws {Error} When parameter validation fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useErrorsAnalytics(params = {}, revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const {
    page = 1,
    limit = 10,
    event = "",
    type = "",
    path = "",
    visitorId = "",
    userId = "",
    startDate = "",
    endDate = "",
    refreshKey = null,
  } = params;

  const { swrKey } = useMemo(() => {
    const key = [
      "getErrors",
      page,
      limit,
      event,
      type,
      path,
      visitorId,
      userId,
      startDate,
      endDate,
      revalidate,
    ];
    return baseHook.utils.generateKeys(key);
  }, [
    baseHook.utils,
    page,
    limit,
    event,
    type,
    path,
    visitorId,
    userId,
    startDate,
    endDate,
    revalidate,
  ]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getErrors(
          { page, limit, event, type, path, visitorId, userId, startDate, endDate },
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
      errorsLoading: isLoading,
      errorsError: error,
      errorsValidating: isValidating,
      errorsEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useWeeklyTimeOnSiteAnalytics
 * @description Hook to get weekly time on site analytics with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useWeeklyTimeOnSiteAnalytics(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getWeeklyTimeOnSiteAnalytics", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getWeeklyTimeOnSiteAnalytics(revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useTopBrowsersAnalytics
 * @description Hook to get top browsers analytics with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useTopBrowsersAnalytics(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getTopBrowsersAnalytics", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getTopBrowsersAnalytics(revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useDeviceSessionsAnalytics
 * @description Hook to get device sessions analytics with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useDeviceSessionsAnalytics(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getDeviceSessionsAnalytics", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getDeviceSessionsAnalytics(revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useTopReferrersAnalytics
 * @description Hook to get top referrers analytics with IndexedDB caching.
 *
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useTopReferrersAnalytics(revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getTopReferrersAnalytics", revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getTopReferrersAnalytics(revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useVisitorAnalytics
 * @description Hook to get visitor analytics with IndexedDB caching.
 *
 * @param {string} [range='7d'] - Time range for analytics
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useVisitorAnalytics(range = "7d", revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getVisitorAnalytics", range, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, range, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getVisitorAnalytics(range, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useBounceRateAnalytics
 * @description Hook to get bounce rate analytics with IndexedDB caching.
 *
 * @param {string} [range='7d'] - Time range for analytics
 * @param {number} [revalidate=600] - Optional ISR revalidate time in seconds
 * @returns {Object} Result including loading states, errors, and analytics data
 * @throws {Error} When API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useBounceRateAnalytics(range = "7d", revalidate = 600) {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  const { swrKey } = useMemo(() => {
    const key = ["getBounceRateAnalytics", range, revalidate];
    return baseHook.utils.generateKeys(key);
  }, [baseHook.utils, range, revalidate]);

  const { data, isLoading, error, isValidating, mutate } =
    baseHook.useSWRWithCache(
      swrKey,
      async () => {
        const response = await analyticsApiClient.getBounceRateAnalytics(range, revalidate);
        return response;
      },
      revalidate
    );

  return useMemo(() => {
    const results = data?.results || {};
    return {
      data: results.data || [],
      error,
      isLoading,
      isValidating,
      usersEmpty: !isLoading && (!results.data || results.data.length === 0),
      mutate,
    };
  }, [data, error, isLoading, isValidating, mutate]);
}

/**
 * Hook for deleting an analytics record.
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @function useDeleteAnalytics
 * @description Hook to delete an analytics record with cache invalidation.
 *
 * @returns {Object} Mutation function and state
 * @returns {Function} result.mutate - Function to execute the mutation (analyticsId) => Promise
 * @returns {boolean} result.loading - Loading state of the mutation
 * @returns {Error} result.error - Error state of the mutation
 * @returns {Object} result.data - Result data from successful mutation
 * @throws {Error} When analytics ID is missing or API request fails
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @example
 * const deleteAnalytics = useDeleteAnalytics();
 * await deleteAnalytics.mutate(analyticsId);
 */
export function useDeleteAnalytics() {
  const baseHook = useBaseHook("CityArtWalks.Actions.Analytics.Hooks");

  return baseHook.useMutationWithInvalidation(
    async (analyticsId) => {
      // Validate parameters
      if (!analyticsId) {
        baseHook.logger.error("useDeleteAnalytics", "Analytics ID is required");
        throw new Error("Analytics ID is required");
      }

      const result = await analyticsApiClient.deleteAnalytics(analyticsId);
      return result;
    },
    ["analytics", "getErrors"]
  );
}
