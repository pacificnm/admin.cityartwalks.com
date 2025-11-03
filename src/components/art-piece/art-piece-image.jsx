/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceImage
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

import { debugLog, debugError } from 'src/lib/debug';
import { useUpdateArtPiece } from 'src/actions/art-piece/hooks';
import { updateArtPieceSchema } from 'src/validators/art-piece';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ImageDialog } from 'src/components/image';
import { ArtPieceImageUploadDialog } from 'src/components/art-piece/art-piece-image-upload-dialog';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImage
 * @function ArtPieceImage
 * @description ArtPieceImage component displays an image of an art piece with optional dimensions and title.
 * It includes a clickable thumbnail that opens a full-size image dialog, and for owners, provides an upload dialog
 * to add or replace the image when no image is available.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {string} props.imageUrl - The URL of the art piece image.
 * @param {string} [props.title='Art Piece Image'] - The alt text for the image.
 * @param {number} [props.width=800] - The width of the image thumbnail.
 * @param {number} [props.height=600] - The height of the image thumbnail.
 * @param {string|number} props.artPieceId - The ID of the art piece.
 * @param {string|number} props.createdBy - The ID of the user who created the art piece.
 * @returns {JSX.Element} The rendered ArtPieceImage component.
 *
 * @example
 * // Example usage of ArtPieceImage
 * <ArtPieceImage
 *   imageUrl="/images/art-piece.jpg"
 *   title="Beautiful Art Piece"
 *   width={500}
 *   height={400}
 *   artPieceId="123"
 *   createdBy="user456"
 * />
 */
export function ArtPieceImage(props) {
  const {
    imageUrl,
    title = 'Art Piece Image',
    width = 800,
    height = 600,
    artPieceId,
    createdBy,
  } = props;
  const [open, setOpen] = useState(false);
  const { accessToken } = useAuthContext();
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
      'CityArtWalks.Components.ArtPiece.ArtPieceImage.handleImageUploadSuccess',
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
          'CityArtWalks.Components.ArtPiece.ArtPieceImage.handleImageUploadSuccess',
          'No image URL found in upload result',
          {
            uploadResult,
            artPieceId,
          }
        );
        return;
      }

      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceImage.handleImageUploadSuccess',
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
        'CityArtWalks.Components.ArtPiece.ArtPieceImage.handleImageUploadSuccess',
        'Update data validated successfully',
        {
          updateData,
          artPieceId,
        }
      );

      // Update the art piece with the new image URL
      const result = await updateArtPiece(artPieceId, updateData);
      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceImage.handleImageUploadSuccess',
        'Art piece updated successfully',
        {
          result,
          artPieceId,
          newImageUrl,
        }
      );

      toast.success('Image uploaded and saved successfully!');
      // The dialog will close automatically after this function returns successfully
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtPiece.ArtPieceImage.handleImageUploadSuccess',
        'Failed to update art piece image',
        {
          error: error.message,
          artPieceId,
        }
      );
      toast.error(`Failed to save image: ${error.message}`);
      // Throw the error so the dialog knows not to close
      throw error;
    }
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
              No image available for this Art Piece
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
        <ArtPieceImageUploadDialog
          open={imageUploadDialog.value}
          onClose={imageUploadDialog.onFalse}
          artPieceId={artPieceId}
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
      <ArtPieceImageUploadDialog
        open={imageUploadDialog.value}
        onClose={imageUploadDialog.onFalse}
        artPieceId={artPieceId}
        currentImageUrl={imageUrl}
        onSuccess={handleImageUploadSuccess}
      />
    </Box>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImage
 * @prop {string} imageUrl - The URL of the art piece image. This prop is required.
 * @prop {string} title - The alt text for the image. This prop is required.
 * @prop {number} width - The width of the image thumbnail. This prop is required.
 * @prop {number} height - The height of the image thumbnail. This prop is required.
 * @prop {string|number} artPieceId - The ID of the art piece. This prop is required.
 * @prop {string|number} createdBy - The ID of the user who created the art piece. This prop is required.
 */
ArtPieceImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
