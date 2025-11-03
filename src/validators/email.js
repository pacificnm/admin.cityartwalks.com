/**
 * @file email.js
 * @description Email data validation schemas using Zod.
 * This module provides comprehensive Zod schemas for validating email data across
 * the City Art Walks application. It includes schemas for creating, updating,
 * querying, filtering, and sending emails, plus helper functions and enhanced
 * creation schemas for template-backed emails.
 *
 * Represents email records used for notifications, transactional messages, and
 * user communications.
 *
 * @namespace CityArtWalks.Validators.Email
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Model} - Email model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Email} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for email data validation
 *
 * Defines the complete data structure for email entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Email
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Email} - Database schema reference
 */
export const emailSchema = z.object({
  // Primary key (integer, auto-increment)
  emailId: z.number().int().positive('Email ID must be a positive integer').optional(),

  // Enhanced email system fields
  templateId: z.number().int().positive('Template ID must be a positive integer').optional(),
  deliveryStatus: z
    .enum(['pending', 'sent', 'delivered', 'failed', 'bounced'], {
      errorMap: () => ({ message: 'Invalid delivery status' }),
    })
    .optional()
    .default('pending'),
  sentAt: z.coerce.date().optional(),
  unsubscribeToken: z
    .string()
    .max(255, 'Unsubscribe token must be less than 255 characters')
    .optional(),
  subject: z.string().max(500, 'Subject must be less than 500 characters').optional(),
  htmlContent: z.string().optional(),
  recipientEmail: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .optional(),
  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),
  variables: z.record(z.any()).optional(),
  graphMessageId: z
    .string()
    .max(255, 'Graph message ID must be less than 255 characters')
    .nullable()
    .optional(),

  // Legacy fields (kept for backwards compatibility)
  recordType: z
    .enum(['SpamComplaint', 'Open', 'Bounce', 'Delivery', 'Sent'], {
      required_error: 'Record type is required',
    })
    .optional(),
  messageID: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  description: z.string().optional(),
  details: z.string().optional(),

  // Foreign key fields
  userId: z.number().int().positive('User ID must be a positive integer').optional(),

  // Date fields
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating new email entries
 *
 * Used for validating data when creating new email entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.Email
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Model} - Email model documentation
 */
export const createEmailSchema = emailSchema.omit({
  emailId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating existing email entries
 *
 * Allows partial updates by making all fields optional. Used for PATCH operations
 * where only specific fields need to be updated.
 *
 * @memberof CityArtWalks.Validators.Email
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Model} - Email model documentation
 */
export const updateEmailSchema = emailSchema.partial();

/**
 * Returns default email values for form initialization and data consistency
 *
 * Provides consistent default values for all email fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for email operations.
 *
 * @function defaultEmailValues
 * @memberof CityArtWalks.Validators.Email
 * @param {Object} [email] - Partial email object (may be incomplete)
 * @returns {Object} Complete email object with all default fields populated
 *
 * @example
 * // Create defaults for new email entry
 * const defaults = defaultEmailValues();
 *
 * // Merge with existing partial data
 * const emailData = defaultEmailValues({
 *   recipientEmail: 'user@example.com',
 *   emailType: 'notification'
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Model} - Email model documentation
 */
export function defaultEmailValues(email) {
  return {
    emailId: email?.emailId ?? undefined,
    templateId: email?.templateId ?? null,
    deliveryStatus: email?.deliveryStatus ?? 'pending',
    sentAt: email?.sentAt ?? undefined,
    unsubscribeToken: email?.unsubscribeToken ?? null,
    subject: email?.subject ?? '',
    htmlContent: email?.htmlContent ?? '',
    recipientEmail: email?.recipientEmail ?? '',
    emailType: email?.emailType ?? 'notification',
    variables: email?.variables ?? {},
    graphMessageId: email?.graphMessageId ?? null,
    // Legacy fields
    recordType: email?.recordType ?? 'Delivery',
    messageID: email?.messageID ?? '',
    email: email?.email ?? '',
    description: email?.description ?? '',
    details: email?.details ?? '',
    userId: email?.userId ?? null,
    createdAt: email?.createdAt ?? undefined,
    updatedAt: email?.updatedAt ?? undefined,
  };
}

/**
 * Zod schema for validating email query parameters
 *
 * Handles pagination, filtering, and sorting parameters for email API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options.
 *
 * @memberof CityArtWalks.Validators.Email
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Email-Model} - Email model documentation
 */
export const emailQuerySchema = z.object({
  skip: z.number().int().min(0, 'Skip must be a non-negative integer').optional().default(0),
  rowsPerPage: z
    .number()
    .int()
    .min(1, 'Rows per page must be at least 1')
    .max(100, 'Rows per page cannot exceed 100')
    .optional()
    .default(25),
  search: z.string().max(200, 'Search term must be less than 200 characters').optional(),
  deliveryStatus: z.enum(['pending', 'sent', 'delivered', 'failed', 'bounced']).optional(),
  emailType: z.string().max(50, 'Email type must be less than 50 characters').optional(),
  templateId: z.string().regex(/^\d+$/, 'Template ID must be a valid integer').optional(),
  userId: z.string().regex(/^\d+$/, 'User ID must be a valid integer').optional(),
  dateFrom: z.string().datetime('Invalid date format').optional(),
  dateTo: z.string().datetime('Invalid date format').optional(),
  // Legacy query fields
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100))
    .optional(),
  recordType: z.enum(['SpamComplaint', 'Open', 'Bounce', 'Delivery', 'Sent']).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'recordType', 'sentAt', 'deliveryStatus']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Schema for enhanced email creation with template support
 * @constant {z.ZodObject} createEnhancedEmailSchema
 * @memberof CityArtWalks.Validators.Email
 */
export const createEnhancedEmailSchema = z.object({
  templateId: z.number().int().positive('Template ID must be a positive integer').optional(),
  recipientEmail: z.string().email('Invalid email format').min(1, 'Recipient email is required'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(500, 'Subject must be less than 500 characters'),
  htmlContent: z.string().min(1, 'HTML content is required').optional(),
  emailType: z
    .string()
    .max(50, 'Email type must be less than 50 characters')
    .optional()
    .default('notification'),
  variables: z.record(z.any()).optional().default({}),
  userId: z.number().int().positive('User ID must be a positive integer').optional(),
});

/**
 * Schema for email sending operations
 * @constant {z.ZodObject} sendEmailSchema
 * @memberof CityArtWalks.Validators.Email
 */
export const sendEmailSchema = z.object({
  to: z.string().email('Invalid recipient email'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(500, 'Subject must be less than 500 characters'),
  htmlContent: z.string().min(1, 'HTML content is required'),
  textContent: z.string().optional(),
  templateId: z.number().int().positive().optional(),
  variables: z.record(z.any()).optional().default({}),
  emailType: z.string().max(50).optional().default('notification'),
  userId: z.number().int().positive().optional(),
});
