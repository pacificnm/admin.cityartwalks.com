/**
 * @file friend.js
 * @description Friend data validation schemas using Zod.
 * This module provides Zod schemas for validating friend relationships across
 * the City Art Walks application, including create, update, query, and helper
 * utilities for form defaults and pagination parameters.
 *
 * Represents friendship relationships between users; each record links two user IDs
 * and includes optional timestamp fields.
 *
 * @namespace CityArtWalks.Validators.Friend
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Friend-Model} - Friend model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Friend} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for friend data validation
 *
 * Defines the complete data structure for friend entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Friend
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Friend} - Database schema reference
 */
export const friendSchema = z.object({
  // Primary key (composite, not included here)

  // Foreign key fields
  userId1: z.number().int().min(1, 'User ID 1 is required'),
  userId2: z.number().int().min(1, 'User ID 2 is required'),

  // Date fields
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating new friend entries
 *
 * Used for validating data when creating new friend entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.Friend
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Friend-Model} - Friend model documentation
 */
export const createFriendSchema = friendSchema.omit({
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating existing friend entries
 *
 * Allows partial updates by making all fields optional. Used for PATCH operations
 * where only specific fields need to be updated.
 *
 * @memberof CityArtWalks.Validators.Friend
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Friend-Model} - Friend model documentation
 */
export const updateFriendSchema = friendSchema.partial();

/**
 * Returns default friend values for form initialization and data consistency
 *
 * Provides consistent default values for all friend fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for friend operations.
 *
 * @function defaultFriendValues
 * @memberof CityArtWalks.Validators.Friend
 * @param {Object} [friend] - Partial friend object (may be incomplete)
 * @returns {Object} Complete friend object with all default fields populated
 *
 * @example
 * // Create defaults for new friend entry
 * const defaults = defaultFriendValues();
 *
 * // Merge with existing partial data
 * const friendData = defaultFriendValues({
 *   userId1: 1,
 *   userId2: 2
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Friend-Model} - Friend model documentation
 */
export function defaultFriendValues(friend) {
  return {
    userId1: friend?.userId1 ?? null,
    userId2: friend?.userId2 ?? null,
    createdAt: friend?.createdAt ?? undefined,
    updatedAt: friend?.updatedAt ?? undefined,
  };
}

/**
 * Zod schema for validating friend query parameters
 *
 * Handles pagination, filtering, and sorting parameters for friend API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options.
 *
 * @memberof CityArtWalks.Validators.Friend
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Friend-Model} - Friend model documentation
 */
export const friendQuerySchema = z.object({
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
  userId1: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  userId2: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
