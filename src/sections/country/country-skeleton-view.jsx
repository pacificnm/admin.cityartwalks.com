'use client';

import { Box, Stack, Skeleton, Container } from '@mui/material';

import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * @description CountrySkeletonView provides a loading skeleton for the CountryHomeView.
 * It visually matches the layout and structure of CountryHomeView, including breadcrumbs,
 * search/filter bar, table rows, and pagination controls.
 *
 * @component
 * @returns {JSX.Element} The skeleton view for the country dashboard.
 *
 * @example
 * return (
 *   <CountrySkeletonView />
 * )
 */
export function CountrySkeletonView() {
  return (
    <Box data-cy="country-home-skeleton">
      <ScrollProgress
        data-cy="scroll-progress"
        variant="linear"
        progress={0}
        sx={{ position: 'fixed' }}
      />
      <BackToTop data-cy="back-to-top" />
      <Container maxWidth={false} sx={{ mb: 4 }} data-cy="container">
        {/* Breadcrumbs Skeleton */}
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="30%" height={28} sx={{ mt: 1 }} />
        </Box>

        {/* Search/Toolbar Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Box>

        {/* Table Head Skeleton */}
        <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 1 }} />

        {/* Table Rows Skeleton */}
        <Stack spacing={1}>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" width="100%" height={40} />
          ))}
        </Stack>

        {/* Pagination Skeleton */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Skeleton variant="rectangular" width={200} height={40} />
        </Box>
      </Container>
    </Box>
  );
}
