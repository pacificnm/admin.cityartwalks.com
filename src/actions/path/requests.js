/**
 * @file requests.js
 * @description PathApiClient class for Path CRUD operations and utilities.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Path.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * PathApiClient class for handling Path API operations.
 * Extends ApiClient to provide path-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class PathApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Path.Requests
 */
export class PathApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of paths with full filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status=''] - Status filter
   * @param {string} [params.pathType=''] - Path type filter
   * @param {string} [params.createdBy] - Creator user ID filter
   * @param {string} [params.countryId] - Country filter
   * @param {string} [params.stateId] - State filter
   * @param {string} [params.cityId] - City filter
   * @param {boolean} [params.featured=false] - Featured filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated paths data
   */
  async getPaginatedPaths({ page = 1, limit = 10, search = '', status = '', pathType = '', createdBy, countryId, stateId, cityId, featured = false } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(pathType && { pathType }),
      ...(createdBy && { createdBy }),
      ...(countryId && { countryId }),
      ...(stateId && { stateId }),
      ...(cityId && { cityId }),
      ...(featured && { featured }),
    });

    const path = `${endpoints.path.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single path by ID.
   * @param {string|number} id - The path ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The path object
   */
  async getPath(id, revalidate) {
    const path = endpoints.path.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new path.
   * @param {Object|FormData} data - The path data
   * @returns {Promise<Object>} The created path
   */
  async createPath(data) {
    const path = endpoints.path.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing path.
   * @param {string|number} id - The path ID
   * @param {Object|FormData} data - The updated path data
   * @returns {Promise<Object>} The updated path
   */
  async updatePath(id, data) {
    const path = endpoints.path.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a path by ID.
   * @param {string|number} id - The path ID
   * @returns {Promise<Object>} The response data
   */
  async deletePath(id) {
    const path = endpoints.path.delete.path(id);
    return this.delete(path);
  }

  /**
   * Get available path types.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The path types data
   */
  async getPathTypes(revalidate) {
    const path = endpoints.path.type.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get available map types for paths.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The path map types data
   */
  async getPathMapTypes(revalidate) {
    const path = endpoints.path.mapType.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get available zoom levels for paths.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The path zoom levels data
   */
  async getPathZoomLevels(revalidate) {
    const path = endpoints.path.zoom.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get path view counts and statistics by ID.
   * @param {string|number} id - The path ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The path counts data
   */
  async getPathCounts(id, revalidate) {
    const path = endpoints.path.counts.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Increment the view count for a specific path.
   * @param {string|number} id - The path ID
   * @returns {Promise<Object>} The response data
   */
  async incrementPathViewCount(id) {
    const path = endpoints.path.updateViewCount.path(id);
    return this.put(path, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
