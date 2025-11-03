/**
 * @file art-piece-material.js
 * @description Zod validation schemas and helpers for ArtPieceMaterial — create, update, query, and form defaults used throughout the app.
 * @namespace CityArtWalks.Validators.ArtPieceMaterial
 * @version 1.2.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Material-Model} - ArtPieceMaterial model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 */
import { z } from 'zod';

export const artPieceMaterialSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  artPieceMaterialId: z.number().int().optional(),

  // Required string fields
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),

  // Optional string fields
  description: z.string().nullable().optional(),

  // Boolean fields
  active: z.boolean().default(true),

  // Date fields
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  // User tracking fields
  createdBy: z.number().int().positive().nullable().optional(),
  updatedBy: z.number().int().positive().nullable().optional(),
});

/**
 * Zod schema for creating new artPieceMaterial entries
 *
 * Used for validating data when creating new artPieceMaterial entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.ArtPieceMaterial
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Material-Model} - ArtPieceMaterial model documentation
 */
export const createArtPieceMaterialSchema = artPieceMaterialSchema.omit({
  artPieceMaterialId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing artPieceMaterial records
 *
 * Makes all fields optional except ID, allowing partial updates.
 * Used by PUT API routes. Based on full schema to allow audit fields.
 *
 * @memberof CityArtWalks.Validators.ArtPieceMaterial
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateArtPieceMaterialSchema = artPieceMaterialSchema.partial();

/**
 * Schema for artPieceMaterial query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.ArtPieceMaterial
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const artPieceMaterialQuerySchema = z.object({
  // Pagination parameters
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),

  // Search parameter
  search: z.string().optional(),

  // Standard filters
  active: z.enum(['true', 'false']).optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  // Sort parameters
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Gets default values for ArtPieceMaterial forms and initialization
 *
 * Provides sensible defaults for creating new artPieceMaterial records and
 * initializing forms. Based on database schema defaults and business rules.
 * When existing data is provided, returns sanitized values for form population.
 *
 * @memberof CityArtWalks.Validators.ArtPieceMaterial
 * @function getArtPieceMaterialDefaultValues
 * @param {Object} [existingArtPieceMaterial] - Existing art piece material data for editing
 * @param {number} [existingArtPieceMaterial.artPieceMaterialId] - Unique identifier
 * @param {string} [existingArtPieceMaterial.name] - Art piece material name
 * @param {string} [existingArtPieceMaterial.description] - Material description
 * @param {boolean} [existingArtPieceMaterial.active] - Active status
 * @param {Date} [existingArtPieceMaterial.createdAt] - Creation timestamp
 * @param {Date} [existingArtPieceMaterial.updatedAt] - Last update timestamp
 * @param {number} [existingArtPieceMaterial.createdBy] - Creator user ID
 * @param {number} [existingArtPieceMaterial.updatedBy] - Last updater user ID
 * @returns {Object} Default values object matching create/update schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema defaults
 *
 * @example
 * // For new art piece material creation
 * const newDefaults = getArtPieceMaterialDefaultValues();
 *
 * @example
 * // For editing existing art piece material
 * const editDefaults = getArtPieceMaterialDefaultValues(existingArtPieceMaterial);
 */
export function getArtPieceMaterialDefaultValues(existingArtPieceMaterial = null) {
  // Base defaults for new records
  const baseDefaults = {
    name: '',
    description: '', // Changed from null to empty string
    active: true,
    createdBy: null,
    updatedBy: null,
  };

  // Return base defaults if no existing data
  if (!existingArtPieceMaterial) {
    return baseDefaults;
  }

  // Sanitize and return existing data for form population
  return {
    // Form fields - always include these
    name: existingArtPieceMaterial.name || '',
    description: existingArtPieceMaterial.description || '', // Changed from null to empty string
    active: existingArtPieceMaterial.active ?? true,

    // System fields - include for edit forms
    artPieceMaterialId: existingArtPieceMaterial.artPieceMaterialId || null,
    createdAt: existingArtPieceMaterial.createdAt || null,
    updatedAt: existingArtPieceMaterial.updatedAt || null,
    createdBy: existingArtPieceMaterial.createdBy || null,
    updatedBy: existingArtPieceMaterial.updatedBy || null,
  };
}

/**
 * Sanitizes and transforms ArtPieceMaterial data for API submission
 *
 * Cleans form data and ensures proper types before sending to API.
 * Removes empty strings, handles null values, and validates required fields.
 *
 * @memberof CityArtWalks.Validators.ArtPieceMaterial
 * @function sanitizeArtPieceMaterialData
 * @param {Object} formData - Raw form data from React Hook Form
 * @param {boolean} [isUpdate=false] - Whether this is an update operation
 * @returns {Object} Sanitized data ready for API submission
 * @throws {Error} When required fields are missing or invalid
 *
 * @example
 * // Sanitize create data
 * const cleanData = sanitizeArtPieceMaterialData(formData, false);
 *
 * @example
 * // Sanitize update data
 * const cleanData = sanitizeArtPieceMaterialData(formData, true);
 */
export function sanitizeArtPieceMaterialData(formData, isUpdate = false) {
  if (!formData || typeof formData !== 'object') {
    throw new Error('Form data is required and must be an object');
  }

  // Start with clean object
  const sanitized = {};

  // Handle name field (required)
  if (formData.name !== undefined) {
    const trimmedName = typeof formData.name === 'string' ? formData.name.trim() : '';
    if (!isUpdate && !trimmedName) {
      throw new Error('Name is required');
    }
    if (trimmedName) {
      sanitized.name = trimmedName;
    }
  }

  // Handle description field (optional)
  if (formData.description !== undefined) {
    const trimmedDescription =
      typeof formData.description === 'string' ? formData.description.trim() : '';
    // Convert empty string to null for database storage
    sanitized.description = trimmedDescription || null;
  }

  // Handle active field (boolean)
  if (formData.active !== undefined) {
    sanitized.active = Boolean(formData.active);
  }

  // Handle user tracking fields
  if (formData.createdBy !== undefined && formData.createdBy !== null) {
    const createdBy = parseInt(formData.createdBy, 10);
    if (!isNaN(createdBy) && createdBy > 0) {
      sanitized.createdBy = createdBy;
    }
  }

  if (formData.updatedBy !== undefined && formData.updatedBy !== null) {
    const updatedBy = parseInt(formData.updatedBy, 10);
    if (!isNaN(updatedBy) && updatedBy > 0) {
      sanitized.updatedBy = updatedBy;
    }
  }

  // For updates, include ID if present
  if (isUpdate && formData.artPieceMaterialId !== undefined) {
    const id = parseInt(formData.artPieceMaterialId, 10);
    if (!isNaN(id) && id > 0) {
      sanitized.artPieceMaterialId = id;
    }
  }

  return sanitized;
}

/**
 * Validates ArtPieceMaterial data against schema with custom error messages
 *
 * Provides comprehensive validation with user-friendly error messages.
 * Can be used for both client-side and server-side validation.
 *
 * @memberof CityArtWalks.Validators.ArtPieceMaterial
 * @function validateArtPieceMaterialData
 * @param {Object} data - Data to validate
 * @param {string} operation - Operation type: 'create' or 'update'
 * @returns {Object} Validation result with success flag and errors
 * @throws {Error} When operation type is invalid
 *
 * @example
 * // Validate create data
 * const result = validateArtPieceMaterialData(formData, 'create');
 * if (!result.success) {
 *   console.log('Validation errors?:', result.errors);
 * }
 */
export function validateArtPieceMaterialData(data, operation) {
  if (!['create', 'update'].includes(operation)) {
    throw new Error('Operation must be either "create" or "update"');
  }

  // Choose appropriate schema
  const schema =
    operation === 'create' ? createArtPieceMaterialSchema : updateArtPieceMaterialSchema;

  // Validate against schema
  const validation = schema.safeParse(data);

  if (validation.success) {
    return {
      success: true,
      data: validation.data,
      errors: null,
    };
  }

  // Transform Zod errors to user-friendly messages
  const errors = validation.error.errors.reduce((acc, error) => {
    const field = error.path.join('.');
    let message = error.message;

    // Customize error messages for better UX
    switch (error.code) {
      case 'too_small':
        if (field === 'name') {
          message = 'Art piece material name is required';
        }
        break;
      case 'too_big':
        if (field === 'name') {
          message = 'Art piece material name is too long (maximum 255 characters)';
        }
        break;
      case 'invalid_type':
        if (field === 'active') {
          message = 'Active status must be true or false';
        }
        break;
      default:
        // Keep original message for other validation types
        break;
    }

    acc[field] = message;
    return acc;
  }, {});

  return {
    success: false,
    data: null,
    errors,
  };
}

/**
 * Gets form field configurations for ArtPieceMaterial forms
 *
 * Provides standardized field configurations including validation rules,
 * labels, placeholders, and helper text for consistent form implementation.
 *
 * @memberof CityArtWalks.Validators.ArtPieceMaterial
 * @function getArtPieceMaterialFieldConfig
 * @param {boolean} [isEdit=false] - Whether this is for an edit form
 * @returns {Object} Field configuration object with all form fields
 *
 * @example
 * const fieldConfig = getArtPieceMaterialFieldConfig(true);
 * console.log(fieldConfig.name.label); // "Material name"
 */
export function getArtPieceMaterialFieldConfig(isEdit = false) {
  return {
    name: {
      label: 'Material name',
      placeholder: 'e.g., Bronze, Marble, Wood, Steel, Ceramic, Glass',
      helperText: 'Enter the name of the art piece material',
      required: true,
      maxLength: 255,
      validation: {
        required: 'Art piece material name is required',
        maxLength: 'Name is too long (maximum 255 characters)',
      },
    },
    description: {
      label: 'Description',
      placeholder: 'Describe the properties, characteristics, or typical uses of this material...',
      helperText: 'Optional description to clarify the material type and its characteristics',
      multiline: true,
      rows: 4,
      required: false,
    },
    active: {
      label: 'Active',
      helperText: 'Whether this material is actively used for categorizing art pieces',
      type: 'switch',
      defaultValue: true,
    },
    // System fields (for edit forms only)
    ...(isEdit && {
      artPieceMaterialId: {
        label: 'Material ID',
        helperText: 'System-generated identifier',
        disabled: true,
        type: 'text',
      },
      createdAt: {
        label: 'Created At',
        helperText: 'When this material was created',
        disabled: true,
        type: 'datetime',
      },
      updatedAt: {
        label: 'Last Updated',
        helperText: 'When this material was last modified',
        disabled: true,
        type: 'datetime',
      },
    }),
  };
}

/**
 * @deprecated Use getArtPieceMaterialDefaultValues instead
 * Legacy function for backward compatibility
 *
 * @function defaultArtPieceMaterialValues
 * @memberof CityArtWalks.Validators.ArtPieceMaterial
 * @param {Object} [artPieceMaterial] - Legacy art piece material object for compatibility
 * @returns {Object} Default values object matching create/update schema
 */
export function defaultArtPieceMaterialValues(artPieceMaterial) {
  return getArtPieceMaterialDefaultValues(artPieceMaterial);
}
