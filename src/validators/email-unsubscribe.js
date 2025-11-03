/**
 * @file email-unsubscribe.js
 * @description Zod validation schemas for the EmailUnsubscribe model.
 * This module provides schemas and helper validators for unsubscribe requests,
 * token validation, bulk operations, and statistics related to email
 * unsubscribe behavior across the City Art Walks platform.
 *
 * Includes creation, update, query, token handling, bulk unsubscribe, and
 * resubscribe schemas along with helper validators for IP and token formats.
 *
 * @namespace CityArtWalks.Validators.EmailUnsubscribe
 * @version 2.1.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Unsubscribe-Model}
 */

import { z } from 'zod';

/**
 * Base email unsubscribe schema with common fields
 * @constant {z.ZodObject} baseEmailUnsubscribeSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
const baseEmailUnsubscribeSchema = z.object({
  email: z
    .string()
    .email('Valid email address is required')
    .max(255, 'Email address must be less than 255 characters'),

  emailType: z
    .string()
    .min(1, 'Email type is required')
    .max(50, 'Email type must be less than 50 characters'),

  token: z
    .string()
    .min(1, 'Unsubscribe token is required')
    .max(255, 'Unsubscribe token must be less than 255 characters'),

  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),

  userAgent: z.string().max(1000, 'User agent must be less than 1000 characters').optional(),

  ipAddress: z.string().max(45, 'IP address must be less than 45 characters').optional(),
});

/**
 * Schema for creating new email unsubscribe records
 * @constant {z.ZodObject} createEmailUnsubscribeSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const createEmailUnsubscribeSchema = baseEmailUnsubscribeSchema.extend({
  userId: z.number().int().positive('User ID must be a positive integer').optional(),

  emailId: z.number().int().positive('Email ID must be a positive integer').optional(),
});

/**
 * Schema for updating email unsubscribe records
 * @constant {z.ZodObject} updateEmailUnsubscribeSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const updateEmailUnsubscribeSchema = baseEmailUnsubscribeSchema
  .partial()
  .omit({ token: true }); // Token cannot be updated

/**
 * Schema for email unsubscribe query parameters
 * @constant {z.ZodObject} emailUnsubscribeQuerySchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const emailUnsubscribeQuerySchema = z.object({
  skip: z.number().int().min(0, 'Skip must be a non-negative integer').optional().default(0),

  rowsPerPage: z
    .number()
    .int()
    .min(1, 'Rows per page must be at least 1')
    .max(100, 'Rows per page cannot exceed 100')
    .optional()
    .default(25),

  search: z.string().max(200, 'Search term must be less than 200 characters').optional(),

  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),

  userId: z.string().regex(/^\d+$/, 'User ID must be a valid integer').optional(),

  dateFrom: z.string().datetime('Invalid date format').optional(),

  dateTo: z.string().datetime('Invalid date format').optional(),
});

/**
 * Schema for email unsubscribe ID validation
 * @constant {z.ZodObject} emailUnsubscribeIdSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const emailUnsubscribeIdSchema = z.object({
  unsubscribeId: z.number().int().positive('Unsubscribe ID must be a positive integer'),
});

/**
 * Schema for unsubscribe token validation
 * @constant {z.ZodObject} unsubscribeTokenSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const unsubscribeTokenSchema = z.object({
  token: z
    .string()
    .min(1, 'Unsubscribe token is required')
    .max(255, 'Unsubscribe token must be less than 255 characters'),
});

/**
 * Schema for unsubscribe request from email link
 * @constant {z.ZodObject} unsubscribeRequestSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const unsubscribeRequestSchema = z.object({
  token: z.string().min(1, 'Unsubscribe token is required'),

  reason: z
    .enum(['too_frequent', 'not_relevant', 'never_subscribed', 'privacy_concerns', 'other'], {
      errorMap: () => ({ message: 'Invalid unsubscribe reason' }),
    })
    .optional(),

  customReason: z.string().max(500, 'Custom reason must be less than 500 characters').optional(),

  feedback: z.string().max(1000, 'Feedback must be less than 1000 characters').optional(),
});

/**
 * Schema for checking unsubscribe status
 * @constant {z.ZodObject} checkUnsubscribeStatusSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const checkUnsubscribeStatusSchema = z.object({
  email: z.string().email('Valid email address is required'),

  emailType: z
    .string()
    .min(1, 'Email type is required')
    .max(50, 'Email type must be less than 50 characters'),
});

/**
 * Schema for bulk unsubscribe operations
 * @constant {z.ZodObject} bulkUnsubscribeSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const bulkUnsubscribeSchema = z.object({
  emails: z
    .array(z.string().email('Valid email address is required'))
    .min(1, 'At least one email address is required')
    .max(100, 'Cannot process more than 100 emails at once'),

  emailType: z
    .string()
    .min(1, 'Email type is required')
    .max(50, 'Email type must be less than 50 characters'),

  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),

  userAgent: z.string().max(1000, 'User agent must be less than 1000 characters').optional(),

  ipAddress: z.string().max(45, 'IP address must be less than 45 characters').optional(),
});

/**
 * Schema for unsubscribe statistics request
 * @constant {z.ZodObject} unsubscribeStatsSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const unsubscribeStatsSchema = z.object({
  dateFrom: z.string().datetime('Invalid date format').optional(),

  dateTo: z.string().datetime('Invalid date format').optional(),

  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),

  groupBy: z
    .enum(['day', 'week', 'month'], {
      errorMap: () => ({ message: 'Group by must be day, week, or month' }),
    })
    .optional()
    .default('day'),
});

/**
 * Validation helper functions
 */

/**
 * Validate IP address format (IPv4 or IPv6)
 * @function validateIpAddress
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
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
 * Generate secure unsubscribe token
 * @function generateUnsubscribeToken
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 * @param {string} email - Email address
 * @param {string} emailType - Email type
 * @returns {string} Secure unsubscribe token
 */
export function generateUnsubscribeToken(email, emailType) {
  const crypto = require('crypto');
  const timestamp = Date.now();
  const payload = `${email}:${emailType}:${timestamp}`;

  return crypto.createHash('sha256').update(payload).digest('hex').substring(0, 32);
}

/**
 * Validate unsubscribe token format
 * @function validateUnsubscribeTokenFormat
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 * @param {string} token - Token to validate
 * @returns {boolean} True if token format is valid
 */
export function validateUnsubscribeTokenFormat(token) {
  if (!token || typeof token !== 'string') return false;

  // Token should be 32 character hex string
  const tokenPattern = /^[a-f0-9]{32}$/;
  return tokenPattern.test(token);
}

/**
 * Schema for email resubscribe (opt back in)
 * @constant {z.ZodObject} emailResubscribeSchema
 * @memberof CityArtWalks.Validators.EmailUnsubscribe
 */
export const emailResubscribeSchema = z.object({
  email: z.string().email('Valid email address is required'),

  emailType: z
    .string()
    .min(1, 'Email type is required')
    .max(50, 'Email type must be less than 50 characters'),

  userAgent: z.string().max(1000, 'User agent must be less than 1000 characters').optional(),

  ipAddress: z.string().max(45, 'IP address must be less than 45 characters').optional(),
});
