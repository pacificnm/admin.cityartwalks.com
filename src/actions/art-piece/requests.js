/**
 * @file requests.js
 * @description ArtPieceApiClient class for ArtPiece CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.ArtPiece.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ArtPieceApiClient class for handling ArtPiece API operations.
 * Extends ApiClient to provide art piece-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ArtPieceApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.ArtPiece.Requests
 */
export class ArtPieceApiClient extends ApiClient {
  constructor() {
    super();
  }


  /**
   * Fetch paginated art pieces with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status=''] - Status filter
   * @param {number} [params.artistId] - Artist ID filter
   * @param {number} [params.cityId] - City ID filter
   * @param {number} [params.stateId] - State ID filter
   * @param {number} [params.countryId] - Country ID filter
   * @param {boolean} [params.featured] - Featured filter
   * @param {number} [params.createdBy] - Creator ID filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated art pieces data
   */
  async getPaginatedArtPieces({ page = 1, limit = 10, search = '', status = '', artistId, cityId, stateId, countryId, featured, createdBy } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(artistId && { artistId }),
      ...(cityId && { cityId }),
      ...(stateId && { stateId }),
      ...(countryId && { countryId }),
      ...(featured !== undefined && { featured }),
      ...(createdBy && { createdBy }),
    });

    const path = `${endpoints.artPiece.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single art piece by ID.
   * @param {string|number} id - The art piece ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The art piece object
   */
  async getArtPiece(id, revalidate) {
    const path = endpoints.artPiece.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch an art piece by artist slug and art piece slug.
   * @param {string} artistSlug - The artist slug
   * @param {string} artPieceSlug - The art piece slug
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The art piece object
   */
  async getArtPieceBySlug(artistSlug, artPieceSlug, revalidate) {
    const path = endpoints.artPiece.bySlug.path(
      encodeURIComponent(artistSlug),
      encodeURIComponent(artPieceSlug)
    );
    return this.get(path, { revalidate });
  }

  /**
   * Create a new art piece.
   * @param {Object|FormData} data - The art piece data
   * @returns {Promise<Object>} The created art piece
   */
  async createArtPiece(data) {
    const path = endpoints.artPiece.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing art piece.
   * @param {string|number} id - The art piece ID
   * @param {Object|FormData} data - The updated art piece data
   * @returns {Promise<Object>} The updated art piece
   */
  async updateArtPiece(id, data) {
    const path = endpoints.artPiece.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an art piece.
   * @param {string|number} id - The art piece ID
   * @returns {Promise<Object>} The response data
   */
  async deleteArtPiece(id) {
    const path = endpoints.artPiece.delete.path(id);
    return this.delete(path);
  }

  /**
   * Fetch all art pieces (non-paginated).
   * @param {number} [limit=100] - Maximum number of items
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} All art pieces
   */
  async getAllArtPieces(limit = 100, revalidate) {
    const url = `${endpoints.artPiece.list.path}?limit=${limit}`;
    return this.get(url, { revalidate });
  }

  /**
   * Fetch count statistics for an art piece.
   * @param {string|number} artPieceId - The art piece ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Count statistics
   */
  async getArtPieceCounts(artPieceId, revalidate) {
    const path = endpoints.artPiece.counts.path(artPieceId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch art pieces by artist ID.
   * @param {string|number} artistId - The artist ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Art pieces by artist
   */
  async getArtPieceByArtist(artistId, revalidate) {
    const path = endpoints.artPiece.byArtist.path(artistId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch art pieces by country.
   * @param {string} country - Country identifier
   * @param {string} [search=''] - Optional search query
   * @param {boolean} [featured] - Optional featured filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Array>} Art pieces array
   */
  async getArtPieceByCountry(country, search = '', featured, revalidate) {
    const params = new URLSearchParams();
    if (search) params.set('search', encodeURIComponent(search));
    if (featured !== undefined) params.set('featured', featured.toString());
    params.set('status', 'ACTIVE');

    const query = params.toString() ? `?${params.toString()}` : '';
    const path = `${endpoints.artPiece.byCountry.path(encodeURIComponent(country))}${query}`;
    const response = await this.get(path, { revalidate });
    return response?.artPieces || [];
  }

  /**
   * Fetch art pieces by state.
   * @param {string} country - Country identifier
   * @param {string} state - State identifier
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Art pieces by state
   */
  async getArtPieceByState(country, state, revalidate) {
    const params = new URLSearchParams();
    params.set('status', 'ACTIVE');

    const query = params.toString() ? `?${params.toString()}` : '';
    const path = `${endpoints.artPiece.byState.path(
      encodeURIComponent(country),
      encodeURIComponent(state)
    )}${query}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch art pieces by city.
   * @param {string} country - Country identifier
   * @param {string} state - State identifier
   * @param {string} city - City identifier
   * @param {string} [search=''] - Optional search query
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Art pieces by city
   */
  async getArtPieceByCity(country, state, city, search = '', revalidate) {
    const params = new URLSearchParams();
    if (search) params.set('search', encodeURIComponent(search));
    params.set('status', 'ACTIVE');

    const query = params.toString() ? `?${params.toString()}` : '';
    const path = `${endpoints.artPiece.byCity.path(
      encodeURIComponent(country),
      encodeURIComponent(state),
      encodeURIComponent(city)
    )}${query}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch art pieces within a viewport.
   * @param {Object} viewport - Bounding box with swLat, swLng, neLat, neLng, zoom
   * @param {string} [search=''] - Optional search query
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Art pieces within viewport
   */
  async getArtPieceByViewport(viewport, search = '', revalidate) {
    const { swLat, swLng, neLat, neLng, zoom } = viewport;

    const params = new URLSearchParams({
      swLat: swLat.toString(),
      swLng: swLng.toString(),
      neLat: neLat.toString(),
      neLng: neLng.toString(),
    });

    if (zoom) params.set('zoom', zoom.toString());
    if (search) params.set('search', encodeURIComponent(search));

    const path = `${endpoints.artPiece.byViewport.path}?${params.toString()}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch art pieces within a geographic radius.
   * @param {Object} center - Object with lat and lng properties
   * @param {number} radius - Radius in kilometers
   * @param {string} [search=''] - Optional search query
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Art pieces within radius
   */
  async getArtPieceByRadius(center, radius, search = '', revalidate) {
    const { lat, lng } = center;

    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
    });

    if (search) params.set('search', encodeURIComponent(search));

    const path = `/api/art-piece/radius?${params.toString()}`;
    return this.get(path, { revalidate });
  }

  /**
   * Increment view count for an art piece.
   * @param {string|number} id - The art piece ID
   * @returns {Promise<Object>} The response data
   */
  async incrementArtPieceViewCount(id) {
    const path = endpoints.artPiece.updateViewCount.path(id);
    return this.put(path, {});
  }

  /**
   * Generate AI-powered description for an art piece.
   * @param {string|number} artPieceId - Art piece ID
   * @param {string} artistName - Artist name
   * @param {string} title - Art piece title
   * @returns {Promise<string>} Generated description
   */
  async generateArtPieceAIDescription(artPieceId, artistName, title) {
    const path = endpoints.artPiece.description.path(artPieceId);
    const response = await this.post(path, {
      body: JSON.stringify({
        artistName,
        title,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    return response?.data?.description || response?.description || response;
  }

  /**
   * Generate AI-powered SEO meta description for an art piece.
   * @param {string|number} artPieceId - Art piece ID
   * @param {string} artistName - Artist name
   * @param {string} title - Art piece title
   * @param {string} description - Full description to summarize
   * @returns {Promise<string>} Generated meta description
   */
  async generateArtPieceAIMetaDescription(artPieceId, artistName, title, description) {
    const path =
      endpoints.artPiece.metaDescription?.path(artPieceId) ||
      `/api/art-piece/${artPieceId}/meta-description`;
    const response = await this.post(path, {
      body: JSON.stringify({
        artistName,
        title,
        description,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    return response?.data?.metaDescription || response?.metaDescription || response;
  }

  /**
   * Generate AI-powered SEO meta keywords for an art piece.
   * @param {string|number} artPieceId - Art piece ID
   * @param {string} artistName - Artist name
   * @param {string} title - Art piece title
   * @param {string} description - Full description to analyze
   * @param {Object} [metadata={}] - Additional metadata
   * @returns {Promise<string>} Generated comma-separated meta keywords
   */
  async generateArtPieceAIMetaKeywords(artPieceId, artistName, title, description, metadata = {}) {
    const path =
      endpoints.artPiece.metaKeywords?.path(artPieceId) ||
      `/api/art-piece/${artPieceId}/meta-keywords`;
    const response = await this.post(path, {
      body: JSON.stringify({
        artistName,
        title,
        description,
        city: metadata.city || null,
        state: metadata.state || null,
        medium: metadata.medium || null,
        artPieceType: metadata.artPieceType || null,
        artPieceMaterial: metadata.artPieceMaterial || null,
        artPieceTag: metadata.artPieceTag || null,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    return response?.data?.metaKeywords || response?.metaKeywords || response;
  }
}
