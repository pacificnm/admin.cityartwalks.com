/**
 * @file requests.js
 * @description ArtHarvestingApiClient class for ArtHarvesting operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.ArtHarvesting.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtHarvesting} - ArtHarvesting entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * ArtHarvestingApiClient class for handling ArtHarvesting API operations.
 * Extends ApiClient to provide art harvesting-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ArtHarvestingApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.ArtHarvesting.Requests
 */
export class ArtHarvestingApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Attach images from URLs to published art pieces.
   * Downloads images, uploads to storage, and creates Image records.
   * @param {Object} attachConfig - Configuration for image attachment
   * @param {number} attachConfig.artPieceId - ID of published art piece
   * @param {string} attachConfig.artPieceTitle - Title for filename organization
   * @param {string} attachConfig.artistName - Artist name for filename organization
   * @param {string} [attachConfig.imageUrl] - Primary image URL (optional)
   * @param {Array<string>} attachConfig.imageUrls - Array of image URLs to download and attach
   * @returns {Promise<Object>} Response containing attachment results and created image records
   */
  async attachImages(attachConfig) {
    const path = endpoints.artHarvesting.attachImages.path;
    return this.post(path, {
      body: JSON.stringify(attachConfig),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
