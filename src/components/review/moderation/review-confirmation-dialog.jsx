/**
 * Review Confirmation Dialog Component
 *
 * Enhanced confirmation dialog for bulk actions with impact summary.
 * Shows detailed information about the selected reviews and action consequences.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.ReviewConfirmationDialog
 * @fileoverview Enhanced confirmation dialog for bulk review actions
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Moderation} - Moderation documentation
 */

'use client';

import PropTypes from 'prop-types';

import { Box, Stack, Button, Typography } from '@mui/material';

import { ConfirmDialog } from 'src/components/custom-dialog';

/**
 * Status configuration for review moderation
 * @constant {Object} STATUS_CONFIG
 */
const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Review',
    color: 'warning',
    icon: 'solar:clock-circle-bold',
  },
  REVIEW: {
    label: 'Flagged',
    color: 'error',
    icon: 'solar:danger-triangle-bold',
  },
  ACTIVE: {
    label: 'Approved',
    color: 'success',
    icon: 'solar:check-circle-bold',
  },
  DELETED: {
    label: 'Rejected',
    color: 'default',
    icon: 'solar:close-circle-bold',
  },
};

/**
 * @memberof CityArtWalks.Components.Review.Moderation.ReviewConfirmationDialog
 * @function ReviewConfirmationDialog
 * @description Enhanced confirmation dialog with impact summary for bulk actions
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.onConfirm - Function to handle confirmation
 * @param {string} props.selectedAction - The selected action type
 * @param {number} props.selectedCount - Number of selected reviews
 * @param {Object} props.bulkActionSuggestions - AI suggestions and impact data
 * @param {boolean} props.isProcessing - Whether the action is currently processing
 * @returns {JSX.Element} The rendered confirmation dialog component
 *
 * @example
 * <ReviewConfirmationDialog
 *   open={confirm.value}
 *   onClose={confirm.onFalse}
 *   onConfirm={handleExecuteBulkAction}
 *   selectedAction={selectedAction}
 *   selectedCount={table.selected.length}
 *   bulkActionSuggestions={bulkActionSuggestions}
 *   isProcessing={bulkActionProgress.show}
 * />
 */
export function ReviewConfirmationDialog({
  open,
  onClose,
  onConfirm,
  selectedAction,
  selectedCount,
  bulkActionSuggestions,
  isProcessing,
}) {
  const statusConfig = STATUS_CONFIG[selectedAction];

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title="Confirm Bulk Action"
      content={
        <Box>
          <Typography gutterBottom>
            Are you sure you want to {statusConfig?.label.toLowerCase()} {selectedCount} selected
            reviews?
          </Typography>

          {/* Impact Summary */}
          {bulkActionSuggestions && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Impact Summary:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  • AI Approved: {bulkActionSuggestions.aiApproved}
                </Typography>
                <Typography variant="body2">
                  • AI Rejected: {bulkActionSuggestions.aiRejected}
                </Typography>
                <Typography variant="body2">
                  • No AI Decision: {bulkActionSuggestions.noAiDecision}
                </Typography>
                <Typography variant="body2">
                  • Already Overridden: {bulkActionSuggestions.alreadyOverridden}
                </Typography>
              </Stack>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone. All selected reviews will be processed sequentially.
          </Typography>
        </Box>
      }
      action={
        <Button
          variant="contained"
          color={statusConfig?.color || 'primary'}
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Confirm'}
        </Button>
      }
    />
  );
}

ReviewConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  selectedAction: PropTypes.string.isRequired,
  selectedCount: PropTypes.number.isRequired,
  bulkActionSuggestions: PropTypes.shape({
    aiApproved: PropTypes.number,
    aiRejected: PropTypes.number,
    noAiDecision: PropTypes.number,
    alreadyOverridden: PropTypes.number,
  }),
  isProcessing: PropTypes.bool.isRequired,
};
