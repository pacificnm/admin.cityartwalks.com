/**
 * @file url-input.js
 * @description Zod validation schemas for URL input records used by City Art Walks.
 * Provides create, update, query, and bulk schemas, plus default value helpers for forms
 * and batch processing. Validates URL format, extraction configuration, scheduling,
 * priorities, and related metadata for reliable ingestion of external URLs.
 * @namespace CityArtWalks.Validators.URLInput
 * @version 1.0.0
 * @author Generated
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/URLInput-Model} - URLInput model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#URLInput} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for URL input data validation
 *
 * Defines the complete data structure for URL input entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.URLInput
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#URLInput} - Database schema reference
 */
export const urlInputSchema = z.object({
  url: z.string().url('Invalid URL format').min(1, 'URL is required'),
  batchName: z.string().min(1, 'Batch name is required').max(255, 'Batch name too long').optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  extractionConfig: z
    .object({
      includeImages: z.boolean().default(true),
      includeMetadata: z.boolean().default(true),
      maxImages: z.number().int().min(0).max(50).default(10),
      qualityThreshold: z.number().min(0).max(100).default(60),
      timeout: z.number().int().min(1000).max(300000).default(30000),
    })
    .optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().max(1000, 'Notes too long').optional(),
  scheduledFor: z.coerce.date().optional(),
});

/**
 * Schema for creating new URL input records
 *
 * Excludes auto-generated fields and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.URLInput
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createURLInputSchema = urlInputSchema;

/**
 * Schema for updating existing URL input records
 *
 * Makes all fields optional except URL, allowing partial updates.
 * Used by PUT API routes.
 *
 * @memberof CityArtWalks.Validators.URLInput
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateURLInputSchema = urlInputSchema.partial().extend({
  url: z.string().url('Invalid URL format').min(1, 'URL is required'),
});

/**
 * Schema for URL input query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.URLInput
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const urlInputQuerySchema = z.object({
  // Pagination parameters
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

  // Standard filters
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),

  // Sort parameters
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),

  // Entity-specific filters
  domain: z.string().optional(),
  hasSchedule: z.enum(['true', 'false']).optional(),
  hasTags: z.enum(['true', 'false']).optional(),
  batchName: z.string().optional(),
  scheduledAfter: z.string().optional(),
  scheduledBefore: z.string().optional(),
});

/**
 * Schema for bulk URL input validation
 *
 * Validates multiple URLs submitted together for batch processing.
 *
 * @memberof CityArtWalks.Validators.URLInput
 * @constant {z.ZodObject}
 */
export const bulkURLInputSchema = z.object({
  urls: z
    .array(z.string().url('Invalid URL format'))
    .min(1, 'At least one URL required')
    .max(100, 'Too many URLs'),
  batchName: z.string().min(1, 'Batch name is required').max(255, 'Batch name too long'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  extractionConfig: z
    .object({
      includeImages: z.boolean().default(true),
      includeMetadata: z.boolean().default(true),
      maxImages: z.number().int().min(0).max(50).default(10),
      qualityThreshold: z.number().min(0).max(100).default(60),
      timeout: z.number().int().min(1000).max(300000).default(30000),
    })
    .optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().max(1000, 'Notes too long').optional(),
  scheduledFor: z.coerce.date().optional(),
});

/**
 * Gets default values for URLInput forms and initialization
 *
 * Provides sensible defaults for creating new URL input records and
 * initializing forms. Based on business rules and user experience.
 *
 * @memberof CityArtWalks.Validators.URLInput
 * @function getURLInputDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#URLInput} - Database schema defaults
 */
export function getURLInputDefaultValues() {
  return {
    url: '',
    batchName: '',
    priority: 'NORMAL',
    extractionConfig: {
      includeImages: true,
      includeMetadata: true,
      maxImages: 10,
      qualityThreshold: 60,
      timeout: 30000,
    },
    tags: [],
    notes: '',
    scheduledFor: null,
  };
}

/**
 * Gets default values for bulk URL input forms and initialization
 *
 * Provides sensible defaults for creating new bulk URL input records and
 * initializing forms. Based on business rules and user experience.
 *
 * @memberof CityArtWalks.Validators.URLInput
 * @function getBulkURLInputDefaultValues
 * @returns {Object} Default values object matching bulk create schema
 */
export function getBulkURLInputDefaultValues() {
  return {
    urls: [],
    batchName: '',
    priority: 'NORMAL',
    extractionConfig: {
      includeImages: true,
      includeMetadata: true,
      maxImages: 10,
      qualityThreshold: 60,
      timeout: 30000,
    },
    tags: [],
    notes: '',
    scheduledFor: null,
  };
}
