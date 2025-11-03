/**
 * @file index-now-submission.js
 * @description IndexNowSubmission data validation schemas using Zod.
 * This module provides comprehensive Zod schemas for validating IndexNow submission data throughout
 * the City Art Walks application. Includes schemas for creating, updating, querying, and
 * filtering IndexNow submission data with proper type safety and validation rules.
 *
 * IndexNow submissions represent URL queuing for search engine indexing notifications.
 * The service automatically queues URLs when entities (Artists, Art Pieces, Paths, Posts) are
 * created or updated, then processes them via scheduled cron jobs to notify search engines
 * of content changes for improved SEO performance.
 *
 * @namespace CityArtWalks.Validators.IndexNowSubmission
 * @version 1.0.0
 * @author CityArtWalks Development Team
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#IndexNowSubmission} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 * @see {@link https://www.indexnow.org/} - IndexNow protocol documentation
 */
import { z } from 'zod';

/**
 * Enum schemas matching database schema for type safety
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#IndexNowSubmission} - Database schema reference
 */
export const EntityTypeEnum = z.enum(['ARTIST', 'ART_PIECE', 'PATH', 'POST'], {
  errorMap: () => ({ message: 'Invalid entity type' }),
});

export const ActionTypeEnum = z.enum(['CREATED', 'UPDATED', 'DELETED'], {
  errorMap: () => ({ message: 'Invalid action type' }),
});

export const SubmissionStatusEnum = z.enum(['PENDING', 'SUBMITTED', 'FAILED', 'SUCCESS'], {
  errorMap: () => ({ message: 'Invalid submission status' }),
});

/**
 * Base Zod schema for IndexNow submission data validation
 *
 * Defines the complete data structure for IndexNow submission entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#IndexNowSubmission} - Database schema reference
 */
export const indexNowSubmissionSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  indexNowSubmissionId: z.number().int().positive().optional(),

  // Required fields
  url: z.string().min(1, 'URL is required').url('Must be a valid URL').max(2048, 'URL too long'),

  entityType: EntityTypeEnum,

  entityId: z.number().int('Entity ID must be an integer').positive('Entity ID must be positive'),

  action: ActionTypeEnum,

  status: SubmissionStatusEnum.default('PENDING'),

  // Optional response fields
  responseCode: z
    .number()
    .int('Response code must be an integer')
    .min(100, 'Invalid HTTP response code')
    .max(599, 'Invalid HTTP response code')
    .nullable()
    .optional(),

  responseBody: z.string().max(10000, 'Response body too long').nullable().optional(),

  // Optional timestamps
  submittedAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  // Audit fields
  createdBy: z
    .number()
    .int('Created by must be an integer')
    .positive('Created by must be positive')
    .nullable()
    .optional(),

  updatedBy: z
    .number()
    .int('Updated by must be an integer')
    .positive('Updated by must be positive')
    .nullable()
    .optional(),
});

