/**
 * @file art-harvesting-dashboard-view.jsx
 * @description Main Art Harvesting Dashboard View component for displaying harvesting operations
 * @author Generated
 * @version 1.0.0
 */

'use client';

import { useRouter } from 'next/navigation';

import { Card, Grid, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetArtPieceQueueStats } from 'src/actions/art-piece-queue/hooks';

// TODO: Import art harvesting components when implemented
// import { HarvestingOverview, HarvestingWidgets } from 'src/components/art-harvesting/dashboard';
import { ViewIcon } from 'src/components/icons';
import { Iconify } from 'src/components/iconify';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import { ArtHarvestingMetricsCards } from 'src/components/art-harvesting/dashboard/art-harvesting-metrics-cards';

import { View403 } from 'src/sections/error/403-view';

import { useAuthContext } from 'src/auth/hooks';
// import { useGetHarvestingStatus } from 'src/actions/art-harvesting/hooks';

/**
 * Art Harvesting Dashboard View component
 * Displays overview of harvesting operations including status, metrics,
 * recent activity, and quick access to harvesting functions.
 *
 * @returns {JSX.Element} The art harvesting dashboard view component
 */

/**
 * Internal content component that handles the harvesting dashboard display logic.
 */
function ArtHarvestingDashboardContent() {
  // fetch the user context
  const { loading, authenticated, accessToken } = useAuthContext();

  // Router for navigation
  const router = useRouter();

  // scroll progress
  const pageProgress = useScrollProgress();

  // Fetch queue statistics
  const {
    stats,
    statsLoading,
    statsError,
    mutate: mutateStats,
  } = useGetArtPieceQueueStats(accessToken);

  // Refresh handler
  const handleRefresh = () => {
    mutateStats(); // Refresh stats
  };

  // Conditional rendering based on auth and loading state
  if (loading) return null;
  if (!authenticated) return <View403 />;

  return (
    <DashboardContent>
      <ScrollProgress
        data-cy="scroll-progress"
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />
      <BackToTop data-cy="back-to-top" />
      <Container maxWidth={false} sx={{ mb: 4 }}>
        <CustomBreadcrumbs
          data-cy="breadcrumbs"
          heading="Art Harvesting Dashboard"
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Piece', href: paths.dashboard.artPiece.home },
            { name: 'Harvesting', href: paths.dashboard.harvesting.home },
          ]}
          sx={{ mb: 3 }}
        />

        <ErrorBoundary>
          {/* Main Dashboard Content */}
          <Grid container spacing={3}>
            {/* Metrics Cards - Real Queue Statistics */}
            <Grid item xs={12}>
              <ArtHarvestingMetricsCards stats={stats} loading={statsLoading} error={statsError} />
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Iconify icon="solar:add-circle-bold" />}
                      onClick={() => router.push(paths.dashboard.harvesting.queue)}
                    >
                      Add to Queue
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<ViewIcon />}
                      onClick={() =>
                        router.push(`${paths.dashboard.harvesting.queue}?status=REVIEWING`)
                      }
                    >
                      Review Queue
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Iconify icon="solar:upload-bold" />}
                      onClick={() =>
                        router.push(`${paths.dashboard.harvesting.queue}?status=APPROVED`)
                      }
                    >
                      Publish Approved
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Iconify icon="solar:refresh-bold" />}
                      onClick={handleRefresh}
                    >
                      Refresh Data
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </ErrorBoundary>
      </Container>
    </DashboardContent>
  );
}

/**
 * Main ArtHarvestingDashboardView component
 * @returns {JSX.Element} The art harvesting dashboard view
 */
export function ArtHarvestingDashboardView() {
  return <ArtHarvestingDashboardContent />;
}
