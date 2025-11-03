/**
 * @version 1.0.0
 * @description Skeleton loading view for the PathHomeView component.
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.Path.Views.PathHomeSkeletonView
 */

'use client';

import { Box, Skeleton, Container } from '@mui/material';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * @memberof CityArtWalks.Sections.Path.Views.PathHomeSkeletonView
 * @function PathHomeSkeletonView
 * @description Skeleton view for PathHomeView to show loading placeholders.
 *
 * @component
 * @returns {JSX.Element} The rendered PathHomeSkeletonView component.
 */
export function PathHomeSkeletonView() {
  const pageProgress = useScrollProgress();

  return (
    <ErrorBoundary>
      <Box data-cy="path-home-skeleton-view">
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
            ]}
            sx={{ mb: 3 }}
          />
          {/* Search Filter Skeleton */}
          <Skeleton variant="rectangular" height={56} sx={{ mb: 3, borderRadius: 1 }} />

          {/* Path Cards Grid Skeleton */}
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            }}
            sx={{ mb: 3 }}
          >
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
            ))}
          </Box>

          {/* Pagination Skeleton */}
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
            <Skeleton variant="text" width={150} height={32} />
            <Box display="flex" gap={1}>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} variant="circular" width={32} height={32} />
              ))}
            </Box>
            <Skeleton variant="text" width={100} height={32} />
          </Box>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
