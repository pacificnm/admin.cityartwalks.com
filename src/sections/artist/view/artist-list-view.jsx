/**
 * Artist List View - Artist Discovery and Browsing Interface
 *
 * This view component provides a comprehensive interface for discovering and browsing
 * artists within the City Art Walks platform. It features responsive design with
 * adaptive layouts for different screen sizes, advanced filtering and search
 * capabilities, help documentation integration, and optimized performance for
 * large artist collections. The interface supports grid-based artist card display,
 * breadcrumb navigation, scroll progress tracking, and accessible user interactions.
 *
 * @fileoverview Artist list view component with responsive design and discovery features
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Sections.Artist.View
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Responsive-Design|Responsive Design}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Model|Artist Model Documentation}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Filtering|Artist Filtering}
 */

'use client';

import React, { useState } from 'react';

import { Box, Container, Typography, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ArtistCardList } from 'src/components/artist';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { HelpDrawer, HelpLaunchButton } from 'src/components/help-drawer';
import { ArtistTableToolbar } from 'src/components/artist/artist-table-toolbar';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { ArtistListHelp } from './artist-list-help';

// ----------------------------------------------------------------------

/**
 * Artist List View Component
 *
 * Renders the main artist discovery interface with responsive design, filtering
 * capabilities, and comprehensive user experience features. Provides adaptive
 * layouts for different screen sizes, integrated help system, scroll progress
 * tracking, and optimized performance for browsing large artist collections.
 * Supports advanced search, filtering, and grid-based display with accessibility
 * features and comprehensive error handling.
 *
 * @memberof CityArtWalks.Sections.Artist.View
 * @function ArtistListView
 * @returns {JSX.Element} The rendered artist list view component
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/artist/Artist-Components|Artist Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Responsive-Design|Responsive Design}
 * @example
 * // Basic usage in artist browsing page
 * <ArtistListView />
 *
 * @example
 * // Features provided:
 * // - Responsive grid layout with adaptive columns based on screen size
 * // - Advanced filtering and search capabilities through ArtistTableToolbar
 * // - Breadcrumb navigation for easy site navigation (desktop only)
 * // - Integrated help system with contextual documentation
 * // - Scroll progress indicator for long artist lists
 * // - Back to top functionality for improved navigation
 * // - Error boundary protection for robust error handling
 * // - Accessibility-compliant design with proper ARIA labels
 *
 * @example
 * // Responsive behavior:
 * // - Mobile (xs): Single column grid, simplified header without breadcrumbs
 * // - Tablet (sm): Two column grid with compact navigation
 * // - Desktop (md+): Four column grid with full breadcrumb navigation
 * // - Help drawer accessible across all screen sizes
 *
 * @example
 * // Component structure:
 * // - ErrorBoundary wrapper for error protection
 * // - ScrollProgress indicator for navigation feedback
 * // - BackToTop button for user convenience
 * // - Responsive header with breadcrumbs (desktop) or simple title (mobile)
 * // - ArtistTableToolbar with filtering and search capabilities
 * // - ArtistCardList with responsive grid layout
 * // - HelpDrawer with contextual artist discovery documentation
 *
 * @example
 * // User interaction flow:
 * // 1. Users land on the artist discovery page
 * // 2. Browse artists using responsive grid layout
 * // 3. Use filtering and search tools in the toolbar
 * // 4. Access help documentation via help button
 * // 5. Navigate using breadcrumbs (desktop) or back navigation
 * // 6. Track scroll progress through long artist lists
 * // 7. Use back-to-top for quick navigation to page top
 *
 * @example
 * // Accessibility features:
 * // - Proper heading hierarchy for screen readers
 * // - Keyboard navigation support for all interactive elements
 * // - ARIA labels and roles for enhanced accessibility
 * // - High contrast design for visual accessibility
 * // - Touch-friendly sizing for mobile interactions
 * // - Screen reader compatible help documentation
 */
export function ArtistListView() {
  /**
   * Help drawer state management
   *
   * Controls the visibility of the help drawer containing artist discovery
   * documentation and user guidance.
   *
   * @type {boolean}
   * @private
   */
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);

  /**
   * Responsive design breakpoint detection
   *
   * Determines if the current screen size is small (mobile) to adapt
   * the layout and hide certain elements like breadcrumbs.
   *
   * @type {boolean}
   * @private
   */
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  /**
   * Scroll progress tracking
   *
   * Monitors the user's scroll position for the progress indicator
   * displayed at the top of the page.
   *
   * @type {Object}
   * @private
   */
  const pageProgress = useScrollProgress();

  /**
   * Toggle help drawer visibility
   *
   * Opens or closes the help drawer containing artist discovery documentation
   * and user guidance for navigating the artist interface.
   *
   * @memberof CityArtWalks.Sections.Artist.View
   * @function toggleHelpDrawer
   * @private
   */
  const toggleHelpDrawer = () => {
    setHelpDrawerOpen((prev) => !prev);
  };

  return (
    <ErrorBoundary>
      <Box data-cy="artist-list-view">
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
                { name: 'Artists', href: paths.art.artist.list },
              ]}
              action={<HelpLaunchButton onClick={toggleHelpDrawer} />}
              sx={{ mb: 3 }}
            />
          )}
          {isSmallScreen && (
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography variant="h4">Artists</Typography>
              <HelpLaunchButton onClick={toggleHelpDrawer} />
            </Box>
          )}
          <ArtistTableToolbar viewType="explore">
            {({ artists }) => (
              <ArtistCardList
                artists={artists}
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                }}
              />
            )}
          </ArtistTableToolbar>
        </Container>

        {/* Help Drawer */}
        <HelpDrawer open={helpDrawerOpen} onClose={toggleHelpDrawer} title="Artists Help & Guide">
          <ArtistListHelp />
        </HelpDrawer>
      </Box>
    </ErrorBoundary>
  );
}
