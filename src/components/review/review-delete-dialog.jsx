/**
 * @namespace CityArtWalks.Components.Review.ReviewDeleteDialog
 * @version 1.0.0
 * @author Claude Assistant
 * @description Delete review confirmation dialog component
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { DeleteIcon } from 'src/components/icons/delete-icon';

/**
 * @memberof CityArtWalks.Components.Review.ReviewDeleteDialog
 * @function ReviewDeleteDialog
 * @description Dialog component for confirming review deletion with loading state
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback when dialog is closed
 * @param {Function} props.onConfirm - Callback when delete is confirmed
 * @param {Object} [props.review] - The review to be deleted
 * @param {string} [props.entityName] - Name of the entity being reviewed
 * @param {boolean} [props.loading=false] - Whether delete operation is in progress
 * @returns {JSX.Element} The rendered ReviewDeleteDialog component
 */
export function ReviewDeleteDialog({
  open,
  onClose,
  onConfirm,
  review,
  entityName,
  loading = false,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (loading || isDeleting || !onConfirm) return;

    setIsDeleting(true);
    try {
      await onConfirm(review);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = loading || isDeleting;

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-review-dialog-title"
    >
      <DialogTitle id="delete-review-dialog-title">Delete Review</DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
          Are you sure you want to delete this review?
        </Typography>

        {entityName && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Reviewing: <strong>{entityName}</strong>
          </Typography>
        )}

        {review && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              bgcolor: 'background.neutral',
              p: 2,
              borderRadius: 1,
            }}
          >
            &ldquo;{review.comment?.substring(0, 100)}
            {review.comment?.length > 100 ? '...' : ''}&rdquo;
          </Typography>
        )}

        <Typography variant="body2" color="warning.main" sx={{ mt: 2, fontWeight: 'medium' }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="inherit">
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          variant="contained"
          color="error"
          startIcon={
            isLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon size={16} />
          }
          sx={{ minWidth: 120 }}
        >
          {isLoading ? 'Deleting...' : 'Delete Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ReviewDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  review: PropTypes.object,
  entityName: PropTypes.string,
  loading: PropTypes.bool,
};
