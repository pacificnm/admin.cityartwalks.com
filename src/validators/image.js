/**
 * @file image.js
 * @description Image data validation schemas using Zod.
 * This module provides comprehensive Zod schemas for validating image data across
 * the City Art Walks application. It includes schemas for creating, updating,
 * querying, filtering, and moderating images, plus helper utilities and default
 * value helpers for form initialization.
 *
 * Represents images associated with artists, art pieces, or paths. Each image
 * record contains URL, metadata, moderation status, and optional relations to
 * other entities.
 *
 * @namespace CityArtWalks.Validators.Image
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} z - Zod schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Image} - Database schema reference
 */
import { z } from 'zod';

/**
 * Base Zod schema for image data validation
 *
 * Defines the complete data structure for image entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Image
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Image} - Database schema reference
 */
export const imageSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  imageId: z.number().int().optional(),

  // Required string fields
  url: z.string().url('Invalid URL format').min(1, 'URL is required'),

  // Optional string fields
  caption: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  flagReason: z.string().nullable().optional(),
  moderationNotes: z.string().nullable().optional(),

  // Numeric fields
  viewCount: z.number().int().min(0).default(0),
  fileSize: z.number().int().positive().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  flaggedBy: z.number().int().positive().nullable().optional(),
  moderatedBy: z.number().int().positive().nullable().optional(),

  // Boolean fields
  featured: z.boolean().default(false),

  // Enum fields
  status: z
    .enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW', 'BANNED', 'REJECTED', 'PENDING', 'FLAGGED'])
    .default('ACTIVE'),

  // Date fields
  uploadedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  flaggedAt: z.coerce.date().nullable().optional(),
  moderatedAt: z.coerce.date().nullable().optional(),

  // User tracking fields
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),

  // Foreign key fields (nullable)
  artistId: z.number().int().positive().nullable().optional(),
  artPieceId: z.number().int().positive().nullable().optional(),
  pathId: z.number().int().positive().nullable().optional(),
});

/**
 * Zod schema for creating new image entries
 *
 * Used for validating data when creating new image entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.Image
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 */
export const createImageSchema = imageSchema.omit({
  imageId: true,
  uploadedAt: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating existing image entries
 *
 * Allows partial updates by making all fields optional. Used for PATCH operations
 * where only specific fields need to be updated.
 *
 * @memberof CityArtWalks.Validators.Image
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 */
export const updateImageSchema = imageSchema.partial();

/**
 * Returns default image values for form initialization and data consistency
 *
 * Provides consistent default values for all image fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for image operations.
 *
 * @function defaultImageValues
 * @memberof CityArtWalks.Validators.Image
 * @param {Object} [image] - Partial image object (may be incomplete)
 * @returns {Object} Complete image object with all default fields populated
 *
 * @example
 * // Create defaults for new image entry
 * const defaults = defaultImageValues();
 *
 * // Merge with existing partial data
 * const imageData = defaultImageValues({
 *   url: 'https://example.com/image.jpg',
 *   featured: true
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 */
export function defaultImageValues(image) {
  return {
    imageId: image?.imageId ?? undefined,
    url: image?.url ?? '',
    caption: image?.caption ?? null,
    filename: image?.filename ?? null,
    mimeType: image?.mimeType ?? null,
    fileSize: image?.fileSize ?? null,
    width: image?.width ?? null,
    height: image?.height ?? null,
    viewCount: image?.viewCount ?? 0,
    featured: image?.featured ?? false,
    status: image?.status ?? 'ACTIVE',
    flagReason: image?.flagReason ?? null,
    flaggedAt: image?.flaggedAt ?? null,
    flaggedBy: image?.flaggedBy ?? null,
    moderatedAt: image?.moderatedAt ?? null,
    moderatedBy: image?.moderatedBy ?? null,
    moderationNotes: image?.moderationNotes ?? null,
    uploadedAt: image?.uploadedAt ?? undefined,
    createdAt: image?.createdAt ?? undefined,
    updatedAt: image?.updatedAt ?? undefined,
    createdBy: image?.createdBy ?? null,
    updatedBy: image?.updatedBy ?? null,
    artistId: image?.artistId ?? null,
    artPieceId: image?.artPieceId ?? null,
    pathId: image?.pathId ?? null,
  };
}

/**
 * Zod schema for validating image query parameters
 *
 * Handles pagination, filtering, and sorting parameters for image API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options.
 *
 * @memberof CityArtWalks.Validators.Image
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 */
export const imageQuerySchema = z.object({
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
    .enum(['ACTIVE', 'ARCHIVED', 'BANNED', 'DELETED', 'PENDING', 'REJECTED', 'REVIEW', 'FLAGGED'])
    .optional(),
  artistId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  artPieceId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  pathId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  featured: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  updatedBy: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  maxFileSize: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  minFileSize: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  sortBy: z.enum(['caption', 'createdAt', 'updatedAt', 'viewCount', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Zod schema for validating image moderation requests
 *
 * Handles validation for both single image and bulk moderation operations.
 * Ensures proper moderation actions and validates image IDs.
 *
 * @memberof CityArtWalks.Validators.Image
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 */
export const moderateImageSchema = z
  .object({
    action: z.enum(['approve', 'remove'], {
      required_error: 'Action is required',
      invalid_type_error: 'Action must be "approve" or "remove"',
    }),
    imageId: z.number().int().positive().optional(),
    imageIds: z.array(z.number().int().positive()).optional(),
    moderationNotes: z.string().optional(),
  })
  .refine((data) => data.imageId || (data.imageIds && data.imageIds.length > 0), {
    message: 'Either imageId or imageIds array is required',
  });
