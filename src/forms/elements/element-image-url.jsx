/**
 * @namespace CityArtWalks.Forms.Elements.ImageUrl
 * @version 2.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for image URL input with upload functionality and preview
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image} - Image entity documentation
 */

import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { debugError } from 'src/lib/debug';
import { useUploadImage } from 'src/actions/image/hooks';

import { Iconify } from 'src/components/iconify';
import { CloseIcon, UploadIcon } from 'src/components/icons';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.ImageUrl
 * @function ElementImageUrl
 * @description Form element component for image URL input with upload functionality and live preview.
 *
 * This component provides both manual URL entry and file upload functionality using the new
 * upload route workflow. It displays a live preview of the image and validates URLs in real-time.
 *
 * Features:
 * - Manual URL entry with live validation
 * - File upload with drag and drop using separate upload route
 * - Live image preview for both uploaded files and URLs
 * - Progress indicator during upload
 * - Image URL validation with visual feedback
 * - Error handling for upload failures and invalid URLs
 * - React Hook Form integration
 * - Accessible form controls
 * - Clear/remove image functionality
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="url"] - The name of the form field
 * @param {string} [props.label="Image URL"] - Label text for the input field
 * @param {string} [props.placeholder="Enter image URL or upload file"] - Placeholder text
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {Array<string>} [props.acceptedTypes=['image/*']] - Accepted file types for upload
 * @param {number} [props.maxFileSize=5242880] - Maximum file size in bytes (default 5MB)
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered image URL input element with upload functionality
 *
 * @example
 * // Basic usage
 * <ElementImageUrl />
 *
 * @example
 * // With custom settings
 * <ElementImageUrl
 *   name="imageUrl"
 *   label="Upload Image"
 *   required
 *   maxFileSize={10485760} // 10MB
 *   acceptedTypes={['image/jpeg', 'image/png']}
 * />
 */
