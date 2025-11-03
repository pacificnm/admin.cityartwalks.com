/**
 * @namespace CityArtWalks.Components.ArtPiece.ViewportArtPieceMap
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
import { useMapViewport, calculateViewportBounds } from 'src/hooks/use-map-viewport';

import { CONFIG } from 'src/global-config';

import { ArtPieceMapDialog } from 'src/components/art-piece';
import ErrorBoundary from 'src/components/error/error-boundary';
import { MapMarker, MapControl, ViewportLoadingOverlay } from 'src/components/map';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ViewportArtPieceMap
 * @constant {React.ComponentType} Map
 * @description Dynamically imports the `Map` component with a skeleton loader placeholder.
 */
const CustomMap = dynamic(() => import('src/components/map').then((mod) => mod.Map), {
  loading: () => (
    <Skeleton
      variant="rectangular"
      sx={{ top: 0, left: 0, width: 1, height: 1, position: 'absolute' }}
    />
  ),
});

/**
 * @memberof CityArtWalks.Components.ArtPiece.ViewportArtPieceMap
 * @function ViewportArtPieceMap
 * @description Enhanced ArtPieceMap that tracks viewport changes and updates art pieces based on map bounds.
 * Integrates with MapViewportProvider to enable dynamic, viewport-based art piece loading.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.location - The fallback location with `lat` and `lon` for map initialization.
 * @param {Array<Object>} props.artPieces - An array of art piece objects with location details.
 * @param {number} [props.zoom=14] - The initial zoom level
 * @param {Object} [props.route] - Route geometry for displaying paths
 * @param {Object} [props.hoveredArtPiece] - Currently hovered art piece for highlighting
 * @param {function} [props.onHover] - Callback when hovering over an art piece
 * @param {function} [props.onLeave] - Callback when leaving an art piece
 * @param {function} [props.onViewportChange] - Callback when the viewport changes
 * @param {Object} [props.other] - Additional properties to pass to the container element.
 * @returns {JSX.Element} The rendered ViewportArtPieceMap component.
 *
 * @example
 * // Usage with MapViewportProvider
 * import { ViewportArtPieceMap } from './ViewportArtPieceMap';
 * import { MapViewportProvider } from 'src/hooks/use-map-viewport';
 *
 * function App() {
 *   return (
 *     <MapViewportProvider>
 *       <ViewportArtPieceMap
 *         location={{ lat: 45.523064, lon: -122.676483 }}
 *         artPieces={artPieces}
 *         onViewportChange={(viewport) => console.log('Viewport changed:', viewport)}
 *       />
 *     </MapViewportProvider>
 *   );
 * }
 */
export function ViewportArtPieceMap({
  location,
  artPieces,
  zoom = 14,
  route,
  hoveredArtPiece,
  onHover = () => {},
  onLeave = () => {},
  onViewportChange = () => {},
  ...other
}) {
  const theme = useTheme();
  const open = useBoolean();
  const [artPiece, setArtPiece] = useState(null);
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const { updateViewport } = useMapViewport();

  // Handle map move events to update viewport
  const handleMove = useCallback(
    (evt) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const mapWidth = container.offsetWidth || 800;
      const mapHeight = container.offsetHeight || 600;

      const viewport = calculateViewportBounds(evt.viewState, mapWidth, mapHeight);
      updateViewport(viewport);
      onViewportChange(viewport);
    },
    [updateViewport, onViewportChange]
  );

  // Handle map load to set initial viewport
  const handleLoad = useCallback(() => {
    if (!mapRef.current || !containerRef.current) return;

    const map = mapRef.current.getMap();
    const bounds = map.getBounds();
    const center = map.getCenter();
    const currentZoom = map.getZoom();

    // Round coordinates to 4 decimal places to prevent floating-point precision issues
    const roundCoord = (coord) => Math.round(coord * 10000) / 10000;

    const viewport = {
      swLat: roundCoord(bounds.getSouth()),
      swLng: roundCoord(bounds.getWest()),
      neLat: roundCoord(bounds.getNorth()),
      neLng: roundCoord(bounds.getEast()),
      zoom: Math.round(currentZoom), // Round zoom to whole numbers to prevent unnecessary API calls
      lat: roundCoord(center.lat),
      lng: roundCoord(center.lng),
    };

    updateViewport(viewport);
    onViewportChange(viewport);
  }, [updateViewport, onViewportChange]);

  // Update viewport when map size changes
  useEffect(() => {
    if (!containerRef.current) return undefined;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        // Trigger a viewport update after resize
        setTimeout(() => {
          if (mapRef.current) {
            const map = mapRef.current.getMap();
            const bounds = map.getBounds();
            const center = map.getCenter();
            const currentZoom = map.getZoom();

            // Round coordinates to 4 decimal places to prevent floating-point precision issues
            const roundCoord = (coord) => Math.round(coord * 10000) / 10000;

            const viewport = {
              swLat: roundCoord(bounds.getSouth()),
              swLng: roundCoord(bounds.getWest()),
              neLat: roundCoord(bounds.getNorth()),
              neLng: roundCoord(bounds.getEast()),
              zoom: Math.round(currentZoom), // Round zoom to whole numbers to prevent unnecessary API calls
              lat: roundCoord(center.lat),
              lng: roundCoord(center.lng),
            };

            updateViewport(viewport);
            onViewportChange(viewport);
          }
        }, 100);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [updateViewport, onViewportChange]);

  return (
    <ErrorBoundary>
      <ArtPieceMapDialog artPiece={artPiece} open={open.value} onClose={open.onFalse} />
      <Box
        ref={containerRef}
        {...other}
        sx={{
          zIndex: 0,
          borderRadius: 1.5,
          overflow: 'hidden',
          position: 'relative',
          height: '99vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          padding: 0,
        }}
        data-cy="viewport-art-piece-map"
      >
        <ViewportLoadingOverlay />
        <CustomMap
          ref={mapRef}
          initialViewState={{
            latitude: location?.lat || artPieces[0]?.latitude || 45.523064,
            longitude: location?.lon || artPieces[0]?.longitude || -122.676483,
            zoom,
          }}
          mapStyle={`mapbox://styles/mapbox/${theme.palette.mode === 'light' ? 'light' : 'dark'}-v10`}
          onMove={handleMove}
          onLoad={handleLoad}
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

          {artPieces.map((piece) => (
            <MapMarker
              key={piece.artPieceId}
              latitude={piece.latitude}
              longitude={piece.longitude}
              imageUrl={piece.imageUrl}
              title={piece.title}
              hoveredArtPiece={hoveredArtPiece}
              onHover={() =>
                onHover({
                  latitude: piece.latitude,
                  longitude: piece.longitude,
                  imageUrl: piece.imageUrl,
                  title: piece.title,
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
