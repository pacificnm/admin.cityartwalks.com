/**
 * @fileoverview ArtPieceMenuEditItem component for edit menu actions on art pieces.
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMenuEditItem
 * @author jaimie garner
 * @version 1.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Menu-Edit} - Documentation
 */

import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import MenuItem from '@mui/material/MenuItem';

import { EditIcon } from 'src/components/icons';

/**
 * ArtPieceMenuEditItem - Menu item for editing an art piece, only visible to MEMBER or ADMIN roles.
 * Wrapped in a RoleBasedGuard to enforce permissions and show upgrade/signup dialogs as needed.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceMenuEditItem
 * @param {Object} props - Component props
 * @param {Object} props.editDialog - Dialog state controller with an `onTrue` method to open the edit dialog
 * @param {Function} props.handleClose - Function to close the parent menu
 * @returns {JSX.Element} The rendered menu item, or appropriate dialog/view if not authorized
 *
 * @example
 * <ArtPieceMenuEditItem editDialog={editDialog} handleClose={handleClose} />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Menu-Edit} - Documentation
 */
export function ArtPieceMenuEditItem(props) {
  const { editDialog, handleClose } = props;

  const handleEditClick = () => {
    editDialog.onTrue();
    handleClose();
    track('art_piece_menu_edit', {
      action: 'edit_dialog_open',
      section: 'Art Piece Popover',
    });
  };

  return (
    <MenuItem onClick={handleEditClick}>
      <EditIcon size={20} />
      Edit
    </MenuItem>
  );
}

ArtPieceMenuEditItem.propTypes = {
  editDialog: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
