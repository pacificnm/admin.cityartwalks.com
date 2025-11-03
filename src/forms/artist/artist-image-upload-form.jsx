/**
 * Artist Image Upload Form Component
 *
 * Form component for uploading images to artists with comprehensive validation,
 * file upload handling, and user feedback. Supports image file selection and
 * progress tracking with proper error handling.
 *
 * Features:
 * - File upload with drag and drop support
 * - Image preview and validation
 * - Progress tracking during upload
 * - Comprehensive error handling
 * - Responsive design
 * - Owner-based access control
 *
 * @namespace CityArtWalks.Forms.Artist
 * @fileoverview Form component for artist image upload operations
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires react-hook-form - Form state management and validation
 * @requires @hookform/resolvers/zod - Zod resolver for react-hook-form
 * @requires @mui/material - Material-UI components
 * @requires src/actions/image - Image API request functions
 * @requires src/actions/artist - Artist API request functions
 * @requires src/components/upload - File upload components
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Upload} - Image upload documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { withTracking } from 'src/utils/with-tracking';

import { debugLog, debugError } from 'src/lib/debug';
import { updateArtistSchema } from 'src/validators/artist';
import { useUpdateArtist } from 'src/actions/artist/hooks';
import { useCreateImage, useUploadImage } from 'src/actions/image';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Artist Image Upload Form component
 *
 * Provides interface for uploading images to artists with proper validation,
 * file upload handling, and user feedback.
 *
 * @memberof CityArtWalks.Forms.Artist
 * @function ArtistImageUploadForm
 * @param {Object} props - Component props
 * @param {string|number} props.artistId - The ID of the artist to upload images for
 * @param {Function} [props.onSuccess] - Optional callback function called after successful image upload
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @param {string} [props.currentImageUrl] - Current image URL for the artist
 * @returns {JSX.Element} The rendered ArtistImageUploadForm component
 *
 * @example
 * <ArtistImageUploadForm
 *   artistId="123"
 *   onSuccess={handleSuccess}
 *   onCancel={handleCancel}
 *   currentImageUrl="/current-image.jpg"
 * />
 */
export function ArtistImageUploadForm(props) {
  const { artistId, onSuccess, onCancel, currentImageUrl } = props;
  const { user, accessToken } = useAuthContext();

  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const createImage = useCreateImage(accessToken);
  const uploadImage = useUploadImage(accessToken);
  const updateArtist = useUpdateArtist(accessToken);

  const handleFileSelect = (files) => {
    const file = files?.[0];
    if (file) {
      setSelectedFile(file);
      debugLog(
        'CityArtWalks.Forms.Artist.ArtistImageUploadForm.handleFileSelect',
        'File selected for upload',
        { fileName: file.name, fileSize: file.size, artistId }
      );
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !artistId) {
      toast.error('Please select a file and ensure artist ID is provided');
      return;
    }

    setUploading(true);
    try {
      debugLog(
        'CityArtWalks.Forms.Artist.ArtistImageUploadForm.handleUpload',
        'Starting upload process',
        { fileName: selectedFile.name, artistId }
      );

      // Step 1: Upload the image file to get a public URL
      const uploadResponse = await uploadImage(selectedFile);
      const uploadedImageUrl = uploadResponse?.data?.url || uploadResponse?.url;

      if (uploadedImageUrl) {
        debugLog(
          'CityArtWalks.Forms.Artist.ArtistImageUploadForm.handleUpload',
          'Image uploaded successfully',
          { uploadedImageUrl, artistId }
        );

        toast.success('Image uploaded successfully');

        // Step 2: Create image record associated with this artist
        const imagePayload = {
          url: uploadedImageUrl,
          caption: selectedFile.name,
          artistId: parseInt(artistId, 10),
          status: 'ACTIVE',
          featured: false,
          viewCount: 0,
        };

        const createResponse = await createImage(imagePayload);

        // Step 3: Update artist model with the new image URL (cover image)
        try {
          const updateData = updateArtistSchema.parse({ imageUrl: uploadedImageUrl });
          const updatedArtist = await updateArtist(parseInt(artistId, 10), updateData);

          toast.success('Artist image saved successfully');

          // Notify parent after successful update
          if (onSuccess) {
            await onSuccess({
              imageData: createResponse?.data || imagePayload,
              result: createResponse,
              uploadedUrl: uploadedImageUrl,
              artistId,
              updatedArtist,
            });
          }
        } catch (updateErr) {
          debugError(
            'CityArtWalks.Forms.Artist.ArtistImageUploadForm.handleUpload',
            'Artist update failed',
            { error: updateErr.message, artistId, uploadedImageUrl }
          );
          throw new Error(`Saved image record but failed to update artist: ${updateErr.message}`);
        }

        // Reset form
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('Failed to upload image file');
      }
    } catch (error) {
      debugError('CityArtWalks.Forms.Artist.ArtistImageUploadForm.handleUpload', 'Upload failed', {
        error: error.message,
        artistId,
        fileName: selectedFile.name,
      });
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onCancel) {
      onCancel();
    }
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 1 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Select an image to upload as the artist&apos;s cover photo.
      </Typography>

      {currentImageUrl && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Current Image:
          </Typography>
          <Box
            component="img"
            src={currentImageUrl}
            alt="Current artist image"
            sx={{
              width: '100%',
              maxWidth: 200,
              height: 120,
              objectFit: 'cover',
              borderRadius: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
      )}

      <Upload
        multiple={false}
        accept={{
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
        }}
        onDrop={handleFileSelect}
        value={selectedFile || undefined}
        onDelete={handleRemoveSelected}
        maxSize={10 * 1024 * 1024} // 10MB
        helperText="Select image file (max 10MB)"
      />

      {selectedFile && (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </Typography>
        </Box>
      )}

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={handleCancel} disabled={uploading}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={uploading || !selectedFile}
          onClick={withTracking(handleUpload, {
            event: 'form_submit',
            data: {
              label: 'Upload Artist Image',
              form: 'Artist Image Upload Form',
              operation: 'create',
              artistId,
            },
            userId: user?.id,
          })}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </Stack>
    </Stack>
  );
}

/**
 * PropTypes for ArtistImageUploadForm component
 * @memberof CityArtWalks.Forms.Artist.ArtistImageUploadForm
 */
ArtistImageUploadForm.propTypes = {
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  currentImageUrl: PropTypes.string,
};
