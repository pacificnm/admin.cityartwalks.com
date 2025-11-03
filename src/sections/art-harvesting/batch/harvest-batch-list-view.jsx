/**
 * @file harvest-batch-list-view.jsx
 * @description Harvest Batch List View component for managing harvest batches
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
 * Harvest Batch List View component
 */
function HarvestBatchListContent() {
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
          heading="Harvest Batches"
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Piece', href: paths.dashboard.artPiece.home },
            { name: 'Harvesting', href: paths.dashboard.artPiece.harvesting },
            { name: 'Batches', href: '#' },
          ]}
          action={<Button variant="contained">New Batch</Button>}
          sx={{ mb: 3 }}
        />

        <ErrorBoundary>
          <Card sx={{ p: 3 }}>
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <h3>Harvest Batch List</h3>
              <p>TODO: HarvestBatchTable component</p>
              <p>- Batch status and progress</p>
              <p>- Created/updated dates</p>
              <p>- Item counts and success rates</p>
              <p>- Action buttons (start, pause, view details)</p>
            </Box>
          </Card>
        </ErrorBoundary>
      </Container>
    </DashboardContent>
  );
}

export function HarvestBatchListView() {
  return <HarvestBatchListContent />;
}
