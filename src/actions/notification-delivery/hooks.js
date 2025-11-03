/**
 * Notification Delivery Data Hooks
 *
 * This module provides SWR-powered React hooks for notification delivery tracking.
 * It offers optimized data fetching, caching, and real-time updates for delivery
 * status monitoring and administrative interfaces.
 *
 * @namespace CityArtWalks.Actions.NotificationDelivery.Hooks
 * @fileoverview React hooks for notification delivery data management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/SWR} useSWR - Data fetching hooks
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug} debugLog/debugError - Debug utilities
 * @requires CityArtWalks.Actions.NotificationDelivery.Requests - HTTP request functions
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Notification-Delivery} - Delivery tracking documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/SWR-Hooks} - SWR hooks documentation
 */

import useSWR from 'swr';
import { useMemo } from 'react';

import { debugLog, debugError } from 'src/lib/debug';

import { getDeliveryById, getDeliveryRecords, getDeliveryStatistics } from './requests';

/**
 * @memberof CityArtWalks.Actions.NotificationDelivery.Hooks
 * @description Default SWR configuration for delivery data
 * @constant {Object} DEFAULT_SWR_OPTIONS
 */
const DEFAULT_SWR_OPTIONS = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 30000, // 30 seconds
  dedupingInterval: 10000, // 10 seconds
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

/**
 * @memberof CityArtWalks.Actions.NotificationDelivery.Hooks
 * @description Extended SWR configuration for statistics
 * @constant {Object} STATS_SWR_OPTIONS
 */
const STATS_SWR_OPTIONS = {
  ...DEFAULT_SWR_OPTIONS,
  refreshInterval: 60000, // 1 minute for stats
};

/**
 * Hook for fetching paginated delivery records with filtering
 *
 * @memberof CityArtWalks.Actions.NotificationDelivery.Hooks
 * @function useDeliveryRecords
 * @param {Object} params - Query parameters
 * @param {number} [params.page=0] - Page number
 * @param {number} [params.limit=20] - Records per page
 * @param {number} [params.userId] - Filter by user ID
 * @param {number} [params.notificationId] - Filter by notification ID
 * @param {string} [params.channel] - Filter by delivery channel
 * @param {string} [params.status] - Filter by delivery status
 * @param {string} [params.fromDate] - Start date filter
 * @param {string} [params.toDate] - End date filter
 * @param {string} accessToken - Admin authentication token
 * @param {Object} [options] - SWR configuration options
 * @returns {Object} SWR response with delivery records and utilities
 *
 * @example
 * const {
 *   data,
 *   error,
 *   isLoading,
 *   mutate,
 *   deliveries,
 *   pagination
 * } = useDeliveryRecords({
 *   page: 0,
 *   limit: 20,
 *   status: 'delivered'
 * }, accessToken);
 */
