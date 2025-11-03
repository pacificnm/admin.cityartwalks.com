'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetIndexNowSubmissionStats } from 'src/actions/index-now-submission/hooks';

import { ErrorView } from 'src/components/error/error-view';
import { useSettingsContext } from 'src/components/settings';
import { StatsList } from 'src/components/dashboard/stats-list';
import { SummaryCard } from 'src/components/dashboard/summary-card';
import { ErrorBoundary } from 'src/components/error/error-boundary';
import { BackButton, RefreshButton } from 'src/components/index-now';
import {
  ClockIcon,
  LetterIcon,
  DocumentIcon,
  CheckCircleIcon,
  CloseCircleIcon,
} from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

import { IndexNowStatsSkeleton } from '../index-now-stats-skeleton';

// ----------------------------------------------------------------------

/**
 * IndexNow Statistics View
 *
 * Provides comprehensive analytics and monitoring dashboard for IndexNow submissions:
 * - Real-time submission statistics and success rates
 * - Entity type breakdown and performance metrics
 * - Submission status distribution and error analysis
 * - Temporal trends and processing queue status
 * - Integration with IndexNow service for live data
 *
 * @memberof CityArtWalks.Sections.IndexNowSubmission
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Statistics|IndexNow Statistics Documentation}
 */
export function IndexNowStatsView() {
  const settings = useSettingsContext();
  const { accessToken } = useAuthContext();

  const {
    stats,
    loading,
    error,
    refresh: handleRefresh,
  } = useGetIndexNowSubmissionStats(accessToken);

  if (loading) return <IndexNowStatsSkeleton />;
  if (error)
    return (
      <ErrorView
        message={error?.message || 'Failed to load IndexNow submission statistics'}
        error={error}
        status={500}
      />
    );

  return (
    <ErrorBoundary fallback="Failed to load IndexNow submission statistics. Please refresh the page or contact support if the issue persists.">
      <DashboardContent>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <BackButton href={paths.dashboard.indexNow.root} />
                </Stack>
                <Typography variant="h4" gutterBottom>
                  IndexNow Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time analytics and performance metrics for URL submissions
                </Typography>
              </Box>

              <RefreshButton onClick={handleRefresh} />
            </Stack>

            {/* Summary Cards */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  icon={<DocumentIcon size={24} />}
                  title="Total Submissions"
                  value={stats?.totalSubmissions?.toLocaleString()}
                  subtitle="All time"
                  color="primary"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  icon={<CheckCircleIcon size={24} />}
                  title="Successful"
                  value={stats?.successfulSubmissions?.toLocaleString()}
                  subtitle={`${stats?.successRate?.toFixed(1)}% success rate`}
                  color="success"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  icon={<ClockIcon size={24} />}
                  title="Pending"
                  value={stats?.pendingSubmissions?.toLocaleString()}
                  subtitle="In queue"
                  color="warning"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <SummaryCard
                  icon={<CloseCircleIcon size={24} />}
                  title="Failed"
                  value={stats?.failedSubmissions?.toLocaleString()}
                  subtitle={`${stats?.failureRate?.toFixed(1)}% failure rate`}
                  color="error"
                />
              </Grid>
            </Grid>

            {/* Entity Type Breakdown */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <StatsList
                  title="Submissions by Entity Type"
                  data={stats?.byEntityType}
                  keyField="entityType"
                  labelField="entityType"
                  valueField="count"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <StatsList
                  title="Submissions by Status"
                  data={stats?.byStatus}
                  keyField="status"
                  labelField="status"
                  valueField="count"
                />
              </Grid>
            </Grid>

            {/* Recent Activity */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity (Last 24 Hours)
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack alignItems="center" spacing={1}>
                      <LetterIcon size={32} color="primary" />
                      <Typography variant="h5">
                        {stats?.last24Hours?.submitted?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Submitted
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack alignItems="center" spacing={1}>
                      <CheckCircleIcon size={32} color="success" />
                      <Typography variant="h5">
                        {stats?.last24Hours?.successful?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Successful
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Stack alignItems="center" spacing={1}>
                      <CloseCircleIcon size={32} color="error" />
                      <Typography variant="h5">
                        {stats?.last24Hours?.failed?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Failed
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Queue Status */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Processing Queue Status
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Next scheduled run:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {stats?.nextScheduledRun || 'Not scheduled'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Last successful run:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {stats?.lastSuccessfulRun || 'Never'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Queue size:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {stats?.queueSize?.toLocaleString() || '0'} pending submissions
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </DashboardContent>
    </ErrorBoundary>
  );
}
