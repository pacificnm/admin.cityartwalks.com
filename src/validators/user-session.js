/**
 * @file user-session.js
 * @description Zod validation schemas and helpers for UserSession — create, update, query, and operational schemas used by session management.
 * @namespace CityArtWalks.Validators.UserSession
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Session-Model} - UserSession database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Session-Validator} - UserSession validator documentation
 */
import { z } from 'zod';

/**
 * Zod schema for UserSession entity (base)
 * @memberof CityArtWalks.Validators.UserSession
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Session-Model}
 */
export const userSessionSchema = z.object({
  id: z.string().optional(),
  userId: z.number().int().positive('User ID must be a positive integer'),
  ipAddress: z.string().ip('Invalid IP address format').optional(),
  userAgent: z.string().max(500, 'User agent must be less than 500 characters').optional(),
  loginLocation: z.string().max(100, 'Login location must be less than 100 characters').optional(),
  deviceInfo: z.string().max(200, 'Device info must be less than 200 characters').optional(),
  expiresAt: z.coerce
    .date()
    .refine((date) => date > new Date(), 'Expiration date must be in the future')
    .optional(),
  isActive: z.boolean().optional().default(true),
  lastActivityAt: z.coerce.date().optional(),
  revokedAt: z.coerce.date().optional(),
  revokedBy: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating a UserSession entity
 * @memberof CityArtWalks.Validators.UserSession
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Session-Validator}
 */
export const createUserSessionSchema = userSessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating a UserSession entity (partial fields)
 * @memberof CityArtWalks.Validators.UserSession
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Session-Validator}
 */
export const updateUserSessionSchema = userSessionSchema.partial();

/**
 * @memberof CityArtWalks.Validators.UserSession
 * @description Schema for updating an existing user session
 */

/**
 * Zod schema for querying UserSession entities (filter, sort, pagination)
 * @memberof CityArtWalks.Validators.UserSession
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const userSessionQuerySchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').optional().default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),
  userId: z.number().int().positive('User ID must be a positive integer').optional(),
  isActive: z.boolean().optional(),
  includeExpired: z.boolean().optional().default(false),
  includeRevoked: z.boolean().optional().default(false),
  search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
});

/**
 * Zod schema for session ID parameter validation
 * @memberof CityArtWalks.Validators.UserSession
 */
export const sessionIdSchema = z.object({
  id: z.string().min(1, 'Session ID is required'),
});

/**
 * Zod schema for user ID parameter validation (handles string to number conversion)
 * @memberof CityArtWalks.Validators.UserSession
 */
export const userIdSchema = z.object({
  userId: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new Error('User ID must be a positive integer');
    }
    return num;
  }),
});

/**
 * Zod schema for admin session revocation
 * @memberof CityArtWalks.Validators.UserSession
 */
export const revokeSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  reason: z.string().max(200, 'Reason must be less than 200 characters').optional(),
});

/**
 * Zod schema for bulk session operations
 * @memberof CityArtWalks.Validators.UserSession
 */
export const bulkSessionOperationSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  operation: z.enum(['revoke', 'expire', 'cleanup'], 'Invalid operation type'),
  reason: z.string().max(200, 'Reason must be less than 200 characters').optional(),
});

/**
 * Returns default values for UserSession forms
 * @memberof CityArtWalks.Validators.UserSession
 * @function defaultUserSessionValues
 * @param {object} [session] - Optional UserSession object to populate defaults
 * @returns {object} Default values for UserSession form fields
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Session-Validator}
 */
export function defaultUserSessionValues(session) {
  return {
    id: session?.id ?? null,
    userId: session?.userId ?? null,
    ipAddress: session?.ipAddress ?? '',
    userAgent: session?.userAgent ?? '',
    loginLocation: session?.loginLocation ?? '',
    deviceInfo: session?.deviceInfo ?? '',
    expiresAt: session?.expiresAt ?? null,
    isActive: session?.isActive ?? true,
    lastActivityAt: session?.lastActivityAt ?? null,
    revokedAt: session?.revokedAt ?? null,
    revokedBy: session?.revokedBy ?? '',
    createdAt: session?.createdAt ?? null,
    updatedAt: session?.updatedAt ?? null,
  };
}

/**
 * Validation helper function with custom error formatting
 * @memberof CityArtWalks.Validators.UserSession
 * @param {object} schema - Zod schema to validate against
 * @param {object} data - Data to validate
 * @returns {object} Validation result with success/error status
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Session-Validator}
 */
export function validateUserSessionData(schema, data) {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return {
      success: false,
      errors: formattedErrors,
      message: 'Validation failed',
    };
  }
}
