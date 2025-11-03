/**
 * @namespace CityArtWalks.Components.ArtPiece.Reviews
 * @version 1.0.0
 * @author jaimie garner
 * @description Art piece reviews section component with review display and submission
 */

'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import { Card, Stack, Alert, CardContent } from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';
import { useFlagReview, useDeleteReview, useGetPaginatedReviews } from 'src/actions/review/hooks';

import { ProductUpgradeDialog } from 'src/components/product';
import { ReviewList } from 'src/components/review/review-list';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ReviewFormDialog } from 'src/components/review/review-form-dialog';
import { ReviewFlagDialog } from 'src/components/review/review-flag-dialog';
import { ReviewSummaryCard } from 'src/components/review/review-summary-card';
import { ReviewDeleteDialog } from 'src/components/review/review-delete-dialog';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * @memberof CityArtWalks.Components.ArtPiece.Reviews
 * @function ArtPieceReviews
 * @description Displays reviews for an art piece with statistics, list, and submission form
 *
 * @param {Object} props - Component props
 * @param {number} props.artPieceId - ID of the art piece
 * @param {string} props.title - Title of the art piece
 * @param {string} props.artistName - Name of the artist
 * @param {number} props.createdBy - User ID who created the art piece
 * @param {Object} [props.sx] - Custom styles
 * @returns {JSX.Element} Rendered reviews section
 *
 * @example
 * <ArtPieceReviews
 *   artPieceId={123}
 *   title="Starry Night"
 *   artistName="Vincent van Gogh"
 *   createdBy={456}
 * />
 */
