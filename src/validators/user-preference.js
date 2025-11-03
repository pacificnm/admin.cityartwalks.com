/**
 * @file user-preference.js
 * @description Zod validation schemas and utilities for UserPreference. Includes base, create, update,
 * query, and specialized preference schemas (location, privacy, email, notification), plus helper
 * functions for defaults and location hierarchy validation used by API routes and UI forms.
 * @namespace CityArtWalks.Validators.UserPreference
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserPreference-Model} - UserPreference database model
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation standards
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-preference-Validator} - UserPreference validator documentation
 */
import { z } from 'zod';

/**
 * Zod schema for UserPreference entity (base)
 * @memberof CityArtWalks.Validators.UserPreference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserPreference-Model}
 */
const baseUserPreferenceSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int().positive('User ID must be a positive integer'),
  theme: z.string().optional().nullable(),
  notificationsEnabled: z.boolean().optional().nullable(),
  language: z.string().optional().nullable(),

  // Location preference fields
  defaultCountryId: z
    .number()
    .int()
    .positive('Country ID must be a positive integer')
    .optional()
    .nullable(),
  defaultStateId: z
    .number()
    .int()
    .positive('State ID must be a positive integer')
    .optional()
    .nullable(),
  defaultCityId: z
    .number()
    .int()
    .positive('City ID must be a positive integer')
    .optional()
    .nullable(),

  // Notification preferences - only fields that exist in Prisma schema
  digestEmails: z.boolean().optional().default(false),
  emailNotifications: z.boolean().optional().default(true),
  inAppNotifications: z.boolean().optional().default(true),
  marketingEmails: z.boolean().optional().default(false),
  moderationDecisionEmails: z.boolean().optional().default(true),
  moderationDecisionNotifications: z.boolean().optional().default(true),
  newReviewOwnerEmails: z.boolean().optional().default(true),
  newReviewOwnerNotifications: z.boolean().optional().default(true),
  reviewApprovalEmails: z.boolean().optional().default(true),
  reviewApprovalNotifications: z.boolean().optional().default(true),
  reviewFlaggedEmails: z.boolean().optional().default(false),
  reviewFlaggedNotifications: z.boolean().optional().default(true),
  reviewRejectionEmails: z.boolean().optional().default(true),
  reviewRejectionNotifications: z.boolean().optional().default(true),
  systemEmails: z.boolean().optional().default(true),
  profilePublic: z.boolean().optional().default(false),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const userPreferenceSchema = baseUserPreferenceSchema.refine(
  (data) => {
    // Validate location hierarchy: if city is set, state must be set
    if (data.defaultCityId && !data.defaultStateId) {
      return false;
    }

    // Validate location hierarchy: if state is set, country must be set
    if (data.defaultStateId && !data.defaultCountryId) {
      return false;
    }

    return true;
  },
  {
    message: 'Location preferences must follow hierarchy: Country → State → City',
    path: ['defaultCityId'],
  }
);


/**
 * Zod schema for creating a UserPreference entity
 * @memberof CityArtWalks.Validators.UserPreference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-preference-Validator}
 */
export const createUserPreferenceSchema = baseUserPreferenceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Zod schema for updating a UserPreference entity (partial fields)
 * @memberof CityArtWalks.Validators.UserPreference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-preference-Validator}
 */
export const updateUserPreferenceSchema = baseUserPreferenceSchema.partial();

/**
 * Zod schema for querying UserPreference entities (filter, sort, pagination)
 * @memberof CityArtWalks.Validators.UserPreference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */
export const userPreferenceQuerySchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  userId: z.number().int().positive().optional(),
  preferenceType: z.string().optional(),
  createdBy: z.number().int().positive().optional(),
  updatedBy: z.number().int().positive().optional(),
  search: z.string().optional(),
});

/**
 * Returns default values for UserPreference forms
 * @memberof CityArtWalks.Validators.UserPreference
 * @function defaultUserPreferenceValues
 * @param {object} [userPreference] - Optional UserPreference object to populate defaults
 * @returns {object} Default values for UserPreference form fields
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-preference-Validator}
 */
export function defaultUserPreferenceValues(userPreference) {
  return {
    id: userPreference?.id ?? null,
    userId: userPreference?.userId ?? null,
    theme: userPreference?.theme ?? null,
    notificationsEnabled: userPreference?.notificationsEnabled ?? null,
    language: userPreference?.language ?? null,

    // Location preferences
    defaultCountryId: userPreference?.defaultCountryId ?? null,
    defaultStateId: userPreference?.defaultStateId ?? null,
    defaultCityId: userPreference?.defaultCityId ?? null,

    // Notification preferences with defaults
    digestEmails: userPreference?.digestEmails ?? false,
    emailNotifications: userPreference?.emailNotifications ?? true,
    inAppNotifications: userPreference?.inAppNotifications ?? true,
    marketingEmails: userPreference?.marketingEmails ?? false,
    moderationDecisionEmails: userPreference?.moderationDecisionEmails ?? true,
    moderationDecisionNotifications: userPreference?.moderationDecisionNotifications ?? true,
    newReviewOwnerEmails: userPreference?.newReviewOwnerEmails ?? true,
    newReviewOwnerNotifications: userPreference?.newReviewOwnerNotifications ?? true,
    reviewApprovalEmails: userPreference?.reviewApprovalEmails ?? true,
    reviewApprovalNotifications: userPreference?.reviewApprovalNotifications ?? true,
    reviewFlaggedEmails: userPreference?.reviewFlaggedEmails ?? false,
    reviewFlaggedNotifications: userPreference?.reviewFlaggedNotifications ?? true,
    reviewRejectionEmails: userPreference?.reviewRejectionEmails ?? true,
    reviewRejectionNotifications: userPreference?.reviewRejectionNotifications ?? true,
    systemEmails: userPreference?.systemEmails ?? true,
    profilePublic: userPreference?.profilePublic ?? false,

    createdAt: userPreference?.createdAt ?? null,
    updatedAt: userPreference?.updatedAt ?? null,
  };
}

