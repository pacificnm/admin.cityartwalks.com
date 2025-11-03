/**
 * @file analytics.js
 * @description Zod validation schemas for Analytics - pageviews, events, and reporting filters.
 * @namespace CityArtWalks.Validators.Analytics
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Model} - Analytics model documentation
 */
import { z } from 'zod';

/**
 * Zod schema for creating new analytics entries
 *
 * Validates data for new analytics entries including pageviews and events.
 * Supports comprehensive tracking data including geolocation, user agent,
 * and session information for detailed analytics collection.
 *
 * @memberof CityArtWalks.Validators.Analytics
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Model} - Analytics model documentation
 */
export const createAnalyticsSchema = z.object({
  type: z.enum(['pageview', 'event']),
  event: z.string().optional(),
  path: z.string().min(1, 'Path is required'),
  visitorId: z.string().min(1, 'Visitor ID is required'),
  ip: z.string().optional(),
  userAgent: z.string().min(1, 'User agent is required'),
  referer: z.string().optional(),
  data: z.record(z.any()).optional(), // JSON object
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  isp: z.string().optional(),
  sessionId: z.string().optional(),
  locale: z.string().optional(),
  userId: z.number().int().positive().nullable().optional(),
});

/**
 * Zod schema for validating analytics update requests
 *
 * Used for updating existing analytics entries with session and user tracking data.
 * Primarily used for associating anonymous sessions with authenticated users.
 *
 * @memberof CityArtWalks.Validators.Analytics
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Model} - Analytics model documentation
 */
export const updateAnalyticsSchema = z.object({
  visitorId: z.string().min(1, 'Visitor ID is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  path: z.string().min(1, 'Path is required'),
  userId: z.number().int().positive('User ID must be a positive integer'),
});

/**
 * Zod schema for validating analytics query parameters
 *
 * Handles pagination, filtering, and date range parameters for analytics API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various analytics event types and time ranges.
 *
 * @memberof CityArtWalks.Validators.Analytics
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Model} - Analytics model documentation
 */
export const analyticsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50)),
  range: z.string().optional().default('7d'),
  type: z.enum(['PAGEVIEW', 'EVENT', 'CLICK', 'FORM_SUBMIT', 'SEARCH', 'DOWNLOAD']).optional(),
  path: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * Zod schema for validating analytics filter parameters
 *
 * Used for filtering analytics data by specific events, types, and user attributes.
 * Supports complex filtering scenarios for analytics reporting and dashboard views.
 *
 * @memberof CityArtWalks.Validators.Analytics
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Model} - Analytics model documentation
 */
export const analyticsFilterSchema = z.object({
  type: z.enum(['event', 'pageview', 'error']).optional(),
  event: z
    .enum(['sign_in', 'page_view', 'time_on_page', 'bounce', 'scroll_depth', 'error_event'])
    .optional(),
  path: z.string().optional(),
  visitorId: z.string().optional(),
  userId: z.union([z.string(), z.number()]).optional(),
});

/**
 * Returns default analytics values for a given analytics object
 *
 * Provides consistent default values for all analytics fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for analytics operations.
 *
 * @function defaultAnalyticsValues
 * @memberof CityArtWalks.Validators.Analytics
 * @param {Object} [analytics] - Partial analytics object (may be incomplete)
 * @returns {Object} Complete analytics object with all default fields populated
 *
 * @example
 * // Create defaults for new analytics entry
 * const defaults = defaultAnalyticsValues();
 *
 * // Merge with existing partial data
 * const analytics = defaultAnalyticsValues({
 *   path: '/art-piece/123',
 *   visitorId: 'visitor-456'
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Model} - Analytics model documentation
 */
export function defaultAnalyticsValues(analytics) {
  return {
    analyticsId: analytics?.analyticsId ?? 0,
    type: analytics?.type ?? 'PAGEVIEW',
    event: analytics?.event ?? '',
    path: analytics?.path ?? '',
    visitorId: analytics?.visitorId ?? '',
    ip: analytics?.ip ?? '',
    userAgent: analytics?.userAgent ?? '',
    referer: analytics?.referer ?? '',
    data: analytics?.data ?? {},
    country: analytics?.country ?? '',
    region: analytics?.region ?? '',
    city: analytics?.city ?? '',
    postalCode: analytics?.postalCode ?? '',
    latitude: analytics?.latitude ?? null,
    longitude: analytics?.longitude ?? null,
    timezone: analytics?.timezone ?? '',
    isp: analytics?.isp ?? '',
    timestamp: analytics?.timestamp ?? new Date(),
    sessionId: analytics?.sessionId ?? '',
    locale: analytics?.locale ?? '',
    createdAt: analytics?.createdAt ?? new Date(),
    updatedAt: analytics?.updatedAt ?? new Date(),
    userId: analytics?.userId ?? null,
    createdBy: analytics?.createdBy ?? null,
    updatedBy: analytics?.updatedBy ?? null,
  };
}
