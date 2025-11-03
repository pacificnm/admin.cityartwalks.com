/**
 * Artist Detail View - Comprehensive Artist Profile and Portfolio Interface
 *
 * This  {
    value: 'reviews',
    label: `Reviews${reviewCount > 0 ? ` (${reviewCount})`: ''}`,
    icon: <Iconify icon="solar:chat-round-dots-bold-duotone" width={24} />,
  },
];

/**
 * Default tabs configuration for static exports component provides a detailed interface for viewing individual artist
 * profiles, portfolios, and related content within the City Art Walks platform.
 * It features tabbed navigation between artist information, art collection, and
 * reviews, with responsive design, edit capabilities for authorized users, and
 * comprehensive data management including view count tracking, error handling,
 * and performance optimization through skeleton loading and incremental data updates.
 *
 * @fileoverview Artist detail view component with profile, portfolio, and review management
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Sections.Artist.View
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Model|Artist Model Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/review/Review-System|Review System}
 */

'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog } from 'src/lib/debug';
import { useGetArtistBySlug, useIncrementArtistViewCount } from 'src/actions/artist/hooks';

import { Iconify } from 'src/components/iconify';
import { HelpDrawer } from 'src/components/help-drawer';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ArtistIcon, ArtPieceIcon } from 'src/components/icons';
import { ArtistReviews } from 'src/components/artist/artist-reviews';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import {
  ArtistProfile,
  ArtistTabMenu,
  ArtistEditDialog,
  ArtistProfileCover,
  ArtistArtPieceCardList,
} from 'src/components/artist';

import { useAuthContext } from 'src/auth/hooks';

import { ArtistNotFoundView } from './artist-not-found-view';
import { ArtistDetailSkeleton } from '../artist-detail-skeleton';

// ----------------------------------------------------------------------

/**
 * Generate tabs with dynamic counts for artist detail view
 *
 * Creates the tab navigation structure with dynamic count badges for art pieces
 * and reviews. Provides visual feedback about the amount of content available
 * in each section and improves user navigation experience.
 *
 * @memberof CityArtWalks.Sections.Artist.View
 * @function getTabsWithCounts
 * @param {number} artPieceCount - Number of art pieces in the artist's portfolio
 * @param {number} reviewCount - Number of reviews for the artist
 * @returns {Array<Object>} Array of tab objects with labels, icons, and counts
 * @private
 * @example
 * // Returns tabs with count badges
 * const tabs = getTabsWithCounts(15, 8);
 * // Result: ['Artist', 'Art Collection (15)', 'Reviews (8)']
 */
const getTabsWithCounts = (artPieceCount, reviewCount) => [
  {
    value: 'artist',
    label: 'Artist',
    icon: <ArtistIcon width={24} />,
  },
  {
    value: 'art-collection',
    label: `Art Collection${artPieceCount > 0 ? ` (${artPieceCount})` : ''}`,
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'reviews',
    label: `Reviews${reviewCount > 0 ? ` (${reviewCount})` : ''}`,
    icon: <Iconify icon="solar:chat-round-dots-bold-duotone" width={24} />,
  },
];

/**
 * Default tabs configuration for static exports
 *
 * Provides a base tab structure with zero counts for static generation
 * and initial rendering before dynamic data is loaded.
 *
 * @memberof CityArtWalks.Sections.Artist.View
 * @type {Array<Object>}
 * @static
 */
export const TABS = getTabsWithCounts(0, 0);

