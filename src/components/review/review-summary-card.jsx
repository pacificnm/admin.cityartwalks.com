/**
 * @namespace CityArtWalks.Components.Review.ReviewSummaryCard
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import LinearProgress from '@mui/material/LinearProgress';

import { useGetReviewStats } from 'src/actions/review';

import { Iconify } from 'src/components/iconify';
import { ArrowRightIcon } from 'src/components/icons';
import { EditIcon } from 'src/components/icons/edit-icon';
import { StarIcon } from 'src/components/icons/star-icon';
import { StarOutlineIcon } from 'src/components/icons/star-outline-icon';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

import ReviewErrorBoundary from './review-error-boundary';
import { ReviewSummaryCardSkeleton } from './review-skeletons';

/**
 * @memberof CityArtWalks.Components.Review.ReviewSummaryCard
 * @function ReviewSummaryCard
 * @description Displays a comprehensive review summary card for any entity with statistics,
 * rating distribution, and recent reviews. Integrates with the review actions layer.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.entityType - The type of entity (ARTIST, ART_PIECE, IMAGE, PATH, PATH_MAP).
 * @param {string|number} props.entityId - The ID of the entity.
 * @param {string} [props.entityName] - The name of the entity for display.
 * @param {Function} [props.onCreateReview] - Callback when user wants to create a review.
 * @param {Function} [props.onViewAll] - Callback when user wants to view all reviews.
 * @param {boolean} [props.showCreateButton=true] - Whether to show the create review button.
 * @param {boolean} [props.showViewAllButton=true] - Whether to show the view all button.
 * @param {Object} [props.sx] - Additional styling props.
 * @returns {JSX.Element} The rendered ReviewSummaryCard component.
 */
