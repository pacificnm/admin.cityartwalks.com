/**
 * @file verification-log.js
 * @description Zod schemas and helpers for VerificationLog — validation of verification event records and helpers for form defaults.
 * @namespace CityArtWalks.Validators.VerificationLog
 * @version 1.0.0
 * @author Jaimie
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/VerificationLog-Model} - VerificationLog model docs
 */
import { z } from 'zod';

export const verificationLogSchema = z.object({
  verificationLogId: z.number().int().positive(),
  artPieceQueueId: z.number().int().positive(),
  action: z.enum(
    [
      'APPROVED',
      'REJECTED',
      'EDITED',
      'PUBLISHED',
      'FLAGGED',
      'REVIEWED',
      'AI_PROCESSED',
      'MANUAL_OVERRIDE',
    ],
    {
      errorMap: () => ({ message: 'Invalid verification action' }),
    }
  ),
  changes: z.any().nullable().optional(),
  notes: z.string().nullable().optional(),
  previousData: z.any().nullable().optional(),
  newData: z.any().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.number().int().positive(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Schema for creating new verification log records
 *
 * Excludes auto-generated fields (ID, timestamps) and makes certain fields optional
 * for creation operations. Used by POST API routes.
 *
 * @memberof CityArtWalks.Validators.VerificationLog
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-POST} - POST route documentation
 */
export const createVerificationLogSchema = verificationLogSchema.omit({
  verificationLogId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for verification log query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.VerificationLog
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const verificationLogQuerySchema = z.object({
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
  verificationLogId: z.number().int().positive().optional(),
  artPieceQueueId: z.number().int().positive().optional(),

  // Search parameter
  search: z.string().optional(),

  // Standard filters
  action: z
    .enum([
      'APPROVED',
      'REJECTED',
      'EDITED',
      'PUBLISHED',
      'FLAGGED',
      'REVIEWED',
      'AI_PROCESSED',
      'MANUAL_OVERRIDE',
    ])
    .optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  // Sort parameters
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),

  // Entity-specific filters
  hasChanges: z.enum(['true', 'false']).optional(),
  hasNotes: z.enum(['true', 'false']).optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
});

/**
 * Gets default values for VerificationLog forms and initialization
 *
 * Provides sensible defaults for creating new verification log records and
 * initializing forms. Based on database schema defaults and business rules.
 *
 * @memberof CityArtWalks.Validators.VerificationLog
 * @function getVerificationLogDefaultValues
 * @returns {Object} Default values object matching create schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#VerificationLog} - Database schema defaults
 */
export function getVerificationLogDefaultValues() {
  return {
    artPieceQueueId: null,
    action: 'REVIEWED',
    changes: null,
    notes: null,
    previousData: null,
    newData: null,
    createdBy: null,
    updatedBy: null,
  };
}
