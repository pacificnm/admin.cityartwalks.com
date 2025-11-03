/**
 * @file harvest-batch-analytics-view.jsx
 * @description Harvest Batch Analytics View component for batch performance metrics
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { View403 } from 'src/sections/error/403-view';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Harvest Batch Analytics View component
 */
function HarvestBatchAnalyticsContent() {
  const { loading, authenticated } = useAuthContext();
  const pageProgress = useScrollProgress();

  if (loading) return null;
  if (!authenticated) return <View403 />;

  return (
    <DashboardContent>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />
      <BackToTop />
      <Container maxWidth={false} sx={{ mb: 4 }}>
        <CustomBreadcrumbs
          heading="Batch Analytics"
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Piece', href: paths.dashboard.artPiece.home },
            { name: 'Harvesting', href: paths.dashboard.artPiece.harvesting },
            { name: 'Batches', href: paths.dashboard.artPiece.harvesting },
            { name: 'Analytics', href: '#' },
          ]}
          sx={{ mb: 3 }}
        />

        <ErrorBoundary>
          <Card sx={{ p: 3 }}>
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <h3>Batch Performance Analytics</h3>
              <p>TODO: BatchAnalyticsDashboard component</p>
              <p>- Batch completion rates</p>
              <p>- Processing speed metrics</p>
              <p>- Resource utilization analysis</p>
              <p>- Error pattern identification</p>
              <p>- Optimization recommendations</p>
            </Box>
          </Card>
        </ErrorBoundary>
      </Container>
    </DashboardContent>
  );
}

export function HarvestBatchAnalyticsView() {
  return <HarvestBatchAnalyticsContent />;
}
