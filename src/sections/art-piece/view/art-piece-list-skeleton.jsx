/**
 * @fileoverview Art Piece List Skeleton Component
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.ArtPiece.View
 */

'use client';

import { Box, Grid, Skeleton, Container } from '@mui/material';

/**
 * Art Piece List Skeleton Component
 *
 * Provides loading skeleton for the art piece list view while data is being fetched.
 *
 * @memberof CityArtWalks.Sections.ArtPiece.View
 * @function ArtPieceListSkeleton
 * @returns {JSX.Element} The rendered skeleton component
 */
export function ArtPieceListSkeleton() {
  return (
    <Container maxWidth={false} sx={{ mb: 4 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
      </Box>

      {/* Toolbar Skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" height={60} />
      </Box>

      {/* Grid Skeleton */}
      <Grid container spacing={3}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
