/**
 * @namespace CityArtWalks.Sections.Artist.ArtistNotFoundView
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Sections.Artist
 * @description Artist not found view component that displays when a requested artist cannot be found.
 * Provides user-friendly messaging and navigation options.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Sections.Artist.ArtistNotFoundView
 * @function ArtistNotFoundView
 * @description Displays a user-friendly "artist not found" message with navigation options
 *
 * @param {Object} props - Component props
 * @param {string} [props.slug] - The artist slug that was not found
 * @returns {JSX.Element} The rendered ArtistNotFoundView component
 */
export function ArtistNotFoundView({ slug }) {
  const theme = useTheme();

  // Debug log to verify component is being called
  console.log('ArtistNotFoundView rendering with slug:', slug);

  const handleGoToArtists = () => {
    window.location.href = paths.art.artist.list;
  };

  const handleGoHome = () => {
    window.location.href = paths.home;
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          py: 12,
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
        data-testid="artist-not-found-view"
      >
        {/* 404 Icon */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.error.main, 0.08),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Iconify icon="solar:user-broken" width={64} sx={{ color: theme.palette.error.main }} />
        </Box>

        {/* Main Message */}
        <Typography variant="h3" sx={{ mb: 2 }}>
          Artist Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          {slug ? (
            <>
              The artist you are looking for does not exist or may have been removed.
              <br />
              <Typography component="span" variant="body2" color="text.disabled">
                Artist: {slug}
              </Typography>
            </>
          ) : (
            'The artist you are looking for does not exist or may have been removed.'
          )}
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            maxWidth: 320,
          }}
        >
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleGoToArtists}
            startIcon={<Iconify icon="solar:users-group-rounded-bold" width={20} />}
            sx={{
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Browse Artists
          </Button>

          <Button
            fullWidth
            size="large"
            variant="outlined"
            onClick={handleGoHome}
            startIcon={<Iconify icon="solar:home-bold" width={20} />}
            sx={{
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Go Home
          </Button>
        </Box>

        {/* Additional Info */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.08),
            border: `1px solid ${alpha(theme.palette.info.main, 0.24)}`,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>What you can do:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ m: 0, pl: 2 }}>
            <li>Check the URL for typos</li>
            <li>Browse our featured artists</li>
            <li>Search for art pieces by this artist</li>
            <li>Explore art in your area</li>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

ArtistNotFoundView.propTypes = {
  slug: PropTypes.string,
};
