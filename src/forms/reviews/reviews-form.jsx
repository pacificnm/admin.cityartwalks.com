/**
import { StarOutlineIcon } from 'src/components/icons';
 * @namespace CityArtWalks.Forms.Reviews
 * @version 1.0.0
 * @author Jaimie Garner
 * @description User-facing review form component with validation, responsive design, and Actions integration
 */

'use client';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';

import { debugLog, debugError } from 'src/lib/debug';
import { useCreateReview, useUpdateReview } from 'src/actions/review/hooks';
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewDefaultValues,
} from 'src/validators/review';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { ReviewRatingInput } from 'src/components/review/review-rating-input';
import ReviewErrorBoundary from 'src/components/review/review-error-boundary';
import {
  ViewIcon,
  EditIcon,
  SendIcon,
  ChatIcon,
  SaveIcon,
  ClockIcon,
  EyeOffIcon,
} from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * @memberof CityArtWalks.Forms.Reviews
 * @function ReviewsForm
 * @description Comprehensive review form component for creating and editing reviews.
 * Features responsive design, validation, error handling, and Actions integration.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.entityType - Type of entity being reviewed (ARTIST, ART_PIECE, IMAGE, PATH, PATH_MAP).
 * @param {string|number} props.entityId - ID of the entity being reviewed.
 * @param {string} [props.entityName] - Name of the entity for display.
 * @param {Object} [props.currentReview] - Existing review data for editing.
 * @param {Function} [props.onSuccess] - Callback when form submission succeeds.
 * @param {Function} [props.onCancel] - Callback when form is cancelled.
 * @param {Function} [props.onError] - Callback when form submission fails.
 * @param {boolean} [props.compact=false] - Whether to use compact layout.
 * @param {boolean} [props.showEntityInfo=true] - Whether to show entity information.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The rendered ReviewsForm component.
 */
export function ReviewsForm({
  entityType,
  entityId,
  entityName,
  currentReview,
  onSuccess,
  onCancel,
  onError,
  compact = false,
  showEntityInfo = true,
  sx,
  ...other
}) {
  return (
    <RoleBasedGuard allowedRoles={['MEMBER', 'ADMIN']} protecting="ReviewsForm" displayMode="view">
      <ReviewFormContent
        entityType={entityType}
        entityId={entityId}
        entityName={entityName}
        currentReview={currentReview}
        onSuccess={onSuccess}
        onCancel={onCancel}
        onError={onError}
        compact={compact}
        showEntityInfo={showEntityInfo}
        sx={sx}
        {...other}
      />
    </RoleBasedGuard>
  );
}

/**
 * Internal form content component
 */
