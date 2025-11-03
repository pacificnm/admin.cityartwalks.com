/**
 * @namespace CityArtWalks.Components.Image.ImageDialogFlag
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Flag image dialog component for reporting inappropriate content with reason submission.
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { debugLog, debugError } from 'src/lib/debug';

import { toast } from 'src/components/snackbar';

/**
 * @memberof CityArtWalks.Components.Image.ImageDialogFlag
 * @function ImageDialogFlag
 * @description Dialog component for flagging images with reason submission.
 * Handles form validation, submission, and user feedback.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Callback when dialog is closed.
 * @param {Function} [props.onFlag] - Callback for flag submission with imageId and reason.
 * @param {number} props.imageId - The unique ID of the image to flag.
 * @returns {JSX.Element} The rendered ImageDialogFlag component.
 *
 * @example
 * <ImageDialogFlag
 *   open={flagDialog.value}
 *   onClose={flagDialog.onFalse}
 *   onFlag={handleFlag}
 *   imageId={123}
 * />
 */
export function ImageDialogFlag(props) {
  const { open, onClose, onFlag, imageId } = props;

  const [flagReason, setFlagReason] = useState('');

  const handleClose = () => {
    debugLog('CityArtWalks.Components.Image.ImageDialogFlag.handleClose', 'Closing flag dialog', {
      imageId,
    });
    setFlagReason('');
    onClose();
  };

  const handleFlagSubmit = async () => {
    if (!flagReason.trim()) {
      toast.error('Please provide a reason for flagging');
      return;
    }

    try {
      debugLog(
        'CityArtWalks.Components.Image.ImageDialogFlag.handleFlagSubmit',
        'Submitting flag',
        {
          imageId,
          reason: flagReason,
        }
      );

      if (onFlag) {
        await onFlag(imageId, flagReason);
        toast.success('Image has been flagged for review');
        handleClose();
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Components.Image.ImageDialogFlag.handleFlagSubmit',
        'Failed to flag image',
        error
      );
      toast.error('Failed to flag image');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Flag Image</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2">Please provide a reason for flagging this image:</Typography>
          <Box
            component="textarea"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Describe why this image should be reviewed..."
            sx={{
              width: '100%',
              minHeight: 100,
              p: 1.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              fontFamily: 'inherit',
              fontSize: 14,
              resize: 'vertical',
              '&:focus': {
                outline: 'none',
                borderColor: 'primary.main',
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleFlagSubmit}
          disabled={!flagReason.trim()}
        >
          Submit Flag
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageDialogFlag
 * PropTypes validation for the ImageDialogFlag component
 */
ImageDialogFlag.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFlag: PropTypes.func,
  imageId: PropTypes.number.isRequired,
};
