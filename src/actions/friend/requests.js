/**
 * @file requests.js
 * @description FriendApiClient class for Friend operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Friend.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Friend} - Friend entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * FriendApiClient class for handling Friend API operations.
 * Extends ApiClient to provide friend-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class FriendApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Friend.Requests
 */
export class FriendApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated friends with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string|number} [params.userId1] - First user ID filter
   * @param {string|number} [params.userId2] - Second user ID filter
   * @param {string} [params.sortBy=''] - Sort field
   * @param {string} [params.sortOrder='asc'] - Sort order
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated friends data
   */
  async getPaginatedFriends({ page = 1, limit = 10, userId1, userId2, sortBy = '', sortOrder = 'asc' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(userId1 != null && userId1 !== '' && { userId1 }),
      ...(userId2 != null && userId2 !== '' && { userId2 }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.friend.list.path}?${params}`;
    return this.get(path, { revalidate });
  }
}
