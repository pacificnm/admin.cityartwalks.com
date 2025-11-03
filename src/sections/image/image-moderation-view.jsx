/**
 * @namespace CityArtWalks.Sections.Dashboard.Image.ImageModerationView
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Sections.Dashboard.Image
 * @description Image moderation dashboard view for admin users to review and moderate flagged images.
 */

'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { ErrorView } from 'src/components/error';
import { ImageTable } from 'src/components/image';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Sections.Dashboard.Image.ImageModerationView
 * @function ImageModerationView
 * @description Main view component for the image moderation dashboard.
 * Displays flagged images in a table with moderation actions and bulk operations.
 * @returns {JSX.Element} The rendered ImageModerationView component
 */
export function ImageModerationView() {
  const { userLoading, error: userError, accessToken } = useAuthContext();
  const pageProgress = useScrollProgress();

  // Loading and error states
  if (userLoading) return <Box sx={{ p: 3 }}>Loading...</Box>;
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="image-moderation-view">
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
            heading="Image Moderation"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Images', href: paths.dashboard.image.home },
              { name: 'Moderation' },
            ]}
            sx={{ mb: 3 }}
          />

          <ImageTable
            data-cy="image-moderation-table"
            accessToken={accessToken}
            filters={{ status: 'FLAGGED' }}
            tabOptions={[{ value: 'FLAGGED', label: 'Flagged for Review' }]}
            displayFilters={{
              search: true,
              featured: true,
              fileSize: true,
              createdBy: true,
              artistId: true,
              artPieceId: true,
              pathId: true,
            }}
          />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
