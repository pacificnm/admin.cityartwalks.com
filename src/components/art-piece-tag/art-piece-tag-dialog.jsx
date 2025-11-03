/**
 * Art Piece Tag Dialog Component
 *
 * Modal dialog component for creating and editing art piece tag information with responsive design
 * and accessibility support. Provides comprehensive interface for managing
 * art piece tag details including name, description, and administrative information.
 *
 * Features:
 * - Full accessibility with ARIA labels and focus management
 * - Responsive dialog sizing for different screen sizes
 * - Integration with ArtPieceTagForm for consistent validation and UX
 * - Proper success and cancellation handling
 * - Close button and escape key support
 * - Professional dialog styling with Material-UI
 * - Dynamic title based on create/edit mode
 *
 * @namespace CityArtWalks.Components.ArtPieceTag
 * @fileoverview Dialog component for ArtPieceTag entity management
 * @author Jaimie Garner
 * @version 1.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/art-piece-tag - ArtPieceTag-specific form component
 * @requires src/components/iconify - Icon component for close button
 * @requires src/lib/debug - Debug and error logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceTag} - ArtPieceTag entity documentation
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
import { ArtPieceTagForm } from 'src/forms/art-piece-tag';

import { CloseIcon } from 'src/components/icons';

/**
 * ArtPieceTag Dialog component
 * Modal dialog component for creating and editing art piece tag information with responsive design and accessibility support.
 *
 * @memberof CityArtWalks.Components.ArtPieceTag
 * @function ArtPieceTagDialog
 * @param {Object} props - Component props
 * @param {Object|null} props.currentArtPieceTag - Current art piece tag data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title] - Optional custom title for the dialog (auto-generated if not provided)
 * @param {string} [props.maxWidth='sm'] - Maximum width of the dialog
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @param {Object} [props.user] - User object for permissions (legacy support)
 * @returns {JSX.Element} The rendered ArtPieceTagDialog component
 * @throws {Error} When form operations fail or validation errors occur
 *
 * @example
 * // Create mode
 * <ArtPieceTagDialog
 *   currentArtPieceTag={null}
 *   open={createDialogOpen}
 *   onClose={() => setCreateDialogOpen(false)}
 *   onSuccess={handleTagCreate}
 * />
 *
 * @example
 * // Edit mode
 * <ArtPieceTagDialog
 *   currentArtPieceTag={selectedTag}
 *   open={editDialogOpen}
 *   onClose={() => setEditDialogOpen(false)}
 *   onSuccess={handleTagUpdate}
 *   title="Quick Edit Tag"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceTag} - ArtPieceTag entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceTagDialog({
  currentArtPieceTag,
  open,
  onClose,
  onSuccess,
  title,
  maxWidth = 'sm',
  fullWidth = true,
  user, // Legacy support
}) {
  // Generate title based on mode if not provided
  const isEdit = Boolean(currentArtPieceTag?.id || currentArtPieceTag?.artPieceTagId);
  const dialogTitle = title || (isEdit ? 'Edit Art Piece Tag' : 'Create Art Piece Tag');

  /**
   * Handles successful form submission by closing dialog and calling success callback.
   * @memberof CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog
   * @function handleSuccess
   * @param {Object} result - Form submission result from art piece tag form
   * @returns {void}
   */
  const handleSuccess = useCallback(
    (result) => {
      debugLog(
        'CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog.handleSuccess',
        'Form submission successful, closing dialog',
        {
          operation: result?.operation || 'unknown',
          artPieceTagId:
            result?.artPieceTagData?.artPieceTagId || currentArtPieceTag?.artPieceTagId,
          tagName: result?.artPieceTagData?.name || currentArtPieceTag?.name,
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
            'CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog.handleSuccess',
            'Failed to execute success callback',
            {
              error: error.message,
              result: result ? 'provided' : 'missing',
              artPieceTagId:
                result?.artPieceTagData?.artPieceTagId || currentArtPieceTag?.artPieceTagId,
            }
          );
        }
      }
    },
    [onClose, onSuccess, currentArtPieceTag?.artPieceTagId, currentArtPieceTag?.name]
  );

  /**
   * Handles form cancellation by closing the dialog.
   * @memberof CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog
   * @function handleCancel
   * @returns {void}
   */
  const handleCancel = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog.handleCancel',
      'Form cancelled by user',
      {
        artPieceTagId: currentArtPieceTag?.artPieceTagId,
        tagName: currentArtPieceTag?.name,
      }
    );

    onClose();
  }, [onClose, currentArtPieceTag?.artPieceTagId, currentArtPieceTag?.name]);

  /**
   * Handles keyboard navigation within the dialog.
   * @memberof CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog
   * @function handleKeyDown
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        debugLog(
          'CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog.handleKeyDown',
          'Dialog closed via Escape key',
          {
            artPieceTagId: currentArtPieceTag?.artPieceTagId,
          }
        );
        onClose();
      }
    },
    [onClose, currentArtPieceTag?.artPieceTagId]
  );

  // Log dialog open/close state changes for debugging
  if (process.env.NODE_ENV === 'development') {
    debugLog('CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog.render', 'Dialog state', {
      open,
      artPieceTagId: currentArtPieceTag?.artPieceTagId,
      tagName: currentArtPieceTag?.name,
      hasCurrentArtPieceTag: !!currentArtPieceTag,
    });
  }

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-labelledby="art-piece-tag-dialog-title"
      aria-describedby="art-piece-tag-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 300,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Dialog Header with Close Button */}
      <DialogTitle
        id="art-piece-tag-dialog-title"
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
        id="art-piece-tag-dialog-description"
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
        <ArtPieceTagForm
          currentArtPieceTag={currentArtPieceTag}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          user={user} // Legacy support for existing usage
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtPieceTag.ArtPieceTagDialog
 * @description PropTypes validation for ArtPieceTagDialog component
 */
ArtPieceTagDialog.propTypes = {
  currentArtPieceTag: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    artPieceTagId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  title: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  user: PropTypes.shape({
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    email: PropTypes.string,
    name: PropTypes.string,
  }),
};
