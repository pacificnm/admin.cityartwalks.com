/**
 * @file image-edit-dialog.jsx
 * @description Dialog component for editing image information
 * @namespace CityArtWalks.Components.Image
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { ImageForm } from 'src/forms/image/image-form';

// ----------------------------------------------------------------------

/**
 * @description Dialog component for editing an image with form integration
 * @memberof CityArtWalks.Components.Image
 * @function ImageEditDialog
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Handler for closing the dialog
 * @param {Object} props.image - Image data to edit
 * @param {boolean} props.loading - Whether image data is loading
 * @param {Function} props.onSuccess - Handler for successful edit
 * @returns {JSX.Element} The Image Edit Dialog component.
 */
export function ImageEditDialog({ open, onClose, image, loading, onSuccess }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Image
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          ✕
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={40} />
          </Box>
        ) : image ? (
          <Box sx={{ p: 8 }}>
            <ImageForm currentImage={image} onSuccess={onSuccess} onCancel={onClose} />
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>Failed to load image data</Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
