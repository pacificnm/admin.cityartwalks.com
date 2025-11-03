/**
 * @file review.js
 * @description Review data validation schemas using Zod.
 * This module provides comprehensive Zod schemas for validating review data throughout
 * the City Art Walks application. Includes schemas for creating, updating, querying, and
 * filtering review data with proper type safety and validation rules.
 *
 * Reviews represent user feedback and ratings for art pieces, artists, paths, and other content
 * with support for ratings, comments, and moderation workflows.
 *
 * @namespace CityArtWalks.Validators.Review
 * @version 1.1.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Review} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for review data validation
 *
 * Defines the complete data structure for review entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Review
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Review} - Database schema reference
 */
export const reviewSchema = z.object({
  reviewId: z.coerce.number().int().optional(),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Please select a rating from 1 to 5 stars')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters long')
    .max(2000, 'Comment cannot exceed 2000 characters')
    .refine((val) => val.trim().length >= 10, {
      message: 'Comment must contain at least 10 meaningful characters',
    }),
  status: z
    .enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW', 'PENDING', 'REJECTED', 'BANNED'], {
      errorMap: () => ({ message: 'Invalid status' }),
    })
    .default('ACTIVE'),
  createdBy: z.coerce.number().int().min(1, 'Created by is required'),
  artistId: z.coerce.number().int().nullable().optional(),
  artPieceId: z.coerce.number().int().nullable().optional(),
  imageId: z.coerce.number().int().nullable().optional(),
  pathId: z.coerce.number().int().nullable().optional(),
  pathMapId: z.coerce.number().int().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Schema for creating new review records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.Review
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createReviewSchema = reviewSchema.omit({
  reviewId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing review records
 *
 * Makes all fields optional except ID, allowing partial updates.
 * Used by PUT API routes.
 *
 * @memberof CityArtWalks.Validators.Review
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateReviewSchema = createReviewSchema.partial();

/**
 * Schema for review query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.Review
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const reviewQuerySchema = z.object({
  // Pagination parameters (REQUIRED for all entities)
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),

  // Search parameter (REQUIRED for all entities)
  search: z.string().optional(),

  // Standard filters
  status: z
    .enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW', 'PENDING', 'REJECTED', 'BANNED'])
    .optional(),
  createdBy: z.string().optional(),

  // Sort parameters (REQUIRED for all entities)
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),

  // Review-specific filters
  rating: z.string().optional(),
  artistId: z.string().optional(),
  artPieceId: z.string().optional(),
  imageId: z.string().optional(),
  pathId: z.string().optional(),
  pathMapId: z.string().optional(),
});

/**
 * Gets default values for Review forms and initialization
 *
 * Provides sensible defaults for creating new review records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.Review
 * @function getReviewDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Review} - Database schema defaults
 */
/**
 * Schema for review statistics query parameters
 *
 * Validates query parameters for fetching review statistics and aggregations.
 * Used by statistics API routes.
 *
 * @memberof CityArtWalks.Validators.Review
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const reviewStatsQuerySchema = z.object({
  includeRecent: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 5))
    .refine((val) => val >= 0 && val <= 20, 'includeRecent must be between 0 and 20'),
  includeTop: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 3))
    .refine((val) => val >= 0 && val <= 10, 'includeTop must be between 0 and 10'),
  includeTrends: z
    .string()
    .optional()
    .transform((val) => val === 'true')
    .default('false'),
  cacheTime: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 300))
    .refine((val) => val >= 60 && val <= 3600, 'cacheTime must be between 60 and 3600 seconds'),
});

/**
 * Schema for flagging reviews
 *
 * Validates flag requests from content owners.
 * Used by flag API routes.
 *
 * @memberof CityArtWalks.Validators.Review
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const flagReviewSchema = z.object({
  reason: z.enum(
    ['inappropriate_content', 'spam', 'off_topic', 'fake_review', 'harassment', 'other'],
    {
      errorMap: () => ({ message: 'Invalid flag reason' }),
    }
  ),
  details: z.string().max(500, 'Details must be 500 characters or less').optional(),
});

/**
 * Schema for moderation queue query parameters
 *
 * Validates query parameters for fetching reviews requiring moderation.
 * Used by admin moderation queue API routes.
 *
 * @memberof CityArtWalks.Validators.Review
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const reviewModerationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= 1, 'Page must be at least 1'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100'),
  status: z
    .enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW', 'PENDING', 'REJECTED', 'BANNED'])
    .optional(),
  priority: z.enum(['high_first', 'date_desc', 'date_asc']).default('high_first'),
  entityType: z.enum(['ARTIST', 'ART_PIECE', 'IMAGE', 'PATH', 'PATH_MAP']).optional(),
});

/**
 * Schema for admin moderation decisions
 *
 * Validates admin moderation decision requests.
 * Used by admin moderation decision API routes.
 *
 * @memberof CityArtWalks.Validators.Review
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const moderateReviewSchema = z.object({
  decision: z.enum(['APPROVE', 'REJECT', 'DELETE', 'NEEDS_REVIEW'], {
    errorMap: () => ({ message: 'Invalid moderation decision' }),
  }),
  notes: z.string().max(500, 'Moderation notes must be 500 characters or less').optional(),
  overrideAI: z.boolean().default(false),
});

/**
 * Gets default values for Review forms and initialization
 *
 * Provides sensible defaults for creating new review records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.Review
 * @function getReviewDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Review} - Database schema defaults
 */
export function getReviewDefaultValues() {
  return {
    rating: 5,
    comment: '',
    status: 'ACTIVE',
    createdBy: null,
    artistId: null,
    artPieceId: null,
    imageId: null,
    pathId: null,
    pathMapId: null,
  };
}
