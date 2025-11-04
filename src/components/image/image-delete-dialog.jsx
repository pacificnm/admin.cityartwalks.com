/**
 * @file image-delete-dialog.jsx
 * @description Confirmation dialog component for deleting images
 * @namespace CityArtWalks.Components.Image
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Button from '@mui/material/Button';

import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

/**
 * @description Confirmation dialog for deleting an image with proper confirmation flow
 * @memberof CityArtWalks.Components.Image
 * @function ImageDeleteDialog
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Handler for closing the dialog
 * @param {string} props.imageTitle - Title of the image to be deleted
 * @param {Function} props.onConfirm - Handler for confirming deletion
 * @param {boolean} props.deleting - Whether deletion is in progress
 * @returns {JSX.Element} The Image Delete Dialog component.
 */
export function ImageDeleteDialog({ open, onClose, imageTitle, onConfirm, deleting }) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title="Delete Image"
      content={`Are you sure you want to delete "${imageTitle || 'this image'}"? This action cannot be undone.`}
      action={
        <Button variant="contained" color="error" onClick={onConfirm} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      }
    />
  );
}
