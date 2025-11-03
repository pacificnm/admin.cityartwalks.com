/**
 * @file requests.js
 * @description ArtistApiClient class for Artist CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Artist.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ArtistApiClient class for handling Artist API operations.
 * Extends ApiClient to provide artist-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ArtistApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Artist.Requests
 */
export class ArtistApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated artists with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status=''] - Status filter
   * @param {number} [params.createdBy] - Creator user ID filter
   * @param {number} [params.cityId] - City ID filter
   * @param {number} [params.stateId] - State ID filter
   * @param {number} [params.countryId] - Country ID filter
   * @param {boolean} [params.featured] - Featured filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated artists data
   */
  async getPaginatedArtists({ page = 1, limit = 10, search = '', status = '', createdBy, cityId, stateId, countryId, featured } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(createdBy && { createdBy }),
      ...(cityId && { cityId }),
      ...(stateId && { stateId }),
      ...(countryId && { countryId }),
      ...(featured !== undefined && { featured }),
    });

    const path = `${endpoints.artist.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single artist by ID.
   * @param {string|number} id - The artist ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The artist object
   */
  async getArtist(id, revalidate) {
    const path = endpoints.artist.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single artist by slug.
   * @param {string} slug - The artist slug
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The artist object
   */
  async getArtistBySlug(slug, revalidate) {
    const path = endpoints.artist.slug.path(slug);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new artist.
   * @param {Object|FormData} data - The artist data
   * @returns {Promise<Object>} The created artist
   */
  async createArtist(data) {
    const path = endpoints.artist.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing artist.
   * @param {string|number} id - The artist ID
   * @param {Object|FormData} data - The updated artist data
   * @returns {Promise<Object>} The updated artist
   */
  async updateArtist(id, data) {
    const path = endpoints.artist.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an artist.
   * @param {string|number} id - The artist ID
   * @returns {Promise<Object>} The response data
   */
  async deleteArtist(id) {
    const path = endpoints.artist.delete.path(id);
    return this.delete(path);
  }

  /**
   * Fetch active artists with optional filtering.
   * @param {Object} params - Filter parameters
   * @param {string} [params.city] - City filter
   * @param {string} [params.status] - Status filter
   * @param {string} [params.search=''] - Search term
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Active artists
   */
  async getActiveArtists({ city, status, search = '', page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(city && { city }),
      ...(status && { status }),
      ...(search && { search: encodeURIComponent(search) }),
    });

    const path = `${endpoints.artist.status.path('ACTIVE')}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch count statistics for an artist.
   * @param {string|number} artistId - The artist ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Count statistics
   */
  async getArtistCounts(artistId, revalidate) {
    const path = endpoints.artist.counts.path(artistId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch featured artists by location.
   * @param {Object} params - Filter parameters
   * @param {string} [params.country] - Country filter
   * @param {string} [params.state] - State filter
   * @param {string} [params.city] - City filter
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Featured artists
   */
  async getArtistFeatured({ country, state, city, page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(country && { country }),
      ...(state && { state }),
      ...(city && { city }),
    });

    const path = `${endpoints.artist.featured.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Increment view count for an artist.
   * @param {string|number} id - The artist ID
   * @returns {Promise<Object>} The response data
   */
  async incrementArtistViewCount(id) {
    const path = endpoints.artist.updateViewCount.path(id);
    return this.put(path, {});
  }

  /**
   * Generate AI-powered biography for an artist.
   * @param {Object} data - Artist data for biography generation
   * @param {string} data.artistName - The name of the artist
   * @param {Array} data.artPieces - Array of art pieces created by the artist
   * @returns {Promise<Object>} Response containing the generated biography
   */
  async generateArtistBiography(data) {
    const path = endpoints.artist.biography.path;
    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Generate AI-powered SEO meta description for an artist.
   * @param {string|number} artistId - Artist ID
   * @param {string} artistName - Artist name
   * @param {string} biography - Artist biography
   * @returns {Promise<string>} Generated meta description
   */
  async generateArtistAIMetaDescription(artistId, artistName, biography) {
    const path = endpoints.artist.metaDescription.path(artistId);
    const response = await this.post(path, {
      body: JSON.stringify({
        artistName,
        biography,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    return response?.data?.metaDescription || response?.metaDescription || response;
  }

  /**
   * Generate AI-powered SEO meta keywords for an artist.
   * @param {string|number} artistId - Artist ID
   * @param {string} artistName - Artist name
   * @param {string} biography - Artist biography
   * @returns {Promise<string>} Generated meta keywords
   */
  async generateArtistAIMetaKeywords(artistId, artistName, biography) {
    const path = endpoints.artist.metaKeywords.path(artistId);
    const response = await this.post(path, {
      body: JSON.stringify({
        artistName,
        biography,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    return response?.data?.metaKeywords || response?.metaKeywords || response;
  }
}
