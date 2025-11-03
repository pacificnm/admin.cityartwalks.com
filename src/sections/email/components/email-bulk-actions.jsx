'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ButtonGroup from '@mui/material/ButtonGroup';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import { debugLog } from 'src/lib/debug';

import { DeleteIcon, LetterIcon, ArchiveIcon, RefreshIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

export function EmailBulkActions({ selectedCount, onAction }) {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    title: '',
    message: '',
  });

  const handleAction = (actionType) => {
    debugLog('EmailBulkActions.handleAction', 'Bulk action initiated', {
      actionType,
      selectedCount,
    });

    const actionConfigs = {
      archive: {
        title: 'Archive Emails',
        message: `Are you sure you want to archive ${selectedCount} selected email(s)? Archived emails will be moved to the archive folder.`,
      },
      delete: {
        title: 'Delete Emails',
        message: `Are you sure you want to permanently delete ${selectedCount} selected email(s)? This action cannot be undone.`,
      },
      resend: {
        title: 'Resend Emails',
        message: `Are you sure you want to resend ${selectedCount} selected email(s)? Only failed emails will be resent.`,
      },
      markAsRead: {
        title: 'Mark as Read',
        message: `Mark ${selectedCount} selected email(s) as read?`,
      },
    };

    const config = actionConfigs[actionType];
    if (config) {
      setConfirmDialog({
        open: true,
        action: actionType,
        title: config.title,
        message: config.message,
      });
    } else {
      // For actions that don't need confirmation
      onAction(actionType);
    }
  };

  const handleConfirm = () => {
    debugLog('EmailBulkActions.handleConfirm', 'Bulk action confirmed', {
      action: confirmDialog.action,
      selectedCount,
    });

    onAction(confirmDialog.action);
    setConfirmDialog({ open: false, action: null, title: '', message: '' });
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, action: null, title: '', message: '' });
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label={`${selectedCount} selected`} color="primary" variant="filled" />
              <Typography variant="body2" color="text.secondary">
                Bulk Actions:
              </Typography>
            </Box>

            <ButtonGroup variant="outlined" size="small">
              <Button startIcon={<ArchiveIcon />} onClick={() => handleAction('archive')}>
                Archive
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                onClick={() => handleAction('delete')}
                color="error"
              >
                Delete
              </Button>
              <Button
                startIcon={<RefreshIcon />}
                onClick={() => handleAction('resend')}
                color="warning"
              >
                Resend Failed
              </Button>
              <Button
                startIcon={<LetterIcon />}
                onClick={() => handleAction('markAsRead')}
                color="success"
              >
                Mark Read
              </Button>
            </ButtonGroup>
          </Stack>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={confirmDialog.action === 'delete' ? 'error' : 'primary'}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
