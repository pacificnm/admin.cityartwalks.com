/**
 * @namespace CityArtWalks.Components.Review.ReviewFormDialog
 * @version 1.0.0
 * @author Jaimie Garner
 * @description Dialog wrapper for the review form with responsive design and proper modal behavior
 */

'use client';

import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';

import { ReviewsForm } from 'src/forms/reviews/reviews-form';

import { CloseIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

import ReviewErrorBoundary from './review-error-boundary';

/**
 * Slide transition component for mobile
 */
const SlideTransition = (props) => <Slide direction="up" {...props} />;

/**
 * @memberof CityArtWalks.Components.Review.ReviewFormDialog
 * @function ReviewFormDialog
 * @description Dialog wrapper for ReviewForm with responsive behavior.
 * Uses full-screen on mobile and modal on desktop.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Callback when dialog should close.
 * @param {string} props.entityType - Type of entity being reviewed.
 * @param {string|number} props.entityId - ID of the entity being reviewed.
 * @param {string} [props.entityName] - Name of the entity for display.
 * @param {string|number} [props.ownerId] - ID of the content owner (for ownership validation).
 * @param {Object} [props.currentReview] - Existing review data for editing.
 * @param {string} [props.title] - Custom dialog title.
 * @param {string} [props.maxWidth='sm'] - Maximum width of the dialog.
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width.
 * @param {Function} [props.onSuccess] - Callback when form submission succeeds.
 * @returns {JSX.Element} The rendered ReviewFormDialog component.
 */
export function ReviewFormDialog({
  open,
  onClose,
  entityType,
  entityId,
  entityName,
  ownerId,
  currentReview,
  title,
  maxWidth = 'sm',
  fullWidth = true,
  onSuccess,
  contextInfo, // Extract contextInfo to prevent it from being passed to Dialog
  ...other
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuthContext();

  // Check if user owns this content (additional safeguard)
  const isOwner = user && ownerId && user.userId === ownerId;

  // Determine if we're editing or creating
  const isEditing = Boolean(currentReview);

  // Generate dialog title
  const dialogTitle = title || (isEditing ? 'Edit Review' : 'Write a Review');

  // Safeguard: Close dialog if owner somehow tries to access it (defensive programming)
  React.useEffect(() => {
    if (open && isOwner && !isEditing) {
      onClose();
    }
  }, [open, isOwner, isEditing, onClose]);

  /**
   * Handle successful form submission
   */
  const handleSuccess = useCallback(
    (result, action) => {
      // Close dialog on success
      onClose();

      // Call parent success handler
      if (onSuccess) {
        onSuccess(result, action);
      }
    },
    [onClose, onSuccess]
  );

  /**
   * Handle form cancellation
   */
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * Get entity type display name
   */
  const getEntityTypeDisplayName = useCallback((type) => {
    const typeMap = {
      ARTIST: 'Artist',
      ART_PIECE: 'Art Piece',
      IMAGE: 'Image',
      PATH: 'Path',
      PATH_MAP: 'Path Map',
    };
    return typeMap[type] || type;
  }, []);

  return (
    <ReviewErrorBoundary
      name="ReviewFormDialog"
      context="review_form_dialog"
      variant="inline"
      title="Dialog Error"
      description="Unable to open the review form dialog."
    >
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={isMobile ? false : maxWidth}
        fullWidth={fullWidth}
        fullScreen={isMobile}
        TransitionComponent={isMobile ? SlideTransition : undefined}
        scroll="paper"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: isMobile ? '100vh' : '90vh',
            m: isMobile ? 0 : 2,
          },
        }}
        {...other}
      >
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            p: { xs: 2, sm: 3 },
            pb: { xs: 1, sm: 2 },
            pr: { xs: 6, sm: 8 }, // Leave space for close button
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {dialogTitle}
            </Typography>

            {entityName && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                {getEntityTypeDisplayName(entityType)}: {entityName}
              </Typography>
            )}
          </Box>

          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: { xs: 8, sm: 16 },
              color: 'grey.500',
            }}
            size={isMobile ? 'medium' : 'small'}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent
          sx={{
            p: 0,
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
            },
          }}
        >
          <ReviewsForm
            entityType={entityType}
            entityId={entityId}
            entityName={entityName}
            currentReview={currentReview}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            compact={isTablet}
            showEntityInfo={false} // Don't show entity info since it's in the title
            sx={{
              boxShadow: 'none',
              border: 'none',
              borderRadius: 0,
              '& .MuiCard-root': {
                boxShadow: 'none',
                border: 'none',
              },
            }}
          />
        </DialogContent>
      </Dialog>
    </ReviewErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewFormDialog
 * @prop {boolean} open - Whether the dialog is open. Required.
 * @prop {Function} onClose - Callback when dialog should close. Required.
 * @prop {string} entityType - Type of entity being reviewed. Required.
 * @prop {string|number} entityId - ID of the entity being reviewed. Required.
 * @prop {string} [entityName] - Name of the entity for display. Optional.
 * @prop {Object} [currentReview] - Existing review data for editing. Optional.
 * @prop {string} [title] - Custom dialog title. Optional.
 * @prop {string} [maxWidth='sm'] - Maximum width of the dialog. Optional.
 * @prop {boolean} [fullWidth=true] - Whether dialog should take full width. Optional.
 * @prop {Function} [onSuccess] - Callback when form submission succeeds. Optional.
 */
ReviewFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  entityType: PropTypes.oneOf(['ARTIST', 'ART_PIECE', 'IMAGE', 'PATH', 'PATH_MAP']).isRequired,
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  entityName: PropTypes.string,
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentReview: PropTypes.shape({
    reviewId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rating: PropTypes.number,
    comment: PropTypes.string,
    status: PropTypes.string,
  }),
  title: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  onSuccess: PropTypes.func,
};

export default ReviewFormDialog;
