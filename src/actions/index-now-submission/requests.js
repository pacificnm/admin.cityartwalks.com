/**
 * @file requests.js
 * @description IndexNowSubmissionApiClient class for IndexNow submission operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.IndexNowSubmission.Requests
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * IndexNowSubmissionApiClient class for handling IndexNow submission API operations.
 * Extends ApiClient to provide submission-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class IndexNowSubmissionApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.IndexNowSubmission.Requests
 */
export class IndexNowSubmissionApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated IndexNow submissions with filters.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.search=''] - Search term for URL field
   * @param {string} [params.status] - Status filter (PENDING, SUBMITTED, FAILED, SUCCESS)
   * @param {string} [params.entityType] - Entity type filter (ARTIST, ART_PIECE, PATH, POST)
   * @param {string} [params.action] - Action filter (CREATED, UPDATED, DELETED)
   * @param {string} [params.entityId] - Entity ID filter
   * @param {string} [params.responseCode] - HTTP response code filter
   * @param {string} [params.createdBy] - Creator user ID filter
   * @param {string} [params.updatedBy] - Updater user ID filter
   * @param {string} [params.startDate] - Start date filter (ISO string)
   * @param {string} [params.endDate] - End date filter (ISO string)
   * @param {string} [params.failedOnly] - Show only failed submissions
   * @param {string} [params.pendingOnly] - Show only pending submissions
   * @param {string} [params.processedOnly] - Show only processed submissions
   * @param {string} [params.sortBy] - Sort field
   * @param {string} [params.sortOrder] - Sort order (asc/desc)
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated IndexNow submissions data
   */
  async getPaginatedIndexNowSubmissions({ page = 1, limit = 10, search = '', status, entityType, action, entityId, responseCode, createdBy, updatedBy, startDate, endDate, failedOnly, pendingOnly, processedOnly, sortBy = '', sortOrder = '' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(entityType && { entityType }),
      ...(action && { action }),
      ...(entityId && { entityId }),
      ...(responseCode && { responseCode }),
      ...(createdBy && { createdBy }),
      ...(updatedBy && { updatedBy }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(failedOnly && { failedOnly }),
      ...(pendingOnly && { pendingOnly }),
      ...(processedOnly && { processedOnly }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.indexNowSubmission.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single IndexNow submission by ID.
   * @param {string|number} id - The submission ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The IndexNow submission object
   */
  async getIndexNowSubmission(id, revalidate) {
    const path = endpoints.indexNowSubmission.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new IndexNow submission.
   * @param {Object|FormData} data - The submission data
   * @returns {Promise<Object>} The created submission
   */
  async createIndexNowSubmission(data) {
    const path = endpoints.indexNowSubmission.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing IndexNow submission.
   * @param {string|number} id - The submission ID
   * @param {Object|FormData} data - The updated submission data
   * @returns {Promise<Object>} The updated submission
   */
  async updateIndexNowSubmission(id, data) {
    const path = endpoints.indexNowSubmission.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete an IndexNow submission.
   * @param {string|number} id - The submission ID
   * @returns {Promise<Object>} The response data
   */
  async deleteIndexNowSubmission(id) {
    const path = endpoints.indexNowSubmission.delete.path(id);
    return this.delete(path);
  }

  /**
   * Process a single IndexNow submission manually.
   * @param {string|number} submissionId - The submission ID to process
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The processing result
   */
  async processIndexNowSubmission(submissionId, revalidate) {
    const path = endpoints.indexNowSubmission.process.path(submissionId);
    return this.post(path, { body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' }, revalidate });
  }

  /**
   * Get IndexNow submission statistics.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Statistics data
   */
  async getIndexNowSubmissionStats(revalidate) {
    const path = endpoints.indexNowSubmission.stats.path();
    return this.get(path, { revalidate });
  }

  /**
   * Clear all pending IndexNow submissions from queue.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Clearing operation result
   */
  async clearIndexNowQueue(revalidate) {
    const path = endpoints.indexNowSubmission.clearQueue.path;
    return this.post(path, { body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' }, revalidate });
  }

  /**
   * Process all pending IndexNow submissions in queue.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Processing result
   */
  async processIndexNowQueue(revalidate) {
    const path = endpoints.indexNowSubmission.processQueue.path;
    return this.post(path, { body: JSON.stringify({ manual: true }), headers: { 'Content-Type': 'application/json' }, revalidate });
  }

  /**
   * Retry all failed IndexNow submissions.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Retry operation result
   */
  async retryFailedIndexNowSubmissions(revalidate) {
    const path = endpoints.indexNowSubmission.retryFailed.path;
    return this.post(path, { body: JSON.stringify({}), headers: { 'Content-Type': 'application/json' }, revalidate });
  }
}
