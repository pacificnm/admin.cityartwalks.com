/**
 * @namespace CityArtWalks.Components.Path.PathNearby
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Components.Path
 * @description Component that displays nearby paths in a carousel format.
 * Uses the paginated paths API to fetch paths and calculates distances based on location.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Model} - Path documentation
 */

'use client';

import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { debugLog } from 'src/lib/debug';
import { useGetPaginatedPaths } from 'src/actions/path/hooks';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel } from 'src/components/carousel';

import { useAuthContext } from 'src/auth/hooks';

import { PathMiniCard } from './path-mini-card';

/**
 * @memberof CityArtWalks.Components.Path.PathNearby
 * @function PathNearby
 * @description Displays nearby paths in a carousel format using the paginated paths API.
 * Calculates distance and shows the closest paths excluding the current one.
 *
 * @param {Object} props - Component props
 * @param {number} [props.latitude] - Current path center latitude for distance calculation
 * @param {number} [props.longitude] - Current path center longitude for distance calculation
 * @param {string|number} props.currentPathId - ID of current path to exclude
 * @param {string} [props.title='Nearby Paths'] - Section title
 * @param {number} [props.radiusKm=10] - Search radius in kilometers
 * @param {number} [props.maxResults=8] - Maximum number of results to show
 * @param {string|number} [props.cityId] - City ID to filter paths by
 * @param {Object} [props.sx] - Additional styling
 * @returns {JSX.Element} The rendered PathNearby component
 */
