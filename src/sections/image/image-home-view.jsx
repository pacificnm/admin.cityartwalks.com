/**
 * @namespace CityArtWalks.Sections.Dashboard.Image.ImageHomeView
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Sections.Dashboard.Image
 * @description Dashboard view for managing all images in the system with search, pagination, and quick edit functionality.
 */

'use client';

import { Box, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ErrorView } from 'src/components/error';
import { ImageTable } from 'src/components/image';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

import { ImageHomeViewSkeleton } from './image-home-view-skeleton';

/**
 * @memberof CityArtWalks.Sections.Dashboard.Image.ImageHomeView
 * @function ImageHomeView
 * @description Main dashboard view component for image management.
 * Uses the ImageTable component to display all images with search, filtering, and CRUD operations.
 *
 * @component
 * @returns {JSX.Element} The rendered ImageHomeView component
 *
 * @example
 * // Usage in dashboard routes
 * <ImageHomeView />
 */
export function ImageHomeView() {
  const { userLoading, error: userError, accessToken } = useAuthContext();
  const pageProgress = useScrollProgress();

  /**
   * @memberof CityArtWalks.Sections.Dashboard.Image.ImageHomeView
   * @function handleChangePage
   * @description Handles pagination page changes.
   * @private
   * @param {object} _ - Unused event parameter
   * @param {number} newPage - The new page number to navigate to
   */
  // Loading and error states
  if (userLoading) return <ImageHomeViewSkeleton />;
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="image-home-view">
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
            heading="Dashboard - Images"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Images', href: paths.dashboard.image.home },
            ]}
            sx={{ mb: 3 }}
          />

          <ImageTable
            data-cy="image-table"
            accessToken={accessToken}
            filters={{ status: 'all' }}
            tabOptions={[
              { value: 'all', label: 'All' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'ARCHIVED', label: 'Archived' },
              { value: 'REVIEW', label: 'Review' },
              { value: 'FLAGGED', label: 'Flagged' },
            ]}
            displayFilters={{
              search: true,
              featured: true,
              fileSize: true,
              createdBy: true,
              status: true,
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
