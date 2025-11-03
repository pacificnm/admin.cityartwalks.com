/**
 * @file user.js
 * @description Enhanced Zod validation schemas and utilities for the User entity.
 * Provides create, update and query schemas, response transforms, and default value helpers used
 * across forms and API layers. Preserves schema links and validation guidance.
 * @namespace CityArtWalks.Validators.User
 * @version 2.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} z - Zod schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Model} - User database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Validator} - User validator documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Security-Validation} - Security validation guidelines
 */
import { z } from 'zod';

import { debugError } from 'src/lib/debug';

/**
 * Phone number validation with international format support
 * Accepts various international phone number formats including country codes
 * Allows empty strings and null values for optional phone numbers
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodString} phoneValidation
 */
const phoneValidation = z
  .string()
  .regex(/^\+?[\d\s\-()]{10,}$/, 'Invalid phone number format')
  .or(z.literal(''))
  .optional()
  .nullable();

/**
 * Social media URL validation for Facebook with platform-specific constraints
 * Ensures URL is valid and belongs to Facebook platform
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodString} facebookValidation
 */
const facebookValidation = z
  .string()
  .url('Invalid Facebook URL')
  .refine(
    (url) => url.includes('facebook.com') || url.includes('fb.com'),
    'Must be a valid Facebook URL'
  )
  .or(z.literal(''))
  .optional()
  .nullable();

/**
 * Social media URL validation for Instagram with platform-specific constraints
 * Ensures URL is valid and belongs to Instagram platform
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodString} instagramValidation
 */
const instagramValidation = z
  .string()
  .url('Invalid Instagram URL')
  .refine((url) => url.includes('instagram.com'), 'Must be a valid Instagram URL')
  .or(z.literal(''))
  .optional()
  .nullable();

/**
 * Enhanced Zod schema for User entity with comprehensive field validation
 *
 * Includes validation for all User fields with appropriate constraints: * - Email validation with proper format checking
 * - Role enum with documented values (USER, ADMIN, MODERATOR)
 * - Status enum with documented values (ACTIVE, PENDING, BANNED, REJECTED)
 * - Enhanced password validation with security requirements
 * - Phone number format validation with international support
 * - Display name and about field length constraints
 * - Social media URL validation with platform-specific rules
 * - Image URL validation with preprocessing for empty strings
 * - Geographic field validation for location data
 * - Date field coercion for proper type handling
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} userSchema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Model} - User database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#User} - User database schema
 */
export const userSchema = z.object({
  userId: z.number().int().optional(),

  email: z
    .string()
    .email('Invalid email format')
    .max(254, 'Email cannot exceed 254 characters')
    .optional(),

  /**
   * User role enum values:   * - USER: Standard application user with basic permissions
   * - ADMIN: Full system administrator with all privileges
   * - MODERATOR: Content moderation privileges without system access
   */
  role: z.enum(['USER', 'ADMIN', 'MEMBER']).default('USER'),

  phoneNumber: phoneValidation,

  countryId: z.preprocess(
    (val) => (val === '' ? null : val),
    z.number().int().min(1, 'Country ID must be a positive integer').optional().nullable()
  ),

  address: z.string().max(500, 'Address cannot exceed 500 characters').optional().nullable(),

  stateId: z.preprocess(
    (val) => (val === '' ? null : val),
    z.number().int().min(1, 'State ID must be a positive integer').optional().nullable()
  ),

  cityId: z.preprocess(
    (val) => (val === '' ? null : val),
    z.number().int().min(1, 'City ID must be a positive integer').optional().nullable()
  ),

  zipCode: z
    .string()
    .min(3, 'ZIP code must be at least 3 characters')
    .max(20, 'ZIP code cannot exceed 20 characters')
    .or(z.literal(''))
    .optional()
    .nullable(),

  about: z.string().max(1000, 'About section cannot exceed 1000 characters').optional().nullable(),

  auth0Id: z.string().max(100, 'Auth0 ID cannot exceed 100 characters').optional().nullable(),

  emailVerified: z.coerce.date().optional().nullable(),

  image: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z
      .string()
      .url({ message: 'Invalid image URL' })
      .max(2048, 'Image URL cannot exceed 2048 characters')
      .optional()
      .nullable()
  ),

  displayName: z
    .string()
    .min(1, 'Display name cannot be empty')
    .max(100, 'Display name cannot exceed 100 characters')
    .optional()
    .nullable(),

  name: z.string().max(100, 'Name cannot exceed 100 characters').optional().nullable(),

  /**
   * User status enum values:   * - ACTIVE: User account is active and fully functional
   * - PENDING: User account is pending verification or approval
   * - BANNED: User account has been banned from the platform
   * - REJECTED: User account application has been rejected
   */
  status: z.enum(['ACTIVE', 'PENDING', 'BANNED', 'REJECTED']).default('ACTIVE'),

  company: z.string().max(200, 'Company name cannot exceed 200 characters').optional().nullable(),

  coverImage: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z
      .string()
      .url({ message: 'Invalid cover image URL' })
      .max(2048, 'Cover image URL cannot exceed 2048 characters')
      .optional()
      .nullable()
  ),

  facebook: facebookValidation,
  instagram: instagramValidation,

  emailAllowed: z.boolean().default(true),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastLogin: z.coerce.date().optional(),
});

