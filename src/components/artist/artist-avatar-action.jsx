/**
 * @namespace CityArtWalks.Components.Artist.ArtistAvatarAction
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useCreateImage } from 'src/actions/image';
import { useUpdateArtist } from 'src/actions/artist/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistAvatarAction
 * @function ArtistAvatarAction
 * @description Renders an upload action button for artist avatar images.
 * Handles file selection, upload, and artist record updates for admin users and content owners.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.artistId - The unique identifier of the artist, required for image uploads.
 * @param {string} [props.createdBy] - The user ID who created the artist, used for ownership check.
 * @param {boolean} [props.uploadable=false] - If true, shows camera icon and enables upload for owners or admins.
 * @param {Function} [props.onUploadSuccess] - Callback fired when upload is successful with the new image URL.
 * @returns {JSX.Element|null} The rendered ArtistAvatarAction component or null if not uploadable.
 *
 * @example
 * // Basic usage with upload functionality
 * import { ArtistAvatarAction } from './ArtistAvatarAction';
 *
 * function ArtistCard() {
 *   const handleUploadSuccess = (imageUrl) => {
 *     console.log('New avatar uploaded:', imageUrl);
 *   };
 *
 *   return (
 *     <ArtistAvatarAction
 *       artistId="artist-123"
 *       createdBy="user-456"
 *       uploadable={true}
 *       onUploadSuccess={handleUploadSuccess}
 *     />
 *   );
 * }
 */
export function ArtistAvatarAction({ artistId, createdBy, uploadable = false, onUploadSuccess }) {
  const { user } = useAuthContext();
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const createImage = useCreateImage();
  const updateArtist = useUpdateArtist();

  // Only allow upload if current user is admin or owns the content
  const canUpload =
    uploadable &&
    user &&
    (user.role === 'ADMIN' || (createdBy && String(user.userId) === String(createdBy)));

  if (!canUpload) {
    return null;
  }

  const handleCameraClick = () => {
    if (!artistId) {
      toast.error('Artist ID is required to upload an avatar');
      return;
    }
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('imageType', 'artistImage');
        formData.append('artistId', artistId);
        const response = await createImage(formData);
        if (response.status === 'success' && response.data?.url) {
          const uploadedImageUrl = response.data?.url;
          const updatedArtist = await updateArtist(artistId, { imageUrl: uploadedImageUrl });
          if (updatedArtist.status === 'success') {
            toast.success('Artist image uploaded successfully');
            if (onUploadSuccess) {
              onUploadSuccess(uploadedImageUrl);
            }
          } else {
            toast.error('Update artist failed: No artist update response');
            console.error('Update artist failed:', updatedArtist);
          }
        } else {
          toast.error('Upload failed: No image URL returned');
          console.error('Upload failed:', response);
        }
      } catch (err) {
        toast.error(err.message || 'Upload failed');
        console.error('Error uploading artist image:', err);
      } finally {
        setUploading(false);
      }
    } else {
      toast.error('No file selected for upload');
      e.target.value = '';
    }
  };

  return (
    <IconButton
      aria-label="Upload artist avatar"
      onClick={handleCameraClick}
      sx={{
        position: 'absolute',
        bottom: -28,
        right: -8,
        zIndex: 12,
        bgcolor: 'rgba(0,0,0,0.48)',
        color: 'common.white',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.72)' },
        width: 24,
        height: 24,
      }}
      size="small"
      disabled={uploading}
    >
      {uploading ? (
        <CircularProgress size={12} color="inherit" />
      ) : (
        <Iconify icon="solar:camera-add-bold" width={12} height={12} />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </IconButton>
  );
}

/**
 * PropTypes Validation for ArtistAvatarAction Component
 *
 * @memberof CityArtWalks.Components.Artist.ArtistAvatarAction
 * @name ArtistAvatarAction.propTypes
 * @type {Object}
 */
ArtistAvatarAction.propTypes = {
  artistId: PropTypes.string.isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  uploadable: PropTypes.bool,
  onUploadSuccess: PropTypes.func,
};

/**
 * Default Props for ArtistAvatarAction Component
 *
 * @memberof CityArtWalks.Components.Artist.ArtistAvatarAction
 * @name ArtistAvatarAction.defaultProps
 * @type {Object}
 */
ArtistAvatarAction.defaultProps = {
  uploadable: false,
};
