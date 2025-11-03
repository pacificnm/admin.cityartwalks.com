/**
 * @namespace CityArtWalks.Components.Artist.ArtistCardAvatar
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { isFallbackImage, getValidImageUrl } from 'src/utils/image-url-validator';

import { AvatarShape } from 'src/assets/illustrations';

import { Image } from 'src/components/image';
import { ArtistAvatarAction } from 'src/components/artist';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistCardAvatar
 * @function ArtistCardAvatar
 * @description Renders an avatar for an artist card, including the artist's image
 * and a link to the artist's details page. Supports uploading new artist avatar images for admin users.
 * Includes automatic fallback to default City Art Walks logo for missing artist images.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the artist, used as the `alt` text for the artist's avatar.
 * @param {string} [props.imageUrl] - The URL of the artist's image (fallback to default logo if missing).
 * @param {string} props.slug - The unique slug of the artist, used for navigation.
 * @param {string} props.artistId - The unique identifier of the artist, required for image uploads.
 * @param {string} [props.createdBy] - The user ID who created the artist, used for ownership check.
 * @param {boolean} [props.uploadable=false] - If true, shows camera icon and enables upload for admin users.
 * @returns {JSX.Element} The rendered ArtistCardAvatar component.
 *
 * @example
 * // Basic usage without upload functionality
 * import { ArtistCardAvatar } from './ArtistCardAvatar';
 *
 * function App() {
 *   return (
 *     <ArtistCardAvatar
 *       name="Vincent van Gogh"
 *       imageUrl="/images/van-gogh.jpg"
 *       slug="vincent-van-gogh"
 *       artistId="artist-123"
 *     />
 *   );
 * }
 *
 * @example
 * // Usage with upload functionality for admin users
 * import { ArtistCardAvatar } from './ArtistCardAvatar';
 *
 * function AdminApp() {
 *   return (
 *     <ArtistCardAvatar
 *       name="Vincent van Gogh"
 *       imageUrl="/images/van-gogh.jpg"
 *       slug="vincent-van-gogh"
 *       artistId="artist-123"
 *       createdBy="user-456"
 *       uploadable={true}
 *     />
 *   );
 * }
 */
export function ArtistCardAvatar(props) {
  const { name, imageUrl, slug, artistId, createdBy, uploadable = false } = props;
  const theme = useTheme();
  const [avatarUrl, setAvatarUrl] = useState(imageUrl);

  /**
   * Handles successful avatar upload from ArtistAvatarAction component.
   * Updates the local avatar URL state to reflect the new image.
   *
   * @function handleUploadSuccess
   * @param {string} newImageUrl - The new image URL from successful upload
   * @returns {void}
   */
  const handleUploadSuccess = (newImageUrl) => {
    setAvatarUrl(newImageUrl);
  };

  // Memoized alpha overlay to avoid recalculations on every render
  const imageOverlay = useMemo(() => alpha(theme.palette.grey[900], 0.48), [theme]);

  const validImageUrl = getValidImageUrl(
    avatarUrl ||
      imageUrl ||
      'https://0wffk7gp4dmp1u2g.public.blob.vercel-storage.com/logo-single.png'
  );

  return (
    <Link href={paths.art.artist.details(slug)} passHref>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            right: 0,
            zIndex: 10,
            mx: 'auto',
            bottom: -26,
            position: 'absolute',
          }}
        />
        <Avatar
          alt={name}
          src={validImageUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />
        <ArtistAvatarAction
          artistId={artistId}
          createdBy={createdBy}
          uploadable={uploadable}
          onUploadSuccess={handleUploadSuccess}
        />
        {validImageUrl && !isFallbackImage(validImageUrl) ? (
          <Image src={validImageUrl} alt={name} ratio="16/9" overlay={imageOverlay} />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 0,
              paddingBottom: '56.25%', // 16:9 ratio
              backgroundColor: theme.palette.grey[300],
            }}
          />
        )}
      </Box>
    </Link>
  );
}

/**
 * @memberof CityArtWalks.Components.Artist.ArtistCardAvatar
 * PropTypes for ArtistCardAvatar component
 */
ArtistCardAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  slug: PropTypes.string.isRequired,
  artistId: PropTypes.string.isRequired,
  createdBy: PropTypes.string,
  uploadable: PropTypes.bool,
};
