/**
 * @namespace CityArtWalks.Components.Post.PostCardFeatured
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

/**
 * @memberof CityArtWalks.Components.Post.PostCardFeatured
 * @function PostCardFeatured
 * @description Renders a featured badge for post cards when the post is marked as featured.
 * Displays a prominent "Featured" chip overlay positioned at the top-left of the card
 * to highlight special or promoted content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.featured - Whether the post is featured (determines visibility).
 * @returns {JSX.Element|null} The rendered PostCardFeatured component or null if not featured.
 *
 * @example
 * // Basic usage in PostCard
 * import { PostCardFeatured } from './PostCardFeatured';
 *
 * function PostCard({ featured, ...otherProps }) {
 *   return (
 *     <Card sx={{ position: 'relative' }}>
 *       <PostCardFeatured featured={featured} />
 *       // Other card content
 *     </Card>
 *   );
 * }
 *
 * @example
 * // Featured post with badge visible
 * <PostCardFeatured featured={true} />
 * // Renders: Featured chip badge
 *
 * @example
 * // Non-featured post (no badge)
 * <PostCardFeatured featured={false} />
 * // Renders: null (nothing displayed)
 */
export function PostCardFeatured({ featured }) {
  // Only render the featured badge if the post is featured
  if (!featured) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 10,
      }}
      data-cy="post-card-featured-badge"
    >
      <Chip
        label="Featured"
        color="primary"
        size="small"
        variant="filled"
        sx={{
          textTransform: 'capitalize',
          fontWeight: 'bold',
          fontSize: '0.7rem',
        }}
      />
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.Post.PostCardFeatured
 * @prop {boolean} featured - Whether the post is featured (determines visibility). This prop is required.
 */
PostCardFeatured.propTypes = {
  featured: PropTypes.bool.isRequired,
};
