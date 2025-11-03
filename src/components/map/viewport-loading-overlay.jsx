/**
 * @fileoverview Loading overlay component for viewport-based map loading
 * @author CityArtWalks Development Team
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Map.ViewportLoadingOverlay
 */

import { useTheme } from '@mui/material/styles';
import { Box, Fade, Typography, CircularProgress } from '@mui/material';

import { useMapViewport } from 'src/hooks/use-map-viewport';

/**
 * @memberof CityArtWalks.Components.Map.ViewportLoadingOverlay
 * @function ViewportLoadingOverlay
 * @description Loading overlay that appears during viewport changes to indicate data fetching
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.show] - Override to force show/hide the overlay
 * @param {string} [props.message] - Custom loading message
 * @returns {JSX.Element} The rendered loading overlay
 */
export function ViewportLoadingOverlay({ show, message = 'Loading art pieces...' }) {
  const theme = useTheme();
  const { isMoving } = useMapViewport();

  // Show overlay when map is moving or explicitly requested
  const shouldShow = show !== undefined ? show : isMoving;

  return (
    <Fade in={shouldShow} timeout={200}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
          pointerEvents: shouldShow ? 'auto' : 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[8],
          }}
        >
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}
