/**
 * @file user-score.js
 * @description Zod validation schemas for UserScore — validation for scoring metrics, bulk operations, and queries.
 * @namespace CityArtWalks.Validators.UserScore
 * @version 1.0.0
 * @author System Generated
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserScore-Model} - UserScore model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserScore} - Database schema reference
 */
import { z } from 'zod';

/**
 * Base Zod schema for user score data validation
 *
 * Defines the complete data structure for UserScore entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.UserScore
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserScore} - Database schema reference
 */
export const userScoreSchema = z.object({
  userScoreId: z.number().int().positive('User score ID must be a positive integer'),
  userId: z.number().int().positive('User ID must be a positive integer'),
  totalPoints: z
    .number()
    .int()
    .min(0, 'Total points cannot be negative')
    .max(999999999, 'Total points exceeds maximum allowed'),
  artists: z
    .number()
    .int()
    .min(0, 'Artists count cannot be negative')
    .max(999999, 'Artists count exceeds maximum allowed'),
  artPieces: z
    .number()
    .int()
    .min(0, 'Art pieces count cannot be negative')
    .max(999999, 'Art pieces count exceeds maximum allowed'),
  paths: z
    .number()
    .int()
    .min(0, 'Paths count cannot be negative')
    .max(999999, 'Paths count exceeds maximum allowed'),
  images: z
    .number()
    .int()
    .min(0, 'Images count cannot be negative')
    .max(999999, 'Images count exceeds maximum allowed'),
  reviews: z
    .number()
    .int()
    .min(0, 'Reviews count cannot be negative')
    .max(999999, 'Reviews count exceeds maximum allowed'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z
    .number()
    .int()
    .positive('Created by user ID must be a positive integer')
    .nullable()
    .optional(),
  updatedBy: z
    .number()
    .int()
    .positive('Updated by user ID must be a positive integer')
    .nullable()
    .optional(),
});

/**
 * Schema for creating new user score records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.UserScore
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createUserScoreSchema = userScoreSchema.omit({
  userScoreId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing user score records
 *
 * Makes all fields optional except userId, allowing partial updates.
 * Used by PUT API routes and scoring service operations.
 *
 * @memberof CityArtWalks.Validators.UserScore
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateUserScoreSchema = createUserScoreSchema.partial().extend({
  userId: z.number().int().positive('User ID must be a positive integer'),
});

/**
 * Schema for user score query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.UserScore
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const userScoreQuerySchema = z.object({
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

  // Scoring filters
  minTotalPoints: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxTotalPoints: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  minArtists: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxArtists: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  minArtPieces: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxArtPieces: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  minPaths: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxPaths: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  minImages: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxImages: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  minReviews: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxReviews: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),

  // User relationship filters
  userId: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  // Sort parameters
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),

  // Date range filters
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  updatedAfter: z.string().optional(),
  updatedBefore: z.string().optional(),
});

/**
 * Schema for bulk user score operations
 *
 * Validates arrays of user score data for bulk create/update operations.
 * Ensures all items in the array conform to the appropriate schema.
 *
 * @memberof CityArtWalks.Validators.UserScore
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - Bulk operations documentation
 */
export const bulkUserScoreSchema = z.object({
  userScores: z
    .array(createUserScoreSchema)
    .min(1, 'At least one user score is required')
    .max(100, 'Maximum 100 user scores allowed per bulk operation'),
});

/**
 * Schema for user score statistics and aggregation queries
 *
 * Validates parameters for generating user score statistics, leaderboards,
 * and aggregated metrics across the platform.
 *
 * @memberof CityArtWalks.Validators.UserScore
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-API} - Analytics documentation
 */
export const userScoreStatsSchema = z.object({
  // Statistics type
  statsType: z.enum(['summary', 'leaderboard', 'distribution', 'trends']).optional(),

  // Aggregation parameters
  groupBy: z.enum(['totalPoints', 'artists', 'artPieces', 'paths', 'images', 'reviews']).optional(),
  period: z.enum(['day', 'week', 'month', 'quarter', 'year']).optional(),

  // Range limits for leaderboards
  topCount: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),

  // Date range for trend analysis
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  // Filtering criteria
  minTotalPoints: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  minContributions: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

/**
 * Gets default values for UserScore forms and initialization
 *
 * Provides sensible defaults for creating new user score records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.UserScore
 * @function getUserScoreDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserScore} - Database schema defaults
 */
export function getUserScoreDefaultValues() {
  return {
    userId: null,
    totalPoints: 0,
    artists: 0,
    artPieces: 0,
    paths: 0,
    images: 0,
    reviews: 0,
    createdBy: null,
    updatedBy: null,
  };
}
