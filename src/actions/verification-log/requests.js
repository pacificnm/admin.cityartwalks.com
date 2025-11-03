/**
 * @file requests.js
 * @description VerificationLogApiClient class for VerificationLog CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.VerificationLog.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/VerificationLog} - VerificationLog entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * VerificationLogApiClient class for handling VerificationLog API operations.
 * Extends ApiClient to provide verification log-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class VerificationLogApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.VerificationLog.Requests
 */
export class VerificationLogApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated verification logs with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term for comments/notes fields
   * @param {string} [params.action] - Action filter (APPROVE, REJECT, REQUEST_CHANGES, FLAG_ISSUE, MARK_DUPLICATE)
   * @param {string} [params.artPieceQueueId] - Art piece queue ID filter
   * @param {string} [params.verifiedBy] - Verifier user ID filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated verification logs data
   */
  async getPaginatedVerificationLogs({ page = 1, limit = 10, search = '', action, artPieceQueueId, verifiedBy }, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(action && { action }),
      ...(artPieceQueueId && { artPieceQueueId }),
      ...(verifiedBy && { verifiedBy }),
    });

    const path = `${endpoints.verificationLog.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single verification log by ID.
   * @param {string|number} id - The verification log ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The verification log object
   */
  async getVerificationLog(id, revalidate) {
    const path = endpoints.verificationLog.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch verification logs for a specific art piece queue.
   * @param {string|number} queueId - The art piece queue ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Verification logs for the queue
   */
  async getVerificationLogsByQueueId(queueId, revalidate) {
    const path = endpoints.verificationLog.byQueueId.path(queueId);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new verification log.
   * @param {Object|FormData} data - The verification log data
   * @returns {Promise<Object>} The created verification log
   */
  async createVerificationLog(data) {
    const path = endpoints.verificationLog.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing verification log.
   * @param {string|number} id - The verification log ID
   * @param {Object|FormData} data - The updated verification log data
   * @returns {Promise<Object>} The updated verification log
   */
  async updateVerificationLog(id, data) {
    const path = endpoints.verificationLog.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a verification log.
   * @param {string|number} id - The verification log ID
   * @returns {Promise<Object>} The response data
   */
  async deleteVerificationLog(id) {
    const path = endpoints.verificationLog.delete.path(id);
    return this.delete(path);
  }
}
