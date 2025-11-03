/**
 * Review Moderation Statistics Dashboard Component
 *
 * This component provides a comprehensive dashboard for moderation statistics including
 * key metrics, charts, trends, and performance insights for administrative monitoring.
 *
 * @namespace CityArtWalks.Components.Review
 * @fileoverview Comprehensive moderation statistics dashboard for admin users
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} useGetModerationStatistics - Statistics hook
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth} useAuthContext - Authentication context
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Moderation} - Moderation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Admin-Interface} - Admin interface documentation
 */

'use client';

import { useMemo, useState, useCallback } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Card,
  Chip,
  Grid,
  List,
  Stack,
  Alert,
  Avatar,
  Button,
  Select,
  MenuItem,
  ListItem,
  CardHeader,
  Typography,
  InputLabel,
  AlertTitle,
  CardContent,
  FormControl,
  ListItemText,
  LinearProgress,
  ListItemAvatar,
} from '@mui/material';

import { useGetModerationStatistics } from 'src/actions/review/hooks';

import { Chart, useChart } from 'src/components/chart';
import {
  FlagIcon,
  StarIcon,
  BrainIcon,
  ArrowUpIcon,
  RestartIcon,
  ArrowDownIcon,
  ChatRoundIcon,
  LightbulbIcon,
  UserCheckIcon,
  UsersGroupIcon,
  WifiRouterIcon,
  CheckCircleIcon,
  ClockCircleIcon,
} from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * Metric Card Component for displaying key statistics
 */
