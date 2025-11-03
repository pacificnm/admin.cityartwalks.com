/**
 * @namespace CityArtWalks.Components.Artist.ArtistCardAvatar
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';

import { isFallbackImage, getValidImageUrl } from 'src/utils/image-url-validator';

import { AvatarShape } from 'src/assets/illustrations';

import { Image } from 'src/components/image';
import { ArtistAvatarAction } from 'src/components/artist';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Artist card avatar component for displaying and updating artist profile images.
 *
 * Features:
 * - Avatar display with automatic fallback handling
 * - Upload functionality for authenticated artist owners
 * - Image validation and error handling
 * - Responsive design with hover effects
 *
 * @memberof CityArtWalks.Components.Artist
 * @param {Object} props - Component props
 * @param {Object} props.artist - Artist data object
 * @param {number} props.artist.artistId - Artist ID for upload operations
 * @param {string} [props.artist.imageUrl] - Artist profile image URL
 * @param {string} [props.artist.name] - Artist name for alt text
 * @param {string} [props.artist.slug] - Artist slug for navigation
 * @param {number} [props.artist.createdBy] - Artist creator ID for ownership validation
 * @param {string} [props.imageUrl] - Fallback image URL override
 * @param {Function} [props.onImageUpdate] - Callback after successful image update
 * @returns {JSX.Element} Avatar display with upload functionality
 */
export default function ArtistCardAvatar({ artist, imageUrl: imageUrlProp, onImageUpdate }) {
  const theme = useTheme();
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const effectiveImageUrl = useMemo(() => {
    if (imageUrlProp) return imageUrlProp;
    if (artist?.imageUrl) return artist.imageUrl;
    return '';
  }, [imageUrlProp, artist?.imageUrl]);

  const validImageUrl = useMemo(() => getValidImageUrl(effectiveImageUrl), [effectiveImageUrl]);

  const canUploadImage = useMemo(() => {
    if (!user?.userId || !artist?.artistId) return false;
    return user.userId === artist.createdBy || user.role === 'ADMIN';
  }, [user?.userId, user?.role, artist?.artistId, artist?.createdBy]);

  const handleImageUpdate = (newImageUrl) => {
    if (onImageUpdate) {
      onImageUpdate(newImageUrl);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: alpha(theme.palette.grey[500], 0.08),
          border: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
        }}
      >
        {validImageUrl && !isFallbackImage(validImageUrl) ? (
          <Image
            alt={artist?.name || 'Artist avatar'}
            src={validImageUrl}
            sx={{
              width: 1,
              height: 1,
              objectFit: 'cover',
            }}
          />
        ) : (
          <AvatarShape
            sx={{
              width: 1,
              height: 1,
              color: alpha(theme.palette.grey[500], 0.24),
            }}
          />
        )}
      </Avatar>

      {canUploadImage && (
        <ArtistAvatarAction
          artist={artist}
          onUploadStart={() => setIsLoading(true)}
          onUploadComplete={(newImageUrl) => {
            setIsLoading(false);
            handleImageUpdate(newImageUrl);
          }}
          onUploadError={() => setIsLoading(false)}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.Artist.ArtistCardAvatar
 * PropTypes for ArtistCardAvatar component
 */
ArtistCardAvatar.propTypes = {
  artist: PropTypes.shape({
    artistId: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    createdBy: PropTypes.number,
  }).isRequired,
  imageUrl: PropTypes.string,
  onImageUpdate: PropTypes.func,
};
