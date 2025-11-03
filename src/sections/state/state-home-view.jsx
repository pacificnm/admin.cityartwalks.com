'use client';

import { Box, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ErrorView } from 'src/components/error';
import { StateTable } from 'src/components/state/state-table';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Sections.Dashboard.State
 * @function StateHomeView
 * @description StateHomeView component renders the home view for states.
 * It includes functionalities for pagination, search, and quick edit of states.
 * Integrates the StateTable component for full CRUD operations on State entities.
 *
 * Features:
 * - State table with inline editing
 * - Search and filtering capabilities
 * - Responsive design with scroll progress
 * - Error handling and loading states
 * - Breadcrumb navigation
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return (
 *   <StateHomeView />
 * )
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 */
export function StateHomeView() {
  const { user: currentUser, userLoading, error: userError } = useAuthContext();
  const pageProgress = useScrollProgress();

  if (userLoading) return null; // change this to load a skeleton
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="state-home-view">
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
            heading="Dashboard - Locations - State"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Locations', href: paths.dashboard.location.home },
              { name: 'State', href: paths.dashboard.location.state.home },
            ]}
            sx={{ mb: 3 }}
          />

          {/* State Table */}
          <StateTable
            filters={{ active: 'all' }}
            accessToken={currentUser?.accessToken || ''}
            displayFilters={{
              search: true,
              active: true,
              countryId: true,
            }}
          />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
