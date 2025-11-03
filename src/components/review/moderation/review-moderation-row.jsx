/**
 * Review Moderation Row Component
 *
 * Individual table row component for review moderation queue.
 * Displays review details with action buttons for moderation operations.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.ReviewModerationRow
 * @fileoverview Individual row component for review moderation table
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
  Tooltip,
  TableRow,
  Checkbox,
  TableCell,
  Typography,
  IconButton,
} from '@mui/material';

import { UserBadge } from 'src/components/user';
import { Iconify } from 'src/components/iconify';
import { ViewIcon, StarIcon, CheckCircleIcon } from 'src/components/icons';

import { AIDecisionDisplay } from './ai-decision-display';
import { ReviewDetailsDialog } from './review-details-dialog';
import { ManualOverrideDialog } from './manual-override-dialog';

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
 * @memberof CityArtWalks.Components.Review.Moderation.ReviewModerationRow
 * @function ReviewModerationRow
 * @description Table row component displaying review details with moderation actions
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.row - Review data object
 * @param {boolean} props.selected - Whether the row is selected
 * @param {Function} props.onSelectRow - Function to handle row selection
 * @param {Function} props.onUpdateStatus - Function to handle status updates
 * @param {Function} props.onManualOverride - Function to handle manual overrides
 * @param {Function} props.onRetryAI - Function to retry AI moderation
 * @returns {JSX.Element} The rendered review moderation row component
 *
 * @example
 * <ReviewModerationRow
 *   row={reviewData}
 *   selected={isSelected}
 *   onSelectRow={handleSelectRow}
 *   onUpdateStatus={handleStatusUpdate}
 *   onManualOverride={handleManualOverride}
 *   onRetryAI={handleRetryAI}
 * />
 */
export function ReviewModerationRow({
  row,
  selected,
  onSelectRow,
  onUpdateStatus,
  onManualOverride,
  onRetryAI,
}) {
  const [loading, setLoading] = useState(false);
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleStatusUpdate = useCallback(
    async (newStatus, reason = null) => {
      setLoading(true);
      try {
        await onUpdateStatus(row.reviewId, newStatus, reason);
      } finally {
        setLoading(false);
      }
    },
    [row.reviewId, onUpdateStatus]
  );

  const handleRetryAI = useCallback(
    async (reviewId) => {
      setLoading(true);
      try {
        if (onRetryAI) {
          const result = await onRetryAI(reviewId);
          return result;
        }
        return null; // Return null when onRetryAI is not provided
      } finally {
        setLoading(false);
      }
    },
    [onRetryAI]
  );

  const statusConfig = STATUS_CONFIG[row.status] || STATUS_CONFIG.PENDING;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          slotProps={{
            input: {
              id: `row-checkbox-${row.reviewId}`,
              'aria-label': `Select review ${row.reviewId}`,
            },
          }}
        />
      </TableCell>

      {/* Comment */}
      <TableCell>
        <Box sx={{ maxWidth: 280 }}>
          <Typography variant="body2" noWrap>
            {row.comment || 'No comment provided'}
          </Typography>
        </Box>
      </TableCell>

      {/* Rating */}
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <StarIcon sx={{ color: 'warning.main' }} />
          <Typography variant="body2">{row.rating}/5</Typography>
        </Stack>
      </TableCell>

      {/* Content Entity */}
      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {row.entity?.name || 'Unknown'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.entity?.type || 'Unknown Type'}
          </Typography>
        </Box>
      </TableCell>

      {/* User */}
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <UserBadge userId={row.user?.userId} size="small" />
        </Stack>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Chip
          size="small"
          label={statusConfig.label}
          color={statusConfig.color}
          variant="soft"
          icon={<Iconify icon={statusConfig.icon} />}
        />
      </TableCell>

      {/* AI Decision */}
      <TableCell>
        <AIDecisionDisplay review={row} />
      </TableCell>

      {/* Manual Override */}
      <TableCell>
        {row.manualOverride ? (
          <Tooltip title={`Override by admin: ${row.overrideReason}`}>
            <Chip
              size="small"
              label={`Override: ${row.overrideDecision}`}
              color="warning"
              variant="soft"
              icon={<Iconify icon="solar:user-check-bold" />}
            />
          </Tooltip>
        ) : (
          <Chip size="small" label="No Override" variant="outlined" color="default" />
        )}
      </TableCell>

      {/* Flag Reason */}
      <TableCell>
        <Typography variant="body2">{row.flagReason || '-'}</Typography>
      </TableCell>

      {/* Created At */}
      <TableCell>
        <Typography variant="body2">{new Date(row.createdAt).toLocaleDateString()}</Typography>
      </TableCell>

      {/* Actions */}
      <TableCell align="center">
        <Stack direction="row" spacing={0.5} justifyContent="center">
          {row.status !== 'ACTIVE' && (
            <IconButton
              size="small"
              color="success"
              disabled={loading}
              onClick={() => handleStatusUpdate('APPROVE')}
              title="Approve Review"
            >
              <CheckCircleIcon />
            </IconButton>
          )}

          {row.status !== 'DELETED' && (
            <IconButton
              size="small"
              color="error"
              disabled={loading}
              onClick={() => handleStatusUpdate('REJECT')}
              title="Reject Review"
            >
              <Iconify icon="solar:close-circle-bold" />
            </IconButton>
          )}

          {/* Manual Override Button */}
          <IconButton
            size="small"
            color="warning"
            disabled={loading}
            onClick={() => setOverrideDialogOpen(true)}
            title="Manual Override"
          >
            <Iconify icon="solar:user-check-bold" />
          </IconButton>

          <IconButton
            size="small"
            disabled={loading}
            onClick={() => setDetailsDialogOpen(true)}
            title="View Details"
          >
            <ViewIcon />
          </IconButton>
        </Stack>

        {/* Manual Override Dialog */}
        <ManualOverrideDialog
          open={overrideDialogOpen}
          onClose={() => setOverrideDialogOpen(false)}
          review={row}
          onOverride={onManualOverride}
        />

        {/* Review Details Dialog */}
        <ReviewDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          review={row}
          onUpdateStatus={handleStatusUpdate}
          onManualOverride={onManualOverride}
          onRetryAI={handleRetryAI}
          loading={loading}
        />
      </TableCell>
    </TableRow>
  );
}

ReviewModerationRow.propTypes = {
  row: PropTypes.shape({
    reviewId: PropTypes.number.isRequired,
    comment: PropTypes.string,
    rating: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    flagReason: PropTypes.string,
    manualOverride: PropTypes.bool,
    overrideReason: PropTypes.string,
    overrideDecision: PropTypes.string,
    entity: PropTypes.object,
    user: PropTypes.object,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onManualOverride: PropTypes.func.isRequired,
  onRetryAI: PropTypes.func,
};
