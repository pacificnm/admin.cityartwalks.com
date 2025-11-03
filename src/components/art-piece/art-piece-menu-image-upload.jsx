/**
 * @fileoverview ArtPieceMenuImageUpload component for image upload menu actions on art pieces.
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMenuImageUpload
 * @author jaimie garner
 * @version 1.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Menu-ImageUpload} - Documentation
 */

import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import MenuItem from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

/**
 * ArtPieceMenuImageUpload - Menu item for uploading images to an art piece.
 * Allows users to add additional images to enhance art piece documentation.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceMenuImageUpload
 * @param {Object} props - Component props
 * @param {string} props.artPieceId - The ID of the art piece to upload images for
 * @param {Object} props.imageUploadDialog - Dialog state controller with an `onTrue` method to open the image upload dialog
 * @param {Function} props.handleClose - Function to close the parent menu
 * @returns {JSX.Element} The rendered menu item
 *
 * @example
 * <ArtPieceMenuImageUpload
 *   artPieceId="123"
 *   imageUploadDialog={imageUploadDialog}
 *   handleClose={handleClose}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Menu-ImageUpload} - Documentation
 */
export function ArtPieceMenuImageUpload(props) {
  const { artPieceId, imageUploadDialog, handleClose } = props;

  const handleImageUploadClick = () => {
    if (imageUploadDialog && imageUploadDialog.onTrue) {
      imageUploadDialog.onTrue();
    }
    if (handleClose) {
      handleClose();
    }
    track('art_piece_menu_image_upload', {
      action: 'image_upload_dialog_open',
      section: 'Art Piece Popover',
      artPieceId,
    });
  };

  return (
    <MenuItem onClick={handleImageUploadClick}>
      <Iconify icon="solar:camera-add-bold" size={20} />
      Upload Image
    </MenuItem>
  );
}

ArtPieceMenuImageUpload.propTypes = {
  artPieceId: PropTypes.string.isRequired,
  imageUploadDialog: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
