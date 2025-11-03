/**
 * @namespace CityArtWalks.Components.ArtPiece.Nearby
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Components.ArtPiece
 * @description Component that displays nearby art pieces in a carousel format.
 * Uses the viewport API to fetch art pieces around the current art piece's location.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { debugLog } from 'src/lib/debug';
import { useArtPieceCartContext } from 'src/contexts/art-piece-cart';
import { useGetArtPieceByViewport } from 'src/actions/art-piece/hooks';

import { toast } from 'src/components/snackbar';
import { UserSignUpDialog } from 'src/components/user';
import { ProductUpgradeDialog } from 'src/components/product';
import { MapPointIcon, CartPlusIcon, NetworkOffIcon } from 'src/components/icons';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

import { useAuthContext } from 'src/auth/hooks';

import { ArtPieceMiniCard } from './art-piece-mini-card';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceNearby
 * @function ArtPieceNearby
 * @description Displays nearby art pieces in a carousel format using the viewport API.
 * Calculates distance and shows the 8 closest art pieces excluding the current one.
 *
 * @param {Object} props - Component props
 * @param {number} props.latitude - Current art piece latitude
 * @param {number} props.longitude - Current art piece longitude
 * @param {string|number} props.currentArtPieceId - ID of current art piece to exclude
 * @param {string} [props.title='Nearby Art Pieces'] - Section title
 * @param {number} [props.radiusKm=5] - Search radius in kilometers
 * @param {number} [props.maxResults=8] - Maximum number of results to show
 * @param {Object} [props.sx] - Additional styling
 * @returns {JSX.Element} The rendered ArtPieceNearby component
 */