function ReviewFormContent({
  entityType,
  entityId,
  entityName,
  currentReview,
  onSuccess,
  onCancel,
  onError,
  compact = false,
  showEntityInfo = true,
  sx,
  ...other
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, accessToken } = useAuthContext();

  const [submitError, setSubmitError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Determine if we're editing or creating
  const isEditing = Boolean(currentReview);

  // Get the appropriate schema and default values
  const schema = isEditing ? updateReviewSchema : createReviewSchema;
  const defaultValues = useMemo(() => {
    if (currentReview) {
      return {
        rating: currentReview.rating || 5,
        comment: currentReview.comment || '',
        status: currentReview.status || 'ACTIVE',
      };
    }

    const defaults = getReviewDefaultValues();

    // Map entity type to correct field name
    const getEntityFieldName = (type) => {
      switch (type?.toUpperCase()) {
        case 'ARTIST':
          return 'artistId';
        case 'ART_PIECE':
          return 'artPieceId';
        case 'IMAGE':
          return 'imageId';
        case 'PATH':
          return 'pathId';
        case 'PATH_MAP':
          return 'pathMapId';
        default:
          return `${type?.toLowerCase()}Id`;
      }
    };

    const entityFieldName = getEntityFieldName(entityType);

    return {
      ...defaults,
      createdBy: user?.userId,
      [entityFieldName]: parseInt(entityId, 10),
    };
  }, [currentReview, user, entityType, entityId]);

  // Initialize form
  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  // Watch form values for preview
  const watchedValues = watch();

  // Mutation hooks with optimistic updates
  const { mutateAsync: createReview } = useCreateReview(accessToken);
  const { mutateAsync: updateReview } = useUpdateReview(accessToken);

  /**
   * Handle form submission with optimistic updates
   */
  const onSubmit = useCallback(
    async (data) => {
      debugLog('ReviewsForm.onSubmit', 'Submitting review form with optimistic updates', {
        data,
        isEditing,
      });

      try {
        setSubmitError(null);

        // Ensure rating is a number
        const submissionData = {
          ...data,
          rating: parseInt(data.rating, 10) || 0,
        };

        let result;
        if (isEditing) {
          result = await updateReview(
            {
              reviewId: currentReview.reviewId,
              ...submissionData,
            },
            {
              optimistic: true,
              rollbackOnError: true,
            }
          );
          toast.success('Review updated successfully!');
        } else {
          result = await createReview(submissionData, {
            optimistic: true,
            rollbackOnError: true,
          });
          toast.success('Review submitted successfully!');
        }

        debugLog(
          'ReviewsForm.onSubmit',
          'Review submission successful with optimistic update',
          result
        );

        // Reset form on successful creation
        if (!isEditing) {
          reset();
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(result, isEditing ? 'update' : 'create');
        }
      } catch (error) {
        debugError('ReviewsForm.onSubmit', 'Review submission failed', error);

        // Handle moderation rejection errors with detailed information
        if (
          error?.type === 'moderation_rejection' ||
          error?.details?.type === 'moderation_rejection'
        ) {
          const moderationDetails = error?.details?.moderation || error?.moderation;
          const suggestions = error?.suggestions || error?.details?.suggestions || [];

          let detailedMessage = 'Your review was not approved by our moderation system.';

          if (moderationDetails?.reason) {
            detailedMessage += `\n\n📋 Reason:\n${moderationDetails.reason}`;
          }

          if (suggestions && suggestions.length > 0) {
            detailedMessage += `\n\n💡 Suggestions to improve your review:\n${suggestions.map((s) => `• ${s}`).join('\n')}`;
            detailedMessage += `\n\nPlease revise your review and try submitting again.`;
          }

          setSubmitError(detailedMessage);
          toast.error(
            `Review not approved - ${moderationDetails?.reason || 'Please check the suggestions below'}`
          );
        } else {
          const errorMessage = error?.message || 'Failed to submit review. Please try again.';
          setSubmitError(errorMessage);
          toast.error(errorMessage);
        }

        // Call onError callback if provided
        if (onError) {
          onError(error);
        }
      }
    },
    [isEditing, currentReview, createReview, updateReview, reset, onSuccess, onError]
  );

  /**
   * Handle form cancellation
   */
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      reset();
      setSubmitError(null);
    }
  }, [onCancel, reset]);

  /**
   * Toggle preview mode
   */
  const handleTogglePreview = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

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
      name="ReviewsForm"
      context="submitting_review"
      variant="card"
      title="Review Form Error"
      description="Unable to load the review form. Please try refreshing the page."
    >
      <Card sx={{ p: { xs: 2, sm: 3 }, ...sx }} {...other}>
        <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            {/* Header */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                {isEditing ? 'Edit Review' : 'Write a Review'}
              </Typography>

              {showEntityInfo && entityName && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                >
                  Reviewing {getEntityTypeDisplayName(entityType)}: <strong>{entityName}</strong>
                </Typography>
              )}
            </Box>

            {/* Error Alert */}
            <Collapse in={Boolean(submitError)}>
              <Alert severity="error" onClose={() => setSubmitError(null)}>
                <Box sx={{ whiteSpace: 'pre-wrap' }}>{submitError}</Box>
              </Alert>
            </Collapse>

            {/* Rating Input */}
            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  color: errors.rating ? 'error.main' : 'text.primary',
                }}
              >
                Your Rating *
              </Typography>
              <ReviewRatingInput
                value={watchedValues.rating || 0}
                onChange={(newRating) =>
                  methods.setValue('rating', newRating, { shouldValidate: true })
                }
                size={isMobile ? 'large' : 'medium'}
                showLabel
                showValue={false}
                error={errors.rating?.message}
                helperText={
                  errors.rating ? errors.rating.message : 'Rate this on a scale of 1 to 5 stars'
                }
              />
              {errors.rating && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.5,
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  }}
                >
                  <Iconify icon="solar:info-circle-bold" sx={{ fontSize: '1rem' }} />
                  {errors.rating.message}
                </Typography>
              )}
            </Box>

            {/* Comment Input */}
            <Box>
              <TextField
                {...methods.register('comment')}
                label="Your Review"
                placeholder={`Share your thoughts about this ${getEntityTypeDisplayName(entityType).toLowerCase()}...`}
                multiline
                rows={isMobile ? 4 : 6}
                fullWidth
                required
                error={Boolean(errors.comment)}
                helperText={
                  errors.comment?.message ||
                  `Tell others about your experience with this ${getEntityTypeDisplayName(entityType).toLowerCase()}.`
                }
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                  '& .MuiFormHelperText-root': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: errors.comment ? (
                      <Iconify
                        icon="solar:info-circle-bold"
                        sx={{
                          color: 'error.main',
                          fontSize: '1.2rem',
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          zIndex: 1,
                        }}
                      />
                    ) : null,
                  },
                }}
              />

              {/* Enhanced Character Counter and Validation Status */}
              <Box sx={{ mt: 1 }}>
                {/* Progress Bar */}
                <Box sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      height: 4,
                      backgroundColor: 'grey.200',
                      borderRadius: 2,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        backgroundColor: (() => {
                          const length = watchedValues.comment?.length || 0;
                          if (errors.comment) return 'error.main';
                          if (length < 10) return 'warning.main';
                          if (length > 1800) return 'warning.main';
                          if (length >= 2000) return 'error.main';
                          return 'success.main';
                        })(),
                        width: `${Math.min(((watchedValues.comment?.length || 0) / 2000) * 100, 100)}%`,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>

                {/* Status and Counter Row */}
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {/* Status Indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {(() => {
                      const length = watchedValues.comment?.length || 0;
                      const trimmedLength = watchedValues.comment?.trim().length || 0;

                      if (errors.comment) {
                        return (
                          <>
                            <Iconify
                              icon="solar:info-circle-bold"
                              sx={{ color: 'error.main', fontSize: '1rem' }}
                            />
                            <Typography
                              variant="caption"
                              color="error.main"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              {errors.comment.message}
                            </Typography>
                          </>
                        );
                      }

                      if (length === 0) {
                        return (
                          <>
                            <EditIcon size={16} sx={{ color: 'text.secondary' }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              Start writing your review
                            </Typography>
                          </>
                        );
                      }

                      if (trimmedLength < 10) {
                        return (
                          <>
                            <ClockIcon sx={{ color: 'warning.main', fontSize: '1rem' }} />
                            <Typography
                              variant="caption"
                              color="warning.main"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              {10 - trimmedLength} more characters needed
                            </Typography>
                          </>
                        );
                      }

                      if (length > 1800) {
                        return (
                          <>
                            <Iconify
                              icon="solar:danger-triangle-bold"
                              sx={{ color: 'warning.main', fontSize: '1rem' }}
                            />
                            <Typography
                              variant="caption"
                              color="warning.main"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              Approaching character limit
                            </Typography>
                          </>
                        );
                      }

                      if (length >= 2000) {
                        return (
                          <>
                            <Iconify CloseIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
                            <Typography
                              variant="caption"
                              color="error.main"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              Character limit exceeded
                            </Typography>
                          </>
                        );
                      }

                      return (
                        <>
                          <Iconify
                            icon="solar:check-circle-bold"
                            sx={{ color: 'success.main', fontSize: '1rem' }}
                          />
                          <Typography
                            variant="caption"
                            color="success.main"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                          >
                            Great length
                          </Typography>
                        </>
                      );
                    })()}
                  </Box>

                  {/* Character Counter */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      color={(() => {
                        const length = watchedValues.comment?.length || 0;
                        if (length >= 2000) return 'error.main';
                        if (length > 1800) return 'warning.main';
                        if (errors.comment) return 'error.main';
                        return 'text.secondary';
                      })()}
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        fontWeight: 500,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {watchedValues.comment?.length || 0}/2000
                    </Typography>

                    {/* Word Count */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        ml: 1,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {watchedValues.comment
                        ? watchedValues.comment
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        : 0}{' '}
                      words
                    </Typography>
                  </Box>
                </Box>

                {/* Writing Tips */}
                {watchedValues.comment &&
                  watchedValues.comment.length > 0 &&
                  watchedValues.comment.length < 50 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          fontStyle: 'italic',
                        }}
                      >
                        💡 Tip: Share specific details about what you liked or didn&apos;t like
                      </Typography>
                    </Box>
                  )}
              </Box>
            </Box>

            {/* Preview Section */}
            {!compact && watchedValues.comment && (
              <Box>
                <Button
                  size="small"
                  onClick={handleTogglePreview}
                  startIcon={showPreview ? <EyeOffIcon /> : <ViewIcon />}
                  sx={{ mb: 1 }}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>

                <Collapse in={showPreview}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Preview
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ReviewRatingInput
                        value={watchedValues.rating || 0}
                        readOnly
                        size="small"
                        showLabel={false}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {user?.name || 'Anonymous'}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {watchedValues.comment}
                    </Typography>
                  </Card>
                </Collapse>
              </Box>
            )}

            <Divider />

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'flex-end',
              }}
            >
              {onCancel && (
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  size={isMobile ? 'large' : 'medium'}
                  fullWidth={isMobile}
                  sx={{ order: { xs: 2, sm: 1 } }}
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !isValid || Boolean(errors.rating || errors.comment)}
                size={isMobile ? 'large' : 'medium'}
                fullWidth={isMobile}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : isEditing ? (
                    <SaveIcon />
                  ) : (
                    <SendIcon />
                  )
                }
                sx={{
                  order: { xs: 1, sm: 2 },
                  minWidth: { xs: 'auto', sm: 140 },
                  ...((!isValid || Boolean(errors.rating || errors.comment)) && {
                    '&.Mui-disabled': {
                      bgcolor: 'grey.300',
                      color: 'grey.500',
                    },
                  }),
                }}
              >
                {isSubmitting
                  ? isEditing
                    ? 'Updating...'
                    : 'Submitting...'
                  : isEditing
                    ? 'Update Review'
                    : 'Submit Review'}
              </Button>
            </Box>

            {/* Form validation summary */}
            {(errors.rating || errors.comment) && (
              <Alert
                severity="error"
                sx={{ mt: 1 }}
                icon={<Iconify icon="solar:danger-triangle-bold" />}
              >
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                  Please fix the following errors to submit your review:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.5 } }}>
                  {errors.rating && (
                    <Typography
                      component="li"
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Iconify StarOutlineIcon sx={{ fontSize: '1rem', color: 'error.main' }} />
                      Rating: {errors.rating.message}
                    </Typography>
                  )}
                  {errors.comment && (
                    <Typography
                      component="li"
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <ChatIcon size={16} sx={{ color: 'error.main' }} />
                      Review: {errors.comment.message}
                    </Typography>
                  )}
                </Box>
              </Alert>
            )}

            {/* Success indicators */}
            {!errors.rating &&
              !errors.comment &&
              watchedValues.rating > 0 &&
              watchedValues.comment &&
              watchedValues.comment.length >= 10 && (
                <Alert
                  severity="success"
                  sx={{ mt: 1 }}
                  icon={<Iconify icon="solar:check-circle-bold" />}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Your review looks great! Ready to submit.
                  </Typography>
                </Alert>
              )}
          </Stack>
        </Form>
      </Card>
    </ReviewErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Forms.Reviews
 * @prop {string} entityType - Type of entity being reviewed (ARTIST, ART_PIECE, IMAGE, PATH, PATH_MAP). Required.
 * @prop {string|number} entityId - ID of the entity being reviewed. Required.
 * @prop {string} [entityName] - Name of the entity for display. Optional.
 * @prop {Object} [currentReview] - Existing review data for editing. Optional.
 * @prop {Function} [onSuccess] - Callback when form submission succeeds. Optional.
 * @prop {Function} [onCancel] - Callback when form is cancelled. Optional.
 * @prop {Function} [onError] - Callback when form submission fails. Optional.
 * @prop {boolean} [compact=false] - Whether to use compact layout. Optional.
 * @prop {boolean} [showEntityInfo=true] - Whether to show entity information. Optional.
 * @prop {Object} [sx] - Additional styling props. Optional.
 */
ReviewsForm.propTypes = {
  entityType: PropTypes.oneOf(['ARTIST', 'ART_PIECE', 'IMAGE', 'PATH', 'PATH_MAP']).isRequired,
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  entityName: PropTypes.string,
  currentReview: PropTypes.shape({
    reviewId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rating: PropTypes.number,
    comment: PropTypes.string,
    status: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  onError: PropTypes.func,
  compact: PropTypes.bool,
  showEntityInfo: PropTypes.bool,
  sx: PropTypes.object,
};

export default ReviewsForm;
