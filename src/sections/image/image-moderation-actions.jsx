/**
 * @namespace CityArtWalks.Sections.Dashboard.Image.ImageModerationActions
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Sections.Dashboard.Image
 * @description Individual image moderation actions component with approve and remove buttons.
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { ViewIcon, DeleteIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Sections.Dashboard.Image.ImageModerationActions
 * @function ImageModerationActions
 * @description Row-level moderation actions for individual flagged images.
 * Provides approve, remove, and view detail actions with notes support.
 *
 * @param {Object} props - Component props
 * @param {Object} props.image - The flagged image object
 * @param {Function} props.onModerate - Callback for moderation actions (imageId, action, notes)
 * @returns {JSX.Element} The rendered ImageModerationActions component
 */
export function ImageModerationActions({ image, onModerate }) {
  const [moderationDialog, setModerationDialog] = useState(null); // 'approve' or 'remove'
  const [moderationNotes, setModerationNotes] = useState('');

  const handleOpenModerationDialog = (action) => {
    setModerationDialog(action);
    setModerationNotes('');
  };

  const handleCloseModerationDialog = () => {
    setModerationDialog(null);
    setModerationNotes('');
  };

  const handleSubmitModeration = async () => {
    if (onModerate && moderationDialog) {
      await onModerate(image.imageId, moderationDialog, moderationNotes);
      handleCloseModerationDialog();
    }
  };

  const handleViewImage = () => {
    // Open image in new tab/window for detailed review
    window.open(image.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {/* View Image */}
        <Tooltip title="View Full Image" placement="top">
          <IconButton size="small" onClick={handleViewImage}>
            <ViewIcon size={16} />
          </IconButton>
        </Tooltip>

        {/* Approve */}
        <Tooltip title="Approve Image" placement="top">
          <IconButton
            size="small"
            color="success"
            onClick={() => handleOpenModerationDialog('approve')}
          >
            <Box
              component="span"
              sx={{
                width: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              ✓
            </Box>
          </IconButton>
        </Tooltip>

        {/* Remove */}
        <Tooltip title="Remove Image" placement="top">
          <IconButton
            size="small"
            color="error"
            onClick={() => handleOpenModerationDialog('remove')}
          >
            <DeleteIcon size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Moderation Dialog */}
      <Dialog
        open={!!moderationDialog}
        onClose={handleCloseModerationDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {moderationDialog === 'approve' ? 'Approve Image' : 'Remove Image'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <strong>Image:</strong> {image.caption || `Image ID: ${image.imageId}`}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Flag Reason:</strong> {image.flagReason || 'No reason provided'}
          </Box>
          <Box sx={{ mb: 2 }}>
            <strong>Reported By:</strong> {image.FlaggedByUser?.name || 'Unknown'}
          </Box>

          <TextField
            label="Moderation Notes (Optional)"
            multiline
            rows={3}
            fullWidth
            value={moderationNotes}
            onChange={(e) => setModerationNotes(e.target.value)}
            placeholder={`Add notes about your ${moderationDialog} decision...`}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModerationDialog}>Cancel</Button>
          <Button
            variant="contained"
            color={moderationDialog === 'approve' ? 'success' : 'error'}
            onClick={handleSubmitModeration}
          >
            {moderationDialog === 'approve' ? 'Approve' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 * PropTypes validation for ImageModerationActions component
 */
ImageModerationActions.propTypes = {
  image: PropTypes.shape({
    imageId: PropTypes.number.isRequired,
    caption: PropTypes.string,
    flagReason: PropTypes.string,
    url: PropTypes.string.isRequired,
    FlaggedByUser: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
  onModerate: PropTypes.func.isRequired,
};
