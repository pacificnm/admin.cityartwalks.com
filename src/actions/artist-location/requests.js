/**
 * @file requests.js
 * @description ArtistLocationApiClient class for ArtistLocation CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.ArtistLocation.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtistLocation} - ArtistLocation entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ArtistLocationApiClient class for handling ArtistLocation API operations.
 * Extends ApiClient to provide artist location-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ArtistLocationApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.ArtistLocation.Requests
 */
export class ArtistLocationApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated artist locations with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {number} [params.artistId] - Artist ID filter
   * @param {number} [params.countryId] - Country ID filter
   * @param {number} [params.stateId] - State ID filter
   * @param {number} [params.cityId] - City ID filter
   * @param {boolean} [params.primary] - Primary location filter
   * @param {boolean} [params.active] - Active status filter
   * @param {string} [params.source] - Source filter (manual, art_piece, migration)
   * @param {number} [params.createdBy] - Creator user ID filter
   * @param {number} [params.updatedBy] - Updater user ID filter
   * @param {string} [params.sortBy] - Sort field
   * @param {string} [params.sortOrder] - Sort order
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated artist locations data
   */
  async getPaginatedArtistLocations({ page = 1, limit = 10, search = '', artistId, countryId, stateId, cityId, primary, active, source, createdBy, updatedBy, sortBy, sortOrder } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(artistId && { artistId }),
      ...(countryId && { countryId }),
      ...(stateId && { stateId }),
      ...(cityId && { cityId }),
      ...(primary !== undefined && { primary }),
      ...(active !== undefined && { active }),
      ...(source && { source }),
      ...(createdBy && { createdBy }),
      ...(updatedBy && { updatedBy }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.artistLocation.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single artist location by ID.
   * @param {string|number} id - The artist location ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The artist location object
   */
  async getArtistLocationById(id, revalidate) {
    const path = endpoints.artistLocation.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new artist location.
   * @param {Object|FormData} data - The artist location data
   * @returns {Promise<Object>} The created artist location
   */
  async createArtistLocation(data) {
    const path = endpoints.artistLocation.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing artist location.
   * @param {string|number} id - The artist location ID
   * @param {Object|FormData} data - The updated artist location data
   * @returns {Promise<Object>} The updated artist location
   */
  async updateArtistLocation(id, data) {
    const path = endpoints.artistLocation.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an artist location.
   * @param {string|number} id - The artist location ID
   * @returns {Promise<Object>} The response data
   */
  async deleteArtistLocation(id) {
    const path = endpoints.artistLocation.delete.path(id);
    return this.delete(path);
  }

  /**
   * Fetch all artist locations for a specific artist.
   * @param {string|number} artistId - The artist ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Artist locations data
   */
  async getArtistLocationsByArtist(artistId, revalidate) {
    const path = endpoints.artistLocation.byArtist.path(artistId);
    return this.get(path, { revalidate });
  }
}
