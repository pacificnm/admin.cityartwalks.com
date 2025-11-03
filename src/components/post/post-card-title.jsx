/**
 * @namespace CityArtWalks.Components.Post.PostCardTitle
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import PropTypes from 'prop-types';

import ListItemText from '@mui/material/ListItemText';

/**
 * @memberof CityArtWalks.Components.Post.PostCardTitle
 * @function PostCardTitle
 * @description Renders the title of a post card.
 * Displays "Untitled Post" if no title is provided.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.title] - The title of the post. Defaults to "Untitled Post" if not provided.
 * @returns {JSX.Element} The rendered PostCardTitle component.
 *
 * @example
 * // Usage example
 * import { PostCardTitle } from './PostCardTitle';
 *
 * function App() {
 *   return (
 *     <div>
 *       <PostCardTitle title="Understanding Modern Art" />
 *       <PostCardTitle />
 *     </div>
 *   );
 * }
 *
 * // Output:
 * // - "Understanding Modern Art" for the first title.
 * // - "Untitled Post" for the second (default value).
 */
export function PostCardTitle({ title }) {
  return (
    <ListItemText
      sx={{ mt: 7, mb: 1 }}
      primary={title || 'Untitled Post'}
      slotProps={{
        primary: { typography: 'subtitle1', textAlign: 'center' },
        secondary: { component: 'span', mt: 0.5 },
      }}
    />
  );
}

/**
 * @memberof CityArtWalks.Components.Post.PostCardTitle
 * @prop {string} [title] - The title of the post. Defaults to "Untitled Post" if not provided. This prop is optional.
 */
PostCardTitle.propTypes = {
  title: PropTypes.string,
};
