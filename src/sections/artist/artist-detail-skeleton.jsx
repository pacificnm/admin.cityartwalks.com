/**
 * @fileoverview Artist Detail Skeleton Loading Component
 *
 * Provides a skeleton placeholder interface for the artist detail page
 * during initial loading or data fetching states. Maintains the exact
 * layout structure of the ArtistDetailView component with skeleton
 * placeholders for all interactive elements and content areas.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @namespace CityArtWalks.Sections.Artist
 * @memberof CityArtWalks.Sections.Artist
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Loading-States|Loading States}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Skeleton-Components|Skeleton Components}
 */

'use client';

import { Tab, Box, Card, Tabs, Grid, Skeleton, Container, useMediaQuery } from '@mui/material';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ArtistIcon, ArtPieceIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * Tab Configuration for Artist Detail Skeleton
 *
 * Defines the static tab structure that mirrors the ArtistDetailView
 * component tabs during loading states. Provides consistent visual
 * hierarchy and layout structure while artist data is being fetched.
 *
 * @memberof CityArtWalks.Sections.Artist
 * @constant {Array<Object>} TABS
 * @static
 *
 * @example
 * // Tab structure:
 * // 1. Artist - Profile and biography information
 * // 2. Art Collection - Portfolio grid with artwork
 * // 3. Art Map - Geographic location of artworks
 */
const TABS = [
  {
    value: 'artist',
    label: 'Artist',
    icon: <ArtistIcon width={24} />,
  },
  {
    value: 'art-collection',
    label: 'Art Collection',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'art-map',
    label: 'Art Map',
    icon: <ArtPieceIcon width={24} />,
  },
];

/**
 * Artist Detail Skeleton Loading Component
 *
 * Renders a comprehensive skeleton placeholder interface that precisely
 * mirrors the structure and layout of the ArtistDetailView component
 * during loading states. Provides visual feedback and maintains layout
 * consistency while artist data is being fetched, ensuring smooth user
 * experience with no layout shifts during the loading-to-content transition.
 *
 * Features:
 * - Hero cover area with skeleton placeholder (290px height)
 * - Tabbed navigation with static tab structure and skeleton labels
 * - Responsive breadcrumb navigation (hidden on mobile devices)
 * - Grid layout with skeleton content cards matching detail view structure
 * - Scroll progress tracking and back-to-top functionality
 * - Error boundary protection for graceful error handling
 * - Responsive design matching breakpoints of actual detail view
 * - Material-UI skeleton components for consistent loading animations
 *
 * @memberof CityArtWalks.Sections.Artist
 * @function ArtistDetailSkeleton
 * @returns {JSX.Element} The skeleton loading component for artist detail view
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Detail-View|Artist Detail View}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Model|Artist Model Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Responsive-Design|Responsive Design}
 *
 * @example
 * // Basic usage as loading state
 * {isLoading ? <ArtistDetailSkeleton />: <ArtistDetailView slug={slug} />}
 *
 * @example
 * // Integration with Suspense boundary for server components
 * <Suspense fallback={<ArtistDetailSkeleton />}>
 *   <ArtistDetailView slug={artistSlug} />
 * </Suspense>
 *
 * @example
 * // Component structure mirrors:
 * // 1. Fixed scroll progress indicator
 * // 2. Back-to-top button functionality
 * // 3. Responsive breadcrumb navigation (desktop only)
 * // 4. Hero cover area with 290px height
 * // 5. Tabbed navigation with skeleton labels
 * // 6. Grid layout with skeleton content cards
 *
 * @example
 * // Layout specifications:
 * // - Hero card: 290px height with 200px cover area
 * // - Tabs: Positioned absolutely at bottom of hero card
 * // - Grid: 3 columns with skeleton cards (150px height)
 * // - Responsive: Breadcrumbs hidden on small screens
 *
 * @example
 * // Performance benefits:
 * // - Prevents layout shift during content loading
 * // - Provides immediate visual feedback to users
 * // - Uses optimized Material-UI skeleton animations
 * // - Maintains consistent spacing and proportions
 * // - Responsive breakpoints match actual component
 */
export function ArtistDetailSkeleton() {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens
  const pageProgress = useScrollProgress();

  return (
    <ErrorBoundary>
      <Box data-cy="artist-detail-skeleton">
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
              heading={<Skeleton width="30%" />}
              links={[
                { name: 'Home', href: '#' },
                { name: 'Art', href: '#' },
                { name: 'Artist', href: '#' },
              ]}
              sx={{ mb: 3 }}
            />
          )}
          <Card sx={{ mb: 3, height: 290 }}>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 1 }} />
            <Tabs
              value={TABS[0].value}
              sx={{
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                [`& .MuiTabs-flexContainer`]: {
                  pr: { md: 3 },
                  justifyContent: { sm: 'center', md: 'flex-end' },
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  icon={tab.icon}
                  label={<Skeleton width="50px" />}
                />
              ))}
            </Tabs>
          </Card>

          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid isize={4} key={index}>
                <Skeleton variant="rectangular" height={150} sx={{ mb: 1 }} />
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
