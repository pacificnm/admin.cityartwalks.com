/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMap
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import dynamic from 'next/dynamic';
import { Layer, Source } from 'react-map-gl/mapbox';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';
import { useMapViewport } from 'src/hooks/use-map-viewport';

import { getValidImageUrl } from 'src/utils/image-url-validator';

import { debugLog } from 'src/lib/debug';
import { CONFIG } from 'src/global-config';

import { MapMarker, MapControl } from 'src/components/map';
import { ArtPieceMapDialog } from 'src/components/art-piece';
import ErrorBoundary from 'src/components/error/error-boundary';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMap
 * @constant {React.ComponentType} Map
 * @description Dynamically imports the `Map` component with a skeleton loader placeholder.
 * This improves performance by lazy-loading the `Map` component only when needed.
 *
 * @type {React.ComponentType}
 * @default
 * Displays a rectangular skeleton as a placeholder while the `Map` component is loading.
 *
 * @example
 * // Usage example
 * import { Map } from './DynamicMap';
 *
 * function App() {
 *   return (
 *     <div style={{ position: 'relative', width: '100%', height: '500px' }}>
 *       <Map />
 *     </div>
 *   );
 * }
 *
 * @example
 * // The skeleton loader is displayed until the `Map` component is fully loaded.
 */
const CustomMap = dynamic(() => import('src/components/map').then((mod) => mod.Map), {
  loading: () => (
    <Skeleton
      variant="rectangular"
      sx={{ top: 0, left: 0, width: 1, height: 1, position: 'absolute' }}
    />
  ),
  ssr: false,
});

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMap
 * @function ArtPieceMap
 * @description Renders an interactive map displaying art piece locations with dynamic viewport-based loading.
 * Features automatic initial viewport setting, real-time updates as the map moves, and comprehensive
 * marker interactions with art piece details.
 *
 * Key Features:
 * - Automatic initial viewport setting for immediate art piece loading
 * - Dynamic viewport updates as users pan and zoom the map
 * - Interactive markers with hover effects and detail dialogs
 * - Support for multiple location data structures
 * - Responsive map centering based on user location or art piece locations
 * - Route overlay support for guided art walks
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.location - The fallback location with `lat`/`lon` or `latitude`/`longitude` for map initialization.
 * @param {Array<Object>} props.artPieces - An array of art piece objects with location details.
 * Each object should include:
 * - `artPieceId` (string): The unique ID of the art piece.
 * - `latitude` (number): The latitude of the art piece location.
 * - `longitude` (number): The longitude of the art piece location.
 * - `title` (string): The title of the art piece.
 * - `imageUrl` (string): URL for the art piece image.
 * @param {number} [props.zoom=12] - The initial zoom level (12 provides good coverage for art piece discovery).
 * @param {Object} [props.route] - Optional route geometry for displaying art walk paths.
 * @param {Object} [props.hoveredArtPiece] - Currently hovered art piece for synchronized highlighting.
 * @param {Function} [props.onHover] - Callback when hovering over an art piece marker.
 * @param {Function} [props.onLeave] - Callback when leaving an art piece marker.
 * @param {Object} [props.other] - Additional properties to pass to the container element.
 * @returns {JSX.Element} The rendered ArtPieceMap component with interactive features.
 *
 * @example
 * // Basic usage with location and art pieces
 * import { ArtPieceMap } from './ArtPieceMap';
 *
 * function App() {
 *   const location = { lat: 45.523064, lon: -122.676483 };
 *   const artPieces = [
 *     { artPieceId: '1', latitude: 45.523064, longitude: -122.676483, title: 'City Reflections' },
 *     { artPieceId: '2', latitude: 45.528333, longitude: -122.681111, title: 'Farewell to Orpheus' },
 *   ];
 *
 *   return <ArtPieceMap location={location} artPieces={artPieces} />;
 * }
 *
 * @example
 * // Advanced usage with hover synchronization
 * function ExploreView() {
 *   const [hoveredPiece, setHoveredPiece] = useState(null);
 *
 *   return (
 *     <ArtPieceMap
 *       location={userLocation}
 *       artPieces={artPieces}
 *       hoveredArtPiece={hoveredPiece}
 *       onHover={setHoveredPiece}
 *       onLeave={() => setHoveredPiece(null)}
 *       zoom={13}
 *     />
 *   );
 * }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceMap-Component} ArtPieceMap Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/MapViewport-Hook} MapViewport Hook Integration
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Map-Components} Map Component System
 */
