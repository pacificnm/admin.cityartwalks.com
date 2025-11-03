/**
 * @namespace CityArtWalks.Sections.Dashboard.Image.ImageHomeViewSkeleton
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Sections.Dashboard.Image
 * @description Loading skeleton for the ImageHomeView component.
 */

'use client';

import { Box, Skeleton, Container } from '@mui/material';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * @memberof CityArtWalks.Sections.Dashboard.Image.ImageHomeViewSkeleton
 * @function ImageHomeViewSkeleton
 * @description Skeleton loading component for the image home view.
 * @returns {JSX.Element} The rendered skeleton component
 */
export function ImageHomeViewSkeleton() {
  const pageProgress = useScrollProgress();

  return (
    <ErrorBoundary>
      <Box data-cy="image-home-view-skeleton">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={false} sx={{ mb: 4 }}>
          {/* Breadcrumbs skeleton */}
          <Skeleton variant="text" height={40} sx={{ mb: 3, width: '40%' }} />

          {/* Table skeleton */}
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
