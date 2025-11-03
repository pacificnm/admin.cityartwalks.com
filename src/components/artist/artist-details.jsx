/**
 * @namespace CityArtWalks.Components.Artist.ArtistDetails
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Artist
 * @description Artist details card component that displays additional information about an artist
 * including creator, location, birth/death dates, social media, and other metadata in a styled card format.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist-Model} - Artist documentation
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
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { UserBadge } from 'src/components/user/user-badge';
import { ViewIcon, StarIcon, Facebook, ShareIcon, FavoriteIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistDetails
 * @function ArtistDetails
 * @description Displays detailed information about an artist in a card format
 *
 * @param {Object} props - Component props
 * @param {string|number} props.artistId - The artist ID
 * @param {string|number} props.createdBy - The user ID who created the artist profile
 * @param {string|Date} props.createdAt - When the artist profile was created
 * @param {string|Date} props.updatedAt - When the artist profile was last updated
 * @param {string|Date} [props.birthDate] - Artist's birth date
 * @param {string|Date} [props.deathDate] - Artist's death date
 * @param {string} [props.nationality] - Artist's nationality
 * @param {string} [props.website] - Artist's website URL
 * @param {string} [props.facebook] - Artist's Facebook profile
 * @param {string} [props.instagram] - Artist's Instagram handle
 * @param {number} [props.viewCount] - Number of profile views
 * @param {boolean} [props.featured] - Whether the artist is featured
 * @param {string} [props.status] - Artist profile status (ACTIVE, INACTIVE, etc.)
 * @param {string} [props.country] - Country location
 * @param {string} [props.state] - State/region location
 * @param {string} [props.city] - City location
 * @param {number} [props.artPieceCount] - Number of art pieces by this artist
 * @param {number} [props.favoriteCount] - Number of times artist has been favorited
 * @returns {JSX.Element} The rendered ArtistDetails component
 */
export function ArtistDetails(props) {
  const {
    artistId,
    createdBy,
    createdAt,
    updatedAt,
    birthDate,
    deathDate,
    nationality,
    website,
    facebook,
    instagram,
    viewCount,
    featured,
    status,
    country,
    state,
    city,
    artPieceCount,
    favoriteCount,
  } = props;

  const theme = useTheme();

  // Format location string
  const locationString = [city, state, country].filter(Boolean).join(', ');

  // Calculate age or years since death
  const getLifespan = () => {
    if (birthDate && deathDate) {
      const birth = new Date(birthDate).getFullYear();
      const death = new Date(deathDate).getFullYear();
      return `${birth} - ${death} (${death - birth} years)`;
    }
    if (birthDate && !deathDate) {
      const birth = new Date(birthDate).getFullYear();
      const current = new Date().getFullYear();
      return `Born ${birth} (${current - birth} years old)`;
    }
    return null;
  };

  const lifespan = getLifespan();

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
        title="Artist Details"
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

          {/* Artist Information */}
          <Stack spacing={2}>
            {lifespan && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:calendar-bold"
                  width={20}
                  sx={{ color: theme.palette.primary.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Lifespan
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {lifespan}
                  </Typography>
                </Box>
              </Box>
            )}

            {nationality && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:flag-bold"
                  width={20}
                  sx={{ color: theme.palette.info.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Nationality
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {nationality}
                  </Typography>
                </Box>
              </Box>
            )}

            {createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:add-circle-bold"
                  width={20}
                  sx={{ color: theme.palette.success.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Profile Created
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {fDate(createdAt)}
                  </Typography>
                </Box>
              </Box>
            )}

            {updatedAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Iconify
                  icon="solar:refresh-bold"
                  width={20}
                  sx={{ color: theme.palette.warning.main }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {fDate(updatedAt)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Stack>

          {/* Social Media Section */}
          {(website || facebook || instagram) && (
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
                  <ShareIcon size={18} sx={{ color: theme.palette.primary.main }} />
                  Social Media
                </Typography>{' '}
                <Stack direction="row" spacing={1}>
                  {website && (
                    <IconButton
                      size="small"
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.16),
                        },
                      }}
                    >
                      <Iconify icon="solar:global-bold" width={20} />
                    </IconButton>
                  )}
                  {facebook && (
                    <IconButton
                      size="small"
                      href={
                        facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        bgcolor: alpha('#1877F2', 0.08),
                        '&:hover': {
                          bgcolor: alpha('#1877F2', 0.16),
                        },
                      }}
                    >
                      <Facebook size={20} />
                    </IconButton>
                  )}
                  {instagram && (
                    <IconButton
                      size="small"
                      href={
                        instagram.startsWith('http')
                          ? instagram
                          : `https://instagram.com/${instagram}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        bgcolor: alpha('#E4405F', 0.08),
                        '&:hover': {
                          bgcolor: alpha('#E4405F', 0.16),
                        },
                      }}
                    >
                      <Iconify icon="ant-design:instagram-filled" width={20} />
                    </IconButton>
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

          {/* Statistics Section */}
          {(viewCount !== undefined ||
            artPieceCount !== undefined ||
            favoriteCount !== undefined) && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1.5,
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                  }}
                >
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
                  {artPieceCount !== undefined && (
                    <Chip
                      icon={<Iconify icon="solar:palette-bold" width={16} />}
                      label={`${artPieceCount} artworks`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        bgcolor: alpha(theme.palette.success.main, 0.08),
                        borderColor: alpha(theme.palette.success.main, 0.24),
                      }}
                    />
                  )}
                  {favoriteCount !== undefined && (
                    <Chip
                      icon={<FavoriteIcon filled size={16} />}
                      label={`${favoriteCount} favorites`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                        borderColor: alpha(theme.palette.error.main, 0.24),
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </>
          )}

          {/* Status Badges */}
          <Stack direction="row" spacing={1} alignItems="center">
            {featured && (
              <Chip
                icon={<StarIcon size={16} />}
                label="Featured"
                size="small"
                color="warning"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
            {status && (
              <Chip
                label={status}
                size="small"
                color={status === 'ACTIVE' ? 'success' : 'default'}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Stack>

          {/* Artist ID */}
          <Box
            sx={{
              pt: 1,
              borderTop: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
            }}
          >
            <Typography variant="caption" color="text.disabled">
              Artist ID: {artistId}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

ArtistDetails.propTypes = {
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  birthDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  deathDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  nationality: PropTypes.string,
  website: PropTypes.string,
  facebook: PropTypes.string,
  instagram: PropTypes.string,
  viewCount: PropTypes.number,
  featured: PropTypes.bool,
  status: PropTypes.string,
  country: PropTypes.string,
  state: PropTypes.string,
  city: PropTypes.string,
  artPieceCount: PropTypes.number,
  favoriteCount: PropTypes.number,
};
