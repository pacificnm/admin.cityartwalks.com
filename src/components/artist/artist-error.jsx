/**
 * @file artist-error.jsx
 * @description Error display component for artist-related errors
 * @namespace CityArtWalks.Components.Artist
 * @version 1.0.0
 * @author Jaimie Garner
 */

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/**
 * @description Component for displaying artist-related errors in a styled error box
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistError
 * @param {Object} props - Component props
 * @param {Error|Object|null} props.error - Error object to display
 * @returns {JSX.Element|null} The Artist Error component or null if no error.
 */
export function ArtistError({ error }) {
  if (!error) return null;

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
      <Box sx={{ color: 'error.main' }}>
        Error loading artists: {error.message || 'Unknown error'}
      </Box>
    </Box>
  );
}
