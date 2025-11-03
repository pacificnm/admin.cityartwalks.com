/**
 * @namespace CityArtWalks.Components.Path.Reviews
 * @version 1.0.0
 * @author jaimie garner
 * @description Path reviews section component with review display and submission
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
 * @memberof CityArtWalks.Components.Path.Reviews
 * @function PathReviews
 * @description Displays reviews for a path with statistics, list, and submission form
 *
 * @param {Object} props - Component props
 * @param {number} props.pathId - ID of the path
 * @param {string} props.name - Name of the path
 * @param {string} [props.description] - Path description or details
 * @param {number} [props.distance] - Path distance in miles
 * @param {number} props.createdBy - User ID who created the path
 * @param {Object} [props.sx] - Custom styles
 * @returns {JSX.Element} Rendered reviews section
 *
 * @example
 * <PathReviews
 *   pathId={123}
 *   name="Downtown Art Walk"
 *   distance={2.5}
 *   createdBy={456}
 * />
 */
export function PathReviews({ pathId, name, description, distance, createdBy, sx }) {
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
    pathId,
    token: accessToken,
  });

  // Flag review hook
  const flagReview = useFlagReview(accessToken);

  // Delete review hook
  const { mutateAsync: deleteReview } = useDeleteReview(accessToken);

  // Check if user owns this path
  const isOwner = user?.userId === createdBy;

  const handleOpenReviewForm = useCallback(() => {
    debugLog('PathReviews.handleOpenReviewForm', 'Opening review form dialog');
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
    debugLog('PathReviews.handleCloseReviewForm', 'Closing review form dialog');
    setReviewFormOpen(false);
  }, []);

  const handleReviewSubmitted = useCallback(() => {
    debugLog('PathReviews.handleReviewSubmitted', 'Review submitted, refreshing data');
    // Refresh reviews
    mutateReviews();
    handleCloseReviewForm();
  }, [mutateReviews, handleCloseReviewForm]);

  const handlePageChange = useCallback((_, newPage) => {
    debugLog('PathReviews.handlePageChange', 'Changing page', { newPage });
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    debugLog('PathReviews.handleRowsPerPageChange', 'Changing rows per page', {
      newRowsPerPage,
    });
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  const handleEditReview = useCallback((review) => {
    debugLog('PathReviews.handleEditReview', 'Opening edit dialog for review', {
      reviewId: review.reviewId,
    });
    setSelectedReview(review);
    setEditDialogOpen(true);
  }, []);

  const handleDeleteReview = useCallback((review) => {
    debugLog('PathReviews.handleDeleteReview', 'Opening delete confirmation for review', {
      reviewId: review.reviewId,
    });
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  }, []);

  const handleReviewFlagged = useCallback(
    (review) => {
      debugLog('PathReviews.handleReviewFlagged', 'Opening flag dialog for review', {
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
        debugLog('PathReviews.handleFlagSubmit', 'Flagging review', {
          reviewId: flagData.reviewId,
          reason: flagData.reason,
        });

        await flagReview(flagData.reviewId, {
          reason: flagData.reason,
          details: flagData.details,
          entityType: 'PATH',
          entityId: pathId,
          entityName: name,
        });

        // Refresh reviews list after flagging
        mutateReviews();

        debugLog('PathReviews.handleFlagSubmit', 'Review flagged successfully');
      } catch (error) {
        debugError('PathReviews.handleFlagSubmit', 'Failed to flag review', error);
        throw error; // Re-throw to let dialog handle the error
      } finally {
        setFlagLoading(false);
      }
    },
    [flagReview, pathId, name, mutateReviews]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedReview) return;

    try {
      debugLog('PathReviews.handleConfirmDelete', 'Deleting review', {
        reviewId: selectedReview.reviewId,
      });

      await deleteReview(selectedReview.reviewId);

      // Refresh reviews list after deletion
      mutateReviews();

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setSelectedReview(null);

      debugLog('PathReviews.handleConfirmDelete', 'Review deleted successfully');
    } catch (error) {
      debugError('PathReviews.handleConfirmDelete', 'Failed to delete review', error);
      // Keep dialog open so user can see error/try again
    }
  }, [selectedReview, deleteReview, mutateReviews]);

  const handleCloseFlagDialog = useCallback(() => {
    setFlagDialogOpen(false);
    setSelectedReview(null);
  }, []);

  if (reviewsError) {
    debugError('PathReviews.error', 'Error loading reviews', { reviewsError });
    return (
      <Card sx={sx}>
        <CardContent>
          <Alert severity="error">Error loading reviews. Please try again later.</Alert>
        </CardContent>
      </Card>
    );
  }

  const totalCount = paginationMeta?.total || 0;

  // Build context info for the path
  const contextInfo = distance
    ? `${distance} mile${distance !== 1 ? 's' : ''} art walk`
    : 'Art walk path';

  return (
    <ErrorBoundary>
      <Stack spacing={3} sx={sx}>
        {/* Review Summary Card */}
        <ReviewSummaryCard
          entityType="PATH"
          entityId={pathId}
          entityName={name}
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
            entityType="PATH"
            entityId={pathId}
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
          protecting="PathReviews"
        >
          <ReviewFormDialog
            open={reviewFormOpen}
            onClose={handleCloseReviewForm}
            onSuccess={handleReviewSubmitted}
            entityType="PATH"
            entityId={pathId}
            entityName={name}
            ownerId={createdBy}
            contextInfo={contextInfo}
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
          entityType="PATH"
          entityId={pathId}
          entityName={name}
          ownerId={createdBy}
          contextInfo={contextInfo}
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
          entityName={name}
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

PathReviews.propTypes = {
  pathId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  distance: PropTypes.number,
  createdBy: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
