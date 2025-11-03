/**
 * @file harvest-batch.js
 * @description Zod validation schemas for HarvestBatch — batch configuration, processing stats, and management.
 * @namespace CityArtWalks.Validators.HarvestBatch
 * @version 1.0.0
 * @author Generated
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/HarvestBatch-Model} - HarvestBatch model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#HarvestBatch} - Database schema reference
 */
import { z } from 'zod';

/**
 * Base Zod schema for harvest batch data validation
 *
 * Defines the complete data structure for harvest batch entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.HarvestBatch
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#HarvestBatch} - Database schema reference
 */
export const harvestBatchSchema = z.object({
  harvestBatchId: z.number().int().positive(),
  name: z.string().min(1, 'Batch name is required').max(255, 'Batch name too long'),
  status: z
    .enum(['PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PAUSED'], {
      errorMap: () => ({ message: 'Invalid harvest batch status' }),
    })
    .default('PROCESSING'),
  totalUrls: z.number().int().min(0).default(0),
  processedUrls: z.number().int().min(0).default(0),
  successfulExtractions: z.number().int().min(0).default(0),
  failedExtractions: z.number().int().min(0).default(0),
  publishedPieces: z.number().int().min(0).default(0),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable().optional(),
  configuration: z.any().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Schema for creating new harvest batch records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.HarvestBatch
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createHarvestBatchSchema = harvestBatchSchema.omit({
  harvestBatchId: true,
  startedAt: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing harvest batch records
 *
 * Makes all fields optional except name, allowing partial updates.
 * Used by PUT API routes.
 *
 * @memberof CityArtWalks.Validators.HarvestBatch
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateHarvestBatchSchema = createHarvestBatchSchema.partial().extend({
  name: z.string().min(1, 'Batch name is required').max(255, 'Batch name too long'),
});

/**
 * Schema for harvest batch query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.HarvestBatch
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const harvestBatchQuerySchema = z.object({
  // Pagination parameters
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  skip: z.number().optional().default(0),
  take: z.number().optional().default(10),

  // ID parameters
  harvestBatchId: z.number().int().positive().optional(),

  // Search parameter
  search: z.string().optional(),

  // Standard filters
  status: z.enum(['PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PAUSED']).optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  // Sort parameters
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),

  // Entity-specific filters
  totalUrlsMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  totalUrlsMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  successRateMin: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  successRateMax: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  startedAfter: z.string().optional(),
  startedBefore: z.string().optional(),
  completedAfter: z.string().optional(),
  completedBefore: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
});

/**
 * Gets default values for HarvestBatch forms and initialization
 *
 * Provides sensible defaults for creating new harvest batch records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.HarvestBatch
 * @function getHarvestBatchDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#HarvestBatch} - Database schema defaults
 */
export function getHarvestBatchDefaultValues() {
  return {
    name: '',
    status: 'PROCESSING',
    totalUrls: 0,
    processedUrls: 0,
    successfulExtractions: 0,
    failedExtractions: 0,
    publishedPieces: 0,
    completedAt: null,
    configuration: null,
    createdBy: null,
    updatedBy: null,
  };
}
