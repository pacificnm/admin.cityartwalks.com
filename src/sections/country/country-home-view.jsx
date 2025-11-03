'use client';

import { Box, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CountryTable } from 'src/components/country/country-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

import { CountrySkeletonView } from './country-skeleton-view';
/**
 * @description CountryHomeView component renders the home view for countries.
 * It includes functionalities for pagination, search, and quick edit of countries.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return (
 *   <CountryHomeView />
 * )
 */
export function CountryHomeView() {
  const { userLoading, error: userError } = useAuthContext();
  const pageProgress = useScrollProgress();

  if (userLoading) return <CountrySkeletonView />;
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="country-home-view">
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
            heading="Dashboard - Locations - Country"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Locations', href: paths.dashboard.location.home },
              { name: 'Country', href: paths.dashboard.location.country.home },
            ]}
            sx={{ mb: 3 }}
          />
          {/* Add CountryTable below breadcrumbs */}
          <CountryTable />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
