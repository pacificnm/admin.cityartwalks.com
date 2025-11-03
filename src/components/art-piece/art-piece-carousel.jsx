/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceCarousel
 * @version 1.0.3
 * @author Jaimie Garner
 */

'use client';

import { useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';

import { useGetPaginatedArtPieces } from 'src/actions/art-piece';

import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  CarouselArrowFloatButtons,
} from 'src/components/carousel';

import { ArtPieceCarouselSkeleton } from 'src/sections/art';

import { useAuthContext } from 'src/auth/hooks';

import { ArtPieceCard } from '.';
import { ErrorView } from '../error';
import ErrorBoundary from '../error/error-boundary';
import { ArtPieceCarouselEmpty } from './art-piece-carousel-empty';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCarousel
 * @description ArtPieceCarousel displays a responsive carousel of featured art pieces for a given location.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.location - The location object.
 * @param {string} props.location.countryId - The country ID for fetching data.
 * @param {string} props.location.stateId - The state ID for fetching data.
 * @param {string} props.location.cityId - The city ID for fetching data.
 * @param {string} [props.location.city] - Optional city name for display purposes.
 *
 * @returns {JSX.Element} The ArtPieceCarousel component.
 */
export function ArtPieceCarousel({ location }) {
  const { accessToken } = useAuthContext();

  const {
    artPieces = [],
    artPiecesLoading,
    artPiecesError,
    artPiecesEmpty,
  } = useGetPaginatedArtPieces(
    {
      featured: true,
      cityId: location.cityId,
      stateId: location.stateId,
      countryId: location.countryId,
    },
    1, // First page
    32, // 32 items per page
    accessToken ?? '',
    3600 // Cache time in seconds
  );

  const [carouselConfig, setCarouselConfig] = useState({
    slidesToShow: '25%',
    slidesToScroll: 4,
  });

  useEffect(() => {
    const updateConfig = () => {
      if (typeof window === 'undefined') return;

      const isMobile = window.innerWidth <= 600;
      setCarouselConfig({
        slidesToShow: isMobile ? '100%' : '25%',
        slidesToScroll: isMobile ? 1 : 4,
      });
    };

    updateConfig();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateConfig);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateConfig);
      }
    };
  }, []);

  const carousel = useCarousel({
    dragFree: true,
    loop: false,
    ...carouselConfig,
    slideSpacing: '16px',
  });

  if (artPiecesLoading) return <ArtPieceCarouselSkeleton />;
  if (artPiecesError) return <ErrorView message="Failed to load featured art pieces" />;

  // Show empty state when no art pieces are found
  if (artPiecesEmpty || artPieces.length === 0) {
    return <ArtPieceCarouselEmpty location={location} />;
  }

  return (
    <ErrorBoundary>
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Local favorites near {location.city || 'your area'}
        </Typography>

        <Carousel carousel={carousel} slotProps={{ slide: { borderRadius: 2 } }}>
          {artPieces.map((artPiece, index) => (
            <ArtPieceCard
              key={artPiece.artPieceId}
              index={index}
              title={artPiece.title}
              description={artPiece.description}
              artistName={artPiece.Artist?.name || 'Unknown Artist'}
              artPieceImageUrl={artPiece.imageUrl || '/assets/images/mock/cover/cover-1.webp'}
              artistImageUrl={
                artPiece.Artist?.imageUrl || '/assets/images/mock/avatar/avatar-1.webp'
              }
              artPieceSlug={artPiece.slug}
              artistSlug={artPiece.Artist?.slug || ''}
              viewCount={artPiece.viewCount || 0}
              imageCount={artPiece._count?.Image || 0}
              favoriteCount={artPiece._count?.UserFavoriteArtPiece || 0}
              status={artPiece.status}
              createdBy={artPiece.createdBy}
            />
          ))}
        </Carousel>

        <CarouselArrowFloatButtons {...carousel.arrows} options={carousel.options} />
      </Box>

      <CarouselDotButtons
        scrollSnaps={carousel.dots.scrollSnaps}
        selectedIndex={carousel.dots.selectedIndex}
        onClickDot={carousel.dots.onClickDot}
        sx={{ width: 1, justifyContent: 'center', mt: 3 }}
      />
    </ErrorBoundary>
  );
}
