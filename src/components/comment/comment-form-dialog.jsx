'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { debugLog, debugError } from 'src/lib/debug';
import { useCreateComment, useUpdateComment } from 'src/actions/comment/hooks';

import { useAuthContext } from 'src/auth/hooks';

export function CommentFormDialog({
  open,
  onClose,
  onSuccess,
  postId,
  postTitle,
  currentComment,
  mode = 'create',
}) {
  const { accessToken } = useAuthContext();
  const [content, setContent] = useState(currentComment?.content || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createComment = useCreateComment(accessToken);
  const updateComment = useUpdateComment(accessToken);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      setError('Please enter a comment');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'edit' && currentComment) {
        debugLog('CommentFormDialog.handleSubmit', 'Updating comment', {
          commentId: currentComment.commentId,
        });
        await updateComment(currentComment.commentId, {
          content: content.trim(),
        });
      } else {
        debugLog('CommentFormDialog.handleSubmit', 'Creating comment', { postId });
        await createComment({
          postId,
          content: content.trim(),
        });
      }

      // Clear form and close
      setContent('');
      onSuccess();
    } catch (err) {
      debugError('CommentFormDialog.handleSubmit', 'Failed to submit comment', err);
      setError(err.message || 'Failed to submit comment');
    } finally {
      setLoading(false);
    }
  }, [content, mode, currentComment, postId, createComment, updateComment, onSuccess]);

  const handleClose = useCallback(() => {
    if (!loading) {
      setContent(currentComment?.content || '');
      setError(null);
      onClose();
    }
  }, [loading, currentComment, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'edit' ? 'Edit Comment' : 'Write a Comment'}
        {postTitle && (
          <div style={{ fontSize: '0.875rem', color: 'text.secondary', marginTop: '4px' }}>
            on &quot;{postTitle}&quot;
          </div>
        )}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          fullWidth
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          error={!!error}
          helperText={error}
          disabled={loading}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !content.trim()}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {mode === 'edit' ? 'Update' : 'Post'} Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CommentFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  postTitle: PropTypes.string,
  currentComment: PropTypes.object,
  mode: PropTypes.oneOf(['create', 'edit']),
};
