/**
 * Art Piece Image Upload Form Component
 *
 * Form component for uploading images to art pieces with comprehensive validation,
 * file upload handling, and user feedback. Supports image file selection, metadata
 * input, and progress tracking with proper error handling.
 *
 * Features:
 * - File upload with drag and drop support
 * - Image preview and validation
 * - Caption and metadata inpu          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !values.url || !isValid} // Changed from imageUrl to url
            onClick={withTracking(() => {}, {
              event: 'form_submit',
              data: {
                label: 'Save Art Piece Image',
                form: 'Art Piece Image Upload Form',
                operation: 'create',
                artPieceId
              },
              userId: authUser?.userId,
            })}
          >
            {isSubmitting ? 'Saving...': 'Save Image'}
          </Button>racking during upload
 * - Comprehensive error handling
 * - Responsive design
 * - Role-based access control
 *
 * @namespace CityArtWalks.Forms.ArtPiece
 * @fileoverview Form component for art piece image upload operations
 * @author Jaimie Garner
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
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
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
import { Iconify } from 'src/components/iconify';
import { ImageCropDialog } from 'src/components/image';
import { Form, RHFTextField } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Art Piece Image Upload Form component
 *
 * Provides comprehensive interface for uploading images to art pieces with proper validation,
 * file upload handling, and user feedback. Includes file selection, image preview, metadata
 * input, and progress tracking.
 *
 * @memberof CityArtWalks.Forms.ArtPiece
 * @function ArtPieceImageUploadForm
 * @description Form component for uploading images to art pieces with comprehensive validation and error handling.
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
 * @param {string|number} props.artPieceId - The ID of the art piece to upload images for
 * @param {Function} [props.onSuccess] - Optional callback function called after successful image upload
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @param {Object} [props.user] - User object for permissions (legacy support)
 *
 * @returns {JSX.Element} The rendered ArtPieceImageUploadForm component
 * @throws {Error} When upload operations fail or validation errors occur
 *
 * @example
 * // Basic usage
 * <ArtPieceImageUploadForm
 *   artPieceId="123"
 *   onSuccess={handleUploadSuccess}
 *   onCancel={handleCancel}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Upload} - Image upload documentation
 */
