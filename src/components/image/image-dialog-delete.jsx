/**
 * @namespace CityArtWalks.Components.Image.ImageDialogDelete
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Delete confirmation dialog component for image deletion with proper warning and confirmation.
 */

'use client';

import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { debugLog, debugError } from 'src/lib/debug';

import { toast } from 'src/components/snackbar';

/**
 * @memberof CityArtWalks.Components.Image.ImageDialogDelete
 * @function ImageDialogDelete
 * @description Delete confirmation dialog for images with proper warning text and confirmation buttons.
 * Handles deletion confirmation and provides user feedback.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Callback when dialog is closed.
 * @param {Function} [props.onDelete] - Callback for delete confirmation with imageId.
 * @param {number} props.imageId - The unique ID of the image to delete.
 * @param {string} [props.filename] - The filename of the image for display in confirmation.
 * @returns {JSX.Element} The rendered ImageDialogDelete component.
 *
 * @example
 * <ImageDialogDelete
 *   open={deleteDialog.value}
 *   onClose={deleteDialog.onFalse}
 *   onDelete={handleDelete}
 *   imageId={123}
 *   filename="sunset.jpg"
 * />
 */
export function ImageDialogDelete(props) {
  const { open, onClose, onDelete, imageId, filename } = props;

  const handleConfirmDelete = async () => {
    try {
      debugLog(
        'CityArtWalks.Components.Image.ImageDialogDelete.handleConfirmDelete',
        'Confirming image deletion',
        { imageId }
      );

      if (onDelete) {
        await onDelete(imageId);
        toast.success('Image deleted successfully');
        onClose();
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Components.Image.ImageDialogDelete.handleConfirmDelete',
        'Failed to delete image',
        error
      );
      toast.error('Failed to delete image');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Image</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this image?
        </Typography>
        {filename && (
          <Typography variant="body2" color="text.secondary">
            <strong>File:</strong> {filename}
          </Typography>
        )}
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleConfirmDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageDialogDelete
 * PropTypes validation for the ImageDialogDelete component
 */
ImageDialogDelete.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  imageId: PropTypes.number.isRequired,
  filename: PropTypes.string,
};
