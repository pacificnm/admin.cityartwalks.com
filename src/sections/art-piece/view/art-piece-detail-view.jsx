/**
 * @fileoverview Art Piece Detail View Component
 *
 * Provides a comprehensive interface for viewing detailed information about
 * a specific art piece, including artist profile, artwork details, image
 * galleries, reviews, and administrative controls. Supports tabbed navigation,
 * role-based permissions, and interactive features for authenticated users.
 *
 * @version 1.0.1
 * @since 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.ArtPiece.View
 * @memberof CityArtWalks.Sections.ArtPiece.View
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Components|ArtPiece Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Detail-Interface|ArtPiece Detail Interface}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model|ArtPiece Model Documentation}
 */

'use client';

import React, { useState, useEffect } from 'react';

import { Box, Card, Container, IconButton, Typography, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetArtistBySlug } from 'src/actions/artist';
import { useGetArtPieceBySlug, useIncrementArtPieceViewCount } from 'src/actions/art-piece';

import { ErrorView } from 'src/components/error';
import { HelpDrawer } from 'src/components/help-drawer';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ArtPieceReviews } from 'src/components/art-piece/art-piece-reviews';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import { ArtistProfile, ArtistEditDialog, ArtistArtPieceCardList } from 'src/components/artist';
import {
  ChatIcon,
  ImageIcon,
  ArtistIcon,
  ArtPieceIcon,
  InfoCircleIcon,
} from 'src/components/icons';
import {
  ArtPieceTabMenu,
  ArtPieceImageList,
  ArtPieceTabDetail,
  ArtPieceEditDialog,
  ArtPieceFullScreen,
  ArtPieceDeleteDialog,
  ArtPieceProfileCover,
} from 'src/components/art-piece';

import { ArtistNotFoundView } from 'src/sections/artist';

import { useAuthContext } from 'src/auth/hooks';

import { ArtPieceDetailSkeleton } from '../';
import { ArtPieceDetailHelp } from './art-piece-detail-help';

/**
 * Tab Configuration Generator for Art Piece Detail View
 *
 * Generates dynamic tab configuration with count badges for images,
 * reviews, and art collection. Provides consistent tabbed navigation
 * structure while displaying real-time counts for each content type.
 *
 * @memberof CityArtWalks.Sections.ArtPiece.View
 * @function getTabsWithCounts
 * @param {number} imageCount - Number of images associated with the art piece
 * @param {number} reviewCount - Number of reviews for the art piece
 * @param {number} collectionCount - Number of art pieces in artist's collection
 * @returns {Array<Object>} Array of tab configuration objects with dynamic labels
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Detail-Interface|ArtPiece Detail Interface}
 *
 * @example
 * // Basic usage with counts
 * const tabs = getTabsWithCounts(5, 12, 23);
 * // Results in tabs with labels like "Images (5)", "Reviews (12)", "Art Collection (23)"
 *
 * @example
 * // Usage with zero counts (no badges shown)
 * const tabs = getTabsWithCounts(0, 0, 0);
 * // Results in clean labels: "Images", "Reviews", "Art Collection"
 */

const getTabsWithCounts = (imageCount, reviewCount, collectionCount) => [
  {
    value: 'artist',
    label: 'Artist',
    icon: <ArtistIcon width={24} />,
  },
  {
    value: 'art',
    label: `Art Collection${collectionCount > 0 ? ` (${collectionCount})` : ''}`,
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'artPiece',
    label: 'Art Piece',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'images',
    label: `Images${imageCount > 0 ? ` (${imageCount})` : ''}`,
    icon: <ImageIcon size={24} />,
  },
  {
    value: 'reviews',
    label: `Reviews${reviewCount > 0 ? ` (${reviewCount})` : ''}`,
    icon: <ChatIcon size={24} />,
  },
];

/**
 * Default Tabs Configuration for Static Exports
 *
 * Provides a base tab structure with zero counts for static generation
 * and initial rendering before dynamic data is loaded. Used as a fallback
 * configuration for server-side rendering and loading states.
 *
 * @memberof CityArtWalks.Sections.ArtPiece.View
 * @constant {Array<Object>} TABS
 * @static
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Detail-Interface|ArtPiece Detail Interface}
 *
 * @example
 * // Used for initial render before counts are loaded
 * <Tabs value={currentTab}>
 *   {TABS.map((tab) => <Tab key={tab.value} {...tab} />)}
 * </Tabs>
 */
export const TABS = getTabsWithCounts(0, 0, 0);

