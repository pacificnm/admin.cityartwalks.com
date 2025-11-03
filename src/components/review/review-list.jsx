/**
 * @namespace CityArtWalks.Components.Review.ReviewList
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useGetPaginatedReviews } from 'src/actions/review';

import { Iconify } from 'src/components/iconify';
import { RefreshIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

import { ReviewItem } from './review-item';
import { ReviewListSkeleton } from './review-skeletons';
import ReviewErrorBoundary from './review-error-boundary';

/**
 * @memberof CityArtWalks.Components.Review.ReviewList
 * @function ReviewList
 * @description Displays a paginated list of reviews with filtering capabilities.
 * Integrates with the review actions layer for data fetching and mutations.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} [props.filters={}] - Filters to apply to the review list.
 * @param {number} [props.pageSize=10] - Number of reviews per page.
 * @param {boolean} [props.showActions=true] - Whether to show action buttons on reviews.
 * @param {boolean} [props.showStatus=false] - Whether to show review status.
 * @param {boolean} [props.compact=false] - Whether to use compact layout.
 * @param {Function} [props.onEdit] - Callback when edit review is clicked.
 * @param {Function} [props.onDelete] - Callback when delete review is clicked.
 * @param {Function} [props.onFlag] - Callback when flag review is clicked.
 * @param {Function} [props.onModerate] - Callback when moderate review is clicked.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The rendered ReviewList component.
 */
