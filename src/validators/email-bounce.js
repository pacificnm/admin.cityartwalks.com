/**
 * @file email-bounce.js
 * @description Zod validation schemas for the EmailBounce model.
 * This module provides schemas, helper validators, and parsing utilities
 * for handling email bounce records, webhooks, stats, and suppression lists
 * across the City Art Walks application.
 *
 * Includes creation, update, query, webhook parsing, bulk processing, and
 * cleanup schemas along with small validator helpers for classifying bounces
 * and parsing provider webhook payloads.
 *
 * @namespace CityArtWalks.Validators.EmailBounce
 * @version 2.1.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Bounce-Model}
 */

import { z } from 'zod';

/**
 * Bounce type enum values
 * @constant {Array<string>} bounceTypeValues
 * @memberof CityArtWalks.Validators.EmailBounce
 */
const bounceTypeValues = ['HARD', 'SOFT', 'TRANSIENT'];

/**
 * Base email bounce schema with common fields
 * @constant {z.ZodObject} baseEmailBounceSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
const baseEmailBounceSchema = z.object({
  email: z
    .string()
    .email('Valid email address is required')
    .max(255, 'Email address must be less than 255 characters'),

  bounceType: z.enum(bounceTypeValues, {
    errorMap: () => ({ message: 'Bounce type must be HARD, SOFT, or TRANSIENT' }),
  }),

  bounceReason: z.string().max(500, 'Bounce reason must be less than 500 characters').optional(),

  diagnosticCode: z
    .string()
    .max(1000, 'Diagnostic code must be less than 1000 characters')
    .optional(),

  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),

  providerData: z.record(z.any()).optional(),
});

/**
 * Schema for creating new email bounce records
 * @constant {z.ZodObject} createEmailBounceSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const createEmailBounceSchema = baseEmailBounceSchema.extend({
  emailId: z.number().int().positive('Email ID must be a positive integer'),

  userId: z.number().int().positive('User ID must be a positive integer').optional(),
});

/**
 * Schema for updating email bounce records
 * @constant {z.ZodObject} updateEmailBounceSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const updateEmailBounceSchema = baseEmailBounceSchema.partial().omit({ email: true }); // Email cannot be updated

/**
 * Schema for email bounce query parameters
 * @constant {z.ZodObject} emailBounceQuerySchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const emailBounceQuerySchema = z.object({
  skip: z.number().int().min(0, 'Skip must be a non-negative integer').optional().default(0),

  rowsPerPage: z
    .number()
    .int()
    .min(1, 'Rows per page must be at least 1')
    .max(100, 'Rows per page cannot exceed 100')
    .optional()
    .default(25),

  search: z.string().max(200, 'Search term must be less than 200 characters').optional(),

  bounceType: z
    .enum(bounceTypeValues, {
      errorMap: () => ({ message: 'Bounce type must be HARD, SOFT, or TRANSIENT' }),
    })
    .optional(),

  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),

  userId: z.string().regex(/^\d+$/, 'User ID must be a valid integer').optional(),

  dateFrom: z.string().datetime('Invalid date format').optional(),

  dateTo: z.string().datetime('Invalid date format').optional(),
});

/**
 * Schema for email bounce ID validation
 * @constant {z.ZodObject} emailBounceIdSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const emailBounceIdSchema = z.object({
  bounceId: z.number().int().positive('Bounce ID must be a positive integer'),
});

/**
 * Schema for bounce webhook data from email providers
 * @constant {z.ZodObject} bounceWebhookSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const bounceWebhookSchema = z.object({
  messageId: z.string().min(1, 'Message ID is required'),

  recipientEmail: z.string().email('Valid recipient email is required'),

  bounceType: z.string().min(1, 'Bounce type is required'),

  bounceSubType: z.string().optional(),

  timestamp: z.string().datetime('Invalid timestamp format'),

  diagnosticCode: z.string().optional(),

  status: z.string().optional(),

  action: z.string().optional(),

  remoteMta: z.string().optional(),

  providerName: z
    .enum(['sendgrid', 'mailgun', 'ses', 'microsoft-graph'], {
      errorMap: () => ({ message: 'Invalid email provider' }),
    })
    .optional(),

  rawData: z.record(z.any()).optional(),
});

/**
 * Schema for bounce statistics request
 * @constant {z.ZodObject} bounceStatsSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const bounceStatsSchema = z.object({
  email: z.string().email('Valid email address is required').optional(),

  dateFrom: z.string().datetime('Invalid date format').optional(),

  dateTo: z.string().datetime('Invalid date format').optional(),

  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),

  bounceType: z
    .enum(bounceTypeValues, {
      errorMap: () => ({ message: 'Bounce type must be HARD, SOFT, or TRANSIENT' }),
    })
    .optional(),

  daysPeriod: z
    .number()
    .int()
    .min(1, 'Days period must be at least 1')
    .max(365, 'Days period cannot exceed 365')
    .optional()
    .default(30),

  groupBy: z
    .enum(['day', 'week', 'month'], {
      errorMap: () => ({ message: 'Group by must be day, week, or month' }),
    })
    .optional()
    .default('day'),
});

/**
 * Schema for bulk bounce processing
 * @constant {z.ZodObject} bulkBounceSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const bulkBounceSchema = z.object({
  bounces: z
    .array(
      z.object({
        emailId: z.number().int().positive(),
        email: z.string().email(),
        bounceType: z.enum(bounceTypeValues),
        bounceReason: z.string().max(500).optional(),
        diagnosticCode: z.string().max(1000).optional(),
        providerData: z.record(z.any()).optional(),
      })
    )
    .min(1, 'At least one bounce record is required')
    .max(100, 'Cannot process more than 100 bounces at once'),
});

/**
 * Schema for suppression list management
 * @constant {z.ZodObject} suppressionListSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const suppressionListSchema = z.object({
  emails: z
    .array(z.string().email('Valid email address is required'))
    .min(1, 'At least one email address is required')
    .max(1000, 'Cannot process more than 1000 emails at once'),

  bounceType: z.enum(bounceTypeValues, {
    errorMap: () => ({ message: 'Bounce type must be HARD, SOFT, or TRANSIENT' }),
  }),

  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),

  action: z.enum(['add', 'remove'], {
    errorMap: () => ({ message: 'Action must be add or remove' }),
  }),
});

/**
 * Validation helper functions
 * @description Helper utilities for EmailBounce. Kept under the file-level
 * namespace to avoid creating a nested helper namespace in generated docs.
 */

