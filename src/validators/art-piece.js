/**
 * @file art-piece.js
 * @description Zod validation schemas, query schemas, and form defaults for ArtPiece entities used across City Art Walks.
 * Provides create/update schemas, query parameter validation, and helpers for default/form values.
 * @namespace CityArtWalks.Validators.ArtPiece
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} z - Zod schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 */

import { z } from 'zod';

/**
 * Base Zod schema for artPiece data validation
 *
 * Defines the complete data structure for artPiece entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations with proper sanitization and validation.
 *
 * @memberof CityArtWalks.Validators.ArtPiece
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPiece} - Database schema reference
 */
export const artPieceSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  artPieceId: z.coerce.number().int().optional(),

  // Required string fields
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  slug: z.string().min(1, 'Slug is required'),

  // Foreign key fields - coerce strings to numbers (allow any valid ID for updates)
  artistId: z.coerce.number().int().min(1, 'Artist ID must be a positive integer'),

  // Geographic coordinates - coerce strings to numbers
  latitude: z.coerce.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
  longitude: z.coerce.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),

  // Optional string fields
  description: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  imageUrl: z.string().url('Invalid image URL').nullable().optional(),
  staticMapUrl: z.string().url('Invalid static map URL').nullable().optional(),

  // Numeric fields - coerce strings to numbers
  viewCount: z.coerce.number().int().min(0).default(0),

  // Boolean fields - coerce strings to booleans
  featured: z.coerce.boolean().default(false),

  // Enum fields
  status: z
    .enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW', 'BANNED', 'REJECTED', 'PENDING'])
    .default('ACTIVE'),

  // Date fields
  creationDate: z.coerce.date().nullable().optional(),
  installationDate: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  // User tracking fields - coerce strings to numbers
  createdBy: z.coerce.number().int().positive().nullable().optional(),
  updatedBy: z.coerce.number().int().positive().nullable().optional(),

  // Foreign key fields (nullable) - coerce strings to numbers
  cityId: z.coerce.number().int().nullable().optional(),
  countryId: z.coerce.number().int().nullable().optional(),
  stateId: z.coerce.number().int().nullable().optional(),

  // JSON/Relation fields - Materials and Tags are required, Type is optional in schema
  artPieceMaterial: z
    .array(z.any())
    .min(1, 'At least one material must be selected')
    .refine((materials) => materials && materials.length > 0, {
      message: 'At least one material must be selected',
    }),
  artPieceTag: z
    .array(z.any())
    .min(1, 'At least one tag must be selected')
    .refine((tags) => tags && tags.length > 0, {
      message: 'At least one tag must be selected',
    }),
  artPieceType: z.any().nullable().optional(),

  // SEO Meta tag fields (optional)
  metaTitle: z.string().max(60, 'Meta title must be 60 characters or less').nullable().optional(),
  metaDescription: z
    .string()
    .max(160, 'Meta description must be 160 characters or less')
    .nullable()
    .optional(),
  metaKeywords: z
    .string()
    .max(255, 'Meta keywords must be 255 characters or less')
    .nullable()
    .optional(),
});

/**
 * Zod schema for creating new artPiece entries
 *
 * Used for validating data when creating new artPiece entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.ArtPiece
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 */
export const createArtPieceSchema = artPieceSchema.omit({
  artPieceId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating existing artPiece entries
 *
 * Allows partial updates by making all fields optional. Used for PUT operations
 * where only specific fields need to be updated. Excludes auto-generated and
 * audit fields that should not be directly updated.
 *
 * @memberof CityArtWalks.Validators.ArtPiece
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 */
export const updateArtPieceSchema = artPieceSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
  })
  .partial();

/**
 * Zod schema for validating artPiece query parameters
 *
 * Handles pagination, filtering, and sorting parameters for artPiece API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options. Supports both legacy page/limit pagination
 * and modern skip/take patterns used by model functions.
 *
 * @memberof CityArtWalks.Validators.ArtPiece
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 */
export const artPieceQuerySchema = z.object({
  // Primary key field for ID lookups
  artPieceId: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  id: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
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
  search: z.string().optional(),
  status: z
    .enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW', 'BANNED', 'REJECTED', 'PENDING'])
    .optional(),
  artistId: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  cityId: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  countryId: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  stateId: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  featured: z
    .union([z.string().transform((val) => val === 'true'), z.boolean()])
    .pipe(z.boolean())
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  updatedBy: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  userId: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(z.number().int())
    .optional(),
  sortBy: z.enum(['title', 'createdAt', 'updatedAt', 'viewCount', 'status', 'artistId']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Returns default artPiece values for form initialization and data consistency
 *
 * Provides consistent default values for all artPiece fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for artPiece operations.
 *
 * @function defaultArtPieceValues
 * @memberof CityArtWalks.Validators.ArtPiece
 * @param {Object} [artPiece] - Partial artPiece object (may be incomplete)
 * @returns {Object} Complete artPiece object with all default fields populated
 *
 * @example
 * // Create defaults for new artPiece entry
 * const defaults = defaultArtPieceValues();
 *
 * // Merge with existing partial data
 * const pieceData = defaultArtPieceValues({
 *   title: 'Example',
 *   featured: true
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 */
export function defaultArtPieceValues(artPiece) {
  return {
    artPieceId: artPiece?.artPieceId ?? undefined,
    title: artPiece?.title ?? '',
    artistId: artPiece?.artistId ?? undefined,
    description: artPiece?.description ?? null,
    latitude: artPiece?.latitude ?? 0,
    longitude: artPiece?.longitude ?? 0,
    creationDate: artPiece?.creationDate ?? null,
    installationDate: artPiece?.installationDate ?? null,
    status: artPiece?.status ?? 'ACTIVE',
    viewCount: artPiece?.viewCount ?? 0,
    featured: artPiece?.featured ?? false,
    city: artPiece?.city ?? null,
    state: artPiece?.state ?? null,
    imageUrl: artPiece?.imageUrl ?? null,
    slug: artPiece?.slug ?? '',
    artPieceMaterial: artPiece?.artPieceMaterial ?? null,
    artPieceTag: artPiece?.artPieceTag ?? null,
    staticMapUrl: artPiece?.staticMapUrl ?? null,
    cityId: artPiece?.cityId ?? null,
    countryId: artPiece?.countryId ?? null,
    stateId: artPiece?.stateId ?? null,
    artPieceType: artPiece?.artPieceType ?? null,
    createdAt: artPiece?.createdAt ?? undefined,
    updatedAt: artPiece?.updatedAt ?? undefined,
    createdBy: artPiece?.createdBy ?? null,
    updatedBy: artPiece?.updatedBy ?? null,
    metaTitle: artPiece?.metaTitle ?? null,
    metaDescription: artPiece?.metaDescription ?? null,
    metaKeywords: artPiece?.metaKeywords ?? null,
  };
}
