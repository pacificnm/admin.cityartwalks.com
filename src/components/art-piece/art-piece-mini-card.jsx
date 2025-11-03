/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMiniCard
 * @version 1.0.0
 * @author AI Assistant
 * @memberof CityArtWalks.Components.ArtPiece
 * @description Mini art piece card component for compact display in carousels and nearby listings.
 * Shows essential information like image, title, artist, and view count in a condensed format.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece documentation
 */

'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { ViewIcon } from 'src/components/icons';
import { Iconify } from 'src/components/iconify';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMiniCard
 * @function ArtPieceMiniCard
 * @description Renders a compact card for an art piece showing essential information.
 * Optimized for carousels and nearby art piece listings.
 *
 * @param {Object} props - Component props
 * @param {string|number} props.artPieceId - The unique ID of the art piece
 * @param {string} props.title - The title of the art piece
 * @param {string} props.artistName - The name of the artist
 * @param {string} props.artPieceImageUrl - The URL of the art piece's image
 * @param {string} props.artistImageUrl - The URL of the artist's image
 * @param {string} props.artPieceSlug - The slug for the art piece
 * @param {string} props.artistSlug - The slug for the artist
 * @param {number} [props.viewCount=0] - Number of views
 * @param {number} [props.distance] - Distance in km (if applicable)
 * @param {Function} [props.onMouseEnter] - Mouse enter callback
 * @param {Function} [props.onMouseLeave] - Mouse leave callback
 * @param {Object} [props.sx] - Additional styling
 * @returns {JSX.Element} The rendered ArtPieceMiniCard component
 */
export function ArtPieceMiniCard({
  artPieceId,
  title,
  artistName,
  artPieceImageUrl,
  artistImageUrl,
  artPieceSlug,
  artistSlug,
  viewCount = 0,
  distance,
  onMouseEnter,
  onMouseLeave,
  sx,
  ...other
}) {
  const theme = useTheme();

  const defaultImage = 'https://0wffk7gp4dmp1u2g.public.blob.vercel-storage.com/logo-single.png';

  return (
    <Card
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={[
        {
          width: '100%',
          maxWidth: { xs: '100%', sm: 280, md: 260, lg: 240 },
          height: 300,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          transition: theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Image */}
      <Box
        component={RouterLink}
        href={paths.art.artist.artwork.details(artistSlug, artPieceSlug)}
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          position: 'relative',
          height: 160,
          overflow: 'hidden',
          bgcolor: alpha(theme.palette.grey[500], 0.12),
        }}
      >
        <Image
          src={artPieceImageUrl || defaultImage}
          alt={title}
          width={240}
          height={160}
          sizes="(max-width: 600px) 100vw, (max-width: 960px) 280px, (max-width: 1280px) 260px, 240px"
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>

      {/* Content */}
      <Stack spacing={1} sx={{ p: 1.5, height: 140 }}>
        {/* Title */}
        <Typography
          component={RouterLink}
          href={paths.art.artist.artwork.details(artistSlug, artPieceSlug)}
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {title}
        </Typography>

        {/* Artist Info */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={artistImageUrl}
            alt={artistName}
            sx={{
              width: 24,
              height: 24,
              fontSize: '0.75rem',
              bgcolor: theme.palette.primary.main,
            }}
          >
            {artistName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {artistName}
          </Typography>
        </Stack>

        {/* Stats */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 'auto' }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <ViewIcon width={14} sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {viewCount || 0}
            </Typography>
          </Stack>

          {distance !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:map-point-bold" width={14} sx={{ color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

ArtPieceMiniCard.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  artPieceImageUrl: PropTypes.string,
  artistImageUrl: PropTypes.string,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  viewCount: PropTypes.number,
  distance: PropTypes.number,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
