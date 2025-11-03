/**
 * @file art-piece-queue.js
 * @description Zod validation schemas for ArtPieceQueue data: create, update, query, and filter validations
 * used across the City Art Walks application. Includes helpers for default values and form sanitization.
 * @namespace CityArtWalks.Validators.ArtPieceQueue
 * @version 1.0.0
 * @author Generated
 * @requires {@link https://zod.dev/} z - Zod schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue-Model} - ArtPieceQueue model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 */
import { z } from 'zod';

/**
 * Base Zod schema for art piece queue data validation
 *
 * Defines the complete data structure for art piece queue entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.ArtPieceQueue
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 */
export const artPieceQueueSchema = z.object({
  artPieceQueueId: z.number().int().positive(),
  title: z.string().nullable().optional(),
  artistName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  latitude: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === '') return null;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? null : num;
    }),
  longitude: z
    .union([z.string(), z.number()])
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === undefined || val === '') return null;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? null : num;
    }),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  countryId: z.number().int().positive().nullable().optional(),
  stateId: z.number().int().positive().nullable().optional(),
  cityId: z.number().int().positive().nullable().optional(),
  artistId: z
    .union([z.number().int().positive(), z.string()])
    .nullable()
    .optional()
    .transform((val) => {
      if (val === '' || val === null || val === undefined) return null;
      return typeof val === 'string' ? parseInt(val, 10) || null : val;
    }),
  artPieceId: z.number().int().positive().nullable().optional(),
  creationDate: z.coerce.date().nullable().optional(),
  installationDate: z.coerce.date().nullable().optional(),
  medium: z.string().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  artPieceMaterial: z.any().nullable().optional(),
  artPieceType: z.any().nullable().optional(),
  artPieceTag: z.any().nullable().optional(),
  imageUrls: z.any().nullable().optional(),
  sourceUrl: z.string().url('Invalid source URL'),
  extractedData: z.any().nullable().optional(),
  status: z
    .enum(['PENDING', 'APPROVED', 'REVIEWING', 'REJECTED', 'PUBLISHED', 'PROCESSING', 'ERROR'], {
      errorMap: () => ({ message: 'Invalid art piece queue status' }),
    })
    .default('PENDING'),
  verificationNotes: z.string().nullable().optional(),
  harvestBatchId: z.number().int().positive().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
  verifiedBy: z.number().int().positive().nullable().optional(),
  verifiedAt: z.coerce.date().nullable().optional(),
});

/**
 * Schema for creating new art piece queue records
 *
 * Excludes auto-generated fields (ID, timestamps) and relation fields that should be handled separately.
 * Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.ArtPieceQueue
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createArtPieceQueueSchema = artPieceQueueSchema.omit({
  artPieceQueueId: true,
  createdAt: true,
  updatedAt: true,
  harvestBatchId: true, // This is handled through HarvestBatch relation
});

/**
 * Schema for updating existing art piece queue records
 *
 * Makes all fields optional for partial updates, including sourceUrl.
 * Used by PUT API routes.
 *
 * @memberof CityArtWalks.Validators.ArtPieceQueue
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateArtPieceQueueSchema = artPieceQueueSchema
  .omit({
    artPieceQueueId: true,
    createdAt: true,
    updatedAt: true,
    harvestBatchId: true,
  })
  .partial();

/**
 * Schema for art piece queue query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.ArtPieceQueue
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const artPieceQueueQuerySchema = z.object({
  // Pagination parameters
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  skip: z.number().optional().default(0),
  take: z.number().optional().default(10),

  // ID parameters
  artPieceQueueId: z.number().int().positive().optional(),

  // Search parameter
  search: z.string().optional(),

  // Standard filters - status can be actual status enum or "all" for no filtering
  status: z
    .enum([
      'all',
      'PENDING',
      'APPROVED',
      'REVIEWING',
      'REJECTED',
      'PUBLISHED',
      'PROCESSING',
      'ERROR',
    ])
    .optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  // Sort parameters
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),

  // Entity-specific filters
  harvestBatchId: z.string().optional(),
  artistName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  hasCoordinates: z.enum(['true', 'false']).optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
});

/**
 * Gets default values for ArtPieceQueue forms and initialization
 *
 * Provides sensible defaults for creating new art piece queue records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.ArtPieceQueue
 * @function getArtPieceQueueDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema defaults
 */
