import mapboxgl from 'mapbox-gl';
import polyline from '@mapbox/polyline';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';

import { CONFIG } from 'src/global-config';
import { debugLog, debugWarn, debugError } from 'src/lib/debug';

export const getWaypoints = async (data) => {
  if (!data) {
    return [];
  }

  // Map the PathMap items into a simplified structure
  // Check if data has PathMap or if it's structured differently
  const pathMapData = data.PathMap || data.ArtPiece || data;

  // If pathMapData is an object with artPieceId property, wrap it in an array
  let itemsArray = [];
  if (Array.isArray(pathMapData)) {
    itemsArray = pathMapData;
  } else if (pathMapData && pathMapData.artPieceId) {
    itemsArray = [pathMapData];
  }

  const items = itemsArray.map((item) => {
    // Access the ArtPiece object nested inside each item
    const artPiece = item.ArtPiece || item;
    return {
      artPieceId: artPiece.artPieceId,
      artistId: artPiece.artistId,
      artistSlug: artPiece.artistSlug,
      image: artPiece.imageUrl,
      latitude: artPiece.latitude,
      longitude: artPiece.longitude,
      artPieceSlug: artPiece.slug,
      title: artPiece.title,
    };
  });

  data.items = items;
  const startWaypoint = data.items.find((wp) => wp.artPieceId === parseInt(data.startPieceId));
  const endWaypoint = data.items.find((wp) => wp.artPieceId === parseInt(data.endPieceId));

  debugLog('Start Waypoint?:', startWaypoint);
  debugLog('End Waypoint?:', endWaypoint);

  // Check if we have valid start and end waypoints
  if (!startWaypoint || !endWaypoint) {
    debugWarn('Missing start or end waypoint?:', {
      startPieceId: data.startPieceId,
      endPieceId: data.endPieceId,
      startWaypoint,
      endWaypoint,
      availableIds: data.items.map((item) => item.artPieceId),
    });
    return [];
  }

  const waypoints = [
    { coordinates: [startWaypoint.longitude, startWaypoint.latitude] },
    ...data.items
      .filter(
        (wp) =>
          wp.artPieceId !== parseInt(data.startPieceId) &&
          wp.artPieceId !== parseInt(data.endPieceId)
      )
      .map((wp) => ({ coordinates: [wp.longitude, wp.latitude] })),
    { coordinates: [endWaypoint.longitude, endWaypoint.latitude] },
  ];

  return waypoints;
};

export const fetchDirections = async (data) => {
  mapboxgl.accessToken = CONFIG.mapboxApiKey;

  const directionsClient = MapboxDirections({ accessToken: mapboxgl.accessToken });
  const waypoints = await getWaypoints(data);

  // if there are not enough waypoints, return early
  if (!Array.isArray(waypoints) || waypoints.length < 2) {
    return null;
  }

  try {
    // Map path type to Mapbox profile
    const mapboxProfileMap = {
      WALKING: 'walking',
      BICYCLE: 'cycling',
      DRIVING: 'driving',
      DRIVING_TRAFFIC: 'driving-traffic',
    };

    const profile = mapboxProfileMap[data?.pathType] || 'walking';

    const response = await directionsClient
      .getDirections({
        profile,
        waypoints,
        geometries: 'geojson',
      })
      .send();

    return response.body.routes[0];
  } catch (error) {
    debugError('fetchDirections', 'Error fetching directions from Mapbox', error);
    throw new Error(error);
  }
};

export const getMapCenter = async (data) => {
  // Map the PathMap items into a simplified structure
  const pathMapData = data.PathMap || data.ArtPiece || data;

  // If pathMapData is an object with artPieceId property, wrap it in an array
  let itemsArray = [];
  if (Array.isArray(pathMapData)) {
    itemsArray = pathMapData;
  } else if (pathMapData && pathMapData.artPieceId) {
    itemsArray = [pathMapData];
  }

  const items = itemsArray.map((item) => {
    // Access the ArtPiece object nested inside each item
    const artPiece = item.ArtPiece || item;
    return {
      artPieceId: artPiece.artPieceId,
      artistId: artPiece.artistId,
      artistSlug: artPiece.artistSlug,
      image: artPiece.imageUrl,
      lat: artPiece.latitude,
      long: artPiece.longitude,
      artPieceSlug: artPiece.slug,
      title: artPiece.title,
    };
  });

  data.items = items;

  const center = data.items.find((wp) => wp.artPieceId === parseInt(data.startPieceId));

  if (!center) {
    console.error('No center waypoint found for startPieceId?:', data.startPieceId);
    console.error(
      'Available items?:',
      data.items.map((item) => ({ id: item.artPieceId, title: item.title }))
    );
    // Return first item as fallback or null
    return data.items.length > 0 ? data.items[0] : null;
  }

  return center;
};

export const getArtistStaticMapUrl = async (data) => {
  // get all the pieces into an array of coordinates
  const coordinatesArray = data.pieces.map((piece) => [
    piece.longitude,
    piece.latitude,
    piece.title,
  ]);

  // ceneter of the map
  const [centerLat, centerLong] = coordinatesArray[0];

  // Convert each pair into the Mapbox pin format
  const pinString = data.pieces
    .map(({ latitude, longitude }) => `pin-l+52B03F(${longitude},${latitude})`)
    .join(',');

  const url = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${pinString}/${centerLat},${centerLong},15,0/800x800@2x?before_layer=admin-0-boundary-disputed&access_token=${CONFIG.mapboxApiKey}`;

  return url;
};

export const getStaticMapUrl = async (data) => {
  // get center of map
  const center = await getMapCenter(data);

  const url = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+52B03F(${center?.long},${center?.latitude})/${center?.longitude},${center?.latitude},15,0/800x800@2x?before_layer=admin-0-boundary-disputed&access_token=${CONFIG.mapboxApiKey}`;

  return url;
};

export const getStaticPathMapUrl = async (data) => {
  // get center of map
  const center = await getMapCenter(data);

  // fetch directions to get points for polyline
  const directions = await fetchDirections(data);
  const correctedWaypoints = directions.geometry.coordinates.map(([lat, long]) => [long, lat]);
  const encodedPolyline = polyline.encode(correctedWaypoints);

  // Ensure the polyline is properly URL encoded
  const encodedPath = encodeURIComponent(encodedPolyline);

  // Create the path parameter for Mapbox
  const path = `path-5+3b9ddd-0.5(${encodedPath})`;

  // get wayppoints for pins
  const waypoints = await getWaypoints(data);
  const pins = waypoints
    .map((obj) => `pin-l+52B03F(${obj.coordinates[0]},${obj.coordinates[1]})`)
    .join(',');

  const url = `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${pins},${path}/${center?.long},${center?.lat},15,0/800x800@2x?before_layer=admin-0-boundary-disputed&access_token=${CONFIG.mapboxApiKey}`;

  return url;
};
