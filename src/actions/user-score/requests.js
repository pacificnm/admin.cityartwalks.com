/**
 * @file requests.js
 * @description UserScoreApiClient class for user score operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.UserScore.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * UserScoreApiClient class for handling user score API operations.
 * Extends ApiClient to provide user score-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class UserScoreApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.UserScore.Requests
 */
export class UserScoreApiClient extends ApiClient {
  constructor() {
    super();
  }

  /**
   * Fetch paginated leaderboard of user scores with optional filtering.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {string} [params.search=''] - Search term for username/displayName
   * @param {string} [params.timeFrame=''] - Time frame filter (day, week, month, year, all)
   * @param {string} [params.minPoints=''] - Minimum points threshold
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated user scores and metadata
   */
  async getPaginatedUserScores({ page = 1, limit = 10, search = '', timeFrame = '', minPoints = '' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search: encodeURIComponent(search) }),
      ...(timeFrame && { timeFrame }),
      ...(minPoints && { minPoints }),
    });

    const path = `${endpoints.userScore.list.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch top users leaderboard.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Top users leaderboard
   */
  async getLeaderboard(revalidate) {
    const path = endpoints.userScore.leaderboard.path;
    return this.get(path, { revalidate });
  }

  /**
   * Fetch a specific user's score by their unique identifier.
   * @param {string|number} userId - The unique identifier of the user
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} The user score object
   */
  async getUserScoreById(userId, revalidate) {
    const path = endpoints.userScore.details.path(userId);
    return this.get(path, { revalidate });
  }

  /**
   * Fetch paginated history of user scoring events with optional filtering.
   * @param {Object} params - Filter parameters
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page
   * @param {string} [params.eventType=''] - Event type filter (ARTIST_CREATE, ART_PIECE_CREATE, etc.)
   * @param {string} [params.startDate=''] - Start date for date range filtering
   * @param {string} [params.endDate=''] - End date for date range filtering
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Paginated user scoring history and metadata
   */
  async getUserScoreHistory({ page = 1, limit = 10, eventType = '', startDate = '', endDate = '' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(eventType && { eventType }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const path = `${endpoints.userScore.history.path}?${params}`;
    return this.get(path, { revalidate });
  }

  /**
   * Manually adjust a user's score (admin only).
   * @param {Object} data - Score adjustment data
   * @param {number} data.userId - Target user ID for adjustment
   * @param {number} data.points - Points to add/subtract (can be negative)
   * @param {string} data.reason - Reason for the adjustment
   * @returns {Promise<Object>} The adjustment result
   */
  async adjustUserScore(data) {
    const path = endpoints.userScore.adjust.path;

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Award bonus points to a user (admin only).
   * @param {Object} data - Bonus points data
   * @param {number} data.userId - Target user ID for bonus award
   * @param {number} data.points - Bonus points to award (positive only)
   * @param {string} data.reason - Reason for the bonus award
   * @param {string} data.category - Category of bonus (CAMPAIGN, EVENT, ACHIEVEMENT, etc.)
   * @param {string} [data.campaignId] - Optional campaign identifier
   * @param {string} [data.expiresAt] - Optional expiration date
   * @returns {Promise<Object>} The bonus award result
   */
  async awardBonusPoints(data) {
    const path = endpoints.userScore.bonus.path;

    return this.post(path, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Rebuild a user's score from their event history (admin only).
   * @param {string|number} userId - The unique identifier of the user
   * @returns {Promise<Object>} The rebuild result
   */
  async rebuildUserScore(userId) {
    const path = endpoints.userScore.rebuild.path(userId);

    return this.post(path, {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
