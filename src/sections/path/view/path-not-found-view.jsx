/**
 * @namespace CityArtWalks.Sections.Path.PathNotFoundView
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Sections.Path
 * @description Path not found view component that displays when a requested path cannot be found.
 * Provides user-friendly messaging and navigation options.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Model} - Path documentation
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
 * @memberof CityArtWalks.Sections.Path.PathNotFoundView
 * @function PathNotFoundView
 * @description Displays a user-friendly "path not found" message with navigation options
 *
 * @param {Object} props - Component props
 * @param {string} [props.slug] - The path slug that was not found
 * @returns {JSX.Element} The rendered PathNotFoundView component
 */
export function PathNotFoundView({ slug }) {
  const theme = useTheme();

  const handleGoToPaths = () => {
    window.location.href = paths.path.home;
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
          <Iconify icon="solar:route-broken" width={64} sx={{ color: theme.palette.error.main }} />
        </Box>

        {/* Main Message */}
        <Typography variant="h3" sx={{ mb: 2 }}>
          Path Not Found
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
              The walking path you are looking for does not exist or may have been removed.
              <br />
              <Typography component="span" variant="body2" color="text.disabled">
                Path: {slug}
              </Typography>
            </>
          ) : (
            'The walking path you are looking for does not exist or may have been removed.'
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
            onClick={handleGoToPaths}
            startIcon={<Iconify icon="solar:route-bold" width={20} />}
            sx={{
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Browse Paths
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
            <li>Browse our available walking paths</li>
            <li>Search for art pieces in your area</li>
            <li>Create your own custom path</li>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

PathNotFoundView.propTypes = {
  slug: PropTypes.string,
};
