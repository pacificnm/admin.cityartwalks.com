/**
 * @file contact.js
 * @description Zod validation schemas and helpers for Contact — create, update, query, and database schemas used by contact forms and admin.
 * @namespace CityArtWalks.Validators.Contact
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact-Model} - Contact model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation docs
 */
import { z } from 'zod';

/**
 * Base Zod schema for contact data validation
 *
 * Defines the complete data structure for contact entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.Contact
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Contact} - Database schema reference
 */
export const contactSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  contactId: z.string().optional(),

  // Required string fields
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject too long'),
  message: z.string().min(1, 'Message is required'),
  messageId: z.string().min(1, 'Message ID is required'),

  // Captcha token field (required for form submissions)
  captchaToken: z.string().min(1, 'Captcha verification is required').optional(),

  // Date fields
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

/**
 * Zod schema for creating new contact entries
 *
 * Used for validating data when creating new contact entities. Excludes
 * auto-generated fields like timestamps and IDs, but requires captcha token
 * for security validation.
 *
 * @memberof CityArtWalks.Validators.Contact
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact-Model} - Contact model documentation
 */
export const createContactSchema = contactSchema
  .omit({
    contactId: true,
    messageId: true, // Generated programmatically
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    // Make captcha token required for create operations (public forms)
    captchaToken: z.string().min(1, 'Captcha verification is required'),
  });

/**
 * Zod schema for updating existing contact entries
 *
 * Allows partial updates by making all fields optional. Used for PATCH operations
 * where only specific fields need to be updated.
 *
 * @memberof CityArtWalks.Validators.Contact
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact-Model} - Contact model documentation
 */
export const updateContactSchema = contactSchema.partial();

/**
 * Zod schema for database operations (excludes captchaToken)
 *
 * Used for validating data when interacting with the database. Excludes
 * captchaToken field which is only used for form validation, not database storage.
 *
 * @memberof CityArtWalks.Validators.Contact
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact-Model} - Contact model documentation
 */
export const contactDatabaseSchema = contactSchema.omit({
  contactId: true,
  messageId: true, // Generated programmatically
  createdAt: true,
  updatedAt: true,
  captchaToken: true, // Not stored in database
});

/**
 * Returns default contact values for form initialization and data consistency
 *
 * Provides consistent default values for all contact fields, filling in missing
 * properties with appropriate defaults. Used for form initialization and ensuring
 * complete data structures for contact operations.
 *
 * @function defaultContactValues
 * @memberof CityArtWalks.Validators.Contact
 * @param {Object} [contact] - Partial contact object (may be incomplete)
 * @returns {Object} Complete contact object with all default fields populated
 *
 * @example
 * // Create defaults for new contact entry
 * const defaults = defaultContactValues();
 *
 * // Merge with existing partial data
 * const contactData = defaultContactValues({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact-Model} - Contact model documentation
 */
export function defaultContactValues(contact) {
  return {
    contactId: contact?.contactId ?? undefined,
    name: contact?.name ?? '',
    email: contact?.email ?? '',
    subject: contact?.subject ?? '',
    message: contact?.message ?? '',
    messageId: contact?.messageId ?? '',
    captchaToken: contact?.captchaToken ?? '', // Default empty for captcha token
    createdAt: contact?.createdAt ?? undefined,
    updatedAt: contact?.updatedAt ?? undefined,
  };
}

/**
 * Zod schema for validating contact query parameters
 *
 * Handles pagination, filtering, and sorting parameters for contact API endpoints.
 * Includes automatic string-to-number transformations for query parameters and
 * support for various filtering options.
 *
 * @memberof CityArtWalks.Validators.Contact
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Contact-Model} - Contact model documentation
 */
export const contactQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100))
    .optional(),
  search: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
