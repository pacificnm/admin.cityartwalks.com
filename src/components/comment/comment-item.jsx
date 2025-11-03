'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Menu from '@mui/material/Menu';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { fDate, fToNow } from 'src/utils/format-time';

import { debugLog, debugError } from 'src/lib/debug';
import { useUpdateComment, useDeleteComment } from 'src/actions/comment/hooks';

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog/confirm-dialog';
import { EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Comment item component for displaying individual comments
 *
 * @component CommentItem
 * @memberof Comment.Components
 * @param {Object} props
 * @param {Object} props.comment - Comment data
 * @param {Function} props.onCommentUpdated - Callback when comment is updated
 * @param {Function} props.onCommentDeleted - Callback when comment is deleted
 * @param {boolean} props.showReplies - Whether to show reply functionality
 * @returns {JSX.Element} Comment item component
 */
export function CommentItem({ comment, postId, ownerId, onEdit, onDelete }) {
  const { user } = useAuthContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  // Check if current user can edit/delete this comment
  const canEdit = user && (user.userId === comment.createdBy || user.role === 'ADMIN');

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleEditStart = useCallback(() => {
    debugLog('CommentItem.handleEditStart', 'Starting edit mode', { commentId: comment.commentId });
    setIsEditing(true);
    setEditContent(comment.content);
    handleMenuClose();
  }, [comment.commentId, comment.content, handleMenuClose]);

  const handleEditCancel = useCallback(() => {
    debugLog('CommentItem.handleEditCancel', 'Canceling edit mode', {
      commentId: comment.commentId,
    });
    setIsEditing(false);
    setEditContent(comment.content);
  }, [comment.commentId, comment.content]);

  const handleEditSave = useCallback(async () => {
    try {
      debugLog('CommentItem.handleEditSave', 'Saving comment edit', {
        commentId: comment.commentId,
      });

      if (!editContent.trim()) {
        toast.warning('Comment cannot be empty');
        return;
      }

      await updateComment(comment.commentId, {
        content: editContent.trim(),
      });

      toast.success('Comment updated successfully');
      setIsEditing(false);

      if (onEdit) {
        onEdit(comment);
      }
    } catch (error) {
      debugError('CommentItem.handleEditSave', 'Failed to update comment', error);
      toast.error(error.message || 'Failed to update comment');
    }
  }, [comment, editContent, updateComment, onEdit]);

  const handleDeleteClick = useCallback(() => {
    debugLog('CommentItem.handleDeleteClick', 'Opening delete confirmation', {
      commentId: comment.commentId,
    });
    setDeleteDialogOpen(true);
    handleMenuClose();
  }, [comment.commentId, handleMenuClose]);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      debugLog('CommentItem.handleDeleteConfirm', 'Deleting comment', {
        commentId: comment.commentId,
      });

      await deleteComment(comment.commentId);

      toast.success('Comment deleted successfully');
      setDeleteDialogOpen(false);

      if (onDelete) {
        onDelete(comment);
      }
    } catch (error) {
      debugError('CommentItem.handleDeleteConfirm', 'Failed to delete comment', error);
      toast.error(error.message || 'Failed to delete comment');
    }
  }, [comment, deleteComment, onDelete]);

  // Don't render if comment is deleted (soft delete)
  if (comment.status === 'DELETED') {
    return (
      <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          This comment has been deleted.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Comment Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {comment.author?.firstName?.[0] || comment.author?.username?.[0] || '?'}
              </Avatar>

              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2">
                    {comment.author?.firstName && comment.author?.lastName
                      ? `${comment.author.firstName} ${comment.author.lastName}`
                      : comment.author?.username || 'Anonymous'}
                  </Typography>

                  {comment.status === 'MODERATED' && (
                    <Chip label="Moderated" size="small" color="warning" />
                  )}
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {fToNow(comment.createdAt)}
                  {comment.updatedAt !== comment.createdAt && ' (edited)'}
                </Typography>
              </Stack>
            </Stack>

            {/* Actions Menu */}
            {canEdit && (
              <IconButton size="small" onClick={handleMenuOpen}>
                <VerticalFillIcon />
              </IconButton>
            )}
          </Stack>

          {/* Comment Content */}
          {isEditing ? (
            <Stack spacing={2}>
              <TextField
                multiline
                rows={3}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit your comment..."
                fullWidth
              />

              <Stack direction="row" spacing={1}>
                <LoadingButton variant="contained" size="small" onClick={handleEditSave}>
                  Save
                </LoadingButton>
                <Button variant="outlined" size="small" onClick={handleEditCancel}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {comment.content}
            </Typography>
          )}

          {/* Comment Footer */}
          {!isEditing && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                Posted {fDate(comment.createdAt)}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditStart}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Comment"
        content="Are you sure you want to delete this comment? This action cannot be undone."
        action={
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        }
      />
    </>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    commentId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    createdBy: PropTypes.number.isRequired,
    author: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
  postId: PropTypes.number,
  ownerId: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
