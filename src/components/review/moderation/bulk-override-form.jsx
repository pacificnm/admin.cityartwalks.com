/**
 * Bulk Override Form Component
 *
 * Specialized form for performing bulk manual overrides with detailed reasoning.
 * Used in review moderation queue for bulk operations on multiple reviews.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.BulkOverrideForm
 * @fileoverview Bulk override form for review moderation
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
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CheckCircleIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Review.Moderation.BulkOverrideForm
 * @function BulkOverrideForm
 * @description Form component for bulk override operations on multiple reviews
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.selectedReviews - Array of selected review objects
 * @param {Object} props.bulkActionSuggestions - AI suggestions for bulk actions
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onCancel - Function to handle form cancellation
 * @param {boolean} props.isLoading - Whether the form is in loading state
 * @returns {JSX.Element} The rendered bulk override form component
 *
 * @example
 * <BulkOverrideForm
 *   selectedReviews={selectedReviews}
 *   bulkActionSuggestions={suggestions}
 *   onSubmit={handleBulkSubmit}
 *   onCancel={handleCancel}
 *   isLoading={loading}
 * />
 */
export function BulkOverrideForm({
  selectedReviews,
  bulkActionSuggestions,
  onSubmit,
  onCancel,
  isLoading,
}) {
  const [overrideData, setOverrideData] = useState({
    decision: '',
    reason: '',
  });

  const handleSubmit = useCallback(async () => {
    if (!overrideData.decision || !overrideData.reason.trim()) {
      toast.warning('Please select a decision and provide a reason');
      return;
    }

    if (overrideData.reason.trim().length < 20) {
      toast.warning('Reason must be at least 20 characters for bulk operations');
      return;
    }

    await onSubmit(overrideData);
  }, [overrideData, onSubmit]);

  const handleCancel = useCallback(() => {
    if (!isLoading) {
      setOverrideData({ decision: '', reason: '' });
      onCancel();
    }
  }, [isLoading, onCancel]);

  return (
    <Stack spacing={3}>
      {/* Selection Summary */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Selected Reviews Summary
        </Typography>
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="h4" color="primary.main">
                {selectedReviews.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Selected
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="success.main">
                {bulkActionSuggestions?.aiApproved || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI Approved
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="error.main">
                {bulkActionSuggestions?.aiRejected || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                AI Rejected
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="warning.main">
                {bulkActionSuggestions?.alreadyOverridden || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Already Overridden
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Smart Suggestion */}
      {bulkActionSuggestions?.suggestion && (
        <Box
          sx={{
            p: 2,
            bgcolor: 'info.lighter',
            borderRadius: 1,
            border: 1,
            borderColor: 'info.main',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:brain-bold" sx={{ color: 'info.main' }} />
            <Typography variant="subtitle2" color="info.dark">
              AI Suggestion: {bulkActionSuggestions.suggestion}
            </Typography>
          </Stack>
          <Typography variant="body2" color="info.dark" sx={{ mt: 1 }}>
            Based on AI analysis, most selected reviews should be{' '}
            {bulkActionSuggestions.suggestion.toLowerCase()}d.
          </Typography>
        </Box>
      )}

      {/* Override Decision */}
      <FormControl fullWidth required>
        <InputLabel>Override Decision</InputLabel>
        <Select
          value={overrideData.decision}
          label="Override Decision"
          onChange={(e) => setOverrideData((prev) => ({ ...prev, decision: e.target.value }))}
          disabled={isLoading}
        >
          <MenuItem value="APPROVE">
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon sx={{ color: 'success.main' }} />
              <span>Approve All Selected Reviews</span>
            </Stack>
          </MenuItem>
          <MenuItem value="REJECT">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:close-circle-bold" sx={{ color: 'error.main' }} />
              <span>Reject All Selected Reviews</span>
            </Stack>
          </MenuItem>
          <MenuItem value="DELETE">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:trash-bin-minimalistic-bold" sx={{ color: 'error.main' }} />
              <span>Delete All Selected Reviews</span>
            </Stack>
          </MenuItem>
        </Select>
      </FormControl>

      {/* Override Reason */}
      <TextField
        fullWidth
        required
        multiline
        rows={6}
        label="Detailed Reason for Bulk Override"
        placeholder="Provide a comprehensive explanation for overriding AI decisions on multiple reviews. This will be recorded in the audit trail for each review..."
        value={overrideData.reason}
        onChange={(e) => setOverrideData((prev) => ({ ...prev, reason: e.target.value }))}
        disabled={isLoading}
        helperText={`${overrideData.reason.length}/20 characters minimum. This reason will be applied to all ${selectedReviews.length} selected reviews.`}
        error={overrideData.reason.length > 0 && overrideData.reason.length < 20}
      />

      {/* Sample Reviews Preview */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Sample Reviews (showing first 3):
        </Typography>
        <Stack spacing={1}>
          {selectedReviews.slice(0, 3).map((review, index) => (
            <Box key={review.reviewId} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" noWrap>
                <strong>Review {index + 1}:</strong> {review.comment || 'No comment'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Rating: {review.rating}/5 • AI:{' '}
                {review.aiModerationApproved === true
                  ? 'Approved'
                  : review.aiModerationApproved === false
                    ? 'Rejected'
                    : 'No Decision'}
              </Typography>
            </Box>
          ))}
          {selectedReviews.length > 3 && (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              ... and {selectedReviews.length - 3} more reviews
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading || !overrideData.decision || overrideData.reason.length < 20}
          startIcon={
            isLoading ? (
              <Iconify icon="solar:loading-bold" sx={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Iconify icon="solar:users-group-two-rounded-bold" />
            )
          }
        >
          {isLoading ? 'Processing...' : `Override ${selectedReviews.length} Reviews`}
        </Button>
      </Stack>
    </Stack>
  );
}

BulkOverrideForm.propTypes = {
  selectedReviews: PropTypes.arrayOf(
    PropTypes.shape({
      reviewId: PropTypes.number.isRequired,
      comment: PropTypes.string,
      rating: PropTypes.number.isRequired,
      aiModerationApproved: PropTypes.bool,
    })
  ).isRequired,
  bulkActionSuggestions: PropTypes.shape({
    suggestion: PropTypes.string,
    aiApproved: PropTypes.number,
    aiRejected: PropTypes.number,
    alreadyOverridden: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
