/**
 * @namespace CityArtWalks.Components.Post.PostCardStatus
 * @version 1.0.0
 * @author Claude Code
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Gets the appropriate Material-UI color for post status values
 * @memberof CityArtWalks.Components.Post.PostCardStatus
 * @function getStatusColor
 * @param {string} status - The status value from post entity
 * @returns {string} Material-UI color name for the status
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'PUBLISHED':
      return 'success';
    case 'DRAFT':
      return 'info';
    case 'ARCHIVED':
      return 'default';
    case 'DELETED':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * @memberof CityArtWalks.Components.Post.PostCardStatus
 * @function PostCardStatus
 * @description Renders an owner-only status indicator for post cards when the post
 * is not published. Only displays for authenticated users who own the post,
 * providing visual feedback on draft, archived, or deleted content status.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.status - The current status of the post.
 * @param {number|string} props.createdBy - The user ID who created the post.
 * @returns {JSX.Element|null} The rendered PostCardStatus component or null if not applicable.
 *
 * @example
 * // Basic usage in PostCard
 * import { PostCardStatus } from './PostCardStatus';
 *
 * function PostCard({ status, createdBy, ...otherProps }) {
 *   return (
 *     <Card sx={{ position: 'relative' }}>
 *       <PostCardStatus status={status} createdBy={createdBy} />
 *       // Other card content
 *     </Card>
 *   );
 * }
 *
 * @example
 * // Draft post for owner (shows status)
 * <PostCardStatus status="DRAFT" createdBy={currentUser.userId} />
 * // Renders: "DRAFT" chip badge for owner
 *
 * @example
 * // Published post (no status badge)
 * <PostCardStatus status="PUBLISHED" createdBy={currentUser.userId} />
 * // Renders: null (nothing displayed)
 *
 * @example
 * // Non-owner viewing draft post (no status badge)
 * <PostCardStatus status="DRAFT" createdBy={differentUser.userId} />
 * // Renders: null (nothing displayed)
 */
export function PostCardStatus({ status, createdBy }) {
  const { user } = useAuthContext();

  // Check if current user is the owner of the post
  const isOwner = user?.userId === createdBy;

  // Only show status indicator for owners and non-published content
  if (!isOwner || status === 'PUBLISHED') {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
      }}
      data-cy="post-card-status-badge"
    >
      <Chip
        label={status}
        color={getStatusColor(status)}
        size="small"
        variant="outlined"
        sx={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
          fontSize: '0.6rem',
          backgroundColor: 'background.paper',
        }}
      />
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.Post.PostCardStatus
 * @prop {string} status - The current status of the post. This prop is required.
 * @prop {number|string} createdBy - The user ID who created the post. This prop is required.
 */
PostCardStatus.propTypes = {
  status: PropTypes.oneOf(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED']).isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
