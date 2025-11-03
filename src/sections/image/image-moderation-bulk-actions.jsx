/**
 * @namespace CityArtWalks.Sections.Dashboard.Image.ImageModerationBulkActions
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Sections.Dashboard.Image
 * @description Bulk moderation actions component for handling multiple flagged images at once.
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

/**
 * @memberof CityArtWalks.Sections.Dashboard.Image.ImageModerationBulkActions
 * @function ImageModerationBulkActions
 * @description Bulk actions toolbar for moderating multiple flagged images simultaneously.
 * Provides bulk approve and bulk remove functionality with notes support.
 *
 * @param {Object} props - Component props
 * @param {number} props.selectedCount - Number of selected images
 * @param {Function} props.onBulkModerate - Callback for bulk moderation (action, notes)
 * @param {Function} props.onCancel - Callback to cancel bulk selection
 * @param {Object} [props.sx] - Additional styling
 * @returns {JSX.Element} The rendered ImageModerationBulkActions component
 */
export function ImageModerationBulkActions({ selectedCount, onBulkModerate, onCancel, sx }) {
  const [bulkDialog, setBulkDialog] = useState(null); // 'approve' or 'remove'
  const [bulkNotes, setBulkNotes] = useState('');

  const handleOpenBulkDialog = (action) => {
    setBulkDialog(action);
    setBulkNotes('');
  };

  const handleCloseBulkDialog = () => {
    setBulkDialog(null);
    setBulkNotes('');
  };

  const handleSubmitBulkModeration = async () => {
    if (onBulkModerate && bulkDialog) {
      await onBulkModerate(bulkDialog, bulkNotes);
      handleCloseBulkDialog();
    }
  };

  return (
    <>
      <Card sx={{ p: 2, bgcolor: 'primary.lighter', ...sx }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle1" color="primary.dark">
              {selectedCount} image{selectedCount !== 1 ? 's' : ''} selected
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a bulk action to apply to selected images
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Bulk Approve */}
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleOpenBulkDialog('approve')}
              disabled={selectedCount === 0}
            >
              Bulk Approve
            </Button>

            {/* Bulk Remove */}
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleOpenBulkDialog('remove')}
              disabled={selectedCount === 0}
            >
              Bulk Remove
            </Button>

            {/* Cancel Selection */}
            <Button variant="outlined" size="small" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Bulk Moderation Dialog */}
      <Dialog open={!!bulkDialog} onClose={handleCloseBulkDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {bulkDialog === 'approve' ? 'Bulk Approve Images' : 'Bulk Remove Images'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to{' '}
            <strong>{bulkDialog === 'approve' ? 'approve' : 'remove'}</strong> {selectedCount}{' '}
            flagged image{selectedCount !== 1 ? 's' : ''}?
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {bulkDialog === 'approve'
              ? 'Approved images will be restored to active status and removed from the moderation queue.'
              : 'Removed images will be marked as removed and hidden from public view.'}
          </Typography>

          <TextField
            label="Bulk Moderation Notes (Optional)"
            multiline
            rows={3}
            fullWidth
            value={bulkNotes}
            onChange={(e) => setBulkNotes(e.target.value)}
            placeholder={`Add notes about your bulk ${bulkDialog} decision...`}
            helperText="These notes will be applied to all selected images"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBulkDialog}>Cancel</Button>
          <Button
            variant="contained"
            color={bulkDialog === 'approve' ? 'success' : 'error'}
            onClick={handleSubmitBulkModeration}
          >
            {bulkDialog === 'approve' ? `Approve ${selectedCount}` : `Remove ${selectedCount}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 * PropTypes validation for ImageModerationBulkActions component
 */
ImageModerationBulkActions.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onBulkModerate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  sx: PropTypes.object,
};
