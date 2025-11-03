/**
 * @namespace CityArtWalks.Components.Artist.ArtistImage
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';
import { ImageDialog } from 'src/components/image';
import { ArtistImageUploadDialog } from 'src/components/artist/artist-image-upload-dialog';

import { OwnerGuard } from 'src/auth/guard';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistImage
 * @function ArtistImage
 * @description ArtistImage component displays an image of an Artist with optional dimensions and title.
 * It includes a clickable thumbnail that opens a full-size image dialog, and for owners, provides an upload dialog
 * to add or replace the image when no image is available.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {string} props.imageUrl - The URL of the Artist image.
 * @param {string} [props.title='Artist Image'] - The alt text for the image.
 * @param {number} [props.width=800] - The width of the image thumbnail.
 * @param {number} [props.height=600] - The height of the image thumbnail.
 * @param {string|number} props.artistId - The ID of the artist.
 * @param {string|number} props.createdBy - The ID of the user who created the artist.
 * @returns {JSX.Element} The rendered ArtistImage component.
 *
 * @example
 * // Example usage of ArtistImage
 * <ArtistImage
 *   imageUrl="/images/artist.jpg"
 *   title="Beautiful Artist"
 *   width={500}
 *   height={400}
 *   artistId="123"
 *   createdBy="user456"
 * />
 */
export function ArtistImage(props) {
  const {
    imageUrl,
    title = 'Artist Image',
    width = 800,
    height = 600,
    artistId,
    createdBy,
  } = props;
  const [open, setOpen] = useState(false);
  const imageUploadDialog = useBoolean();

  /**
   * Handle successful image upload
   * The artist update is already handled in the ArtistImageUploadForm component
   * This handler just needs to close the dialog
   * @param {Object} uploadResult - The upload result object from the form
   */
  const handleImageUploadSuccess = async (uploadResult) => {
    debugLog(
      'CityArtWalks.Components.Artist.ArtistImage.handleImageUploadSuccess',
      'Upload success handler called - artist already updated by form',
      {
        uploadResult,
        artistId,
      }
    );

    // The artist update has already been done in ArtistImageUploadForm
    // SWR cache invalidation happens automatically in the update hook
    // Just close the dialog
  };

  if (!imageUrl || imageUrl === 'null') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            height,
            minHeight: 200,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.50',
            position: 'relative',
          }}
        >
          <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center', p: 3 }}>
            <Iconify
              icon="solar:gallery-outline"
              width={48}
              height={48}
              sx={{ color: 'grey.400' }}
            />
            <Typography variant="body2" color="text.secondary">
              No image available for this Artist
            </Typography>

            <OwnerGuard userId={createdBy}>
              <Button
                variant="contained"
                size="small"
                startIcon={<Iconify icon="solar:gallery-add-bold" width={16} height={16} />}
                onClick={imageUploadDialog.onTrue}
                sx={{ mt: 1 }}
              >
                Add Image
              </Button>
            </OwnerGuard>
          </Stack>
        </Box>

        {/* Image Upload Dialog */}
        <ArtistImageUploadDialog
          open={imageUploadDialog.value}
          onClose={imageUploadDialog.onFalse}
          artistId={artistId}
          createdBy={createdBy}
          currentImageUrl={imageUrl}
          onSuccess={handleImageUploadSuccess}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <ImageDialog
        url={imageUrl}
        alt={title}
        width={800}
        height={600}
        open={open}
        onClose={setOpen}
      />
      <Image
        src={imageUrl}
        alt={title}
        width={width} // Set width explicitly
        height={height} // Set height explicitly
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: 16, // Set border radius for rounded corners (same as MUI Card)
          overflow: 'hidden', // Ensure image fits within the rounded corners
          cursor: 'pointer', // Pointer cursor on hover
        }}
        onClick={() => setOpen(true)}
      />
      {/* Image Upload Dialog */}
      <ArtistImageUploadDialog
        open={imageUploadDialog.value}
        onClose={imageUploadDialog.onFalse}
        artistId={artistId}
        createdBy={createdBy}
        currentImageUrl={imageUrl}
        onSuccess={handleImageUploadSuccess}
      />
    </Box>
  );
}
/**
 * @memberof CityArtWalks.Components.Artist.ArtistImage
 * @prop {string} imageUrl - The URL of the Artist image. This prop is required.
 * @prop {string} title - The alt text for the image. This prop is required.
 * @prop {number} width - The width of the image thumbnail. This prop is required.
 * @prop {number} height - The height of the image thumbnail. This prop is required.
 * @prop {string|number} artistId - The ID of the artist. This prop is required.
 * @prop {string|number} createdBy - The ID of the user who created the artist. This prop is required.
 */
ArtistImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
