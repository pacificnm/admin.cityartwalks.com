/**
 * @namespace CityArtWalks.Components.Review.ReviewEditDialog
 * @version 1.0.0
 * @description Edit dialog for reviews (placed in its own file per project pattern)
 */

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Accordion from '@mui/material/Accordion';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { ReviewsForm } from 'src/forms/reviews/reviews-form';

import { Iconify } from 'src/components/iconify';
import { CheckCircleIcon, ChevronDownIcon } from 'src/components/icons';

/**
 * ReviewEditDialog
 * @param {Object} props
 * @param {Object} props.currentReview - review to edit
 * @param {boolean} props.open - dialog open state
 * @param {Function} props.onClose - close handler
 * @param {boolean} props.showAIFeedback - whether to show AI feedback in header
 * @param {Function} props.onUpdateSuccess - callback when review is successfully updated and approved
 */
export function ReviewEditDialog({
  currentReview,
  open,
  onClose,
  showAIFeedback = false,
  onUpdateSuccess,
}) {
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Edit Review
        {showAIFeedback &&
          currentReview?.status === 'REJECTED' &&
          currentReview?.aiModerationReason && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 'bold' }}>
                Moderator Feedback:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {currentReview?.aiModerationReason}
              </Typography>
              {currentReview?.aiModerationSuggestions && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  <strong>Suggestions:</strong>{' '}
                  {Array.isArray(currentReview.aiModerationSuggestions)
                    ? currentReview.aiModerationSuggestions.join(', ')
                    : currentReview.aiModerationSuggestions}
                </Typography>
              )}
            </Box>
          )}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <ReviewsForm
            entityType={
              currentReview?.artPieceId
                ? 'ART_PIECE'
                : currentReview?.artistId
                  ? 'ARTIST'
                  : currentReview?.imageId
                    ? 'IMAGE'
                    : currentReview?.pathId
                      ? 'PATH'
                      : currentReview?.pathMapId
                        ? 'PATH_MAP'
                        : 'ART_PIECE'
            }
            entityId={
              currentReview?.artPieceId ||
              currentReview?.artistId ||
              currentReview?.imageId ||
              currentReview?.pathId ||
              currentReview?.pathMapId
            }
            entityName={
              currentReview?.ArtPiece?.title ||
              currentReview?.Artist?.name ||
              currentReview?.Image?.caption ||
              currentReview?.Path?.title ||
              'Unknown'
            }
            currentReview={currentReview}
            onSuccess={(result, action) => {
              setApiResponse(result);
              setApiError(null);

              // Check if the review was approved (for updates)
              const isApproved =
                result?.data?.review?.status === 'ACTIVE' ||
                result?.review?.status === 'ACTIVE' ||
                result?.data?.moderation?.approved === true;

              if (isApproved && action === 'update') {
                // Close the dialog after a brief delay to show success
                setTimeout(() => {
                  onClose();
                  // Call the success callback if provided to refresh data
                  if (onUpdateSuccess) {
                    onUpdateSuccess(result);
                  } else {
                    // Fallback to page reload if no callback provided
                    window.location.reload();
                  }
                }, 1500);
              }
            }}
            onError={(error) => {
              setApiError(error);
              setApiResponse(null);
            }}
            onCancel={() => {
              setApiResponse(null);
              setApiError(null);
              onClose();
            }}
            showEntityInfo
          />
        </Box>

        {(apiResponse || apiError) && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDownIcon />}
              sx={{
                bgcolor: apiError ? 'error.lighter' : 'success.lighter',
                '& .MuiAccordionSummary-content': { my: 1 },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Iconify
                  icon={apiError ? 'solar:danger-triangle-bold' : 'solar:check-circle-bold'}
                  sx={{ color: apiError ? 'error.main' : 'success.main' }}
                />
                {apiError ? 'API Error Response' : 'API Success Response'}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Alert severity={apiError ? 'error' : 'success'} sx={{ mb: 2 }}>
                {apiError
                  ? 'Request failed - see details below'
                  : 'Request succeeded - see details below'}
              </Alert>

              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  maxHeight: '400px',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(apiError || apiResponse, null, 2)}
                </pre>
              </Box>

              {apiResponse && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <IconButton
                    onClick={() => {
                      setApiResponse(null);
                      setApiError(null);
                      onClose();
                    }}
                    variant="contained"
                    color="primary"
                  >
                    <CheckCircleIcon />
                    Close & Refresh
                  </IconButton>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </DialogContent>
    </Dialog>
  );
}
