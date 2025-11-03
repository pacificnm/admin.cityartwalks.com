'use client';

import { Box, Skeleton, Typography } from '@mui/material';

export function ArtPieceCarouselSkeleton() {
  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        <Skeleton width="50%" />
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'hidden',
        }}
      >
        {[...Array(4)].map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: '0 0 25%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
            <Skeleton width="80%" sx={{ mt: 1 }} />
            <Skeleton width="60%" sx={{ mt: 0.5 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
