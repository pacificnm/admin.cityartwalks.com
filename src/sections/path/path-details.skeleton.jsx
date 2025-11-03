/**
 * @version 1.0.0
 * @description Skeleton loading view for the PathDetailsView component.
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.Path.Views.PathDetailsSkeletonView
 */

'use client';

import { Fab, Box, Grid, Skeleton, Container, useMediaQuery } from '@mui/material';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * @memberof CityArtWalks.Sections.Path.Views.PathDetailsSkeletonView
 * @function PathDetailsSkeletonView
 * @description Skeleton view for PathDetailsView to show loading placeholders.
 *
 * @component
 * @returns {JSX.Element} The rendered PathDetailsSkeletonView component.
 */
export function PathDetailsSkeletonView() {
  const pageProgress = useScrollProgress();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens

  return (
    <ErrorBoundary>
      <Box data-cy="path-details-skeleton-view">
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
            heading="Loading..."
            links={[
              { name: 'Home', href: '#' },
              { name: 'Path', href: '#' },
              { name: 'Loading...', href: '#' },
            ]}
            sx={{ mb: 3 }}
          />
          <Grid container spacing={3}>
            {isSmallScreen ? (
              <Grid size={12}>
                {/* Map/List toggle view for small screens */}
                <Skeleton variant="rectangular" height={400} sx={{ mb: 3, borderRadius: 1 }} />
              </Grid>
            ) : (
              <>
                <Grid size={3}>
                  <Box
                    sx={{
                      maxHeight: '99vh',
                      overflowY: 'auto',
                    }}
                  >
                    <Box
                      gap={3}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                      }}
                    >
                      {/* Path Card Skeleton */}
                      <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />

                      {/* Art Piece Cards List Skeleton */}
                      {[...Array(3)].map((_, index) => (
                        <Skeleton
                          key={index}
                          variant="rectangular"
                          height={150}
                          sx={{ borderRadius: 2 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
                <Grid size={9}>
                  {/* Map Skeleton */}
                  <Skeleton variant="rectangular" height={600} sx={{ borderRadius: 2 }} />
                </Grid>
              </>
            )}
          </Grid>
        </Container>
        {isSmallScreen && (
          <Fab
            data-cy="toggle-view"
            color="primary"
            disabled
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            Loading
          </Fab>
        )}
      </Box>
    </ErrorBoundary>
  );
}
