/**
 * @file requests.js
 * @description UserApiClient class for User CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.User.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User} - User entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * UserApiClient class for handling User API operations.
 * Extends ApiClient to provide user-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class UserApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.User.Requests
 */
export class UserApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated users with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.role=''] - Role filter
   * @param {string} [params.status=''] - Status filter
   * @param {number} [params.countryId] - Country ID filter
   * @param {number} [params.stateId] - State ID filter
   * @param {number} [params.cityId] - City ID filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated users data
   */
  async getPaginatedUsers({ page = 1, limit = 10, search = '', role = '', status = '', countryId, stateId, cityId }, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(role && { role }),
      ...(status && { status }),
      ...(countryId !== undefined && countryId !== null && { countryId }),
      ...(stateId !== undefined && stateId !== null && { stateId }),
      ...(cityId !== undefined && cityId !== null && { cityId }),
    });

    const path = `${endpoints.user.list.path}?${params.toString()}`;
    const next = revalidate ? { revalidate } : undefined;
    return this.get(path, next);
  }

  /**
   * Fetch list of all users.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object[]>} List of all users
   */
  async getUsers(revalidate) {
    const path = endpoints.user.list.path;
    const next = revalidate ? { revalidate } : undefined;
    return this.get(path, next);
  }

  /**
   * Fetch user by ID.
   * @param {string|number} userId - The user ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User data
   */
  async getUser(userId, revalidate) {
    const isAuth0Id = typeof userId === 'string' && userId.startsWith('auth0|');
    const path = isAuth0Id
      ? endpoints.user.authSub.path(userId)
      : endpoints.user.details.path(userId);

    const next = revalidate ? { revalidate } : undefined;
    return this.get(path, next);
  }

  /**
   * Fetch user avatar data by ID.
   * @param {string|number} userId - The user ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User avatar data
   */
  async getUserAvatar(userId, revalidate) {
    const isAuth0Id = typeof userId === 'string' && userId.startsWith('auth0|');
    const path = isAuth0Id
      ? endpoints.user.avatarAuth.path(userId)
      : endpoints.user.avatar.path(userId);

    const next = revalidate ? { revalidate } : undefined;
    return this.get(path, next);
  }

  /**
   * Fetch user public profile data.
   * @param {string|number} userId - The user ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User public profile data
   */
  async getUserPublicProfile(userId, revalidate) {
    const path = endpoints.user.publicProfile.path(userId);
    const next = revalidate ? { revalidate } : undefined;
    return this.get(path, next);
  }

  /**
   * Fetch user by email.
   * @param {string} email - The user email
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User data
   */
  async getUserByEmail(email, revalidate) {
    const path = endpoints.user.email.path(encodeURIComponent(email));
    const next = revalidate ? { revalidate } : undefined;
    return this.get(path, next);
  }

  /**
   * Create user.
   * @param {Object|FormData} user - The user data to create
   * @returns {Promise<Object>} The newly created user data
   */
  async createUser(user) {
    const path = endpoints.user.create.path;
    const isFormData = user instanceof FormData;

    return this.post(path, {
      body: isFormData ? user : JSON.stringify(user),
      headers: isFormData
        ? {} // Browser handles the correct multipart boundaries
        : { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update user.
   * @param {string|number} id - The user ID
   * @param {Object|FormData} user - The user data to update
   * @returns {Promise<Object>} The updated user data
   */
  async updateUser(id, user) {
    const path = endpoints.user.update.path(id);
    const isFormData = user instanceof FormData;

    return this.put(path, {
      body: isFormData ? user : JSON.stringify(user),
      headers: isFormData
        ? {} // Let the browser set the correct multipart boundary
        : { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update a user's profile image.
   * @param {string|number} id - The user ID
   * @param {string} image - The new profile image URL
   * @returns {Promise<Object>} The updated user object
   */
  async updateUserProfileImage(id, image) {
    const path = endpoints.user.updateProfileImage.path(id);
    return this.put(path, {
      body: JSON.stringify({ userId: id, image }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update a user's cover image.
   * @param {string|number} id - The user ID
   * @param {string} coverImage - The new cover image URL
   * @returns {Promise<Object>} The updated user object
   */
  async updateUserCoverImage(id, coverImage) {
    const path = endpoints.user.updateCoverImage.path(id);
    return this.put(path, {
      body: JSON.stringify({ userId: id, coverImage }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update user last login timestamp.
   * @param {string|number} id - The user ID
   * @returns {Promise<Object>} The updated user data
   */
  async updateUserLastLogin(id) {
    const path = endpoints.user.lastLogin.path(id);
    return this.put(path, {});
  }

  /**
   * Delete user.
   * @param {string|number} id - The user ID
   * @returns {Promise<Object>} The response data from the server
   */
  async deleteUser(id) {
    const path = endpoints.user.delete.path(id);
    return this.delete(path);
  }
}
