/**
 * @fileoverview Map viewport context provider for managing map view state and dynamic art piece loading.
 * Provides debounced viewport updates, coordinate bounds calculation, and integration with art piece
 * loading hooks for seamless map-based exploration experiences.
 *
 * @author CityArtWalks Development Team
 * @version 1.0.0
 * @namespace CityArtWalks.Hooks.MapViewport
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/MapViewport-Hook} MapViewport Hook Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Map-Integration} Map Integration Guide
 */

'use client';

import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

/**
 * @memberof CityArtWalks.Hooks.MapViewport
 * @interface ViewportBounds
 * @property {number} swLat - Southwest latitude (bottom-left corner)
 * @property {number} swLng - Southwest longitude (bottom-left corner)
 * @property {number} neLat - Northeast latitude (top-right corner)
 * @property {number} neLng - Northeast longitude (top-right corner)
 * @property {number} zoom - Current map zoom level
 * @property {number} lat - Center latitude
 * @property {number} lng - Center longitude
 */

/**
 * @memberof CityArtWalks.Hooks.MapViewport
 * @interface MapViewportContextType
 * @property {ViewportBounds|null} viewport - Current viewport bounds
 * @property {ViewportBounds|null} stableViewport - Debounced/stable viewport for API calls
 * @property {boolean} isMoving - Whether the map is currently being moved/zoomed
 * @property {function} updateViewport - Function to update viewport bounds
 * @property {function} setIsMoving - Function to set map movement state
 */

const MapViewportContext = createContext(null);

/**
 * @memberof CityArtWalks.Hooks.MapViewport
 * @function useMapViewport
 * @description Hook to access map viewport state and controls
 * @returns {MapViewportContextType} The viewport context data
 * @throws {Error} If used outside of MapViewportProvider
 */
export function useMapViewport() {
  const context = useContext(MapViewportContext);
  if (!context) {
    throw new Error('useMapViewport must be used within a MapViewportProvider');
  }
  return context;
}

/**
 * @memberof CityArtWalks.Hooks.MapViewport
 * @function calculateViewportBounds
 * @description Calculate viewport bounds from map view state using geographic coordinate math.
 * Converts zoom level and pixel dimensions to geographic bounding box coordinates.
 *
 * This function is used internally by the map components to determine which art pieces
 * should be loaded based on the current map view. The calculation accounts for the
 * Web Mercator projection and provides reasonable approximations for viewport bounds.
 *
 * @param {Object} viewState - The map view state from react-map-gl
 * @param {number} viewState.latitude - Center latitude in decimal degrees
 * @param {number} viewState.longitude - Center longitude in decimal degrees
 * @param {number} viewState.zoom - Zoom level (higher = more zoomed in)
 * @param {number} [mapWidth=800] - Map container width in pixels
 * @param {number} [mapHeight=600] - Map container height in pixels
 * @returns {ViewportBounds} The calculated viewport bounds with southwest and northeast corners
 *
 * @example
 * // Calculate bounds for a map view centered on Portland
 * const viewState = {
 *   latitude: 45.5152,
 *   longitude: -122.6784,
 *   zoom: 12
 * };
 * const bounds = calculateViewportBounds(viewState, 1024, 768);
 * console.log(bounds);
 * // Output: { swLat: 45.4952, swLng: -122.7084, neLat: 45.5352, neLng: -122.6484, ... }
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Viewport-Calculations} Viewport Calculation Details
 */
export function calculateViewportBounds(viewState, mapWidth = 800, mapHeight = 600) {
  const { latitude, longitude, zoom } = viewState;

  // Convert zoom level to meters per pixel (approximate)
  const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);

  // Calculate bounds in meters
  const halfWidth = (mapWidth / 2) * metersPerPixel;
  const halfHeight = (mapHeight / 2) * metersPerPixel;

  // Convert meters to degrees (approximate)
  const latDelta = halfHeight / 111320; // 1 degree lat ≈ 111,320 meters
  const lngDelta = halfWidth / (111320 * Math.cos((latitude * Math.PI) / 180));

  // Round coordinates to 4 decimal places to prevent floating-point precision issues
  const roundCoord = (coord) => Math.round(coord * 10000) / 10000;

  return {
    swLat: roundCoord(latitude - latDelta),
    swLng: roundCoord(longitude - lngDelta),
    neLat: roundCoord(latitude + latDelta),
    neLng: roundCoord(longitude + lngDelta),
    zoom: Math.round(zoom), // Round zoom to whole numbers to prevent unnecessary API calls
    lat: roundCoord(latitude),
    lng: roundCoord(longitude),
  };
}

/**
 * @memberof CityArtWalks.Hooks.MapViewport
 * @component MapViewportProvider
 * @description Provider component for map viewport state management with debounced updates
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {number} [props.debounceMs=500] - Debounce delay for viewport updates in milliseconds
 * @returns {JSX.Element} The provider component
 */
export function MapViewportProvider({ children, debounceMs = 500 }) {
  const [viewport, setViewport] = useState(null);
  const [stableViewport, setStableViewport] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  // Debounced effect to update stable viewport with additional stability checks
  useEffect(() => {
    if (!viewport) return undefined;

    const timer = setTimeout(() => {
      setStableViewport((prev) => {
        // Only update if viewport has actually changed significantly
        if (
          prev &&
          Math.abs(prev.swLat - viewport.swLat) < 0.001 &&
          Math.abs(prev.swLng - viewport.swLng) < 0.001 &&
          Math.abs(prev.neLat - viewport.neLat) < 0.001 &&
          Math.abs(prev.neLng - viewport.neLng) < 0.001
        ) {
          setIsMoving(false); // Clear moving state even if no update
          return prev; // No significant change
        }
        setIsMoving(false);
        return viewport;
      });
    }, debounceMs);

    // Only set moving if it's not already moving to prevent rapid state changes
    setIsMoving((prev) => (!prev ? true : prev));
    return () => clearTimeout(timer);
  }, [viewport, debounceMs]);

  // Update viewport immediately with duplicate check
  const updateViewport = useCallback((newViewport) => {
    if (!newViewport) return;

    // Prevent updates with the same coordinates to avoid loops
    setViewport((prevViewport) => {
      if (
        prevViewport &&
        Math.abs(prevViewport.swLat - newViewport.swLat) < 0.0001 &&
        Math.abs(prevViewport.swLng - newViewport.swLng) < 0.0001 &&
        Math.abs(prevViewport.neLat - newViewport.neLat) < 0.0001 &&
        Math.abs(prevViewport.neLng - newViewport.neLng) < 0.0001
      ) {
        return prevViewport; // No change, prevent update
      }
      return newViewport;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      viewport,
      stableViewport,
      isMoving,
      updateViewport,
      setIsMoving,
    }),
    [viewport, stableViewport, isMoving, updateViewport]
  );

  return <MapViewportContext.Provider value={contextValue}>{children}</MapViewportContext.Provider>;
}
