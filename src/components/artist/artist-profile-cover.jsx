/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.Artist.ArtistProfileCover
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog } from 'src/lib/debug';
import { varAlpha, bgGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ArtistImageUploadDialog } from 'src/components/artist/artist-image-upload-dialog';

import { OwnerGuard } from 'src/auth/guard';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistProfileCover
 * @function ArtistProfileCover
 * @description Renders a profile cover for an artist, including the artist's avatar and a background image.
 * The background gradient color changes based on the artist status, and displays a status chip for owners.
 * Includes a camera button for owners to upload new cover images with an integrated upload dialog.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.name - The name of the artist.
 * @param {string} props.imageUrl - The URL of the artist's profile and background image.
 * @param {string} [props.status] - The status of the artist (ACTIVE, DRAFT, PENDING, INACTIVE).
 * @param {string} props.createdBy - The ID of the user who created the artist.
 * @param {string} props.artistId - The ID of the artist for image uploads.
 * @returns {JSX.Element} The rendered ArtistProfileCover component.
 *
 * @example
 * <ArtistProfileCover
 *   name="Vincent van Gogh"
 *   imageUrl="/images/van-gogh.jpg"
 *   status="ACTIVE"
 *   createdBy="user123"
 *   artistId="artist-456"
 * />
 */
export function ArtistProfileCover(props) {
  const { artistId, name, imageUrl, status, createdBy, onImageUpdate, ...other } = props;
  const theme = useTheme();
  const imageUploadDialog = useBoolean();

  /**
   * Handle successful image upload
   * The artist update is already handled in the ArtistImageUploadForm component
   * This handler just needs to close the dialog and trigger refresh
   * @param {Object} uploadResult - The upload result object from the form
   */
  const handleImageUploadSuccess = async (uploadResult) => {
    debugLog(
      'CityArtWalks.Components.Artist.ArtistProfileCover.handleImageUploadSuccess',
      'Upload success handler called - artist already updated by form',
      {
        uploadResult,
        artistId,
      }
    );

    // The artist update has already been done in ArtistImageUploadForm
    // Trigger parent refresh callback if provided
    if (onImageUpdate) {
      onImageUpdate();
    }
  };

  // Define colors based on status
  const getStatusColors = (statusValue) => {
    switch (statusValue?.toUpperCase()) {
      case 'ACTIVE':
        return {
          chipColor: 'success',
          bgColor: theme.vars.palette.primary.darkChannel,
        };
      case 'PENDING':
        return {
          chipColor: 'warning',
          bgColor: theme.vars.palette.warning.darkChannel,
        };
      case 'DRAFT':
        return {
          chipColor: 'info',
          bgColor: theme.vars.palette.info.darkChannel,
        };
      default:
        return {
          chipColor: 'error',
          bgColor: theme.vars.palette.error.darkChannel,
        };
    }
  };

  const { chipColor, bgColor } = status
    ? getStatusColors(status)
    : { chipColor: 'primary', bgColor: theme.vars.palette.primary.darkChannel };

  return (
    <ErrorBoundary>
      <Box
        sx={{
          ...bgGradient({
            color: `0deg, ${varAlpha(bgColor, 0.8)}, ${varAlpha(bgColor, 0.8)}`,
            imgUrl: imageUrl,
          }),
          height: 1,
          color: 'common.white',
        }}
        data-cy="artist-profile-cover"
        {...other}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            left: { md: 24 },
            bottom: { md: 24 },
            zIndex: { md: 10 },
            pt: { xs: 6, md: 0 },
            position: { md: 'absolute' },
          }}
        >
          <Avatar
            alt={name}
            src={imageUrl}
            sx={{
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          >
            {name?.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            sx={{
              mt: 3,
              ml: { md: 3 },
              textAlign: { xs: 'center', md: 'unset' },
            }}
            primary={name}
            slotProps={{
              primary: {
                typography: 'h4',
              },
              secondary: {
                mt: 0.5,
                color: 'inherit',
                component: 'span',
                typography: 'body2',
                sx: { opacity: 0.48 },
              },
            }}
          />
        </Stack>

        {/* Owner-only controls */}
        {createdBy && artistId && (
          <OwnerGuard userId={createdBy}>
            {/* Camera button for image upload */}
            <IconButton
              onClick={imageUploadDialog.onTrue}
              aria-label="Upload cover image"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 20,
                bgcolor: 'rgba(0,0,0,0.48)',
                color: 'common.white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.72)' },
              }}
              size="large"
            >
              <Iconify icon="solar:camera-add-bold" width={28} height={28} />
            </IconButton>

            {/* Status chip */}
            {status && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 10,
                }}
              >
                <Chip
                  label={status || 'Unknown'}
                  color={chipColor}
                  size="small"
                  variant="filled"
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            )}
          </OwnerGuard>
        )}

        {/* Image Upload Dialog */}
        {createdBy && artistId && (
          <ArtistImageUploadDialog
            open={imageUploadDialog.value}
            onClose={imageUploadDialog.onFalse}
            artistId={artistId}
            createdBy={createdBy}
            currentImageUrl={imageUrl}
            onSuccess={handleImageUploadSuccess}
          />
        )}
      </Box>
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.Artist.ArtistProfileCover
 * @prop {string} name - The name of the artist. This prop is required.
 * @prop {string} imageUrl - The URL of the artist's profile and background image.
 * @prop {string} status - The status of the artist (ACTIVE, DRAFT, PENDING, INACTIVE).
 * @prop {string} createdBy - The ID of the user who created the artist. Required for upload functionality.
 * @prop {string} artistId - The ID of the artist for image uploads. Required for upload functionality.
 */
ArtistProfileCover.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  status: PropTypes.string,
  createdBy: PropTypes.string,
  artistId: PropTypes.string,
  onImageUpdate: PropTypes.func,
};
