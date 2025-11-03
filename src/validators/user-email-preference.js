/**
 * @file user-email-preference.js
 * @description Zod validation schemas and helpers for UserEmailPreference. Includes
 * create/update/query/bulk/migration schemas, validation helpers, default value
 * generators, and transformation utilities to convert legacy preference formats.
 * @namespace CityArtWalks.Validators.UserEmailPreference
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserEmailPreference-Model}
 */

import { z } from 'zod';

/**
 * Email frequency enum values
 * @constant {Array<string>} emailFrequencyValues
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
const emailFrequencyValues = ['IMMEDIATE', 'DAILY', 'WEEKLY', 'MONTHLY'];

/**
 * Base user email preference schema with common fields
 * @constant {z.ZodObject} baseUserEmailPreferenceSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
const baseUserEmailPreferenceSchema = z.object({
  newsletterEnabled: z.boolean().optional().default(true),

  reviewNotificationsEnabled: z.boolean().optional().default(true),

  promotionalEmailsEnabled: z.boolean().optional().default(true),

  eventNotificationsEnabled: z.boolean().optional().default(true),

  frequency: z
    .enum(emailFrequencyValues, {
      errorMap: () => ({ message: 'Frequency must be IMMEDIATE, DAILY, WEEKLY, or MONTHLY' }),
    })
    .optional()
    .default('WEEKLY'),

  timezone: z.string().max(50, 'Timezone must be less than 50 characters').optional(),

  preferredHour: z
    .number()
    .int()
    .min(0, 'Preferred hour must be between 0 and 23')
    .max(23, 'Preferred hour must be between 0 and 23')
    .optional()
    .default(10),
});

/**
 * Schema for creating new user email preferences
 * @constant {z.ZodObject} createUserEmailPreferenceSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const createUserEmailPreferenceSchema = baseUserEmailPreferenceSchema.extend({
  userId: z.number().int().positive('User ID must be a positive integer'),
});

/**
 * Schema for updating user email preferences
 * @constant {z.ZodObject} updateUserEmailPreferenceSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const updateUserEmailPreferenceSchema = baseUserEmailPreferenceSchema.partial();

/**
 * Schema for user email preference query parameters
 * @constant {z.ZodObject} userEmailPreferenceQuerySchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const userEmailPreferenceQuerySchema = z.object({
  skip: z.number().int().min(0, 'Skip must be a non-negative integer').optional().default(0),

  rowsPerPage: z
    .number()
    .int()
    .min(1, 'Rows per page must be at least 1')
    .max(100, 'Rows per page cannot exceed 100')
    .optional()
    .default(25),

  search: z.string().max(200, 'Search term must be less than 200 characters').optional(),

  userId: z.string().regex(/^\d+$/, 'User ID must be a valid integer').optional(),

  newsletterEnabled: z.boolean().optional(),

  reviewNotificationsEnabled: z.boolean().optional(),

  frequency: z
    .enum(emailFrequencyValues, {
      errorMap: () => ({ message: 'Frequency must be IMMEDIATE, DAILY, WEEKLY, or MONTHLY' }),
    })
    .optional(),
});

/**
 * Schema for user email preference ID validation
 * @constant {z.ZodObject} userEmailPreferenceIdSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const userEmailPreferenceIdSchema = z.object({
  preferenceId: z.number().int().positive('Preference ID must be a positive integer'),
});

/**
 * Schema for user ID validation
 * @constant {z.ZodObject} userIdSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const userIdSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
});

/**
 * Schema for preference update from user settings
 * @constant {z.ZodObject} userPreferenceUpdateSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const userPreferenceUpdateSchema = z
  .object({
    preferences: z.object({
      newsletter: z.boolean().optional(),
      reviews: z.boolean().optional(),
      promotional: z.boolean().optional(),
      events: z.boolean().optional(),
    }),

    frequency: z
      .enum(emailFrequencyValues, {
        errorMap: () => ({ message: 'Frequency must be IMMEDIATE, DAILY, WEEKLY, or MONTHLY' }),
      })
      .optional(),

    timezone: z.string().max(50, 'Timezone must be less than 50 characters').optional(),

    preferredHour: z
      .number()
      .int()
      .min(0, 'Preferred hour must be between 0 and 23')
      .max(23, 'Preferred hour must be between 0 and 23')
      .optional(),
  })
  .transform((data) => ({
    // Transform the nested preferences object to flat structure
    newsletterEnabled: data.preferences?.newsletter,
    reviewNotificationsEnabled: data.preferences?.reviews,
    promotionalEmailsEnabled: data.preferences?.promotional,
    eventNotificationsEnabled: data.preferences?.events,
    frequency: data.frequency,
    timezone: data.timezone,
    preferredHour: data.preferredHour,
  }));

/**
 * Schema for bulk preference updates
 * @constant {z.ZodObject} bulkPreferenceUpdateSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const bulkPreferenceUpdateSchema = z.object({
  userIds: z
    .array(z.number().int().positive('User ID must be a positive integer'))
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot update more than 100 users at once'),

  updates: baseUserEmailPreferenceSchema.partial(),

  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

/**
 * Schema for preference export request
 * @constant {z.ZodObject} preferenceExportSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const preferenceExportSchema = z.object({
  format: z
    .enum(['csv', 'json', 'xlsx'], {
      errorMap: () => ({ message: 'Format must be csv, json, or xlsx' }),
    })
    .optional()
    .default('csv'),

  includeUserData: z.boolean().optional().default(true),

  filters: z
    .object({
      newsletterEnabled: z.boolean().optional(),
      reviewNotificationsEnabled: z.boolean().optional(),
      frequency: z.enum(emailFrequencyValues).optional(),
      createdAfter: z.string().datetime().optional(),
      createdBefore: z.string().datetime().optional(),
    })
    .optional(),
});

/**
 * Schema for preference migration from legacy system
 * @constant {z.ZodObject} preferenceMigrationSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const preferenceMigrationSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),

  legacyPreferences: z.object({
    email_notifications: z.boolean().optional(),
    newsletter_subscription: z.boolean().optional(),
    marketing_emails: z.boolean().optional(),
    frequency_setting: z.string().optional(),
  }),

  overwrite: z.boolean().optional().default(false),
});

/**
 * Validation helper functions
 * @description Helper utilities for UserEmailPreference. Kept under the file-level
 * namespace to avoid creating a separate nested namespace in generated docs.
 */

