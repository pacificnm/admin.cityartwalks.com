/**
 * @file artist-edit-dialog.jsx
 * @description Dialog component for editing artist information
 * @namespace CityArtWalks.Components.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { ArtistForm } from 'src/forms/artist/artist-form';

// ----------------------------------------------------------------------

/**
 * @description Dialog component for editing an artist with form integration
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistEditDialog
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Handler for closing the dialog
 * @param {Object} props.artist - Artist data to edit
 * @param {boolean} props.loading - Whether artist data is loading
 * @param {Function} props.onSuccess - Handler for successful edit
 * @returns {JSX.Element} The Artist Edit Dialog component.
 */
export function ArtistEditDialog({ open, onClose, artist, loading, onSuccess }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Artist
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
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={40} />
          </Box>
        ) : artist ? (
          <Box sx={{ p: 3 }}>
            <ArtistForm currentArtist={artist} onSuccess={onSuccess} onCancel={onClose} />
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>Failed to load artist data</Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