/**
 * Classify bounce type based on SMTP code and reason
 * @function classifyBounceType
 * @memberof CityArtWalks.Validators.EmailBounce
 * @param {string} smtpCode - SMTP response code
 * @param {string} reason - Bounce reason
 * @returns {'HARD'|'SOFT'|'TRANSIENT'} Bounce classification
 */
export function classifyBounceType(smtpCode, reason = '') {
  if (!smtpCode) return 'TRANSIENT';

  const code = parseInt(smtpCode);
  const reasonLower = reason.toLowerCase();

  // Hard bounces - permanent failures
  if (
    (code >= 500 && code < 600) ||
    reasonLower.includes('user unknown') ||
    reasonLower.includes('mailbox does not exist') ||
    reasonLower.includes('no such user') ||
    reasonLower.includes('invalid recipient') ||
    reasonLower.includes('recipient rejected')
  ) {
    return 'HARD';
  }

  // Soft bounces - temporary failures that might succeed later
  if (
    (code >= 400 && code < 500) ||
    reasonLower.includes('mailbox full') ||
    reasonLower.includes('message too large') ||
    reasonLower.includes('quota exceeded') ||
    reasonLower.includes('temporarily deferred')
  ) {
    return 'SOFT';
  }

  // Default to transient for everything else
  return 'TRANSIENT';
}

/**
 * Validate SMTP diagnostic code format
 * @function validateSmtpCode
 * @memberof CityArtWalks.Validators.EmailBounce
 * @param {string} code - SMTP code to validate
 * @returns {boolean} True if valid SMTP code
 */
export function validateSmtpCode(code) {
  if (!code) return true; // Optional field

  // SMTP codes are 3-digit numbers
  const smtpPattern = /^[1-5]\d{2}$/;
  return smtpPattern.test(code);
}

/**
 * Parse bounce data from different email providers
 * @function parseBounceData
 * @memberof CityArtWalks.Validators.EmailBounce
 * @param {Object} webhookData - Raw webhook data from provider
 * @param {string} provider - Email provider name
 * @returns {Object} Standardized bounce data
 */
export function parseBounceData(webhookData, provider) {
  const standardized = {
    email: '',
    bounceType: 'TRANSIENT',
    bounceReason: '',
    diagnosticCode: '',
    providerData: webhookData,
  };

  switch (provider) {
    case 'sendgrid':
      standardized.email = webhookData.email;
      standardized.bounceType = classifyBounceType(webhookData.status, webhookData.reason);
      standardized.bounceReason = webhookData.reason;
      standardized.diagnosticCode = webhookData.status;
      break;

    case 'mailgun':
      standardized.email = webhookData.recipient;
      standardized.bounceType = classifyBounceType(webhookData.code, webhookData.error);
      standardized.bounceReason = webhookData.error;
      standardized.diagnosticCode = webhookData.code;
      break;

    case 'ses': {
      const bounce = webhookData.bounce || {};
      standardized.email = bounce.bouncedRecipients?.[0]?.emailAddress;
      standardized.bounceType = bounce.bounceType === 'Permanent' ? 'HARD' : 'SOFT';
      standardized.bounceReason = bounce.bouncedRecipients?.[0]?.diagnosticCode;
      standardized.diagnosticCode = bounce.bouncedRecipients?.[0]?.status;
      break;
    }

    case 'microsoft-graph':
      // Microsoft Graph API bounce handling
      standardized.email = webhookData.recipientEmail;
      standardized.bounceType = classifyBounceType(
        webhookData.statusCode,
        webhookData.errorDescription
      );
      standardized.bounceReason = webhookData.errorDescription;
      standardized.diagnosticCode = webhookData.statusCode;
      break;

    default:
      // Keep the default values
      break;
  }

  return standardized;
}

/**
 * Schema for bounce cleanup operations
 * @constant {z.ZodObject} bounceCleanupSchema
 * @memberof CityArtWalks.Validators.EmailBounce
 */
export const bounceCleanupSchema = z.object({
  olderThanDays: z
    .number()
    .int()
    .min(30, 'Must keep bounces for at least 30 days')
    .max(3650, 'Cannot exceed 10 years')
    .optional()
    .default(365),

  bounceType: z
    .enum(bounceTypeValues, {
      errorMap: () => ({ message: 'Bounce type must be HARD, SOFT, or TRANSIENT' }),
    })
    .optional(),

  dryRun: z.boolean().optional().default(true),
});