/**
 * Validate timezone format
 * @function validateTimezone
 * @memberof CityArtWalks.Validators.UserEmailPreference
 * @param {string} timezone - Timezone string to validate
 * @returns {boolean} True if valid timezone
 */
export function validateTimezone(timezone) {
  if (!timezone) return true; // Optional field

  try {
    // Test if timezone is valid by creating a date with it
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get default preferences for a new user
 * @function getDefaultPreferences
 * @memberof CityArtWalks.Validators.UserEmailPreference
 * @param {number} userId - User ID
 * @returns {Object} Default preference settings
 */
export function getDefaultPreferences(userId) {
  return {
    userId,
    newsletterEnabled: true,
    reviewNotificationsEnabled: true,
    promotionalEmailsEnabled: true,
    eventNotificationsEnabled: true,
    frequency: 'WEEKLY',
    timezone: null,
    preferredHour: 10,
  };
}

/**
 * Validate frequency and preferred hour combination
 * @function validateFrequencyAndHour
 * @memberof CityArtWalks.Validators.UserEmailPreference
 * @param {string} frequency - Email frequency
 * @param {number} preferredHour - Preferred hour
 * @returns {Object} Validation result
 */
export function validateFrequencyAndHour(frequency, preferredHour) {
  // IMMEDIATE frequency ignores preferred hour
  if (frequency === 'IMMEDIATE') {
    return { isValid: true };
  }

  // Other frequencies should have a valid preferred hour
  if (typeof preferredHour !== 'number' || preferredHour < 0 || preferredHour > 23) {
    return {
      isValid: false,
      message: 'Preferred hour must be between 0 and 23 for non-immediate frequencies',
    };
  }

  return { isValid: true };
}

/**
 * Convert legacy preference format to new format
 * @function convertLegacyPreferences
 * @memberof CityArtWalks.Validators.UserEmailPreference
 * @param {Object} legacyPrefs - Legacy preference object
 * @returns {Object} Converted preferences
 */
export function convertLegacyPreferences(legacyPrefs) {
  const frequencyMap = {
    daily: 'DAILY',
    weekly: 'WEEKLY',
    monthly: 'MONTHLY',
    immediate: 'IMMEDIATE',
  };

  return {
    newsletterEnabled: legacyPrefs.newsletter_subscription ?? true,
    reviewNotificationsEnabled: legacyPrefs.email_notifications ?? true,
    promotionalEmailsEnabled: legacyPrefs.marketing_emails ?? true,
    eventNotificationsEnabled: legacyPrefs.email_notifications ?? true,
    frequency: frequencyMap[legacyPrefs.frequency_setting?.toLowerCase()] || 'WEEKLY',
  };
}

/**
 * Schema for preference template creation
 * @constant {z.ZodObject} preferenceTemplateSchema
 * @memberof CityArtWalks.Validators.UserEmailPreference
 */
export const preferenceTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'Template name is required')
    .max(100, 'Template name must be less than 100 characters'),

  description: z.string().max(500, 'Description must be less than 500 characters').optional(),

  preferences: baseUserEmailPreferenceSchema.required({
    newsletterEnabled: true,
    reviewNotificationsEnabled: true,
    promotionalEmailsEnabled: true,
    eventNotificationsEnabled: true,
    frequency: true,
  }),

  isDefault: z.boolean().optional().default(false),
});
