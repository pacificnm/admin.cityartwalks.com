/**
 * @file artist.js
 * @description Zod validation schemas, query schemas, and form defaults for Artist entities.
 * Provides create/update schemas, query parameter validation, and helpers for default values
 * used across the City Art Walks application.
 * @namespace CityArtWalks.Validators.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} z - Zod schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Artist} - Database schema reference
 */
import { z } from 'zod';

/**
 * Base Zod schema for artist data validation
 *
 * Defines the complete data structure for artist entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Artist
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Artist} - Database schema reference
 */
export const artistSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  artistId: z.number().int().optional(),

  // Required string fields
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),

  // Optional string fields
  nationality: z.string().nullable().optional(),
  biography: z.string().nullable().optional(),
  website: z
    .union([z.string().url('Invalid website URL'), z.literal(''), z.null()])
    .nullable()
    .optional(),
  imageUrl: z
    .union([z.string().url('Invalid image URL'), z.literal(''), z.null()])
    .nullable()
    .optional(),
  facebook: z
    .union([z.string().url('Invalid Facebook URL'), z.literal(''), z.null()])
    .nullable()
    .optional(),
  instagram: z
    .union([z.string().url('Invalid Instagram URL'), z.literal(''), z.null()])
    .nullable()
    .optional(),
  staticMapUrl: z
    .union([z.string().url('Invalid static map URL'), z.literal(''), z.null()])
    .nullable()
    .optional(),
  slug: z.string().min(1, 'Slug is required'),

  // Numeric fields
  viewCount: z.number().int().min(0).default(0),

  // Boolean fields
  featured: z.boolean().default(false),

  // Enum fields
  status: z
    .enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW', 'BANNED', 'REJECTED', 'PENDING', 'FLAGGED'])
    .default('ACTIVE'),

  // Date fields
  birthDate: z.coerce.date().nullable().optional(),
  deathDate: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  // User tracking fields
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),

  // Foreign key fields (nullable)
  cityId: z.number().int().nullable().optional(),
  countryId: z.number().int().nullable().optional(),
  stateId: z.number().int().nullable().optional(),

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
 * Zod schema for creating new artist entries
 *
 * Excludes auto-generated fields (ID, timestamps, view count) and audit fields
 * that should be handled by the API.
 *
 * @memberof CityArtWalks.Validators.Artist
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist model documentation
 */
export const createArtistSchema = artistSchema.omit({
  artistId: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true, // System managed
  createdBy: true, // Set by API
  updatedBy: true, // Set by API
});

/**
 * Zod schema for updating existing artist entries
 *
 * Allows partial updates by making all fields optional. Used for PATCH operations
 * where only specific fields need to be updated.
 *
 * @memberof CityArtWalks.Validators.Artist
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist model documentation
 */
export const updateArtistSchema = artistSchema.partial();

/**
 * Returns default artist values for form initialization and data consistency
 *
 * Provides consistent default values for all artist fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for artist operations.
 *
 * @function defaultArtistValues
 * @memberof CityArtWalks.Validators.Artist
 * @param {Object} [artist] - Partial artist object (may be incomplete)
 * @returns {Object} Complete artist object with all default fields populated
 *
 * @example
 * // Create defaults for new artist entry
 * const defaults = defaultArtistValues();
 *
 * // Merge with existing partial data
 * const artistData = defaultArtistValues({
 *   name: 'Jane Doe',
 *   featured: true
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist model documentation
 */
export function defaultArtistValues(artist) {
  return {
    artistId: artist?.artistId ?? undefined,
    name: artist?.name ?? '',
    nationality: artist?.nationality ?? null,
    biography: artist?.biography ?? null,
    website: artist?.website ?? null,
    imageUrl: artist?.imageUrl ?? null,
    facebook: artist?.facebook ?? null,
    instagram: artist?.instagram ?? null,
    staticMapUrl: artist?.staticMapUrl ?? null,
    slug: artist?.slug ?? '',
    viewCount: artist?.viewCount ?? 0,
    featured: artist?.featured ?? false,
    status: artist?.status ?? 'ACTIVE',
    birthDate: artist?.birthDate ?? null,
    deathDate: artist?.deathDate ?? null,
    createdAt: artist?.createdAt ?? undefined,
    updatedAt: artist?.updatedAt ?? undefined,
    createdBy: artist?.createdBy ?? null,
    updatedBy: artist?.updatedBy ?? null,
    cityId: artist?.cityId ?? null,
    countryId: artist?.countryId ?? null,
    stateId: artist?.stateId ?? null,
    metaTitle: artist?.metaTitle ?? null,
    metaDescription: artist?.metaDescription ?? null,
    metaKeywords: artist?.metaKeywords ?? null,
  };
}

/**
 * Get default values for creating new artists (excludes system fields)
 *
 * @memberof CityArtWalks.Validators.Artist
 * @function getCreateArtistDefaults
 * @returns {Object} Default values object for create operations
 */
export function getCreateArtistDefaults() {
  return {
    name: '',
    nationality: null,
    biography: null,
    website: null,
    imageUrl: null,
    facebook: null,
    instagram: null,
    staticMapUrl: null,
    slug: '',
    featured: false,
    status: 'ACTIVE',
    birthDate: null,
    deathDate: null,
    cityId: null,
    countryId: null,
    stateId: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
  };
}

/**
 * Zod schema for validating artist query parameters
 *
 * Handles pagination, filtering, and sorting parameters for artist API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options.
 *
 * @memberof CityArtWalks.Validators.Artist
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist model documentation
 */
export const artistQuerySchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z
    .enum(['ACTIVE', 'ARCHIVED', 'BANNED', 'DELETED', 'PENDING', 'REJECTED', 'REVIEW'])
    .optional(),
  userId: z.number().int().optional(),
  cityId: z.number().int().optional(),
  countryId: z.number().int().optional(),
  stateId: z.number().int().optional(),
  featured: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.number().int().optional(),
  updatedBy: z.number().int().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'viewCount', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
