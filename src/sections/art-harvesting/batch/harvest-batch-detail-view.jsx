/**
 * @file harvest-batch-detail-view.jsx
 * @description Harvest Batch Detail View component for viewing batch details and progress
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
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
 * Harvest Batch Detail View component
 */
function HarvestBatchDetailContent() {
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
          heading="Batch Details"
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Piece', href: paths.dashboard.artPiece.home },
            { name: 'Harvesting', href: paths.dashboard.artPiece.harvesting },
            { name: 'Batches', href: paths.dashboard.artPiece.harvesting },
            { name: 'Details', href: '#' },
          ]}
          action={
            <Button variant="contained" color="primary">
              Process Batch
            </Button>
          }
          sx={{ mb: 3 }}
        />

        <ErrorBoundary>
          <Card sx={{ p: 3 }}>
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <h3>Harvest Batch Details</h3>
              <p>TODO: HarvestBatchDetails component</p>
              <p>- Batch metadata and configuration</p>
              <p>- Processing progress and timeline</p>
              <p>- Item-level status breakdown</p>
              <p>- Error logs and retry options</p>
              <p>- Performance metrics</p>
            </Box>
          </Card>
        </ErrorBoundary>
      </Container>
    </DashboardContent>
  );
}

export function HarvestBatchDetailView() {
  return <HarvestBatchDetailContent />;
}
