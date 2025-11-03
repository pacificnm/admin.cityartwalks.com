/**
 * @file artist-create-view.jsx
 * @description Dashboard artist creation view component with form and breadcrumb navigation
 * @namespace CityArtWalks.Sections.Dashboard.Artist.ArtistCreateView
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

'use client';

import { Box, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

/**
 * ArtistCreateView component renders the artist creation view with form interface
 * and breadcrumb navigation for creating new artists.
 *
 * @function ArtistCreateView
 * @memberof CityArtWalks.Sections.Dashboard.Artist.ArtistCreateView
 * @returns {JSX.Element} The rendered artist creation view component
 *
 * @example
 * // Used in dashboard pages to display artist creation interface
 * <ArtistCreateView />
 *
 * @description Features:
 * - Artist creation form interface
 * - Error handling with ErrorBoundary
 * - Scroll progress indicator
 * - Breadcrumb navigation with create context
 * - Authentication state management
 *
 * @todo Add artist creation form component
 */
export function ArtistCreateView() {
  const { userLoading, error: userError } = useAuthContext();
  const pageProgress = useScrollProgress();

  if (userLoading) return null; // change this to load a skelleton
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
            heading="Dashboard - Artist - Create"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Artists', href: paths.dashboard.artist.home },
              { name: 'Create', href: paths.dashboard.artist.create },
            ]}
            sx={{ mb: 3 }}
          />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
