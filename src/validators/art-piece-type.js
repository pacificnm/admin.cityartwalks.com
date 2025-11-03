/**
 * @file art-piece-type.js
 * @description Zod validation schemas, sanitizers, and form helpers for ArtPieceType entities (create, update, query, and form configs).
 * @namespace CityArtWalks.Validators.ArtPieceType
 * @version 1.2.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Type-Model} - ArtPieceType model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 * @see {@link https://zod.dev/} - Zod official documentation
 */
import { z } from 'zod';

/**
 * Base Zod schema for artPieceType data validation
 *
 * Defines the complete data structure for artPieceType entities including all database fields,
 * validation rules, and type constraints. This schema serves as the foundation for
 * create and update operations.
 *
 * @memberof CityArtWalks.Validators.ArtPieceType
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */
export const artPieceTypeSchema = z.object({
  // Primary key (auto-increment, optional for creates)
  artPieceTypeId: z.number().int().optional(),

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
 * Zod schema for creating new artPieceType entries
 *
 * Used for validating data when creating new artPieceType entities. Excludes
 * auto-generated fields like timestamps and IDs.
 *
 * @memberof CityArtWalks.Validators.ArtPieceType
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Type-Model} - ArtPieceType model documentation
 */
export const createArtPieceTypeSchema = artPieceTypeSchema.omit({
  artPieceTypeId: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating existing artPieceType records
 *
 * Makes all fields optional except ID, allowing partial updates.
 * Used by PUT API routes. Based on full schema to allow audit fields.
 *
 * @memberof CityArtWalks.Validators.ArtPieceType
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-PUT} - PUT route documentation
 */
export const updateArtPieceTypeSchema = artPieceTypeSchema.partial();

/**
 * Schema for artPieceType query parameters and filtering
 *
 * Validates pagination, search, and filter parameters for GET requests.
 * All parameters are optional strings that get transformed to appropriate types.
 *
 * @memberof CityArtWalks.Validators.ArtPieceType
 * @constant {z.ZodObject}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/API-Route-GET} - GET route documentation
 */
export const artPieceTypeQuerySchema = z.object({
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
 * Gets default values for ArtPieceType forms and initialization
 *
 * Provides sensible defaults for creating new artPieceType records and
 * initializing forms. Based on database schema defaults and business rules.
 * When existing data is provided, returns sanitized values for form population.
 *
 * @memberof CityArtWalks.Validators.ArtPieceType
 * @function getArtPieceTypeDefaultValues
 * @param {Object} [existingArtPieceType] - Existing art piece type data for editing
 * @param {number} [existingArtPieceType.artPieceTypeId] - Unique identifier
 * @param {string} [existingArtPieceType.name] - Art piece type name
 * @param {string} [existingArtPieceType.description] - Type description
 * @param {boolean} [existingArtPieceType.active] - Active status
 * @param {Date} [existingArtPieceType.createdAt] - Creation timestamp
 * @param {Date} [existingArtPieceType.updatedAt] - Last update timestamp
 * @param {number} [existingArtPieceType.createdBy] - Creator user ID
 * @param {number} [existingArtPieceType.updatedBy] - Last updater user ID
 * @returns {Object} Default values object matching create/update schema
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema defaults
 *
 * @example
 * // For new art piece type creation
 * const newDefaults = getArtPieceTypeDefaultValues();
 *
 * @example
 * // For editing existing art piece type
 * const editDefaults = getArtPieceTypeDefaultValues(existingArtPieceType);
 */
export function getArtPieceTypeDefaultValues(existingArtPieceType = null) {
  // Base defaults for new records
  const baseDefaults = {
    name: '',
    description: '', // Changed from null to empty string
    active: true,
    createdBy: null,
    updatedBy: null,
  };

  // Return base defaults if no existing data
  if (!existingArtPieceType) {
    return baseDefaults;
  }

  // Sanitize and return existing data for form population
  return {
    // Form fields - always include these
    name: existingArtPieceType.name || '',
    description: existingArtPieceType.description || '', // Changed from null to empty string
    active: existingArtPieceType.active ?? true,

    // System fields - include for edit forms
    artPieceTypeId: existingArtPieceType.artPieceTypeId || null,
    createdAt: existingArtPieceType.createdAt || null,
    updatedAt: existingArtPieceType.updatedAt || null,
    createdBy: existingArtPieceType.createdBy || null,
    updatedBy: existingArtPieceType.updatedBy || null,
  };
}

/**
 * Sanitizes and transforms ArtPieceType data for API submission
 *
 * Cleans form data and ensures proper types before sending to API.
 * Removes empty strings, handles null values, and validates required fields.
 *
 * @memberof CityArtWalks.Validators.ArtPieceType
 * @function sanitizeArtPieceTypeData
 * @param {Object} formData - Raw form data from React Hook Form
 * @param {boolean} [isUpdate=false] - Whether this is an update operation
 * @returns {Object} Sanitized data ready for API submission
 * @throws {Error} When required fields are missing or invalid
 *
 * @example
 * // Sanitize create data
 * const cleanData = sanitizeArtPieceTypeData(formData, false);
 *
 * @example
 * // Sanitize update data
 * const cleanData = sanitizeArtPieceTypeData(formData, true);
 */
export function sanitizeArtPieceTypeData(formData, isUpdate = false) {
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
  if (isUpdate && formData.artPieceTypeId !== undefined) {
    const id = parseInt(formData.artPieceTypeId, 10);
    if (!isNaN(id) && id > 0) {
      sanitized.artPieceTypeId = id;
    }
  }

  return sanitized;
}

/**
 * Validates ArtPieceType data against schema with custom error messages
 *
 * Provides comprehensive validation with user-friendly error messages.
 * Can be used for both client-side and server-side validation.
 *
 * @memberof CityArtWalks.Validators.ArtPieceType
 * @function validateArtPieceTypeData
 * @param {Object} data - Data to validate
 * @param {string} operation - Operation type: 'create' or 'update'
 * @returns {Object} Validation result with success flag and errors
 * @throws {Error} When operation type is invalid
 *
 * @example
 * // Validate create data
 * const result = validateArtPieceTypeData(formData, 'create');
 * if (!result.success) {
 *   console.log('Validation errors?:', result.errors);
 * }
 */
export function validateArtPieceTypeData(data, operation) {
  if (!['create', 'update'].includes(operation)) {
    throw new Error('Operation must be either "create" or "update"');
  }

  // Choose appropriate schema
  const schema = operation === 'create' ? createArtPieceTypeSchema : updateArtPieceTypeSchema;

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
          message = 'Art piece type name is required';
        }
        break;
      case 'too_big':
        if (field === 'name') {
          message = 'Art piece type name is too long (maximum 255 characters)';
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
 * Gets form field configurations for ArtPieceType forms
 *
 * Provides standardized field configurations including validation rules,
 * labels, placeholders, and helper text for consistent form implementation.
 *
 * @memberof CityArtWalks.Validators.ArtPieceType
 * @function getArtPieceTypeFieldConfig
 * @param {boolean} [isEdit=false] - Whether this is for an edit form
 * @returns {Object} Field configuration object with all form fields
 *
 * @example
 * const fieldConfig = getArtPieceTypeFieldConfig(true);
 * console.log(fieldConfig.name.label); // "Type name"
 */
export function getArtPieceTypeFieldConfig(isEdit = false) {
  return {
    name: {
      label: 'Type name',
      placeholder: 'e.g., Sculpture, Mural, Installation, Statue, Fountain',
      helperText: 'Enter the name of the art piece type',
      required: true,
      maxLength: 255,
      validation: {
        required: 'Art piece type name is required',
        maxLength: 'Name is too long (maximum 255 characters)',
      },
    },
    description: {
      label: 'Description',
      placeholder: 'Describe the characteristics or defining features of this art piece type...',
      helperText: 'Optional description to clarify what defines this type of art piece',
      multiline: true,
      rows: 4,
      required: false,
    },
    active: {
      label: 'Active',
      helperText: 'Whether this type is actively used for categorizing art pieces',
      type: 'switch',
      defaultValue: true,
    },
    // System fields (for edit forms only)
    ...(isEdit && {
      artPieceTypeId: {
        label: 'Type ID',
        helperText: 'System-generated identifier',
        disabled: true,
        type: 'text',
      },
      createdAt: {
        label: 'Created At',
        helperText: 'When this type was created',
        disabled: true,
        type: 'datetime',
      },
      updatedAt: {
        label: 'Last Updated',
        helperText: 'When this type was last modified',
        disabled: true,
        type: 'datetime',
      },
    }),
  };
}
