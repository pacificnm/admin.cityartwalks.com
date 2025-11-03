/**
 * @file art-piece-queue-artist-dialog.jsx
 * @description Dialog component for creating artists from art piece queue context
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @author Generated
 * @version 1.0.0
 */

'use client';

import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { ArtistForm } from 'src/forms/artist/artist-form';

/**
 * ArtPieceQueueArtistDialog component
 * Specialized dialog for creating artists in the context of art piece queue processing
 *
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSuccess - Success callback with created artist data
 * @param {Function} props.onCancel - Cancel callback
 * @param {Object} props.artPieceQueue - Art piece queue object for context
 * @param {string} [props.initialArtistName] - Initial artist name from queue data
 * @returns {JSX.Element} The dialog component
 */
export function ArtPieceQueueArtistDialog({
  open,
  onClose,
  onSuccess,
  onCancel,
  artPieceQueue,
  initialArtistName = '',
}) {
  const handleSuccess = (result) => {
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess(result);
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
    onClose();
  };

  // Extract artist name from various sources
  const extractedArtistName = initialArtistName || artPieceQueue?.artistName || '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '90vh' },
      }}
    >
      <DialogTitle>
        Create New Artist
        {extractedArtistName && (
          <span style={{ fontWeight: 'normal', color: '#666' }}> - {extractedArtistName}</span>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <ArtistForm
          initialValues={{ name: extractedArtistName }}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

ArtPieceQueueArtistDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  artPieceQueue: PropTypes.shape({
    artPieceQueueId: PropTypes.number,
    artistName: PropTypes.string,
    title: PropTypes.string,
    sourceUrl: PropTypes.string,
  }),
  initialArtistName: PropTypes.string,
};