export function ReviewSummaryCard({
  entityType,
  entityId,
  entityName,
  onCreateReview,
  onViewAll,
  showCreateButton = true,
  showViewAllButton = true,
  sx,
  ...other
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuthContext();

  // Fetch review statistics with recent reviews
  const { stats, statsLoading, statsError } = useGetReviewStats(
    entityType,
    entityId,
    {
      includeRecent: 3,
      includeTop: 0,
      includeTrends: false,
      cacheTime: 300,
    },
    user?.token
  );

  // Memoized calculations for performance
  const ratingData = useMemo(() => {
    if (!stats?.distribution) return null;

    const { counts, percentages } = stats.distribution;
    const ratingBreakdown = [];

    for (let rating = 5; rating >= 1; rating--) {
      ratingBreakdown.push({
        rating,
        count: counts[rating] || 0,
        percentage: percentages[rating] || 0,
      });
    }

    return ratingBreakdown;
  }, [stats?.distribution]);

  // Handle loading state
  if (statsLoading) {
    return <ReviewSummaryCardSkeleton sx={sx} {...other} />;
  }

  // Handle error state
  if (statsError) {
    return (
      <Card sx={{ p: { xs: 2, sm: 3 }, ...sx }} {...other}>
        <Stack spacing={2}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon
                size={{ xs: 20, sm: 24 }}
                sx={{
                  color: 'warning.main',
                }}
              />
              <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Reviews
              </Typography>
              <Chip
                label="Error Loading"
                size="small"
                color="error"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>

            {/* Write Review Button - moved to header */}
            {showCreateButton && onCreateReview && (
              <RoleBasedGuard
                allowedRoles={['MEMBER', 'ADMIN']}
                hasContent={false}
                protecting="ReviewSummaryCard"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onCreateReview}
                  startIcon={<EditIcon size={16} />}
                  size={isMobile ? 'medium' : 'small'}
                  sx={{
                    py: 0.5,
                    px: { xs: 2, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '0.8rem' },
                    minWidth: 'auto',
                  }}
                >
                  Write Review
                </Button>
              </RoleBasedGuard>
            )}
          </Box>
          <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
            <Typography
              variant="body2"
              color="error.main"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
            >
              Failed to load review statistics
            </Typography>
          </Box>
        </Stack>
      </Card>
    );
  }

  // Handle no reviews state
  if (!stats?.overview?.hasReviews) {
    return (
      <Card sx={{ p: { xs: 2, sm: 3 }, ...sx }} {...other}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon
                size={{ xs: 20, sm: 24 }}
                sx={{
                  color: 'warning.main',
                }}
              />
              <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Reviews
              </Typography>
              <Chip
                label="0 Reviews"
                size="small"
                color="default"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>

            {/* Write Review Button - moved to header */}
            {showCreateButton && onCreateReview && (
              <RoleBasedGuard
                allowedRoles={['MEMBER', 'ADMIN']}
                hasContent={false}
                protecting="ReviewSummaryCard"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onCreateReview}
                  startIcon={<EditIcon size={16} />}
                  size={isMobile ? 'medium' : 'small'}
                  sx={{
                    py: 0.5,
                    px: { xs: 2, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '0.8rem' },
                    minWidth: 'auto',
                  }}
                >
                  Write Review
                </Button>
              </RoleBasedGuard>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
            <StarOutlineIcon
              size={{ xs: 48, sm: 64 }}
              sx={{
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
              No reviews yet
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
              {entityName
                ? `Be the first to review ${entityName}`
                : 'Be the first to leave a review'}
            </Typography>
          </Box>
        </Stack>
      </Card>
    );
  }

  const { overview } = stats;

  return (
    <ReviewErrorBoundary
      name="ReviewSummaryCard"
      context="displaying_review_summary"
      variant="card"
      title="Review Summary Error"
      description="Unable to load review statistics and summary. Please try again later."
    >
      <Card sx={{ p: { xs: 2, sm: 3 }, ...sx }} {...other}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon
                size={{ xs: 20, sm: 24 }}
                sx={{
                  color: 'warning.main',
                }}
              />
              <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Reviews
              </Typography>
              <Chip
                label={`${overview.totalReviews} ${overview.totalReviews === 1 ? 'Review' : 'Reviews'}`}
                size="small"
                color="primary"
                variant="soft"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Write Review Button - moved to header */}
              {showCreateButton && onCreateReview && (
                <RoleBasedGuard
                  allowedRoles={['MEMBER', 'ADMIN']}
                  hasContent={false}
                  protecting="ReviewSummaryCard"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onCreateReview}
                    startIcon={<EditIcon size={16} />}
                    size={isMobile ? 'medium' : 'small'}
                    sx={{
                      py: 0.5,
                      px: { xs: 2, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '0.8rem' },
                      minWidth: 'auto',
                    }}
                  >
                    Write Review
                  </Button>
                </RoleBasedGuard>
              )}

              {showViewAllButton && onViewAll && (
                <Button
                  size={isMobile ? 'medium' : 'small'}
                  color="inherit"
                  endIcon={<Iconify icon={<ArrowRightIcon size={16} />} />}
                  onClick={onViewAll}
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  }}
                >
                  View All ({overview.totalReviews})
                </Button>
              )}
            </Box>
          </Box>

          {/* Overall Rating Summary */}
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              <Typography
                variant="h2"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '3rem' },
                }}
              >
                {overview.averageRating.toFixed(1)}
              </Typography>
              <Rating
                value={overview.averageRating}
                readOnly
                precision={0.1}
                size={isMobile ? 'medium' : 'small'}
                sx={{ mt: 0.5 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: { xs: '0.875rem', sm: '0.875rem' },
                }}
              >
                {overview.totalReviews} review{overview.totalReviews !== 1 ? 's' : ''}
              </Typography>
            </Box>

            {/* Rating Distribution */}
            {ratingData && (
              <Box
                sx={{
                  flex: 1,
                  ml: { xs: 0, sm: 2 },
                  mt: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {ratingData.map((item) => (
                  <Box
                    key={item.rating}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: { xs: 0.5, sm: 1 },
                      mb: { xs: 0.75, sm: 0.5 },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        minWidth: { xs: 10, sm: 12 },
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      {item.rating}
                    </Typography>
                    <Iconify
                      StarIcon
                      sx={{
                        fontSize: { xs: 10, sm: 12 },
                        color: 'warning.main',
                      }}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        flex: 1,
                        height: { xs: 4, sm: 6 },
                        borderRadius: 1,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 1,
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        minWidth: { xs: 20, sm: 24 },
                        textAlign: 'right',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Recent Reviews */}
          {stats.recentReviews && stats.recentReviews.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}
                >
                  Recent Reviews
                </Typography>
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                  {stats.recentReviews.map((review) => (
                    <Box key={review.reviewId}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: { xs: 1, sm: 1.5 },
                          flexDirection: { xs: 'column', sm: 'row' },
                        }}
                      >
                        <Rating
                          value={review.rating}
                          readOnly
                          size={isMobile ? 'medium' : 'small'}
                          sx={{ alignSelf: { xs: 'flex-start', sm: 'flex-start' } }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 0.5,
                              fontSize: { xs: '0.875rem', sm: '0.875rem' },
                              lineHeight: 1.5,
                            }}
                          >
                            {review.comment}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                          >
                            {review.user?.name || 'Anonymous'} •{' '}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </Card>
    </ReviewErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewSummaryCard
 * @prop {string} entityType - The type of entity (ARTIST, ART_PIECE, IMAGE, PATH, PATH_MAP). Required.
 * @prop {string|number} entityId - The ID of the entity. Required.
 * @prop {string} [entityName] - The name of the entity for display. Optional.
 * @prop {Function} [onCreateReview] - Callback when user wants to create a review. Optional.
 * @prop {Function} [onViewAll] - Callback when user wants to view all reviews. Optional.
 * @prop {boolean} [showCreateButton=true] - Whether to show the create review button. Optional.
 * @prop {boolean} [showViewAllButton=true] - Whether to show the view all button. Optional.
 * @prop {Object} [sx] - Additional styling props. Optional.
 */
ReviewSummaryCard.propTypes = {
  entityType: PropTypes.oneOf(['ARTIST', 'ART_PIECE', 'IMAGE', 'PATH', 'PATH_MAP']).isRequired,
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  entityName: PropTypes.string,
  onCreateReview: PropTypes.func,
  onViewAll: PropTypes.func,
  showCreateButton: PropTypes.bool,
  showViewAllButton: PropTypes.bool,
  sx: PropTypes.object,
};
