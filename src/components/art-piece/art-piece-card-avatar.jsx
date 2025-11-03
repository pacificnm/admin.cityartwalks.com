/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceCardAvatar
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
import { ArtPieceAvatarAction } from 'src/components/art-piece';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardAvatar
 * @function ArtPieceCardAvatar
 * @description Renders an avatar for an art piece card, including the art piece's image, artist's avatar,
 * and a link to the art piece's details page. Supports uploading new artist avatar images for admin users.
 * Includes automatic fallback to default City Art Walks logo for missing art piece images.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the art piece, used as the `alt` text for the art piece image.
 * @param {string} props.artistName - The name of the artist, used as the `alt` text for the artist's avatar.
 * @param {string} [props.artPieceImageUrl] - The URL of the art piece's image (fallback to default logo if missing).
 * @param {string} props.artistImageUrl - The URL of the artist's avatar image.
 * @param {string} props.artPieceSlug - The unique slug of the art piece, used for navigation.
 * @param {string} props.artistSlug - The unique slug of the artist, used for navigation.
 * @param {string} props.artPieceId - The unique identifier of the art piece, required for image uploads.
 * @param {boolean} [props.uploadable=false] - If true, shows camera icon and enables upload for admin users.
 * @returns {JSX.Element} The rendered ArtPieceCardAvatar component.
 *
 * @example
 * // Basic usage without upload functionality
 * import { ArtPieceCardAvatar } from './ArtPieceCardAvatar';
 *
 * function App() {
 *   return (
 *     <ArtPieceCardAvatar
 *       title="Starry Night"
 *       artistName="Vincent van Gogh"
 *       artPieceImageUrl="/images/starry-night.jpg"
 *       artistImageUrl="/images/van-gogh.jpg"
 *       artPieceSlug="starry-night"
 *       artistSlug="vincent-van-gogh"
 *     />
 *   );
 * }
 *
 * @example
 * // Usage with upload functionality for admin users
 * import { ArtPieceCardAvatar } from './ArtPieceCardAvatar';
 *
 * function AdminApp() {
 *   return (
 *     <ArtPieceCardAvatar
 *       title="Starry Night"
 *       artistName="Vincent van Gogh"
 *       artPieceImageUrl="/images/starry-night.jpg"
 *       artistImageUrl="/images/van-gogh.jpg"
 *       artPieceSlug="starry-night"
 *       artistSlug="vincent-van-gogh"
 *       artPieceId="art-piece-123"
 *       uploadable={true}
 *     />
 *   );
 * }
 */
export function ArtPieceCardAvatar(props) {
  const {
    title,
    artistName,
    artPieceImageUrl,
    artistImageUrl,
    artPieceSlug,
    artistSlug,
    artPieceId,
    createdBy,
    uploadable = false,
  } = props;
  const theme = useTheme();
  const [avatarUrl, setAvatarUrl] = useState(artistImageUrl);

  /**
   * Handles successful avatar upload from ArtPieceAvatarAction component.
   * Updates the local avatar URL state to reflect the new image.
   *
   * @function handleUploadSuccess
   * @param {string} imageUrl - The new image URL from successful upload
   * @returns {void}
   */
  const handleUploadSuccess = (imageUrl) => {
    setAvatarUrl(imageUrl);
  };

  // Memoized alpha overlay to avoid recalculations on every render
  const imageOverlay = useMemo(() => alpha(theme.palette.grey[900], 0.48), [theme]);

  const validArtistImageUrl = getValidImageUrl(avatarUrl || artistImageUrl);
  const validArtPieceImageUrl = getValidImageUrl(
    artPieceImageUrl || 'https://0wffk7gp4dmp1u2g.public.blob.vercel-storage.com/logo-single.png'
  );

  return (
    <Link href={paths.art.artist.artwork.details(artistSlug, artPieceSlug)} passHref>
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
          alt={artistName}
          src={validArtistImageUrl}
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
        <ArtPieceAvatarAction
          artPieceId={artPieceId}
          createdBy={createdBy}
          uploadable={uploadable}
          onUploadSuccess={handleUploadSuccess}
        />
        {validArtPieceImageUrl && !isFallbackImage(validArtPieceImageUrl) ? (
          <Image src={validArtPieceImageUrl} alt={title} ratio="16/9" overlay={imageOverlay} />
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
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardAvatar
 * @prop {string} title - The title of the art piece, used as the `alt` text for the art piece image. This prop is required.
 * @prop {string} artistName - The name of the artist, used as the `alt` text for the artist's avatar. This prop is required.
 * @prop {string} artPieceImageUrl - The URL of the art piece's image. This prop is required.
 * @prop {string} artistImageUrl - The URL of the artist's avatar image. This prop is required.
 * @prop {string} artPieceSlug - The unique slug of the art piece, used for navigation. This prop is required.
 * @prop {string} artistSlug - The unique slug of the artist, used for navigation. This prop is required.
 * @prop {string} artPieceId - The unique identifier of the art piece, required for image uploads.
 * @prop {boolean} uploadable - If true, shows camera icon and enables upload functionality for admin users.
 */
ArtPieceCardAvatar.propTypes = {
  title: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  artPieceImageUrl: PropTypes.string.isRequired,
  artistImageUrl: PropTypes.string.isRequired,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  artPieceId: PropTypes.string.isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  uploadable: PropTypes.bool,
};
