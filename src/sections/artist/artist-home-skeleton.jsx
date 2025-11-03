/**
 * @fileoverview Artist Home Skeleton Loading Component
 *
 * Provides a skeleton placeholder interface for the artist discovery page
 * during initial loading or data fetching states. Maintains layout consistency
 * with the actual ArtistHomeView component while showing loading placeholders.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @namespace CityArtWalks.Sections.Artist
 * @memberof CityArtWalks.Sections.Artist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/core-application/Loading-States|Loading States}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/core-application/Skeleton-Components|Skeleton Components}
 */

'use client';

import { useState } from 'react';

import { Box, Container, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ArtistCardList } from 'src/components/artist';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TableSearchFilter, TablePaginationCustom } from 'src/components/table';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * Artist Home Skeleton Loading Component
 *
 * Renders a skeleton placeholder interface that mirrors the structure and
 * layout of the ArtistHomeView component during loading states. Provides
 * visual feedback to users while artist data is being fetched, maintaining
 * consistent layout structure and interactive elements for improved perceived
 * performance and user experience.
 *
 * Features:
 * - Responsive grid layout matching the actual artist home view
 * - Interactive pagination controls with mock data for layout consistency
 * - Search filter placeholder maintaining visual hierarchy
 * - Breadcrumb navigation (hidden on mobile devices)
 * - Scroll progress tracking and back-to-top functionality
 * - Error boundary protection for graceful error handling
 * - Skeleton artist cards with proper spacing and responsive breakpoints
 *
 * @memberof CityArtWalks.Sections.Artist
 * @function ArtistHomeSkeleton
 * @returns {JSX.Element} The skeleton loading component for artist home view
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Home-View|Artist Home View}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Card-Components|Artist Card Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Responsive-Design|Responsive Design}
 *
 * @example
 * // Basic usage as loading state
 * {isLoading ? <ArtistHomeSkeleton />: <ArtistHomeView />}
 *
 * @example
 * // Integration with Suspense boundary
 * <Suspense fallback={<ArtistHomeSkeleton />}>
 *   <ArtistHomeView />
 * </Suspense>
 *
 * @example
 * // Responsive grid breakpoints:
 * // - xs: 1 column (mobile)
 * // - sm: 2 columns (small tablets)
 * // - md+: 4 columns (desktop)
 *
 * @example
 * // Component structure mirrors:
 * // 1. Scroll progress indicator (fixed position)
 * // 2. Back-to-top button functionality
 * // 3. Responsive breadcrumb navigation (desktop only)
 * // 4. Search filter placeholder
 * // 5. Artist card grid with skeleton data
 * // 6. Pagination controls with mock metadata
 *
 * @example
 * // Performance considerations:
 * // - Uses mock data to prevent unnecessary API calls
 * // - Maintains consistent layout preventing layout shift
 * // - Responsive breakpoints match actual component
 * // - Minimal re-renders through stable mock data
 */
export function ArtistHomeSkeleton() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12); // Not used in UI yet
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens
  const pageProgress = useScrollProgress();
  const paginationMeta = { total: 12, page: 1, rowsPerPage: 12 }; // Mock pagination meta
  const search = ''; // Mock search value
  const artists = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: ``,
    slug: ``,

    imageUrl: '', // Placeholder image
    _count: {
      favoriteBy: 0,
      pieces: 0,
    },
    viewCount: 0,
  })); // Mock artist data
  return (
    <ErrorBoundary>
      <Box data-cy="artist-home-skeleton">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={false} sx={{ mb: 4 }} data-cy="container">
          {!isSmallScreen && (
            <CustomBreadcrumbs
              data-cy="breadcrumbs"
              heading="Artists"
              links={[
                { name: 'Home', href: paths.home },
                { name: 'Art', href: paths.art.home },
                { name: 'Artists', href: paths.art.artist.list },
              ]}
              sx={{ mb: 3 }}
            />
          )}
          <TableSearchFilter value={search} placeholder="Search art pieces..." />
          <ArtistCardList
            artists={artists}
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <TablePaginationCustom
              count={paginationMeta.total}
              page={page - 1} // MUI TablePagination is 0-based
              rowsPerPage={rowsPerPage}
              onPageChange={(event, newPage) => setPage(newPage + 1)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(1);
              }}
              rowsPerPageOptions={[6, 12, 24, 48]}
            />
          </Box>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
