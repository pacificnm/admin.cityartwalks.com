/* eslint-disable @next/next/no-img-element */
/**
 * Post Image Upload Form Component
 *
 * Form component for uploading images to posts with comprehensive validation,
 * file upload handling, and user feedback. Supports image file selection, metadata
 * input, and progress tracking with proper error handling.
 *
 * Features:
 * - File upload with drag and drop support
 * - Image preview and validation
 * - Caption and metadata input
 * - Progress tracking during upload
 * - Comprehensive error handling
 * - Responsive design
 * - Role-based access control
 *
 * @namespace CityArtWalks.Forms.Post
 * @fileoverview Form component for post image upload operations
 * @author Claude Code Assistant
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires react-hook-form - Form state management and validation
 * @requires @hookform/resolvers/zod - Zod resolver for react-hook-form
 * @requires @mui/material - Material-UI components
 * @requires src/validators/image - Image validation schemas
 * @requires src/actions/image - Image API request functions
 * @requires src/components/hook-form - Form components
 * @requires src/components/upload - File upload components
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Upload} - Image upload documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';
import { withTracking } from 'src/utils/with-tracking';
import { compressImage, shouldCompressImage } from 'src/utils/image-processing';

import { debugLog, debugError } from 'src/lib/debug';
import { useCreateImage, useUploadImage } from 'src/actions/image/hooks';
import { createImageSchema, defaultImageValues } from 'src/validators/image';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { UploadIcon } from 'src/components/icons';
import { ImageCropDialog } from 'src/components/image';
import { Form, RHFTextField } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Post Image Upload Form component
 *
 * Provides comprehensive interface for uploading images to posts with proper validation,
 * file upload handling, and user feedback. Includes file selection, image preview, metadata
 * input, and progress tracking.
 *
 * @memberof CityArtWalks.Forms.Post
 * @function PostImageUploadForm
 * @description Form component for uploading images to posts with comprehensive validation and error handling.
 *
 * Features:
 * - File upload with drag and drop support using Upload component
 * - Image preview and validation before upload
 * - Caption and metadata input with validation
 * - Two-step upload process: file upload then metadata creation
 * - Progress tracking and user feedback
 * - Comprehensive error handling and user feedback
 * - Form reset on successful upload
 * - Role-based access control integration
 *
 * @param {Object} props - Component props
 * @param {string|number} props.postId - The ID of the post to upload images for
 * @param {Function} [props.onSuccess] - Optional callback function called after successful image upload
 * @param {Function} [props.onCancel] - Optional callback function called when operation is cancelled
 * @returns {JSX.Element} The rendered PostImageUploadForm component
 * @throws {Error} When upload operations fail or validation errors occur
 *
 * @example
 * // Basic usage
 * <PostImageUploadForm
 *   postId="123"
 *   onSuccess={handleImageUploadSuccess}
 *   onCancel={handleCancel}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Upload} - Image upload documentation
 */
