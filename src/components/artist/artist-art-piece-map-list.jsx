/**
 * @namespace CityArtWalks.Components.Artist.ArtistArtPieceMapList
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Fab, useMediaQuery } from '@mui/material';

import { ArtPieceMap, ArtPieceCardList } from 'src/components/art-piece';

import ErrorBoundary from '../error/error-boundary';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistArtPieceMapList
 * @function ArtistArtPieceMapList
 * @description Renders a responsive component that toggles between a map view and a list view
 * of art pieces created by an artist. Adapts layout based on screen size.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.artPieces - An array of art pieces, where each art piece contains relevant details like title, location, and artist information.
 * @param {Object} props.location - The geographic location used to center the map, typically an object with latitude and longitude properties.
 * @param {Object} [props.other] - Additional props to pass to the outer `Box` component.
 * @returns {JSX.Element} The rendered ArtistArtPieceMapList component.
 *
 * @example
 * // Usage example
 * import { ArtistArtPieceMapList } from './ArtistArtPieceMapList';
 *
 * function App() {
 *   const artPieces = [
 *     { id: 1, title: "Starry Night", location: { lat: 48.853, lng: 2.349 } },
 *     { id: 2, title: "Sunflowers", location: { lat: 51.507, lng: -0.127 } },
 *   ];
 *   const location = { lat: 48.853, lng: 2.349 }; // Center location for the map
 *
 *   return <ArtistArtPieceMapList artPieces={artPieces} location={location} />;
 * }
 */

export function ArtistArtPieceMapList({ artPieces, location, ...other }) {
  const [showMap, setShowMap] = useState(false); // Toggle between Map and List

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens

  const [hoveredArtPiece, setHoveredArtPiece] = useState(null);

  const toggleView = () => {
    setShowMap((prev) => !prev);
  };

  return (
    <ErrorBoundary>
      <Box data-cy="artist-art-piece-map-list" {...other}>
        <Grid container spacing={3}>
          {isSmallScreen ? (
            <Grid size={12}>
              {showMap ? (
                <ArtPieceMap location={location} artPieces={artPieces} />
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
                    <ArtPieceCardList artPieces={artPieces} />
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
                      artPieces={artPieces}
                      onHover={(piece) => setHoveredArtPiece(piece)} // Set hovered piece
                      onLeave={() => setHoveredArtPiece(null)} // Clear hovered piece
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid size={9}>
                <ArtPieceMap
                  location={location}
                  artPieces={artPieces}
                  hoveredArtPiece={hoveredArtPiece} // Pass hovered piece to map
                  onHover={(piece) => setHoveredArtPiece(piece)} // Handle hover
                  onLeave={() => setHoveredArtPiece(null)} // Handle leave
                />
              </Grid>
            </>
          )}
        </Grid>
        {isSmallScreen && (
          <Fab
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
    </ErrorBoundary>
  );
}
