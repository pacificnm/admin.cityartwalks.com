/**
 * @file mutations.js
 * @description Mutation functions for notification operations.
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Actions.Notification.Mutations
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { mutate } from 'swr';

import { debugLog, debugError } from 'src/lib/debug';

import * as notificationRequests from './requests';

/**
 * Mark a single notification as read using the dedicated API endpoint.
 * @function markNotificationAsRead
 * @param {string|number} notificationId - Notification ID to mark as read
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated notification object
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export async function markNotificationAsRead(notificationId, token = '') {
  try {
    debugLog('NotificationMutations.markNotificationAsRead', 'Marking notification as read', {
      notificationId,
    });

    // Use existing updateNotification function which handles auth properly
    const response = await notificationRequests.updateNotification(
      notificationId,
      { isRead: true },
      token
    );

    // Invalidate relevant SWR caches
    mutate(
      (key) =>
        Array.isArray(key) &&
        (key[0] === 'getPaginatedNotifications' ||
          key[0] === 'getNotificationsByUser' ||
          key[0] === 'getNotification'),
      undefined,
      { revalidate: true }
    );

    debugLog(
      'NotificationMutations.markNotificationAsRead',
      'Successfully marked as read',
      response
    );
    return response;
  } catch (error) {
    debugError(
      'NotificationMutations.markNotificationAsRead',
      'Failed to mark notification as read',
      error
    );
    throw error;
  }
}

/**
 * Mark all notifications as read for a user using the dedicated API endpoint.
 * @function markAllNotificationsAsRead
 * @param {string|number} userId - User ID whose notifications to mark as read
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response with count of updated notifications
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export async function markAllNotificationsAsRead(userId, token = '') {
  try {
    debugLog(
      'NotificationMutations.markAllNotificationsAsRead',
      'Marking all notifications as read',
      {
        userId,
      }
    );

    // Use dedicated mark-all-read endpoint for efficient bulk updates
    const response = await fetch('/api/notification/mark-all-read', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Invalidate relevant SWR caches
    mutate(
      (key) =>
        Array.isArray(key) &&
        (key[0] === 'getPaginatedNotifications' || key[0] === 'getNotificationsByUser'),
      undefined,
      { revalidate: true }
    );

    debugLog('NotificationMutations.markAllNotificationsAsRead', 'Bulk update completed', result);

    return result.data || result;
  } catch (error) {
    debugError(
      'NotificationMutations.markAllNotificationsAsRead',
      'Failed to mark all notifications as read',
      error
    );
    throw error;
  }
}

/**
 * Delete a notification.
 * @function deleteNotificationMutation
 * @param {string|number} notificationId - Notification ID to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Deletion response
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export async function deleteNotificationMutation(notificationId, token = '') {
  try {
    debugLog('NotificationMutations.deleteNotificationMutation', 'Deleting notification', {
      notificationId,
    });

    const response = await notificationRequests.deleteNotification(notificationId, token);

    // Invalidate relevant SWR caches
    mutate(
      (key) =>
        Array.isArray(key) &&
        (key[0] === 'getPaginatedNotifications' || key[0] === 'getNotificationsByUser'),
      undefined,
      { revalidate: true }
    );

    debugLog(
      'NotificationMutations.deleteNotificationMutation',
      'Successfully deleted notification',
      response
    );
    return response;
  } catch (error) {
    debugError(
      'NotificationMutations.deleteNotificationMutation',
      'Failed to delete notification',
      error
    );
    throw error;
  }
}

/**
 * Create a new notification.
 * @function createNotificationMutation
 * @param {Object} notificationData - Notification data to create
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Created notification object
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export async function createNotificationMutation(notificationData, token = '') {
  try {
    debugLog(
      'NotificationMutations.createNotificationMutation',
      'Creating notification',
      notificationData
    );

    const response = await notificationRequests.createNotification(notificationData, token);

    // Invalidate relevant SWR caches to show new notification
    mutate(
      (key) =>
        Array.isArray(key) &&
        (key[0] === 'getPaginatedNotifications' || key[0] === 'getNotificationsByUser'),
      undefined,
      { revalidate: true }
    );

    debugLog(
      'NotificationMutations.createNotificationMutation',
      'Successfully created notification',
      response
    );
    return response;
  } catch (error) {
    debugError(
      'NotificationMutations.createNotificationMutation',
      'Failed to create notification',
      error
    );
    throw error;
  }
}
