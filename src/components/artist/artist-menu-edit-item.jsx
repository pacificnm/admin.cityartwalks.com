/**
 * @namespace CityArtWalks.Components.Artist.ArtistMenuEditItem
 * @version 1.0.0
 * @author jaimie garner
 * @todo Need to fix the display.
 */

'use client';

import MenuItem from '@mui/material/MenuItem';

import { EditIcon } from 'src/components/icons';

import { OwnerGuard } from 'src/auth/guard';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistMenuEditItem
 * @function ArtistMenuEditItem
 * @description Renders a menu item for editing an artist, gated by ownership.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.editDialog - An object controlling the state of the edit dialog.
 * @param {Function} props.editDialog.onTrue - A function to open the edit dialog.
 * @param {Function} props.handleClose - A callback function to close the menu after clicking the edit item.
 * @param {string|number} props.createdBy - The user ID of who created/owns this artist.
 * @returns {JSX.Element|null} The rendered menu item or null if the user is loading or there is an error.
 *
 * @example
 * <ArtistMenuEditItem
 *   editDialog={{ onTrue: () => console.log('Edit dialog opened') }}
 *   handleClose={() => console.log('Menu closed')}
 *   createdBy={artist.createdBy}
 * />
 */
export function ArtistMenuEditItem({ editDialog, handleClose, createdBy }) {
  return (
    <OwnerGuard userId={createdBy}>
      <MenuItem
        onClick={() => {
          editDialog.onTrue();
          handleClose();
        }}
      >
        <EditIcon size={20} />
        Edit
      </MenuItem>
    </OwnerGuard>
  );
}
