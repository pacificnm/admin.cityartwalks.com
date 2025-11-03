/**
 * @namespace CityArtWalks.Components.Post.PostCardDescription
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * @memberof CityArtWalks.Components.Post.PostCardDescription
 * @function PostCardDescription
 * @description Renders the description/excerpt of a post card.
 * Uses excerpt if available, otherwise truncates content. Shows "No description available" if neither is provided.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.excerpt] - The post excerpt. Takes priority over content.
 * @param {string} [props.content] - The full post content to truncate if excerpt not available.
 * @param {number} [props.maxLength=150] - Maximum character length for truncation.
 * @returns {JSX.Element} The rendered PostCardDescription component.
 *
 * @example
 * // Usage example
 * import { PostCardDescription } from './PostCardDescription';
 *
 * function App() {
 *   return (
 *     <div>
 *       <PostCardDescription excerpt="This is a short excerpt about the post." />
 *       <PostCardDescription
 *         content="This is a very long content that will be truncated to fit the card layout nicely..."
 *         maxLength={100}
 *       />
 *       <PostCardDescription />
 *     </div>
 *   );
 * }
 *
 * // Output:
 * // - Shows the excerpt as provided
 * // - Shows truncated content with "..." if over maxLength
 * // - Shows "No description available" for empty props
 */
export function PostCardDescription({ excerpt, content, maxLength = 150 }) {
  // Helper function to truncate text
  const truncateText = (text, maxLen) => {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen).trim() + '...';
  };

  // Determine what text to display
  let displayText = '';
  if (excerpt) {
    displayText = truncateText(excerpt, maxLength);
  } else if (content) {
    // Strip HTML tags if content contains HTML
    const cleanContent = content.replace(/<[^>]*>/g, '');
    displayText = truncateText(cleanContent, maxLength);
  } else {
    displayText = 'No description available.';
  }

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: 'center',
          lineHeight: 1.5,
          minHeight: '2.5rem', // Ensure consistent card heights
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {displayText}
      </Typography>
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.Post.PostCardDescription
 * @prop {string} [excerpt] - The post excerpt. Takes priority over content. This prop is optional.
 * @prop {string} [content] - The full post content to truncate if excerpt not available. This prop is optional.
 * @prop {number} [maxLength] - Maximum character length for truncation. This prop is optional.
 */
PostCardDescription.propTypes = {
  excerpt: PropTypes.string,
  content: PropTypes.string,
  maxLength: PropTypes.number,
};
