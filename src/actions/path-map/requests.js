/**
 * @file requests.js
 * @description PathMapApiClient class for Path Map operations (DEPRECATED - No endpoints configured).
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.PathMap.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

/**
 * PathMapApiClient class for handling Path Map API operations (SHELL - NO ENDPOINTS CONFIGURED).
 * Extends ApiClient to provide path map-specific HTTP methods.
 * Note: Path Map endpoints are not yet configured in the endpoint configuration.
 * This class is reserved for future implementation when endpoints become available.
 * 
 * @class PathMapApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.PathMap.Requests
 */
export class PathMapApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Path Map API endpoints are not yet configured.
   * This is a placeholder class awaiting endpoint implementation.
   * 
   * @deprecated No endpoints available - reserved for future use
   * @returns {Promise<void>}
   */
  async getPathMaps() {
    throw new Error('PathMap endpoints are not yet configured in the API.');
  }

  /**
   * Path Map paginated query not yet available.
   * 
   * @deprecated No endpoints available - reserved for future use
   * @returns {Promise<void>}
   */
  async getPaginatedPathMaps() {
    throw new Error('PathMap endpoints are not yet configured in the API.');
  }

  /**
   * Path Map by ID not yet available.
   * 
   * @deprecated No endpoints available - reserved for future use
   * @returns {Promise<void>}
   */
  async getPathMap() {
    throw new Error('PathMap endpoints are not yet configured in the API.');
  }
}