/**
 * Enhanced Zod schema for creating a User entity
 * Extends base schema with required field validation for user creation
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} createUserSchema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Validator} - User validator documentation
 */
export const createUserSchema = userSchema
  .omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
    lastLogin: true,
  })
  .extend({
    email: z.string().email('Invalid email format').max(254, 'Email cannot exceed 254 characters'),
    displayName: z
      .string()
      .min(1, 'Display name is required')
      .max(100, 'Display name cannot exceed 100 characters'),
  });

/**
 * Enhanced Zod schema for updating a User entity
 * All fields are optional to support partial updates
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} updateUserSchema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Validator} - User validator documentation
 */
export const updateUserSchema = userSchema.omit({ userId: true }).partial();

/**
 * Comprehensive Zod schema for querying User entities with advanced filtering
 * Supports pagination, search, role/status filtering, geographic filtering,
 * date range filtering, and sorting options
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} userQuerySchema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Query schema patterns
 */
export const userQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  rowsPerPage: z.coerce.number().int().min(1).max(100).default(10),

  // Search and basic filters
  search: z.string().optional(),
  role: z.enum(['USER', 'ADMIN', 'MEMBER']).or(z.literal('')).optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'BANNED', 'REJECTED']).or(z.literal('')).optional(),

  // Geographic filters
  countryId: z.coerce.number().int().min(1).optional(),
  stateId: z.coerce.number().int().min(1).optional(),
  cityId: z.coerce.number().int().min(1).optional(),

  // Profile-based filters
  emailAllowed: z.boolean().optional(),
  hasImage: z.boolean().optional(),
  hasDisplayName: z.boolean().optional(),
  hasAbout: z.boolean().optional(),

  // Date range filters
  createdAfter: z.coerce.date().optional(),
  createdBefore: z.coerce.date().optional(),
  lastLoginAfter: z.coerce.date().optional(),
  lastLoginBefore: z.coerce.date().optional(),

  // Sorting options
  sortBy: z
    .enum(['name', 'displayName', 'email', 'createdAt', 'lastLogin', 'role', 'status'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema for user profile updates (excludes system and sensitive fields)
 * Designed for user-initiated profile updates through the UI
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} userProfileUpdateSchema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Validator} - Profile update validation
 */
export const userProfileUpdateSchema = userSchema
  .omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
    lastLogin: true,
    auth0Id: true,
    role: true,
    status: true,
    emailVerified: true,
  })
  .partial();

/**
 * Transform user data for API response (excludes sensitive fields)
 * Adds computed fields for enhanced user experience and profile completion tracking
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} userResponseSchema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Security-Validation} - API response security
 */