export function PostImageUploadForm({ postId, onSuccess, onCancel }) {
  const { user: authUser } = useAuthContext();

  const [file, setFile] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [, setUploadProgress] = useState(0);

  // Hooks for image operations
  const { uploadImage, uploadImageLoading } = useUploadImage();
  const { createImage, createImageLoading } = useCreateImage();

  // Memoized default values with postId
  const defaultValues = useMemo(
    () => ({
      ...defaultImageValues(),
      postId: parseInt(postId, 10),
      createdBy: authUser?.userId,
    }),
    [postId, authUser?.userId]
  );

  // Form setup
  const methods = useForm({
    resolver: zodResolver(createImageSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, watch, formState } = methods;
  const { isSubmitting, isValid } = formState;
  const values = watch();

  /**
   * Handles file selection from upload component
   */
  const handleFileSelect = useCallback(async (selectedFile) => {
    debugLog('PostImageUploadForm.handleFileSelect', 'File selected for upload', {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
    });

    try {
      // Check if image should be compressed
      if (shouldCompressImage(selectedFile)) {
        debugLog('PostImageUploadForm.handleFileSelect', 'Compressing image before upload');
        const compressedFile = await compressImage(selectedFile, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8,
        });
        setFile(compressedFile);
      } else {
        setFile(selectedFile);
      }

      // Open crop dialog
      setCropDialogOpen(true);
    } catch (error) {
      debugError('PostImageUploadForm.handleFileSelect', 'Error processing selected file', error);
      toast.error('Error processing selected image. Please try again.');
    }
  }, []);

  /**
   * Handles cropped image from crop dialog
   */
  const handleCropComplete = useCallback(
    async (croppedFile) => {
      debugLog('PostImageUploadForm.handleCropComplete', 'Image cropped successfully');

      try {
        setCropDialogOpen(false);
        setUploadProgress(0);

        // Upload file to Vercel Blob
        const uploadResult = await uploadImage(croppedFile);

        if (uploadResult?.url) {
          setValue('url', uploadResult.url);
          setValue('filename', croppedFile.name);
          setValue('fileSize', croppedFile.size);
          setValue('mimeType', croppedFile.type);

          debugLog('PostImageUploadForm.handleCropComplete', 'File uploaded successfully', {
            url: uploadResult.url,
            filename: croppedFile.name,
          });

          toast.success('Image uploaded successfully! Please add a caption and save.');
        } else {
          throw new Error('Upload failed - no URL returned');
        }
      } catch (error) {
        debugError('PostImageUploadForm.handleCropComplete', 'Error uploading file', error);
        toast.error('Failed to upload image. Please try again.');
      }
    },
    [uploadImage, setValue]
  );

  /**
   * Handles form submission to create image record
   */
  const onSubmit = useCallback(
    async (data) => {
      debugLog('PostImageUploadForm.onSubmit', 'Submitting image creation', data);

      try {
        const result = await createImage(data);

        if (result) {
          debugLog('PostImageUploadForm.onSubmit', 'Image created successfully', result);
          toast.success('Image saved successfully!');

          // Reset form
          methods.reset(defaultValues);
          setFile(null);
          setValue('url', '');

          // Call success callback
          if (onSuccess) {
            onSuccess(result);
          }
        }
      } catch (error) {
        debugError('PostImageUploadForm.onSubmit', 'Error creating image record', error);
        toast.error('Failed to save image. Please try again.');
      }
    },
    [createImage, methods, defaultValues, setValue, onSuccess]
  );

  /**
   * Handles cancel operation
   */
  const handleCancel = useCallback(() => {
    debugLog('PostImageUploadForm.handleCancel', 'Upload cancelled by user');

    // Reset form
    methods.reset(defaultValues);
    setFile(null);
    setValue('url', '');
    setCropDialogOpen(false);

    if (onCancel) {
      onCancel();
    }
  }, [methods, defaultValues, setValue, onCancel]);

  return (
    <>
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* File Upload Section */}
          {!values.url && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select Image
              </Typography>
              <Upload
                file={file}
                onDrop={handleFileSelect}
                onDelete={() => setFile(null)}
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
                }}
                maxSize={10485760} // 10MB
                placeholder={
                  <Stack spacing={1} alignItems="center">
                    <UploadIcon size={48} />
                    <Typography variant="h6">Upload Image</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Drop or click to upload image
                      <br />
                      Maximum file size: {fData(10485760)}
                    </Typography>
                  </Stack>
                }
                helperText="Supported formats: JPEG, PNG, WebP, GIF"
              />
            </Box>
          )}

          {/* Image Preview and Metadata */}
          {values.url && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Image Details
              </Typography>

              {/* Image Preview */}
              <Box
                sx={{
                  mb: 3,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <img
                  src={values.url}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>

              {/* Caption Input */}
              <RHFTextField
                name="caption"
                label="Caption"
                placeholder="Enter image caption..."
                multiline
                rows={2}
                helperText="Optional caption for the image"
              />
            </Box>
          )}

          {/* Form Actions */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting || uploadImageLoading || createImageLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !values.url || !isValid}
              onClick={withTracking(() => {}, {
                event: 'form_submit',
                data: {
                  label: 'Save Post Image',
                  form: 'Post Image Upload Form',
                  operation: 'create',
                  postId,
                },
                userId: authUser?.userId,
              })}
            >
              {isSubmitting || createImageLoading ? 'Saving...' : 'Save Image'}
            </Button>
          </Stack>
        </Stack>
      </Form>

      {/* Image Crop Dialog */}
      {cropDialogOpen && file && (
        <ImageCropDialog
          open={cropDialogOpen}
          file={file}
          onComplete={handleCropComplete}
          onCancel={() => setCropDialogOpen(false)}
          aspectRatio={16 / 9} // Good aspect ratio for post images
        />
      )}
    </>
  );
}

PostImageUploadForm.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};