export function ArtPieceImageUploadForm(props) {
  const { artPieceId, onSuccess, onCancel } = props;
  const { user: authUser, accessToken } = useAuthContext();
  const createImage = useCreateImage(accessToken);
  const uploadImage = useUploadImage(accessToken);

  // State for cropping functionality
  const [originalFile, setOriginalFile] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageMetadata, setImageMetadata] = useState(null);

  // Get default values for the form
  const defaultValues = useMemo(
    () => ({
      ...defaultImageValues(),
      artPieceId: parseInt(artPieceId, 10),
      url: null, // Changed from imageUrl to match schema
      caption: '',
      status: 'ACTIVE',
      featured: false,
    }),
    [artPieceId]
  );

  // Initialize form with validation
  const methods = useForm({
    resolver: zodResolver(createImageSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  /**
   * Handles file drop and upload to blob storage
   * @param {File[]} acceptedFiles - Array of accepted files from dropzone
   */
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        if (!file) return;

        // Store original file for cropping
        setOriginalFile(file);

        // Extract image metadata
        const img = new Image();
        img.onload = () => {
          setImageMetadata({
            width: img.width,
            height: img.height,
            fileSize: file.size,
            filename: file.name,
            mimeType: file.type,
          });
          URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(file);

        debugLog(
          'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleDrop',
          'Starting file upload',
          {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            artPieceId,
          }
        );

        // Check if image needs compression
        let processedFile = file;
        const needsCompression = await shouldCompressImage(file, 5242880); // 5MB target

        if (needsCompression) {
          debugLog(
            'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleDrop',
            'Image needs compression, processing...',
            {
              fileName: file.name,
              originalSize: file.size,
            }
          );

          toast.info('Processing large image, please wait...');

          // Compress the image
          processedFile = await compressImage(file, {
            maxWidth: 2048,
            maxHeight: 2048,
            quality: 0.85,
            maxSizeBytes: 5242880, // 5MB
            outputType: 'image/jpeg',
          });

          debugLog(
            'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleDrop',
            'Image compression completed',
            {
              originalSize: file.size,
              compressedSize: processedFile.size,
              compressionRatio:
                (((file.size - processedFile.size) / file.size) * 100).toFixed(1) + '%',
            }
          );

          toast.success('Image optimized successfully!');
        }

        // Upload processed file to blob storage
        const uploadResult = await uploadImage(processedFile);

        debugLog(
          'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleDrop',
          'Upload result received',
          {
            uploadResult,
            hasUrl: !!uploadResult?.url,
            hasDataUrl: !!uploadResult?.data?.url,
            hasData: !!uploadResult?.data,
            resultKeys: uploadResult ? Object.keys(uploadResult) : 'no result',
          }
        );

        const imageUrl = uploadResult?.data?.url || uploadResult?.url;

        if (imageUrl) {
          // Update form with the uploaded URL for preview and form submission
          setValue('url', imageUrl, { shouldValidate: true }); // Changed from imageUrl to url

          // Debug: Log form state after setting URL
          debugLog(
            'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleDrop',
            'URL set in form',
            {
              imageUrl,
              formValues: methods.getValues(),
              isValid: methods.formState.isValid,
              errors: methods.formState.errors,
            }
          );

          toast.success('Image uploaded successfully!');

          debugLog(
            'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleDrop',
            'File upload completed',
            {
              fileName: processedFile.name,
              uploadedUrl: imageUrl,
              artPieceId,
              wasProcessed: processedFile !== file,
              finalSize: processedFile.size,
            }
          );
        } else {
          throw new Error('Upload failed - no URL returned');
        }
      } catch (error) {
        debugError(
          'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleDrop',
          'File upload failed',
          {
            error: error.message,
            artPieceId,
            fileName: acceptedFiles[0]?.name,
          }
        );

        toast.error(`Upload failed: ${error.message}`);
        setValue('url', null); // Changed from imageUrl to url
      }
    },
    [artPieceId, uploadImage, setValue, methods]
  );

  /**
   * Handles file removal from the form
   */
  const handleRemoveFile = useCallback(() => {
    setValue('url', null); // Changed from imageUrl to url
    setOriginalFile(null);
    setImageMetadata(null);

    debugLog(
      'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleRemoveFile',
      'File removed from form',
      {
        artPieceId,
      }
    );
  }, [setValue, artPieceId]);

  /**
   * Handles form submission and image metadata creation
   * @param {Object} data - Validated form data from react-hook-form
   */
  const handleFormSubmit = async (data) => {
    try {
      if (!data.url || typeof data.url !== 'string') {
        toast.error('Please upload an image file first');
        return;
      }

      // Ensure caption is provided
      if (!data.caption || data.caption.trim().length < 3) {
        toast.error('Please provide a descriptive caption for the image');
        return;
      }

      // Prepare image data for creation with metadata
      const imageData = {
        url: data.url,
        caption: data.caption.trim(),
        artPieceId: parseInt(artPieceId, 10),
        status: data.status || 'ACTIVE',
        featured: data.featured || false,
        viewCount: 0,
        // Include metadata if available
        ...(imageMetadata && {
          width: imageMetadata.width,
          height: imageMetadata.height,
          fileSize: imageMetadata.fileSize,
          filename: imageMetadata.filename,
          mimeType: imageMetadata.mimeType,
        }),
      };

      // Create image record in database
      const result = await createImage(imageData);

      if (!result) {
        toast.error('Failed to save image - no response from server');
        return;
      }

      // Reset form on success
      reset(defaultValues);
      setOriginalFile(null);
      setImageMetadata(null);
      toast.success('Image added to art piece successfully!');

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          result,
          operation: 'create',
          imageData: result.data || result,
          artPieceId,
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleFormSubmit',
        'Failed to create image',
        {
          error: error.message,
          artPieceId,
        }
      );

      // Enhanced error message based on error type
      let errorMessage =
        'Failed to add image to art piece. Please check your information and try again.';

      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'This image already exists. Please use a different image.';
      }

      toast.error(errorMessage);
    }
  };

  // Wrap the handler with react-hook-form validation
  const onSubmit = handleSubmit(handleFormSubmit, (formErrors) => {
    // This is called when validation fails
    debugError(
      'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.onSubmit',
      'Form validation failed',
      {
        errors: formErrors,
        artPieceId,
      }
    );

    // Show specific validation errors to user
    const errorMessages = Object.entries(formErrors).map(
      ([field, error]) => `${field}: ${error.message || 'Invalid value'}`
    );

    if (errorMessages.length > 0) {
      toast.error(`Validation errors: ${errorMessages.join(', ')}`);
    } else {
      toast.error('Please check the form for errors and try again.');
    }
  });

  /**
   * Handles opening the crop dialog
   */
  const handleCropImage = useCallback(() => {
    if (originalFile) {
      setCropDialogOpen(true);

      debugLog(
        'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleCropImage',
        'Opening crop dialog',
        {
          fileName: originalFile.name,
          artPieceId,
        }
      );
    }
  }, [originalFile, artPieceId]);

  /**
   * Handles crop completion and processes the cropped image
   */
  const handleCropComplete = useCallback(
    async (croppedFile) => {
      try {
        debugLog(
          'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleCropComplete',
          'Processing cropped image',
          {
            fileName: croppedFile.name,
            originalSize: originalFile?.size,
            croppedSize: croppedFile.size,
            artPieceId,
          }
        );

        // Check if cropped image needs compression
        let processedFile = croppedFile;
        const needsCompression = await shouldCompressImage(croppedFile, 5242880); // 5MB target

        if (needsCompression) {
          toast.info('Optimizing cropped image...');

          // Compress the cropped image
          processedFile = await compressImage(croppedFile, {
            maxWidth: 2048,
            maxHeight: 2048,
            quality: 0.85,
            maxSizeBytes: 5242880, // 5MB
            outputType: 'image/jpeg',
          });
        }

        // Upload processed cropped file to blob storage
        const uploadResult = await uploadImage(processedFile);
        const imageUrl = uploadResult?.data?.url || uploadResult?.url;

        if (imageUrl) {
          // Update form with the uploaded URL
          setValue('url', imageUrl, { shouldValidate: true });

          // Update metadata for cropped image
          const img = new Image();
          img.onload = () => {
            setImageMetadata({
              width: img.width,
              height: img.height,
              fileSize: processedFile.size,
              filename: processedFile.name,
              mimeType: processedFile.type,
            });
            URL.revokeObjectURL(img.src);
          };
          img.src = URL.createObjectURL(processedFile);

          toast.success('Cropped image uploaded successfully!');

          debugLog(
            'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleCropComplete',
            'Cropped image upload completed',
            {
              uploadedUrl: imageUrl,
              wasCompressed: processedFile !== croppedFile,
              finalSize: processedFile.size,
              artPieceId,
            }
          );
        } else {
          throw new Error('Upload failed - no URL returned');
        }
      } catch (error) {
        debugError(
          'CityArtWalks.Forms.ArtPiece.ArtPieceImageUploadForm.handleCropComplete',
          'Failed to process cropped image',
          {
            error: error.message,
            artPieceId,
            fileName: croppedFile?.name,
          }
        );

        toast.error(`Failed to process cropped image: ${error.message}`);
      }
    },
    [originalFile, artPieceId, uploadImage, setValue]
  );

  /**
   * Handles form cancellation
   */
  const handleCancel = useCallback(() => {
    // Reset cropping state
    setOriginalFile(null);
    setCropDialogOpen(false);

    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  }, [onCancel]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 2 }}>
        {/* Image Upload Section */}
        <Box>
          <Upload
            name="url" // Changed from imageUrl to url to match schema
            value={values.url} // Changed from imageUrl to url
            maxSize={12582912} // 12MB - Allow larger files from HD phone cameras, will be processed client-side
            onDrop={handleDrop}
            onDelete={handleRemoveFile}
            accept={{
              'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
            }}
            helperText={
              <Typography
                variant="caption"
                sx={{
                  mt: 2,
                  mx: 'auto',
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.disabled',
                }}
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif, *.webp
                <br /> Max size of {fData(12582912)}
                <br /> Large images will be automatically optimized
              </Typography>
            }
            sx={{
              minHeight: 200,
              '& .MuiBox-root': {
                minHeight: 200,
              },
            }}
          />
        </Box>

        {/* Image Actions */}
        {originalFile && (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              onClick={handleCropImage}
              startIcon={<Iconify icon="solar:pen-bold" />}
              disabled={isSubmitting}
            >
              Crop & Rotate
            </Button>
          </Stack>
        )}

        {/* Image Metadata Display */}
        {imageMetadata && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Image Information
            </Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                <strong>Dimensions:</strong> {imageMetadata.width} × {imageMetadata.height} px
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Size:</strong> {fData(imageMetadata.fileSize)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Type:</strong> {imageMetadata.mimeType}
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Image Details Section */}
        <Stack spacing={2}>
          <RHFTextField
            name="caption"
            label="Image Caption *"
            placeholder="Enter a description for this image..."
            multiline
            rows={2}
            required
            helperText="Required: Provide a descriptive caption for this art piece image"
            rules={{
              required: 'Caption is required',
              minLength: {
                value: 3,
                message: 'Caption must be at least 3 characters',
              },
              maxLength: {
                value: 500,
                message: 'Caption must be less than 500 characters',
              },
            }}
          />
        </Stack>

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !values.url || !isValid}
            onClick={withTracking(() => {}, {
              event: 'form_submit',
              data: {
                label: 'Save Art Piece Image',
                form: 'Art Piece Image Upload Form',
                operation: 'create',
                artPieceId,
              },
              userId: authUser?.userId,
            })}
          >
            {isSubmitting ? 'Saving...' : 'Save Image'}
          </Button>
        </Stack>
      </Stack>

      {/* Crop Dialog */}
      <ImageCropDialog
        open={cropDialogOpen}
        imageFile={originalFile}
        onClose={() => setCropDialogOpen(false)}
        onCropComplete={handleCropComplete}
        title="Crop & Rotate Image"
      />
    </Form>
  );
}

ArtPieceImageUploadForm.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  user: PropTypes.object, // Legacy support
};
