/**
 * @file art-piece-type-form.jsx
 * @description Form component for creating and updating art piece type information with validation and error handling.
 * @author Jaimie Garner
 * @version 1.1.0
 * @namespace CityArtWalks.Forms.ArtPieceType
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType} - ArtPieceType entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { debugError } from 'src/lib/debug';
import { useCreateArtPieceType, useUpdateArtPieceType } from 'src/actions/art-piece-type/hooks';
import { ElementName, ElementAudit, ElementActive, ElementDescription } from 'src/forms/elements';
import {
  createArtPieceTypeSchema,
  updateArtPieceTypeSchema,
  getArtPieceTypeDefaultValues,
} from 'src/validators/art-piece-type';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.ArtPieceType
 * @function ArtPieceTypeForm
 * @description Form component for creating and updating art piece type information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentArtPieceType=null] - Current art piece type data for editing, null for creating new type
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ArtPieceTypeForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType} - ArtPieceType entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceTypeForm(props) {
  const { currentArtPieceType = null, onSuccess, onCancel } = props;
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentArtPieceType);

  // Use appropriate hooks for create/update operations
  const createArtPieceType = useCreateArtPieceType(accessToken);
  const updateArtPieceType = useUpdateArtPieceType(accessToken);

  // Get default values using validator utility
  const defaultValues = getArtPieceTypeDefaultValues(currentArtPieceType);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateArtPieceTypeSchema : createArtPieceTypeSchema;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * @memberof CityArtWalks.Forms.ArtPieceType.ArtPieceTypeForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      let result;

      if (isEdit) {
        // Update existing art piece type
        if (!currentArtPieceType.artPieceTypeId) {
          debugError(
            'CityArtWalks.Forms.ArtPieceType.ArtPieceTypeForm.onSubmit',
            'Art piece type ID is required for update operation',
            {
              currentArtPieceType: currentArtPieceType ? 'provided' : 'null',
              hasArtPieceTypeId: !!currentArtPieceType?.artPieceTypeId,
            }
          );
          toast.error('Art piece type ID is required for update operation');
          return;
        }

        result = await updateArtPieceType(currentArtPieceType.artPieceTypeId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPieceType.ArtPieceTypeForm.onSubmit',
            'Update art piece type operation returned null result',
            {
              artPieceTypeId: currentArtPieceType.artPieceTypeId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update art piece type - no response from server');
          return;
        }

        // Reset form with updated data - handle API response structure
        const updatedTypeData =
          result.data?.artPieceType ||
          result.artPieceType ||
          result.data ||
          result ||
          currentArtPieceType;
        reset(getArtPieceTypeDefaultValues(updatedTypeData));
        toast.success('Art piece type has been updated successfully!');
      } else {
        // Create new art piece type
        result = await createArtPieceType(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPieceType.ArtPieceTypeForm.onSubmit',
            'Create art piece type operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create art piece type - no response from server');
          return;
        }

        // Reset form with created type data - handle API response structure
        const createdTypeData =
          result.data?.artPieceType || result.artPieceType || result.data || result;
        reset(getArtPieceTypeDefaultValues(createdTypeData));
        toast.success('Art piece type created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.ArtPieceType.ArtPieceTypeForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} art piece type`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          artPieceTypeId: currentArtPieceType?.artPieceTypeId,
          formData: data ? 'provided' : 'missing',
          timestamp: new Date().toISOString(),
        }
      );

      // Show user-friendly error message
      const operation = isEdit ? 'update' : 'create';
      toast.error(
        `Failed to ${operation} art piece type. Please check your information and try again.`
      );
    }
  });

  /**
   * @memberof CityArtWalks.Forms.ArtPieceType.ArtPieceTypeForm
   * @function handleCancel
   * @description Handles form cancellation by resetting to original values.
   */
  const handleCancel = () => {
    reset(defaultValues);
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        {/* Type Information Section */}
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
          }}
        >
          <ElementName
            name="name"
            label="Type name"
            required
            placeholder="e.g., Sculpture, Mural, Installation, Statue, Fountain"
            helperText="Enter the name of the art piece type"
          />

          <ElementDescription
            name="description"
            label="Description"
            placeholder="Describe the characteristics or defining features of this art piece type..."
            helperText="Optional description to clarify what defines this type of art piece"
          />

          <ElementActive
            name="active"
            label="Active"
            helperText="Whether this type is actively used for categorizing art pieces"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* System Information Section (for existing types) */}
        {isEdit && currentArtPieceType && (
          <>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <ElementAudit helperText="Creation and modification timestamps" />
            </Box>

            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" loading={isSubmitting} disabled={isSubmitting}>
            {isEdit ? 'Update type' : 'Create type'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}

/**
 * @memberof CityArtWalks.Forms.ArtPieceType.ArtPieceTypeForm
 * @description PropTypes validation for the ArtPieceTypeForm component
 */
ArtPieceTypeForm.propTypes = {
  /**
   * Current art piece type data for editing operations
   * @type {Object|null}
   */
  currentArtPieceType: PropTypes.shape({
    artPieceTypeId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    slug: PropTypes.string,
    active: PropTypes.bool,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    createdBy: PropTypes.number,
    updatedBy: PropTypes.number,
    // Additional fields from populated queries
    _count: PropTypes.shape({
      artPieces: PropTypes.number,
    }),
  }),

  /**
   * Success callback function called after successful form operations
   * @type {Function}
   */
  onSuccess: PropTypes.func,

  /**
   * Cancel callback function called when form is cancelled
   * @type {Function}
   */
  onCancel: PropTypes.func,
};
