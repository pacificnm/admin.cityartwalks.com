/**
 * @file owner-review-stats.jsx
 * @description Statistics widgets for content owner dashboard
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Review.OwnerReviewStats
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';

import { fDateTime } from 'src/utils/format-time';
import { fNumber, fPercent } from 'src/utils/format-number';

import { debugLog, debugWarn } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';
import { RefreshIcon, TrendingUpIcon, TrendingDownIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewStats
 * @description Statistics card for displaying key metrics
 * @function StatCard
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {string} props.icon - Icon name for the card
 * @param {string} props.color - Color theme
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {number} [props.trend] - Percentage change
 * @param {boolean} [props.loading] - Loading state
 * @returns {JSX.Element} Statistics card component
 */
function StatCard({ title, value, icon, color = 'primary', subtitle, trend, loading = false }) {
  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="text" width="80%" />
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              bgcolor: alpha((theme) => theme.palette[color].main, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon={icon} width={24} sx={{ color: `${color}.main` }} />
          </Box>
          {trend !== undefined && (
            <Chip
              size="small"
              variant="soft"
              color={trend >= 0 ? 'success' : 'error'}
              label={`${trend >= 0 ? '+' : ''}${fPercent(trend)}`}
              icon={trend >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            />
          )}
        </Box>

        <Stack spacing={1}>
          <Typography variant="h3" component="div">
            {fNumber(value)}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewStats
 * @description Rating distribution chart component
 * @function RatingDistributionChart
 * @param {Object} props - Component props
 * @param {Object} props.distribution - Rating distribution data
 * @param {boolean} [props.loading] - Loading state
 * @returns {JSX.Element} Rating distribution chart
 */
function RatingDistributionChart({ distribution = {}, loading = false }) {
  const chartData = useMemo(() => {
    const data = [];
    const categories = [];

    for (let i = 5; i >= 1; i--) {
      categories.push(`${i} Stars`);
      data.push(distribution[i] || 0);
    }

    return { data, categories };
  }, [distribution]);

  const chartOptions = useChart({
    chart: { type: 'bar' },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: chartData.categories,
    },
    colors: ['#FFB020', '#FFC107', '#FF9800', '#FF7043', '#F44336'],
  });

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Rating Distribution
      </Typography>
      <Chart type="bar" series={[{ data: chartData.data }]} options={chartOptions} height={200} />
    </Card>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewStats
 * @description Recent reviews list component
 * @function RecentReviewsList
 * @param {Object} props - Component props
 * @param {Array} props.reviews - Recent reviews array
 * @param {boolean} [props.loading] - Loading state
 * @returns {JSX.Element} Recent reviews list
 */
function RecentReviewsList({ reviews = [], loading = false }) {
  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" />
        <Stack spacing={2} sx={{ mt: 2 }}>
          {[...Array(3)].map((_, index) => (
            <Box key={index}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          ))}
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No recent reviews found
        </Typography>
      ) : (
        <Stack spacing={2}>
          {reviews.slice(0, 5).map((review) => (
            <Box key={review.reviewId}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box display="flex" alignItems="center">
                    {[...Array(5)].map((_, index) => (
                      <Iconify
                        key={index}
                        StarIcon
                        sx={{
                          color: index < review.rating ? 'warning.main' : 'grey.300',
                          width: 16,
                          height: 16,
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {fDateTime(review.createdAt)}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  variant="soft"
                  color={
                    review.status === 'ACTIVE'
                      ? 'success'
                      : review.status === 'PENDING'
                        ? 'warning'
                        : review.status === 'REJECTED'
                          ? 'error'
                          : 'default'
                  }
                  label={review.status}
                />
              </Box>
              <Typography variant="body2" noWrap>
                {review.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {review.User?.name || 'Anonymous'} •{' '}
                {review.ArtPiece?.title || review.Artist?.name || 'Unknown Content'}
              </Typography>
              {reviews.indexOf(review) < reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      )}
    </Card>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewStats
 * @description Main statistics dashboard component for content owners
 * @function OwnerReviewStats
 * @param {Object} props - Component props
 * @param {Object} props.stats - Overall statistics data
 * @param {Object} props.performance - Performance metrics
 * @param {Object} props.quality - Quality metrics
 * @param {Object} props.moderation - Moderation statistics
 * @param {boolean} [props.loading] - Loading state
 * @param {Error} [props.error] - Error state
 * @param {Function} [props.onDateRangeChange] - Date range change handler
 * @param {Object} [props.dateRange] - Current date range
 * @returns {JSX.Element} Owner review statistics dashboard
 */
export function OwnerReviewStats({
  stats = {},
  performance = {},
  quality = {},
  moderation = {},
  loading = false,
  error = null,
  onDateRangeChange,
  dateRange = {},
}) {
  const [refreshing, setRefreshing] = useState(false);

  // Handle manual refresh
  const handleRefresh = async () => {
    debugLog(
      'CityArtWalks.Components.Review.OwnerReviewStats.handleRefresh',
      'Refreshing statistics'
    );
    setRefreshing(true);
    try {
      // Trigger data refresh through parent component
      if (onDateRangeChange) {
        onDateRangeChange(dateRange);
      }
    } catch (refreshError) {
      debugWarn('Failed to refresh statistics:', refreshError);
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Failed to load statistics: {error.message}
      </Alert>
    );
  }

  const isLoading = loading || refreshing;

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5">Review Statistics</Typography>
        <Tooltip title="Refresh Statistics">
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews || 0}
            icon="solar:star-bold-duotone"
            color="primary"
            subtitle="All time"
            trend={performance.reviewGrowth}
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Rating"
            value={stats.averageRating ? Number(stats.averageRating).toFixed(1) : '0.0'}
            icon="solar:medal-star-bold-duotone"
            color="warning"
            subtitle="Out of 5.0"
            trend={performance.ratingTrend}
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Reviews"
            value={stats.activeReviews || 0}
            icon="solar:check-circle-bold-duotone"
            color="success"
            subtitle="Published reviews"
            loading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Flagged Reviews"
            value={stats.flaggedCount || 0}
            icon="solar:flag-bold-duotone"
            color="error"
            subtitle="Require attention"
            loading={isLoading}
          />
        </Grid>

        {/* Rating Distribution Chart */}
        <Grid item xs={12} md={6}>
          <RatingDistributionChart distribution={stats.ratingDistribution} loading={isLoading} />
        </Grid>

        {/* Recent Reviews */}
        <Grid item xs={12} md={6}>
          <RecentReviewsList reviews={stats.recentReviews} loading={isLoading} />
        </Grid>

        {/* Quality Metrics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quality Metrics
            </Typography>
            {isLoading ? (
              <Stack spacing={2}>
                <Skeleton variant="text" />
                <Skeleton variant="rectangular" height={8} />
                <Skeleton variant="text" />
                <Skeleton variant="rectangular" height={8} />
              </Stack>
            ) : (
              <Stack spacing={2}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Approval Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {fPercent(quality.approvalRate || 0)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(quality.approvalRate || 0) * 100}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Response Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {fPercent(quality.responseRate || 0)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(quality.responseRate || 0) * 100}
                    color="info"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Stack>
            )}
          </Card>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Status
            </Typography>
            {isLoading ? (
              <Stack spacing={1}>
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} variant="text" />
                ))}
              </Stack>
            ) : (
              <Stack spacing={1}>
                {Object.entries(stats.statusDistribution || {}).map(([status, count]) => (
                  <Box key={status} display="flex" justifyContent="space-between">
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {status.toLowerCase()}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {fNumber(count)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>

        {/* Moderation Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Moderation
            </Typography>
            {isLoading ? (
              <Stack spacing={1}>
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} variant="text" />
                ))}
              </Stack>
            ) : (
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Auto-Approved</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {fNumber(moderation.autoApproved || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Manual Review</Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">
                    {fNumber(moderation.manualReview || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Auto-Rejected</Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                    {fNumber(moderation.autoRejected || 0)}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OwnerReviewStats;