export function ArtPieceNearby({
  latitude,
  longitude,
  currentArtPieceId,
  title = 'Nearby Art Pieces',
  radiusKm = 5,
  maxResults = 16,
  sx,
}) {
  const { accessToken, user } = useAuthContext();
  const { onAddMultipleArtPieces } = useArtPieceCartContext();
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const currentRole = user?.role;
  const normalizedRole = currentRole ? String(currentRole).toUpperCase() : 'PUBLIC';
  const isPublicUser = !currentRole || normalizedRole === 'PUBLIC';
  const isUserRole = normalizedRole === 'USER';

  // Calculate viewport bounds based on radius
  const viewport = useMemo(() => {
    if (!latitude || !longitude) return null;

    // Rough conversion: 1 degree ≈ 111km
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

    return {
      swLat: latitude - latDelta,
      swLng: longitude - lngDelta,
      neLat: latitude + latDelta,
      neLng: longitude + lngDelta,
      zoom: 12,
    };
  }, [latitude, longitude, radiusKm]);

  // Fetch art pieces in viewport
  const { artPieces, artPiecesLoading, artPiecesError } = useGetArtPieceByViewport(
    viewport,
    '', // no search filter
    accessToken,
    600 // 10 minute cache
  ); // Calculate distances and filter out current art piece
  const nearbyArtPieces = useMemo(() => {
    if (!artPieces || !latitude || !longitude) return [];

    const filtered = artPieces
      .filter(
        (piece) => piece.artPieceId !== currentArtPieceId && piece.latitude && piece.longitude
      )
      .map((piece) => {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = ((piece.latitude - latitude) * Math.PI) / 180;
        const dLng = ((piece.longitude - longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latitude * Math.PI) / 180) *
            Math.cos((piece.latitude * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return {
          ...piece,
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults);

    return filtered;
  }, [artPieces, latitude, longitude, currentArtPieceId, maxResults]);

  // Handle button click with role checking
  const handleAddAllClick = () => {
    if (isPublicUser) {
      setSignupDialogOpen(true);
      return;
    }
    if (isUserRole) {
      setUpgradeDialogOpen(true);
      return;
    }
    // Only MEMBER and ADMIN can add to cart
    handleAddAllToCart();
  };

  // Handle adding all nearby art pieces to cart
  const handleAddAllToCart = () => {
    debugLog(
      'ArtPieceNearby.handleAddAllToCart',
      'Adding nearby art pieces to cart',
      nearbyArtPieces.length
    );

    // Prepare all cart items for batch addition
    const cartItems = nearbyArtPieces.map((artPiece) => ({
      // Core identifiers
      artPieceId: artPiece.artPieceId,
      artistId: artPiece.Artist?.artistId || artPiece.artistId,

      // Basic info
      title: artPiece.name || artPiece.title,
      artistName: artPiece.Artist?.name || 'Unknown Artist',
      description: artPiece.description || '',

      // Location
      latitude: artPiece.latitude,
      longitude: artPiece.longitude,

      // Navigation slugs
      artPieceSlug: artPiece.slug,
      artistSlug: artPiece.Artist?.slug,

      // Images
      image: artPiece.imageUrl,
      artPieceImageUrl: artPiece.imageUrl,
      artistImageUrl: artPiece.Artist?.image || '',

      // Counts
      viewCount: artPiece.viewCount || 0,
      favoriteCount: artPiece.favoriteCount || 0,
      imageCount: artPiece.imageCount || 1,
    }));

    debugLog(
      'ArtPieceNearby.handleAddAllToCart',
      'Cart items prepared for batch addition',
      cartItems
    );

    // Add all items in a single operation
    const addedCount = onAddMultipleArtPieces(cartItems);

    debugLog('ArtPieceNearby.handleAddAllToCart', 'Total added count', addedCount);

    // Show feedback toast
    if (addedCount > 0) {
      toast.success(`Added ${addedCount} art piece${addedCount !== 1 ? 's' : ''} to your path!`);
    } else {
      toast.info('All nearby art pieces are already in your path');
    }
  };

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

  // Error state
  if (artPiecesError) {
    return (
      <Card sx={sx}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <MapPointIcon size={24} sx={{ color: 'error.main' }} />
              <Typography variant="h6">{title}</Typography>
            </Stack>
          }
        />
        <CardContent>
          <Stack alignItems="center" spacing={2} sx={{ py: 3 }}>
            <NetworkOffIcon size={64} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              Unable to load nearby art pieces. Please try again later.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={sx}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <MapPointIcon size={24} sx={{ color: 'primary.main' }} />
            <Typography variant="h6">{title}</Typography>
          </Stack>
        }
        action={
          !artPiecesLoading &&
          nearbyArtPieces.length > 0 && (
            <Button
              size="small"
              variant="contained"
              onClick={handleAddAllClick}
              startIcon={<CartPlusIcon size={16} />}
              sx={{
                fontSize: '0.75rem',
                height: 32,
                minWidth: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              Add All to Path
            </Button>
          )
        }
      />

      <CardContent>
        {/* Loading State */}
        {artPiecesLoading && (
          <Stack direction="row" spacing={2}>
            {[...Array(4)].map((_, index) => (
              <Box key={index} sx={{ width: 240, flexShrink: 0 }}>
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
                <Box sx={{ pt: 1 }}>
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={16} width="40%" />
                </Box>
              </Box>
            ))}
          </Stack>
        )}

        {/* Empty State */}
        {!artPiecesLoading && nearbyArtPieces.length === 0 && (
          <Stack alignItems="center" spacing={2} sx={{ py: 3 }}>
            <MapPointIcon size={64} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No nearby art pieces found within {radiusKm}km radius.
              <br />
              Try expanding your search area.
            </Typography>
          </Stack>
        )}

        {/* Carousel with Art Pieces */}
        {!artPiecesLoading && nearbyArtPieces.length > 0 && (
          <Box sx={{ position: 'relative' }}>
            <Carousel carousel={carousel}>
              {nearbyArtPieces.map((artPiece) => (
                <ArtPieceMiniCard
                  key={artPiece.artPieceId}
                  artPieceId={artPiece.artPieceId}
                  title={artPiece.name || artPiece.title}
                  artistName={artPiece.Artist?.name || 'Unknown Artist'}
                  artPieceImageUrl={artPiece.imageUrl}
                  artistImageUrl={artPiece.Artist?.image}
                  artPieceSlug={artPiece.slug}
                  artistSlug={artPiece.Artist?.slug}
                  viewCount={artPiece.viewCount}
                  distance={artPiece.distance}
                />
              ))}
            </Carousel>

            <CarouselArrowFloatButtons {...carousel.arrows} options={carousel.options} />

            {nearbyArtPieces.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Showing {nearbyArtPieces.length} art piece{nearbyArtPieces.length !== 1 ? 's' : ''}{' '}
                within {radiusKm}km
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* Dialog components */}
      <UserSignUpDialog open={signupDialogOpen} onClose={() => setSignupDialogOpen(false)} />
      <ProductUpgradeDialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        showUpgradeButton={false}
      />
    </Card>
  );
}

ArtPieceNearby.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  currentArtPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  radiusKm: PropTypes.number,
  maxResults: PropTypes.number,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
