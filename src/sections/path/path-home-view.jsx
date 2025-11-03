/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.Dashboard.Path.PathHomeView
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
 * @memberof CityArtWalks.Sections.Dashboard.Path.PathHomeView
 * @description PathHomeView component renders the path home view with a table of paths,
 * search filter, pagination, and quick edit functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return <PathHomeView />
 * @function
 * @name PathHomeView
 */
export function PathHomeView() {
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
            heading="Dashboard - Paths"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Paths', href: paths.dashboard.paths.home },
            ]}
            sx={{ mb: 3 }}
          />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
