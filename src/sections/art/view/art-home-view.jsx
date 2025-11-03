/**
 * @TODO Docblock
 */

'use client';

import { Box, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetGeoLocation } from 'src/actions/geo-location/hooks';

import { ErrorView } from 'src/components/error';
import { ArtPieceCarousel } from 'src/components/art-piece';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { ComponentHero } from 'src/sections/example';
import { PricingView } from 'src/sections/pricing/view';

import { useAuthContext } from 'src/auth/hooks';

import { ArtHomeViewSkeleton } from '../art-home-view-skeleton';

export function ArtHomeView() {
  const { accessToken } = useAuthContext();
  const { location, locationLoading, locationError } = useGetGeoLocation(accessToken);
  const pageProgress = useScrollProgress();

  if (locationLoading) return <ArtHomeViewSkeleton />;
  if (locationError) return <ErrorView message="Failed to load location data" />;

  return (
    <ErrorBoundary>
      <Box data-cy="art-home-view">
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
            heading="Art"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Art', href: paths.explore.home },
            ]}
            sx={{ mb: 3 }}
          />
          <ComponentHero sx={{ mb: 8 }} />
          <ArtPieceCarousel location={location} />
          <PricingView />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
