/**
 * @file requests.js
 * @description UserSessionApiClient class for user session operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.UserSession.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * UserSessionApiClient class for handling user session API operations.
 * Extends ApiClient to provide user session-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class UserSessionApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.UserSession.Requests
 */
export class UserSessionApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of all user sessions (admin only).
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated user sessions
   */
  async getPaginatedUserSessions({ page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
    });

    const path = `${endpoints.userSession.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch all user sessions (non-paginated, admin only).
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} All user sessions
   */
  async getUserSessions(revalidate) {
    const path = endpoints.userSession.list.path;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single user session by ID.
   * @param {string|number} userSessionId - The user session ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The user session object
   */
  async getUserSession(userSessionId, revalidate) {
    const path = endpoints.userSession.details.path(userSessionId);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new user session.
   * @param {Object|FormData} data - The user session data
   * @returns {Promise<Object>} The created user session
   * @throws {Error} When user session data is not provided
   */
  async createUserSession(data) {
    if (!data) {
      throw new Error('UserSession object required to create');
    }

    const path = endpoints.userSession.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing user session.
   * @param {string|number} userSessionId - The user session ID
   * @param {Object|FormData} data - The updated user session data
   * @returns {Promise<Object>} The updated user session
   * @throws {Error} When user session ID or data is not provided
   */
  async updateUserSession(userSessionId, data) {
    if (!userSessionId || !data) {
      throw new Error('ID and object required to update');
    }

    const path = endpoints.userSession.update.path(userSessionId);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a user session by ID.
   * @param {string|number} userSessionId - The user session ID
   * @returns {Promise<Object>} The response data
   * @throws {Error} When user session ID is not provided
   */
  async deleteUserSession(userSessionId) {
    if (!userSessionId) {
      throw new Error('User session ID required to delete');
    }

    const path = endpoints.userSession.delete.path(userSessionId);
    return this.delete(path);
  }
}