export function ElementImageUrl(props) {
  const {
    name = 'url',
    label = 'Image URL',
    placeholder = 'Enter image URL or upload file',
    required = false,
    disabled = false,
    helperText,
    acceptedTypes = ['image/*'],
    maxFileSize = 5242880, // 5MB default
    ...other
  } = props;

  const { control, setValue, watch } = useFormContext();
  const uploadImage = useUploadImage();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Watch the field value
  const fieldValue = watch(name);

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageUrl.ElementImageUrl
   * @function validateImageUrl
   * @description Validates if a URL points to a valid image.
   * @param {string} url - The URL to validate
   * @returns {Promise<boolean>} Whether the URL is a valid image
   */
  const validateImageUrl = async (url) => {
    if (!url || typeof url !== 'string') return false;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageUrl.ElementImageUrl
   * @function updatePreview
   * @description Updates the image preview based on the current URL.
   * @param {string} url - The image URL to preview
   */
  const updatePreview = useCallback(async (url) => {
    if (!url) {
      setImagePreview(null);
      return;
    }

    const isValid = await validateImageUrl(url);
    setImagePreview(isValid ? url : null);
  }, []);

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageUrl.ElementImageUrl
   * @function handleFileUpload
   * @description Handles file upload using the upload hook and sets the returned URL to the form field.
   * @param {File} file - The file to upload
   * @param {Function} onChange - React Hook Form field onChange function
   */
  const handleFileUpload = async (file, onChange) => {
    if (!file) return;

    // Validate file type
    const isValidType = acceptedTypes.some((type) => {
      if (type === 'image/*') return file.type.startsWith('image/');
      return file.type === type;
    });

    if (!isValidType) {
      setUploadError(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setUploadError(
        `File size too large. Maximum size: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`
      );
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload file using the upload hook
      const result = await uploadImage(file);

      if (result?.data?.url) {
        // Set the returned URL to the form field
        onChange(result.data.url);
        setValue(name, result.data.url);

        // Update preview with the new URL
        await updatePreview(result.data.url);
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.Elements.ImageUrl.ElementImageUrl.handleFileUpload',
        'Image upload failed',
        {
          error: error.message,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          maxFileSize,
          acceptedTypes,
        }
      );
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageUrl.ElementImageUrl
   * @function handleFileSelect
   * @description Handles file selection from input or drag and drop.
   * @param {Event} event - The file input change event
   * @param {Function} onChange - React Hook Form field onChange function
   */
  const handleFileSelect = (event, onChange) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, onChange);
    }
  };

  /**
   * @memberof CityArtWalks.Forms.Elements.ImageUrl.ElementImageUrl
   * @function handleDrop
   * @description Handles drag and drop file upload.
   * @param {DragEvent} event - The drop event
   * @param {Function} onChange - React Hook Form field onChange function
   */
  const handleDrop = (event, onChange) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file, onChange);
    }
  };

  // Initialize preview when field has an initial value
  useEffect(() => {
    if (fieldValue && !imagePreview && !isUploading) {
      updatePreview(fieldValue);
    }
  }, [fieldValue, imagePreview, isUploading, updatePreview]);

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...field }, fieldState: { error } }) => {
          // Handle URL changes to update preview
          const handleUrlChange = async (event) => {
            const newValue = event.target.value;
            onChange(newValue);

            // Update preview when URL changes (with debounce)
            if (newValue && newValue !== value) {
              setTimeout(() => updatePreview(newValue), 500);
            } else if (!newValue) {
              setImagePreview(null);
            }
          };

          return (
            <Box>
              <TextField
                {...field}
                value={value || ''}
                onChange={handleUrlChange}
                fullWidth
                label={label}
                placeholder={placeholder}
                required={required}
                disabled={disabled || isUploading}
                error={!!(error || uploadError)}
                helperText={error?.message || uploadError || helperText}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isUploading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <IconButton component="label" disabled={disabled} sx={{ p: 0.5 }}>
                          <UploadIcon />
                          <input
                            type="file"
                            hidden
                            accept={acceptedTypes.join(',')}
                            onChange={(e) => handleFileSelect(e, onChange)}
                          />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                onDrop={(e) => handleDrop(e, onChange)}
                onDragOver={(e) => e.preventDefault()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover': {
                      backgroundColor: alpha('#919EAB', 0.04),
                    },
                  },
                }}
                {...other}
              />

              {/* Upload Button Alternative */}
              <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  component="label"
                  disabled={disabled || isUploading}
                  startIcon={isUploading ? <CircularProgress size={16} /> : <UploadIcon />}
                >
                  {isUploading ? 'Uploading...' : 'Upload File'}
                  <input
                    type="file"
                    hidden
                    accept={acceptedTypes.join(',')}
                    onChange={(e) => handleFileSelect(e, onChange)}
                  />
                </Button>
                <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                  or drag and drop a file above
                </Box>
              </Box>

              {/* Image Preview */}
              {imagePreview && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Image preview"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <Box>
                    <Box sx={{ typography: 'caption', color: 'text.secondary' }}>Preview</Box>
                    <Box
                      sx={{
                        typography: 'caption',
                        color: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Iconify icon="solar:check-circle-bold" width={16} />
                      Valid image URL
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      onChange('');
                      setValue(name, '');
                      setImagePreview(null);
                    }}
                    sx={{ ml: 'auto' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}

              {/* Invalid URL indicator */}
              {value && !imagePreview && !isUploading && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify
                    icon="solar:info-circle-bold"
                    width={16}
                    sx={{ color: 'warning.main' }}
                  />
                  <Box sx={{ typography: 'caption', color: 'warning.main' }}>
                    Unable to load image from URL
                  </Box>
                </Box>
              )}
            </Box>
          );
        }}
      />
    </ErrorBoundary>
  );
}

ElementImageUrl.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  maxFileSize: PropTypes.number,
};
