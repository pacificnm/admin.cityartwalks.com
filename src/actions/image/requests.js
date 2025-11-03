/**
 * @file requests.js
 * @description ImageApiClient class for Image CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Image.Requests
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ImageApiClient class for handling Image API operations.
 * Extends ApiClient to provide image-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ImageApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Image.Requests
 */
export class ImageApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated images with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status] - Status filter (ACTIVE, DRAFT, PRIVATE, ARCHIVED)
   * @param {string} [params.createdBy] - Creator user ID filter
   * @param {string} [params.artistId] - Artist ID filter
   * @param {string} [params.artPieceId] - Art piece ID filter
   * @param {string} [params.pathId] - Path ID filter
   * @param {boolean} [params.featured] - Featured status filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated images data
   */
  async getPaginatedImages({ page = 1, limit = 10, search = '', status, createdBy, artistId, artPieceId, pathId, featured } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(createdBy && { createdBy }),
      ...(artistId && { artistId }),
      ...(artPieceId && { artPieceId }),
      ...(pathId && { pathId }),
      ...(featured !== undefined && { featured }),
    });

    const path = `${endpoints.image.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single image by ID.
   * @param {string|number} id - The image ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The image object
   */
  async getImage(id, revalidate) {
    const path = endpoints.image.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new image.
   * @param {Object|FormData} data - The image data
   * @returns {Promise<Object>} The created image
   */
  async createImage(data) {
    const path = endpoints.image.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing image.
   * @param {string|number} id - The image ID
   * @param {Object|FormData} data - The updated image data
   * @returns {Promise<Object>} The updated image
   */
  async updateImage(id, data) {
    const path = endpoints.image.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an image.
   * @param {string|number} id - The image ID
   * @returns {Promise<Object>} The response data
   */
  async deleteImage(id) {
    const path = endpoints.image.delete.path(id);
    return this.delete(path);
  }

  /**
   * Upload an image file.
   * @param {File|FormData} fileOrFormData - The file or FormData to upload
   * @returns {Promise<Object>} The upload response
   */
  async uploadImage(fileOrFormData) {
    const path = endpoints.image.upload.path;

    let formData = fileOrFormData;
    if (fileOrFormData instanceof File) {
      formData = new FormData();
      formData.append('file', fileOrFormData);
    }

    return this.post(path, { body: formData });
  }

  /**
   * Fetch paginated flagged images for moderation.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated flagged images data
   */
  async getPaginatedFlaggedImages({ page = 1, limit = 10, search = '' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
    });

    const path = `${endpoints.image.flagged.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Moderate a single image (approve or remove).
   * @param {string|number} imageId - The image ID to moderate
   * @param {string} action - Moderation action ('approve' or 'remove')
   * @param {string} [moderationNotes=''] - Optional moderation notes
   * @returns {Promise<Object>} The moderation result
   */
  async moderateImage(imageId, action, moderationNotes = '') {
    const path = endpoints.image.moderate.path;
    return this.post(path, {
      body: JSON.stringify({
        imageId,
        action,
        moderationNotes,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Moderate multiple images in bulk (approve or remove).
   * @param {Array<string|number>} imageIds - Array of image IDs to moderate
   * @param {string} action - Moderation action ('approve' or 'remove')
   * @param {string} [moderationNotes=''] - Optional moderation notes
   * @returns {Promise<Object>} The bulk moderation result
   */
  async bulkModerateImages(imageIds, action, moderationNotes = '') {
    const path = endpoints.image.moderate.path;
    return this.post(path, {
      body: JSON.stringify({
        imageIds,
        action,
        moderationNotes,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Increment view count for an image.
   * @param {string|number} imageId - The image ID
   * @returns {Promise<Object>} The updated view count data
   */
  async incrementImageViewCount(imageId) {
    const path = `/api/image/${imageId}/view-count`;
    return this.post(path, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

