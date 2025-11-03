/**
 * @file path.js
 * @description Path data validation schemas using Zod.
 * This module provides comprehensive Zod schemas for validating path data throughout
 * the City Art Walks application. Includes schemas for creating, updating, querying, and
 * filtering path data with proper type safety and validation rules.
 *
 * Paths represent walking or cycling routes that connect multiple art pieces with metadata
 * including difficulty, distance, and geographic information.
 *
 * @namespace CityArtWalks.Validators.Path
 * @version 1.1.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Model} - Path model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Path} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for path data validation
 *
 * Defines the complete data structure for path entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Path
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Path} - Database schema reference
 */
export const pathSchema = z.object({
  pathId: z.number().int().optional(),
  stateId: z.number().int().min(1).default(37),
  cityId: z.number().int().min(1).default(64),
  countryId: z.number().int().min(1).default(186),
  title: z.string().min(2, 'Title is required').max(100),
  description: z.string().max(500).nullable(),
  imageUrl: z.string().url().nullable(),
  status: z
    .enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW'], {
      errorMap: () => ({ message: 'Invalid status' }),
    })
    .default('ACTIVE'),
  distance: z.number().min(0).nullable(),
  featured: z.boolean().default(false),
  pathType: z.enum(['WALKING', 'BICYCLE', 'DRIVING', 'DRIVING_TRAFFIC']),
  mapType: z.string().min(2).max(100),
  zoom: z.number().min(0).default(10),
  startPieceId: z.number().int().min(1),
  endPieceId: z.number().int().min(1),
  viewCount: z.number().min(0).default(0),
  slug: z.string().min(2).max(100).nullable(),
  staticMapUrl: z.string().url().nullable(),
  weight: z.number().min(0).nullable(),
  duration: z.number().min(0).nullable(),
  weightName: z.string().max(100).nullable(),
  createdBy: z.number().int().optional(),
  updatedBy: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Schema for creating new path records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.Path
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createPathSchema = pathSchema.omit({
  pathId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing path records
 *
 * Makes all fields optional except ID, allowing partial updates.
 * Used by PUT API routes.
 *
 * @memberof CityArtWalks.Validators.Path
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updatePathSchema = createPathSchema.partial();

/**
 * Schema for path query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.Path
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const pathQuerySchema = z.object({
  // Pagination parameters (REQUIRED for all entities)
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),

  // Search parameter (REQUIRED for all entities)
  search: z.string().optional(),

  // Standard filters
  status: z.enum(['DELETED', 'ACTIVE', 'ARCHIVED', 'REVIEW']).optional(),
  featured: z.enum(['true', 'false']).optional(),
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

  // Sort parameters (REQUIRED for all entities)
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),

  // Geographic filters
  cityId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  stateId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),
  countryId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (typeof val === 'string') return val ? parseInt(val, 10) : undefined;
      return val;
    }),

  // Path-specific filters
  pathType: z.enum(['WALKING', 'BICYCLE', 'DRIVING', 'DRIVING_TRAFFIC']).optional(),
  title: z.string().optional(),
});

/**
 * Gets default values for Path forms and initialization
 *
 * Provides sensible defaults for creating new path records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.Path
 * @function getPathDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Path} - Database schema defaults
 */
export function getPathDefaultValues() {
  return {
    stateId: 37,
    cityId: 64,
    countryId: 186,
    title: '',
    description: null,
    imageUrl: null,
    status: 'ACTIVE',
    distance: null,
    featured: false,
    pathType: 'WALKING',
    mapType: '',
    zoom: 10,
    startPieceId: null,
    endPieceId: null,
    viewCount: 0,
    slug: null,
    staticMapUrl: null,
    weight: null,
    duration: null,
    weightName: null,
  };
}