export function ReviewList({
  // Direct data props (used by entity review sections)
  reviews: reviewsProp,
  loading: loadingProp,
  totalCount,
  page: pageProp,
  rowsPerPage: rowsPerPageProp,
  onPageChange: onPageChangeProp,
  onRowsPerPageChange: onRowsPerPageChangeProp,
  entityType,
  entityId,
  ownerId,
  onReviewFlagged,
  showEntityInfo,
  // Traditional filtering props (used by standalone ReviewList)
  filters = {},
  pageSize = 10,
  showActions = true,
  showStatus = false,
  compact = false,
  onEdit,
  onDelete,
  onFlag,
  onModerate,
  sx,
  ...other
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuthContext();
  const [page, setPage] = useState(1);

  // Check if we're using direct props (entity review sections) or need to fetch data
  const useDirectProps = reviewsProp !== undefined;

  // Fetch reviews using the actions layer (only if not using direct props)
  const {
    reviews: fetchedReviews,
    reviewsLoading: fetchedLoading,
    reviewsError: fetchedError,
    paginationMeta: fetchedMeta,
    mutate,
  } = useGetPaginatedReviews(
    useDirectProps
      ? { skip: true } // Skip fetching when using direct props
      : {
          page,
          rowsPerPage: pageSize,
          ...filters,
          token: user?.token,
        }
  );

  // Use direct props or fetched data
  const reviews = useDirectProps ? reviewsProp : fetchedReviews;
  const reviewsLoading = useDirectProps ? loadingProp : fetchedLoading;
  const reviewsError = useDirectProps ? false : fetchedError; // Entity sections handle errors separately
  const paginationMeta = useDirectProps
    ? {
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / (rowsPerPageProp || 10)),
      }
    : fetchedMeta;

  // Handle page change
  const handlePageChange = useCallback(
    (event, newPage) => {
      if (useDirectProps && onPageChangeProp) {
        onPageChangeProp(event, newPage);
      } else {
        setPage(newPage);
      }
    },
    [useDirectProps, onPageChangeProp]
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  // Mutation handlers with optimistic updates
  const handleEdit = useCallback(
    (review) => {
      if (onEdit) {
        onEdit(review);
      }
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    async (review) => {
      if (onDelete) {
        await onDelete(review);
        // Refresh the list after deletion
        mutate();
      }
    },
    [onDelete, mutate]
  );

  const handleFlag = useCallback(
    async (review) => {
      if (useDirectProps && onReviewFlagged) {
        onReviewFlagged(review);
      } else if (onFlag) {
        await onFlag(review);
        // Refresh the list after flagging
        mutate();
      }
    },
    [useDirectProps, onReviewFlagged, onFlag, mutate]
  );

  const handleModerate = useCallback(
    async (review, action) => {
      if (onModerate) {
        await onModerate(review, action);
        // Refresh the list after moderation
        mutate();
      }
    },
    [onModerate, mutate]
  );

  // Loading skeleton - use the centralized skeleton component
  const renderSkeleton = <ReviewListSkeleton itemCount={pageSize} />;

  // Error state
  if (reviewsError) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 0 },
          ...sx,
        }}
        {...other}
      >
        <Iconify
          icon="solar:info-circle-bold"
          sx={{
            fontSize: { xs: 48, sm: 64 },
            color: 'error.main',
            mb: 2,
            display: 'block',
            mx: 'auto',
          }}
        />
        <Typography
          variant={isMobile ? 'h6' : 'h6'}
          color="error.main"
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Failed to Load Reviews
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            fontSize: { xs: '0.875rem', sm: '0.875rem' },
            px: { xs: 1, sm: 0 },
          }}
        >
          There was an error loading the reviews. Please try again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          size={isMobile ? 'large' : 'medium'}
          fullWidth={isMobile}
          sx={{ maxWidth: { xs: '100%', sm: 200 } }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // Loading state
  if (reviewsLoading) {
    return (
      <Box sx={{ ...sx }} {...other}>
        {renderSkeleton}
      </Box>
    );
  }

  // Empty state
  if (!reviews || reviews.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 0 },
          ...sx,
        }}
        {...other}
      >
        <Iconify
          StarOutlineIcon
          sx={{
            fontSize: { xs: 48, sm: 64 },
            color: 'text.disabled',
            mb: 2,
            display: 'block',
            mx: 'auto',
          }}
        />
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          No Reviews Found
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', sm: '0.875rem' },
            px: { xs: 1, sm: 0 },
          }}
        >
          {Object.keys(filters).length > 0
            ? 'Try adjusting your filters to see more reviews.'
            : 'No reviews have been posted yet.'}
        </Typography>
      </Box>
    );
  }

  return (
    <ReviewErrorBoundary
      name="ReviewList"
      context="displaying_review_list"
      variant="inline"
      title="Review List Error"
      description="Unable to display the list of reviews. Please try refreshing the page."
      onRetry={handleRefresh}
    >
      <Box
        sx={{
          px: { xs: 1, sm: 0 },
          ...sx,
        }}
        {...other}
      >
        {/* Review List */}
        <Stack spacing={compact || isMobile ? 1 : 2}>
          {reviews.map((review, index) => (
            <ReviewItem
              key={review.reviewId || review.id || `review-${index}`}
              review={review}
              ownerId={ownerId}
              showActions={showActions}
              showStatus={showStatus}
              compact={compact || isMobile}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onFlag={handleFlag}
              onModerate={handleModerate}
            />
          ))}
        </Stack>

        {/* Pagination */}
        {paginationMeta && paginationMeta.totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: { xs: 3, sm: 4 },
              px: { xs: 1, sm: 0 },
            }}
          >
            <Pagination
              count={paginationMeta.totalPages}
              page={useDirectProps ? (pageProp || 0) + 1 : page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? 'medium' : 'large'}
              showFirstButton={!isMobile}
              showLastButton={!isMobile}
              siblingCount={isMobile ? 0 : 1}
              boundaryCount={isMobile ? 1 : 1}
              sx={{
                '& .MuiPagination-ul': {
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                },
                '& .MuiPaginationItem-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  minWidth: { xs: '32px', sm: '40px' },
                  height: { xs: '32px', sm: '40px' },
                },
              }}
            />
          </Box>
        )}

        {/* Results Summary */}
        {paginationMeta && (
          <Box
            sx={{
              mt: 2,
              textAlign: 'center',
              px: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.75rem' },
                display: 'block',
              }}
            >
              Showing {reviews.length} of {paginationMeta.total} review
              {paginationMeta.total !== 1 ? 's' : ''}
              {paginationMeta.totalPages > 1 && !isMobile && (
                <>
                  {' '}
                  (Page {useDirectProps ? (pageProp || 0) + 1 : page} of {paginationMeta.totalPages}
                  )
                </>
              )}
            </Typography>
            {paginationMeta.totalPages > 1 && isMobile && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: '0.7rem',
                  display: 'block',
                  mt: 0.5,
                }}
              >
                Page {useDirectProps ? (pageProp || 0) + 1 : page} of {paginationMeta.totalPages}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </ReviewErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewList
 * @prop {Object} [filters={}] - Filters to apply to the review list. Optional.
 * @prop {number} [pageSize=10] - Number of reviews per page. Optional.
 * @prop {boolean} [showActions=true] - Whether to show action buttons on reviews. Optional.
 * @prop {boolean} [showStatus=false] - Whether to show review status. Optional.
 * @prop {boolean} [compact=false] - Whether to use compact layout. Optional.
 * @prop {Function} [onEdit] - Callback when edit review is clicked. Optional.
 * @prop {Function} [onDelete] - Callback when delete review is clicked. Optional.
 * @prop {Function} [onFlag] - Callback when flag review is clicked. Optional.
 * @prop {Function} [onModerate] - Callback when moderate review is clicked. Optional.
 * @prop {Object} [sx] - Additional styling props. Optional.
 */
ReviewList.propTypes = {
  // Direct data props (used by entity review sections)
  reviews: PropTypes.array,
  loading: PropTypes.bool,
  totalCount: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  entityType: PropTypes.string,
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ownerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onReviewFlagged: PropTypes.func,
  showEntityInfo: PropTypes.bool,
  // Traditional filtering props (used by standalone ReviewList)
  filters: PropTypes.object,
  pageSize: PropTypes.number,
  showActions: PropTypes.bool,
  showStatus: PropTypes.bool,
  compact: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onFlag: PropTypes.func,
  onModerate: PropTypes.func,
  sx: PropTypes.object,
};
