/**
 * @fileoverview Debug component for displaying viewport information
 * @author CityArtWalks Development Team
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Debug.ViewportDebugInfo
 */

import { useTheme } from '@mui/material/styles';
import { Box, Chip, Typography } from '@mui/material';

import { useMapViewport } from 'src/hooks/use-map-viewport';

/**
 * @memberof CityArtWalks.Components.Debug.ViewportDebugInfo
 * @function ViewportDebugInfo
 * @description Debug component that displays current viewport information
 * Only renders in development mode
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.show=false] - Whether to show the debug info
 * @param {string} [props.position='top-right'] - Position of the debug panel
 * @returns {JSX.Element|null} The rendered debug info or null
 */
export function ViewportDebugInfo({ show = false, position = 'top-right' }) {
  const theme = useTheme();
  const { viewport, stableViewport, isMoving } = useMapViewport();

  // Only show in development and when explicitly enabled
  if (!show || process.env.NODE_ENV === 'production') {
    return null;
  }

  const positionStyles = {
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
  };

  const formatCoord = (num) => num?.toFixed(4) || 'N/A';

  return (
    <Box
      sx={{
        position: 'absolute',
        ...positionStyles[position],
        zIndex: 1001,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        padding: 2,
        minWidth: 200,
        fontSize: '0.75rem',
        fontFamily: 'monospace',
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Viewport Debug
      </Typography>

      <Box sx={{ mb: 1 }}>
        <Chip
          label={isMoving ? 'Moving' : 'Stable'}
          size="small"
          color={isMoving ? 'warning' : 'success'}
          sx={{ mb: 1 }}
        />
      </Box>

      {viewport && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" display="block" gutterBottom>
            Current Viewport:
          </Typography>
          <Typography variant="caption" display="block">
            SW: {formatCoord(viewport.swLat)}, {formatCoord(viewport.swLng)}
          </Typography>
          <Typography variant="caption" display="block">
            NE: {formatCoord(viewport.neLat)}, {formatCoord(viewport.neLng)}
          </Typography>
          <Typography variant="caption" display="block">
            Center: {formatCoord(viewport.lat)}, {formatCoord(viewport.lng)}
          </Typography>
          <Typography variant="caption" display="block">
            Zoom: {viewport.zoom?.toFixed(2)}
          </Typography>
        </Box>
      )}

      {stableViewport && (
        <Box>
          <Typography variant="caption" display="block" gutterBottom>
            Stable Viewport (API):
          </Typography>
          <Typography variant="caption" display="block">
            SW: {formatCoord(stableViewport.swLat)}, {formatCoord(stableViewport.swLng)}
          </Typography>
          <Typography variant="caption" display="block">
            NE: {formatCoord(stableViewport.neLat)}, {formatCoord(stableViewport.neLng)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
