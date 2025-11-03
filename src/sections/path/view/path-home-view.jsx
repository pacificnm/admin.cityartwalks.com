/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.Path.Home
 */

'use client';

import { Box, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { PathCardList, PathTableToolbar } from 'src/components/path';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Sections.Path.Home
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

  if (userLoading) return null; // change this to load a skeleton
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="path-home-view">
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
            heading="Walking Paths"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Paths', href: paths.path },
            ]}
            sx={{ mb: 3 }}
          />
          <PathTableToolbar viewType="explore">
            {({ paths: walkingPaths }) => (
              <PathCardList
                paths={walkingPaths}
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)',
                }}
              />
            )}
          </PathTableToolbar>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
