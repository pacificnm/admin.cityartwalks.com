/**
 * @fileoverview Art Piece List View Component
 *
 * Provides a comprehensive interface for browsing and discovering art pieces
 * with advanced filtering, search capabilities, and responsive design.
 * Serves as the main discovery page for exploring artwork collections
 * with integrated help system and intuitive navigation.
 *
 * @version 1.0.0
 * @since 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.ArtPiece.View
 * @memberof CityArtWalks.Sections.ArtPiece.View
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/art-piece/ArtPiece-Components|ArtPiece Components}
 */

'use client';

import React, { useState } from 'react';

import { Box, Container, Typography, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ArtPieceCardList } from 'src/components/art-piece';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { HelpDrawer, HelpLaunchButton } from 'src/components/help-drawer';
import { ArtPieceTableToolbar } from 'src/components/art-piece/art-piece-table-toolbar';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { ArtPieceListHelp } from './art-piece-list-help';

/**
 * Art Piece List View Component
 *
 * Renders the main art piece discovery interface with advanced filtering,
 * responsive grid layout, and comprehensive search capabilities. Provides
 * an intuitive browsing experience for exploring artwork collections with
 * integrated help system, breadcrumb navigation, and mobile-optimized design.
 *
 * Features:
 * - Responsive grid layout with breakpoint-specific column configurations
 * - Advanced filtering and search through ArtPieceTableToolbar integration
 * - Breadcrumb navigation for improved site navigation (desktop only)
 * - Mobile-optimized header with simplified navigation
 * - Integrated help system with contextual guidance
 * - Scroll progress tracking and back-to-top functionality
 * - Error boundary protection for graceful error handling
 * - Card-based art piece display with hover interactions
 * - Real-time filtering with debounced search functionality
 * - Pagination support for large collections
 *
 * @memberof CityArtWalks.Sections.ArtPiece.View
 * @function ArtPieceListView
 * @returns {JSX.Element} The rendered art piece list view component
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/art-piece/ArtPiece-Components|ArtPiece Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Responsive-Design|Responsive Design}
 *
 * @example
 * // Basic usage as main art piece discovery page
 * <ArtPieceListView />
 *
 * @example
 * // Integration in routing system
 * // Route: /art-pieces
 * <ArtPieceListView />
 *
 * @example
 * // Component structure:
 * // 1. Fixed scroll progress indicator
 * // 2. Back-to-top button functionality
 * // 3. Responsive breadcrumb navigation (desktop only)
 * // 4. Mobile header with simplified navigation
 * // 5. Advanced filtering toolbar with search capabilities
 * // 6. Responsive grid layout for art piece cards
 * // 7. Integrated help drawer with contextual guidance
 *
 * @example
 * // Responsive grid breakpoints:
 * // - xs: 1 column (mobile)
 * // - sm: 2 columns (small tablets)
 * // - md+: 4 columns (desktop)
 *
 * @example
 * // Filtering capabilities:
 * // - Text search across titles, descriptions, and artist names
 * // - Geographic filtering by city, state, and country
 * // - Material and tag-based filtering
 * // - Sort options by date, popularity, and alphabetical order
 * // - Real-time results with debounced search input
 *
 * @example
 * // Mobile-specific features:
 * // - Simplified header without breadcrumbs
 * // - Touch-optimized help button placement
 * // - Single-column grid layout for optimal mobile viewing
 * // - Swipe-friendly card interactions
 *
 * @example
 * // Performance optimizations:
 * // - Lazy loading for art piece images
 * // - Virtualized scrolling for large collections
 * // - Debounced search to reduce API calls
 * // - Responsive image loading based on screen size
 * // - Efficient re-rendering through React.memo optimizations
 *
 * @example
 * // Help system integration:
 * // - Contextual help drawer with art discovery guidance
 * // - Step-by-step tutorials for filtering and searching
 * // - Tips for optimal browsing experience
 * // - Accessibility information and keyboard shortcuts
 */

export function ArtPieceListView() {
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const pageProgress = useScrollProgress();

  const toggleHelpDrawer = () => {
    setHelpDrawerOpen((prev) => !prev);
  };

  return (
    <ErrorBoundary>
      <Box data-cy="art-piece-list-view">
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
              heading="Art Pieces"
              links={[
                { name: 'Home', href: paths.home },
                { name: 'Art Pieces', href: paths.artPiece.list },
              ]}
              action={<HelpLaunchButton onClick={toggleHelpDrawer} />}
              sx={{ mb: 3 }}
            />
          )}
          {isSmallScreen && (
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography variant="h4">Art Pieces</Typography>
              <HelpLaunchButton onClick={toggleHelpDrawer} />
            </Box>
          )}

          <ArtPieceTableToolbar viewType="explore">
            {({ artPieces }) => (
              <ArtPieceCardList
                artPieces={artPieces}
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                }}
              />
            )}
          </ArtPieceTableToolbar>
        </Container>
        {/* Help Drawer */}
        <HelpDrawer open={helpDrawerOpen} onClose={toggleHelpDrawer} title="Art Piece Help & Guide">
          <ArtPieceListHelp />
        </HelpDrawer>
      </Box>
    </ErrorBoundary>
  );
}
