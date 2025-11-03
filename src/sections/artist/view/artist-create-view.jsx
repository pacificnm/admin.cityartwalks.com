/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.Artist.View.ArtistCreateView
 */

'use client';

import { Container, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ArtistForm } from 'src/forms/artist';
import { useGetGeoLocation } from 'src/actions/geo-location/hooks';

import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

export function ArtistCreateView() {
  const pageProgress = useScrollProgress();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens

  const { user, loading: userIsLoading, accessToken } = useAuthContext();
  const { location, locationLoading, locationError } = useGetGeoLocation(accessToken);

  if (locationLoading || userIsLoading) return null;
  if (locationError) return <ErrorView message="There was an error loading the artist form" />;

  return (
    <>
      <ScrollProgress
        data-cy="scroll-progress"
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />
      <BackToTop data-cy="back-to-top" />
      <Container maxWidth={false} sx={{ mb: 4 }}>
        {!isSmallScreen && (
          <CustomBreadcrumbs
            data-cy="breadcrumbs"
            heading="Create Artist"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Artist', href: paths.art.artist.list },
              { name: 'Create', href: paths.art.artist.create },
            ]}
            sx={{ mb: 3 }}
          />
        )}

        <ErrorBoundary>
          <RoleBasedGuard
            allowedRoles={['MEMBER', 'ADMIN']}
            displayMode="content"
            protecting="ArtistCreateView"
          >
            <ArtistForm data-cy="artist-create-form" location={location} user={user} />
          </RoleBasedGuard>
        </ErrorBoundary>
      </Container>
    </>
  );
}
