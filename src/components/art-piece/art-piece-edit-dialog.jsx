/**
 * Art Piece Edit Dialog Component
 *
 * Modal dialog component for editing art piece information with responsive design
 * and accessibility support. Provides comprehensive interface for updating
 * art piece details including title, description, location data, materials,
 * tags, and administrative information.
 *
 * Features:
 * - Full accessibility with ARIA labels and focus management
 * - Responsive dialog sizing for different screen sizes
 * - Integration with ArtPieceForm for consistent validation and UX
 * - Proper success and cancellation handling
 * - Close button and escape key support
 * - Professional dialog styling with Material-UI
 *
 * @namespace CityArtWalks.Components.ArtPiece
 * @fileoverview Edit dialog component for ArtPiece entity management
 * @author Jaimie Garner
 * @version 2.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/art-piece - ArtPiece-specific form component
 * @requires src/components/iconify - Icon component for close button
 * @requires src/lib/debug - Debug and error logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
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

import { ArtPieceForm } from 'src/forms/art-piece';
import { debugLog, debugError } from 'src/lib/debug';

import { CloseIcon } from 'src/components/icons';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';
/**
 * ArtPiece Edit Dialog component
 * Modal dialog component for editing art piece information with responsive design and accessibility support.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceEditDialog
 * @param {Object} props - Component props
 * @param {Object|null} props.currentArtPiece - Current art piece data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title='Edit Art Piece'] - Optional custom title for the dialog
 * @param {string} [props.maxWidth='lg'] - Maximum width of the dialog (larger for complex art piece form)
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @param {Object} [props.user] - User object for permissions (legacy support)
 * @returns {JSX.Element} The rendered ArtPieceEditDialog component
 * @throws {Error} When form operations fail or validation errors occur
 *
 * @example
 * <ArtPieceEditDialog
 *   currentArtPiece={artPiece}
 *   open={editDialogOpen}
 *   onClose={() => setEditDialogOpen(false)}
 *   onSuccess={handleArtPieceUpdate}
 *   title="Quick Edit Art Piece"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceEditDialog({
  currentArtPiece,
  open,
  onClose,
  onSuccess,
  title = 'Edit Art Piece',
  maxWidth = 'lg', // Larger for complex art piece form
  fullWidth = true,
  user, // Legacy support
}) {
  /**
   * Handles successful form submission by closing dialog and calling success callback.
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceEditDialog
   * @function handleSuccess
   * @param {Object} result - Form submission result from art piece form
   * @returns {void}
   */
  const handleSuccess = useCallback(
    (result) => {
      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceEditDialog.handleSuccess',
        'Form submission successful, closing dialog',
        {
          operation: result?.operation || 'unknown',
          artPieceId: result?.artPieceData?.artPieceId || currentArtPiece?.artPieceId,
          artPieceTitle: result?.artPieceData?.title || currentArtPiece?.title,
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
            'CityArtWalks.Components.ArtPiece.ArtPieceEditDialog.handleSuccess',
            'Failed to execute success callback',
            {
              error: error.message,
              result: result ? 'provided' : 'missing',
              artPieceId: result?.artPieceData?.artPieceId || currentArtPiece?.artPieceId,
            }
          );
        }
      }
    },
    [onClose, onSuccess, currentArtPiece?.artPieceId, currentArtPiece?.title]
  );

  /**
   * Handles form cancellation by closing the dialog.
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceEditDialog
   * @function handleCancel
   * @returns {void}
   */
  const handleCancel = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.ArtPiece.ArtPieceEditDialog.handleCancel',
      'Form cancelled by user',
      {
        artPieceId: currentArtPiece?.artPieceId,
        artPieceTitle: currentArtPiece?.title,
      }
    );

    onClose();
  }, [onClose, currentArtPiece?.artPieceId, currentArtPiece?.title]);

  /**
   * Handles keyboard navigation within the dialog.
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceEditDialog
   * @function handleKeyDown
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        debugLog(
          'CityArtWalks.Components.ArtPiece.ArtPieceEditDialog.handleKeyDown',
          'Dialog closed via Escape key',
          {
            artPieceId: currentArtPiece?.artPieceId,
          }
        );
        onClose();
      }
    },
    [onClose, currentArtPiece?.artPieceId]
  );

  // Log dialog open/close state changes for debugging
  if (process.env.NODE_ENV === 'development') {
    debugLog('CityArtWalks.Components.ArtPiece.ArtPieceEditDialog.render', 'Dialog state', {
      open,
      artPieceId: currentArtPiece?.artPieceId,
      artPieceTitle: currentArtPiece?.title,
      hasCurrentArtPiece: !!currentArtPiece,
    });
  }

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-labelledby="art-piece-edit-dialog-title"
      aria-describedby="art-piece-edit-dialog-description"
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
        id="art-piece-edit-dialog-title"
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
          {title}
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
        id="art-piece-edit-dialog-description"
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
        <RoleBasedGuard
          allowedRoles={['MEMBER', 'ADMIN']}
          displayMode="content"
          protecting="ArtPieceEditDialog"
        >
          <ArtPieceForm
            currentArtPiece={currentArtPiece}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            user={user} // Legacy support for existing usage
          />
        </RoleBasedGuard>
      </DialogContent>
    </Dialog>
  );
}
