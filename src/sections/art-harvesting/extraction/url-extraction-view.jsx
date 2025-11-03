/**
 * @file url-extraction-view.jsx
 * @description URL Extraction View component for extracting art pieces from URLs
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { View403 } from 'src/sections/error/403-view';

import { useAuthContext } from 'src/auth/hooks';

/**
 * URL Extraction View component
 */
function URLExtractionContent() {
  const { loading, authenticated } = useAuthContext();

  if (loading) return null;
  if (!authenticated) return <View403 />;

  return (
    <DashboardContent>
      <Container maxWidth={false} sx={{ mb: 4 }}>
        <CustomBreadcrumbs
          heading="URL Extraction"
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Piece', href: paths.dashboard.artPiece.home },
            { name: 'Harvesting', href: paths.dashboard.artPiece.harvesting },
            { name: 'Extract', href: '#' },
          ]}
          sx={{ mb: 3 }}
        />

        <Card sx={{ p: 3 }}>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <h3>URL Art Piece Extraction</h3>
            <p>TODO: ExtractionWizard component</p>
            <p>- URL input and validation</p>
            <p>- Extraction preview</p>
            <p>- AI processing status</p>
            <p>- Results review</p>
          </Box>
        </Card>
      </Container>
    </DashboardContent>
  );
}

export function URLExtractionView() {
  return <URLExtractionContent />;
}
