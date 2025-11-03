/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.Dashboard.Path.PathCreateView
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
 * @memberof CityArtWalks.Sections.Dashboard.Path.PathCreateView
 * @description PathCreateView component renders the path create view with a form for creating new paths.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return <PathCreateView />
 * @function
 * @name PathCreateView
 */
export function PathCreateView() {
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
            heading="Dashboard - Path - Create"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Paths', href: paths.dashboard.paths.home },
              { name: 'Create', href: paths.dashboard.paths.create },
            ]}
            sx={{ mb: 3 }}
          />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