export function useDeliveryRecords(params = {}, accessToken, options = {}) {
  const swrKey = useMemo(() => {
    if (!accessToken) return null;
    return [`delivery-records`, JSON.stringify(params)];
  }, [params, accessToken]);

  const swrOptions = useMemo(
    () => ({
      ...DEFAULT_SWR_OPTIONS,
      ...options,
    }),
    [options]
  );

  const swrResponse = useSWR(swrKey, () => getDeliveryRecords(params, accessToken), swrOptions);

  const enhancedResponse = useMemo(() => {
    debugLog(
      'CityArtWalks.Actions.NotificationDelivery.Hooks.useDeliveryRecords',
      'Processing delivery records response',
      {
        hasData: !!swrResponse.data,
        error: swrResponse.error?.message,
        isLoading: swrResponse.isLoading,
      }
    );

    return {
      ...swrResponse,
      deliveries: swrResponse.data?.deliveries || [],
      pagination: swrResponse.data?.pagination || {
        page: 0,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      filters: swrResponse.data?.filters || {},
      availableFilters: swrResponse.data?.availableFilters || {
        channels: [],
        statuses: [],
      },
    };
  }, [swrResponse]);

  return enhancedResponse;
}

/**
 * Hook for fetching delivery statistics
 *
 * @memberof CityArtWalks.Actions.NotificationDelivery.Hooks
 * @function useDeliveryStatistics
 * @param {Object} params - Query parameters
 * @param {string} [params.channel] - Filter by delivery channel
 * @param {string} [params.fromDate] - Start date filter
 * @param {string} [params.toDate] - End date filter
 * @param {string} accessToken - Admin authentication token
 * @param {Object} [options] - SWR configuration options
 * @returns {Object} SWR response with delivery statistics
 *
 * @example
 * const {
 *   data,
 *   error,
 *   isLoading,
 *   mutate,
 *   statistics
 * } = useDeliveryStatistics({
 *   channel: 'email',
 *   fromDate: '2024-01-01'
 * }, accessToken);
 */
export function useDeliveryStatistics(params = {}, accessToken, options = {}) {
  const swrKey = useMemo(() => {
    if (!accessToken) return null;
    return [`delivery-statistics`, JSON.stringify(params)];
  }, [params, accessToken]);

  const swrOptions = useMemo(
    () => ({
      ...STATS_SWR_OPTIONS,
      ...options,
    }),
    [options]
  );

  const swrResponse = useSWR(swrKey, () => getDeliveryStatistics(params, accessToken), swrOptions);

  const enhancedResponse = useMemo(() => {
    debugLog(
      'CityArtWalks.Actions.NotificationDelivery.Hooks.useDeliveryStatistics',
      'Processing delivery statistics response',
      {
        hasData: !!swrResponse.data,
        error: swrResponse.error?.message,
        isLoading: swrResponse.isLoading,
      }
    );

    return {
      ...swrResponse,
      statistics: swrResponse.data || {
        total: 0,
        byStatus: {},
        byChannel: {},
        deliveryRate: 0,
        failureRate: 0,
        readRate: 0,
      },
    };
  }, [swrResponse]);

  return enhancedResponse;
}

/**
 * Hook for fetching a single delivery record
 *
 * @memberof CityArtWalks.Actions.NotificationDelivery.Hooks
 * @function useDeliveryRecord
 * @param {number} deliveryId - Delivery record ID
 * @param {string} accessToken - Admin authentication token
 * @param {Object} [options] - SWR configuration options
 * @returns {Object} SWR response with delivery record details
 *
 * @example
 * const {
 *   data,
 *   error,
 *   isLoading,
 *   mutate,
 *   delivery
 * } = useDeliveryRecord(123, accessToken);
 */
export function useDeliveryRecord(deliveryId, accessToken, options = {}) {
  const swrKey = useMemo(() => {
    if (!accessToken || !deliveryId) return null;
    return [`delivery-record`, deliveryId];
  }, [deliveryId, accessToken]);

  const swrOptions = useMemo(
    () => ({
      ...DEFAULT_SWR_OPTIONS,
      ...options,
    }),
    [options]
  );

  const swrResponse = useSWR(swrKey, () => getDeliveryById(deliveryId, accessToken), swrOptions);

  const enhancedResponse = useMemo(() => {
    debugLog(
      'CityArtWalks.Actions.NotificationDelivery.Hooks.useDeliveryRecord',
      `Processing delivery record response for ID ${deliveryId}`,
      {
        hasData: !!swrResponse.data,
        error: swrResponse.error?.message,
        isLoading: swrResponse.isLoading,
      }
    );

    return {
      ...swrResponse,
      delivery: swrResponse.data?.delivery || null,
    };
  }, [swrResponse, deliveryId]);

  return enhancedResponse;
}

/**
 * Hook providing delivery tracking actions and utilities
 *
 * @memberof CityArtWalks.Actions.NotificationDelivery.Hooks
 * @function useDeliveryActions
 * @param {string} accessToken - Admin authentication token
 * @returns {Object} Delivery action functions and utilities
 *
 * @example
 * const {
 *   retryDelivery,
 *   refreshRecords,
 *   refreshStatistics,
 *   isRetrying
 * } = useDeliveryActions(accessToken);
 */
export function useDeliveryActions(accessToken) {
  const { retryDelivery: retryRequest } = useMemo(() => require('./requests'), []);

  const actions = useMemo(() => {
    async function retryDelivery(deliveryId) {
      try {
        debugLog(
          'CityArtWalks.Actions.NotificationDelivery.Hooks.useDeliveryActions.retryDelivery',
          `Retrying delivery ${deliveryId}`
        );

        const result = await retryRequest(deliveryId, accessToken);

        // Trigger revalidation of related data
        // Note: In a real implementation, you'd use mutate from SWR

        return result;
      } catch (error) {
        debugError(
          'CityArtWalks.Actions.NotificationDelivery.Hooks.useDeliveryActions.retryDelivery',
          error
        );
        throw error;
      }
    }

    function refreshRecords() {
      // This would trigger revalidation of delivery records
      debugLog(
        'CityArtWalks.Actions.NotificationDelivery.Hooks.useDeliveryActions.refreshRecords',
        'Refreshing delivery records'
      );
    }

    function refreshStatistics() {
      // This would trigger revalidation of delivery statistics
      debugLog(
        'CityArtWalks.Actions.NotificationDelivery.Hooks.useDeliveryActions.refreshStatistics',
        'Refreshing delivery statistics'
      );
    }

    return {
      retryDelivery,
      refreshRecords,
      refreshStatistics,
    };
  }, [accessToken, retryRequest]);

  return actions;
}