function MetricCard({ title, value, subtitle, icon, color = 'primary', trend, loading = false }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.lighter`,
              color: `${color}.dark`,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" sx={{ mb: 0.5 }}>
              {loading ? '-' : typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                {trend > 0 ? (
                  <ArrowUpIcon width={16} sx={{ color: 'success.main' }} />
                ) : (
                  <ArrowDownIcon width={16} sx={{ color: 'error.main' }} />
                )}
                <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
                  {Math.abs(trend)}%
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Progress Card Component for percentage-based metrics
 */
function ProgressCard({ title, value, total, color = 'primary', icon, description }) {
  const percentage = (total || 0) > 0 ? ((value || 0) / total) * 100 : 0;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">{(value || 0).toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">
                {percentage.toFixed(1)}%
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={percentage}
              color={color}
              sx={{ height: 8, borderRadius: 4 }}
            />

            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Recent Activity Component
 */
function RecentActivityCard({ activities = [], loading = false }) {
  return (
    <Card>
      <CardHeader title="Recent Moderation Activity" action={<ClockCircleIcon />} />
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : activities.length === 0 ? (
          <Typography color="text.secondary">No recent activity</Typography>
        ) : (
          <List disablePadding>
            {activities.map((activity, index) => (
              <ListItem key={activity.reviewId} divider={index < activities.length - 1}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: activity.moderationType === 'MANUAL' ? 'warning.main' : 'info.main',
                    }}
                  >
                    {activity.moderationType === 'MANUAL' ? (
                      <UserCheckIcon width={20} />
                    ) : (
                      <BrainIcon width={20} />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" noWrap>
                        {activity.user?.name || 'Unknown User'}
                      </Typography>
                      <Chip
                        size="small"
                        label={activity.status}
                        color={activity.status === 'ACTIVE' ? 'success' : 'error'}
                        variant="soft"
                      />
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {activity.comment || 'No comment'} •{' '}
                      {new Date(activity.timestamp).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Top Reviewers Component
 */
function TopReviewersCard({ reviewers = [], loading = false }) {
  return (
    <Card>
      <CardHeader title="Top Reviewers" action={<UsersGroupIcon />} />
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : reviewers.length === 0 ? (
          <Typography color="text.secondary">No reviewer data</Typography>
        ) : (
          <List disablePadding>
            {reviewers.slice(0, 5).map((reviewer, index) => (
              <ListItem key={reviewer.userId} divider={index < 4}>
                <ListItemAvatar>
                  <Avatar src={reviewer.profileImageUrl}>{reviewer.name?.[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={reviewer.name || 'Unknown User'}
                  secondary={`${reviewer.reviewCount} reviews`}
                />
                <Chip
                  size="small"
                  label={`#${index + 1}`}
                  color={index === 0 ? 'primary' : 'default'}
                  variant={index === 0 ? 'filled' : 'outlined'}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Insights and Recommendations Component
 */
function InsightsCard({ insights = {}, loading = false }) {
  const { performanceMetrics = {}, recommendations = [] } = insights;

  return (
    <Card>
      <CardHeader title="Insights & Recommendations" action={<LightbulbIcon />} />
      <CardContent sx={{ pt: 0 }}>
        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : (
          <Stack spacing={2}>
            {/* Performance Metrics */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                      {performanceMetrics.aiAccuracy?.toFixed(1) || 0}%
                    </Typography>
                    <Typography variant="caption">AI Efficiency</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="h6" color="warning.main">
                      {performanceMetrics.humanInterventionRate?.toFixed(1) || 0}%
                    </Typography>
                    <Typography variant="caption">Override Rate</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Recommendations
                </Typography>
                <Stack spacing={1}>
                  {recommendations.map((rec, index) => (
                    <Alert key={index} severity={rec.type} size="small">
                      <AlertTitle sx={{ fontSize: '0.875rem' }}>{rec.message}</AlertTitle>
                      {rec.action}
                    </Alert>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Review Moderation Statistics Dashboard Component
 *
 * @memberof CityArtWalks.Components.Review
 * @function ReviewModerationDashboard
 * @returns {JSX.Element} The rendered moderation dashboard component
 */
export function ReviewModerationDashboard() {
  // Filter state for date range
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    period: 'day',
  });

  // Authentication
  const { accessToken } = useAuthContext();

  // Prepare query options
  const queryOptions = useMemo(
    () => ({
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== null && value !== undefined && value !== ''
        )
      ),
      // Convert dates to ISO strings
      ...(filters.dateFrom && { dateFrom: filters.dateFrom.toISOString() }),
      ...(filters.dateTo && { dateTo: filters.dateTo.toISOString() }),
    }),
    [filters]
  );

  // Fetch statistics
  const {
    overview,
    moderation,
    distributions,
    topReviewers,
    recentActivity,
    trends,
    insights,
    statisticsLoading,
    statisticsError,
  } = useGetModerationStatistics(queryOptions, accessToken);

  /**
   * Handle filter changes
   */
  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      period: 'day',
    });
  }, []);

  // Chart options for trends
  const trendsChartOptions = useChart({
    xaxis: {
      categories: (trends || []).map((d) => new Date(d.date).toLocaleDateString()),
    },
    chart: {
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
    },
  });

  const trendsChartSeries = [
    {
      name: 'Total Reviews',
      data: (trends || []).map((d) => d.total),
    },
    {
      name: 'Approved',
      data: (trends || []).map((d) => d.approved),
    },
    {
      name: 'Rejected',
      data: (trends || []).map((d) => d.rejected),
    },
  ];

  // Status distribution chart
  const statusChartOptions = useChart({
    labels: Object.keys(distributions?.byStatus || {}),
    legend: {
      position: 'bottom',
    },
  });

  const statusChartSeries = Object.values(distributions?.byStatus || {});

  const hasFilters = filters.dateFrom || filters.dateTo || filters.period !== 'day';

  if (statisticsError) {
    return (
      <Alert severity="error">
        <AlertTitle>Error Loading Statistics</AlertTitle>
        Failed to load moderation statistics. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Moderation Dashboard</Typography>

        <Stack direction="row" spacing={1}>
          <Chip
            label="Live Data"
            color="success"
            size="small"
            variant="soft"
            icon={<WifiRouterIcon />}
          />
          {hasFilters && (
            <Chip label="Filtered" color="primary" size="small" onDelete={handleClearFilters} />
          )}
        </Stack>
      </Stack>

      {/* Filter Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Typography variant="subtitle2">Filters:</Typography>

            <DatePicker
              label="From Date"
              value={filters.dateFrom}
              onChange={(date) => handleFilterChange('dateFrom', date)}
              slotProps={{ textField: { size: 'small', sx: { width: 160 } } }}
            />

            <DatePicker
              label="To Date"
              value={filters.dateTo}
              onChange={(date) => handleFilterChange('dateTo', date)}
              slotProps={{ textField: { size: 'small', sx: { width: 160 } } }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={filters.period}
                label="Period"
                onChange={(e) => handleFilterChange('period', e.target.value)}
              >
                <MenuItem value="day">Daily</MenuItem>
                <MenuItem value="week">Weekly</MenuItem>
                <MenuItem value="month">Monthly</MenuItem>
              </Select>
            </FormControl>

            {hasFilters && (
              <Button size="small" onClick={handleClearFilters} startIcon={<RestartIcon />}>
                Clear
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Main Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Reviews"
            value={overview?.totalReviews || 0}
            icon={<ChatRoundIcon width={24} />}
            color="primary"
            loading={statisticsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Approved Reviews"
            value={overview?.activeReviews || 0}
            subtitle={`${moderation?.approvalRate || 0}% approval rate`}
            icon={<CheckCircleIcon width={24} />}
            color="success"
            loading={statisticsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Pending Review"
            value={overview?.pendingReviews || 0}
            icon={<ClockCircleIcon width={24} />}
            color="warning"
            loading={statisticsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Average Rating"
            value={overview?.averageRating?.toFixed(1) || '0.0'}
            subtitle={`from ${overview?.totalRatings || 0} ratings`}
            icon={<StarIcon width={24} />}
            color="info"
            loading={statisticsLoading}
          />
        </Grid>
      </Grid>

      {/* Moderation Performance */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProgressCard
            title="AI Efficiency"
            value={(moderation?.aiApproved || 0) + (moderation?.aiRejected || 0)}
            total={overview?.totalReviews || 0}
            color="info"
            icon={<BrainIcon sx={{ color: 'info.main' }} width={24} />}
            description={`${moderation?.moderationEfficiency || 0}% of reviews processed by AI`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProgressCard
            title="Manual Overrides"
            value={moderation?.manualOverrides || 0}
            total={(moderation?.aiApproved || 0) + (moderation?.aiRejected || 0)}
            color="warning"
            icon={<UserCheckIcon sx={{ color: 'warning.main' }} width={24} />}
            description={`${moderation?.overrideRate || 0}% override rate`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProgressCard
            title="Flagged Reviews"
            value={moderation?.flaggedReviews || 0}
            total={overview?.totalReviews || 0}
            color="error"
            icon={<FlagIcon sx={{ color: 'error.main' }} width={24} />}
            description="Requiring manual attention"
          />
        </Grid>
      </Grid>

      {/* Charts and Analytics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardHeader title="Review Trends (Last 30 Days)" />
            <CardContent>
              {(trends || []).length > 0 ? (
                <Chart
                  dir="ltr"
                  type="line"
                  series={trendsChartSeries}
                  options={trendsChartOptions}
                  width="100%"
                  height={320}
                />
              ) : (
                <Box
                  sx={{
                    height: 320,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary">No trend data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardHeader title="Status Distribution" />
            <CardContent>
              {statusChartSeries.length > 0 ? (
                <Chart
                  dir="ltr"
                  type="donut"
                  series={statusChartSeries}
                  options={statusChartOptions}
                  width="100%"
                  height={280}
                />
              ) : (
                <Box
                  sx={{
                    height: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary">No distribution data</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Info */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TopReviewersCard reviewers={topReviewers} loading={statisticsLoading} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentActivityCard activities={recentActivity} loading={statisticsLoading} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <InsightsCard insights={insights} loading={statisticsLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
