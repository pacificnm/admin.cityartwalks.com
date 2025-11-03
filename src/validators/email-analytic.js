/**
 * @file email-analytic.js
 * @description Zod validation schemas for EmailAnalytic - tracking events, clicks, opens, and dashboard filters.
 * @namespace CityArtWalks.Validators.EmailAnalytic
 * @version 1.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/EmailAnalytic-Model} - EmailAnalytic model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 */

import { z } from 'zod';

/**
 * Email event type enum values
 * @constant {Array<string>} eventTypeValues
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
const eventTypeValues = [
  'SENT',
  'DELIVERED',
  'OPENED',
  'CLICKED',
  'BOUNCED',
  'UNSUBSCRIBED',
  'COMPLAINED',
  'BLOCKED',
];

/**
 * Base email analytic schema with common fields
 * @constant {z.ZodObject} baseEmailAnalyticSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
const baseEmailAnalyticSchema = z.object({
  eventType: z.enum(eventTypeValues, {
    errorMap: () => ({ message: 'Invalid event type' }),
  }),

  linkUrl: z
    .string()
    .url('Invalid URL format')
    .max(2000, 'URL must be less than 2000 characters')
    .optional(),

  userAgent: z.string().max(1000, 'User agent must be less than 1000 characters').optional(),

  ipAddress: z.string().max(45, 'IP address must be less than 45 characters').optional(),

  location: z.string().max(100, 'Location must be less than 100 characters').optional(),

  device: z.string().max(100, 'Device must be less than 100 characters').optional(),

  metadata: z.record(z.any()).optional(),
});

/**
 * Schema for creating new email analytic records
 * @constant {z.ZodObject} createEmailAnalyticSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const createEmailAnalyticSchema = baseEmailAnalyticSchema.extend({
  emailId: z.number().int().positive('Email ID must be a positive integer'),

  userId: z.number().int().positive('User ID must be a positive integer').optional(),
});

/**
 * Schema for updating email analytic records
 * @constant {z.ZodObject} updateEmailAnalyticSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const updateEmailAnalyticSchema = baseEmailAnalyticSchema
  .partial()
  .omit({ eventType: true }); // Event type cannot be changed

/**
 * Schema for email analytic query parameters
 * @constant {z.ZodObject} emailAnalyticQuerySchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const emailAnalyticQuerySchema = z.object({
  skip: z.number().int().min(0, 'Skip must be a non-negative integer').optional().default(0),

  rowsPerPage: z
    .number()
    .int()
    .min(1, 'Rows per page must be at least 1')
    .max(100, 'Rows per page cannot exceed 100')
    .optional()
    .default(25),

  search: z.string().max(200, 'Search term must be less than 200 characters').optional(),

  eventType: z
    .enum(eventTypeValues, {
      errorMap: () => ({ message: 'Invalid event type' }),
    })
    .optional(),

  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),

  userId: z.string().regex(/^\d+$/, 'User ID must be a valid integer').optional(),

  dateFrom: z.string().datetime('Invalid date format').optional(),

  dateTo: z.string().datetime('Invalid date format').optional(),
});

/**
 * Schema for email analytic ID validation
 * @constant {z.ZodObject} emailAnalyticIdSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const emailAnalyticIdSchema = z.object({
  analyticId: z.number().int().positive('Analytic ID must be a positive integer'),
});

/**
 * Schema for tracking pixel requests
 * @constant {z.ZodObject} trackingPixelSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const trackingPixelSchema = z.object({
  emailId: z.string().min(1, 'Email ID is required'),

  userId: z.string().optional(),

  userAgent: z.string().optional(),

  ipAddress: z.string().optional(),
});

/**
 * Schema for link click tracking
 * @constant {z.ZodObject} linkClickSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const linkClickSchema = z.object({
  emailId: z.string().min(1, 'Email ID is required'),

  linkUrl: z.string().url('Invalid URL format').min(1, 'Link URL is required'),

  userId: z.string().optional(),

  userAgent: z.string().optional(),

  ipAddress: z.string().optional(),
});

/**
 * Schema for analytics dashboard filters
 * @constant {z.ZodObject} analyticsDashboardSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const analyticsDashboardSchema = z.object({
  dateFrom: z.string().datetime('Invalid date format').optional(),

  dateTo: z.string().datetime('Invalid date format').optional(),

  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),

  groupBy: z
    .enum(['hour', 'day', 'week', 'month'], {
      errorMap: () => ({ message: 'Group by must be hour, day, week, or month' }),
    })
    .optional()
    .default('day'),

  metrics: z.array(z.enum(eventTypeValues)).optional().default(['DELIVERED', 'OPENED', 'CLICKED']),
});

/**
 * Schema for bulk analytics import
 * @constant {z.ZodObject} bulkAnalyticsImportSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const bulkAnalyticsImportSchema = z.object({
  analytics: z
    .array(
      z.object({
        emailId: z.number().int().positive(),
        eventType: z.enum(eventTypeValues),
        eventAt: z.string().datetime(),
        linkUrl: z.string().url().optional(),
        userAgent: z.string().max(1000).optional(),
        ipAddress: z.string().max(45).optional(),
        location: z.string().max(100).optional(),
        device: z.string().max(100).optional(),
        metadata: z.record(z.any()).optional(),
      })
    )
    .min(1, 'At least one analytic record is required')
    .max(1000, 'Cannot import more than 1000 records at once'),

  source: z.string().max(50, 'Source must be less than 50 characters').optional(),

  validateEmails: z.boolean().optional().default(true),
});

/**
 * Schema for analytics export request
 * @constant {z.ZodObject} analyticsExportSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const analyticsExportSchema = z.object({
  format: z
    .enum(['csv', 'json', 'xlsx'], {
      errorMap: () => ({ message: 'Format must be csv, json, or xlsx' }),
    })
    .optional()
    .default('csv'),

  dateFrom: z.string().datetime('Invalid date format').optional(),

  dateTo: z.string().datetime('Invalid date format').optional(),

  eventTypes: z.array(z.enum(eventTypeValues)).optional(),

  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),

  includeMetadata: z.boolean().optional().default(false),

  aggregateBy: z
    .enum(['none', 'email', 'user', 'day'], {
      errorMap: () => ({ message: 'Aggregate by must be none, email, user, or day' }),
    })
    .optional()
    .default('none'),
});

/**
 * Schema for real-time analytics subscription
 * @constant {z.ZodObject} analyticsSubscriptionSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const analyticsSubscriptionSchema = z.object({
  eventTypes: z.array(z.enum(eventTypeValues)).min(1, 'At least one event type is required'),

  emailTypes: z.array(z.string().max(50)).optional(),

  webhookUrl: z.string().url('Invalid webhook URL').optional(),

  filters: z
    .object({
      userIds: z.array(z.number().int().positive()).optional(),
      ipAddresses: z.array(z.string().max(45)).optional(),
      locations: z.array(z.string().max(100)).optional(),
    })
    .optional(),
});

/**
 * Validation helper functions
 * @description Helper utilities for EmailAnalytic. Kept under the file-level
 * namespace to avoid creating a separate nested namespace in generated docs.
 */

