/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPiecePopover
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import IconButton from '@mui/material/IconButton';

import { CustomPopover } from 'src/components/custom-popover';
import { ArtPieceMenuIndexNow } from 'src/components/index-now';
import { ArtPieceUserFavorite } from 'src/components/art-piece/art-piece-user-favorite';

import { OwnerGuard, RoleBasedGuard } from 'src/auth/guard';

import { PopoverIcon } from '../icons';
import ErrorBoundary from '../error/error-boundary';
import {
  ArtPieceMenuPath,
  ArtPieceMenuDelete,
  ArtPieceMenuEditItem,
  ArtPieceMenuFullScreen,
  ArtPieceMenuImageUpload,
} from '.';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPiecePopover
 * @function ArtPiecePopover
 * @description Renders a popover menu with actions for an art piece, including viewing details,
 * adding to favorites, and adding to paths. Includes ownership-based permissions for edit/delete actions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.artPieceId - The unique ID of the art piece.
 * @param {string} props.artistId - The unique ID of the artist associated with the art piece.
 * @param {string} props.title - The title of the art piece.
 * @param {string} props.imageUrl - The URL of the art piece's image.
 * @param {number} props.latitude - The latitude of the art piece's location.
 * @param {number} props.longitude - The longitude of the art piece's location.
 * @param {string} props.artPieceSlug - The slug of the art piece, used for navigation.
 * @param {string} props.artistSlug - The slug of the artist, used for navigation.
 * @param {string} props.artistName - The name of the artist associated with the art piece.
 * @param {string} props.createdBy - The user ID of the art piece creator (for ownership validation).
 * @param {Object} props.editDialog - Control object for opening the edit dialog.
 * @param {Object} props.deleteDialog - Control object for opening the delete dialog.
 * @param {Object} props.fullScreenDialog - Control object for opening the fullscreen dialog.
 * @param {Object} props.imageUploadDialog - Control object for opening the image upload dialog.
 * @returns {JSX.Element} The rendered ArtPiecePopover component.
 *
 * @example
 * // Usage example
 * import { ArtPiecePopover } from './ArtPiecePopover';
 *
 * function App() {
 *   const fullScreenDialog = useBoolean();
 *   const editDialog = useBoolean();
 *   const deleteDialog = useBoolean();
 *   const imageUploadDialog = useBoolean();
 *
 *   return (
 *     <ArtPiecePopover
 *       artPieceId="piece456"
 *       artistId="artist789"
 *       title="Starry Night"
 *       imageUrl="/images/starry-night.jpg"
 *       latitude={45.523064}
 *       longitude={-122.676483}
 *       artPieceSlug="starry-night"
 *       artistSlug="vincent-van-gogh"
 *       artistName="Vincent van Gogh"
 *       createBy="user123"
 *       editDialog={editDialog}
 *       deleteDialog={deleteDialog}
 *       fullScreenDialog={fullScreenDialog}
 *       imageUploadDialog={imageUploadDialog}
 *     />
 *   );
 * }
 */
export function ArtPiecePopover(props) {
  const {
    artPieceId,
    artistId,
    title,
    imageUrl,
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
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  // Open the popover when the IconButton is clicked
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    track('art_piece_popover_open', {
      artPieceId,
      title,
      artistName,
      location: 'Art Piece About',
    });
  };

  // Close the popover
  const handleClose = () => {
    setAnchorEl(null);
    track('art_piece_popover_close', {
      artPieceId,
      title,
      artistName,
      location: 'Art Piece About',
    });
  };

  const open = Boolean(anchorEl); // Determine if the popover is open

  return (
    <ErrorBoundary>
      <IconButton color={open ? 'inherit' : 'default'} onClick={handleOpen}>
        <PopoverIcon />
      </IconButton>
      <CustomPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        slotProps={{
          arrow: {
            placement: 'right-top', // Arrow positioned at top-right
            size: 14, // Size of the arrow
            offset: 12, // Offset for the arrow's placement
          },
        }}
      >
        <ArtPieceMenuFullScreen fullScreenDialog={fullScreenDialog} handleClose={handleClose} />
        <ArtPieceUserFavorite artPieceId={artPieceId} />
        <ArtPieceMenuPath
          artPieceId={artPieceId}
          artistId={artistId}
          title={title}
          imageUrl={imageUrl}
          latitude={latitude}
          longitude={longitude}
          artPieceSlug={artPieceSlug}
          artistSlug={artistSlug}
          artistName={artistName}
          handleClose={handleClose}
        />
        <ArtPieceMenuImageUpload
          artPieceId={artPieceId}
          imageUploadDialog={imageUploadDialog}
          handleClose={handleClose}
        />
        <RoleBasedGuard allowedRoles={['ADMIN']} displayMode="hidden" protecting="IndexNow Menu">
          <ArtPieceMenuIndexNow
            artPieceId={artPieceId}
            artPieceSlug={artPieceSlug}
            artistSlug={artistSlug}
            title={title}
            handleClose={handleClose}
          />
        </RoleBasedGuard>
        <OwnerGuard userId={createdBy}>
          <ArtPieceMenuEditItem editDialog={editDialog} handleClose={handleClose} />
          <ArtPieceMenuDelete deleteDialog={deleteDialog} handleDeleteClose={handleClose} />
        </OwnerGuard>
      </CustomPopover>
    </ErrorBoundary>
  );
}

ArtPiecePopover.propTypes = {
  artPieceId: PropTypes.string.isRequired,
  artistId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  createdBy: PropTypes.number.isRequired,
  editDialog: PropTypes.object.isRequired,
  deleteDialog: PropTypes.object.isRequired,
  fullScreenDialog: PropTypes.object.isRequired,
  imageUploadDialog: PropTypes.object.isRequired,
};
