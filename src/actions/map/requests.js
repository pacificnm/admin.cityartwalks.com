/**
 * @file requests.js
 * @description MapApiClient class for Map operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Map.Requests
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * MapApiClient class for handling Map API operations.
 * Extends ApiClient to provide map-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class MapApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Map.Requests
 */
export class MapApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Create a new static map.
   * @param {Object|FormData} data - The static map data
   * @returns {Promise<Object>} The created static map
   */
  async createStaticMap(data) {
    const path = endpoints.map.static.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

