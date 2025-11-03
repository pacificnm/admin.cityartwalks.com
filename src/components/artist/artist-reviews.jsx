/**
 * @namespace CityArtWalks.Components.Artist.Reviews
 * @version 1.0.0
 * @author jaimie garner
 * @description Artist reviews section component with review display and submission
 */

'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Button,
  Divider,
  Skeleton,
  Typography,
  CardHeader,
  CardContent,
} from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';
import { useFlagReview, useGetReviewStats, useGetPaginatedReviews } from 'src/actions/review/hooks';

import { Iconify } from 'src/components/iconify';
import { ReviewList } from 'src/components/review/review-list';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ReviewFormDialog } from 'src/components/review/review-form-dialog';
import { ReviewFlagDialog } from 'src/components/review/review-flag-dialog';
import { ReviewSummaryCard } from 'src/components/review/review-summary-card';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.Artist.Reviews
 * @function ArtistReviews
 * @description Displays reviews for an artist with statistics, list, and submission form
 *
 * @param {Object} props - Component props
 * @param {number} props.artistId - ID of the artist
 * @param {string} props.name - Name of the artist
 * @param {string} [props.specialty] - Artist's specialty or style
 * @param {number} props.createdBy - User ID who created the artist profile
 * @param {Object} [props.sx] - Custom styles
 * @returns {JSX.Element} Rendered reviews section
 *
 * @example
 * <ArtistReviews
 *   artistId={123}
 *   name="Vincent van Gogh"
 *   specialty="Post-Impressionism"
 *   createdBy={456}
 * />
 */
