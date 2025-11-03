/**
 * @file user-quick-edit.js
 * @description Minimal Zod validation schema for the admin quick edit form.
 * Validates only the essential admin-editable fields: email, displayName, status, and role.
 * All other fields are allowed to passthrough to support partial quick edits from the admin UI.
 * @namespace CityArtWalks.Validators.UserQuickEdit
 * @version 1.0.0
 * @author Jaimie Garner
 * @requires {@link https://zod.dev/} zod - TypeScript-first schema validation library
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Validators} - Validator conventions
 */
import { z } from 'zod';

/**
 * Minimal validation schema for user quick edit form
 * ONLY validates the 4 essential admin fields
 *
 * @memberof CityArtWalks.Validators.UserQuickEdit
 * @constant {z.ZodObject} userQuickEditSchema
 */
export const userQuickEditSchema = z
  .object({
    // REQUIRED FIELDS - Only these 4 are validated
    email: z.string().email('Invalid email format').max(254, 'Email cannot exceed 254 characters'),
    displayName: z
      .string()
      .min(1, 'Display name is required')
      .max(100, 'Display name cannot exceed 100 characters'),
    status: z.enum(['ACTIVE', 'PENDING', 'BANNED', 'REJECTED']),
    role: z.enum(['USER', 'MEMBER', 'ADMIN']),
  })
  .passthrough(); // passthrough() allows all other fields without validation

/**
 * Default values function for user quick edit form
 *
 * @memberof CityArtWalks.Validators.UserQuickEdit
 * @function defaultQuickEditValues
 * @param {object} [user={}] - Optional User object to populate defaults
 * @returns {object} Default values for quick edit form
 */
export function defaultQuickEditValues(user = {}) {
  if (typeof user !== 'object' || user === null) {
    user = {};
  }

  return {
    // Required fields with defaults
    email: user.email || '',
    displayName: user.displayName || user.name || '',
    status: user.status || 'ACTIVE',
    role: user.role || 'USER',

    // Optional fields - pass through as-is
    phoneNumber: user.phoneNumber || '',
    company: user.company || '',
    countryId: user.countryId || null,
    stateId: user.stateId || null,
    cityId: user.cityId || null,
    address: user.address || '',
    zipCode: user.zipCode || '',
    auth0Id: user.auth0Id || null,
    lastLogin: user.lastLogin || null,
  };
}
