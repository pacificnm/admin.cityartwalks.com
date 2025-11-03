/**
 * @namespace CityArtWalks.Components.Artist.ArtistMap
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';

import { MapMarker, MapControl } from 'src/components/map';
import { ArtPieceMapDialog } from 'src/components/art-piece';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistMap
 * @function ArtistMap
 * @description Dynamically imports the `Map` component with a loading skeleton placeholder.
 * This improves performance by lazy-loading the `Map` component only when needed.
 *
 * @type {React.ComponentType}
 * @default Displays a skeleton while the `Map` component is being loaded.
 *
 * @example
 * // Usage example
 * import { Map } from './MapComponent';
 *
 * function App() {
 *   return (
 *     <div style={{ height: '500px', width: '100%' }}>
 *       <Map />
 *     </div>
 *   );
 * }
 */
const Map = dynamic(() => import('src/components/map').then((mod) => mod.Map), {
  loading: () => (
    <Skeleton
      variant="rectangular"
      sx={{ top: 0, left: 0, width: 1, height: 1, position: 'absolute' }}
    />
  ),
});
/**
 * @memberof CityArtWalks.Components.Artist.ArtistMap
 * @description Renders a map displaying the locations of art pieces created by an artist.
 * Includes markers for each art piece and opens a dialog with more details when a marker is clicked.
 *
 * @param {Object} props - The component props.
 * @param {Array<Object>} [props.artPieces=[]] - An array of art pieces with location details.
 * Each object should contain `artPieceId`, `latitude`, and `longitude` properties, among others.
 * @returns {JSX.Element} The rendered ArtistMap component.
 *
 * @example
 * // Usage example
 * import { ArtistMap } from './ArtistMap';
 *
 * function App() {
 *   const artPieces = [
 *     { artPieceId: 1, latitude: 45.523, longitude: -122.676, title: "Art Piece 1" },
 *     { artPieceId: 2, latitude: 45.528, longitude: -122.678, title: "Art Piece 2" },
 *   ];
 *
 *   return <ArtistMap artPieces={artPieces} />;
 * }
 */

export function ArtistMap({ artPieces = [] }) {
  const theme = useTheme();
  const open = useBoolean();
  const [artPiece, setArtPiece] = useState(null);

  return (
    <>
      <ArtPieceMapDialog artPiece={artPiece} open={open.value} onClose={open.onFalse} />
      <Box
        sx={{
          zIndex: 0,
          borderRadius: 1.5,
          overflow: 'hidden',
          position: 'relative',
          height: '99vh',
          maxHeight: '100vh', // Max height set to the viewport height
          overflowY: 'auto', // Enables vertical scrolling
          padding: 0, // Optional padding
        }}
      >
        <Map
          initialViewState={{
            latitude: artPieces[0]?.latitude || location.lat,
            longitude: artPieces[0]?.longitude || location.lon,
            zoom: 14,
          }}
          mapStyle={`mapbox://styles/mapbox/${theme.palette.mode === 'light' ? 'light' : 'dark'}-v10`}
        >
          <MapControl hideGeolocate />

          {artPieces.map((location) => (
            <MapMarker
              key={location.artPieceId}
              latitude={location.latitude}
              longitude={location.longitude}
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                setArtPiece(location);
                open.onTrue();
              }}
            />
          ))}
        </Map>
      </Box>
    </>
  );
}
