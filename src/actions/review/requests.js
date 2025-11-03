/**
 * @file requests.js
 * @description ReviewApiClient class for Review CRUD operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Review.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';


/**
 * ReviewApiClient class for handling Review API operations.
 * Extends ApiClient to provide review-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class ReviewApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Review.Requests
 */
export class ReviewApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated list of reviews with optional filtering.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.status=''] - Status filter
   * @param {number} [params.rating] - Rating filter
   * @param {number} [params.ratingMin] - Minimum rating filter
   * @param {string} [params.entityType=''] - Entity type filter
   * @param {number} [params.artistId] - Artist filter
   * @param {number} [params.artPieceId] - Art piece filter
   * @param {number} [params.imageId] - Image filter
   * @param {number} [params.pathId] - Path filter
   * @param {number} [params.pathMapId] - Path map filter
   * @param {string} [params.startDate] - Start date filter
   * @param {string} [params.endDate] - End date filter
   * @param {string} [params.priority=''] - Priority filter
   * @param {boolean} [params.flagged] - Flagged filter
   * @param {string} [params.aiDecision] - AI decision filter
   * @param {string} [params.createdBy=''] - Creator filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated reviews data
   */
  async getPaginatedReviews({ page = 1, limit = 10, search = '', status = '', rating, ratingMin, entityType = '', artistId, artPieceId, imageId, pathId, pathMapId, startDate, endDate, priority = '', flagged, aiDecision, createdBy = '' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(status && { status }),
      ...(rating && !isNaN(parseInt(rating)) && { rating }),
      ...(ratingMin && !isNaN(parseInt(ratingMin)) && { ratingMin }),
      ...(entityType && { entityType }),
      ...(artistId !== null && artistId !== undefined && { artistId }),
      ...(artPieceId !== null && artPieceId !== undefined && { artPieceId }),
      ...(imageId !== null && imageId !== undefined && { imageId }),
      ...(pathId !== null && pathId !== undefined && { pathId }),
      ...(pathMapId !== null && pathMapId !== undefined && { pathMapId }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(priority && { priority }),
      ...(flagged !== null && flagged !== undefined && { flagged }),
      ...(aiDecision && { aiDecision }),
      ...(createdBy && { createdBy }),
    });

    const path = `${endpoints.review.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a single review by ID.
   * @param {string|number} id - The review ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The review object
   */
  async getReview(id, revalidate) {
    const path = endpoints.review.details.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Create a new review.
   * @param {Object|FormData} data - The review data
   * @returns {Promise<Object>} The created review
   */
  async createReview(data) {
    const path = endpoints.review.create.path;

    if (data instanceof FormData) {
      return this.post(path, { body: data });
    }

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update an existing review.
   * @param {string|number} id - The review ID
   * @param {Object|FormData} data - The updated review data
   * @returns {Promise<Object>} The updated review
   */
  async updateReview(id, data) {
    const path = endpoints.review.update.path(id);

    if (data instanceof FormData) {
      return this.put(path, { body: data });
    }

    return this.put(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Delete a review by ID.
   * @param {string|number} id - The review ID
   * @returns {Promise<Object>} The response data
   */
  async deleteReview(id) {
    const path = endpoints.review.delete.path(id);
    return this.delete(path);
  }

  /**
   * Flag a review for moderation.
   * @param {string|number} id - The review ID
   * @param {Object} flagData - Flag data with reason and optional details
   * @returns {Promise<Object>} The flagged review
   */
  async flagReview(id, flagData) {
    const path = endpoints.review.flag.path(id);

    return this.post(path, {
      body: JSON.stringify(flagData),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Fetch review statistics for an entity.
   * @param {string} entityType - Entity type (ARTIST, ART_PIECE, IMAGE, PATH, PATH_MAP)
   * @param {string|number} entityId - Entity ID
   * @param {Object} params - Query options
   * @param {number} [params.includeRecent=5] - Include recent reviews count
   * @param {number} [params.includeTop=3] - Include top reviews count
   * @param {boolean} [params.includeTrends=false] - Include trends
   * @param {number} [params.cacheTime=300] - Cache time in seconds
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Review statistics
   */
  async getReviewStats(entityType, entityId, { includeRecent = 5, includeTop = 3, includeTrends = false, cacheTime = 300 } = {}, revalidate) {
    const params = new URLSearchParams({
      ...(includeRecent > 0 && { includeRecent }),
      ...(includeTop > 0 && { includeTop }),
      ...(includeTrends && { includeTrends: 'true' }),
      ...(cacheTime && { cacheTime }),
    });

    const path = params.toString()
      ? `${endpoints.review.stats.path(entityType, entityId)}?${params}`
      : endpoints.review.stats.path(entityType, entityId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch reviews requiring moderation (admin only).
   * @param {Object} params - Query options
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.status] - Filter by status
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Reviews pending moderation
   */
  async getReviewsForModeration({ page = 1, limit = 20, status } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(status && { status }),
    });

    const path = `${endpoints.review.moderation.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Make admin moderation decision on a review.
   * @param {string|number} id - The review ID
   * @param {Object} decision - Moderation decision (action, optional notes)
   * @returns {Promise<Object>} Moderation result
   */
  async moderateReview(id, decision) {
    const path = endpoints.review.moderate.path(id);

    return this.put(path, {
      body: JSON.stringify(decision),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Get review audit history by ID.
   * @param {string|number} id - The review ID
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Review history
   */
  async getReviewHistory(id, revalidate) {
    const path = endpoints.review.history.path(id);
    return this.get(path, { revalidate });
  }

  /**
   * Record manual override of AI moderation decision.
   * @param {string|number} id - The review ID
   * @param {Object} overrideData - Override data (decision, reason, adminUserId)
   * @returns {Promise<Object>} Override result
   */
  async recordManualOverride(id, overrideData) {
    const path = endpoints.review.override.path(id);

    return this.post(path, {
      body: JSON.stringify(overrideData),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Retry AI moderation for a review.
   * @param {string|number} id - The review ID
   * @returns {Promise<Object>} Retry result
   */
  async retryAIModeration(id) {
    const path = endpoints.review.retryAi.path(id);

    return this.post(path, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Get moderation history with filtering and pagination.
   * @param {Object} params - Query options
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.moderationType] - Filter by type (AI, MANUAL, BULK)
   * @param {number} [params.adminUserId] - Filter by admin user
   * @param {string} [params.dateFrom] - Filter from date
   * @param {string} [params.dateTo] - Filter to date
   * @param {string} [params.search=''] - Search term
   * @param {string} [params.sortBy] - Sort field
   * @param {string} [params.sortOrder] - Sort order
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Moderation history
   */
  async getModerationHistory({ page = 1, limit = 20, status, moderationType, adminUserId, dateFrom, dateTo, search = '', sortBy, sortOrder } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(status && { status }),
      ...(moderationType && { moderationType }),
      ...(adminUserId && { adminUserId }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(search && { search: encodeURIComponent(search) }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.review.moderation.path}/history?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Get moderation statistics.
   * @param {Object} params - Query options
   * @param {string} [params.dateFrom] - Start date
   * @param {string} [params.dateTo] - End date
   * @param {string} [params.period] - Aggregation period (day, week, month)
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Moderation statistics
   */
  async getModerationStatistics({ dateFrom, dateTo, period } = {}, revalidate) {
    const params = new URLSearchParams({
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(period && { period }),
    });

    const path = params.toString()
      ? `${endpoints.review.moderation.path}/statistics?${params}`
      : `${endpoints.review.moderation.path}/statistics`;
    return this.get(path, { revalidate });
  }

  /**
   * Get content owned by authenticated user.
   * @param {Object} params - Query options
   * @param {string} [params.entityType] - Filter by entity type
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Owner's content with review counts
   */
  async getOwnerContent({ entityType } = {}, revalidate) {
    const params = new URLSearchParams({
      ...(entityType && { entityType }),
    });

    const path = params.toString()
      ? `${endpoints.review.owner.content.path}?${params}`
      : endpoints.review.owner.content.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get reviews for content owned by authenticated user.
   * @param {Object} params - Query options
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=20] - Items per page
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.entityType] - Filter by entity type
   * @param {number} [params.minRating] - Minimum rating
   * @param {number} [params.maxRating] - Maximum rating
   * @param {string} [params.sortBy] - Sort field
   * @param {string} [params.sortOrder] - Sort order
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated reviews for owned content
   */
  async getOwnerReviews({ page = 1, limit = 20, status, entityType, minRating, maxRating, sortBy, sortOrder } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(status && { status }),
      ...(entityType && { entityType }),
      ...(minRating && { minRating }),
      ...(maxRating && { maxRating }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });

    const path = `${endpoints.review.owner.reviews.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Get review statistics for content owned by authenticated user.
   * @param {Object} params - Query options
   * @param {string} [params.startDate] - Start date for statistics
   * @param {string} [params.endDate] - End date for statistics
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Review statistics
   */
  async getOwnerReviewStats({ startDate, endDate } = {}, revalidate) {
    const params = new URLSearchParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const path = params.toString()
      ? `${endpoints.review.owner.stats.path}?${params}`
      : endpoints.review.owner.stats.path;
    return this.get(path, { revalidate });
  }

  /**
   * Bulk flag multiple reviews.
   * @param {Object} data - Bulk flag data (reviewIds, reason, optional details)
   * @returns {Promise<Object>} Bulk flag result
   */
  async bulkFlagReviews(data) {
    const path = endpoints.review.owner.bulkFlag.path;

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
