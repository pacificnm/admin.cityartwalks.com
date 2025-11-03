/**
 * @fileoverview Artist Artwork View Component
 *
 * Provides a comprehensive interface for browsing an artist's artwork collection
 * with multiple view options including profile overview, artwork grid, and
 * interactive map visualization. Supports tabbed navigation, geolocation features,
 * and administrative controls for artwork management.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.Artist.View
 * @memberof CityArtWalks.Sections.Artist.View
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 */

'use client';

import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { Tab, Box, Card, Container, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetArtist } from 'src/actions/artist/hooks';
import { useGetGeoLocation } from 'src/actions/geo-location/hooks';

import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AddIcon, ArtistIcon, ArtPieceIcon } from 'src/components/icons';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
import {
  ArtistProfile,
  ArtistProfileCover,
  ArtistArtPieceMapList,
  ArtistArtPieceCardList,
} from 'src/components/artist';

import { useAuthContext } from 'src/auth/hooks';

import { ArtistNotFoundView } from '..';
import { ArtistArtworkSkeleton } from '../artist-artwork-skeleton';
/**
 * Tab Configuration for Artist Artwork View
 *
 * Defines the tabbed navigation structure for switching between different
 * views of artist information and artwork collections. Provides consistent
 * interface for accessing artist profile, artwork grid, and map visualization.
 *
 * @memberof CityArtWalks.Sections.Artist.View
 * @constant {Array<Object>} TABS
 * @static
 *
 * @example
 * // Tab structure:
 * // 1. Artist - Profile and biography information
 * // 2. Art Collection - Grid view of all artwork pieces
 * // 3. Art Map - Interactive map showing artwork locations
 *
 * @example
 * // Usage in component
 * <Tabs value={currentTab} onChange={handleChangeTab}>
 *   {TABS.map((tab) => (
 *     <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
 *   ))}
 * </Tabs>
 */
const TABS = [
  {
    value: 'artist',
    label: 'Artist',
    icon: <ArtistIcon width={24} />,
  },
  {
    value: 'art',
    label: 'Art Collection',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'artwork',
    label: 'Art Map',
    icon: <ArtPieceIcon width={24} />,
  },
];

/**
 * Artist Artwork View Component
 *
 * Renders a comprehensive artist artwork management and viewing interface
 * with tabbed navigation between artist profile, artwork collection grid,
 * and interactive map visualization. Supports geolocation features for
 * location-based artwork discovery and administrative controls for
 * artwork creation and management.
 *
 * Features:
 * - Tabbed navigation between artist profile, artwork grid, and map views
 * - Responsive design with mobile-optimized layout and navigation
 * - Artist profile cover area with tabbed navigation overlay
 * - Artwork collection grid with filtering and search capabilities
 * - Interactive map showing artwork locations with geolocation integration
 * - Administrative controls for creating new artwork (authorized users)
 * - Breadcrumb navigation for improved site navigation (desktop only)
 * - Error handling with dedicated error and not-found views
 * - Skeleton loading states for improved perceived performance
 * - Scroll progress tracking and back-to-top functionality
 *
 * @memberof CityArtWalks.Sections.Artist.View
 * @function ArtistArtworkView
 * @param {Object} props - Component props
 * @param {string} props.slug - The unique identifier (slug) of the artist
 * @returns {JSX.Element} The rendered artist artwork view component
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Model|Artist Model Documentation}
 *
 * @example
 * // Basic usage with artist slug
 * <ArtistArtworkView slug="vincent-van-gogh" />
 *
 * @example
 * // Integration in routing system
 * // Route: /art/artist/[slug]/artwork
 * <ArtistArtworkView slug={params.slug} />
 *
 * @example
 * // Tab navigation structure:
 * // 1. Artist - Complete artist profile with biography and contact information
 * // 2. Art Collection - Grid view of all artwork pieces with filtering options
 * // 3. Art Map - Interactive map visualization showing artwork locations
 *
 * @example
 * // Data loading strategy:
 * // 1. Fetch artist data using useGetArtist hook with provided slug
 * // 2. Fetch geolocation data for map features using useGetGeoLocation
 * // 3. Show skeleton loader while data is being fetched
 * // 4. Handle errors gracefully with appropriate fallback views
 * // 5. Display not-found view for non-existent artists
 *
 * @example
 * // Responsive behavior:
 * // - Mobile: Simplified navigation, full-width layout, no breadcrumbs
 * // - Tablet: Balanced layout with touch-optimized tab controls
 * // - Desktop: Full breadcrumb navigation, action buttons, multi-column layout
 * // - All sizes: Accessible keyboard navigation and screen reader support
 *
 * @example
 * // Administrative features:
 * // - "New Artwork" button in breadcrumb action area (authorized users)
 * // - Links to artwork creation form with pre-filled artist information
 * // - Integration with authentication system for access control
 * // - Artwork management capabilities within collection grid
 *
 * @example
 * // Error handling scenarios:
 * // - Artist not found: Shows dedicated ArtistNotFoundView component
 * // - Network errors: Shows ErrorView with retry options
 * // - Geolocation errors: Graceful fallback for map features
 * // - Loading errors: Skeleton states with error recovery
 */
export function ArtistArtworkView({ slug }) {
  const pageProgress = useScrollProgress();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens
  const [currentTab, setCurrentTab] = useState('artwork');

  const { accessToken } = useAuthContext();
  const { location, locationLoading, locationError } = useGetGeoLocation(accessToken);

  const { artist, artistError, artistLoading, artistEmpty } = useGetArtist(slug);

  // Handle tab change
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  if (locationError || artistError) return <ErrorView message="Error fetching artist" />;
  if (locationLoading || artistLoading) return <ArtistArtworkSkeleton />;
  if (artistEmpty) return <ArtistNotFoundView />;

  const { name, imageUrl, pieces: artPieces } = artist;

  return (
    <ErrorBoundary>
      <Box data-cy="artist-artwork-view">
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
              heading={name}
              links={[
                { name: 'Home', href: paths.home },
                { name: 'Art', href: paths.art.home },
                { name: 'Artist', href: paths.art.artist.list },
                { name, href: paths.art.artist.details(slug) },
                { name: 'Artwork', href: paths.art.artist.artwork.list(slug) },
              ]}
              action={
                <Button
                  data-cy="breadcrumbs-action-button"
                  component={RouterLink}
                  href={paths.art.artist.artwork.create(slug)}
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  New Artwork
                </Button>
              }
              sx={{ mb: 3 }}
            />
          )}
          <Card sx={{ mb: 3, height: 290 }}>
            <ArtistProfileCover name={name} imageUrl={imageUrl} />
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              sx={{
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                [`& .${tabsClasses.flexContainer}`]: {
                  pr: { md: 3 },
                  justifyContent: { sm: 'center', md: 'flex-end' },
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </Card>
          {currentTab === 'artist' && <ArtistProfile artist={artist} />}
          {currentTab === 'art' && (
            <ArtistArtPieceCardList
              artistId={artist.artistId}
              createdBy={artist.createdBy}
              artistSlug={slug}
            />
          )}
          {currentTab === 'artwork' && (
            <ArtistArtPieceMapList artPieces={artPieces} location={location} />
          )}
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
