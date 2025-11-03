/**
 * @file hooks.js
 * @description Analytics tracking hooks following project patterns
 * @namespace CityArtWalks.Actions.Analytics.Hooks
 * @version 2.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */

import useSWR from 'swr';
import { useMemo, useEffect, useCallback } from 'react';

import { useAuthContext } from 'src/auth/hooks';

import * as requests from './requests';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * Hook for tracking analytics events.
 * @function useTrackEvent
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @returns {Object} Object with trackEvent function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */
export function useTrackEvent() {
  const trackEvent = useCallback(async (eventData) => {
    try {
      return await requests.trackAnalyticsEvent(eventData);
    } catch (error) {
      console.error('[Analytics] Failed to track event?:', error);
      throw error;
    }
  }, []);

  return { trackEvent };
}

/**
 * Hook for updating analytics user mapping.
 * @function useUpdateUserMapping
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @returns {Object} Object with updateUserMapping function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */
export function useUpdateUserMapping() {
  const updateUserMapping = useCallback(async (updateData) => {
    try {
      return await requests.updateAnalyticsUserMapping(updateData);
    } catch (error) {
      console.error('[Analytics] Failed to update user mapping?:', error);
      throw error;
    }
  }, []);

  return { updateUserMapping };
}

/**
 * Hook for getting weekly user analytics.
 * @function useWeeklyUserAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for weekly user analytics
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */
export function useWeeklyUserAnalytics(token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'users', 'week'],
    () => requests.getWeeklyUserAnalytics(authToken),
    swrOptions
  );

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshUsers: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for getting weekly pageview analytics.
 * @function useWeeklyPageviewAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for weekly pageview analytics
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */
export function useWeeklyPageviewAnalytics(token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'pageviews', 'week'],
    () => requests.getWeeklyPageviewAnalytics(authToken),
    swrOptions
  );

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshPageviews: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for getting top page view segments analytics.
 * @function useTopPageViewSegments
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for top page view segments analytics
 */
export function useTopPageViewSegments(token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'pageviewsSegments', 'week'],
    () => requests.getTopPageViewSegments(authToken),
    swrOptions
  );

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshPageviewsSegments: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for getting errors analytics with pagination and filters.
 * @function useErrorsAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {number} [page=1] - Page number
 * @param {number} [rowsPerPage=10] - Rows per page
 * @param {string} [search=''] - Search string
 * @param {any} [refreshKey] - Optional key to force refresh
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for errors analytics
 */
export function useErrorsAnalytics(
  page = 1,
  rowsPerPage = 10,
  search = '',
  refreshKey,
  token = ''
) {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'errors', 'week', page, rowsPerPage, search, refreshKey],
    () =>
      requests.getErrors(
        { page, rowsPerPage, search, filters: { event: 'error_event' } },
        authToken
      ),
    swrOptions
  );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && (!data?.data || data?.data?.length === 0),
      paginationMeta: data?.meta || { total: 0, page, rowsPerPage },
      mutate,
    }),
    [data, error, isLoading, mutate, page, rowsPerPage]
  );
}

/**
 * Hook for getting analytics errors with pagination and custom filters.
 * @function useAnalyticsWithFilters
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of rows per page
 * @param {Object} [filters={}] - Additional filter object for analytics errors
 * @param {any} [refreshKey] - Optional key to force refresh (changing this will re-fetch data)
 * @param {string} [token=''] - Optional token override
 * @returns {Object} Analytics errors data, error, loading state, empty state, pagination meta, and refresh function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */
export function useAnalyticsWithFilters(
  page = 1,
  rowsPerPage = 10,
  filters = {},
  refreshKey,
  token = ''
) {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'errors', 'week', page, rowsPerPage, filters, refreshKey],
    () => requests.getErrors({ page, rowsPerPage, filters }, authToken),
    swrOptions
  );

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);
  return useMemo(
    () => ({
      data: data?.data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && (!data?.data?.data || data?.data?.data?.length === 0),
      paginationMeta: data?.data?.meta || { total: 0, page, rowsPerPage },
      refreshAnalytics: mutate,
    }),
    [data?.data?.data, data?.data?.meta, error, isLoading, mutate, page, rowsPerPage]
  );
}

/**
 * Hook for getting weekly time on site analytics.
 * @function useWeeklyTimeOnSiteAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for weekly time on site analytics
 */
export function useWeeklyTimeOnSiteAnalytics(token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'timeOnPage', 'week'],
    () => requests.getWeeklyTimeOnSiteAnalytics(authToken),
    swrOptions
  );

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshTimeOnPage: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for getting top browsers analytics.
 * @function useTopBrowsersAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for top browsers analytics
 */
export function useTopBrowsersAnalytics(token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'browser', 'week'],
    () => requests.getTopBrowsersAnalytics(authToken),
    swrOptions
  );

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshBrowsers: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for getting device sessions analytics.
 * @function useDeviceSessionsAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [range='7d'] - Time range
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for device sessions analytics
 */
export function useDeviceSessionsAnalytics(range = '7d', token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'sessionsDevices', range],
    () => requests.getDeviceSessionsAnalytics(range, authToken),
    swrOptions
  );

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshDeviceSessions: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for getting top referrers analytics.
 * @function useTopReferrersAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [range='7d'] - Time range
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for top referrers analytics
 */
export function useTopReferrersAnalytics(range = '7d', token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'referrers', range],
    () => requests.getTopReferrersAnalytics(range, authToken),
    swrOptions
  );
  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshTopReferrers: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for getting visitor analytics.
 * @function useVisitorAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [range='7d'] - Time range
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for visitor analytics
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */
export function useVisitorAnalytics(range = '7d', token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'visitors', range],
    () => requests.getVisitorAnalytics(range, authToken),
    swrOptions
  );

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshVisitors: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for getting bounce rate analytics.
 * @function useBounceRateAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [range='7d'] - Time range
 * @param {string} [token=''] - Optional token override
 * @returns {Object} SWR object for bounce rate analytics
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */
export function useBounceRateAnalytics(range = '7d', token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, error, isLoading, mutate } = useSWR(
    ['analytics', 'bounceRate', range],
    () => requests.getBounceRateAnalytics(range, authToken),
    swrOptions
  );

  return useMemo(
    () => ({
      data: data?.data || [],
      error,
      isLoading,
      usersEmpty: !isLoading && !data?.length,
      refreshBounceRate: mutate,
    }),
    [data, error, isLoading, mutate]
  );
}

/**
 * Hook for deleting an analytics record by ID.
 * @function useDeleteAnalytics
 * @memberof CityArtWalks.Actions.Analytics.Hooks
 * @param {string} [token=''] - Optional token override
 * @returns {Object} Object with deleteAnalytics function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Actions} - Complete documentation
 */
export function useDeleteAnalytics(token = '') {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const deleteAnalytics = useCallback(
    async (analyticsId) => {
      try {
        return await requests.deleteAnalytics(analyticsId, authToken);
      } catch (error) {
        console.error('[Analytics] Failed to delete analytics record?:', error);
        throw error;
      }
    },
    [authToken]
  );

  return { deleteAnalytics };
}
