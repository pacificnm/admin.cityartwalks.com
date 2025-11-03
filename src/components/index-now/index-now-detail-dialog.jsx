'use client';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

/**
 * IndexNow Detail Dialog Component
 */
export function IndexNowDetailDialog({ open, onClose, submission }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Submission Details</DialogTitle>

      <DialogContent>
        {submission && <pre>{JSON.stringify(submission, null, 2)}</pre>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
