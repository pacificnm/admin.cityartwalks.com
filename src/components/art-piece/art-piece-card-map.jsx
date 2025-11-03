'use client';

import PropTypes from 'prop-types';
import { Map } from 'react-map-gl/mapbox';
import React, { useMemo, useCallback } from 'react';

/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceCardMap
 * @version 1.0.0
 * @author jaimie garner
 */
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { MapMarker, MapControl } from 'src/components/map';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardMap
 * @function ArtPieceCardMap
 * @description A styled container for a map or similar content.
 * Ensures proper layout and hides specific Mapbox controls for a cleaner UI.
 *
 * @constant
 * @type {React.ComponentType}
 *
 * @style
 * - `zIndex`: 0 to ensure it sits behind other elements if needed.
 * - `width`: 100% to take up the full width of its container.
 * - `height`: 30vh to occupy 30% of the viewport height.
 * - `overflow`: Hidden to prevent content overflow.
 * - `position`: Relative for proper positioning of child elements.
 * - `& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right`: Hides Mapbox logo and controls in the bottom-right.
 *
 * @example
 * // Usage example
 * import { StyledRoot } from './StyledRoot';
 *
 * function App() {
 *   return (
 *     <StyledRoot>
 *       <div>Map content here</div>
 *     </StyledRoot>
 *   );
 * }
 */
const StyledRoot = styled('div')(() => ({
  zIndex: 0,
  width: '100%',
  height: '30vh',
  overflow: 'hidden',
  position: 'relative',
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardMap
 * @function ArtPieceCardMap
 * @description Renders a map displaying the location of a specific art piece.
 * Includes a marker for the art piece and allows navigation to the art piece's details page when clicked.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.latitude - The latitude coordinate of the art piece's location.
 * @param {number} props.longitude - The longitude coordinate of the art piece's location.
 * @param {string} props.title - The title of the art piece.
 * @param {string} props.slug - The slug for the art piece, used for navigation.
 * @param {string} props.name - The name of the artist.
 * @param {string} props.artistSlug - The slug for the artist, used for navigation.
 * @returns {JSX.Element} The rendered ArtPieceCardMap component.
 *
 * @example
 * // Usage example
 * import ArtPieceCardMap from './ArtPieceCardMap';
 *
 * function App() {
 *   return (
 *     <ArtPieceCardMap
 *       latitude={45.523064}
 *       longitude={-122.676483}
 *       title="Starry Night"
 *       slug="starry-night"
 *       name="Vincent van Gogh"
 *       artistSlug="vincent-van-gogh"
 *     />
 *   );
 * }
 *
 * @example
 * // MapBox API Configuration
 * // Ensure the `CONFIG.mapboxApiKey` is set in your project configuration.
 */
export default function ArtPieceCardMap({ latitude, longitude, title, slug, name, artistSlug }) {
  const router = useRouter();
  const lightMode = true; // Assuming light mode; replace this with the actual logic if dynamic.

  // Memoized map points based on the art piece details
  const mapPoint = useMemo(
    () => [
      {
        latlng: [latitude, longitude],
        name: title,
        artistName: name,
        slug,
        artistSlug,
      },
    ],
    [latitude, longitude, title, name, slug, artistSlug]
  );

  // Memoized handleOpen function to prevent unnecessary re-renders
  const handleOpen = useCallback(
    (markerArtistSlug, markerSlug) => {
      router.push(paths.artist.piece(markerArtistSlug, markerSlug));
    },
    [router]
  );

  return (
    <Box sx={{ height: '30vh', width: '100%' }}>
      <StyledRoot>
        <Map
          initialViewState={{
            latitude,
            longitude,
            zoom: 14,
          }}
          mapStyle={`mapbox://styles/mapbox/${lightMode ? 'light' : 'dark'}-v10`}
          mapboxAccessToken={CONFIG.mapboxApiKey}
        >
          <MapControl />
          {mapPoint.map((point, index) => (
            <MapMarker
              key={`marker-${index}`}
              latitude={point.latlng[0]}
              longitude={point.latlng[1]}
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                handleOpen(point.artistSlug, point.slug);
              }}
            />
          ))}
        </Map>
      </StyledRoot>
    </Box>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardMap
 * @prop {number} latitude - The latitude coordinate of the art piece's location. This prop is required.
 * @prop {number} longitude - The longitude coordinate of the art piece's location. This prop is required.
 * @prop {string} title - The title of the art piece. This prop is required.
 * @prop {string} slug - The slug for the art piece, used for navigation. This prop is required.
 * @prop {string} name - The name of the artist. This prop is required.
 * @prop {string} artistSlug - The slug for the artist, used for navigation. This prop is required.
 */
ArtPieceCardMap.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
};
