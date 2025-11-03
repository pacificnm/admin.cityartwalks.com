/**
 * @file art-piece-material-form.jsx
 * @description Form component for creating and updating art piece material information with validation and error handling.
 * @author GitHub Copilot
 * @version 1.0.0
 * @namespace CityArtWalks.Forms.ArtPieceMaterial
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Material-Model} - ArtPieceMaterial entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { debugError } from 'src/lib/debug';
import {
  useCreateArtPieceMaterial,
  useUpdateArtPieceMaterial,
} from 'src/actions/art-piece-materials/hooks';
import {
  createArtPieceMaterialSchema,
  updateArtPieceMaterialSchema,
  defaultArtPieceMaterialValues,
} from 'src/validators/art-piece-material';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.ArtPieceMaterial
 * @function ArtPieceMaterialForm
 * @description Form component for creating and updating art piece material information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentArtPieceMaterial=null] - Current art piece material data for editing, null for creating new material
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ArtPieceMaterialForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Material-Model} - ArtPieceMaterial entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceMaterialForm({ currentArtPieceMaterial = null, onSuccess, onCancel }) {
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentArtPieceMaterial);

  // Use appropriate hooks for create/update operations
  const createArtPieceMaterial = useCreateArtPieceMaterial(accessToken);
  const updateArtPieceMaterial = useUpdateArtPieceMaterial(accessToken);

  // Get default values using validator utility
  const defaultValues = defaultArtPieceMaterialValues(currentArtPieceMaterial);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateArtPieceMaterialSchema : createArtPieceMaterialSchema;

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
   * @memberof CityArtWalks.Forms.ArtPieceMaterial.ArtPieceMaterialForm
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
        // Update existing art piece material
        if (!currentArtPieceMaterial.artPieceMaterialId) {
          debugError(
            'CityArtWalks.Forms.ArtPieceMaterial.ArtPieceMaterialForm.onSubmit',
            'Art piece material ID is required for update operation',
            {
              currentArtPieceMaterial: currentArtPieceMaterial ? 'provided' : 'null',
              hasArtPieceMaterialId: !!currentArtPieceMaterial?.artPieceMaterialId,
            }
          );
          toast.error('Art piece material ID is required for update operation');
          return;
        }

        result = await updateArtPieceMaterial(currentArtPieceMaterial.artPieceMaterialId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPieceMaterial.ArtPieceMaterialForm.onSubmit',
            'Update art piece material operation returned null result',
            {
              artPieceMaterialId: currentArtPieceMaterial.artPieceMaterialId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update art piece material - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedMaterialData = result.data || result || currentArtPieceMaterial;
        reset(defaultArtPieceMaterialValues(updatedMaterialData));
        toast.success('Art piece material has been updated successfully!');
      } else {
        // Create new art piece material
        result = await createArtPieceMaterial(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPieceMaterial.ArtPieceMaterialForm.onSubmit',
            'Create art piece material operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create art piece material - no response from server');
          return;
        }

        // Reset form with created material data
        const createdMaterialData = result.data || result;
        reset(defaultArtPieceMaterialValues(createdMaterialData));
        toast.success('Art piece material created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.ArtPieceMaterial.ArtPieceMaterialForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} art piece material`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          artPieceMaterialId: currentArtPieceMaterial?.artPieceMaterialId,
          formData: data ? 'provided' : 'missing',
          timestamp: new Date().toISOString(),
        }
      );

      // Show user-friendly error message
      const operation = isEdit ? 'update' : 'create';
      toast.error(
        `Failed to ${operation} art piece material. Please check your information and try again.`
      );
    }
  });

  /**
   * @memberof CityArtWalks.Forms.ArtPieceMaterial.ArtPieceMaterialForm
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
        {/* Material Information Section */}
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
          }}
        >
          <Field.Text
            name="name"
            label="Material name"
            required
            placeholder="e.g., Bronze, Marble, Wood, Steel"
            helperText="Enter the name of the art piece material"
          />

          <Field.Text
            name="description"
            label="Description"
            multiline
            rows={4}
            placeholder="Describe the material properties, characteristics, or usage..."
            helperText="Optional description of the material"
          />

          <Field.Switch
            name="active"
            label="Active"
            helperText="Whether this material is actively used in the system"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* System Information Section (for existing materials) */}
        {isEdit && currentArtPieceMaterial && (
          <>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text
                name="artPieceMaterialId"
                label="Material ID"
                disabled
                helperText="System-generated identifier"
              />

              <Field.DateTimePicker
                name="createdAt"
                label="Created At"
                disabled
                helperText="When this material was created"
              />

              <Field.DateTimePicker
                name="updatedAt"
                label="Last Updated"
                disabled
                helperText="When this material was last modified"
              />
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
            {isEdit ? 'Update material' : 'Create material'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
