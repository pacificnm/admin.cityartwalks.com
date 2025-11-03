/**
 * @file user-event.js
 * @description Zod validation schemas and helpers for user scoring events (UserEvent).
 * Includes create/update/query/bulk/stats schemas, validation helpers, and default
 * value utilities used by API routes and internal services to reliably process
 * point-awarding and adjustment events across the system.
 * @namespace CityArtWalks.Validators.UserEvent
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserEvent-Model} - UserEvent model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserEvent} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for UserEvent data validation
 *
 * Defines the complete data structure for user scoring event entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserEvent} - Database schema reference
 */
export const userEventSchema = z.object({
  userEventId: z.number().int().positive('User event ID must be positive'),
  userId: z.number().int().positive('User ID must be positive'),
  type: z.enum(
    [
      'CREATE_ARTIST',
      'CREATE_ART_PIECE',
      'CREATE_PATH',
      'CREATE_IMAGE',
      'CREATE_REVIEW',
      'BONUS',
      'ADJUSTMENT',
    ],
    {
      errorMap: () => ({ message: 'Invalid user event type' }),
    }
  ),
  entityId: z.string().nullable().optional(),
  entityType: z.enum(['Artist', 'ArtPiece', 'Path', 'Image', 'Review']).nullable().optional(),
  points: z
    .number()
    .int('Points must be an integer')
    .min(-10000, 'Points cannot be less than -10000')
    .max(10000, 'Points cannot exceed 10000'),
  reason: z.string().max(500, 'Reason cannot exceed 500 characters').nullable().optional(),
  meta: z.record(z.any()).nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Schema for creating new UserEvent records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes and scoring service.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createUserEventSchema = userEventSchema
  .omit({
    userEventId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    // Ensure userId and type are required for creation
    userId: z.number().int().positive('User ID is required and must be positive'),
    type: z.enum(
      [
        'CREATE_ARTIST',
        'CREATE_ART_PIECE',
        'CREATE_PATH',
        'CREATE_IMAGE',
        'CREATE_REVIEW',
        'BONUS',
        'ADJUSTMENT',
      ],
      {
        errorMap: () => ({ message: 'Event type is required' }),
      }
    ),
    points: z
      .number()
      .int('Points must be an integer')
      .min(-10000, 'Points cannot be less than -10000')
      .max(10000, 'Points cannot exceed 10000'),
  });

/**
 * Schema for updating existing UserEvent records
 *
 * Makes all fields optional except ID, allowing partial updates.
 * Used by PUT API routes for admin adjustments.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateUserEventSchema = createUserEventSchema.partial().extend({
  userEventId: z.number().int().positive('User event ID is required for updates'),
});

/**
 * Schema for UserEvent query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const userEventQuerySchema = z.object({
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

  // Event type filter
  type: z
    .enum([
      'CREATE_ARTIST',
      'CREATE_ART_PIECE',
      'CREATE_PATH',
      'CREATE_IMAGE',
      'CREATE_REVIEW',
      'BONUS',
      'ADJUSTMENT',
    ])
    .optional(),

  // Entity filters
  entityType: z.enum(['Artist', 'ArtPiece', 'Path', 'Image', 'Review']).optional(),
  entityId: z.string().optional(),

  // User filters
  userId: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  // Points filters
  minPoints: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  maxPoints: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),

  // Date range filters
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  // Sort parameters
  sortBy: z.enum(['createdAt', 'updatedAt', 'points', 'type', 'userId']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Schema for bulk UserEvent operations
 *
 * Validates arrays of user events for batch processing operations
 * such as backfill scripts or bulk scoring updates.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @constant {z.ZodObject}
 */
export const bulkUserEventSchema = z.object({
  events: z
    .array(createUserEventSchema)
    .min(1, 'At least one event is required')
    .max(100, 'Cannot process more than 100 events at once'),
  batchId: z.string().optional(),
  reason: z.string().max(500, 'Batch reason cannot exceed 500 characters').optional(),
});

/**
 * Schema for UserEvent statistics queries
 *
 * Validates parameters for retrieving aggregated statistics about user events.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @constant {z.ZodObject}
 */
export const userEventStatsSchema = z.object({
  userId: z.string().optional(),
  type: z
    .enum([
      'CREATE_ARTIST',
      'CREATE_ART_PIECE',
      'CREATE_PATH',
      'CREATE_IMAGE',
      'CREATE_REVIEW',
      'BONUS',
      'ADJUSTMENT',
    ])
    .optional(),
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  groupBy: z.enum(['day', 'week', 'month', 'type', 'user']).optional(),
});

/**
 * Gets default values for UserEvent forms and initialization
 *
 * Provides sensible defaults for creating new user event records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @function getUserEventDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserEvent} - Database schema defaults
 */
export function getUserEventDefaultValues() {
  return {
    userId: null,
    type: 'BONUS',
    entityId: null,
    entityType: null,
    points: 0,
    reason: null,
    meta: null,
    createdBy: null,
    updatedBy: null,
  };
}

/**
 * Validates UserEvent creation data
 *
 * Validates data for creating new user events with enhanced error context.
 * Used by scoring service and API routes.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @function validateUserEventCreation
 * @param {Object} data - Data to validate
 * @returns {Object} Validation result with success flag and data/error
 * @throws {ZodError} Validation errors for API error handling
 */
export function validateUserEventCreation(data) {
  const result = createUserEventSchema.safeParse(data);
  if (!result.success) {
    throw result.error; // Pass through ZodError for API handling
  }
  return result.data;
}

/**
 * Validates UserEvent query parameters
 *
 * Validates and transforms query parameters for user event GET requests.
 * Handles pagination, filtering, and sorting parameters.
 *
 * @memberof CityArtWalks.Validators.UserEvent
 * @function validateUserEventQuery
 * @param {Object} queryParams - Query parameters to validate
 * @returns {Object} Validated and transformed query parameters
 * @throws {ZodError} Validation errors for API error handling
 */
export function validateUserEventQuery(queryParams) {
  const result = userEventQuerySchema.safeParse(queryParams);
  if (!result.success) {
    throw result.error; // Pass through ZodError for API handling
  }
  return result.data;
}

export default {
  userEventSchema,
  createUserEventSchema,
  updateUserEventSchema,
  userEventQuerySchema,
  bulkUserEventSchema,
  userEventStatsSchema,
  getUserEventDefaultValues,
  validateUserEventCreation,
  validateUserEventQuery,
};
