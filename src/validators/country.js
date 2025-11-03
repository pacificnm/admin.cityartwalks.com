/**
 * @file country.js
 * @description Country data validation schemas using Zod.
 * This module provides comprehensive Zod schemas for validating country data throughout
 * the City Art Walks application. It includes schemas for creating, updating, querying,
 * and filtering country data with proper type safety and validation rules.
 *
 * Countries represent geographic nations and serve as the top-level geographic entities
 * in the system hierarchy (Country > State > City). Each country has geographic data,
 * status information, and relationships to states, cities, artists, art pieces, and paths.
 *
 * @namespace CityArtWalks.Validators.Country
 * @version 2.1.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Country}
 * @see {@link https://zod.dev/}
 */

import { z } from 'zod';

/**
 * Base Zod schema for country data validation
 *
 * Defines the complete data structure for country entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Country
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Country}
 */
export const countrySchema = z.object({
  countryId: z.number().int().positive().optional(),
  name: z
    .string()
    .min(1, 'Country name is required')
    .max(255, 'Country name must be less than 255 characters'),
  slug: z
    .string()
    .min(1, 'Country slug is required')
    .max(255, 'Country slug must be less than 255 characters'),
  code: z
    .string()
    .min(2, 'Country code must be at least 2 characters')
    .max(3, 'Country code must be at most 3 characters'),
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
  active: z.boolean().optional(),
  imageUrl: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return val;
  }, z.string().url('Invalid image URL format').nullable().optional()),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Schema for creating new country records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.Country
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST}
 */
export const createCountrySchema = countrySchema.omit({
  countryId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing country records
 *
 * Makes all fields optional except ID, allowing partial updates.
 * Used by PUT API routes.
 *
 * @memberof CityArtWalks.Validators.Country
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT}
 */
export const updateCountrySchema = createCountrySchema.partial();

/**
 * Schema for country query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * Accepts both string ('true'/'false') and boolean for active/featured.
 *
 * @memberof CityArtWalks.Validators.Country
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET}
 */
export const countryQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  // Accept both string and boolean for active/featured
  active: z
    .union([z.enum(['true', 'false']), z.boolean()])
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    }),
  featured: z
    .union([z.enum(['true', 'false']), z.boolean()])
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    }),
  continent: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  stateId: z.string().optional(),
  cityId: z.string().optional(),
  artistId: z.string().optional(),
  artPieceId: z.string().optional(),
  pathId: z.string().optional(),
  minLatitude: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  maxLatitude: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  minLongitude: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  maxLongitude: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  code: z.string().optional(),
  hasStates: z
    .union([z.enum(['true', 'false']), z.boolean()])
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    }),
  hasCities: z
    .union([z.enum(['true', 'false']), z.boolean()])
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    }),
  hasArtPieces: z
    .union([z.enum(['true', 'false']), z.boolean()])
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (typeof val === 'boolean') return val;
      return undefined;
    }),
});

/**
 * Gets default values for Country forms and initialization
 *
 * Provides sensible defaults for creating new country records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.Country
 * @function getCountryDefaultValues
 * @param {Object} [currentCountry] - Existing country data for editing
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Country}
 */
export function getCountryDefaultValues(currentCountry = null) {
  if (currentCountry) {
    // Return existing country data for editing
    return {
      countryId: currentCountry.countryId || null,
      name: currentCountry.name || '',
      slug: currentCountry.slug || '',
      code: currentCountry.code || '',
      latitude: currentCountry.latitude ?? '', // Convert null to empty string for forms
      longitude: currentCountry.longitude ?? '', // Convert null to empty string for forms
      active: currentCountry.active || false,
      imageUrl: currentCountry.imageUrl || '', // Convert null to empty string for forms
      createdBy: currentCountry.createdBy || null,
      updatedBy: currentCountry.updatedBy || null,
      createdAt: currentCountry.createdAt || null,
      updatedAt: currentCountry.updatedAt || null,
    };
  }

  // Return empty defaults for new country creation
  return {
    name: '',
    slug: '',
    code: '',
    latitude: '', // Empty string instead of null for forms
    longitude: '', // Empty string instead of null for forms
    active: false,
    imageUrl: '', // Empty string instead of null for forms
    createdBy: null,
    updatedBy: null,
  };
}
