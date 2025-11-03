/**
 * @file art-piece-view.jsx
 * @description Profile Art Piece View component for displaying admin pieces
 * @author Generated
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { MapViewportProvider } from 'src/hooks/use-map-viewport';

import { DashboardContent } from 'src/layouts/dashboard';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ArtPieceMap, ArtPieceCardList } from 'src/components/art-piece';
import { ArtPieceTableToolbar } from 'src/components/art-piece/art-piece-table-toolbar';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { View403 } from 'src/sections/error/403-view';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Dashboard Art Piece View component
 * Displays a card list of art pieces for admin users with filtering,
 * pagination, and search capabilities.
 *
 * @returns {JSX.Element} The dashboard art piece view component
 */

/**
 * Internal content component that handles the art piece loading and display logic.
 * Separated to allow MapViewportProvider wrapper.
 */
function ArtPieceViewContent() {
  // fetch the user context
  const { loading, authenticated } = useAuthContext();

  // scroll progress
  const pageProgress = useScrollProgress();

  // Responsive design hook
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  // Mobile view toggle state for map/list switching
  const [showMap, setShowMap] = useState(true);

  // Hover state for map-card synchronization
  const [hoveredArtPiece, setHoveredArtPiece] = useState(null);

  // Card hover handlers
  const handleCardHover = () => {
    setHoveredArtPiece(null);
  };

  const handleCardLeave = () => {
    setHoveredArtPiece(null);
  };

  // Mobile view toggle handler
  const toggleView = () => {
    setShowMap((prev) => !prev);
  };

  // Conditional rendering based on auth and loading state
  if (loading) return null;
  if (!authenticated) return <View403 />;

  return (
    <DashboardContent>
      <ScrollProgress
        data-cy="scroll-progress"
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />
      <BackToTop data-cy="back-to-top" />
      <Container maxWidth={false} sx={{ mb: 4 }}>
        <CustomBreadcrumbs
          data-cy="breadcrumbs"
          heading="Dashboard - Art Pieces"
          links={[
            { name: 'Home', href: paths.home },
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Art Pieces', href: paths.dashboard.artPiece.home },
          ]}
          sx={{ mb: 3 }}
        />
        <ErrorBoundary>
          {/* Unified toolbar with status tabs and content */}
          <ArtPieceTableToolbar
            viewType="admin"
            initialFilters={{
              status: 'all',
            }}
          >
            {({ artPieces, loading: artPiecesLoading, paginationMeta }) => (
              <>
                {/* Art Piece Card List and Map */}
                {isSmallScreen ? (
                  // Mobile: Single column with toggle between map and list
                  <Card sx={{ p: 3 }}>
                    {artPiecesLoading ? (
                      <div>Loading art pieces...</div>
                    ) : showMap ? (
                      <ArtPieceMap
                        artPieces={artPieces}
                        hoveredArtPiece={hoveredArtPiece}
                        onHover={setHoveredArtPiece}
                        onLeave={() => setHoveredArtPiece(null)}
                      />
                    ) : (
                      <Box
                        gap={3}
                        display="grid"
                        gridTemplateColumns={{
                          xs: 'repeat(1, 1fr)',
                          sm: 'repeat(2, 1fr)',
                        }}
                      >
                        <ArtPieceCardList
                          artPieces={artPieces}
                          onHover={handleCardHover}
                          onLeave={handleCardLeave}
                        />
                      </Box>
                    )}
                  </Card>
                ) : (
                  // Desktop: Split view with cards and map
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    {/* Left side: Art Piece Cards - 4 columns equivalent */}
                    <Card sx={{ flex: '0 0 33.33%', p: 3, minHeight: '70vh' }}>
                      {artPiecesLoading ? (
                        <div>Loading art pieces...</div>
                      ) : (
                        <Box
                          gap={3}
                          display="grid"
                          gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                          }}
                          sx={{
                            height: 'calc(70vh - 48px)', // Subtract padding (24px * 2)
                            overflowY: 'auto',
                          }}
                        >
                          <ArtPieceCardList
                            artPieces={artPieces}
                            onHover={handleCardHover}
                            onLeave={handleCardLeave}
                          />
                        </Box>
                      )}
                    </Card>

                    {/* Right side: Map - 8 columns equivalent */}
                    <Card sx={{ flex: '0 0 66.67%', height: '70vh' }}>
                      <ArtPieceMap
                        artPieces={artPieces}
                        hoveredArtPiece={hoveredArtPiece}
                        onHover={setHoveredArtPiece}
                        onLeave={() => setHoveredArtPiece(null)}
                      />
                    </Card>
                  </Box>
                )}
              </>
            )}
          </ArtPieceTableToolbar>
        </ErrorBoundary>
      </Container>

      {/* Floating Action Button for mobile view toggle */}
      {isSmallScreen && (
        <Fab
          data-cy="toggle-view"
          color="primary"
          onClick={toggleView}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          {showMap ? 'List' : 'Map'}
        </Fab>
      )}
    </DashboardContent>
  );
}

/**
 * Main ArtPieceHomeView component wrapped with MapViewportProvider
 * @returns {JSX.Element} The dashboard art piece view with map viewport provider
 */
export function ArtPieceHomeView() {
  return (
    <MapViewportProvider>
      <ArtPieceViewContent />
    </MapViewportProvider>
  );
}
