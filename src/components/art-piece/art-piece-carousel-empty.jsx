/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceCarouselEmpty
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { Box, Card, Button, Typography, CardContent } from '@mui/material';

import { paths } from 'src/routes/paths';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCarouselEmpty
 * @description Empty state component for ArtPieceCarousel when no featured art pieces are found.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.location - The location object.
 * @param {string} [props.location.city] - Optional city name for display purposes.
 *
 * @returns {JSX.Element} The ArtPieceCarouselEmpty component.
 */
export function ArtPieceCarouselEmpty({ location }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Local favorites near {location?.city || 'your area'}
      </Typography>

      <Card
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: 'background.neutral',
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
            No Featured Art Pieces Yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            There are no featured art pieces in {location?.city || 'this area'} yet. Be the first to
            add and feature amazing outdoor art in your community!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" href={paths.art.home} sx={{ textTransform: 'none' }}>
              Explore All Art
            </Button>
            <Button variant="contained" href={paths.artPiece.home} sx={{ textTransform: 'none' }}>
              Add Art Piece
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