export function ArtistReviews({ artistId, name, specialty, createdBy, sx }) {
  const { user } = useAuthContext();
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [flagLoading, setFlagLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch review statistics
  const {
    data: reviewStats,
    error: statsError,
    isLoading: statsLoading,
    mutate: mutateStats,
  } = useGetReviewStats('ARTIST', artistId);

  // Fetch paginated reviews
  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: reviewsLoading,
    mutate: mutateReviews,
  } = useGetPaginatedReviews({
    entityType: 'ARTIST',
    entityId: artistId,
    status: 'ACTIVE',
    skip: page * rowsPerPage,
    take: rowsPerPage,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Flag review hook
  const flagReview = useFlagReview();

  // Check if user owns this artist profile
  const isOwner = user?.userId === createdBy;

  const handleOpenReviewForm = useCallback(() => {
    debugLog('ArtistReviews.handleOpenReviewForm', 'Opening review form dialog');
    setReviewFormOpen(true);
  }, []);

  const handleCloseReviewForm = useCallback(() => {
    debugLog('ArtistReviews.handleCloseReviewForm', 'Closing review form dialog');
    setReviewFormOpen(false);
  }, []);

  const handleReviewSubmitted = useCallback(() => {
    debugLog('ArtistReviews.handleReviewSubmitted', 'Review submitted, refreshing data');
    // Refresh both stats and reviews
    mutateStats();
    mutateReviews();
    handleCloseReviewForm();
  }, [mutateStats, mutateReviews, handleCloseReviewForm]);

  const handlePageChange = useCallback((event, newPage) => {
    debugLog('ArtistReviews.handlePageChange', 'Changing page', { newPage });
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    debugLog('ArtistReviews.handleRowsPerPageChange', 'Changing rows per page', {
      newRowsPerPage,
    });
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  const handleReviewFlagged = useCallback(
    (review) => {
      debugLog('ArtistReviews.handleReviewFlagged', 'Opening flag dialog for review', {
        reviewId: review.reviewId,
      });

      // Only allow content owners to flag reviews (ownership validation)
      if (isOwner) {
        setSelectedReview(review);
        setFlagDialogOpen(true);
      }
    },
    [isOwner]
  );

  const handleFlagSubmit = useCallback(
    async (flagData) => {
      try {
        setFlagLoading(true);
        debugLog('ArtistReviews.handleFlagSubmit', 'Flagging review', {
          reviewId: flagData.reviewId,
          reason: flagData.reason,
        });

        await flagReview(flagData.reviewId, {
          reason: flagData.reason,
          details: flagData.details,
          entityType: 'ARTIST',
          entityId: artistId,
          entityName: name,
        });

        // Refresh reviews list after flagging
        mutateReviews();

        debugLog('ArtistReviews.handleFlagSubmit', 'Review flagged successfully');
      } catch (error) {
        debugError('ArtistReviews.handleFlagSubmit', 'Failed to flag review', error);
        throw error; // Re-throw to let dialog handle the error
      } finally {
        setFlagLoading(false);
      }
    },
    [flagReview, artistId, name, mutateReviews]
  );

  const handleCloseFlagDialog = useCallback(() => {
    setFlagDialogOpen(false);
    setSelectedReview(null);
  }, []);

  if (statsError || reviewsError) {
    debugError('ArtistReviews.error', 'Error loading reviews', { statsError, reviewsError });
    return (
      <Card sx={sx}>
        <CardContent>
          <Alert severity="error">Error loading reviews. Please try again later.</Alert>
        </CardContent>
      </Card>
    );
  }

  const totalReviews = reviewStats?.totalReviews || 0;
  const averageRating = reviewStats?.averageRating || 0;
  const reviews = reviewsData?.reviews || [];
  const totalCount = reviewsData?.total || 0;

  return (
    <ErrorBoundary>
      <Stack spacing={3} sx={sx}>
        {/* Reviews Header */}
        <Card>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h5">Artist Reviews</Typography>
                {totalReviews > 0 && (
                  <Chip
                    label={`${totalReviews} ${totalReviews === 1 ? 'Review' : 'Reviews'}`}
                    size="small"
                    color="primary"
                    variant="soft"
                  />
                )}
              </Stack>
            }
            action={
              <Stack direction="row" spacing={2} alignItems="center">
                {isOwner && (
                  <Alert severity="success" sx={{ py: 0.5, px: 2 }}>
                    <Typography variant="caption">You own this content</Typography>
                  </Alert>
                )}
                {!isOwner && (
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="solar:pen-new-square-bold" />}
                    onClick={handleOpenReviewForm}
                    data-cy="write-review-button"
                  >
                    Write a Review
                  </Button>
                )}
              </Stack>
            }
          />
          <Divider />

          {/* Review Statistics */}
          {statsLoading ? (
            <CardContent>
              <Stack spacing={2}>
                <Skeleton variant="rectangular" height={120} />
                <Skeleton variant="rectangular" height={60} />
              </Stack>
            </CardContent>
          ) : totalReviews > 0 ? (
            <CardContent>
              <ReviewSummaryCard
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingDistribution={reviewStats?.ratingDistribution}
                showBreakdown
              />
            </CardContent>
          ) : (
            <CardContent>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  bgcolor: 'background.neutral',
                  borderRadius: 2,
                }}
              >
                <Iconify
                  icon="solar:chat-round-dots-bold-duotone"
                  width={64}
                  sx={{ color: 'text.disabled', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No Reviews Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Be the first to share your thoughts about {name}
                </Typography>
                {!isOwner && (
                  <Button
                    variant="soft"
                    color="primary"
                    startIcon={<Iconify icon="solar:pen-new-square-bold" />}
                    onClick={handleOpenReviewForm}
                  >
                    Write the First Review
                  </Button>
                )}
              </Box>
            </CardContent>
          )}
        </Card>

        {/* Reviews List */}
        {totalReviews > 0 && (
          <Card>
            <CardContent>
              <ReviewList
                reviews={reviews}
                loading={reviewsLoading}
                totalCount={totalCount}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                entityType="ARTIST"
                entityId={artistId}
                ownerId={createdBy}
                onReviewFlagged={handleReviewFlagged}
                showEntityInfo={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Review Form Dialog */}
        <ReviewFormDialog
          open={reviewFormOpen}
          onClose={handleCloseReviewForm}
          onSuccess={handleReviewSubmitted}
          entityType="ARTIST"
          entityId={artistId}
          entityName={name}
          ownerId={createdBy}
          contextInfo={specialty ? `Specializing in ${specialty}` : 'Artist'}
        />

        {/* Flag Review Dialog */}
        <ReviewFlagDialog
          open={flagDialogOpen}
          onClose={handleCloseFlagDialog}
          onSubmit={handleFlagSubmit}
          review={selectedReview}
          entityName={name}
          loading={flagLoading}
        />
      </Stack>
    </ErrorBoundary>
  );
}

ArtistReviews.propTypes = {
  artistId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  specialty: PropTypes.string,
  createdBy: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
