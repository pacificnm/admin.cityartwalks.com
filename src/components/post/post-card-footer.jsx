/**
 * @namespace CityArtWalks.Components.Post.PostCardFooter
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { fNumber } from 'src/utils/format-number';

/**
 * @memberof CityArtWalks.Components.Post.PostCardFooter
 * @function PostCardFooter
 * @description Renders the footer section of a post card with engagement metrics,
 * sharing functionality, and call-to-action buttons.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.slug - The unique slug of the post, used for navigation.
 * @param {number} [props.commentCount=0] - Number of active comments on the post.
 * @param {number} [props.viewCount=0] - Number of post views.
 * @param {string} props.title - The post title for sharing.
 * @returns {JSX.Element} The rendered PostCardFooter component.
 *
 * @example
 * // Usage example
 * import { PostCardFooter } from './PostCardFooter';
 *
 * function App() {
 *   return (
 *     <PostCardFooter
 *       slug="understanding-modern-art"
 *       commentCount={25}
 *       viewCount={150}
 *       title="Understanding Modern Art"
 *     />
 *   );
 * }
 */
export function PostCardFooter({ slug, commentCount = 0, viewCount = 0, title }) {
  return (
    <Box sx={{ py: 2, textAlign: 'center', typography: 'subtitle1', color: 'text.secondary' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        {renderMetric(commentCount, 'Comments')}
        {renderMetric(viewCount, 'Views')}
      </Stack>
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.Post.PostCardFooter
 * @function renderMetric
 * @description Renders a metric display with a count and a label, formatted for use in a layout.
 *
 * @function
 * @param {number} count - The numeric value to display. This value is formatted using `fNumber`.
 * @param {string} label - The label for the metric, displayed below the count.
 * @returns {JSX.Element} The rendered metric component.
 */
const renderMetric = (count, label) => (
  <Stack width={1}>
    {fNumber(count)}
    <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
      {label}
    </Box>
  </Stack>
);

/**
 * @memberof CityArtWalks.Components.Post.PostCardFooter
 * @prop {string} slug - The unique slug of the post, used for navigation. This prop is required.
 * @prop {number} [commentCount] - Number of active comments on the post. This prop is optional.
 * @prop {number} [viewCount] - Number of post views. This prop is optional.
 * @prop {string} title - The post title for sharing. This prop is required.
 */
PostCardFooter.propTypes = {
  slug: PropTypes.string.isRequired,
  commentCount: PropTypes.number,
  viewCount: PropTypes.number,
  title: PropTypes.string.isRequired,
};
