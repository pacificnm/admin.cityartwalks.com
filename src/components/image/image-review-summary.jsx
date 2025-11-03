/**
 * @namespace CityArtWalks.Components.Image.ImageReviewSummary
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Review summary component for displaying image reviews, ratings, and excerpts.
 */

'use client';

import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

/**
 * @memberof CityArtWalks.Components.Image.ImageReviewSummary
 * @function ImageReviewSummary
 * @description Displays review summary including average rating, review count, and latest review excerpt.
 * Calculates average rating from reviews array and shows the most recent comment.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} [props.reviews=[]] - Array of reviews with rating and comment properties.
 * @param {boolean} [props.showDivider=true] - Whether to show divider above the summary.
 * @param {Object} [props.sx] - Additional Material-UI sx styling props.
 * @returns {JSX.Element|null} The rendered ImageReviewSummary component or null if no reviews.
 *
 * @example
 * <ImageReviewSummary
 *   reviews={[
 *     { rating: 5, comment: "Great image!" },
 *     { rating: 4, comment: "Nice work" }
 *   ]}
 * />
 */
export function ImageReviewSummary(props) {
  const { reviews = [], showDivider = true, sx, ...other } = props;

  // Calculate average rating from reviews
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  }, [reviews]);

  // Get the latest review with a comment
  const latestReviewWithComment = useMemo(
    () => reviews.find((review) => review.comment && review.comment.trim()),
    [reviews]
  );

  // Don't render if no reviews
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <>
      {showDivider && <Divider sx={{ my: 1 }} />}

      <Stack direction="row" alignItems="center" spacing={1} sx={sx} {...other}>
        <Rating value={averageRating} precision={0.5} size="small" readOnly />
        <Typography variant="caption" color="text.secondary">
          ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
        </Typography>
      </Stack>

      {latestReviewWithComment && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 1,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          &ldquo;{latestReviewWithComment.comment}&rdquo;
        </Typography>
      )}
    </>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageReviewSummary
 * PropTypes validation for the ImageReviewSummary component
 */
ImageReviewSummary.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string,
    })
  ),
  showDivider: PropTypes.bool,
  sx: PropTypes.object,
};
