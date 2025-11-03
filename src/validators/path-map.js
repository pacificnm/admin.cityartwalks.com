/**
 * @file path-map.js
 * @description PathMap data validation schemas using Zod.
 * This module provides comprehensive Zod schemas for validating path map data throughout
 * the City Art Walks application. Includes schemas for creating, updating, querying, and
 * filtering path map data with proper type safety and validation rules.
 *
 * Represents the relationship between paths and art pieces in the City Art Walks
 * application. Each path map links a specific art piece to a path.
 *
 * @namespace CityArtWalks.Validators.PathMap
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Map-Model} - PathMap model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#PathMap} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for path map data validation
 *
 * Defines the complete data structure for path map entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.PathMap
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#PathMap} - Database schema reference
 */
export const pathMapSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  pathMapId: z.number().int().optional(),

  // Required foreign key fields
  pathId: z.number().int().positive('Path ID must be a positive integer'),
  artPieceId: z.number().int().positive('Art Piece ID must be a positive integer'),

  // Date fields
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  // User tracking fields
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Zod schema for creating new path map entries
 *
 * Used for validating data when creating new path map entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.PathMap
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Map-Model} - PathMap model documentation
 */
export const createPathMapSchema = pathMapSchema.omit({
  pathMapId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating existing path map entries
 *
 * Allows partial updates by making all fields optional. Used for PATCH operations
 * where only specific fields need to be updated.
 *
 * @memberof CityArtWalks.Validators.PathMap
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Map-Model} - PathMap model documentation
 */
export const updatePathMapSchema = pathMapSchema.partial();

/**
 * Returns default path map values for form initialization and data consistency
 *
 * Provides consistent default values for all path map fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for path map operations.
 *
 * @function defaultPathMapValues
 * @memberof CityArtWalks.Validators.PathMap
 * @param {Object} [pathMap] - Partial path map object (may be incomplete)
 * @returns {Object} Complete path map object with all default fields populated
 *
 * @example
 * // Create defaults for new path map entry
 * const defaults = defaultPathMapValues();
 *
 * // Merge with existing partial data
 * const pathMapData = defaultPathMapValues({
 *   pathId: 123,
 *   artPieceId: 456
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Map-Model} - PathMap model documentation
 */
export function defaultPathMapValues(pathMap) {
  return {
    pathMapId: pathMap?.pathMapId ?? undefined,
    pathId: pathMap?.pathId ?? null,
    artPieceId: pathMap?.artPieceId ?? null,
    createdAt: pathMap?.createdAt ?? undefined,
    updatedAt: pathMap?.updatedAt ?? undefined,
    createdBy: pathMap?.createdBy ?? null,
    updatedBy: pathMap?.updatedBy ?? null,
  };
}

/**
 * Zod schema for validating path map query parameters
 *
 * Handles pagination, filtering, and sorting parameters for path map API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options.
 *
 * @memberof CityArtWalks.Validators.PathMap
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Map-Model} - PathMap model documentation
 */
export const pathMapQuerySchema = z.object({
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
  pathId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  artPieceId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  updatedBy: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int())
    .optional(),
  sortBy: z.enum(['pathId', 'artPieceId', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
