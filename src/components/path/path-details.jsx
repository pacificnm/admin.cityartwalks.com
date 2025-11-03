/**
 * @namespace CityArtWalks.Components.Path.PathDetails
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Components.Path
 * @description Path details card component that displays additional information about a walking path
 * including creator, location, creation date, distance, duration and other metadata in a styled card format.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Model} - Path documentation
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
import { ViewIcon, StarIcon } from 'src/components/icons';
import { UserBadge } from 'src/components/user/user-badge';

/**
 * @memberof CityArtWalks.Components.Path.PathDetails
 * @function PathDetails
 * @description Displays detailed information about a walking path in a card format
 *
 * @param {Object} props - Component props
 * @param {string|number} props.pathId - The path ID
 * @param {string|number} props.createdBy - The user ID who created the path
 * @param {string|Date} props.createdAt - When the path was created
 * @param {number} [props.distance] - Path distance in kilometers
 * @param {number} [props.duration] - Path duration in minutes
 * @param {string} [props.pathType] - Type of path (walking, cycling, etc.)
 * @param {string} [props.country] - Country location
 * @param {string} [props.state] - State/region location
 * @param {string} [props.city] - City location
 * @param {number} [props.viewCount] - Number of views
 * @param {number} [props.pieceCount] - Number of art pieces on the path
 * @param {boolean} [props.featured] - Whether the path is featured
 * @returns {JSX.Element} The rendered PathDetails component
 */
export function PathDetails(props) {
  const {
    pathId,
    createdBy,
    createdAt,
    distance,
    duration,
    pathType,
    country,
    state,
    city,
    viewCount,
    pieceCount,
    featured,
  } = props;

  const theme = useTheme();

  // Format location string
  const locationString = [city, state, country].filter(Boolean).join(', ');

  // Format distance
  const formatDistance = (dist) => {
    if (!dist) return null;
    return dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(2)}km`;
  };

  // Format duration
  const formatDuration = (dur) => {
    if (!dur) return null;
    const hours = Math.floor(dur / 60);
    const minutes = Math.round(dur % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

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
        title="Path Details"
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

          {/* Path Information */}
          <Stack spacing={2}>
            {pathType && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:walking-bold"
                  width={20}
                  sx={{ color: theme.palette.primary.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Path Type
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {pathType.charAt(0).toUpperCase() + pathType.slice(1).toLowerCase()}
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

            {distance && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:ruler-bold"
                  width={20}
                  sx={{ color: theme.palette.warning.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Distance
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDistance(distance)}
                  </Typography>
                </Box>
              </Box>
            )}

            {duration && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:clock-circle-bold"
                  width={20}
                  sx={{ color: theme.palette.success.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Duration
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatDuration(duration)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Stack>

          {/* Statistics Section */}
          {(viewCount !== undefined || pieceCount !== undefined) && (
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
                    icon="solar:chart-2-bold"
                    width={18}
                    sx={{ color: theme.palette.info.main }}
                  />
                  Statistics
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {viewCount !== undefined && (
                    <Chip
                      icon={<ViewIcon width={16} />}
                      label={`${viewCount} views`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        bgcolor: alpha(theme.palette.info.main, 0.08),
                        borderColor: alpha(theme.palette.info.main, 0.24),
                      }}
                    />
                  )}
                  {pieceCount !== undefined && (
                    <Chip
                      icon={<Iconify icon="solar:gallery-bold" width={16} />}
                      label={`${pieceCount} pieces`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        borderColor: alpha(theme.palette.primary.main, 0.24),
                      }}
                    />
                  )}
                  {featured && (
                    <Chip
                      icon={<StarIcon size={16} />}
                      label="Featured"
                      size="small"
                      variant="filled"
                      color="warning"
                      sx={{
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </>
          )}

          {/* Location Section */}
          {locationString && (
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

                <Typography variant="body2" fontWeight="medium">
                  {locationString}
                </Typography>
              </Box>
            </>
          )}

          {/* Path ID */}
          <Box
            sx={{
              pt: 1,
              borderTop: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
            }}
          >
            <Typography variant="caption" color="text.disabled">
              Path ID: {pathId}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

PathDetails.propTypes = {
  pathId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  distance: PropTypes.number,
  duration: PropTypes.number,
  pathType: PropTypes.string,
  country: PropTypes.string,
  state: PropTypes.string,
  city: PropTypes.string,
  viewCount: PropTypes.number,
  pieceCount: PropTypes.number,
  featured: PropTypes.bool,
};
