/**
 * Art Piece Type Dialog Component
 *
 * Modal dialog component for creating and editing art piece type information with responsive design
 * and accessibility support. Provides comprehensive interface for managing
 * art piece type details including name, description, and administrative information.
 *
 * Features:
 * - Full accessibility with ARIA labels and focus management
 * - Responsive dialog sizing for different screen sizes
 * - Integration with ArtPieceTypeForm for consistent validation and UX
 * - Proper success and cancellation handling
 * - Close button and escape key support
 * - Professional dialog styling with Material-UI
 * - Dynamic title based on create/edit mode
 *
 * @namespace CityArtWalks.Components.ArtPieceType
 * @fileoverview Dialog component for ArtPieceType entity management
 * @author Jaimie Garner
 * @version 1.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/art-piece-type - ArtPieceType-specific form component
 * @requires src/components/iconify - Icon component for close button
 * @requires src/lib/debug - Debug and error logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType} - ArtPieceType entity documentation
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
import { ArtPieceTypeForm } from 'src/forms/art-piece-type/art-piece-type-form';

import { CloseIcon } from 'src/components/icons';

/**
 * ArtPieceType Dialog component
 * Modal dialog component for creating and editing art piece type information with responsive design and accessibility support.
 *
 * @memberof CityArtWalks.Components.ArtPieceType
 * @function ArtPieceTypeDialog
 * @param {Object} props - Component props
 * @param {Object|null} props.currentArtPieceType - Current art piece type data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title] - Optional custom title for the dialog (auto-generated if not provided)
 * @param {string} [props.maxWidth='sm'] - Maximum width of the dialog
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @param {Object} [props.user] - User object for permissions (legacy support)
 * @returns {JSX.Element} The rendered ArtPieceTypeDialog component
 * @throws {Error} When form operations fail or validation errors occur
 *
 * @example
 * // Create mode
 * <ArtPieceTypeDialog
 *   currentArtPieceType={null}
 *   open={createDialogOpen}
 *   onClose={() => setCreateDialogOpen(false)}
 *   onSuccess={handleTypeCreate}
 * />
 *
 * @example
 * // Edit mode
 * <ArtPieceTypeDialog
 *   currentArtPieceType={selectedType}
 *   open={editDialogOpen}
 *   onClose={() => setEditDialogOpen(false)}
 *   onSuccess={handleTypeUpdate}
 *   title="Quick Edit Type"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType} - ArtPieceType entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceTypeDialog({
  currentArtPieceType,
  open,
  onClose,
  onSuccess,
  title,
  maxWidth = 'sm',
  fullWidth = true,
  user, // Legacy support
}) {
  // Generate title based on mode if not provided
  const isEdit = Boolean(currentArtPieceType?.id || currentArtPieceType?.artPieceTypeId);
  const dialogTitle = title || (isEdit ? 'Edit Art Piece Type' : 'Create Art Piece Type');

  /**
   * Handles successful form submission by closing dialog and calling success callback.
   * @memberof CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog
   * @function handleSuccess
   * @param {Object} result - Form submission result from art piece type form
   * @returns {void}
   */
  const handleSuccess = useCallback(
    (result) => {
      debugLog(
        'CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog.handleSuccess',
        'Form submission successful, closing dialog',
        {
          operation: result?.operation || 'unknown',
          artPieceTypeId:
            result?.artPieceTypeData?.artPieceTypeId || currentArtPieceType?.artPieceTypeId,
          typeName: result?.artPieceTypeData?.name || currentArtPieceType?.name,
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
            'CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog.handleSuccess',
            'Failed to execute success callback',
            {
              error: error.message,
              result: result ? 'provided' : 'missing',
              artPieceTypeId:
                result?.artPieceTypeData?.artPieceTypeId || currentArtPieceType?.artPieceTypeId,
            }
          );
        }
      }
    },
    [onClose, onSuccess, currentArtPieceType?.artPieceTypeId, currentArtPieceType?.name]
  );

  /**
   * Handles form cancellation by closing the dialog.
   * @memberof CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog
   * @function handleCancel
   * @returns {void}
   */
  const handleCancel = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog.handleCancel',
      'Form cancelled by user',
      {
        artPieceTypeId: currentArtPieceType?.artPieceTypeId,
        typeName: currentArtPieceType?.name,
      }
    );

    onClose();
  }, [onClose, currentArtPieceType?.artPieceTypeId, currentArtPieceType?.name]);

  /**
   * Handles keyboard navigation within the dialog.
   * @memberof CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog
   * @function handleKeyDown
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        debugLog(
          'CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog.handleKeyDown',
          'Dialog closed via Escape key',
          {
            artPieceTypeId: currentArtPieceType?.artPieceTypeId,
          }
        );
        onClose();
      }
    },
    [onClose, currentArtPieceType?.artPieceTypeId]
  );

  // Log dialog open/close state changes for debugging
  if (process.env.NODE_ENV === 'development') {
    debugLog('CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog.render', 'Dialog state', {
      open,
      artPieceTypeId: currentArtPieceType?.artPieceTypeId,
      typeName: currentArtPieceType?.name,
      hasCurrentArtPieceType: !!currentArtPieceType,
    });
  }

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-labelledby="art-piece-type-dialog-title"
      aria-describedby="art-piece-type-dialog-description"
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
        id="art-piece-type-dialog-title"
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
        id="art-piece-type-dialog-description"
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
        <ArtPieceTypeForm
          currentArtPieceType={currentArtPieceType}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          user={user} // Legacy support for existing usage
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtPieceType.ArtPieceTypeDialog
 * @description PropTypes validation for ArtPieceTypeDialog component
 */
ArtPieceTypeDialog.propTypes = {
  currentArtPieceType: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    artPieceTypeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
