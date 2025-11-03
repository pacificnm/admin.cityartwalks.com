'use client';

import { Suspense } from 'react';
import { useIsClient } from 'minimal-shared/hooks';
import { Map as MapboxMap } from 'react-map-gl/mapbox';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function Map({ sx, ...other }) {
  const isClient = useIsClient();

  // Merge default styles with passed sx to allow height override
  const mergedSx = {
    width: '100%',
    height: '600px', // Default fallback height
    overflow: 'hidden',
    position: 'relative',
    ...sx, // This allows height override from parent components
  };

  const renderFallback = () => (
    <Skeleton
      variant="rectangular"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
      }}
    />
  );

  return (
    <Box sx={mergedSx}>
      {isClient ? (
        <Suspense fallback={renderFallback()}>
          <MapboxMap
            {...other}
            mapboxAccessToken={CONFIG.mapboxApiKey}
            initialViewState={other.initialViewState}
            mapStyle={other.mapStyle}
          />
        </Suspense>
      ) : (
        renderFallback()
      )}
    </Box>
  );
}
