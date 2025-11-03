/**
 * @file art-harvesting-metrics-cards.jsx
 * @description Metrics cards component for art harvesting dashboard displaying key statistics
 * @author Generated
 * @version 1.0.0
 */

'use client';

import { varAlpha } from 'minimal-shared/utils';

import { Box, Card, Grid, Chip, Stack, Typography, CircularProgress } from '@mui/material';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

/**
 * Get status color for queue status indicators
 * @param {string} status - Queue status
 * @returns {string} Material-UI color name
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'PROCESSING':
      return 'info';
    case 'REVIEWING':
      return 'secondary';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    case 'PUBLISHED':
      return 'primary';
    case 'ERROR':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Individual metric card component
 */
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  loading = false,
  ...other
}) {
  return (
    <Card sx={{ p: 3, ...other.sx }} {...other}>
      <Stack spacing={2}>
        {/* Header with icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 1.5,
              bgcolor: (theme) => varAlpha(theme.vars.palette[color].mainChannel, 0.12),
              color: `${color}.main`,
            }}
          >
            <Iconify icon={icon} width={24} />
          </Box>
          {loading && <CircularProgress size={20} sx={{ color: `${color}.main` }} />}
        </Box>

        {/* Value */}
        <Box>
          <Typography variant="h3" sx={{ color: 'text.primary', mb: 0.5 }}>
            {loading ? '—' : fNumber(value)}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
}

/**
 * Status breakdown card component
 */
function StatusBreakdownCard({ statusCounts, loading = false, ...other }) {
  const statuses = [
    { key: 'PENDING', label: 'Pending', icon: 'solar:clock-circle-bold' },
    { key: 'PROCESSING', label: 'Processing', icon: 'solar:refresh-circle-bold' },
    { key: 'REVIEWING', label: 'Reviewing', icon: 'solar:eye-bold' },
    { key: 'APPROVED', label: 'Approved', icon: 'solar:check-circle-bold' },
    { key: 'REJECTED', label: 'Rejected', icon: 'solar:close-circle-bold' },
    { key: 'PUBLISHED', label: 'Published', icon: 'solar:upload-bold' },
    { key: 'ERROR', label: 'Error', icon: 'solar:danger-triangle-bold' },
  ];

  return (
    <Card sx={{ p: 3, ...other.sx }} {...other}>
      <Typography variant="h6" gutterBottom>
        Queue Status Breakdown
      </Typography>

      <Stack spacing={2}>
        {statuses.map((status) => {
          const count = statusCounts?.[status.key] || 0;
          const color = getStatusColor(status.key);

          return (
            <Box
              key={status.key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon={status.icon} width={20} sx={{ color: `${color}.main` }} />
                <Typography variant="body2">{status.label}</Typography>
              </Box>

              <Chip
                label={loading ? '—' : fNumber(count)}
                color={color}
                size="small"
                variant="soft"
              />
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}

/**
 * Processing metrics card component
 */
function ProcessingMetricsCard({ processingMetrics, loading = false, ...other }) {
  const metrics = [
    {
      key: 'approvalRate',
      label: 'Approval Rate',
      icon: 'solar:like-bold',
      color: 'success',
      format: (value) => fPercent(value),
    },
    {
      key: 'rejectionRate',
      label: 'Rejection Rate',
      icon: 'solar:dislike-bold',
      color: 'error',
      format: (value) => fPercent(value),
    },
    {
      key: 'publishRate',
      label: 'Publish Rate',
      icon: 'solar:upload-bold',
      color: 'primary',
      format: (value) => fPercent(value),
    },
    {
      key: 'avgProcessingTime',
      label: 'Avg Processing Time',
      icon: 'solar:history-bold',
      color: 'info',
      format: (value) => `${value} days`,
    },
  ];

  return (
    <Card sx={{ p: 3, ...other.sx }} {...other}>
      <Typography variant="h6" gutterBottom>
        Processing Metrics
      </Typography>

      <Stack spacing={2}>
        {metrics.map((metric) => {
          const value = processingMetrics?.[metric.key] || 0;

          return (
            <Box
              key={metric.key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon={metric.icon} width={20} sx={{ color: `${metric.color}.main` }} />
                <Typography variant="body2">{metric.label}</Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: `${metric.color}.main`,
                }}
              >
                {loading ? '—' : metric.format(value)}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}

/**
 * Art Harvesting Metrics Cards Component
 * Displays key metrics and statistics for the art harvesting pipeline
 *
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data from the API
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.error - Error state
 * @returns {JSX.Element} The metrics cards component
 */
export function ArtHarvestingMetricsCards({ stats, loading = false, error }) {
  if (error) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'error.lighter' }}>
            <Typography variant="h6" color="error">
              Failed to load metrics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error.message || 'Unable to fetch queue statistics'}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Key Metrics Row */}
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Items"
          value={stats?.totalItems || 0}
          subtitle="All queue items"
          icon="solar:layers-bold"
          color="primary"
          loading={loading}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Active Items"
          value={stats?.activeItems || 0}
          subtitle="In progress or pending"
          icon="solar:play-circle-bold"
          color="info"
          loading={loading}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Needs Review"
          value={stats?.processingMetrics?.needsReview || 0}
          subtitle="Awaiting verification"
          icon="solar:eye-bold"
          color="secondary"
          loading={loading}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Published"
          value={stats?.statusCounts?.PUBLISHED || 0}
          subtitle="Live on platform"
          icon="solar:upload-bold"
          color="success"
          loading={loading}
        />
      </Grid>

      {/* Status Breakdown */}
      <Grid item xs={12}>
        <StatusBreakdownCard statusCounts={stats?.statusCounts} loading={loading} />
      </Grid>

      {/* Processing Metrics */}
      <Grid item xs={12}>
        <ProcessingMetricsCard processingMetrics={stats?.processingMetrics} loading={loading} />
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="This Week"
          value={stats?.timePeriods?.publishedThisWeek || 0}
          subtitle="Items published"
          icon="solar:calendar-bold"
          color="warning"
          loading={loading}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="This Month"
          value={stats?.timePeriods?.publishedThisMonth || 0}
          subtitle="Items published"
          icon="solar:calendar-month-bold"
          color="warning"
          loading={loading}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Recent Items"
          value={stats?.recentItems || 0}
          subtitle="Added this week"
          icon="solar:add-circle-bold"
          color="info"
          loading={loading}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Has Errors"
          value={stats?.processingMetrics?.hasErrors || 0}
          subtitle="Items with errors"
          icon="solar:danger-triangle-bold"
          color="error"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}
