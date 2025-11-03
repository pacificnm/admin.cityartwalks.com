'use client';

import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

export function CommentDeleteDialog({ open, onClose, onConfirm, comment, postTitle }) {
  if (!comment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Comment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this comment?
          {postTitle && (
            <div style={{ marginTop: '12px', fontStyle: 'italic' }}>
              From: &quot;{postTitle}&quot;
            </div>
          )}
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            &quot;{comment.content?.substring(0, 100)}
            {comment.content?.length > 100 ? '...' : ''}&quot;
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CommentDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  comment: PropTypes.object,
  postTitle: PropTypes.string,
};
