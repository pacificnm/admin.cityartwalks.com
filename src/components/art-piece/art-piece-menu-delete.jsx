/**
 * @fileoverview ArtPieceMenuDelete component for delete menu actions on art pieces.
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMenuDelete
 * @author jaimie garner
 * @version 1.0.0
 */

import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import MenuItem from '@mui/material/MenuItem';

import { DeleteIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceMenuDelete
 * @description Menu item for deleting an art piece.
 * Should be wrapped in OwnerGuard for ownership protection.
 *
 * @param {Object} props - Component props
 * @param {Object} props.deleteDialog - Dialog state controller with an `onTrue` method to open the delete dialog
 * @param {Function} props.handleDeleteClose - Function to close the parent menu
 * @returns {JSX.Element|null} The rendered menu item or null if user is loading
 *
 * @example
 * <ArtPieceMenuDelete deleteDialog={deleteDialog} handleDeleteClose={handleClose} />
 */
export function ArtPieceMenuDelete(props) {
  const { deleteDialog, handleDeleteClose } = props;
  const { loading: userIsLoading } = useAuthContext();

  if (userIsLoading) return null; // Handle user loading or error

  const handleDeleteClick = () => {
    deleteDialog.onTrue();
    handleDeleteClose();
    track('art_piece_menu_delete', {
      action: 'delete_dialog_open',
      section: 'Art Piece Popover',
    });
  };

  return (
    <MenuItem onClick={handleDeleteClick}>
      <DeleteIcon size={20} />
      Delete
    </MenuItem>
  );
}

ArtPieceMenuDelete.propTypes = {
  deleteDialog: PropTypes.object.isRequired,
  handleDeleteClose: PropTypes.func.isRequired,
};
