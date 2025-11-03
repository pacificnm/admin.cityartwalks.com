/**
 * AI Decision Display Component
 *
 * Shows detailed AI moderation information in a chip or dialog.
 * Used in review moderation queue to display AI analysis results.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.AIDecisionDisplay
 * @fileoverview AI moderation decision display component
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
  Stack,
  Dialog,
  Tooltip,
  Typography,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Review.Moderation.AIDecisionDisplay
 * @function AIDecisionDisplay
 * @description Component that displays AI moderation decision in a chip with detailed dialog
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.review - Review object with AI moderation data
 * @param {boolean} props.review.aiModerationApproved - Whether AI approved the review
 * @param {string} [props.review.aiModerationReason] - Reason for AI rejection
 * @param {string} [props.review.aiModerationTimestamp] - When AI moderation occurred
 * @param {string} [props.review.aiModerationModel] - AI model used for moderation
 * @param {Array} [props.review.aiModerationSuggestions] - AI suggestions for improvement
 * @param {Object} [props.review.aiModerationDetails] - Detailed AI analysis
 * @param {boolean} [props.review.requiresManualReview] - Whether manual review is required
 * @returns {JSX.Element} The rendered AI decision display component
 *
 * @example
 * <AIDecisionDisplay
 *   review={{
 *     aiModerationApproved: true,
 *     aiModerationReason: "Content is appropriate",
 *     aiModerationTimestamp: "2024-01-01T12:00:00Z",
 *     aiModerationModel: "GPT-4"
 *   }}
 * />
 */
export function AIDecisionDisplay({ review }) {
  const [open, setOpen] = useState(false);

  const hasAIData =
    review.aiModerationApproved !== null && review.aiModerationApproved !== undefined;

  if (!hasAIData) {
    return (
      <Chip
        size="small"
        label="No AI Review"
        variant="outlined"
        color="default"
        icon={<Iconify icon="solar:question-circle-bold" />}
      />
    );
  }

  const approved = review.aiModerationApproved;
  const chipColor = approved ? 'success' : 'error';
  const chipIcon = approved ? 'solar:check-circle-bold' : 'solar:close-circle-bold';
  const chipLabel = approved ? 'AI Approved' : 'AI Rejected';

  return (
    <>
      <Tooltip title="Click to view AI reasoning details">
        <Chip
          size="small"
          label={chipLabel}
          variant="soft"
          color={chipColor}
          icon={<Iconify icon={chipIcon} />}
          onClick={() => setOpen(true)}
          sx={{ cursor: 'pointer' }}
        />
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:brain-bold" />
            <Typography variant="h6">AI Moderation Decision</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            {/* Decision Overview */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Decision Overview
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={approved ? 'APPROVED' : 'REJECTED'}
                  color={chipColor}
                  icon={<Iconify icon={chipIcon} />}
                />
                {review.aiModerationTimestamp && (
                  <Typography variant="body2" color="text.secondary">
                    {new Date(review.aiModerationTimestamp).toLocaleString()}
                  </Typography>
                )}
                {review.aiModerationModel && (
                  <Chip size="small" label={review.aiModerationModel} variant="outlined" />
                )}
              </Stack>
            </Box>

            {/* Rejection Reason */}
            {!approved && review.aiModerationReason && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Rejection Reason
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {review.aiModerationReason}
                </Typography>
              </Box>
            )}

            {/* AI Suggestions */}
            {review.aiModerationSuggestions && Array.isArray(review.aiModerationSuggestions) && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  AI Suggestions
                </Typography>
                <Stack spacing={1}>
                  {review.aiModerationSuggestions.map((suggestion, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Iconify
                        icon="solar:lightbulb-bolt-bold"
                        sx={{ mt: 0.5, color: 'warning.main' }}
                      />
                      <Typography variant="body2">{suggestion}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Detailed Analysis */}
            {review.aiModerationDetails && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Detailed Analysis
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                  <pre style={{ margin: 0, fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(review.aiModerationDetails, null, 2)}
                  </pre>
                </Box>
              </Box>
            )}

            {/* Manual Review Required */}
            {review.requiresManualReview && (
              <Box>
                <Chip
                  label="Requires Manual Review"
                  color="warning"
                  icon={<Iconify icon="solar:user-check-bold" />}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

AIDecisionDisplay.propTypes = {
  review: PropTypes.shape({
    aiModerationApproved: PropTypes.bool,
    aiModerationReason: PropTypes.string,
    aiModerationTimestamp: PropTypes.string,
    aiModerationModel: PropTypes.string,
    aiModerationSuggestions: PropTypes.array,
    aiModerationDetails: PropTypes.object,
    requiresManualReview: PropTypes.bool,
  }).isRequired,
};
