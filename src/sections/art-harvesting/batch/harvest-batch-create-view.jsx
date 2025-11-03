/**
 * @file harvest-batch-create-view.jsx
 * @description Harvest Batch Create View component for creating new harvest batches
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
 * Harvest Batch Create View component
 */
function HarvestBatchCreateContent() {
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
          heading="Create Batch"
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Piece', href: paths.dashboard.artPiece.home },
            { name: 'Harvesting', href: paths.dashboard.artPiece.harvesting },
            { name: 'Batches', href: paths.dashboard.artPiece.harvesting },
            { name: 'Create', href: '#' },
          ]}
          sx={{ mb: 3 }}
        />

        <ErrorBoundary>
          <Card sx={{ p: 3 }}>
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <h3>Create Harvest Batch</h3>
              <p>TODO: HarvestBatchCreateForm component</p>
              <p>- Source selection and configuration</p>
              <p>- Batch size and processing options</p>
              <p>- Schedule and priority settings</p>
              <p>- Quality thresholds</p>
              <p>- Notification preferences</p>
            </Box>
          </Card>
        </ErrorBoundary>
      </Container>
    </DashboardContent>
  );
}

export function HarvestBatchCreateView() {
  return <HarvestBatchCreateContent />;
}
