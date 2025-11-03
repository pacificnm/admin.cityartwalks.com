/**
 * @file requests.js
 * @description UserFavoriteArtistApiClient class for user favorite artist operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.UserFavoriteArtist.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * UserFavoriteArtistApiClient class for handling user favorite artist API operations.
 * Extends ApiClient to provide user favorite artist-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class UserFavoriteArtistApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.UserFavoriteArtist.Requests
 */
export class UserFavoriteArtistApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of user favorite artists.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated user favorite artists
   */
  async getPaginatedUserFavoriteArtists({ page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
    });

    const path = `${endpoints.userFavoriteArtist.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single user favorite artist by ID.
   * @param {string|number} id - The user favorite artist ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The user favorite artist object
   */
  async getUserFavoriteArtist(id, revalidate) {
    const path = endpoints.userFavoriteArtist.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Check if user has favorited a specific artist.
   * @param {string|number} userId - User ID to check favorites for
   * @param {string|number} artistId - Artist ID to check favorite status for
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User favorite artist data
   * @throws {Error} When user ID is not provided
   */
  async getUserArtistFavorite(userId, artistId, revalidate) {
    if (!userId) {
      throw new Error('User ID is required to check favorite status');
    }
    const path = endpoints.userFavoriteArtist.userArtistFavorite.command(userId, artistId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch all favorite artists for a specific user.
   * @param {string|number} userId - User ID to fetch favorites for
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User's favorite artists
   */
  async getUserFavoriteArtists(userId, revalidate) {
    const path = endpoints.userFavoriteArtist.userFavorites.command(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new user favorite artist.
   * @param {Object|FormData} data - The user favorite artist data
   * @returns {Promise<Object>} The created user favorite artist
   */
  async createUserFavoriteArtist(data) {
    const path = endpoints.userFavoriteArtist.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing user favorite artist.
   * @param {string|number} id - The user favorite artist ID
   * @param {Object|FormData} data - The updated user favorite artist data
   * @returns {Promise<Object>} The updated user favorite artist
   */
  async updateUserFavoriteArtist(id, data) {
    const path = endpoints.userFavoriteArtist.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a user favorite artist by ID.
   * @param {string|number} id - The user favorite artist ID
   * @returns {Promise<Object>} The response data
   */
  async deleteUserFavoriteArtist(id) {
    const path = endpoints.userFavoriteArtist.delete.path(id);
    return this.delete(path);
  }

  /**
   * Toggle user favorite artist status - adds if not favorited, removes if already favorited.
   * @param {Object} data - Toggle data including artist ID
   * @returns {Promise<Object>} Toggle result with current favorite status
   */
  async toggleUserFavoriteArtist(data) {
    const path = endpoints.userFavoriteArtist.toggle.path;

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Toggle favorite status for specific user and artist.
   * @param {string|number} userId - User ID
   * @param {string|number} artistId - Artist ID
   * @returns {Promise<Object>} Toggle result with current favorite status
   */
  async toggleUserArtistFavorite(userId, artistId) {
    const path = endpoints.userFavoriteArtist.toggleUserArtistFavorite.command(userId, artistId);

    return this.post(path, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
