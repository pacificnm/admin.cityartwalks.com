/**
 * @file requests.js
 * @description AnalyticsApiClient class for Analytics tracking operations.
 * @author Jaimie Garner
 * @version 3.0.0
 * @namespace CityArtWalks.Actions.Analytics.Requests
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests module documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics} - Analytics entity documentation
 */

import { ApiClient } from '@/lib/api-client';

import { endpoints } from 'src/endpoints';

/**
 * AnalyticsApiClient class for handling Analytics API operations.
 * Extends ApiClient to provide analytics-specific HTTP methods.
 * Handles automatic token management through session.
 * 
 * @class AnalyticsApiClient
 * @extends ApiClient
 * @memberof CityArtWalks.Actions.Analytics.Requests
 */
export class AnalyticsApiClient extends ApiClient {
  constructor() {
    super();
  }
  /**
   * Track an analytics event.
   * @param {Object} eventData - The analytics event data
   * @param {string} eventData.event - Event name
   * @param {string} [eventData.type='event'] - Event type
   * @param {Object} [eventData.data={}] - Additional event data
   * @param {string} [eventData.userId] - User ID
   * @param {string} eventData.visitorId - Visitor ID
   * @param {string} eventData.sessionId - Session ID
   * @param {string} eventData.path - Current path
   * @param {string} [eventData.referer] - Referrer URL
   * @param {string} [eventData.userAgent] - User agent string
   * @param {string} [eventData.locale] - User locale
   * @param {Object} [eventData.geo] - Geographic data
   * @returns {Promise<Object>} Response data
   */
  async trackAnalyticsEvent(eventData) {
    const path = endpoints.analytics.event.path;
    return this.post(path, {
      body: JSON.stringify(eventData),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Update analytics user mapping.
   * @param {Object} updateData - The update data
   * @param {string} updateData.visitorId - Visitor ID
   * @param {string} updateData.sessionId - Session ID
   * @param {string} updateData.path - Current path
   * @param {string} updateData.userId - User ID to associate
   * @returns {Promise<Object>} Response data
   */
  async updateAnalyticsUserMapping(updateData) {
    const path = endpoints.analytics.update.path;
    return this.put(path, {
      body: JSON.stringify(updateData),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Get weekly user analytics.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getWeeklyUserAnalytics(revalidate) {
    const path = endpoints.analytics.users.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get weekly pageview analytics.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getWeeklyPageviewAnalytics(revalidate) {
    const path = endpoints.analytics.pageviews.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get weekly time on site analytics.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getWeeklyTimeOnSiteAnalytics(revalidate) {
    const path = endpoints.analytics.timeOnPage.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get top browsers analytics.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getTopBrowsersAnalytics(revalidate) {
    const path = endpoints.analytics.browser.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get top page view segments analytics.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getTopPageViewSegments(revalidate) {
    const path = endpoints.analytics.pageviewsSegments.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get errors analytics data with filters and pagination.
   * @param {Object} params - Parameters for the request
   * @param {number} [params.page=1] - Page number
   * @param {number} [params.limit=10] - Results per page limit
   * @param {string} [params.event] - Event filter
   * @param {string} [params.type] - Type filter
   * @param {string} [params.path] - Path filter
   * @param {string} [params.visitorId] - Visitor ID filter
   * @param {string} [params.userId] - User ID filter
   * @param {string} [params.startDate] - Start date filter
   * @param {string} [params.endDate] - End date filter
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Array of analytics error events
   */
  async getErrors({ page = 1, limit = 10, event = '', type = '', path = '', visitorId = '', userId = '', startDate = '', endDate = '' } = {}, revalidate) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(event && { event }),
      ...(type && { type }),
      ...(path && { path }),
      ...(visitorId && { visitorId }),
      ...(userId && { userId }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const pathUrl = `${endpoints.analytics.errors.path}?${params}`;
    return this.get(pathUrl, { revalidate });
  }

  /**
   * Get visitor analytics.
   * @param {string} [range='7d'] - Time range
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getVisitorAnalytics(range = '7d', revalidate) {
    const path = endpoints.analytics.visitors.path(range);
    return this.get(path, { revalidate });
  }

  /**
   * Get bounce rate analytics.
   * @param {string} [range='7d'] - Time range
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getBounceRateAnalytics(range = '7d', revalidate) {
    const path = endpoints.analytics.bounceRate.path(range);
    return this.get(path, { revalidate });
  }

  /**
   * Get weekly user analytics (legacy).
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getAnalyticsWeeklyUser(revalidate) {
    const path = endpoints.analytics.weeklyUser.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get device sessions analytics.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getDeviceSessionsAnalytics(revalidate) {
    const path = endpoints.analytics.sessionsDevices.path;
    return this.get(path, { revalidate });
  }

  /**
   * Get top referrers analytics.
   * @param {number} [revalidate] - Optional ISR revalidate time in seconds
   * @returns {Promise<Object>} Analytics data
   */
  async getTopReferrersAnalytics(revalidate) {
    const path = '/api/analytics/referrers?range=7d';
    return this.get(path, { revalidate });
  }

  /**
   * Delete an analytics record by ID.
   * @param {number|string} analyticsId - Analytics record ID
   * @returns {Promise<Object>} Response data
   */
  async deleteAnalytics(analyticsId) {
    const path = endpoints.analytics.delete.path(analyticsId);
    return this.delete(path);
  }
}
