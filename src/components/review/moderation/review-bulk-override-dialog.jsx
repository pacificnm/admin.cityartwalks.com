/**
 * Review Bulk Override Dialog Component
 *
 * Dialog wrapper for bulk override operations.
 * Contains the BulkOverrideForm with proper dialog structure and styling.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.ReviewBulkOverrideDialog
 * @fileoverview Dialog wrapper for bulk override form
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Moderation} - Moderation documentation
 */

'use client';

import PropTypes from 'prop-types';

import { Stack, Dialog, Typography, DialogTitle, DialogContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { BulkOverrideForm } from './bulk-override-form';

/**
 * @memberof CityArtWalks.Components.Review.Moderation.ReviewBulkOverrideDialog
 * @function ReviewBulkOverrideDialog
 * @description Dialog wrapper for bulk manual override operations
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Array} props.selectedReviews - Array of selected review objects
 * @param {Object} props.bulkActionSuggestions - AI suggestions for bulk actions
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {boolean} props.isLoading - Whether the form is in loading state
 * @returns {JSX.Element} The rendered bulk override dialog component
 *
 * @example
 * <ReviewBulkOverrideDialog
 *   open={bulkOverrideDialogOpen}
 *   onClose={() => setBulkOverrideDialogOpen(false)}
 *   selectedReviews={selectedReviews}
 *   bulkActionSuggestions={bulkActionSuggestions}
 *   onSubmit={handleBulkOverride}
 *   isLoading={bulkActionProgress.show}
 * />
 */
export function ReviewBulkOverrideDialog({
  open,
  onClose,
  selectedReviews,
  bulkActionSuggestions,
  onSubmit,
  isLoading,
}) {
  const handleSubmit = async (overrideData) => {
    await onSubmit(overrideData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:users-group-two-rounded-bold" />
          <Typography variant="h6">Bulk Manual Override</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <BulkOverrideForm
          selectedReviews={selectedReviews}
          bulkActionSuggestions={bulkActionSuggestions}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

ReviewBulkOverrideDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedReviews: PropTypes.arrayOf(
    PropTypes.shape({
      reviewId: PropTypes.number.isRequired,
      comment: PropTypes.string,
      rating: PropTypes.number.isRequired,
    })
  ).isRequired,
  bulkActionSuggestions: PropTypes.shape({
    suggestion: PropTypes.string,
    aiApproved: PropTypes.number,
    aiRejected: PropTypes.number,
    alreadyOverridden: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
