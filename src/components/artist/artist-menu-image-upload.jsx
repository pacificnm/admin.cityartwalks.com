/**
 * @fileoverview ArtistMenuImageUpload component for image upload menu actions on artists.
 * @namespace CityArtWalks.Components.Artist.ArtistMenuImageUpload
 * @author jaimie garner
 * @version 1.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Menu-ImageUpload} - Documentation
 */

import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { track } from '@vercel/analytics';

import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

import { useCreateImage } from 'src/actions/image';
import { useUpdateArtist } from 'src/actions/artist/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { OwnerGuard } from 'src/auth/guard';

/**
 * ArtistMenuImageUpload - Menu item for uploading images to an artist.
 * Allows users to upload and update artist avatar images.
 *
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistMenuImageUpload
 * @param {Object} props - Component props
 * @param {string} props.artistId - The ID of the artist to upload images for
 * @param {string|number} props.createdBy - The user ID of who created/owns this artist
 * @param {Function} props.handleClose - Function to close the parent menu
 * @param {Function} [props.onUploadSuccess] - Optional callback when upload succeeds
 * @returns {JSX.Element} The rendered menu item
 *
 * @example
 * <ArtistMenuImageUpload
 *   artistId="123"
 *   createdBy="user456"
 *   handleClose={handleClose}
 *   onUploadSuccess={(imageUrl) => console.log('Uploaded:', imageUrl)}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Menu-ImageUpload} - Documentation
 */
export function ArtistMenuImageUpload(props) {
  const { artistId, createdBy, handleClose, onUploadSuccess } = props;

  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const createImage = useCreateImage();
  const updateArtist = useUpdateArtist();

  const handleUploadClick = () => {
    track('artist_menu_image_upload', {
      action: 'image_upload_click',
      section: 'Artist Popover',
      artistId,
    });

    if (!artistId) {
      toast.error('Artist ID is required to upload an image');
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
            if (handleClose) {
              handleClose();
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
    <OwnerGuard userId={createdBy}>
      <MenuItem onClick={handleUploadClick} disabled={uploading}>
        {uploading ? (
          <CircularProgress size={20} sx={{ mr: 1 }} />
        ) : (
          <Iconify icon="solar:camera-add-bold" size={20} />
        )}
        Upload Image
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </MenuItem>
    </OwnerGuard>
  );
}

ArtistMenuImageUpload.propTypes = {
  artistId: PropTypes.string.isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleClose: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func,
};