export function ArtPieceReviews({ artPieceId, title, artistName, createdBy, sx }) {
  const { user, accessToken } = useAuthContext();
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [flagLoading, setFlagLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch paginated reviews
  const {
    reviews,
    reviewsLoading,
    reviewsError,
    paginationMeta,
    mutate: mutateReviews,
  } = useGetPaginatedReviews({
    page: page + 1, // Convert 0-based to 1-based
    rowsPerPage,
    status: 'ACTIVE',
    artPieceId,
    token: accessToken,
  });

  // Flag review hook
  const flagReview = useFlagReview(accessToken);

  // Delete review hook
  const { mutateAsync: deleteReview } = useDeleteReview(accessToken);

  // Check if user owns this art piece
  const isOwner = user?.userId === createdBy;

  const handleOpenReviewForm = useCallback(() => {
    debugLog('ArtPieceReviews.handleOpenReviewForm', 'Opening review form dialog');
    setReviewFormOpen(true);
  }, []);

  const handleWriteReviewClick = useCallback(() => {
    // Check if user has permission to write reviews
    const hasPermission = user && ['MEMBER', 'ADMIN'].includes(user.role);

    if (hasPermission) {
      handleOpenReviewForm();
    } else {
      setUpgradeDialogOpen(true);
    }
  }, [user, handleOpenReviewForm]);

  const handleCloseReviewForm = useCallback(() => {
    debugLog('ArtPieceReviews.handleCloseReviewForm', 'Closing review form dialog');
    setReviewFormOpen(false);
  }, []);

  const handleReviewSubmitted = useCallback(() => {
    debugLog('ArtPieceReviews.handleReviewSubmitted', 'Review submitted, refreshing data');
    // Refresh reviews
    mutateReviews();
    handleCloseReviewForm();
  }, [mutateReviews, handleCloseReviewForm]);

  const handlePageChange = useCallback((_, newPage) => {
    debugLog('ArtPieceReviews.handlePageChange', 'Changing page', { newPage });
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    debugLog('ArtPieceReviews.handleRowsPerPageChange', 'Changing rows per page', {
      newRowsPerPage,
    });
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  const handleEditReview = useCallback((review) => {
    debugLog('ArtPieceReviews.handleEditReview', 'Opening edit dialog for review', {
      reviewId: review.reviewId,
    });
    setSelectedReview(review);
    setEditDialogOpen(true);
  }, []);

  const handleDeleteReview = useCallback((review) => {
    debugLog('ArtPieceReviews.handleDeleteReview', 'Opening delete confirmation for review', {
      reviewId: review.reviewId,
    });
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  }, []);

  const handleReviewFlagged = useCallback(
    (review) => {
      debugLog('ArtPieceReviews.handleReviewFlagged', 'Opening flag dialog for review', {
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
        debugLog('ArtPieceReviews.handleFlagSubmit', 'Flagging review', {
          reviewId: flagData.reviewId,
          reason: flagData.reason,
        });

        await flagReview(flagData.reviewId, {
          reason: flagData.reason,
          details: flagData.details,
          entityType: 'ART_PIECE',
          entityId: artPieceId,
          entityName: title,
        });

        // Refresh reviews list after flagging
        mutateReviews();

        debugLog('ArtPieceReviews.handleFlagSubmit', 'Review flagged successfully');
      } catch (error) {
        debugError('ArtPieceReviews.handleFlagSubmit', 'Failed to flag review', error);
        throw error; // Re-throw to let dialog handle the error
      } finally {
        setFlagLoading(false);
      }
    },
    [flagReview, artPieceId, title, mutateReviews]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedReview) return;

    try {
      debugLog('ArtPieceReviews.handleConfirmDelete', 'Deleting review', {
        reviewId: selectedReview.reviewId,
      });

      await deleteReview(selectedReview.reviewId);

      // Refresh reviews list after deletion
      mutateReviews();

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setSelectedReview(null);

      debugLog('ArtPieceReviews.handleConfirmDelete', 'Review deleted successfully');
    } catch (error) {
      debugError('ArtPieceReviews.handleConfirmDelete', 'Failed to delete review', error);
      // Keep dialog open so user can see error/try again
    }
  }, [selectedReview, deleteReview, mutateReviews]);

  const handleCloseFlagDialog = useCallback(() => {
    setFlagDialogOpen(false);
    setSelectedReview(null);
  }, []);

  if (reviewsError) {
    debugError('ArtPieceReviews.error', 'Error loading reviews', { reviewsError });
    return (
      <Card sx={sx}>
        <CardContent>
          <Alert severity="error">Error loading reviews. Please try again later.</Alert>
        </CardContent>
      </Card>
    );
  }

  const totalCount = paginationMeta?.total || 0;

  return (
    <ErrorBoundary>
      <Stack spacing={3} sx={sx}>
        {/* Review Summary Card */}
        <ReviewSummaryCard
          entityType="ART_PIECE"
          entityId={artPieceId}
          entityName={title}
          onCreateReview={handleWriteReviewClick}
          showCreateButton={!isOwner}
          showViewAllButton={false}
        />

        {/* Reviews List */}
        {totalCount > 0 && (
          <ReviewList
            reviews={reviews}
            loading={reviewsLoading}
            totalCount={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            entityType="ART_PIECE"
            entityId={artPieceId}
            ownerId={createdBy}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            onReviewFlagged={handleReviewFlagged}
            showEntityInfo={false}
          />
        )}

        {/* Review Form Dialog - Only render for MEMBER/ADMIN */}
        <RoleBasedGuard
          allowedRoles={['USER', 'MEMBER', 'ADMIN']}
          displayMode="hidden"
          protecting="ArtPieceReviews"
        >
          <ReviewFormDialog
            open={reviewFormOpen}
            onClose={handleCloseReviewForm}
            onSuccess={handleReviewSubmitted}
            entityType="ART_PIECE"
            entityId={artPieceId}
            entityName={title}
            ownerId={createdBy}
            contextInfo={`Art piece by ${artistName}`}
          />
        </RoleBasedGuard>

        {/* Edit Review Dialog */}
        <ReviewFormDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedReview(null);
          }}
          onSuccess={() => {
            setEditDialogOpen(false);
            setSelectedReview(null);
            mutateReviews();
          }}
          entityType="ART_PIECE"
          entityId={artPieceId}
          entityName={title}
          ownerId={createdBy}
          contextInfo={`Art piece by ${artistName}`}
          currentReview={selectedReview}
          mode="edit"
        />

        {/* Delete Review Confirmation Dialog */}
        <ReviewDeleteDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedReview(null);
          }}
          onConfirm={handleConfirmDelete}
          review={selectedReview}
          entityName={title}
        />

        {/* Flag Review Dialog */}
        <ReviewFlagDialog
          open={flagDialogOpen}
          onClose={handleCloseFlagDialog}
          onSubmit={handleFlagSubmit}
          review={selectedReview}
          entityName={title}
          loading={flagLoading}
        />

        {/* Upgrade Dialog */}
        <ProductUpgradeDialog
          open={upgradeDialogOpen}
          onClose={() => setUpgradeDialogOpen(false)}
          showUpgradeButton={false}
        />
      </Stack>
    </ErrorBoundary>
  );
}

ArtPieceReviews.propTypes = {
  artPieceId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  createdBy: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
