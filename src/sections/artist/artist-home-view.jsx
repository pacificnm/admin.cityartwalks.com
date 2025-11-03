/**
 * @file artist-home-view.jsx
 * @description Dashboard artist home view component with card list, search, and pagination
 * @namespace CityArtWalks.Sections.Dashboard.Artist.ArtistHomeView
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
import { ArtistCardList, ArtistTableToolbar } from 'src/components/artist';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

/**
 * ArtistHomeView component renders the artist dashboard home view with card list,
 * search filter, pagination, and quick edit functionality.
 *
 * @function ArtistHomeView
 * @memberof CityArtWalks.Sections.Dashboard.Artist.ArtistHomeView
 * @returns {JSX.Element} The rendered artist dashboard home view component
 *
 * @example
 * // Used in dashboard pages to display artist management interface
 * <ArtistHomeView />
 *
 * @description Features:
 * - Artist card grid with responsive layout
 * - Search and filtering via ArtistTableToolbar
 * - Error handling with ErrorBoundary
 * - Scroll progress indicator
 * - Breadcrumb navigation
 */
export function ArtistHomeView() {
  const { userLoading, error: userError } = useAuthContext();
  const pageProgress = useScrollProgress();

  if (userLoading) return null; // change this to load a skeleton
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
            heading="Dashboard - Artist"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Artists', href: paths.dashboard.artist.home },
            ]}
            sx={{ mb: 3 }}
          />
          <ArtistTableToolbar viewType="admin" initialFilters={{}}>
            {({ artists, loading: artistsLoading, error, paginationMeta }) =>
              artistsLoading ? (
                <div>Loading artists...</div>
              ) : error ? (
                <div>Error loading artists: {error.message}</div>
              ) : (
                <ArtistCardList
                  artists={artists}
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                    xl: 'repeat(5, 1fr)',
                  }}
                />
              )
            }
          </ArtistTableToolbar>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
