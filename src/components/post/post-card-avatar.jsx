/**
 * @namespace CityArtWalks.Components.Post.PostCardAvatar
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { isFallbackImage, getValidImageUrl } from 'src/utils/image-url-validator';

import { AvatarShape } from 'src/assets/illustrations';

import { Image } from 'src/components/image';

/**
 * @memberof CityArtWalks.Components.Post.PostCardAvatar
 * @function PostCardAvatar
 * @description Renders the featured image for a post card with proper fallback handling and author avatar.
 * Links to the post's details page and includes author avatar overlay similar to ArtPieceCardAvatar.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the post, used as the `alt` text for the image.
 * @param {string} [props.featuredImage] - The URL of the post's featured image.
 * @param {string} props.slug - The unique slug of the post, used for navigation.
 * @param {boolean} [props.featured=false] - Whether this is a featured post.
 * @param {string} props.authorName - The name of the author, used as the `alt` text for the author's avatar.
 * @param {string} props.authorImageUrl - The URL of the author's avatar image.
 * @returns {JSX.Element} The rendered PostCardAvatar component.
 *
 * @example
 * // Basic usage
 * import { PostCardAvatar } from './PostCardAvatar';
 *
 * function App() {
 *   return (
 *     <PostCardAvatar
 *       title="Understanding Modern Art"
 *       featuredImage="/images/modern-art.jpg"
 *       slug="understanding-modern-art"
 *       featured={true}
 *       authorName="Jane Doe"
 *       authorImageUrl="/images/jane-doe.jpg"
 *     />
 *   );
 * }
 */
export function PostCardAvatar({
  title,
  featuredImage,
  slug,
  featured = false,
  authorName,
  authorImageUrl,
}) {
  const theme = useTheme();

  // Memoized alpha overlay to avoid recalculations on every render
  const imageOverlay = useMemo(() => alpha(theme.palette.grey[900], 0.48), [theme]);

  const validAuthorImageUrl = getValidImageUrl(authorImageUrl);
  const validFeaturedImageUrl = getValidImageUrl(featuredImage);

  return (
    <Link href={paths.post.details(slug)} passHref>
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
          alt={authorName}
          src={validAuthorImageUrl}
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
        {validFeaturedImageUrl && !isFallbackImage(validFeaturedImageUrl) ? (
          <Image src={validFeaturedImageUrl} alt={title} ratio="16/9" overlay={imageOverlay} />
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
 * @memberof CityArtWalks.Components.Post.PostCardAvatar
 * @prop {string} title - The title of the post, used as the `alt` text for the image. This prop is required.
 * @prop {string} [featuredImage] - The URL of the post's featured image. This prop is optional.
 * @prop {string} slug - The unique slug of the post, used for navigation. This prop is required.
 * @prop {boolean} [featured] - Whether this is a featured post. This prop is optional.
 * @prop {string} authorName - The name of the author, used as the `alt` text for the author's avatar. This prop is required.
 * @prop {string} authorImageUrl - The URL of the author's avatar image. This prop is required.
 */
PostCardAvatar.propTypes = {
  title: PropTypes.string.isRequired,
  featuredImage: PropTypes.string,
  slug: PropTypes.string.isRequired,
  featured: PropTypes.bool,
  authorName: PropTypes.string.isRequired,
  authorImageUrl: PropTypes.string.isRequired,
};