/**
 * Schema for creating new IndexNow submission records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes and internal service calls.
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createIndexNowSubmissionSchema = indexNowSubmissionSchema
  .omit({
    indexNowSubmissionId: true,
    createdAt: true,
    updatedAt: true,
    submittedAt: true,
    responseCode: true,
    responseBody: true,
  })
  .extend({
    // Override status to allow explicit setting during creation
    status: SubmissionStatusEnum.optional().default('PENDING'),
  });

/**
 * Schema for updating existing IndexNow submission records
 *
 * Makes all fields optional except certain system fields, allowing partial updates.
 * Used by PUT API routes and internal processing operations.
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateIndexNowSubmissionSchema = z.object({
  // Allow updates to processing status and response data
  status: SubmissionStatusEnum.optional(),
  responseCode: z
    .number()
    .int('Response code must be an integer')
    .min(100, 'Invalid HTTP response code')
    .max(599, 'Invalid HTTP response code')
    .nullable()
    .optional(),
  responseBody: z.string().max(10000, 'Response body too long').nullable().optional(),
  submittedAt: z.coerce.date().nullable().optional(),
  updatedBy: z
    .number()
    .int('Updated by must be an integer')
    .positive('Updated by must be positive')
    .nullable()
    .optional(),
});

/**
 * Schema for IndexNow submission query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 * Includes comprehensive filtering options for admin dashboard functionality.
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const indexNowSubmissionQuerySchema = z.object({
  // Primary key field for ID lookups
  indexNowSubmissionId: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  id: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),

  // Pagination parameters (REQUIRED for all entities)
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),

  // Search parameter
  search: z.string().optional(),

  // Entity filtering
  entityType: EntityTypeEnum.optional(),
  entityId: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),

  // Status and action filtering
  status: SubmissionStatusEnum.optional(),
  action: ActionTypeEnum.optional(),

  // Date range filtering
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  submittedAfter: z.string().datetime().optional(),
  submittedBefore: z.string().datetime().optional(),

  // Response filtering for debugging
  responseCode: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  failedOnly: z.enum(['true', 'false']).optional(),

  // Audit field filtering
  createdBy: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  updatedBy: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),

  // Sort parameters
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'submittedAt', 'url', 'entityType', 'status', 'responseCode'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),

  // Advanced filtering
  hasResponse: z.enum(['true', 'false']).optional(),
  pendingOnly: z.enum(['true', 'false']).optional(),
  processedOnly: z.enum(['true', 'false']).optional(),
});

/**
 * Schema for bulk operations on IndexNow submissions
 *
 * Validates bulk processing requests for administrative operations
 * like mass status updates or bulk deletions.
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @constant {z.ZodObject}
 */
export const bulkIndexNowSubmissionSchema = z.object({
  submissionIds: z
    .array(z.number().int().positive())
    .min(1, 'At least one submission ID required')
    .max(1000, 'Too many submissions for bulk operation'),
  action: z.enum(['delete', 'retry', 'mark_success', 'mark_failed']),
  reason: z.string().max(500).optional(),
  updatedBy: z
    .number()
    .int('Updated by must be an integer')
    .positive('Updated by must be positive')
    .optional(),
});

/**
 * Schema for manual IndexNow submission creation
 *
 * Used by admin interface for manually queueing URLs for submission.
 * Includes validation for manual URL entry and entity association.
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @constant {z.ZodObject}
 */
export const manualIndexNowSubmissionSchema = z.object({
  url: z.string().min(1, 'URL is required').url('Must be a valid URL').max(2048, 'URL too long'),
  entityType: EntityTypeEnum,
  entityId: z.number().int('Entity ID must be an integer').positive('Entity ID must be positive'),
  action: ActionTypeEnum.default('CREATED'),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  notes: z.string().max(1000).optional(),
  createdBy: z
    .number()
    .int('Created by must be an integer')
    .positive('Created by must be positive'),
});

/**
 * Gets default values for IndexNow submission forms and initialization
 *
 * Provides sensible defaults for form initialization and testing scenarios.
 * Follows CityArtWalks patterns for default value functions.
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @function getIndexNowSubmissionDefaultValues
 * @returns {Object} Default values object for IndexNow submission forms
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Validation patterns
 */
export function getIndexNowSubmissionDefaultValues() {
  return {
    url: '',
    entityType: 'ART_PIECE',
    entityId: null,
    action: 'CREATED',
    status: 'PENDING',
    responseCode: null,
    responseBody: null,
    submittedAt: null,
    createdBy: null,
    updatedBy: null,
  };
}

/**
 * Gets default query values for IndexNow submission filtering
 *
 * Provides sensible defaults for query parameters in list views and API calls.
 *
 * @memberof CityArtWalks.Validators.IndexNowSubmission
 * @function getIndexNowSubmissionQueryDefaults
 * @returns {Object} Default query values for IndexNow submission filtering
 */
export function getIndexNowSubmissionQueryDefaults() {
  return {
    page: 1,
    limit: 10,
    search: '',
    entityType: undefined,
    status: undefined,
    action: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    failedOnly: undefined,
    pendingOnly: undefined,
    processedOnly: undefined,
  };
}