export function ArtPieceMap({
  location,
  artPieces,
  zoom = 12,
  mapStyle,
  route,
  hoveredArtPiece,
  onHover = () => {},
  onLeave = () => {},
  viewState, // New prop for external control
  ...other
}) {
  debugLog('Components.ArtPiece.ArtPieceMap (143)', 'Received viewState prop', viewState);

  const theme = useTheme();
  const open = useBoolean();
  const [artPiece, setArtPiece] = useState(null);
  const { updateViewport } = useMapViewport();
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Handle different data structures for artPieces
  let safeArtPieces = [];
  if (Array.isArray(artPieces)) {
    safeArtPieces = artPieces;
  } else if (artPieces?.data && Array.isArray(artPieces.data)) {
    safeArtPieces = artPieces.data;
  }

  // Handle different location data structures
  let mapCenter = {
    latitude: 45.5152, // Portland fallback
    longitude: -122.6784, // Portland fallback
  };

  // Use viewState if provided for external control
  if (viewState?.latitude && viewState?.longitude) {
    mapCenter.latitude = viewState.latitude;
    mapCenter.longitude = viewState.longitude;
    if (viewState.zoom) {
      zoom = viewState.zoom;
    }
  }
  // Try to get coordinates from location object
  else if (location?.lat && location?.lon) {
    mapCenter.latitude = location.lat;
    mapCenter.longitude = location.lon;
  } else if (location?.latitude && location?.longitude) {
    mapCenter.latitude = location.latitude;
    mapCenter.longitude = location.longitude;
  }
  // If no valid location, try to use first art piece coordinates
  else if (safeArtPieces.length > 0 && safeArtPieces[0]?.latitude && safeArtPieces[0]?.longitude) {
    mapCenter.latitude = safeArtPieces[0].latitude;
    mapCenter.longitude = safeArtPieces[0].longitude;
  }

  // Helper function to calculate viewport from view state
  const calculateViewport = useCallback((mapViewState) => {
    const { latitude, longitude, zoom: currentZoom } = mapViewState;

    // Calculate bounds from the center and zoom
    const latDelta = 0.01 * Math.pow(2, 14 - currentZoom);
    const lngDelta = 0.01 * Math.pow(2, 14 - currentZoom);

    // Round coordinates to 4 decimal places to prevent floating-point precision issues
    const roundCoord = (coord) => Math.round(coord * 10000) / 10000;

    return {
      swLat: roundCoord(latitude - latDelta),
      swLng: roundCoord(longitude - lngDelta),
      neLat: roundCoord(latitude + latDelta),
      neLng: roundCoord(longitude + lngDelta),
      zoom: Math.round(currentZoom), // Round zoom to whole numbers to prevent unnecessary API calls
      lat: roundCoord(latitude),
      lng: roundCoord(longitude),
    };
  }, []);

  // Handle map load events to set initial viewport
  const handleLoad = useCallback(
    (evt) => {
      debugLog('Components.ArtPiece.ArtPieceMap (172)', 'Map loaded', evt.target);
      setMapInstance(evt.target);

      const initialViewport = calculateViewport({
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
        zoom,
      });

      updateViewport(initialViewport);
    },
    [calculateViewport, mapCenter.latitude, mapCenter.longitude, zoom, updateViewport]
  );

  // External viewState control via flyTo
  useEffect(() => {
    debugLog('Components.ArtPiece.ArtPieceMap (179)', 'viewState changed', viewState);
    debugLog('Components.ArtPiece.ArtPieceMap (180)', 'mapInstance', mapInstance);

    if (viewState && mapInstance) {
      debugLog('Components.ArtPiece.ArtPieceMap (183)', 'Flying to', {
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom || zoom,
      });

      mapInstance.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom || zoom,
        duration: 2000,
      });
    }
  }, [viewState, zoom, mapInstance]);

  // Handle location prop changes - recenter map when location changes
  // Only do this when viewState is NOT provided (uncontrolled mode)
  useEffect(() => {
    if (mapInstance && location && !viewState) {
      debugLog(
        'Components.ArtPiece.ArtPieceMap',
        'Location changed, recentering map (uncontrolled)',
        location
      );

      // Get new coordinates from location
      let newCenter = null;
      if (location.lat && location.lon) {
        newCenter = [location.lon, location.lat];
      } else if (location.latitude && location.longitude) {
        newCenter = [location.longitude, location.latitude];
      }

      if (newCenter) {
        debugLog('Components.ArtPiece.ArtPieceMap', 'Flying to new location', {
          center: newCenter,
          zoom,
        });

        mapInstance.flyTo({
          center: newCenter,
          zoom,
          duration: 2000,
        });

        // Update viewport for data loading
        const newViewport = calculateViewport({
          latitude: newCenter[1],
          longitude: newCenter[0],
          zoom,
        });
        updateViewport(newViewport);
      }
    }
  }, [location, mapInstance, viewState, zoom, calculateViewport, updateViewport]);

  return (
    <ErrorBoundary>
      <ArtPieceMapDialog artPiece={artPiece} open={open.value} onClose={open.onFalse} />
      <Box
        {...other}
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
        data-cy="art-piece-map"
      >
        <CustomMap
          key={
            viewState
              ? `${viewState.latitude}-${viewState.longitude}-${viewState.zoom || zoom}`
              : 'default'
          }
          ref={mapRef}
          sx={{
            width: '100%',
            height: '100%', // This will make the map fill the container
          }}
          initialViewState={{
            latitude: mapCenter.latitude,
            longitude: mapCenter.longitude,
            zoom,
          }}
          onLoad={handleLoad}
          mapStyle={
            mapStyle ||
            `mapbox://styles/mapbox/${theme.palette.mode === 'light' ? 'light' : 'dark'}-v10`
          }
        >
          <MapControl />

          {route && (
            <Source id="route" type="geojson" data={route?.geometry}>
              <Layer
                id="route"
                type="line"
                paint={{
                  'line-color': CONFIG.pathLineColor,
                  'line-width': CONFIG.pathLineWidht,
                }}
              />
            </Source>
          )}

          {safeArtPieces.map((piece) => (
            <MapMarker
              key={piece.artPieceId}
              latitude={piece.latitude}
              longitude={piece.longitude}
              imageUrl={getValidImageUrl(piece.imageUrl || piece.image)}
              title={piece.title || 'Art piece'}
              hoveredArtPiece={hoveredArtPiece}
              onHover={() =>
                onHover({
                  latitude: piece.latitude,
                  longitude: piece.longitude,
                  imageUrl: getValidImageUrl(piece.imageUrl || piece.image),
                  title: piece.title || 'Art piece',
                })
              }
              onLeave={onLeave}
              onClick={() => {
                setArtPiece(piece);
                open.onTrue();
              }}
            />
          ))}
        </CustomMap>
      </Box>
    </ErrorBoundary>
  );
}
