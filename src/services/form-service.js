/**
 * @file form-service.js
 * @description Service class for reusable form operations and utilities.
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Services.FormService
 */

import { debugError } from 'src/lib/debug';

import { toast } from 'src/components/snackbar';

/**
 * @class FormService
 * @memberof CityArtWalks.Services
 * @description Service class providing reusable form operations including cancellation, submission, and validation handling.
 * All methods are static and can be called directly without instantiation.
 *
 * @example
 * // Handle form cancellation
 * const handleCancel = () => {
 *   FormService.handleCancel(reset, defaultValues, onCancel);
 * };
 *
 * @example
 * // Handle form submission
 * const onSubmit = handleSubmit(async (data) => {
 *   await FormService.handleEntitySubmit(isEdit, {
 *     entityName: 'artist',
 *     entityId: currentArtist?.artistId,
 *     currentEntity: currentArtist,
 *     data,
 *     operations: {
 *       create: () => createArtist(data),
 *       update: (id) => updateArtist(id, data)
 *     },
 *     form: {
 *       reset,
 *       getDefaultValues: defaultArtistValues
 *     },
 *     callbacks: { onSuccess },
 *     logging: { namespace: 'CityArtWalks.Forms.Artist.ArtistForm' }
 *   });
 * });
 */
export class FormService {
  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function handleCancel
   * @description Handles form cancellation by resetting form to original values and calling optional callback.
   * This is a reusable pattern across all forms to ensure consistent cancellation behavior.
   *
   * @param {Function} reset - React Hook Form reset function
   * @param {Object} defaultValues - Default form values to reset to
   * @param {Function} [onCancel] - Optional callback function to execute after reset
   * @returns {void}
   *
   * @example
   * // In a form component
   * const { reset } = useForm({ defaultValues });
   * 
   * const handleCancel = () => {
   *   FormService.handleCancel(reset, defaultValues, onCancel);
   * };
   */
  static handleCancel(reset, defaultValues, onCancel) {
    // Reset form to original values
    reset(defaultValues);

    // Execute optional callback if provided and is a function
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  }

  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function getFormDefaults
   * @description Generates form default values based on operation type (create vs edit).
   * For edit operations, uses entity-specific defaults. For create operations, uses
   * create-specific defaults and merges with any initial values provided.
   *
   * @param {boolean} isEdit - Whether this is an edit operation
   * @param {Object} config - Configuration object
   * @param {Object} [config.currentEntity] - Current entity data (for edit operations)
   * @param {Function} config.entityDefaultsFunc - Function that generates defaults from entity data
   * @param {Function} config.createDefaultsFunc - Function that generates defaults for new entities
   * @param {Object} [config.initialValues={}] - Initial values to merge for create operations
   * @returns {Object} Computed default values for the form
   *
   * @example
   * // In a form component
   * const defaultValues = FormService.getFormDefaults(isEdit, {
   *   currentEntity: currentArtist,
   *   entityDefaultsFunc: defaultArtistValues,
   *   createDefaultsFunc: getCreateArtistDefaults,
   *   initialValues,
   * });
   */
  static getFormDefaults(isEdit, {
    currentEntity,
    entityDefaultsFunc,
    createDefaultsFunc,
    initialValues = {}
  }) {
    // Get base defaults based on operation type
    const baseDefaults = isEdit
      ? entityDefaultsFunc(currentEntity)
      : createDefaultsFunc();
    
    // For create operations, merge with initial values
    // For edit operations, use base defaults as-is
    return isEdit ? baseDefaults : { ...baseDefaults, ...initialValues };
  }

  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function handleEntitySubmit
   * @description Main method for handling entity form submission (create/update). Handles validation,
   * execution, success/error handling, form reset, and callbacks. This is the primary method that
   * covers 95% of form submission use cases.
   *
   * @param {boolean} isEdit - Whether this is an edit (update) operation or create
   * @param {Object} config - Configuration object
   * @param {string} config.entityName - Name of the entity (e.g., 'artist', 'image', 'user')
   * @param {string|number} [config.entityId] - Entity ID (required for updates)
   * @param {Object} [config.currentEntity] - Current entity data (for fallback)
   * @param {Object} config.data - Form data to submit
   * @param {Object} config.operations - Operation functions
   * @param {Function} config.operations.create - Function to create entity
   * @param {Function} config.operations.update - Function to update entity
   * @param {Object} config.form - Form control functions
   * @param {Function} config.form.reset - React Hook Form reset function
   * @param {Function} config.form.getDefaultValues - Function to get default values from entity
   * @param {Object} [config.callbacks] - Optional callbacks
   * @param {Function} [config.callbacks.onSuccess] - Success callback function
   * @param {Object} [config.logging] - Logging configuration
   * @param {string} [config.logging.namespace] - Namespace for debug logging
   * @returns {Promise<void>}
   * @throws {Error} When operation fails
   *
   * @example
   * // In a form component
   * const onSubmit = handleSubmit(async (data) => {
   *   await FormService.handleEntitySubmit(isEdit, {
   *     entityName: 'artist',
   *     entityId: currentArtist?.artistId,
   *     currentEntity: currentArtist,
   *     data,
   *     operations: {
   *       create: () => createArtist(data),
   *       update: (id) => updateArtist(id, data)
   *     },
   *     form: {
   *       reset,
   *       getDefaultValues: defaultArtistValues
   *     },
   *     callbacks: { onSuccess },
   *     logging: { namespace: 'CityArtWalks.Forms.Artist.ArtistForm' }
   *   });
   * });
   */
  static async handleEntitySubmit(isEdit, config) {
    const {
      entityName,
      entityId,
      currentEntity,
      data,
      operations,
      form,
      callbacks = {},
      logging = {},
    } = config;

    const { create, update } = operations;
    const { reset, getDefaultValues } = form;
    const { onSuccess } = callbacks;
    const { namespace = 'FormService' } = logging;

    try {
      let result;

      if (isEdit) {
        // Validate entity ID for update operations
        FormService.validateEntityId(entityId, entityName, namespace);

        // Execute update operation
        result = await update(entityId);

        // Validate result
        FormService.validateResult(result, 'update', entityName, entityId, data, namespace);

        // Extract and reset form with updated data
        const updatedData = FormService.extractEntityData(result, currentEntity);
        reset(getDefaultValues(updatedData));

        // Show success message
        toast.success(FormService.formatSuccessMessage('update', entityName));
      } else {
        // Execute create operation
        result = await create();

        // Validate result
        FormService.validateResult(result, 'create', entityName, null, data, namespace);

        // Extract and reset form with created data
        const createdData = FormService.extractEntityData(result);
        reset(getDefaultValues(createdData));

        // Show success message
        toast.success(FormService.formatSuccessMessage('create', entityName));
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        const entityData = FormService.extractEntityData(result);
        onSuccess({
          result,
          operation: isEdit ? 'update' : 'create',
          [`${entityName}Data`]: entityData,
          isEdit,
          // Convenience property
          [entityName]: entityData,
          // Backward compatibility
          data: entityData,
        });
      }
    } catch (error) {
      // Handle and log error
      FormService.handleSubmitError({
        error,
        isEdit,
        entityName,
        entityId,
        data,
        namespace,
      });
    }
  }

  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function validateEntityId
   * @description Validates that entity ID exists for update operations. Logs error and throws if missing.
   *
   * @param {string|number} entityId - Entity ID to validate
   * @param {string} entityName - Name of entity
   * @param {string} namespace - Namespace for logging
   * @throws {Error} When entity ID is missing
   *
   * @example
   * FormService.validateEntityId(artistId, 'artist', 'ArtistForm');
   */
  static validateEntityId(entityId, entityName, namespace) {
    if (!entityId) {
      debugError(
        namespace,
        `${entityName} ID is required for update operation`,
        {
          entityId: entityId || 'missing',
          hasEntityId: !!entityId,
        }
      );
      toast.error(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} ID is required for update operation`);
      throw new Error(`${entityName} ID is required for update operation`);
    }
  }

  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function validateResult
   * @description Validates that operation result is not null. Logs error and throws if null.
   *
   * @param {*} result - Result to validate
   * @param {string} operation - Operation type ('create' or 'update')
   * @param {string} entityName - Name of entity
   * @param {string|number} entityId - Entity ID (for updates)
   * @param {Object} data - Form data
   * @param {string} namespace - Namespace for logging
   * @throws {Error} When result is null
   *
   * @example
   * FormService.validateResult(result, 'create', 'artist', null, data, 'ArtistForm');
   */
  static validateResult(result, operation, entityName, entityId, data, namespace) {
    if (!result) {
      debugError(
        namespace,
        `${operation} ${entityName} operation returned null result`,
        {
          entityId: entityId || 'N/A',
          formData: data ? 'provided' : 'missing',
          operation,
        }
      );
      toast.error(`Failed to ${operation} ${entityName} - no response from server`);
      throw new Error(`${operation} ${entityName} operation returned null result`);
    }
  }

  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function extractEntityData
   * @description Extracts entity data from API result with fallback logic.
   *
   * @param {Object} result - API result
   * @param {Object} [fallback] - Fallback entity data
   * @returns {Object} Extracted entity data
   *
   * @example
   * const entityData = FormService.extractEntityData(result, currentArtist);
   */
  static extractEntityData(result, fallback = null) {
    return result?.data || result || fallback;
  }

  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function formatSuccessMessage
   * @description Formats success toast message for create/update operations.
   *
   * @param {string} operation - Operation type ('create' or 'update')
   * @param {string} entityName - Name of entity
   * @returns {string} Formatted success message
   *
   * @example
   * const message = FormService.formatSuccessMessage('create', 'artist');
   * // Returns: "Artist created successfully!"
   */
  static formatSuccessMessage(operation, entityName) {
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    
    if (operation === 'update') {
      return `Your ${entityName} has been updated successfully!`;
    }
    return `${capitalizedEntity} created successfully!`;
  }

  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function formatErrorMessage
   * @description Formats error message based on error type (validation, network, etc.).
   *
   * @param {Error} error - Error object
   * @param {string} operation - Operation type ('create' or 'update')
   * @param {string} entityName - Name of entity
   * @returns {string} Formatted error message
   *
   * @example
   * const message = FormService.formatErrorMessage(error, 'update', 'artist');
   */
  static formatErrorMessage(error, operation, entityName) {
    if (error.message.includes('validation')) {
      return 'Please check the form fields for validation errors.';
    }
    
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }

    return `Failed to ${operation} ${entityName}. Please check your information and try again.`;
  }

  /**
   * @memberof CityArtWalks.Services.FormService
   * @static
   * @function handleSubmitError
   * @description Handles form submission errors with logging and user-friendly messages.
   *
   * @param {Object} config - Error handling configuration
   * @param {Error} config.error - Error object
   * @param {boolean} config.isEdit - Whether this was an edit operation
   * @param {string} config.entityName - Name of entity
   * @param {string|number} [config.entityId] - Entity ID
   * @param {Object} config.data - Form data
   * @param {string} config.namespace - Namespace for logging
   *
   * @example
   * FormService.handleSubmitError({
   *   error,
   *   isEdit,
   *   entityName: 'artist',
   *   entityId: artistId,
   *   data,
   *   namespace: 'ArtistForm'
   * });
   */
  static handleSubmitError(config) {
    const { error, isEdit, entityName, entityId, data, namespace } = config;
    const operation = isEdit ? 'update' : 'create';

    // Log error with context
    debugError(
      namespace,
      `Failed to ${operation} ${entityName}`,
      {
        error: error.message,
        stack: error.stack,
        operation,
        entityId: entityId || 'N/A',
        formData: data ? Object.keys(data).join(', ') : 'missing',
        timestamp: new Date().toISOString(),
        isEdit,
      }
    );

    // Show user-friendly error message
    const errorMessage = FormService.formatErrorMessage(error, operation, entityName);
    toast.error(errorMessage);
  }
}
