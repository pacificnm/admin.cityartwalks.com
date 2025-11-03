/**
 * @file publishing-preview-view.jsx
 * @description Publishing Preview View component for previewing content before publication
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
 * Publishing Preview View component
 */
function PublishingPreviewContent() {
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
          heading="Publishing Preview"
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Piece', href: paths.dashboard.artPiece.home },
            { name: 'Harvesting', href: paths.dashboard.artPiece.harvesting },
            { name: 'Publishing', href: paths.dashboard.artPiece.harvesting },
            { name: 'Preview', href: '#' },
          ]}
          action={
            <Button variant="contained" color="primary">
              Publish Now
            </Button>
          }
          sx={{ mb: 3 }}
        />

        <ErrorBoundary>
          <Card sx={{ p: 3 }}>
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <h3>Content Publishing Preview</h3>
              <p>TODO: PublishingPreview component</p>
              <p>- Final content review interface</p>
              <p>- SEO and metadata validation</p>
              <p>- Multi-device preview modes</p>
              <p>- Publication scheduling options</p>
              <p>- Content approval workflow</p>
            </Box>
          </Card>
        </ErrorBoundary>
      </Container>
    </DashboardContent>
  );
}

export function PublishingPreviewView() {
  return <PublishingPreviewContent />;
}
