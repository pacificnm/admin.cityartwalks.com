/**
 * @file requests.js
 * @description UserFavoriteArtPieceApiClient class for user favorite art piece operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.UserFavoriteArtPiece.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * UserFavoriteArtPieceApiClient class for handling user favorite art piece API operations.
 * Extends ApiClient to provide user favorite art piece-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class UserFavoriteArtPieceApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.UserFavoriteArtPiece.Requests
 */
export class UserFavoriteArtPieceApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of user favorite art pieces.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated user favorite art pieces
   */
  async getPaginatedUserFavoriteArtPieces({ page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
    });

    const path = `${endpoints.userFavoriteArtPiece.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single user favorite art piece by ID.
   * @param {string|number} id - The user favorite art piece ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The user favorite art piece object
   */
  async getUserFavoriteArtPiece(id, revalidate) {
    const path = endpoints.userFavoriteArtPiece.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Check if user has favorited a specific art piece.
   * @param {string|number} userId - User ID to check favorites for
   * @param {string|number} artPieceId - Art piece ID to check favorite status for
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User favorite art piece data
   * @throws {Error} When user ID is not provided
   */
  async getUserArtPieceFavorite(userId, artPieceId, revalidate) {
    if (!userId) {
      throw new Error('User ID is required to check favorite status');
    }
    const path = endpoints.userFavoriteArtPiece.userArtPieceFavorite.path(userId, artPieceId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch user favorite art pieces for a specific user.
   * @param {string|number} userId - User ID to fetch favorites for
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} User's favorite art pieces
   */
  async getUserFavoriteArtPiecesByUser(userId, revalidate) {
    const path = endpoints.userFavoriteArtPiece.user.path(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new user favorite art piece.
   * @param {Object|FormData} data - The user favorite art piece data
   * @returns {Promise<Object>} The created user favorite art piece
   */
  async createUserFavoriteArtPiece(data) {
    const path = endpoints.userFavoriteArtPiece.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing user favorite art piece.
   * @param {string|number} id - The user favorite art piece ID
   * @param {Object|FormData} data - The updated user favorite art piece data
   * @returns {Promise<Object>} The updated user favorite art piece
   */
  async updateUserFavoriteArtPiece(id, data) {
    const path = endpoints.userFavoriteArtPiece.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a user favorite art piece by ID.
   * @param {string|number} id - The user favorite art piece ID
   * @returns {Promise<Object>} The response data
   */
  async deleteUserFavoriteArtPiece(id) {
    const path = endpoints.userFavoriteArtPiece.delete.path(id);
    return this.delete(path);
  }

  /**
   * Toggle user favorite art piece status - adds if not favorited, removes if already favorited.
   * @param {Object} data - Toggle data including art piece ID
   * @returns {Promise<Object>} Toggle result with current favorite status
   */
  async toggleUserFavoriteArtPiece(data) {
    const path = endpoints.userFavoriteArtPiece.toggle.path;

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
