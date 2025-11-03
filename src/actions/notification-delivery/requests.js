/**
 * @file requests.js
 * @description NotificationDeliveryApiClient class for Notification Delivery operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.NotificationDelivery.Requests
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * NotificationDeliveryApiClient class for handling Notification Delivery API operations.
 * Extends ApiClient to provide delivery-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class NotificationDeliveryApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.NotificationDelivery.Requests
 */
export class NotificationDeliveryApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Get paginated notification delivery records with filtering.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=0] - Page number (0-based)
   * @param {number} [params.limit=20] - Records per page
   * @param {number} [params.userId] - Filter by user ID
   * @param {number} [params.notificationId] - Filter by notification ID
   * @param {string} [params.channel] - Filter by delivery channel
   * @param {string} [params.status] - Filter by delivery status
   * @param {string} [params.fromDate] - Start date (ISO string)
   * @param {string} [params.toDate] - End date (ISO string)
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Response with delivery records and pagination
   */
  async getPaginatedDeliveryRecords({ page = 0, limit = 20, userId, notificationId, channel, status, fromDate, toDate } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(userId && { userId }),
      ...(notificationId && { notificationId }),
      ...(channel && { channel }),
      ...(status && { status }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
    });

    const path = `${endpoints.notificationDelivery.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Get a specific delivery record by ID.
   * @param {number|string} deliveryId - Delivery record ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Delivery record with full details
   */
  async getDeliveryRecord(deliveryId, revalidate) {
    const path = endpoints.notificationDelivery.details.path(deliveryId);
    return this.get(path, { revalidate });
  }

  /**
   * Get delivery statistics with filtering options.
   * @param {Object} params - Filter parameters
   * @param {string} [params.channel] - Filter by delivery channel
   * @param {string} [params.fromDate] - Start date (ISO string)
   * @param {string} [params.toDate] - End date (ISO string)
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Response with delivery statistics
   */
  async getDeliveryStatistics({ channel, fromDate, toDate } = {}, revalidate) {
    const params = new URLSearchParams({
      ...(channel && { channel }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
    });

    const path = params.toString() 
      ? `${endpoints.notificationDelivery.stats.path}?${params}`
      : endpoints.notificationDelivery.stats.path;
    return this.get(path, { revalidate });
  }

  /**
   * Retry a failed delivery.
   * @param {number|string} deliveryId - Delivery record ID
   * @returns {Promise<Object>} Updated delivery record
   */
  async retryDelivery(deliveryId) {
    const path = endpoints.notificationDelivery.retry.path(deliveryId);
    return this.post(path, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