/**
 * Artist Detail View Component
 *
 * Renders a comprehensive artist detail interface with tabbed navigation,
 * profile information, art portfolio, and review system. Supports both
 * server-side initial data and client-side fresh data fetching for optimal
 * performance and up-to-date information. Includes edit capabilities for
 * authorized users, view count tracking, responsive design, and comprehensive
 * error handling with fallback views.
 *
 * @memberof CityArtWalks.Sections.Artist.View
 * @function ArtistDetailView
 * @param {Object} props - Component props
 * @param {string} props.slug - The unique identifier (slug) of the artist
 * @param {Object} [props.artist] - Initial artist data from server-side rendering
 * @returns {JSX.Element} The rendered artist detail view component
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Model|Artist Model Documentation}
 * @example
 * // Basic usage with slug only (client-side fetching)
 * <ArtistDetailView slug="vincent-van-gogh" />
 *
 * @example
 * // Usage with initial server-side data
 * <ArtistDetailView
 *   slug="pablo-picasso"
 *   artist={serverSideArtistData}
 * />
 *
 * @example
 * // Features provided:
 * // - Comprehensive artist profile with biography and contact information
 * // - Tabbed navigation between profile, art collection, and reviews
 * // - Responsive design with mobile-optimized layout
 * // - Edit capabilities for authorized users (admin/artist owners)
 * // - View count tracking with delayed increment to avoid bounce tracking
 * // - Fresh data fetching with fallback to initial server data
 * // - Skeleton loading states for improved perceived performance
 * // - Error handling with dedicated not-found view
 * // - Breadcrumb navigation for improved site navigation
 * // - Help documentation integration with contextual guidance
 * // - Scroll progress tracking for long content pages
 * // - Back-to-top functionality for improved user experience
 *
 * @example
 * // Tab navigation structure:
 * // 1. Artist - Profile, biography, contact information
 * // 2. Art Collection - Portfolio grid with artwork details
 * // 3. Reviews - User reviews and ratings for the artist
 *
 * @example
 * // Data loading strategy:
 * // 1. Display initial data immediately if provided (SSR)
 * // 2. Fetch fresh data in background for accuracy
 * // 3. Update UI when fresh data arrives
 * // 4. Show skeleton loader only when no initial data available
 * // 5. Handle errors gracefully with appropriate fallback views
 *
 * @example
 * // Responsive behavior:
 * // - Mobile: Simplified navigation, full-width layout
 * // - Tablet: Balanced layout with touch-optimized controls
 * // - Desktop: Full breadcrumb navigation, multi-column layout
 * // - All sizes: Accessible keyboard navigation and screen reader support
 *
 * @example
 * // View count tracking:
 * // - 2-second delay before incrementing to avoid bounce views
 * // - Only tracks for authenticated users to prevent spam
 * // - Cleanup timeout on component unmount to prevent memory leaks
 *
 * @example
 * // Error handling scenarios:
 * // - Artist not found: Shows dedicated not-found view with navigation
 * // - Network errors: Graceful fallback with retry options
 * // - Permission errors: Appropriate messaging for access restrictions
 * // - Loading errors: Skeleton states with error recovery
 */
