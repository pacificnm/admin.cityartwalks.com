/**
 * @namespace CityArtWalks.Components.Path.PathMiniCard
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Components.Path
 * @description Mini card component for displaying path information in carousels and compact layouts.
 * Designed for use in PathNearby and similar carousel components.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Model} - Path documentation
 */

'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { ViewIcon, StarIcon } from 'src/components/icons';
import { UserBadge } from 'src/components/user/user-badge';

/**
 * @memberof CityArtWalks.Components.Path.PathMiniCard
 * @function PathMiniCard
 * @description Displays a path in a compact card format for carousels
 *
 * @param {Object} props - Component props
 * @param {string|number} props.pathId - The path ID
 * @param {string} props.title - Path title
 * @param {string} [props.description] - Path description
 * @param {string} [props.imageUrl] - Path image URL
 * @param {number} [props.viewCount] - Number of views
 * @param {number} [props.pieceCount] - Number of art pieces
 * @param {number} [props.distance] - Distance from current location in km
 * @param {string} [props.pathType] - Type of path
 * @param {string} [props.slug] - Path slug for navigation
 * @param {string|number} [props.createdBy] - Creator user ID
 * @param {boolean} [props.featured] - Whether the path is featured
 * @returns {JSX.Element} The rendered PathMiniCard component
 */
export function PathMiniCard({
  pathId,
  title,
  description,
  imageUrl,
  viewCount,
  pieceCount,
  distance,
  pathType,
  slug,
  createdBy,
  featured,
}) {
  const theme = useTheme();
  const router = useRouter();

  // Format distance
  const formatDistance = (dist) => {
    if (!dist && dist !== 0) return null;
    return dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`;
  };

  const handleViewPath = () => {
    if (pathId) {
      router.push(paths.path.details(pathId));
    }
  };

  return (
    <Card
      sx={{
        width: 240,
        height: 320,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[2],
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)',
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
        },
      }}
    >
      {/* Featured Badge */}
      {featured && (
        <Chip
          icon={<StarIcon size={14} />}
          label="Featured"
          size="small"
          color="warning"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            fontSize: '0.7rem',
            height: 24,
          }}
        />
      )}

      {/* Distance Badge */}
      {distance !== undefined && (
        <Chip
          label={formatDistance(distance)}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            fontSize: '0.7rem',
            height: 24,
            bgcolor: alpha(theme.palette.info.main, 0.9),
            color: 'white',
            '& .MuiChip-label': {
              fontWeight: 600,
            },
          }}
        />
      )}

      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          height: 140,
          bgcolor: theme.palette.grey[100],
          overflow: 'hidden',
        }}
      >
        <Image
          src={(() => {
            if (!imageUrl || imageUrl.trim() === '') {
              return '/assets/images/mock/cover/cover-1.webp';
            }
            // If it's a relative path without leading slash, add it
            if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
              return `/${imageUrl}`;
            }
            return imageUrl;
          })()}
          alt={title}
          width={320}
          height={140}
          sizes="320px"
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>

      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <Typography
          variant="subtitle2"
          component="h3"
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em',
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        {description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              minHeight: '2.6em',
            }}
          >
            {description}
          </Typography>
        )}

        {/* Path Type */}
        {pathType && (
          <Box sx={{ mb: 1.5 }}>
            <Chip
              icon={<Iconify icon="solar:walking-bold" width={12} />}
              label={pathType.charAt(0).toUpperCase() + pathType.slice(1).toLowerCase()}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.7rem',
                height: 20,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderColor: alpha(theme.palette.primary.main, 0.2),
              }}
            />
          </Box>
        )}

        {/* Stats */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {viewCount !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <ViewIcon width={12} sx={{ color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {viewCount}
              </Typography>
            </Stack>
          )}
          {pieceCount !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:gallery-bold" width={12} sx={{ color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {pieceCount}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Creator */}
        {createdBy && (
          <Box sx={{ mb: 2 }}>
            <UserBadge userId={createdBy} size="small" />
          </Box>
        )}

        {/* View Button */}
        <Button
          fullWidth
          size="small"
          variant="outlined"
          onClick={handleViewPath}
          disabled={!slug}
          startIcon={<ViewIcon width={16} />}
          sx={{
            mt: 'auto',
            borderRadius: 1,
            fontSize: '0.75rem',
            py: 0.75,
          }}
        >
          View Path
        </Button>
      </CardContent>
    </Card>
  );
}

PathMiniCard.propTypes = {
  pathId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  viewCount: PropTypes.number,
  pieceCount: PropTypes.number,
  distance: PropTypes.number,
  pathType: PropTypes.string,
  slug: PropTypes.string,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  featured: PropTypes.bool,
};
