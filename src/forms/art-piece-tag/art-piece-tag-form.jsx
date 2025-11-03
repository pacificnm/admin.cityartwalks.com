/**
 * @file art-piece-tag-form.jsx
 * @description Form component for creating and updating art piece tag information with validation and error handling.
 * @author GitHub Copilot
 * @version 1.0.0
 * @namespace CityArtWalks.Forms.ArtPieceTag
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag entity documentation
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
import { useCreateArtPieceTag, useUpdateArtPieceTag } from 'src/actions/art-piece-tag/hooks';
import { ElementName, ElementAudit, ElementActive, ElementDescription } from 'src/forms/elements';
import {
  createArtPieceTagSchema,
  updateArtPieceTagSchema,
  defaultArtPieceTagValues,
} from 'src/validators/art-piece-tag';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.ArtPieceTag
 * @function ArtPieceTagForm
 * @description Form component for creating and updating art piece tag information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentArtPieceTag=null] - Current art piece tag data for editing, null for creating new tag
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ArtPieceTagForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceTagForm(props) {
  const { currentArtPieceTag = null, onSuccess, onCancel } = props;
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentArtPieceTag);

  // Use appropriate hooks for create/update operations - pass the token to the hooks
  const createArtPieceTag = useCreateArtPieceTag(accessToken);
  const updateArtPieceTag = useUpdateArtPieceTag(accessToken);

  // Get default values using validator utility
  const defaultValues = defaultArtPieceTagValues(currentArtPieceTag);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateArtPieceTagSchema : createArtPieceTagSchema;

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
   * @memberof CityArtWalks.Forms.ArtPieceTag.ArtPieceTagForm
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
        // Update existing art piece tag
        if (!currentArtPieceTag.artPieceTagId) {
          debugError(
            'CityArtWalks.Forms.ArtPieceTag.ArtPieceTagForm.onSubmit',
            'Art piece tag ID is required for update operation',
            {
              currentArtPieceTag: currentArtPieceTag ? 'provided' : 'null',
              hasArtPieceTagId: !!currentArtPieceTag?.artPieceTagId,
            }
          );
          toast.error('Art piece tag ID is required for update operation');
          return;
        }

        result = await updateArtPieceTag(currentArtPieceTag.artPieceTagId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPieceTag.ArtPieceTagForm.onSubmit',
            'Update art piece tag operation returned null result',
            {
              artPieceTagId: currentArtPieceTag.artPieceTagId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update art piece tag - no response from server');
          return;
        }

        // Reset form with updated data - ensure no null values for form inputs
        const updatedTagData = result.data || result || currentArtPieceTag;
        const resetValues = defaultArtPieceTagValues(updatedTagData);
        reset(resetValues);
        toast.success('Art piece tag has been updated successfully!');
      } else {
        // Create new art piece tag
        result = await createArtPieceTag(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPieceTag.ArtPieceTagForm.onSubmit',
            'Create art piece tag operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create art piece tag - no response from server');
          return;
        }

        // Reset form with created tag data - ensure no null values for form inputs
        const createdTagData = result.data || result;
        const resetValues = defaultArtPieceTagValues(createdTagData);
        reset(resetValues);
        toast.success('Art piece tag created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.ArtPieceTag.ArtPieceTagForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} art piece tag`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          artPieceTagId: currentArtPieceTag?.artPieceTagId,
          formData: data ? 'provided' : 'missing',
          timestamp: new Date().toISOString(),
        }
      );

      // Show user-friendly error message
      const operation = isEdit ? 'update' : 'create';
      toast.error(
        `Failed to ${operation} art piece tag. Please check your information and try again.`
      );
    }
  });

  /**
   * @memberof CityArtWalks.Forms.ArtPieceTag.ArtPieceTagForm
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
        {/* Tag Information Section */}
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
            label="Tag name"
            required
            placeholder="e.g., Modern, Abstract, Sculpture, Outdoor"
            helperText="Enter a descriptive tag name for categorizing art pieces"
          />

          <ElementDescription
            name="description"
            label="Description"
            placeholder="Describe what this tag represents or how it's used..."
            helperText="Optional description to clarify the tag's purpose and usage"
          />

          <ElementActive
            name="active"
            label="Active"
            helperText="Whether this tag is actively used for categorizing art pieces"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* System Information Section (for existing tags) */}
        {isEdit && currentArtPieceTag && (
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
                name="artPieceTagId"
                label="Tag ID"
                disabled
                helperText="System-generated identifier"
              />

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
            {isEdit ? 'Update tag' : 'Create tag'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