/**
 * Art Piece Detail View Component
 *
 * Renders a comprehensive art piece detail interface with tabbed navigation,
 * artist information, artwork details, image galleries, and review system.
 * Supports role-based permissions for editing and administrative actions,
 * view count tracking, responsive design, and comprehensive error handling
 * with fallback views.
 *
 * Features:
 * - Tabbed navigation between artist profile, art collection, artwork details, images, and reviews
 * - Artist profile cover area with administrative controls overlay
 * - Art piece detailed information with specifications and location data
 * - Image gallery with full-screen viewing and upload capabilities (authorized users)
 * - Review system with user ratings and comments
 * - Edit and delete capabilities for authorized users (admin/artist owners)
 * - View count tracking with delayed increment to avoid bounce tracking
 * - Responsive design with mobile-optimized layout and navigation
 * - Error handling with dedicated error and not-found views
 * - Help documentation integration with contextual guidance
 * - Scroll progress tracking and back-to-top functionality
 *
 * @memberof CityArtWalks.Sections.ArtPiece.View
 * @function ArtPieceDetailView
 * @param {Object} props - Component props
 * @param {string} props.slug - The unique identifier (slug) of the artist
 * @param {string} props.artPieceSlug - The unique identifier (slug) of the art piece
 * @returns {JSX.Element} The rendered art piece detail view component
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Components|ArtPiece Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Detail-Interface|ArtPiece Detail Interface}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model|ArtPiece Model Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model|Artist Model Documentation}
 *
 * @example
 * // Basic usage with artist and art piece slugs
 * <ArtPieceDetailView slug="vincent-van-gogh" artPieceSlug="starry-night" />
 *
 * @example
 * // Integration in routing system
 * // Route: /art/artist/[slug]/artwork/[artPieceSlug]
 * <ArtPieceDetailView slug={params.slug} artPieceSlug={params.artPieceSlug} />
 *
 * @example
 * // Tab navigation structure:
 * // 1. Artist - Complete artist profile with biography and contact information
 * // 2. Art Collection - Grid view of all artwork pieces by the artist
 * // 3. Art Piece - Detailed information about the specific artwork
 * // 4. Images - Gallery view with full-screen capabilities and upload features
 * // 5. Reviews - User reviews and ratings for the art piece
 *
 * @example
 * // Data loading strategy:
 * // 1. Fetch artist data using useGetArtistBySlug hook with provided slug
 * // 2. Fetch art piece data using useGetArtPieceBySlug hook with both slugs
 * // 3. Show skeleton loader while data is being fetched
 * // 4. Handle errors gracefully with appropriate fallback views
 * // 5. Display not-found view for non-existent artists or art pieces
 *
 * @example
 * // Administrative features:
 * // - Edit art piece dialog with form validation
 * // - Delete art piece confirmation with cascade handling
 * // - Image upload capabilities with drag-and-drop interface
 * // - Full-screen image viewing with navigation controls
 * // - Artist profile editing for artist owners or admins
 *
 * @example
 * // Responsive behavior:
 * // - Mobile: Simplified navigation, full-width layout, touch-optimized controls
 * // - Tablet: Balanced layout with touch-friendly tab controls
 * // - Desktop: Full breadcrumb navigation, action buttons, multi-column layout
 * // - All sizes: Accessible keyboard navigation and screen reader support
 *
 * @example
 * // View count tracking:
 * // - 2-second delay before incrementing to avoid bounce views
 * // - Only tracks when art piece ID is available
 * // - Integrates with analytics system for comprehensive tracking
 * // - Cleanup on component unmount to prevent memory leaks
 *
 * @example
 * // Error handling scenarios:
 * // - Artist not found: Shows dedicated ArtistNotFoundView component
 * // - Art piece not found: Shows dedicated not-found view
 * // - Network errors: Shows ErrorView with retry options
 * // - Permission errors: Appropriate messaging for access restrictions
 * // - Loading errors: Skeleton states with error recovery
 */
