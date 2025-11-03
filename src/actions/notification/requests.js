/**
 * @file requests.js
 * @description NotificationApiClient class for Notification operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Notification.Requests
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * NotificationApiClient class for handling Notification API operations.
 * Extends ApiClient to provide notification-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class NotificationApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Notification.Requests
 */
export class NotificationApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of notifications.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.type] - Notification type filter
   * @param {string} [params.status] - Status filter
   * @param {boolean} [params.isRead] - Read status filter
   * @param {string} [params.userId] - User ID filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated notifications data
   */
  async getPaginatedNotifications({ page = 1, limit = 10, search = '', type, status, isRead, userId } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(type && { type }),
      ...(status && { status }),
      ...(isRead !== undefined && { isRead }),
      ...(userId && { userId }),
    });

    const path = `${endpoints.notification.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch notifications for a specific user.
   * @param {string|number} userId - User ID
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.type] - Notification type filter
   * @param {string} [params.status] - Status filter
   * @param {boolean} [params.isRead] - Read status filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User's notifications data
   */
  async getNotificationsByUser(userId, { page = 1, limit = 10, search = '', type, status, isRead } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(type && { type }),
      ...(status && { status }),
      ...(isRead !== undefined && { isRead }),
    });

    const path = `${endpoints.notification.user.path(userId)}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single notification by ID.
   * @param {string|number} id - Notification ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The notification object
   */
  async getNotification(id, revalidate) {
    const path = endpoints.notification.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new notification.
   * @param {Object|FormData} data - Notification data
   * @returns {Promise<Object>} The created notification
   */
  async createNotification(data) {
    const path = endpoints.notification.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing notification.
   * @param {string|number} id - Notification ID
   * @param {Object|FormData} data - Updated notification data
   * @returns {Promise<Object>} The updated notification
   */
  async updateNotification(id, data) {
    const path = endpoints.notification.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Mark a notification as read.
   * @param {string|number} id - Notification ID
   * @returns {Promise<Object>} The updated notification
   */
  async markNotificationRead(id) {
    const path = endpoints.notification.markRead.path(id);
    return this.put(path, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Mark all notifications as read for the authenticated user.
   * @returns {Promise<Object>} The operation result
   */
  async markAllNotificationsRead() {
    const path = endpoints.notification.markAllRead.path;
    return this.put(path, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a notification.
   * @param {string|number} id - Notification ID
   * @returns {Promise<Object>} The response data
   */
  async deleteNotification(id) {
    const path = endpoints.notification.delete.path(id);
    return this.delete(path);
  }
}