/**
 * Zod schema for location preference updates specifically
 * @memberof CityArtWalks.Validators.UserPreference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-preference-Validator}
 */
export const locationPreferenceSchema = z
  .object({
    defaultCountryId: z
      .number()
      .int()
      .positive('Country ID must be a positive integer')
      .optional()
      .nullable(),
    defaultStateId: z
      .number()
      .int()
      .positive('State ID must be a positive integer')
      .optional()
      .nullable(),
    defaultCityId: z
      .number()
      .int()
      .positive('City ID must be a positive integer')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // Validate location hierarchy: if city is set, state must be set
      if (data.defaultCityId && !data.defaultStateId) {
        return false;
      }
      // Validate location hierarchy: if state is set, country must be set
      if (data.defaultStateId && !data.defaultCountryId) {
        return false;
      }
      return true;
    },
    {
      message: 'Location preferences must follow hierarchy: Country → State → City',
      path: ['defaultCityId'],
    }
  );
/**
 * Validate location hierarchy consistency
 * @function validateLocationHierarchy
 * @memberof CityArtWalks.Validators.UserPreference
 * @param {Object} location - Location preference object
 * @param {number|null} location.countryId - Country ID
 * @param {number|null} location.stateId - State ID
 * @param {number|null} location.cityId - City ID
 * @returns {Object} Validation result
 */
export function validateLocationHierarchy({ countryId, stateId, cityId }) {
  // If city is provided, state must be provided
  if (cityId && !stateId) {
    return {
      isValid: false,
      message: 'State must be selected when city is specified',
    };
  }

  // If state is provided, country must be provided
  if (stateId && !countryId) {
    return {
      isValid: false,
      message: 'Country must be selected when state is specified',
    };
  }

  return { isValid: true };
}

/**
 * Get default location preference values
 * @function getDefaultLocationPreferences
 * @memberof CityArtWalks.Validators.UserPreference
 * @returns {Object} Default location preference settings
 */
export function getDefaultLocationPreferences() {
  return {
    defaultCountryId: null,
    defaultStateId: null,
    defaultCityId: null,
  };
}

/**
 * Clear location preferences based on hierarchy rules
 * @function clearLocationPreferences
 * @memberof CityArtWalks.Validators.UserPreference
 * @param {Object} currentPrefs - Current location preferences
 * @param {string} level - Level to clear ('country', 'state', 'city')
 * @returns {Object} Updated location preferences
 */
export function clearLocationPreferences(currentPrefs, level) {
  const cleared = { ...currentPrefs };

  switch (level) {
    case 'country':
      cleared.defaultCountryId = null;
      cleared.defaultStateId = null;
      cleared.defaultCityId = null;
      break;
    case 'state':
      cleared.defaultStateId = null;
      cleared.defaultCityId = null;
      break;
    case 'city':
      cleared.defaultCityId = null;
      break;
    default:
      // No changes for invalid level
      break;
  }

  return cleared;
}

/**
 * Zod schema for privacy-specific preferences
 * @memberof CityArtWalks.Validators.UserPreference
 */
export const privacyPreferenceSchema = z.object({
  profilePublic: z.boolean().optional().default(false),
  // Note: Other privacy fields like showEmail, showLocation, etc. are not in the database schema yet
  // Only profilePublic is currently implemented in the UserPreference model
});

/**
 * Zod schema for email-specific preferences
 * @memberof CityArtWalks.Validators.UserPreference
 */
export const emailPreferenceSchema = z.object({
  emailNotifications: z.boolean().optional().default(true),
  reviewApprovalEmails: z.boolean().optional().default(true),
  reviewRejectionEmails: z.boolean().optional().default(true),
  newReviewOwnerEmails: z.boolean().optional().default(true),
  reviewFlaggedEmails: z.boolean().optional().default(true),
  moderationDecisionEmails: z.boolean().optional().default(true),
  digestEmails: z.boolean().optional().default(false),
  marketingEmails: z.boolean().optional().default(false),
  systemEmails: z.boolean().optional().default(true),
});

/**
 * Zod schema for notification-specific preferences
 * @memberof CityArtWalks.Validators.UserPreference
 */
export const notificationPreferenceSchema = z.object({
  inAppNotifications: z.boolean().optional().default(true),
  reviewApprovalNotifications: z.boolean().optional().default(true),
  reviewRejectionNotifications: z.boolean().optional().default(true),
  newReviewOwnerNotifications: z.boolean().optional().default(true),
  reviewFlaggedNotifications: z.boolean().optional().default(true),
  moderationDecisionNotifications: z.boolean().optional().default(true),
  browserNotifications: z.boolean().optional().default(false),
  soundNotifications: z.boolean().optional().default(false),
  desktopNotifications: z.boolean().optional().default(false),
  notificationFrequency: z.enum(['immediate', 'hourly', 'daily']).optional().default('immediate'),
});
