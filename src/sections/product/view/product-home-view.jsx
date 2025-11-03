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
 * @description ProductHomeView component renders the home view for art piece materials.
 * It includes functionalities for pagination, search, and quick edit of art piece materials.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * return (
 *   <ProductHomeView />
 * )
 */
export function ProductHomeView() {
  const { userLoading, error: userError } = useAuthContext();
  const pageProgress = useScrollProgress();

  if (userLoading) return null; // change this to load a skelleton
  if (userError) return <ErrorView message="There was an error loading your user profile." />;

  return (
    <ErrorBoundary>
      <Box data-cy="products-home-view">
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
            heading="Dashboard - Products - Home"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Products', href: paths.dashboard.product.home },
            ]}
            sx={{ mb: 3 }}
          />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
