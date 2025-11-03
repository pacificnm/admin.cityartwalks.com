/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceAbout
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import ErrorBoundary from 'src/components/error/error-boundary';
import {
  ArtPiecePopover,
  ArtPieceMetadata,
  ArtPieceFullDescription,
  ArtPieceImageUploadDialog,
} from 'src/components/art-piece';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceAbout
 * @description Component to display detailed information about an art piece.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.artPiceId - The ID of the art piece.
 * @param {string} props.artistId - The ID of the artist.
 * @param {string} props.title - The title of the art piece.
 * @param {string} props.imageUrl - The URL of the art piece image.
 * @param {string} props.description - The description of the art piece.
 * @param {number} props.latitude - The latitude coordinate of the art piece location.
 * @param {number} props.longitude - The longitude coordinate of the art piece location.
 * @param {string} props.artPieceSlug - The slug for the art piece.
 * @param {string} props.artistSlug - The slug for the artist.
 * @param {string} props.artistName - The name of the artist.
 * @param {function} props.editDialog - Function to handle the edit dialog.
 * @param {function} props.deleteDialog - Function to handle the delete dialog.
 * @param {function} props.fullScreenDialog - Function to handle the full screen dialog.
 * @param {function} props.imageUploadDialog - Function to handle the image upload dialog.
 * @param {function} props.handleDeleteClose - Function to handle the close action for delete dialog.
 * @returns {JSX.Element} The rendered component.
 */
export function ArtPieceAbout(props) {
  const {
    artPieceId,
    artistId,
    title,
    imageUrl,
    description,
    latitude,
    longitude,
    artPieceSlug,
    artistSlug,
    artistName,
    createdBy,
    editDialog,
    deleteDialog,
    fullScreenDialog,
    imageUploadDialog,
    handleDeleteClose,
    ...other
  } = props;

  return (
    <ErrorBoundary>
      <Box {...other}>
        <Card>
          <CardHeader title={title ?? 'Untitled Art Piece'} />
          <Stack sx={{ mr: 3, ml: 3, mb: 2 }}>
            <Stack spacing={1} flexGrow={1}>
              <Box sx={{ typography: 'body2' }}>
                <ArtPieceFullDescription description={description} />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center">
              {/* Buttons aligned to the left */}
              <Stack
                spacing={1.5}
                direction="row"
                flexWrap="wrap"
                justifyContent="flex-start"
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                <ArtPiecePopover
                  artPieceId={artPieceId}
                  artistId={artistId}
                  title={title}
                  imageUrl={imageUrl}
                  latitude={latitude}
                  longitude={longitude}
                  artPieceSlug={artPieceSlug}
                  artistSlug={artistSlug}
                  artistName={artistName}
                  createdBy={createdBy}
                  hideViewLink
                  editDialog={editDialog}
                  deleteDialog={deleteDialog}
                  handleDeleteClose={handleDeleteClose}
                  fullScreenDialog={fullScreenDialog}
                  imageUploadDialog={imageUploadDialog}
                />
              </Stack>

              {/* Other items aligned to the right */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                flexGrow={1} // Ensures this Stack takes remaining space
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                <ArtPieceMetadata artPieceId={artPieceId} />
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Box>
      {imageUploadDialog && (
        <ArtPieceImageUploadDialog
          open={imageUploadDialog.value}
          onClose={imageUploadDialog.onFalse}
          artPieceId={artPieceId}
        />
      )}
    </ErrorBoundary>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceAbout
 * @prop {string} artPiceId - The unique ID of the art piece to fetch metadata for. This prop is required.
 * @prop {string} artistId - The unique ID of the artist. This prop is required.
 * @prop {string} title - The title of the art piece. This prop is required.
 * @prop {string} imageUrl - The URL of the art piece image. This prop is required.
 * @prop {string} description - A detailed description of the art piece. This prop is required.
 * @prop {number} latitude - The latitude coordinate of the art piece location. This prop is required.
 * @prop {number} longitude - The longitude coordinate of the art piece location. This prop is required.
 * @prop {string} artPieceSlug - The slug for the art piece. This prop is required.
 * @prop {string} artistSlug - The slug for the artist. This prop is required.
 * @prop {string} artistName - The name of the artist. This prop is required.
 * @prop {string} createdBy - The ID of the user who created the art piece. This prop is required.
 * @prop {function} editDialog - Function to handle the edit dialog. This prop is required.
 * @prop {function} deleteDialog - Function to handle the delete dialog. This prop is required.
 * @prop {function} fullScreenDialog - Function to handle the full screen dialog. This prop is required.
 * @prop {function} imageUploadDialog - Function to handle the image upload dialog. This prop is required.
 * @prop {function} handleDeleteClose - Function to handle the close action for delete dialog. This prop is required.
 */
ArtPieceAbout.propTypes = {
  artPiceId: PropTypes.string.isRequired,
  artistId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  editDialog: PropTypes.func.isRequired,
  deleteDialog: PropTypes.func.isRequired,
  fullScreenDialog: PropTypes.func.isRequired,
  imageUploadDialog: PropTypes.func.isRequired,
  handleDeleteClose: PropTypes.func.isRequired,
};
