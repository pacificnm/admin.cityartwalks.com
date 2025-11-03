/**
 * Review Details Dialog Component
 *
 * Comprehensive dialog showing full review details including AI analysis,
 * moderation decisions, user information, and content entity details.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.ReviewDetailsDialog
 * @fileoverview Full review details modal dialog
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Moderation} - Moderation documentation
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Chip,
  Grid,
  Stack,
  Dialog,
  Rating,
  Button,
  Divider,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { UserBadge } from 'src/components/user';
import { Iconify } from 'src/components/iconify';
import { CloseIcon } from 'src/components/icons';

import { ManualOverrideDialog } from './manual-override-dialog';

/**
 * Status configuration for review details display
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
 * @memberof CityArtWalks.Components.Review.Moderation.ReviewDetailsDialog
 * @function ReviewDetailsDialog
 * @description Comprehensive dialog displaying full review details and AI analysis
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Object} props.review - Complete review data object with all relations
 * @param {Function} props.onUpdateStatus - Function to handle status updates
 * @param {Function} props.onManualOverride - Function to handle manual overrides
 * @param {Function} props.onRetryAI - Function to retry AI moderation
 * @param {boolean} props.loading - Whether actions are in loading state
 * @returns {JSX.Element} The rendered review details dialog component
 *
 * @example
 * <ReviewDetailsDialog
 *   open={detailsDialogOpen}
 *   onClose={() => setDetailsDialogOpen(false)}
 *   review={selectedReview}
 *   onUpdateStatus={handleStatusUpdate}
 *   onManualOverride={handleManualOverride}
 *   onRetryAI={handleRetryAI}
 *   loading={loading}
 * />
 */
