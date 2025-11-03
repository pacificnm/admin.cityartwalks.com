/**
 * @todo docblock
 */

import React from 'react';

import { Box, Skeleton, Typography } from '@mui/material';

/**
 * @description LoadingSkeleton displays placeholder skeletons while the ArtHomeView content is loading.
 *
 * @component
 * @returns {JSX.Element} Rendered loading skeleton component.
 */
export function ArtHomeViewSkeleton() {
  return (
    <Box data-cy="art-home-view-loading" sx={{ padding: 4 }}>
      {/* Breadcrumbs Skeleton */}
      <Box data-cy="breadcrumbs-skeleton" sx={{ mb: 3 }}>
        <Skeleton variant="text" width="30%" height={40} />
        <Skeleton variant="text" width="20%" height={30} />
      </Box>

      {/* Hero Section Skeleton */}
      <Box data-cy="hero-skeleton" sx={{ mb: 8 }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Box>

      {/* Carousel Skeleton */}
      <Box data-cy="carousel-skeleton" sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          <Skeleton variant="text" width="20%" />
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={200}
              height={150}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Box>

      {/* Pricing Section Skeleton */}
      <Box data-cy="pricing-skeleton">
        <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  );
}
