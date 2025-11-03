'use client';

import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.Path.Home
 * @author Jaimie Garner
 */
import { Fab, Box, Container, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MapViewportProvider } from 'src/hooks/use-map-viewport';

import { fetchDirections } from 'src/utils/map';

import { debugLog } from 'src/lib/debug';
import { useGetPathBySlug, useIncrementPathViewCount } from 'src/actions/path/hooks';

import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import { PathReviews } from 'src/components/path/path-reviews';
import ErrorBoundary from 'src/components/error/error-boundary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PathCard, PathNearby, PathDetails } from 'src/components/path';
import { ArtPieceMap, ArtPieceCardList } from 'src/components/art-piece';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

import { PathNotFoundView } from './path-not-found-view';
import { PathDetailsSkeletonView } from '../path-details.skeleton';
/**
 * @memberof CityArtWalks.Sections.Path.Home
 * @description PathDetailsView component displays the details of a walking path including a map and a list of art pieces.
 * It toggles between map view and list view based on the screen size and user interaction.
 * @function PathDetailsView
 * @param {Object} props - The component props.
 * @param {string} props.slug - The slug of the path to fetch details for.
 *
 * @returns {JSX.Element} The rendered PathDetailsView component.
 */
export function PathDetailsView({ slug }) {
  const { accessToken } = useAuthContext();
  const pageProgress = useScrollProgress();
  const [showMap, setShowMap] = useState(true); // Toggle between Map and List
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens
  const [hoveredArtPiece, setHoveredArtPiece] = useState(null);
  const [route, setRoute] = useState(null);

  const { path, pathLoading, pathError, pathEmpty } = useGetPathBySlug(
    slug,
    accessToken ?? '',
    8600
  );

  const incrementPathViewCount = useIncrementPathViewCount(path?.pathId, accessToken);

  // Increment view count only when pathId is available
  useEffect(() => {
    if (path?.pathId) {
      incrementPathViewCount();
    }
  }, [path?.pathId, incrementPathViewCount]);

  // Debug path loading results
  debugLog('PathDetailsView.pathLoading', 'Path hook results', {
    slug,
    pathLoading,
    pathError: pathError?.message || null,
    pathEmpty,
    pathType: typeof path,
    pathIsArray: Array.isArray(path),
    pathLength: Array.isArray(path) ? path.length : 'not array',
    path,
  });

  const toggleView = () => {
    setShowMap((prev) => !prev);
  };

  useEffect(() => {
    async function fetchData() {
      const directions = await fetchDirections(path, 'walking');
      setRoute(directions);
    }
    fetchData();
  }, [path]);

  if (pathLoading) return <PathDetailsSkeletonView />;
  if (pathError) return <ErrorView message="Failed to load walking paths data" />;
  if (pathEmpty || !path || (Array.isArray(path) && path.length === 0)) {
    return <PathNotFoundView slug={slug} />;
  }

  const artPieces = path?.PathMap?.map((pathMap) => pathMap.ArtPiece) || [];

  debugLog('[PathDetailsView]', { 'Path:': path, 'Art Pieces:': artPieces });
  return (
    <ErrorBoundary>
      <Box data-cy="art-home-view">
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
            heading={path.title || 'Walking Path'}
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Path', href: paths.path.home },
              { name: path.title || 'Walking Path', href: paths.path.details(path.id) },
            ]}
            sx={{ mb: 3 }}
          />
          <MapViewportProvider>
            <Grid container spacing={3}>
              {isSmallScreen ? (
                <Grid size={12}>
                  {showMap ? (
                    <ArtPieceMap
                      location={location}
                      artPieces={artPieces}
                      zoom={path.zoom}
                      route={route}
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
                        <PathCard
                          pathId={path.pathId || path.path_id}
                          title={path.title}
                          description={path.description}
                          imageUrl={path.imageUrl}
                          favoriteCount={0}
                          pieceCount={0}
                          viewCount={path.viewCount}
                        />
                        <ArtPieceCardList
                          artPieces={artPieces}
                          onHover={(piece) => setHoveredArtPiece(piece)} // Set hovered piece
                          onLeave={() => setHoveredArtPiece(null)} // Clear hovered piece
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
                        <PathCard
                          pathId={path.pathId || path.path_id}
                          title={path.title}
                          description={path.description}
                          imageUrl={path.imageUrl}
                          favoriteCount={0}
                          pieceCount={path._count?.PathMap || 0}
                          viewCount={path.viewCount}
                        />
                        <ArtPieceCardList
                          artPieces={artPieces}
                          onHover={(piece) => setHoveredArtPiece(piece)} // Set hovered piece
                          onLeave={() => setHoveredArtPiece(null)} // Clear hovered piece
                          data-cy="art-piece-card-list"
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <ArtPieceMap
                      location={location}
                      artPieces={artPieces}
                      zoom={path.zoom}
                      route={route}
                      hoveredArtPiece={hoveredArtPiece} // Pass hovered piece to map
                      onHover={(piece) => setHoveredArtPiece(piece)} // Handle hover
                      onLeave={() => setHoveredArtPiece(null)} // Handle leave
                      data-cy="art-piece-map"
                    />
                  </Grid>
                  <Grid size={3}>
                    <PathDetails
                      pathId={path.pathId || path.path_id}
                      createdBy={path.createdBy}
                      createdAt={path.createdAt}
                      distance={path.distance}
                      duration={path.duration}
                      pathType={path.pathType}
                      country={path.Country?.name}
                      state={path.State?.name}
                      city={path.City?.name}
                      viewCount={path.viewCount}
                      pieceCount={path._count?.PathMap || 0}
                      featured={path.featured}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </MapViewportProvider>

          {/* Nearby Paths Section */}
          {path &&
            path.pathId &&
            artPieces &&
            artPieces.length > 0 &&
            (() => {
              // Calculate center coordinates from art pieces
              const piecesWithCoords = artPieces.filter(
                (piece) => piece.latitude && piece.longitude
              );

              debugLog('PathDetailsView.nearbyPaths', 'Art pieces coordinate data', {
                totalPieces: artPieces.length,
                piecesWithCoords: piecesWithCoords.length,
                pieces: artPieces.map((piece) => ({
                  id: piece.artPieceId,
                  name: piece.name,
                  lat: piece.latitude,
                  lng: piece.longitude,
                })),
              });

              if (piecesWithCoords.length === 0) {
                debugLog('PathDetailsView.nearbyPaths', 'No art pieces with coordinates found');
                return null;
              }

              const latSum = piecesWithCoords.reduce((sum, piece) => sum + piece.latitude, 0);
              const lngSum = piecesWithCoords.reduce((sum, piece) => sum + piece.longitude, 0);
              const centerLat = latSum / piecesWithCoords.length;
              const centerLng = lngSum / piecesWithCoords.length;

              debugLog('PathDetailsView.nearbyPaths', 'Calculated center coordinates', {
                centerLat,
                centerLng,
                pathId: path.pathId,
                cityId: path.cityId,
              });

              return (
                <PathNearby
                  latitude={centerLat}
                  longitude={centerLng}
                  currentPathId={path.pathId || path.path_id}
                  cityId={path.cityId}
                  title="Nearby Paths"
                  radiusKm={10}
                  maxResults={8}
                  sx={{ mt: 4 }}
                />
              );
            })()}

          {/* Path Reviews Section */}
          <PathReviews
            pathId={path.pathId || path.path_id}
            name={path.title}
            description={path.description}
            distance={path.distance}
            createdBy={path.createdBy}
            sx={{ mt: 4 }}
          />
        </Container>
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
    </ErrorBoundary>
  );
}