/**
 * Validate IP address format (IPv4 or IPv6)
 * @function validateIpAddress
 * @memberof CityArtWalks.Validators.EmailAnalytic
 * @param {string} ipAddress - IP address to validate
 * @returns {boolean} True if valid IP address
 */
export function validateIpAddress(ipAddress) {
  if (!ipAddress) return true; // Optional field

  // IPv4 pattern
  const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // IPv6 pattern (simplified)
  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;

  return ipv4Pattern.test(ipAddress) || ipv6Pattern.test(ipAddress);
}

/**
 * Parse user agent string to extract device information
 * @function parseUserAgent
 * @memberof CityArtWalks.Validators.EmailAnalytic
 * @param {string} userAgent - User agent string
 * @returns {Object} Parsed device information
 */
export function parseUserAgent(userAgent) {
  if (!userAgent) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };

  const ua = userAgent.toLowerCase();

  // Detect device type
  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android')) {
    device = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    device = 'Tablet';
  }

  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';

  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios')) os = 'iOS';

  return { device, browser, os };
}

/**
 * Validate event type transition rules
 * @function validateEventTransition
 * @memberof CityArtWalks.Validators.EmailAnalytic
 * @param {string} currentEvent - Current event type
 * @param {string} newEvent - New event type
 * @returns {Object} Validation result
 */