export function ReviewDetailsDialog({
  open,
  onClose,
  review,
  onUpdateStatus,
  onManualOverride,
  onRetryAI,
  loading = false,
}) {
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [aiRetryResult, setAiRetryResult] = useState(null);

  if (!review) return null;

  const statusConfig = STATUS_CONFIG[review.status] || STATUS_CONFIG.PENDING;

  console.log('ReviewDetailsDialog render - aiRetryResult:', aiRetryResult);

  const handleStatusUpdate = async (newStatus) => {
    if (onUpdateStatus) {
      await onUpdateStatus(newStatus);
      onClose();
    }
  };

  const handleRetryAI = async () => {
    if (onRetryAI) {
      const result = await onRetryAI(review.reviewId);
      console.log('ReviewDetailsDialog received retry result:', result);
      // Store the AI result to display in the dialog
      if (result?.data?.aiResult) {
        console.log('Setting aiRetryResult:', result.data.aiResult);
        setAiRetryResult(result.data.aiResult);
      } else {
        console.log('No aiResult found in result:', result);
      }
      // Don't close dialog - let user see the updated AI response
    }
  };

  const handleManualOverride = async (reviewId, overrideData) => {
    if (onManualOverride) {
      await onManualOverride(reviewId, overrideData);
      setOverrideDialogOpen(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:eye-bold" />
            <Typography variant="h6">Review Details</Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Review Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Review Information
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Review ID
                </Typography>
                <Typography variant="body1">#{review.reviewId}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Rating
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2">({review.rating}/5)</Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Comment
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    minHeight: 60,
                  }}
                >
                  {review.comment || 'No comment provided'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={statusConfig.label}
                  color={statusConfig.color}
                  variant="soft"
                  icon={<Iconify icon={statusConfig.icon} />}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {new Date(review.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* User and Entity Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              User & Content
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Reviewer
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <UserBadge userId={review.user?.userId} size="medium" />
                  <Box>
                    <Typography variant="body1">{review.user?.name || 'Anonymous'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.user?.email}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Content Entity
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {review.entity?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {review.entity?.type || 'Unknown Type'}
                  </Typography>
                </Box>
              </Box>

              {review.flagReason && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Flag Reason
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    {review.flagReason}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* AI Analysis Section */}
          {(review.moderation || review.aiContext || aiRetryResult) && (
            <>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  AI Moderation Analysis
                  {aiRetryResult && (
                    <Chip label="Updated" size="small" color="info" variant="soft" sx={{ ml: 1 }} />
                  )}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      AI Decision
                    </Typography>
                    <Chip
                      label={
                        aiRetryResult?.decision ||
                        review.moderation?.decision ||
                        review.aiContext?.decision ||
                        'Not analyzed'
                      }
                      color={
                        (aiRetryResult?.decision ||
                          review.moderation?.decision ||
                          review.aiContext?.decision) === 'APPROVED'
                          ? 'success'
                          : 'error'
                      }
                      variant="soft"
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Confidence Score
                    </Typography>
                    <Typography variant="body1">
                      {(
                        (aiRetryResult?.confidence ||
                          review.moderation?.confidence ||
                          review.aiContext?.confidence ||
                          0) * 100
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Processing Time
                    </Typography>
                    <Typography variant="body1">
                      {aiRetryResult?.processedAt
                        ? new Date(aiRetryResult.processedAt).toLocaleString()
                        : review.moderation?.processedAt
                          ? new Date(review.moderation.processedAt).toLocaleString()
                          : 'No processing time available'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  {(aiRetryResult?.reasoning ||
                    review.moderation?.reasoning ||
                    review.aiContext?.reason) && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        AI Reasoning
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          p: 2,
                          bgcolor: aiRetryResult ? 'info.lighter' : 'grey.50',
                          borderRadius: 1,
                        }}
                      >
                        {aiRetryResult?.reasoning ||
                          review.moderation?.reasoning ||
                          review.aiContext?.reason}
                      </Typography>
                    </Box>
                  )}

                  {(aiRetryResult?.flags || review.moderation?.flags) &&
                    (aiRetryResult?.flags?.length > 0 || review.moderation?.flags?.length > 0) && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Content Flags
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {(aiRetryResult?.flags || review.moderation?.flags)?.map(
                            (flag, index) => (
                              <Chip
                                key={index}
                                label={flag}
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                            )
                          )}
                        </Stack>
                      </Box>
                    )}
                </Stack>
              </Grid>
            </>
          )}

          {/* Manual Override Section */}
          {review.manualOverride && (
            <>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Manual Override
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Override Decision
                    </Typography>
                    <Chip
                      label={review.overrideDecision}
                      color="warning"
                      variant="soft"
                      icon={<Iconify icon="solar:user-check-bold" />}
                    />
                  </Box>

                  {review.overrideReason && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Override Reason
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          p: 2,
                          bgcolor: 'warning.lighter',
                          borderRadius: 1,
                        }}
                      >
                        {review.overrideReason}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Grid>
            </>
          )}

          {/* AI Context Section */}
          {review.aiContext && (
            <>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  AI Analysis Context
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  <pre>{JSON.stringify(review.aiContext, null, 2)}</pre>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto' }}>
          Last updated: {new Date(review.updatedAt || review.createdAt).toLocaleString()}
        </Typography>

        <Stack direction="row" spacing={1}>
          {/* Approve Button */}
          {review.status !== 'ACTIVE' && (
            <Button
              variant="contained"
              color="success"
              disabled={loading}
              onClick={() => handleStatusUpdate('APPROVE')}
              startIcon={<Iconify icon="solar:check-circle-bold" />}
            >
              Approve
            </Button>
          )}

          {/* Reject Button - always available for admins */}
          <Button
            variant="contained"
            color="error"
            disabled={loading}
            onClick={() => handleStatusUpdate('REJECT')}
            startIcon={<Iconify icon="solar:close-circle-bold" />}
          >
            Reject
          </Button>

          {/* Manual Override Button */}
          <Button
            variant="outlined"
            color="warning"
            disabled={loading}
            onClick={() => setOverrideDialogOpen(true)}
            startIcon={<Iconify icon="solar:user-check-bold" />}
          >
            Override
          </Button>

          {/* Retry AI Moderation Button */}
          {onRetryAI && (
            <Button
              variant="outlined"
              color="info"
              disabled={loading}
              onClick={handleRetryAI}
              startIcon={<Iconify icon="solar:refresh-bold" />}
            >
              Retry AI
            </Button>
          )}
        </Stack>

        {/* Manual Override Dialog */}
        <ManualOverrideDialog
          open={overrideDialogOpen}
          onClose={() => setOverrideDialogOpen(false)}
          review={review}
          onOverride={handleManualOverride}
        />
      </DialogActions>
    </Dialog>
  );
}

ReviewDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func,
  onManualOverride: PropTypes.func,
  onRetryAI: PropTypes.func,
  loading: PropTypes.bool,
  review: PropTypes.shape({
    reviewId: PropTypes.number.isRequired,
    comment: PropTypes.string,
    rating: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    flagReason: PropTypes.string,
    manualOverride: PropTypes.bool,
    overrideReason: PropTypes.string,
    overrideDecision: PropTypes.string,
    entity: PropTypes.object,
    user: PropTypes.object,
    moderation: PropTypes.shape({
      decision: PropTypes.string,
      confidence: PropTypes.number,
      reasoning: PropTypes.string,
      flags: PropTypes.arrayOf(PropTypes.string),
      processedAt: PropTypes.string,
    }),
    aiContext: PropTypes.object,
  }),
};
