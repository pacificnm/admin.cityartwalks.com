/**
 * @namespace CityArtWalks.Components.Post.PostCardMeta
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

/**
 * @memberof CityArtWalks.Components.Post.PostCardMeta
 * @function PostCardMeta
 * @description Renders metadata for a post card including category, tags, author, and publication date.
 * Provides a clean, organized display of post information.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.category] - The post category.
 * @param {Array<string>} [props.tags] - Array of post tags.
 * @param {Object} [props.author] - The post author information.
 * @param {string} [props.author.name] - The author's display name.
 * @param {string} [props.publishedAt] - The publication date (ISO string).
 * @param {string} [props.createdAt] - The creation date (ISO string).
 * @param {number} [props.maxTags=3] - Maximum number of tags to display.
 * @returns {JSX.Element} The rendered PostCardMeta component.
 *
 * @example
 * // Usage example
 * import { PostCardMeta } from './PostCardMeta';
 *
 * function App() {
 *   return (
 *     <PostCardMeta
 *       category="Art Education"
 *       tags={["modern-art", "trends", "education", "guide"]}
 *       author={{ name: "Jane Doe" }}
 *       publishedAt="2024-01-15T10:30:00Z"
 *       maxTags={2}
 *     />
 *   );
 * }
 */
export function PostCardMeta({ category, tags = [], author, publishedAt, createdAt, maxTags = 3 }) {
  return (
    <Box sx={{ px: 2, pb: 1 }}>
      {/* Category and Tags Row */}
      {(category || tags.length > 0) && (
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
          {category && (
            <Chip
              label={category}
              size="small"
              color="info"
              sx={{
                borderRadius: 1.5,
                fontWeight: 500,
                mb: 0.5,
              }}
            />
          )}
          {tags.slice(0, maxTags).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              color="info"
              sx={{
                borderRadius: 1.5,
                fontWeight: 500,
                mb: 0.5,
                textTransform: 'lowercase',
              }}
            />
          ))}
          {tags.length > maxTags && (
            <Chip
              label={`+${tags.length - maxTags}`}
              size="small"
              color="info"
              sx={{
                borderRadius: 1.5,
                fontWeight: 500,
                mb: 0.5,
              }}
            />
          )}
        </Stack>
      )}
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.Post.PostCardMeta
 * @prop {string} [category] - The post category. This prop is optional.
 * @prop {Array<string>} [tags] - Array of post tags. This prop is optional.
 * @prop {Object} [author] - The post author information. This prop is optional.
 * @prop {string} [publishedAt] - The publication date (ISO string). This prop is optional.
 * @prop {string} [createdAt] - The creation date (ISO string). This prop is optional.
 * @prop {number} [maxTags] - Maximum number of tags to display. This prop is optional.
 */
PostCardMeta.propTypes = {
  category: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.shape({
    name: PropTypes.string,
  }),
  publishedAt: PropTypes.string,
  createdAt: PropTypes.string,
  maxTags: PropTypes.number,
};
