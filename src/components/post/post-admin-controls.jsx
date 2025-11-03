/**
 * @file post-admin-controls.jsx
 * @description Post Admin Controls Component for Post Management Actions
 * @namespace CityArtWalks.Components.Post.PostAdminControls
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { EditIcon } from 'src/components/icons';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * Post Admin Controls Component
 *
 * Provides administrative controls for post management, including edit functionality
 * and status display. Only visible to users with ADMIN role through RoleBasedGuard.
 * Can be displayed as a card with background or as a simple stack layout.
 *
 * @memberof CityArtWalks.Components.Post.PostAdminControls
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.post - Post object containing status and other post data
 * @param {string} props.post.status - Current status of the post (PUBLISHED, DRAFT, etc.)
 * @param {Function} props.onEdit - Callback function triggered when edit button is clicked
 * @param {boolean} [props.showAsCard=true] - Whether to display controls in a card format
 * @param {Object} [props.sx] - Additional styling object for Material-UI sx prop
 * @returns {JSX.Element|null} Rendered admin controls component or null if no post
 *
 * @example
 * // Basic usage with card display
 * <PostAdminControls
 *   post={{ status: 'PUBLISHED', postId: 123 }}
 *   onEdit={() => handleEdit(123)}
 * />
 *
 * @example
 * // Usage without card display
 * <PostAdminControls
 *   post={{ status: 'DRAFT', postId: 456 }}
 *   onEdit={() => handleEdit(456)}
 *   showAsCard={false}
 *   sx={{ mt: 2 }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Models} - Model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Post} - Post schema documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth} - Authentication documentation
 */
export function PostAdminControls({ post, onEdit, showAsCard = true, sx }) {
  if (!post) return null;

  const content = (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={onEdit}>
        Edit Post
      </Button>
      <Chip
        label={post.status}
        size="small"
        color={
          post.status === 'PUBLISHED' ? 'success' : post.status === 'DRAFT' ? 'warning' : 'default'
        }
      />
    </Stack>
  );

  return (
    <RoleBasedGuard roles={['ADMIN']}>
      {showAsCard ? (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.neutral', ...sx }}>{content}</Paper>
      ) : (
        <Stack sx={sx}>{content}</Stack>
      )}
    </RoleBasedGuard>
  );
}

/**
 * PropTypes validation for PostAdminControls component
 *
 * @memberof CityArtWalks.Components.Post.PostAdminControls
 * @type {Object}
 * @property {Object} post - Post object (required)
 * @property {Function} onEdit - Edit handler function (required)
 * @property {boolean} showAsCard - Display as card format (optional, defaults to true)
 * @property {Object} sx - Material-UI styling object (optional)
 */
PostAdminControls.propTypes = {
  post: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  showAsCard: PropTypes.bool,
  sx: PropTypes.object,
};
