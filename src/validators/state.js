/**
 * @file state.js
 * @description Zod validation schemas for State data operations used across City Art Walks.
 * Provides create, update, and query schemas with coercion, transforms, and sensible defaults
 * for form handling and API routes. Ensures consistent validation for State model fields
 * including geographic coordinates, status flags, and relational IDs.
 * @namespace CityArtWalks.Validators.State
 * @version 1.1.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
 * @see {@link https://zod.dev/}
 */
import { z } from 'zod';

/**
 * Base Zod schema for State data validation
 *
 * Defines the complete data structure for State entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.State
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
 */
export const stateSchema = z.object({
  stateId: z.number().int().positive().optional(),
  name: z
    .string()
    .min(1, 'State name is required')
    .max(255, 'State name must be less than 255 characters'),
  abbreviation: z
    .string()
    .min(2, 'Abbreviation must be at least 2 characters')
    .max(10, 'Abbreviation must be less than 10 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be less than 255 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, alphanumeric, and may include hyphens'),
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
  countryId: z.coerce.number().int().positive(),
  imageUrl: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return null;
    return val;
  }, z.string().url('Invalid image URL format').nullable().optional()),
  lastScan: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.coerce.number().int().positive().nullable().optional(),
  updatedBy: z.coerce.number().int().positive().nullable().optional(),
});

/**
 * Schema for creating new State records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.State
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST}
 */
export const createStateSchema = stateSchema.omit({
  stateId: true,
  createdAt: true,
  updatedAt: true,
  lastScan: true,
});

/**
 * Schema for updating existing State records
 *
 * Makes all fields optional except auto-generated ones, allowing partial updates.
 * Used by PUT API routes.
 *
 * @memberof CityArtWalks.Validators.State
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT}
 */
export const updateStateSchema = stateSchema
  .omit({
    stateId: true,
    createdAt: true,
    updatedAt: true, // API route adds this automatically
    createdBy: true, // Don't allow updating who created it
  })
  .partial();

/**
 * Schema for State query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * Handles both string and number inputs for pagination parameters since they
 * can come from different sources (URL query strings vs direct API calls).
 *
 * @memberof CityArtWalks.Validators.State
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET}
 */
export const stateQuerySchema = z.object({
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
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Gets default values for State forms and initialization
 *
 * Provides sensible defaults for creating new State records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.State
 * @function getStateDefaultValues
 * @param {Object} [currentState] - Existing state data for editing
 * @returns {Object} Default values object matching create schema
 */
export function getStateDefaultValues(currentState = null) {
  if (currentState) {
    // Return existing state data for editing
    return {
      stateId: currentState.stateId || null,
      name: currentState.name || '',
      abbreviation: currentState.abbreviation || '',
      slug: currentState.slug || '',
      latitude: currentState.latitude ?? '', // Convert null to empty string for forms
      longitude: currentState.longitude ?? '', // Convert null to empty string for forms
      active: currentState.active || false,
      countryId: currentState.countryId || null,
      imageUrl: currentState.imageUrl || '', // Convert null to empty string for forms
      createdBy: currentState.createdBy || null,
      updatedBy: currentState.updatedBy || null,
      createdAt: currentState.createdAt || null,
      updatedAt: currentState.updatedAt || null,
    };
  }

  // Return empty defaults for new state creation
  return {
    name: '',
    abbreviation: '',
    slug: '',
    latitude: '', // Empty string instead of null for forms
    longitude: '', // Empty string instead of null for forms
    active: false,
    countryId: null,
    imageUrl: '', // Empty string instead of null for forms
    createdBy: null,
    updatedBy: null,
  };
}
