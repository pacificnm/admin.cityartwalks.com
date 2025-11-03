/**
 * @namespace CityArtWalks.Components.Review.ReviewFlagDialog
 * @version 1.0.0
 * @author jaimie garner
 * @description Dialog for flagging a review with reason selection
 */

'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Alert,
  Button,
  Dialog,
  Select,
  Tooltip,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormHelperText,
} from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';
import { FLAG_REASON_OPTIONS } from 'src/constants/review-flag-reasons';

import { FlagIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Review.ReviewFlagDialog
 * @function ReviewFlagDialog
 * @description Dialog component for content owners to flag inappropriate reviews
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.onSubmit - Function to handle flag submission
 * @param {Object} props.review - The review being flagged
 * @param {string} props.entityName - Name of the content being reviewed
 * @param {boolean} [props.loading=false] - Whether the submission is in progress
 * @returns {JSX.Element} The rendered dialog component
 *
 * @example
 * <ReviewFlagDialog
 *   open={flagDialogOpen}
 *   onClose={() => setFlagDialogOpen(false)}
 *   onSubmit={handleFlagSubmit}
 *   review={selectedReview}
 *   entityName="Downtown Mural"
 *   loading={isSubmitting}
 * />
 */
export function ReviewFlagDialog({ open, onClose, onSubmit, review, entityName, loading = false }) {
  const [reason, setReason] = useState(FLAG_REASON_OPTIONS[0]?.value || 'inappropriate_content');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const handleClose = useCallback(() => {
    if (loading) return; // Prevent closing while submitting

    // Reset form state
    setReason(FLAG_REASON_OPTIONS[0]?.value || 'inappropriate_content');
    setCustomReason('');
    setError('');
    onClose();
  }, [loading, onClose]);

  const handleSubmit = useCallback(async () => {
    try {
      setError('');

      // Validation
      if (!reason) {
        setError('Please select a reason for flagging this review');
        return;
      }

      if (reason === 'other' && !customReason.trim()) {
        setError('Please provide details for the "Other" reason');
        return;
      }

      const flagData = {
        reason,
        details: reason === 'other' ? customReason.trim() : undefined,
        reviewId: review.reviewId,
        entityName,
      };

      debugLog('ReviewFlagDialog.handleSubmit', 'Submitting flag request', {
        reviewId: review.reviewId,
        reason,
        hasCustomReason: !!flagData.details,
      });

      await onSubmit(flagData);
      handleClose();
    } catch (submitError) {
      debugError('ReviewFlagDialog.handleSubmit', 'Failed to flag review', submitError);
      setError(submitError.message || 'Failed to flag review. Please try again.');
    }
  }, [reason, customReason, review, entityName, onSubmit, handleClose]);

  const handleReasonChange = useCallback((event) => {
    setReason(event.target.value);
    setError(''); // Clear error when user makes changes
  }, []);

  const handleCustomReasonChange = useCallback((event) => {
    setCustomReason(event.target.value);
    setError(''); // Clear error when user makes changes
  }, []);

  if (!review) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth data-cy="review-flag-dialog">
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlagIcon sx={{ color: 'warning.main' }} />
          Flag Review
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            You are flagging a review for &ldquo;{entityName}&rdquo;. This will notify moderators to
            investigate the review.
          </Typography>

          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'background.neutral',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Review by {review.user?.name || 'Anonymous'}:
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              &ldquo;{review.comment}&rdquo;
            </Typography>
          </Box>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reason for flagging</InputLabel>
          <Select
            value={reason}
            onChange={handleReasonChange}
            label="Reason for flagging"
            disabled={loading}
          >
            {FLAG_REASON_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Tooltip title={option.description} placement="right">
                  <span>{option.label}</span>
                </Tooltip>
              </MenuItem>
            ))}
          </Select>
          {reason && (
            <FormHelperText>
              {FLAG_REASON_OPTIONS.find((opt) => opt.value === reason)?.description}
            </FormHelperText>
          )}
        </FormControl>

        {reason === 'other' && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Please specify the reason"
            value={customReason}
            onChange={handleCustomReasonChange}
            disabled={loading}
            placeholder="Describe why you believe this review should be flagged..."
            sx={{ mb: 2 }}
          />
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Alert severity="info" sx={{ mb: 0 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Flagged reviews will be reviewed by our moderation team. False
            flagging may result in restrictions on your account.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FlagIcon />}
          data-cy="submit-flag-button"
        >
          {loading ? 'Flagging...' : 'Flag Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ReviewFlagDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  review: PropTypes.object,
  entityName: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};