export function ArtistDetailView({ slug, artist: initialArtist }) {
  debugLog('CityArtWalks.Sections.Artist.View.ArtistDetailView', { slug, artist: initialArtist });
  const { accessToken } = useAuthContext();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens
  const pageProgress = useScrollProgress();
  const [currentTab, setCurrentTab] = useState('artist');
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);

  // Use client-side fetching for fresh data
  const {
    artist: freshArtist,
    artistLoading,
    artistError,
    artistEmpty,
    mutate,
  } = useGetArtistBySlug(slug, accessToken);

  // Use fresh data if available, otherwise fall back to initial data
  const artist = freshArtist || initialArtist;

  // Show loading state when fetching fresh data and no initial data
  const isLoading = artistLoading && !initialArtist;

  // Edit dialog state for artist editing
  const editDialog = useBoolean();

  // Handle help drawer toggle
  const toggleHelpDrawer = () => {
    setHelpDrawerOpen((prev) => !prev);
  };

  const incrementArtistViewCount = useIncrementArtistViewCount();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (accessToken && artist?.artistId) {
        incrementArtistViewCount(artist.artistId, accessToken);
      }
    }, 2000); // avoid "instant bounce" views

    return () => clearTimeout(timeout);
  }, [artist?.artistId, accessToken, incrementArtistViewCount]);

  // Show skeleton while loading
  if (isLoading) {
    return <ArtistDetailSkeleton />;
  }

  // Show artist not found view if no artist data, error, or explicitly empty
  if (!artist || artistEmpty || (artistError && !initialArtist)) {
    return <ArtistNotFoundView slug={slug} />;
  }

  // Generate tabs with current counts
  const tabsWithCounts = getTabsWithCounts(
    artist?._count?.ArtPiece || 0,
    artist?._count?.Review || 0
  );

  return (
    <ErrorBoundary>
      <Box data-cy="artist-detail-view">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={false} sx={{ mb: 4 }}>
          {isSmallScreen && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" noWrap>
                {artist.name}
              </Typography>
              <IconButton
                color="primary"
                onClick={toggleHelpDrawer}
                aria-label="Help"
                data-cy="mobile-help-button"
                sx={{
                  bgcolor: 'primary.lighter',
                  '&:hover': { bgcolor: 'primary.light' },
                }}
              >
                <Iconify icon="solar:question-circle-bold" />
              </IconButton>
            </Box>
          )}
          {!isSmallScreen && (
            <CustomBreadcrumbs
              data-cy="breadcrumbs"
              heading={artist.name}
              links={[
                { name: 'Home', href: paths.home },
                { name: 'Artist', href: paths.art.artist.list },
                { name: artist.name, href: paths.art.artist.details(slug) },
              ]}
              action={
                <IconButton
                  color="primary"
                  onClick={toggleHelpDrawer}
                  aria-label="Help"
                  data-cy="desktop-help-button"
                  sx={{
                    bgcolor: 'primary.lighter',
                    '&:hover': { bgcolor: 'primary.light' },
                  }}
                >
                  <Iconify icon="solar:question-circle-bold" />
                </IconButton>
              }
              sx={{ mb: 3 }}
            />
          )}
          <Card sx={{ mb: 3, height: 290 }}>
            <ArtistProfileCover
              name={artist.name}
              imageUrl={artist.imageUrl}
              artistId={artist.artistId}
              createdBy={artist.createdBy}
              status={artist.status}
              onImageUpdate={() => mutate && mutate()}
            />
            <ArtistTabMenu
              tabs={tabsWithCounts}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
            />
          </Card>
          {currentTab === 'artist' && (
            <ArtistProfile
              artistId={artist.artistId}
              name={artist.name}
              slug={slug}
              biography={artist.biography}
              birthDate={artist.birthDate}
              deathDate={artist.deathDate}
              favoriteCount={artist.favoriteCount || 0}
              pieceCount={artist._count?.ArtPiece || 0}
              viewCount={artist.viewCount || 0}
              imageUrl={artist.imageUrl}
              website={artist.website}
              instagram={artist.instagram}
              facebook={artist.facebook}
              editDialog={editDialog}
              createdBy={artist.createdBy}
            />
          )}
          {currentTab === 'art-collection' && (
            <ArtistArtPieceCardList
              artistId={artist.artistId}
              createdBy={artist.createdBy}
              artistSlug={slug}
            />
          )}
          {currentTab === 'reviews' && (
            <ArtistReviews
              artistId={artist.artistId}
              name={artist.name}
              specialty={artist.specialty}
              createdBy={artist.createdBy}
            />
          )}
        </Container>

        <ArtistEditDialog
          currentArtist={artist}
          open={editDialog.value}
          onClose={editDialog.onFalse}
        />
      </Box>

      <HelpDrawer
        open={helpDrawerOpen}
        onClose={() => setHelpDrawerOpen(false)}
        title="Artist Detail Help"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Artist Detail View
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This page shows detailed information about the artist including their biography, art
            collection, and reviews.
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Navigation:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            • <strong>Artist</strong>: View artist profile and biography
            <br />• <strong>Art Collection</strong>: Browse all art pieces by this artist
            <br />• <strong>Reviews</strong>: Read reviews and ratings for this artist
          </Typography>
          <Typography variant="body2">
            Use the tabs to switch between different sections. On mobile devices, tap the dropdown
            menu at the bottom of the cover image.
          </Typography>
        </Box>
      </HelpDrawer>
    </ErrorBoundary>
  );
}
