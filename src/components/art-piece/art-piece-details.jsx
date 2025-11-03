/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceDetails
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Components.ArtPiece
 * @description Art piece details card component that displays additional information about an art piece
 * including creator, location, installation date, and other metadata in a styled card format.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { UserBadge } from 'src/components/user/user-badge';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceDetails
 * @function ArtPieceDetails
 * @description Displays detailed information about an art piece in a card format
 *
 * @param {Object} props - Component props
 * @param {string|number} props.artPieceId - The art piece ID
 * @param {string|number} props.createdBy - The user ID who created the art piece
 * @param {string|Date} props.createdAt - When the art piece was created
 * @param {number} [props.latitude] - Latitude coordinate
 * @param {number} [props.longitude] - Longitude coordinate
 * @param {string|Date} [props.installationDate] - When the art piece was installed
 * @param {string} [props.artistName] - Name of the artist
 * @param {string} [props.country] - Country location
 * @param {string} [props.state] - State/region location
 * @param {string} [props.city] - City location
 * @returns {JSX.Element} The rendered ArtPieceDetails component
 */
export function ArtPieceDetails(props) {
  const {
    artPieceId,
    createdBy,
    createdAt,
    latitude,
    longitude,
    installationDate,
    artistName,
    country,
    state,
    city,
  } = props;

  const theme = useTheme();

  // Format location string
  const locationString = [city, state, country].filter(Boolean).join(', ');

  // Check if coordinates are available
  const hasCoordinates = latitude && longitude;

  return (
    <Card
      sx={{
        boxShadow: theme.shadows[3],
        borderRadius: 2,
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)',
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
        },
      }}
    >
      <CardHeader
        title="Art Piece Details"
        sx={{
          pb: 1,
          '& .MuiCardHeader-title': {
            fontSize: '1.1rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
          },
        }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={3}>
          {/* Creator Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                color: theme.palette.text.secondary,
                fontWeight: 600,
              }}
            >
              Created By
            </Typography>
            <UserBadge userId={createdBy} size="medium" />
          </Box>

          <Divider />

          {/* Art Information */}
          <Stack spacing={2}>
            {artistName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:user-speak-bold"
                  width={20}
                  sx={{ color: theme.palette.primary.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Artist
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {artistName}
                  </Typography>
                </Box>
              </Box>
            )}

            {createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:calendar-bold"
                  width={20}
                  sx={{ color: theme.palette.info.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Created
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {fDate(createdAt)}
                  </Typography>
                </Box>
              </Box>
            )}

            {installationDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:hammer-bold"
                  width={20}
                  sx={{ color: theme.palette.warning.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Installed
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {fDate(installationDate)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Stack>

          {/* Location Section */}
          {(locationString || hasCoordinates) && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Iconify
                    icon="solar:map-point-bold"
                    width={18}
                    sx={{ color: theme.palette.error.main }}
                  />
                  Location
                </Typography>

                <Stack spacing={1.5}>
                  {locationString && (
                    <Typography variant="body2" fontWeight="medium">
                      {locationString}
                    </Typography>
                  )}

                  {hasCoordinates && (
                    <Box>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          label={`Lat: ${latitude.toFixed(6)}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            borderColor: alpha(theme.palette.primary.main, 0.24),
                          }}
                        />
                        <Chip
                          label={`Lng: ${longitude.toFixed(6)}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            borderColor: alpha(theme.palette.primary.main, 0.24),
                          }}
                        />
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Box>
            </>
          )}

          {/* Art Piece ID */}
          <Box
            sx={{
              pt: 1,
              borderTop: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
            }}
          >
            <Typography variant="caption" color="text.disabled">
              Art Piece ID: {artPieceId}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

ArtPieceDetails.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  installationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  artistName: PropTypes.string,
  country: PropTypes.string,
  state: PropTypes.string,
  city: PropTypes.string,
};