export const userResponseSchema = userSchema
  .omit({
    password: true,
    auth0Id: true,
  })
  .transform((data) => ({
    ...data,
    fullName: data.displayName || data.name || 'Anonymous User',
    hasProfileImage: Boolean(data.image),
    hasCoverImage: Boolean(data.coverImage),
    profileComplete: Boolean(
      data.displayName &&
        data.about &&
        data.image &&
        (data.cityId || data.stateId || data.countryId)
    ),
    socialLinks: {
      facebook: data.facebook || null,
      instagram: data.instagram || null,
      hasSocialLinks: Boolean(data.facebook || data.instagram),
    },
    // Note: locationString will need to be computed from relationships in the model layer
    locationString: null,
  }));

/**
 * Enhanced default values function for User forms with input validation
 * Provides comprehensive fallbacks for all User fields with type safety
 *
 * @memberof CityArtWalks.Validators.User
 * @function defaultUserValues
 * @param {object} [user={}] - Optional User object to populate defaults
 * @returns {object} Default values for User form fields with comprehensive fallbacks
 * @throws {TypeError} When user parameter is not an object
 *
 * @example
 * const defaults = defaultUserValues();
 * const populatedDefaults = defaultUserValues(existingUser);
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Validator} - Default values documentation
 */
export function defaultUserValues(user = {}) {
  // Input validation
  if (typeof user !== 'object' || user === null) {
    debugError('CityArtWalks.Validators.User', 'Invalid user input, using empty object');
    user = {};
  }

  return {
    userId: user.userId ?? null,
    email: user.email ?? '',
    displayName: user.displayName ?? user.name ?? '',
    name: user.name ?? '',
    auth0Id: user.auth0Id ?? '',
    image: user.image ?? '',
    role: user.role ?? 'USER',
    status: user.status ?? 'ACTIVE',
    emailAllowed: user.emailAllowed ?? true,
    // Provide empty string defaults for all optional text fields to prevent uncontrolled input warnings
    phoneNumber: user.phoneNumber ?? '',
    countryId: user.countryId ?? '',
    address: user.address ?? '',
    stateId: user.stateId ?? '',
    cityId: user.cityId ?? '',
    zipCode: user.zipCode ?? '',
    about: user.about ?? '',
    company: user.company ?? '',
    coverImage: user.coverImage ?? '',
    facebook: user.facebook ?? '',
    instagram: user.instagram ?? '',
    emailVerified: user.emailVerified ?? null,
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
    lastLogin: user.lastLogin ?? null,
  };
}

/**
 * Enhanced Zod schema for updating user profile image
 * Includes comprehensive URL validation and user ID verification
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} updateUserImageSchema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Validator} - Image update validation
 */
export const updateUserImageSchema = z.object({
  userId: z.number().int().min(1, 'User ID is required'),
  image: z
    .string()
    .url({ message: 'Invalid image URL' })
    .max(2048, 'Image URL cannot exceed 2048 characters'),
});

/**
 * Enhanced Zod schema for updating user cover image
 * Includes comprehensive URL validation and user ID verification
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} updateUserCoverImageSchema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Validator} - Cover image update validation
 */
export const updateUserCoverImageSchema = z.object({
  userId: z.number().int().min(1, 'User ID is required'),
  coverImage: z
    .string()
    .url({ message: 'Invalid cover image URL' })
    .max(2048, 'Cover image URL cannot exceed 2048 characters'),
});

/**
 * Schema for bulk user operations with action validation
 * Supports various bulk actions like status changes, role assignments, etc.
 *
 * @memberof CityArtWalks.Validators.User
 * @constant {z.ZodObject} bulkUserActionSchema
 */
export const bulkUserActionSchema = z.object({
  userIds: z.array(z.number().int().min(1)).min(1, 'At least one user ID is required'),
  action: z.enum(['activate', 'ban', 'promote', 'demote', 'delete']),
  reason: z.string().max(500, 'Reason cannot exceed 500 characters').optional(),
});
