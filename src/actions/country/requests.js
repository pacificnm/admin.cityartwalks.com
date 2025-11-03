/**
 * @file requests.js
 * @description CountryApiClient class for Country CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Country.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country} - Country entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * CountryApiClient class for handling Country API operations.
 * Extends ApiClient to provide country-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class CountryApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Country.Requests
 */
export class CountryApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated countries with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {boolean} [params.active] - Active status filter
   * @param {boolean} [params.featured] - Featured filter
   * @param {string} [params.continent] - Continent filter
   * @param {number} [params.createdBy] - Creator user ID filter
   * @param {number} [params.updatedBy] - Updater user ID filter
   * @param {string} [params.sortBy] - Sort field
   * @param {string} [params.sortOrder] - Sort order
   * @param {string} [params.countryCode] - Country code filter
   * @param {number} [params.minLatitude] - Minimum latitude filter
   * @param {number} [params.maxLatitude] - Maximum latitude filter
   * @param {number} [params.minLongitude] - Minimum longitude filter
   * @param {number} [params.maxLongitude] - Maximum longitude filter
   * @param {boolean} [params.hasStates] - Has states filter
   * @param {boolean} [params.hasCities] - Has cities filter
   * @param {boolean} [params.hasArtPieces] - Has art pieces filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated countries data
   */
  async getPaginatedCountries({ page = 1, limit = 10, search = '', active, featured, continent, createdBy, updatedBy, sortBy, sortOrder, countryCode, minLatitude, maxLatitude, minLongitude, maxLongitude, hasStates, hasCities, hasArtPieces } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(active !== undefined && { active }),
      ...(featured !== undefined && { featured }),
      ...(continent && { continent }),
      ...(createdBy && { createdBy }),
      ...(updatedBy && { updatedBy }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(countryCode && { countryCode }),
      ...(minLatitude !== undefined && { minLatitude }),
      ...(maxLatitude !== undefined && { maxLatitude }),
      ...(minLongitude !== undefined && { minLongitude }),
      ...(maxLongitude !== undefined && { maxLongitude }),
      ...(hasStates && { hasStates }),
      ...(hasCities && { hasCities }),
      ...(hasArtPieces && { hasArtPieces }),
    });

    const path = `${endpoints.country.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single country by ID.
   * @param {string|number} id - The country ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The country object
   */
  async getCountryById(id, revalidate) {
    const path = endpoints.country.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single country by slug.
   * @param {string} slug - The country slug
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The country object
   */
  async getCountryBySlug(slug, revalidate) {
    const path = endpoints.country.slug.path(slug);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new country.
   * @param {Object|FormData} data - The country data
   * @returns {Promise<Object>} The created country
   */
  async createCountry(data) {
    const path = endpoints.country.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing country.
   * @param {string|number} id - The country ID
   * @param {Object|FormData} data - The updated country data
   * @returns {Promise<Object>} The updated country
   */
  async updateCountry(id, data) {
    const path = endpoints.country.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a country.
   * @param {string|number} id - The country ID
   * @returns {Promise<Object>} The response data
   */
  async deleteCountry(id) {
    const path = endpoints.country.delete.path(id);
    return this.delete(path);
  }
}
