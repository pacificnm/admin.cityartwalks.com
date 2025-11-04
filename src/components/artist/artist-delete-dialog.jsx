/**
 * @file artist-delete-dialog.jsx
 * @description Confirmation dialog component for deleting artists
 * @namespace CityArtWalks.Components.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Button from '@mui/material/Button';

import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

/**
 * @description Confirmation dialog for deleting an artist with proper confirmation flow
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistDeleteDialog
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Handler for closing the dialog
 * @param {string} props.artistName - Name of the artist to be deleted
 * @param {Function} props.onConfirm - Handler for confirming deletion
 * @param {boolean} props.deleting - Whether deletion is in progress
 * @returns {JSX.Element} The Artist Delete Dialog component.
 */
export function ArtistDeleteDialog({ open, onClose, artistName, onConfirm, deleting }) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title="Delete Artist"
      content={`Are you sure you want to delete "${artistName}"? This action cannot be undone.`}
      action={
        <Button variant="contained" color="error" onClick={onConfirm} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      }
    />
  );
}
