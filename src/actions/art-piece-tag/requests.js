/**
 * @file requests.js
 * @description ArtPieceTagApiClient class for ArtPieceTag CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.ArtPieceTag.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceTag} - ArtPieceTag entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ArtPieceTagApiClient class for handling ArtPieceTag API operations.
 * Extends ApiClient to provide art piece tag-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ArtPieceTagApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.ArtPieceTag.Requests
 */
export class ArtPieceTagApiClient extends ApiClient {
  constructor() {
    super();
  }
  /**
   * Fetch paginated art piece tags with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.active=''] - Active status filter
   * @param {string} [params.createdBy=''] - Creator user ID filter
   * @param {string} [params.sortBy=''] - Sort field
   * @param {string} [params.sortOrder='asc'] - Sort order
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated art piece tags data
   */
  async getPaginatedArtPieceTags({ page = 1, limit = 10, search = '', active = '', createdBy = '', sortBy = '', sortOrder = 'asc' }, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(active && { active }),
      ...(createdBy && { createdBy }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.artPieceTags.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch all art piece tags (non-paginated).
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} All art piece tags
   */
  async getArtPieceTags(revalidate) {
    const path = endpoints.artPieceTags.list.path;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single art piece tag by ID.
   * @param {string|number} id - The art piece tag ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The art piece tag object
   */
  async getArtPieceTag(id, revalidate) {
    const path = endpoints.artPieceTags.read.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new art piece tag.
   * @param {Object|FormData} data - The art piece tag data
   * @returns {Promise<Object>} The created art piece tag
   */
  async createArtPieceTag(data) {
    const path = endpoints.artPieceTags.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing art piece tag.
   * @param {string|number} id - The art piece tag ID
   * @param {Object|FormData} data - The updated art piece tag data
   * @returns {Promise<Object>} The updated art piece tag
   */
  async updateArtPieceTag(id, data) {
    const path = endpoints.artPieceTags.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an art piece tag.
   * @param {string|number} id - The art piece tag ID
   * @returns {Promise<Object>} The response data
   */
  async deleteArtPieceTag(id) {
    const path = endpoints.artPieceTags.delete.path(id);
    return this.delete(path);
  }
}
