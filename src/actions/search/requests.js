/**
 * @file requests.js
 * @description SearchApiClient class for Search operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Search.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * SearchApiClient class for handling Search API operations.
 * Extends ApiClient to provide search-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class SearchApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Search.Requests
 */
export class SearchApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Searches across all entity types via unified homepage search API.
   * Provides fast indexed search with optional location filtering.
   * Results are categorized by type and include navigation links.
   * 
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query string (1-100 characters)
   * @param {string} [params.countryId] - Country UUID filter
   * @param {string} [params.stateId] - State UUID filter
   * @param {string} [params.cityId] - City UUID filter
   * @param {number} [params.limit=5] - Results per category (1-20)
   * @param {number} [params.page=1] - Page number for pagination
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Categorized search results
   */
  async searchHomepage({ query, countryId, stateId, cityId, limit = 5, page = 1 } = {}, revalidate) {
    const params = new URLSearchParams({
      q: encodeURIComponent(query),
      limit,
      page,
      ...(countryId && { countryId }),
      ...(stateId && { stateId }),
      ...(cityId && { cityId }),
    });

    const path = `${endpoints.search.homepage.path}?${params}`;
    return this.get(path, { revalidate });
  }
}
