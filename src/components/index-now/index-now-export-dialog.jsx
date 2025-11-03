'use client';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

/**
 * IndexNow Export Dialog Component
 */
export function IndexNowExportDialog({ open, onClose, filters }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Submissions</DialogTitle>

      <DialogContent>
        Export functionality will be implemented here. Current filters: {JSON.stringify(filters)}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Export</Button>
      </DialogActions>
    </Dialog>
  );
}
