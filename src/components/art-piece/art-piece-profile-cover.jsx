/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Components.ArtPieceProfileCover
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

import { debugLog, debugError } from 'src/lib/debug';
import { varAlpha, bgGradient } from 'src/theme/styles';
import { useUpdateArtPiece } from 'src/actions/art-piece/hooks';
import { updateArtPieceSchema } from 'src/validators/art-piece';

import { Iconify } from 'src/components/iconify';
import { ArtPieceImageUploadDialog } from 'src/components/art-piece/art-piece-image-upload-dialog';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
/**
 * @memberof CityArtWalks.Components.ArtPieceProfileCover
 * @function ArtPieceProfileCover
 * @description Renders a profile cover for an art piece, including the artist's avatar and a background image.
 * The background gradient color changes based on the art piece status, and displays a status chip for owners.
 * Includes a camera button for owners to upload new cover images with an integrated upload dialog.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.name - The name of the artist or art piece.
 * @param {string} props.artistImageUrl - The URL of the artist's profile image.
 * @param {string} props.artPieceImageUrl - The URL of the art piece background image.
 * @param {string} props.status - The status of the art piece (ACTIVE, DRAFT, PENDING, INACTIVE).
 * @param {string} props.createdBy - The ID of the user who created the art piece.
 * @param {string} props.artPieceId - The ID of the art piece for image uploads.
 * @returns {JSX.Element} The rendered ArtPieceProfileCover component.
 *
 * @example
 * <ArtPieceProfileCover
 *   name="Starry Night"
 *   artistImageUrl="/images/van-gogh.jpg"
 *   artPieceImageUrl="/images/starry-night.jpg"
 *   status="ACTIVE"
 *   createdBy="user123"
 *   artPieceId="art-piece-456"
 * />
 */
export function ArtPieceProfileCover(props) {
  const { artPieceId, name, artistImageUrl, artPieceImageUrl, status, createdBy } = props;
  const { accessToken } = useAuthContext();
  const theme = useTheme();
  const imageUploadDialog = useBoolean();
  const updateArtPiece = useUpdateArtPiece(accessToken);

  /**
   * Handle successful image upload by updating the art piece's imageUrl
   * @param {Object} uploadResult - The upload result object from the form
   * @param {Object} uploadResult.result - The API response result
   * @param {Object} uploadResult.imageData - The uploaded image data
   * @param {string} uploadResult.artPieceId - The art piece ID
   */
  const handleImageUploadSuccess = async (uploadResult) => {
    debugLog(
      'CityArtWalks.Components.ArtPieceProfileCover.handleImageUploadSuccess',
      'Upload success handler called',
      {
        uploadResult,
        artPieceId,
      }
    );

    try {
      // Extract the uploaded image URL from the result - match the actual structure
      const newImageUrl =
        uploadResult?.imageData?.url ||
        uploadResult?.result?.data?.url ||
        uploadResult?.uploadedUrl;

      if (!newImageUrl) {
        console.error('No image URL found in upload result:', uploadResult);
        debugError(
          'CityArtWalks.Components.ArtPieceProfileCover.handleImageUploadSuccess',
          'No image URL found in upload result',
          {
            uploadResult,
            artPieceId,
          }
        );
        return;
      }

      debugLog(
        'CityArtWalks.Components.ArtPieceProfileCover.handleImageUploadSuccess',
        'Found new image URL, starting art piece update',
        {
          newImageUrl,
          artPieceId,
        }
      );

      // Validate the update data
      const updateData = updateArtPieceSchema.parse({
        id: artPieceId,
        imageUrl: newImageUrl,
      });
      debugLog(
        'CityArtWalks.Components.ArtPieceProfileCover.handleImageUploadSuccess',
        'Update data validated successfully',
        {
          updateData,
          artPieceId,
        }
      );

      // Update the art piece with the new image URL
      const result = await updateArtPiece(artPieceId, updateData);
      debugLog(
        'CityArtWalks.Components.ArtPieceProfileCover.handleImageUploadSuccess',
        'Art piece updated successfully',
        {
          result,
          artPieceId,
          newImageUrl,
        }
      );

      // The dialog will close automatically after this function returns successfully
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtPieceProfileCover.handleImageUploadSuccess',
        'Failed to update art piece image',
        {
          error: error.message,
          artPieceId,
        }
      );
      // Throw the error so the dialog knows not to close
      throw error;
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
      default:
        return {
          chipColor: 'error',
          bgColor: theme.vars.palette.error.darkChannel,
        };
    }
  };

  const { chipColor, bgColor } = getStatusColors(status);

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(bgColor, 0.8)}, ${varAlpha(bgColor, 0.8)}`,
          imgUrl: artPieceImageUrl,
        }),
        height: 1,
        color: 'common.white',
      }}
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
          src={artistImageUrl}
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
          primaryTypographyProps={{
            typography: 'h4',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: 'inherit',
            component: 'span',
            typography: 'body2',
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
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
      </OwnerGuard>

      {/* Image Upload Dialog */}
      <ArtPieceImageUploadDialog
        open={imageUploadDialog.value}
        onClose={imageUploadDialog.onFalse}
        artPieceId={artPieceId}
        currentImageUrl={artPieceImageUrl}
        onSuccess={handleImageUploadSuccess}
      />
    </Box>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPieceProfileCover
 * @prop {string} name - The name of the artist or art piece. This prop is required.
 * @prop {string} artistImageUrl - The URL of the artist's profile image. This prop is required.
 * @prop {string} artPieceImageUrl - The URL of the art piece background image. This prop is required.
 * @prop {string} status - The status of the art piece (ACTIVE, DRAFT, PENDING, INACTIVE). This prop is required.
 * @prop {string} createdBy - The ID of the user who created the art piece. This prop is required.
 * @prop {string} artPieceId - The ID of the art piece for image uploads. This prop is required.
 */
ArtPieceProfileCover.propTypes = {
  name: PropTypes.string.isRequired,
  artistImageUrl: PropTypes.string.isRequired,
  artPieceImageUrl: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  artPieceId: PropTypes.string.isRequired,
};
