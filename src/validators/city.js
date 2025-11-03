import { z } from 'zod';

import { sanitizeText } from 'src/lib/sanitize';
/**
 * @file city.js
 * @description Zod schemas and helpers for City entity validation — create, update, query, and list operations.
 * @namespace CityArtWalks.Validators.City
 * @version 0.3.0
 * @author Jaimie
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 */

/**
 * Base Zod schema for City entity
 *
 * Defines the complete data structure and validation rules for City objects used
 * across create/update/query APIs.
 * @memberof CityArtWalks.Validators.City
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City}
 */
export const citySchema = z.object({
  cityId: z.number().int().positive().optional(),
  name: z
    .string()
    .min(1, 'City name is required')
    .max(255, 'City name must be less than 255 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be less than 255 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, alphanumeric, and may include hyphens'),
  stateId: z.number().int().positive('State ID is required'),
  latitude: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  }, z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').nullable().optional()),
  longitude: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  }, z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').nullable().optional()),
  active: z.coerce.boolean().optional(),
  countryId: z.coerce.number().int().positive().optional(),
  imageUrl: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return val;
  }, z.string().url('Invalid image URL format').nullable().optional()),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.coerce.number().int().positive().nullable().optional(),
  updatedBy: z.coerce.number().int().positive().nullable().optional(),
});

/**
 * Schema for creating new City records
 *
 * Excludes auto-generated fields (ID, timestamps, audit fields) for creation operations.
 * Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.City
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createCitySchema = citySchema.omit({
  cityId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

/**
 * Schema for updating existing City records
 *
 * Allows partial updates, but excludes auto-generated and audit fields.
 * Used by PUT/PATCH API routes.
 *
 * @memberof CityArtWalks.Validators.City
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateCitySchema = citySchema
  .omit({
    cityId: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
  })
  .partial();

/**
 * Schema for City query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional and coerced to appropriate types.
 *
 * @memberof CityArtWalks.Validators.City
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const cityQuerySchema = z.object({
  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null) return 1;
      const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }),
  limit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null) return 10;
      const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(parsed) || parsed < 1 || parsed > 5000 ? 10 : parsed;
    }),
  search: z.string().optional(),
  active: z
    .union([z.string(), z.boolean(), z.enum(['true', 'false'])])
    .optional()
    .transform((val) => {
      if (val === 'true' || val === true) return true;
      if (val === 'false' || val === false) return false;
      return undefined;
    }),
  stateId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(parsed) ? undefined : parsed;
    }),
  countryId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(parsed) ? undefined : parsed;
    }),
  createdBy: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(parsed) ? undefined : parsed;
    }),
  updatedBy: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      const parsed = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(parsed) ? undefined : parsed;
    }),
  slug: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      return sanitizeText(val);
    }),
  createdAt: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      return val;
    }),
  updatedAt: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return undefined;
      return val;
    }),
  sortBy: z
    .enum(['name', 'slug', 'active', 'createdAt', 'updatedAt', 'stateId', 'countryId'])
    .optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Gets default values for City forms and initialization
 *
 * Provides sensible defaults for creating or editing city records.
 * If a city object is provided, returns its values for editing.
 * Otherwise, returns defaults for new city creation.
 *
 * @memberof CityArtWalks.Validators.City
 * @function getCityDefaultValues
 * @param {Object|null} currentCity - Existing city object for edit mode, or null for creation
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City}
 */
export function getCityDefaultValues(currentCity = null) {
  if (currentCity) {
    // Return existing city data for editing
    return {
      cityId: currentCity.cityId || null,
      name: currentCity.name || '',
      stateId: currentCity.stateId || null,
      active: currentCity.active ?? false,
      imageUrl: currentCity.imageUrl || '', // Convert null to empty string for forms
      slug: currentCity.slug || '',
      latitude: currentCity.latitude ?? '', // Convert null to empty string for forms
      longitude: currentCity.longitude ?? '', // Convert null to empty string for forms
      countryId: currentCity.countryId || null,
      createdBy: currentCity.createdBy || null,
      updatedBy: currentCity.updatedBy || null,
      createdAt: currentCity.createdAt || null,
      updatedAt: currentCity.updatedAt || null,
    };
  }

  // Return empty defaults for new city creation
  return {
    name: '',
    stateId: null,
    active: false,
    imageUrl: '', // Empty string instead of null for forms
    slug: '',
    latitude: '', // Empty string instead of null for forms
    longitude: '', // Empty string instead of null for forms
    countryId: null,
    createdBy: null,
    updatedBy: null,
  };
}
