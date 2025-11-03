/**
 * Manual Override Dialog Component
 *
 * Allows admins to manually override AI decisions with detailed reasoning.
 * Used in review moderation queue for manual intervention in AI decisions.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.ManualOverrideDialog
 * @fileoverview Manual override dialog for review moderation
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Moderation} - Moderation documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import {
  Box,
  Chip,
  Stack,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { debugError } from 'src/lib/debug';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CheckCircleIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Review.Moderation.ManualOverrideDialog
 * @function ManualOverrideDialog
 * @description Dialog component for manual override of AI moderation decisions
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Object} props.review - Review object being overridden
 * @param {Function} props.onOverride - Function to handle override submission
 * @returns {JSX.Element} The rendered manual override dialog component
 *
 * @example
 * <ManualOverrideDialog
 *   open={dialogOpen}
 *   onClose={() => setDialogOpen(false)}
 *   review={selectedReview}
 *   onOverride={handleOverride}
 * />
 */
export function ManualOverrideDialog({ open, onClose, review, onOverride }) {
  const [overrideData, setOverrideData] = useState({
    decision: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  const handleOverride = useCallback(async () => {
    if (!overrideData.decision || !overrideData.reason.trim()) {
      toast.warning('Please select a decision and provide a reason');
      return;
    }

    setLoading(true);
    try {
      await onOverride(review.reviewId, overrideData);
      setOverrideData({ decision: '', reason: '' });
      onClose();
      toast.success('Manual override recorded successfully');
    } catch (error) {
      debugError('ManualOverrideDialog.handleOverride', error);
      toast.error(`Failed to record override: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [overrideData, review.reviewId, onOverride, onClose]);

  const handleClose = useCallback(() => {
    if (!loading) {
      setOverrideData({ decision: '', reason: '' });
      onClose();
    }
  }, [loading, onClose]);

  if (!review) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:user-check-bold" />
          <Typography variant="h6">Manual Override</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Review Summary */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Review Summary
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Comment:</strong> {review.comment || 'No comment provided'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Rating:</strong> {review.rating}/5
              </Typography>
              <Typography variant="body2">
                <strong>Current Status:</strong> {review.status}
              </Typography>
            </Box>
          </Box>

          {/* AI Decision Summary */}
          {review.aiModerationApproved !== null && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                AI Decision
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={review.aiModerationApproved ? 'APPROVED' : 'REJECTED'}
                  color={review.aiModerationApproved ? 'success' : 'error'}
                  variant="soft"
                />
                {review.aiModerationReason && (
                  <Typography variant="body2" color="text.secondary">
                    {review.aiModerationReason}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {/* Override Decision */}
          <FormControl fullWidth required>
            <InputLabel>Override Decision</InputLabel>
            <Select
              value={overrideData.decision}
              label="Override Decision"
              onChange={(e) => setOverrideData((prev) => ({ ...prev, decision: e.target.value }))}
              disabled={loading}
            >
              <MenuItem value="APPROVE">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                  <span>Approve Review</span>
                </Stack>
              </MenuItem>
              <MenuItem value="REJECT">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
                  <span>Reject Review</span>
                </Stack>
              </MenuItem>
              <MenuItem value="DELETE">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:trash-bin-minimalistic-bold" sx={{ color: 'error.main' }} />
                  <span>Delete Review</span>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Override Reason */}
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Reason for Override"
            placeholder="Explain why you are overriding the AI decision..."
            value={overrideData.reason}
            onChange={(e) => setOverrideData((prev) => ({ ...prev, reason: e.target.value }))}
            disabled={loading}
            helperText="This will be recorded in the audit trail and visible to other administrators"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleOverride}
          disabled={loading || !overrideData.decision || !overrideData.reason.trim()}
          startIcon={
            loading ? (
              <Iconify icon="solar:loading-bold" sx={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Iconify icon="solar:check-bold" />
            )
          }
        >
          {loading ? 'Recording...' : 'Record Override'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ManualOverrideDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  review: PropTypes.shape({
    reviewId: PropTypes.number.isRequired,
    comment: PropTypes.string,
    rating: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    aiModerationApproved: PropTypes.bool,
    aiModerationReason: PropTypes.string,
  }),
  onOverride: PropTypes.func.isRequired,
};