export function validateEventTransition(currentEvent, newEvent) {
  // Events that can happen after being sent
  const validTransitions = {
    SENT: ['DELIVERED', 'BOUNCED', 'BLOCKED'],
    DELIVERED: ['OPENED', 'CLICKED', 'UNSUBSCRIBED', 'COMPLAINED'],
    OPENED: ['CLICKED', 'UNSUBSCRIBED'],
    CLICKED: ['UNSUBSCRIBED'],
    BOUNCED: [], // Terminal state
    UNSUBSCRIBED: [], // Terminal state
    COMPLAINED: [], // Terminal state
    BLOCKED: [], // Terminal state
  };

  if (!validTransitions[currentEvent]) {
    return { isValid: false, message: `Invalid current event type: ${currentEvent}` };
  }

  if (!validTransitions[currentEvent].includes(newEvent)) {
    return {
      isValid: false,
      message: `Invalid transition from ${currentEvent} to ${newEvent}`,
    };
  }

  return { isValid: true };
}

/**
 * Generate analytics summary for a time period
 * @function generateAnalyticsSummary
 * @memberof CityArtWalks.Validators.EmailAnalytic
 * @param {Array} analytics - Array of analytic records
 * @returns {Object} Summary statistics
 */
export function generateAnalyticsSummary(analytics) {
  const summary = {
    totalEvents: analytics.length,
    eventCounts: {},
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
    unsubscribeRate: 0,
  };

  // Count events by type
  analytics.forEach((analytic) => {
    const eventType = analytic.eventType;
    summary.eventCounts[eventType] = (summary.eventCounts[eventType] || 0) + 1;
  });

  const delivered = summary.eventCounts.DELIVERED || 0;
  const opened = summary.eventCounts.OPENED || 0;
  const clicked = summary.eventCounts.CLICKED || 0;
  const bounced = summary.eventCounts.BOUNCED || 0;
  const unsubscribed = summary.eventCounts.UNSUBSCRIBED || 0;

  // Calculate rates
  if (delivered > 0) {
    summary.openRate = ((opened / delivered) * 100).toFixed(2);
    summary.clickRate = ((clicked / delivered) * 100).toFixed(2);
    summary.unsubscribeRate = ((unsubscribed / delivered) * 100).toFixed(2);
  }

  const totalSent = delivered + bounced;
  if (totalSent > 0) {
    summary.bounceRate = ((bounced / totalSent) * 100).toFixed(2);
  }

  return summary;
}

/**
 * Schema for webhook analytics processing
 * @constant {z.ZodObject} webhookAnalyticSchema
 * @memberof CityArtWalks.Validators.EmailAnalytic
 */
export const webhookAnalyticSchema = z.object({
  provider: z.enum(['sendgrid', 'mailgun', 'ses', 'microsoft-graph'], {
    errorMap: () => ({ message: 'Invalid email provider' }),
  }),

  eventType: z.string().min(1, 'Event type is required'),

  messageId: z.string().min(1, 'Message ID is required'),

  timestamp: z.string().datetime('Invalid timestamp format'),

  recipientEmail: z.string().email('Valid recipient email is required').optional(),

  metadata: z.record(z.any()).optional(),

  rawPayload: z.record(z.any()).optional(),
});
