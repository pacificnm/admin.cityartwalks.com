/**
 * @file artist-location.js
 * @description Zod validation schemas and response/query schemas for Artist Location entities.
 * Provides create/update/query schemas, array and response shapes, and pagination helpers for
 * artist location data used throughout the City Art Walks application.
 * @namespace CityArtWalks.Validators.ArtistLocation
 * @version 1.0.0
 * @author GitHub Copilot
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Location-Model} - Artist Location model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtistLocation} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for artist location data validation
 *
 * Defines the complete data structure for artist location entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.ArtistLocation
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtistLocation} - Database schema reference
 */
export const artistLocationSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  artistLocationId: z.number().int().optional(),

  // Required foreign key fields
  artistId: z.number().int({ required_error: 'Artist ID is required' }),
  countryId: z.number().int({ required_error: 'Country ID is required' }),

  // Optional foreign key fields
  stateId: z.number().int().nullable().optional(),
  cityId: z.number().int().nullable().optional(),

  // Boolean fields with defaults
  primary: z.boolean().default(false),
  active: z.boolean().default(true),

  // Optional string fields
  source: z.string().max(255, 'Source too long').nullable().optional(),

  // Audit fields
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.number().int().nullable().optional(),
  updatedBy: z.number().int().nullable().optional(),
});

/**
 * Schema for creating new artist locations
 *
 * Validates data for creating new artist location entities. Excludes auto-generated fields
 * and enforces required field constraints for creation operations.
 *
 * @memberof CityArtWalks.Validators.ArtistLocation
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST API documentation
 */
export const createArtistLocationSchema = artistLocationSchema.omit({
  artistLocationId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing artist locations
 *
 * Validates data for updating artist location entities. Makes all fields optional
 * except for the ID field, allowing partial updates while maintaining data integrity.
 *
 * @memberof CityArtWalks.Validators.ArtistLocation
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT API documentation
 */
export const updateArtistLocationSchema = artistLocationSchema
  .omit({
    artistLocationId: true,
    createdAt: true,
    createdBy: true,
  })
  .partial();

/**
 * Schema for querying and filtering artist locations
 *
 * Validates query parameters, search filters, and pagination options for retrieving
 * artist location data. Supports both single record lookups and paginated list queries.
 *
 * @memberof CityArtWalks.Validators.ArtistLocation
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET API documentation
 */
export const artistLocationQuerySchema = z.object({
  // Single record lookup
  id: z
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'ID must be a positive number')
    .optional(),

  // Filter parameters
  artistId: z
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'Artist ID must be a positive number')
    .optional(),

  countryId: z
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'Country ID must be a positive number')
    .optional(),

  stateId: z
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'State ID must be a positive number')
    .optional(),

  cityId: z
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'City ID must be a positive number')
    .optional(),

  primary: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      return val === 'true';
    })
    .optional(),

  active: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      return val === 'true';
    })
    .optional(),

  // Search parameter
  search: z.string().min(1, 'Search term cannot be empty').optional(),

  // Pagination parameters
  page: z
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1, 'Page must be 1 or greater')
    .default(1),

  limit: z
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .default(10),

  // Sorting parameters
  sortBy: z
    .enum([
      'createdAt',
      'updatedAt',
      'artistId',
      'countryId',
      'stateId',
      'cityId',
      'primary',
      'active',
    ])
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),

  // Computed pagination helpers
  skip: z.number().int().optional(),
  take: z.number().int().optional(),
});

/**
 * Array schema for bulk operations
 *
 * Validates arrays of artist location data for bulk create or update operations.
 *
 * @memberof CityArtWalks.Validators.ArtistLocation
 * @constant {z.ZodArray}
 */
export const artistLocationArraySchema = z.array(artistLocationSchema);

/**
 * Schema for artist location response data
 *
 * Validates the structure of artist location data returned from API endpoints,
 * including related entities and computed fields.
 *
 * @memberof CityArtWalks.Validators.ArtistLocation
 * @constant {z.ZodObject}
 */
export const artistLocationResponseSchema = artistLocationSchema.extend({
  artist: z
    .object({
      artistId: z.number().int(),
      name: z.string(),
      slug: z.string(),
      status: z.string(),
    })
    .optional(),

  country: z
    .object({
      countryId: z.number().int(),
      name: z.string(),
      code: z.string(),
      slug: z.string(),
    })
    .optional(),

  state: z
    .object({
      stateId: z.number().int(),
      name: z.string(),
      abbreviation: z.string(),
      slug: z.string(),
    })
    .optional(),

  city: z
    .object({
      cityId: z.number().int(),
      name: z.string(),
      slug: z.string(),
      active: z.boolean(),
    })
    .optional(),

  createdByUser: z
    .object({
      userId: z.number().int(),
      displayName: z.string().nullable(),
      username: z.string().nullable(),
    })
    .optional(),

  updatedByUser: z
    .object({
      userId: z.number().int(),
      displayName: z.string().nullable(),
      username: z.string().nullable(),
    })
    .optional(),
});

/**
 * Paginated response schema for artist location listings
 *
 * Validates the structure of paginated artist location data returned from list endpoints.
 *
 * @memberof CityArtWalks.Validators.ArtistLocation
 * @constant {z.ZodObject}
 */
export const paginatedArtistLocationResponseSchema = z.object({
  artistLocations: z.array(artistLocationResponseSchema),
  total: z.number().int(),
  page: z.number().int().optional(),
  limit: z.number().int().optional(),
  totalPages: z.number().int().optional(),
});
