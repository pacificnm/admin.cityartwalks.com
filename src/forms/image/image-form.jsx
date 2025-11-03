/**
 * @version 2.0.0
 * @author Jaimie Garner
 * @memberof CityArtWalks.Forms.Image
 */

'use client';

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';

import { debugError } from 'src/lib/debug';
import { useCreateImage, useUpdateImage } from 'src/actions/image/hooks';
import { createImageSchema, updateImageSchema, defaultImageValues } from 'src/validators/image';
import {
  ElementActive,
  ElementImageUrl,
  ElementImageTags,
  ElementImageTitle,
  ElementImageDescription,
} from 'src/forms/elements';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Image
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentImage=null] - Current image data for editing, null for creating new image
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ImageForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image} - Image entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */
export function ImageForm(props) {
  const { currentImage = null, onSuccess, onCancel } = props;
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentImage);

  // Use appropriate hooks for create/update operations
  const createImageHook = useCreateImage(accessToken);
  const updateImageHook = useUpdateImage(accessToken);

  // Get default values using validator utility
  const defaultValues = useMemo(() => defaultImageValues(currentImage), [currentImage]);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateImageSchema : createImageSchema;

  // Initialize form methods
  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * @memberof CityArtWalks.Forms.Image.ImageForm
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
        // Update existing image
        if (!currentImage?.imageId) {
          debugError(
            'CityArtWalks.Forms.Image.ImageForm.onSubmit',
            'Image ID is required for update operation',
            {
              currentImage: currentImage ? 'provided' : 'null',
              hasImageId: !!currentImage?.imageId,
            }
          );
          toast.error('Image ID is required for update operation');
          return;
        }

        result = await updateImageHook(currentImage.imageId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Image.ImageForm.onSubmit',
            'Update image operation returned null result',
            {
              imageId: currentImage.imageId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update image - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedImageData = result.data || result || currentImage;
        reset(defaultImageValues(updatedImageData));
        toast.success('Your image has been updated successfully!');
      } else {
        // Create new image
        result = await createImageHook(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Image.ImageForm.onSubmit',
            'Create image operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create image - no response from server');
          return;
        }

        // Reset form with created image data
        const createdImageData = result.data || result;
        reset(defaultImageValues(createdImageData));
        toast.success('Image created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          result,
          operation: isEdit ? 'update' : 'create',
          imageData: result.data || result,
          isEdit,
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.Image.ImageForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} image`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          imageId: currentImage?.imageId,
          formData: data ? Object.keys(data).join(', ') : 'missing',
          timestamp: new Date().toISOString(),
          isEdit,
          validationSchema: validationSchema.name || 'unknown',
        }
      );

      // Enhanced error message based on error type
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} image. Please check your information and try again.`;

      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'This image already exists. Please use different values.';
      }

      toast.error(errorMessage);
    }
  });

  /**
   * @memberof CityArtWalks.Forms.Image.ImageForm
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
        {/* Primary Information Section */}
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}
        >
          <ElementImageTitle name="title" label="Image Title" required />
          <ElementImageUrl name="url" label="Image URL" required />
          <ElementImageDescription name="description" label="Image Description" rows={4} />
          <ElementImageTags name="tags" label="Image Tags" maxTags={20} />
          <ElementActive name="active" label="Active" />
        </Box>

        {/* System Fields (Edit Only) */}
        {isEdit && currentImage && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 3 }}>
              <ElementImageTitle
                name="imageId"
                label="System ID"
                disabled
                helperText="System-generated identifier"
              />
            </Box>
          </>
        )}

        {/* Form Actions */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 3,
            justifyContent: 'flex-end',
          }}
        >
          {onCancel && (
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? 'Save changes' : 'Create image'}
          </LoadingButton>
        </Stack>
      </Card>
    </Form>
  );
}

ImageForm.propTypes = {
  currentImage: PropTypes.shape({
    imageId: PropTypes.number,
    url: PropTypes.string,
    caption: PropTypes.string,
    viewCount: PropTypes.number,
    featured: PropTypes.bool,
    status: PropTypes.string,
    uploadedAt: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    createdBy: PropTypes.number,
    updatedBy: PropTypes.number,
    artistId: PropTypes.number,
    artPieceId: PropTypes.number,
    pathId: PropTypes.number,
  }),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};
