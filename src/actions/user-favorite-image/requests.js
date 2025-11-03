/**
 * @file requests.js
 * @description UserFavoriteImageApiClient class for user favorite image operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.UserFavoriteImage.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * UserFavoriteImageApiClient class for handling user favorite image API operations.
 * Extends ApiClient to provide user favorite image-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class UserFavoriteImageApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.UserFavoriteImage.Requests
 */
export class UserFavoriteImageApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of user favorite images.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated user favorite images
   */
  async getPaginatedUserFavoriteImages({ page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
    });

    const path = `${endpoints.userFavoriteImage.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single user favorite image by composite ID.
   * @param {string|number} id - The user favorite image composite ID (userId-imageId)
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The user favorite image object
   */
  async getUserFavoriteImage(id, revalidate) {
    const path = endpoints.userFavoriteImage.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Check if user has favorited a specific image.
   * @param {string|number} userId - User ID to check favorites for
   * @param {string|number} imageId - Image ID to check favorite status for
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User favorite image data
   * @throws {Error} When user ID is not provided
   */
  async getUserImageFavorite(userId, imageId, revalidate) {
    if (!userId) {
      throw new Error('User ID is required to check favorite status');
    }
    const path = endpoints.userFavoriteImage.userImageToggle.command(userId, imageId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch all favorite images for a specific user.
   * @param {string|number} userId - User ID to fetch favorites for
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User's favorite images
   */
  async getUserFavoriteImages(userId, revalidate) {
    const path = endpoints.userFavoriteImage.userFavorites.command(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new user favorite image.
   * @param {Object|FormData} data - The user favorite image data
   * @returns {Promise<Object>} The created user favorite image
   */
  async createUserFavoriteImage(data) {
    const path = endpoints.userFavoriteImage.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Create a new user favorite image (alternative endpoint).
   * @param {Object|FormData} data - The user favorite image data
   * @returns {Promise<Object>} The created user favorite image
   */
  async createUserFavoriteImageAlt(data) {
    const path = endpoints.userFavoriteImage.createAlt.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing user favorite image.
   * @param {string|number} id - The user favorite image composite ID (userId-imageId)
   * @param {Object|FormData} data - The updated user favorite image data
   * @returns {Promise<Object>} The updated user favorite image
   */
  async updateUserFavoriteImage(id, data) {
    const path = endpoints.userFavoriteImage.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a user favorite image by composite ID.
   * @param {string|number} id - The user favorite image composite ID (userId-imageId)
   * @returns {Promise<Object>} The response data
   */
  async deleteUserFavoriteImage(id) {
    const path = endpoints.userFavoriteImage.delete.path(id);
    return this.delete(path);
  }

  /**
   * Toggle user favorite image status - adds if not favorited, removes if already favorited.
   * @param {Object} data - Toggle data including image ID
   * @returns {Promise<Object>} Toggle result with current favorite status
   */
  async toggleUserFavoriteImage(data) {
    const path = endpoints.userFavoriteImage.toggle.path;

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Toggle favorite status for specific user and image.
   * @param {string|number} userId - User ID
   * @param {string|number} imageId - Image ID
   * @returns {Promise<Object>} Toggle result with current favorite status
   */
  async toggleUserImageFavorite(userId, imageId) {
    const path = endpoints.userFavoriteImage.userImageToggle.command(userId, imageId);

    return this.post(path, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
