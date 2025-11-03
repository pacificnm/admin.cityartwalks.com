/**
 * @file requests.js
 * @description UserPreferenceApiClient class for user preference operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.UserPreference.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * UserPreferenceApiClient class for handling user preference API operations.
 * Extends ApiClient to provide user preference-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class UserPreferenceApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.UserPreference.Requests
 */
export class UserPreferenceApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of user preferences.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated user preferences
   */
  async getPaginatedUserPreferences({ page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
    });

    const path = `${endpoints.userPreference.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch user preferences by user ID.
   * @param {string|number} userId - User ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User preferences
   * @throws {Error} When user ID is not valid
   */
  async getUserPreferences(userId, revalidate) {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    const path = endpoints.userPreference.user.path(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single user preference by ID.
   * @param {string|number} id - The user preference ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The user preference object
   */
  async getUserPreference(id, revalidate) {
    const path = endpoints.userPreference.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch user location preferences.
   * @param {string|number} userId - User ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User location preferences
   * @throws {Error} When user ID is not valid
   */
  async getUserLocationPreferences(userId, revalidate) {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    const path = endpoints.userPreference.user.location.path(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch user email preferences.
   * @param {string|number} userId - User ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User email preferences
   * @throws {Error} When user ID is not valid
   */
  async getUserEmailPreferences(userId, revalidate) {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    const path = endpoints.userPreference.user.email.path(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch user notification preferences.
   * @param {string|number} userId - User ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User notification preferences
   * @throws {Error} When user ID is not valid
   */
  async getUserNotificationPreferences(userId, revalidate) {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    const path = endpoints.userPreference.user.notifications.path(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch user privacy preferences.
   * @param {string|number} userId - User ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User privacy preferences
   * @throws {Error} When user ID is not valid
   */
  async getUserPrivacyPreferences(userId, revalidate) {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    const path = endpoints.userPreference.user.privacy.path(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new user preference.
   * @param {Object|FormData} data - The user preference data
   * @returns {Promise<Object>} The created user preference
   */
  async createUserPreference(data) {
    const path = endpoints.userPreference.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing user preference.
   * @param {string|number} id - The user preference ID
   * @param {Object|FormData} data - The updated user preference data
   * @returns {Promise<Object>} The updated user preference
   */
  async updateUserPreference(id, data) {
    const path = endpoints.userPreference.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update user location preferences.
   * @param {string|number} userId - User ID
   * @param {Object} locationData - Location preference data
   * @returns {Promise<Object>} Updated location preferences
   * @throws {Error} When user ID is not valid
   */
  async updateUserLocationPreferences(userId, locationData) {
    if (!userId || !locationData) {
      throw new Error('Valid user ID and location data are required');
    }
    const path = endpoints.userPreference.user.location.path(userId);

    return this.put(path, {
      body: JSON.stringify(locationData),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update user email preferences.
   * @param {string|number} userId - User ID
   * @param {Object} emailPreferences - Email preference data
   * @returns {Promise<Object>} Updated email preferences
   * @throws {Error} When user ID is not valid
   */
  async updateUserEmailPreferences(userId, emailPreferences) {
    if (!userId || !emailPreferences) {
      throw new Error('Valid user ID and email preferences are required');
    }
    const path = endpoints.userPreference.user.email.path(userId);

    return this.put(path, {
      body: JSON.stringify(emailPreferences),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update user notification preferences.
   * @param {string|number} userId - User ID
   * @param {Object} notificationPreferences - Notification preference data
   * @returns {Promise<Object>} Updated notification preferences
   * @throws {Error} When user ID is not valid
   */
  async updateUserNotificationPreferences(userId, notificationPreferences) {
    if (!userId || !notificationPreferences) {
      throw new Error('Valid user ID and notification preferences are required');
    }
    const path = endpoints.userPreference.user.notifications.path(userId);

    return this.put(path, {
      body: JSON.stringify(notificationPreferences),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update user privacy preferences.
   * @param {string|number} userId - User ID
   * @param {Object} privacyPreferences - Privacy preference data
   * @returns {Promise<Object>} Updated privacy preferences
   * @throws {Error} When user ID is not valid
   */
  async updateUserPrivacyPreferences(userId, privacyPreferences) {
    if (!userId || !privacyPreferences) {
      throw new Error('Valid user ID and privacy preferences are required');
    }
    const path = endpoints.userPreference.user.privacy.path(userId);

    return this.put(path, {
      body: JSON.stringify(privacyPreferences),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Clear user location preferences by setting them to null.
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} Clear location preferences response
   * @throws {Error} When user ID is not valid
   */
  async clearUserLocationPreferences(userId) {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    const clearData = {
      defaultCountryId: null,
      defaultStateId: null,
      defaultCityId: null,
    };

    return this.updateUserLocationPreferences(userId, clearData);
  }

  /**
   * Delete a user preference by ID.
   * @param {string|number} id - The user preference ID
   * @returns {Promise<Object>} The response data
   */
  async deleteUserPreference(id) {
    const path = endpoints.userPreference.delete.path(id);
    return this.delete(path);
  }
}
