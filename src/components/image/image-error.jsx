/**
 * @file image-error-admin.jsx
 * @description Error display component for image-related errors
 * @namespace CityArtWalks.Components.Image
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/**
 * @description Component for displaying image-related errors in a styled error box
 * @memberof CityArtWalks.Components.Image
 * @function ImageError
 * @param {Object} props - Component props
 * @param {Error|Object|null} props.error - Error object to display
 * @returns {JSX.Element|null} The Image Error component or null if no error.
 */
export function ImageError({ error }) {
  if (!error) return null;

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
      <Box sx={{ color: 'error.main' }}>
        Error loading images: {error.message || 'Unknown error'}
      </Box>
    </Box>
  );
}
