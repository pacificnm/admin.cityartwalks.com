/**
 * @file art-piece-tag.js
 * @description Zod schemas and helpers for ArtPieceTag — validation for tag creation, update, and query operations used by harvesting and search.
 * @namespace CityArtWalks.Validators.ArtPieceTag
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag model docs
 */
import { z } from 'zod';

/**
 * Base Zod schema for artPieceTag data validation
 *
 * Defines the complete data structure for artPieceTag entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.ArtPieceTag
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 */
export const artPieceTagSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  artPieceTagId: z.number().int().optional(),

  // Required string fields
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),

  // Optional string fields
  description: z.string().nullable().optional(),

  // Boolean fields
  active: z.boolean().default(true),

  // Date fields
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  // User tracking fields
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Zod schema for creating new artPieceTag entries
 *
 * Used for validating data when creating new artPieceTag entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.ArtPieceTag
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag model documentation
 */
export const createArtPieceTagSchema = artPieceTagSchema.omit({
  artPieceTagId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating existing artPieceTag entries
 *
 * Allows partial updates by making all fields optional. Used for PATCH operations
 * where only specific fields need to be updated.
 *
 * @memberof CityArtWalks.Validators.ArtPieceTag
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag model documentation
 */
export const updateArtPieceTagSchema = artPieceTagSchema.partial();

/**
 * Zod schema for validating artPieceTag query parameters
 *
 * Handles pagination, filtering, and sorting parameters for artPieceTag API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options.
 *
 * @memberof CityArtWalks.Validators.ArtPieceTag
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag model documentation
 */
export const artPieceTagQuerySchema = z.object({
  // Pagination
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),

  // Search
  search: z.string().optional(),

  // Boolean filters (transform string to boolean, handle empty strings)
  active: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      return val;
    })
    .pipe(z.enum(['true', 'false']).optional()),

  // User filters (transform string to number)
  createdBy: z
    .string()
    .optional()
    .transform((val) => (val && !isNaN(parseInt(val, 10)) ? parseInt(val, 10) : undefined)),

  // Date filters
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  // Sorting options with defaults for alphabetical name sorting
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'active']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Returns default artPieceTag values for form initialization and data consistency
 *
 * Provides consistent default values for all artPieceTag fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for artPieceTag operations.
 *
 * @function defaultArtPieceTagValues
 * @memberof CityArtWalks.Validators.ArtPieceTag
 * @param {Object} [artPieceTag] - Partial artPieceTag object (may be incomplete)
 * @returns {Object} Complete artPieceTag object with all default fields populated
 *
 * @example
 * // Create defaults for new artPieceTag entry
 * const defaults = defaultArtPieceTagValues();
 *
 * // Merge with existing partial data
 * const tagData = defaultArtPieceTagValues({
 *   name: 'Abstract',
 *   active: true
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag model documentation
 */
export function defaultArtPieceTagValues(artPieceTag) {
  return {
    // Primary key (undefined for creates)
    artPieceTagId: artPieceTag?.artPieceTagId ?? undefined,

    // Required string fields with empty defaults
    name: artPieceTag?.name ?? '',

    // Optional string fields - use empty string for form inputs (not null)
    // Note: While the schema allows null values for database storage,
    // React form inputs require empty strings to prevent controlled/uncontrolled component warnings
    description: artPieceTag?.description ?? '',

    // Boolean fields
    active: artPieceTag?.active ?? true,

    // Date fields
    createdAt: artPieceTag?.createdAt ?? undefined,
    updatedAt: artPieceTag?.updatedAt ?? undefined,

    // User tracking fields
    createdBy: artPieceTag?.createdBy ?? null,
    updatedBy: artPieceTag?.updatedBy ?? null,
  };
}