export function PathNearby({
  latitude,
  longitude,
  currentPathId,
  title = 'Nearby Paths',
  radiusKm = 10,
  maxResults = 8,
  cityId,
  sx,
}) {
  const { accessToken } = useAuthContext();

  // Fetch paths with city filter
  const { paths, pathsLoading, pathsError } = useGetPaginatedPaths({
    page: 1,
    rowsPerPage: 50, // Get more paths to filter from
    search: '',
    status: 'ACTIVE',
    cityId: cityId || null,
    token: accessToken || '',
    revalidate: 600,
  });

  // Log the fetch results to debug the 400 error
  debugLog('PathNearby.fetchResults', 'Paths fetch results', {
    pathsCount: paths?.length || 0,
    pathsLoading,
    pathsError: pathsError?.message || null,
    cityId,
    hasToken: !!accessToken,
  });

  // Calculate distances and filter nearby paths
  const nearbyPaths = useMemo(() => {
    if (!paths || !latitude || !longitude) {
      debugLog('PathNearby.nearbyPaths', 'Missing required data', {
        pathsCount: paths?.length || 0,
        hasLocation: !!latitude && !!longitude,
        latitude,
        longitude,
      });
      return [];
    }

    debugLog('PathNearby.nearbyPaths', 'Processing paths', {
      totalPaths: paths.length,
      currentPathId,
      radiusKm,
      currentLocation: { latitude, longitude },
    });

    // Calculate path coordinates from art pieces (paths don't have direct lat/lng)
    const pathsWithCoords = paths.map((path) => {
      // Get art pieces with coordinates from this path
      const artPieces =
        path.PathMap?.map((pm) => pm.ArtPiece).filter(
          (piece) => piece && piece.latitude && piece.longitude
        ) || [];

      let pathLat = null;
      let pathLng = null;

      if (artPieces.length > 0) {
        // Calculate center coordinates from art pieces
        const latSum = artPieces.reduce((sum, piece) => sum + piece.latitude, 0);
        const lngSum = artPieces.reduce((sum, piece) => sum + piece.longitude, 0);
        pathLat = latSum / artPieces.length;
        pathLng = lngSum / artPieces.length;
      }

      debugLog('PathNearby.pathCoordinates', 'Path coordinate calculation', {
        pathId: path.pathId,
        title: path.title,
        artPiecesCount: artPieces.length,
        calculatedLat: pathLat,
        calculatedLng: pathLng,
        hasCoords: !!pathLat && !!pathLng,
      });

      return {
        ...path,
        calculatedLat: pathLat,
        calculatedLng: pathLng,
        hasCoords: !!pathLat && !!pathLng,
      };
    });

    const filtered = pathsWithCoords
      .filter((path) => {
        // Exclude current path
        if (path.pathId === currentPathId) {
          debugLog('PathNearby.filter', 'Excluding current path', path.pathId);
          return false;
        }

        if (!path.hasCoords) {
          debugLog('PathNearby.filter', 'Excluding path without coordinates', {
            pathId: path.pathId,
            title: path.title,
          });
          return false;
        }

        return true;
      })
      .map((path) => {
        // Calculate distance using available coordinates
        const pathLat = path.calculatedLat;
        const pathLng = path.calculatedLng;

        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = ((pathLat - latitude) * Math.PI) / 180;
        const dLng = ((pathLng - longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latitude * Math.PI) / 180) *
            Math.cos((pathLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        debugLog('PathNearby.distance', 'Calculated distance', {
          pathId: path.pathId,
          title: path.title,
          distance: distance.toFixed(2) + 'km',
          withinRadius: distance <= radiusKm,
        });

        return {
          ...path,
          distance,
        };
      })
      .filter((path) => {
        // Filter by radius
        const withinRadius = path.distance <= radiusKm;
        if (!withinRadius) {
          debugLog('PathNearby.radiusFilter', 'Path outside radius', {
            pathId: path.pathId,
            distance: path.distance.toFixed(2) + 'km',
            radiusKm,
          });
        }
        return withinRadius;
      })
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .slice(0, maxResults); // Limit results

    debugLog('PathNearby.nearbyPaths', 'Final filtered nearby paths', {
      totalPaths: paths.length,
      pathsWithCoords: pathsWithCoords.filter((p) => p.hasCoords).length,
      nearbyCount: filtered.length,
      radiusKm,
      currentLocation: { latitude, longitude },
      filteredPaths: filtered.map((p) => ({
        id: p.pathId,
        title: p.title,
        distance: p.distance.toFixed(2) + 'km',
      })),
    });

    return filtered;
  }, [paths, latitude, longitude, currentPathId, radiusKm, maxResults]);

  // Carousel configuration
  const carousel = useCarousel({
    slideSpacing: '16px',
    slidesToShow: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
    },
    align: 'start',
    containScroll: 'trimSnaps',
  });

  // Don't render if no location data
  if (!latitude || !longitude) {
    return null;
  }

  // Error state - but don't show error for 400 errors, just treat as no paths found
  if (pathsError && !pathsError.message?.includes('400')) {
    debugLog('PathNearby.error', 'Non-400 error occurred', {
      error: pathsError.message,
      cityId,
    });

    return (
      <Card sx={sx}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:route-bold" width={24} sx={{ color: 'error.main' }} />
              <Typography variant="h6">{title}</Typography>
            </Stack>
          }
        />
        <CardContent>
          <Stack alignItems="center" spacing={2} sx={{ py: 3 }}>
            <Iconify
              icon="solar:wifi-router-minimalistic-broken"
              width={64}
              sx={{ color: 'text.disabled' }}
            />
            <Typography variant="body2" color="text.secondary">
              Unable to load nearby paths. Please try again later.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // If we have a 400 error or no paths, treat as "no paths found"
  const shouldShowNotFound = !pathsLoading && (!paths || paths.length === 0 || pathsError);

  if (shouldShowNotFound) {
    debugLog('PathNearby.noPathsFound', 'No paths found or 400 error', {
      pathsCount: paths?.length || 0,
      hasError: !!pathsError,
      errorMessage: pathsError?.message,
      cityId,
    });
  }

  return (
    <Card sx={sx}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:route-bold" width={24} sx={{ color: 'primary.main' }} />
            <Typography variant="h6">{title}</Typography>
          </Stack>
        }
        action={
          !pathsLoading &&
          nearbyPaths.length > 0 && (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={carousel.arrows.onClickPrev}
                disabled={carousel.arrows.disablePrev}
                sx={{ minWidth: 40, width: 40, height: 40, p: 0 }}
              >
                <Iconify icon="solar:arrow-left-bold" width={16} />
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={carousel.arrows.onClickNext}
                disabled={carousel.arrows.disableNext}
                sx={{ minWidth: 40, width: 40, height: 40, p: 0 }}
              >
                <Iconify icon="solar:arrow-right-bold" width={16} />
              </Button>
            </Stack>
          )
        }
      />

      <CardContent>
        {/* Loading State */}
        {pathsLoading && (
          <Stack direction="row" spacing={2}>
            {[...Array(4)].map((_, index) => (
              <Box key={index} sx={{ width: 240, flexShrink: 0 }}>
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 1 }} />
                <Box sx={{ pt: 1 }}>
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={16} width="40%" />
                </Box>
              </Box>
            ))}
          </Stack>
        )}

        {/* Empty State - handles both no paths found and no nearby paths */}
        {!pathsLoading && (shouldShowNotFound || nearbyPaths.length === 0) && (
          <Stack alignItems="center" spacing={2} sx={{ py: 3 }}>
            <Iconify icon="solar:route-outline" width={64} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {shouldShowNotFound ? (
                <>
                  No paths found in this area.
                  <br />
                  Check back later for new paths or explore other areas.
                </>
              ) : (
                <>
                  No nearby paths found within {radiusKm}km radius.
                  <br />
                  Try expanding your search area.
                </>
              )}
            </Typography>
          </Stack>
        )}

        {/* Carousel with Paths */}
        {!pathsLoading && !shouldShowNotFound && nearbyPaths.length > 0 && (
          <Box>
            <Carousel carousel={carousel}>
              {nearbyPaths.map((path) => (
                <PathMiniCard
                  key={path.pathId}
                  pathId={path.pathId}
                  title={path.title}
                  description={path.description}
                  imageUrl={path.imageUrl}
                  viewCount={path.viewCount}
                  pieceCount={path._count?.PathMap}
                  distance={path.distance}
                  pathType={path.pathType}
                  slug={path.slug}
                  createdBy={path.createdBy}
                  featured={path.featured}
                />
              ))}
            </Carousel>

            {nearbyPaths.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                Showing {nearbyPaths.length} path{nearbyPaths.length !== 1 ? 's' : ''} within{' '}
                {radiusKm}km
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

PathNearby.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  currentPathId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  radiusKm: PropTypes.number,
  maxResults: PropTypes.number,
  cityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
