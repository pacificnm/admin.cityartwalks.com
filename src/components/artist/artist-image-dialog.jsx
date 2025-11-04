/**
 * @file artist-image-dialog.jsx
 * @description Dialog component for displaying artist images
 * @namespace CityArtWalks.Components.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// ----------------------------------------------------------------------

/**
 * @description Dialog for displaying artist images with preview and download options
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistImageDialog
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Handler for closing the dialog
 * @param {string} props.imageUrl - URL of the image to display
 * @param {string} props.artistName - Name of the artist (used in title and alt text)
 * @returns {JSX.Element} The Artist Image Dialog component.
 */
export function ArtistImageDialog({ open, onClose, imageUrl, artistName }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Artist Image {artistName && `- ${artistName}`}
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
      <DialogContent>
        <Box sx={{ pt: 2, textAlign: 'center' }}>
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={artistName || 'Artist Image'}
              sx={{
                maxWidth: '100%',
                maxHeight: 600,
                borderRadius: 2,
                objectFit: 'contain',
                border: 1,
                borderColor: 'divider',
              }}
            />
          ) : (
            <Box
              sx={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography color="text.secondary">No image available</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      {imageUrl && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            component="a"
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
          >
            Open Original
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
