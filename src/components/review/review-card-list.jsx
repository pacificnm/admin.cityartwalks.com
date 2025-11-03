/**
 * @namespace CityArtWalks.Components.Review.ReviewCardList
 * @version 1.0.0
 * @author Jaimie Garner
 * @description Card-based review list component for better mobile responsiveness and UX
 */

'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
// Grid replaced by CSS grid Box
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import ReviewErrorBoundary from 'src/components/review/review-error-boundary';
import { ReviewTableToolbar } from 'src/components/review/review-table-toolbar';

import ReviewCard from './review-card';

/**
 * Review Card List component
 * Displays reviews in a responsive card layout with filtering and pagination.
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Filter state object (e.g., {status: 'ACTIVE'})
 * @param {string} props.accessToken - Authentication token
 * @param {Array} props.tabOptions - Tab options for status filtering
 * @param {Object} props.displayFilters - Object defining which filters should be displayed
 * @param {Function} props.getEditHref - Function to generate edit URLs
 * @param {Function} props.onRefresh - Function to refresh review data
 * @returns {JSX.Element} The review card list component
 */
export function ReviewCardList({
  // Direct data props (when parent supplies data via ReviewTableToolbar)
  reviews: reviewsProp,
  loading: loadingProp,
  paginationMeta: paginationMetaProp,
  gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))',
  // Local fetch mode props
  filters: initialFilters = {},
  accessToken = '',
  tabOptions = [],
  displayFilters = { search: true, createdBy: false, rating: true },
  getEditHref = (reviewId) => `/review/${reviewId}/edit`,
  onRefresh,
}) {
  // set pagination (only used in internal fetch mode)
  // Determine if component is being used in direct-props mode (parent provides reviews)
  const useDirectProps = reviewsProp !== undefined;

  // Memoize initialFilters to avoid recreating object on every render which can
  // trigger the toolbar's load/save effects and cause render loops.
  const initialFiltersKey = JSON.stringify(initialFilters || {});
  const memoInitialFilters = useMemo(
    () => JSON.parse(initialFiltersKey || '{}'),
    [initialFiltersKey]
  );
  const hasInitialFilters = Object.keys(memoInitialFilters).length > 0;

  return (
    <ReviewErrorBoundary
      name="ReviewCardList"
      context="review_card_list"
      variant="card"
      title="Review List Error"
      description="Unable to load the review list."
    >
      {/* Direct-props mode: parent provided reviews */}
      {useDirectProps ? (
        <Stack spacing={3}>
          {!reviewsProp || reviewsProp.length === 0 ? (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No reviews found
              </Typography>
            </Box>
          ) : (
            <Box
              data-cy="review-card-list"
              gap={3}
              display="grid"
              gridTemplateColumns={gridTemplateColumns}
            >
              {reviewsProp.map((review) => (
                <ReviewCard
                  key={review.reviewId}
                  review={review}
                  getEditHref={getEditHref}
                  showAIFeedback={displayFilters.showAIFeedback}
                  onRefresh={onRefresh}
                />
              ))}
            </Box>
          )}
        </Stack>
      ) : (
        // Standalone mode: use ReviewTableToolbar to manage filters, tabs, pagination, etc.
        <ReviewTableToolbar
          {...(hasInitialFilters ? { initialFilters: memoInitialFilters } : {})}
          persistFilters={false}
        >
          {({ reviews, loading, error, paginationMeta, onRefresh: toolbarRefresh }) => {
            const notFound = !reviews || reviews.length === 0;

            return (
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error.message || 'Failed to load reviews'}
                  </Alert>
                )}

                {loading ? (
                  <Box sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      Loading reviews...
                    </Typography>
                  </Box>
                ) : notFound ? (
                  <Box sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      No reviews found
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                      Try adjusting your search or filter criteria
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    data-cy="review-card-list"
                    gap={3}
                    display="grid"
                    gridTemplateColumns={gridTemplateColumns}
                  >
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.reviewId}
                        review={review}
                        getEditHref={getEditHref}
                        showAIFeedback={displayFilters.showAIFeedback}
                        onRefresh={toolbarRefresh}
                      />
                    ))}
                  </Box>
                )}
              </Stack>
            );
          }}
        </ReviewTableToolbar>
      )}
    </ReviewErrorBoundary>
  );
}

/**
 * Individual Review Card component
 */
// ReviewCard component extracted to `src/components/review/review-card.jsx`

export default ReviewCardList;
