/**
 * @file requests.js
 * @description StateApiClient class for State CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.State.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';


/**
 * StateApiClient class for handling State API operations.
 * Extends ApiClient to provide state-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class StateApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.State.Requests
 */
export class StateApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of states with optional filtering.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated states data
   */
  async getPaginatedStates({ page = 1, limit = 10 } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
    });

    const path = `${endpoints.state.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single state by ID.
   * @param {string|number} id - The state ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The state object
   */
  async getState(id, revalidate) {
    const path = endpoints.state.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single state by country and state slug.
   * @param {string} countrySlug - Country slug
   * @param {string} stateSlug - State slug
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The state object
   */
  async getStateByCountryAndSlug(countrySlug, stateSlug, revalidate) {
    const path = endpoints.location.region.path(countrySlug, stateSlug);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new state.
   * @param {Object|FormData} data - The state data
   * @returns {Promise<Object>} The created state
   */
  async createState(data) {
    const path = endpoints.state.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing state.
   * @param {string|number} id - The state ID
   * @param {Object|FormData} data - The updated state data
   * @returns {Promise<Object>} The updated state
   */
  async updateState(id, data) {
    const path = endpoints.state.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a state by ID.
   * @param {string|number} id - The state ID
   * @returns {Promise<Object>} The response data
   */
  async deleteState(id) {
    const path = endpoints.state.delete.path(id);
    return this.delete(path);
  }

  /**
   * Fetch cities for a state by state ID.
   * @param {string|number} id - The state ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The cities data
   */
  async getStateCities(id, revalidate) {
    const path = endpoints.state.cities.path(id);
    return this.get(path, { revalidate });
  }
}
