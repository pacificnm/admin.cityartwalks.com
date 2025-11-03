/**
 * @namespace CityArtWalks.Components.Artist.ArtistArtPieceCardList
 * @version 1.0.0
 * @author jaimie garner
 */

import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { Box, Fab, useMediaQuery } from '@mui/material';

import { MapViewportProvider } from 'src/hooks/use-map-viewport';

import { useGetPaginatedArtPieces } from 'src/actions/art-piece/hooks';

import ErrorBoundary from 'src/components/error/error-boundary';
import { ArtPieceMap, ArtPieceEmpty, ArtPieceCardList } from 'src/components/art-piece';

import { useAuthContext } from 'src/auth/hooks';
/**
 * @memberof CityArtWalks.Components.Artist.ArtistArtPieceCardList
 * @function ArtistArtPieceCardList
 * @description Renders a list of art pieces in both card list and map views.
 * Provides responsive layout with toggle between views on small screens.
 * Uses location from the first art piece for map centering.

 * @param {Object} props - The component props.
 * @param {string|number} props.artistId - The ID of the artist to load art pieces for.
 * @param {string|number} props.createdBy - The user ID who created the artist (for owner check).
 * @param {string} [props.artistSlug] - The artist slug for creating new art pieces when showing empty state.
 * @param {Object} [props.other] - Additional props to pass to the outer `Box` component.
 * @returns {JSX.Element} The rendered ArtistArtPieceCardList component.
 */
export function ArtistArtPieceCardList({
  artistId,
  createdBy,
  artistSlug,
  // Destructure and ignore these props to prevent them from being passed to DOM
  hoveredArtPiece: externalHoveredArtPiece,
  onHover: externalOnHover,
  onLeave: externalOnLeave,
  ...other
}) {
  const [showMap, setShowMap] = useState(true);
  const [hoveredArtPiece, setHoveredArtPiece] = useState(null);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { user, accessToken } = useAuthContext();

  // Check if current user owns this artist
  // Note: createdBy is the database user ID (number), user.userId is the database ID (number)
  const isOwner = user && createdBy && Number(user.userId) === Number(createdBy);

  // Build filters - include all statuses if owner, only ACTIVE if not
  const filters = {
    artistId,
    ...(isOwner ? {} : { status: 'ACTIVE' }),
  };

  // Fetch art pieces using the hook with conditional filtering
  const {
    artPieces = [],
    artPiecesLoading,
    artPiecesError,
    artPiecesEmpty,
  } = useGetPaginatedArtPieces(
    filters,
    1,
    100, // Load up to 100 art pieces
    accessToken
  );

  const safeArtPieces = Array.isArray(artPieces) ? artPieces : [];

  // Use location from the first art piece instead of geo-location hook
  const firstPiece = safeArtPieces[0];
  const location =
    firstPiece && firstPiece.latitude && firstPiece.longitude
      ? { latitude: firstPiece.latitude, longitude: firstPiece.longitude }
      : null;

  const toggleView = () => {
    setShowMap((prev) => !prev);
  };

  // Handle loading state
  if (artPiecesLoading) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>Loading art pieces...</Box>;
  }

  // Handle error state
  if (artPiecesError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        Error loading art pieces: {artPiecesError.message}
      </Box>
    );
  }

  if (artPiecesEmpty) {
    return (
      <ArtPieceEmpty
        title="No Art Pieces"
        description="This artist does not have any art pieces."
        artistSlug={artistSlug}
      />
    );
  }

  return (
    <ErrorBoundary>
      <MapViewportProvider>
        <Box data-cy="explore-home-view">
          <Grid container spacing={3}>
            {isSmallScreen ? (
              <Grid size={12}>
                {showMap ? (
                  <ArtPieceMap
                    location={location}
                    artPieces={safeArtPieces}
                    hoveredArtPiece={hoveredArtPiece}
                    onHover={(piece) => setHoveredArtPiece(piece)}
                    onLeave={() => setHoveredArtPiece(null)}
                    data-cy="art-piece-map"
                  />
                ) : (
                  <Box
                    sx={{
                      maxHeight: '99vh',
                      overflowY: 'auto',
                    }}
                  >
                    <Box
                      gap={3}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                      }}
                    >
                      <ArtPieceCardList
                        artPieces={safeArtPieces}
                        hoveredArtPiece={hoveredArtPiece}
                        onHover={(piece) => setHoveredArtPiece(piece)}
                        onLeave={() => setHoveredArtPiece(null)}
                        data-cy="art-piece-card-list"
                      />
                    </Box>
                  </Box>
                )}
              </Grid>
            ) : (
              <>
                <Grid size={3}>
                  <Box
                    sx={{
                      maxHeight: '99vh',
                      overflowY: 'auto',
                    }}
                  >
                    <Box
                      gap={3}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                      }}
                    >
                      <ArtPieceCardList
                        artPieces={safeArtPieces}
                        hoveredArtPiece={hoveredArtPiece}
                        onHover={(piece) => setHoveredArtPiece(piece)}
                        onLeave={() => setHoveredArtPiece(null)}
                        data-cy="art-piece-card-list"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={9}>
                  <ArtPieceMap
                    location={location}
                    artPieces={safeArtPieces}
                    hoveredArtPiece={hoveredArtPiece}
                    onHover={(piece) => setHoveredArtPiece(piece)}
                    onLeave={() => setHoveredArtPiece(null)}
                    data-cy="art-piece-map"
                  />
                </Grid>
              </>
            )}
          </Grid>

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
        </Box>
      </MapViewportProvider>
    </ErrorBoundary>
  );
}
