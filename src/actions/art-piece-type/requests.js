/**
 * @file requests.js
 * @description ArtPieceTypeApiClient class for ArtPieceType CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.ArtPieceType.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType} - ArtPieceType entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ArtPieceTypeApiClient class for handling ArtPieceType API operations.
 * Extends ApiClient to provide art piece type-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ArtPieceTypeApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.ArtPieceType.Requests
 */
export class ArtPieceTypeApiClient extends ApiClient {
  constructor() {
    super();
  }
  /**
   * Fetch paginated art piece types with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status=''] - Status filter
   * @param {string} [params.sortBy=''] - Sort field
   * @param {string} [params.sortOrder='asc'] - Sort order
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated art piece types data
   */
  async getPaginatedArtPieceTypes({ page = 1, limit = 10, search = '', status = '', sortBy = '', sortOrder = 'asc' }, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.artPieceType.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single art piece type by ID.
   * @param {string|number} id - The art piece type ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The art piece type object
   */
  async getArtPieceType(id, revalidate) {
    const path = endpoints.artPieceType.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new art piece type.
   * @param {Object|FormData} data - The art piece type data
   * @returns {Promise<Object>} The created art piece type
   */
  async createArtPieceType(data) {
    const path = endpoints.artPieceType.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing art piece type.
   * @param {string|number} id - The art piece type ID
   * @param {Object|FormData} data - The updated art piece type data
   * @returns {Promise<Object>} The updated art piece type
   */
  async updateArtPieceType(id, data) {
    const path = endpoints.artPieceType.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an art piece type.
   * @param {string|number} id - The art piece type ID
   * @returns {Promise<Object>} The response data
   */
  async deleteArtPieceType(id) {
    const path = endpoints.artPieceType.delete.path(id);
    return this.delete(path);
  }
}