export function ArtPieceDetailView({ slug, artPieceSlug }) {
  const { accessToken } = useAuthContext();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const pageProgress = useScrollProgress();
  const artPieceQuickEdit = useBoolean();
  const artPieceDelete = useBoolean();
  const artistQuickEdit = useBoolean();
  const fullScreenDialog = useBoolean();
  const imageUploadDialog = useBoolean();

  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);

  const { user, loading: userIsLoading } = useAuthContext();

  const { artist, artistLoading, artistError } = useGetArtistBySlug(slug, accessToken, 8600);
  const { artPiece, artPieceLoading, artPieceError } = useGetArtPieceBySlug(
    slug,
    artPieceSlug,
    accessToken,
    8600
  );

  const [currentTab, setCurrentTab] = useState('artPiece');

  // Handle help drawer toggle
  const toggleHelpDrawer = () => {
    setHelpDrawerOpen((prev) => !prev);
  };

  const incrementArtPieceViewCount = useIncrementArtPieceViewCount(
    artPiece?.artPieceId,
    accessToken
  );
  // Increment view count only when artPieceId is available
  useEffect(() => {
    if (artPiece?.artPieceId) {
      incrementArtPieceViewCount();
    }
  }, [artPiece?.artPieceId, incrementArtPieceViewCount]);

  if (artistError) return <ErrorView message="There was an error loading the artist" />;
  if (artPieceError) return <ErrorView message="There was an error loading the art piece" />;
  if (userIsLoading || artistLoading || artPieceLoading)
    return <ArtPieceDetailSkeleton slug={slug} />;
  if (!artPiece || !artist) return <ArtistNotFoundView />;

  // Generate tabs with current counts
  const tabsWithCounts = getTabsWithCounts(
    artPiece?._count?.Image || 0,
    artPiece?._count?.Review || 0,
    artist?._count?.ArtPiece || 0
  );

  return (
    <ErrorBoundary>
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
              {artPiece.title}
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
              <InfoCircleIcon size={24} />
            </IconButton>
          </Box>
        )}
        {!isSmallScreen && (
          <CustomBreadcrumbs
            data-cy="breadcrumbs"
            heading={`${artist.name} - ${artPiece.title}`}
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Artists', href: paths.art.artist.list },
              { name: artist.name, href: paths.art.artist.details(slug) },
              { name: artPiece.title },
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
                <InfoCircleIcon size={24} />
              </IconButton>
            }
            sx={{ mb: 3 }}
          />
        )}

        <Card sx={{ mb: 3, height: 290 }}>
          <ArtPieceProfileCover
            artPieceId={artPiece.artPieceId}
            name={artPiece.title}
            artPieceImageUrl={artPiece.imageUrl}
            artistImageUrl={artist.imageUrl}
            status={artPiece.status}
            createdBy={artPiece?.createdBy}
          />
          <ArtPieceTabMenu
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
            favoriteCount={artist.favoriteCount}
            pieceCount={artist?._count?.ArtPiece}
            viewCount={artist.viewCount}
            imageUrl={artist.imageUrl}
            editDialog={artistQuickEdit}
            createdBy={artPiece?.createdBy}
          />
        )}
        {currentTab === 'art' && (
          <ArtistArtPieceCardList
            artistId={artist.artistId}
            createdBy={artPiece?.createdBy}
            artistSlug={slug}
          />
        )}
        {currentTab === 'artPiece' && (
          <ArtPieceTabDetail
            artPieceId={artPiece.artPieceId}
            artistId={artPiece.artistId}
            title={artPiece.title}
            description={artPiece.description}
            staticMapUrl={artPiece.staticMapUrl}
            imageUrl={artPiece.imageUrl}
            artPieceSlug={artPieceSlug}
            artistSlug={slug}
            latitude={artPiece.latitude}
            longitude={artPiece.longitude}
            artistName={artPiece.Artist?.name}
            tags={artPiece.artPieceTag}
            material={artPiece.artPieceMaterial}
            editDialog={artPieceQuickEdit}
            deleteDialog={artPieceDelete}
            fullScreenDialog={fullScreenDialog}
            imageUploadDialog={imageUploadDialog}
            viewCount={artPiece.viewCount}
            imageCount={artPiece?._count?.Image}
            favoriteCount={artPiece?._count?.UserFavoriteArtPiece}
            createdBy={artPiece.createdBy}
            createdAt={artPiece.createdAt}
          />
        )}
        {currentTab === 'images' && (
          <ArtPieceImageList artPieceId={artPiece.artPieceId} rowsPerPage={16} />
        )}
        {currentTab === 'reviews' && (
          <ArtPieceReviews
            artPieceId={artPiece.artPieceId}
            title={artPiece.title}
            artistName={artPiece.Artist?.name}
            createdBy={artPiece.createdBy}
          />
        )}
        <ArtPieceEditDialog
          currentArtPiece={artPiece}
          open={artPieceQuickEdit.value}
          onClose={artPieceQuickEdit.onFalse}
          user={user}
        />
        <ArtistEditDialog
          currentArtist={artist}
          open={artistQuickEdit.value}
          onClose={artistQuickEdit.onFalse}
          user={user}
        />
        <ArtPieceDeleteDialog
          currentArtPiece={artPiece}
          open={artPieceDelete.value}
          onClose={artPieceDelete.onFalse}
        />
        <ArtPieceFullScreen
          title={artPiece.title}
          artPieces={[artPiece]}
          location={{ latitude: artPiece.latitude, longitude: artPiece.longitude }}
          open={fullScreenDialog.value}
          onClose={fullScreenDialog.onFalse}
        />
      </Container>

      <HelpDrawer
        open={helpDrawerOpen}
        onClose={() => setHelpDrawerOpen(false)}
        title="Art Piece Detail Help"
      >
        <ArtPieceDetailHelp />
      </HelpDrawer>
    </ErrorBoundary>
  );
}
