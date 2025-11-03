/**
 * @file requests.js
 * @description ArtPieceQueueApiClient class for ArtPieceQueue CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.ArtPieceQueue.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue} - ArtPieceQueue entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ArtPieceQueueApiClient class for handling ArtPieceQueue API operations.
 * Extends ApiClient to provide art piece queue-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ArtPieceQueueApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.ArtPieceQueue.Requests
 */
export class ArtPieceQueueApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated art piece queues with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status=''] - Status filter (PENDING, PROCESSING, REVIEWING, APPROVED, REJECTED, PUBLISHED, ERROR)
   * @param {number} [params.harvestBatchId] - Harvest batch ID filter
   * @param {number} [params.createdBy] - Creator user ID filter
   * @param {number} [params.updatedBy] - Last updated by user ID filter
   * @param {string} [params.artistName] - Artist name filter
   * @param {string} [params.city] - City filter
   * @param {string} [params.state] - State filter
   * @param {string} [params.country] - Country filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated art piece queues data
   */
  async getPaginatedArtPieceQueues({ page = 1, limit = 10, search = '', status = '', harvestBatchId, createdBy, updatedBy, artistName, city, state, country } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(harvestBatchId && { harvestBatchId }),
      ...(createdBy && { createdBy }),
      ...(updatedBy && { updatedBy }),
      ...(artistName && { artistName: encodeURIComponent(artistName) }),
      ...(city && { city: encodeURIComponent(city) }),
      ...(state && { state: encodeURIComponent(state) }),
      ...(country && { country: encodeURIComponent(country) }),
    });

    const path = `${endpoints.artPieceQueue.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single art piece queue by ID.
   * @param {string|number} id - The art piece queue ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The art piece queue object
   */
  async getArtPieceQueue(id, revalidate) {
    const path = endpoints.artPieceQueue.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new art piece queue.
   * @param {Object|FormData} data - The art piece queue data
   * @returns {Promise<Object>} The created art piece queue
   */
  async createArtPieceQueue(data) {
    const path = endpoints.artPieceQueue.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing art piece queue.
   * @param {string|number} id - The art piece queue ID
   * @param {Object|FormData} data - The updated art piece queue data
   * @returns {Promise<Object>} The updated art piece queue
   */
  async updateArtPieceQueue(id, data) {
    const path = endpoints.artPieceQueue.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an art piece queue.
   * @param {string|number} id - The art piece queue ID
   * @returns {Promise<Object>} The response data
   */
  async deleteArtPieceQueue(id) {
    const path = endpoints.artPieceQueue.delete.path(id);
    return this.delete(path);
  }

  /**
   * Fetch HTML content from URL for AI processing.
   * @param {string} sourceUrl - URL to fetch HTML from
   * @param {string|number} queueId - Art piece queue ID
   * @returns {Promise<Object>} Response containing file path and metadata
   */
  async fetchHtmlForExtraction(sourceUrl, queueId) {
    const path = endpoints.artHarvesting.fetchHtml.path;
    return this.post(path, {
      body: JSON.stringify({
        sourceUrl,
        queueId,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Extract art piece data from HTML using AI.
   * @param {string|number} queueId - Art piece queue ID
   * @param {string} htmlFilePath - Path to HTML file
   * @returns {Promise<Object>} Response containing extracted data
   */
  async extractDataFromHtml(queueId, htmlFilePath) {
    const path = endpoints.artHarvesting.extract.path;
    return this.post(path, {
      body: JSON.stringify({
        queueId,
        htmlFilePath,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Get art piece queue statistics and metrics.
   * @returns {Promise<Object>} Response containing queue statistics
   */
  async getArtPieceQueueStats() {
    const path = '/api/art-piece-queue/stats';
    return this.get(path);
  }
}

