/**
 * @fileoverview ArtPieceMenuFullScreen component for full screen map menu actions on art pieces.
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMenuFullScreen
 * @author jaimie garner
 * @version 1.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Menu-FullScreen} - Documentation
 */

import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import MenuItem from '@mui/material/MenuItem';

import { MapIcon } from '../icons';

/**
 * ArtPieceMenuFullScreen - Menu item for opening an art piece map in full screen mode.
 * Triggers a full screen dialog and includes analytics tracking for user interactions.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceMenuFullScreen
 * @param {Object} props - Component props
 * @param {Object} props.fullScreenDialog - Dialog state controller with an `onTrue` method to open the full screen dialog
 * @param {Function} props.handleClose - Function to close the parent menu
 * @returns {JSX.Element} The rendered menu item for full screen map action
 *
 * @example
 * <ArtPieceMenuFullScreen fullScreenDialog={fullScreenDialog} handleClose={handleClose} />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Menu-FullScreen} - Documentation
 */
export function ArtPieceMenuFullScreen(props) {
  const { fullScreenDialog, handleClose } = props;

  const handleFullScreenMapClick = () => {
    fullScreenDialog.onTrue();
    handleClose();
    track('art_piece_menu_fullscreen', {
      action: 'full_screen_map',
      section: 'Art Piece Popover',
    });
  };

  return (
    <MenuItem onClick={handleFullScreenMapClick}>
      <MapIcon />
      Full Screen Map
    </MenuItem>
  );
}

ArtPieceMenuFullScreen.propTypes = {
  fullScreenDialog: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
