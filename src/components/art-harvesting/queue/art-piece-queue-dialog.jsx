/**
 * Art Piece Queue Dialog Component
 *
 * Modal dialog component for creating and editing art piece queue information with responsive design
 * and accessibility support. Provides comprehensive interface for managing
 * art piece queue details including URL input, location, and harvesting metadata.
 *
 * Features:
 * - Full accessibility with ARIA labels and focus management
 * - Responsive dialog sizing for different screen sizes
 * - Integration with ArtPieceQueueForm for consistent validation and UX
 * - Proper success and cancellation handling
 * - Close button and escape key support
 * - Professional dialog styling with Material-UI
 * - Dynamic title based on create/edit mode
 *
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @fileoverview Dialog component for ArtPieceQueue entity management
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/art-piece-queue - ArtPieceQueue-specific form component
 * @requires src/components/iconify - Icon component for close button
 * @requires src/lib/debug - Debug and error logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue} - ArtPieceQueue entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { debugLog, debugError } from 'src/lib/debug';
import { ArtPieceQueueForm } from 'src/forms/art-piece-queue';

import { CloseIcon } from 'src/components/icons';

/**
 * ArtPieceQueue Dialog component
 * Modal dialog component for creating and editing art piece queue information with responsive design and accessibility support.
 *
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue
 * @function ArtPieceQueueDialog
 * @param {Object} props - Component props
 * @param {Object|null} props.currentArtPieceQueue - Current art piece queue data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title] - Optional custom title for the dialog (auto-generated if not provided)
 * @param {string} [props.maxWidth='md'] - Maximum width of the dialog
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @returns {JSX.Element} The rendered ArtPieceQueueDialog component
 * @throws {Error} When form operations fail or validation errors occur
 *
 * @example
 * // Create mode - for new harvest URL input
 * <ArtPieceQueueDialog
 *   currentArtPieceQueue={null}
 *   open={createDialogOpen}
 *   onClose={() => setCreateDialogOpen(false)}
 *   onSuccess={handleQueueCreate}
 * />
 *
 * @example
 * // Edit mode
 * <ArtPieceQueueDialog
 *   currentArtPieceQueue={selectedQueueItem}
 *   open={editDialogOpen}
 *   onClose={() => setEditDialogOpen(false)}
 *   onSuccess={handleQueueUpdate}
 *   title="Edit Queue Item"
 * />
 */
export function ArtPieceQueueDialog({
  currentArtPieceQueue,
  open,
  onClose,
  onSuccess,
  title,
  maxWidth = 'md',
  fullWidth = true,
}) {
  // Generate title based on mode if not provided
  const isEdit = Boolean(currentArtPieceQueue?.id || currentArtPieceQueue?.artPieceQueueId);
  const dialogTitle = title || (isEdit ? 'Edit Queue Item' : 'Add New Harvest URL');

  /**
   * Handles successful form submission by closing dialog and calling success callback.
   * @memberof CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog
   * @function handleSuccess
   * @param {Object} result - Form submission result from art piece queue form
   * @returns {void}
   */
  const handleSuccess = useCallback(
    (result) => {
      debugLog(
        'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog.handleSuccess',
        'Form submission successful, closing dialog',
        {
          operation: result?.operation || 'unknown',
          artPieceQueueId:
            result?.artPieceQueueData?.artPieceQueueId || currentArtPieceQueue?.artPieceQueueId,
          title: result?.artPieceQueueData?.title || currentArtPieceQueue?.title,
          hasCallback: typeof onSuccess === 'function',
        }
      );

      // Close dialog on successful submission
      onClose();

      // Call external success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        try {
          onSuccess(result);
        } catch (error) {
          debugError(
            'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog.handleSuccess',
            'Failed to execute success callback',
            {
              error: error.message,
              result: result ? 'provided' : 'missing',
              artPieceQueueId:
                result?.artPieceQueueData?.artPieceQueueId || currentArtPieceQueue?.artPieceQueueId,
            }
          );
        }
      }
    },
    [onClose, onSuccess, currentArtPieceQueue?.artPieceQueueId, currentArtPieceQueue?.title]
  );

  /**
   * Handles form cancellation by closing the dialog.
   * @memberof CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog
   * @function handleCancel
   * @returns {void}
   */
  const handleCancel = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog.handleCancel',
      'Form cancelled by user',
      {
        artPieceQueueId: currentArtPieceQueue?.artPieceQueueId,
        title: currentArtPieceQueue?.title,
      }
    );

    onClose();
  }, [onClose, currentArtPieceQueue?.artPieceQueueId, currentArtPieceQueue?.title]);

  /**
   * Handles keyboard navigation within the dialog.
   * @memberof CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog
   * @function handleKeyDown
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        debugLog(
          'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog.handleKeyDown',
          'Dialog closed via Escape key',
          {
            artPieceQueueId: currentArtPieceQueue?.artPieceQueueId,
          }
        );
        onClose();
      }
    },
    [onClose, currentArtPieceQueue?.artPieceQueueId]
  );

  // Log dialog open/close state changes for debugging
  if (process.env.NODE_ENV === 'development') {
    debugLog(
      'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog.render',
      'Dialog state',
      {
        open,
        artPieceQueueId: currentArtPieceQueue?.artPieceQueueId,
        title: currentArtPieceQueue?.title,
        hasCurrentArtPieceQueue: !!currentArtPieceQueue,
      }
    );
  }

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-labelledby="art-piece-queue-dialog-title"
      aria-describedby="art-piece-queue-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 400,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Dialog Header with Close Button */}
      <DialogTitle
        id="art-piece-queue-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          {dialogTitle}
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Close dialog"
          sx={{
            color: 'grey.500',
            '&:hover': {
              color: 'grey.700',
              backgroundColor: 'grey.100',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent
        id="art-piece-queue-dialog-description"
        sx={{
          pb: 3,
          p: { xs: 2, sm: 3 },
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            borderRadius: 3,
          },
        }}
      >
        <ArtPieceQueueForm
          currentArtPieceQueue={currentArtPieceQueue}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueDialog
 * @description PropTypes validation for ArtPieceQueueDialog component
 */
ArtPieceQueueDialog.propTypes = {
  currentArtPieceQueue: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    artPieceQueueId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    sourceUrl: PropTypes.string,
    status: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  title: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
};
