/**
 * @memberof CityArtWalks.Components.State
 * @function StateEditDialog
 * @description Modal dialog component for editing State information with responsive design and accessibility support.
 * @param {Object} props - Component props
 * @param {Object|null} props.currentState - Current State data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title='Quick Update'] - Optional custom title for the dialog
 * @param {string} [props.maxWidth='md'] - Maximum width of the dialog
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @returns {JSX.Element} The rendered StateEditDialog component
 * @throws {Error} When form operations fail or validation errors occur
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State} - State entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { StateForm } from 'src/forms/state';

import { CloseIcon } from 'src/components/icons';

/**
 * Handles successful form submission by closing dialog and calling success callback.
 * @memberof CityArtWalks.Components.State.StateEditDialog
 * @function handleSuccess
 * @param {Function} onClose - Dialog close handler
 * @param {Function} [onSuccess] - Optional success callback
 * @returns {Function}
 */
function useHandleSuccess(onClose, onSuccess) {
  return useCallback(
    (result) => {
      onClose();
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    },
    [onClose, onSuccess]
  );
}

/**
 * Handles form cancellation by closing the dialog.
 * @memberof CityArtWalks.Components.State.StateEditDialog
 * @function handleCancel
 * @param {Function} onClose - Dialog close handler
 * @returns {Function}
 */
function useHandleCancel(onClose) {
  return useCallback(() => {
    onClose();
  }, [onClose]);
}

export function StateEditDialog({
  currentState,
  open,
  onClose,
  onSuccess,
  title = 'Quick Update',
  maxWidth = 'md',
  fullWidth = true,
}) {
  const handleSuccess = useHandleSuccess(onClose, onSuccess);
  const handleCancel = useHandleCancel(onClose);

  // Keyboard navigation: close on Escape
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      aria-labelledby="state-edit-dialog-title"
      aria-describedby="state-edit-dialog-description"
      PaperProps={{
        sx: { borderRadius: 2, minHeight: 300, maxHeight: '90vh' },
      }}
      onKeyDown={handleKeyDown}
    >
      <DialogTitle
        id="state-edit-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box component="span">{title}</Box>
        <IconButton onClick={onClose} aria-label="Close dialog" sx={{ color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        id="state-edit-dialog-description"
        sx={{
          p: { xs: 2, sm: 3 },
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            borderRadius: 3,
          },
        }}
      >
        <StateForm currentState={currentState} onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}