export function getArtPieceQueueDefaultValues() {
  return {
    title: '',
    artistName: '',
    description: '',
    latitude: '',
    longitude: '',
    address: '',
    city: '',
    state: '',
    country: '',
    countryId: null,
    stateId: null,
    cityId: null,
    artistId: null,
    creationDate: null,
    installationDate: null,
    medium: '',
    dimensions: '',
    artPieceMaterial: [],
    artPieceTag: [],
    artPieceType: '',
    imageUrls: [],
    sourceUrl: '',
    extractedData: null,
    status: 'PENDING',
    verificationNotes: '',
    createdBy: null,
    updatedBy: null,
  };
}

/**
 * Sanitizes and provides default values for ArtPieceQueue forms, similar to other form patterns
 *
 * Takes current art piece queue data and provides sanitized default values for forms,
 * handling null/undefined values and ensuring proper data types.
 *
 * @memberof CityArtWalks.Validators.ArtPieceQueue
 * @function defaultArtPieceQueueValues
 * @param {Object|null} currentArtPieceQueue - Current art piece queue data for editing
 * @returns {Object} Sanitized default values object for forms
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 */
export function defaultArtPieceQueueValues(currentArtPieceQueue = null) {
  if (!currentArtPieceQueue) {
    return getArtPieceQueueDefaultValues();
  }

  return {
    artPieceQueueId: currentArtPieceQueue.artPieceQueueId || null,
    title: currentArtPieceQueue.title || '',
    artistName: currentArtPieceQueue.artistName || '',
    description: currentArtPieceQueue.description || '',
    latitude: currentArtPieceQueue.latitude?.toString() || '',
    longitude: currentArtPieceQueue.longitude?.toString() || '',
    address: currentArtPieceQueue.address || '',
    city: currentArtPieceQueue.city || '',
    state: currentArtPieceQueue.state || '',
    country: currentArtPieceQueue.country || '',
    countryId: currentArtPieceQueue.countryId ? parseInt(currentArtPieceQueue.countryId, 10) : null,
    stateId: currentArtPieceQueue.stateId ? parseInt(currentArtPieceQueue.stateId, 10) : null,
    cityId: currentArtPieceQueue.cityId ? parseInt(currentArtPieceQueue.cityId, 10) : null,
    artistId: currentArtPieceQueue.artistId ? parseInt(currentArtPieceQueue.artistId, 10) : null,
    creationDate: currentArtPieceQueue.creationDate || null,
    installationDate: currentArtPieceQueue.installationDate || null,
    medium: currentArtPieceQueue.medium || '',
    dimensions: currentArtPieceQueue.dimensions || '',
    artPieceMaterial: Array.isArray(currentArtPieceQueue.artPieceMaterial)
      ? currentArtPieceQueue.artPieceMaterial.map((item) =>
          typeof item === 'string' ? item : item?.name || String(item)
        )
      : [],
    artPieceTag: Array.isArray(currentArtPieceQueue.artPieceTag)
      ? currentArtPieceQueue.artPieceTag.map((item) =>
          typeof item === 'string' ? item : item?.name || String(item)
        )
      : [],
    artPieceType:
      typeof currentArtPieceQueue.artPieceType === 'string'
        ? currentArtPieceQueue.artPieceType
        : currentArtPieceQueue.artPieceType?.name || '',
    imageUrls: currentArtPieceQueue.imageUrls || [],
    sourceUrl: currentArtPieceQueue.sourceUrl || '',
    extractedData: currentArtPieceQueue.extractedData || null,
    status: currentArtPieceQueue.status || 'PENDING',
    verificationNotes: currentArtPieceQueue.verificationNotes || '',
    createdAt: currentArtPieceQueue.createdAt || null,
    updatedAt: currentArtPieceQueue.updatedAt || null,
    createdBy: currentArtPieceQueue.createdBy ? parseInt(currentArtPieceQueue.createdBy, 10) : null,
    updatedBy: currentArtPieceQueue.updatedBy ? parseInt(currentArtPieceQueue.updatedBy, 10) : null,
  };
}
