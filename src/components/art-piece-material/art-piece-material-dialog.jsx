/**
 * Art Piece Material Dialog Component
 *
 * Modal dialog component for creating and editing art piece material information with responsive design
 * and accessibility support. Provides comprehensive interface for managing
 * art piece material details including name, description, and administrative information.
 *
 * Features:
 * - Full accessibility with ARIA labels and focus management
 * - Responsive dialog sizing for different screen sizes
 * - Integration with ArtPieceMaterialForm for consistent validation and UX
 * - Proper success and cancellation handling
 * - Close button and escape key support
 * - Professional dialog styling with Material-UI
 * - Dynamic title based on create/edit mode
 *
 * @namespace CityArtWalks.Components.ArtPieceMaterial
 * @fileoverview Dialog component for ArtPieceMaterial entity management
 * @author Jaimie Garner
 * @version 1.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/art-piece-material - ArtPieceMaterial-specific form component
 * @requires src/components/iconify - Icon component for close button
 * @requires src/lib/debug - Debug and error logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceMaterial} - ArtPieceMaterial entity documentation
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
import { ArtPieceMaterialForm } from 'src/forms/art-piece-material';

import { CloseIcon } from 'src/components/icons';

/**
 * ArtPieceMaterial Dialog component
 * Modal dialog component for creating and editing art piece material information with responsive design and accessibility support.
 *
 * @memberof CityArtWalks.Components.ArtPieceMaterial
 * @function ArtPieceMaterialDialog
 * @param {Object} props - Component props
 * @param {Object|null} props.currentArtPieceMaterial - Current art piece material data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title] - Optional custom title for the dialog (auto-generated if not provided)
 * @param {string} [props.maxWidth='sm'] - Maximum width of the dialog
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @param {Object} [props.user] - User object for permissions (legacy support)
 * @returns {JSX.Element} The rendered ArtPieceMaterialDialog component
 * @throws {Error} When form operations fail or validation errors occur
 *
 * @example
 * // Create mode
 * <ArtPieceMaterialDialog
 *   currentArtPieceMaterial={null}
 *   open={createDialogOpen}
 *   onClose={() => setCreateDialogOpen(false)}
 *   onSuccess={handleMaterialCreate}
 * />
 *
 * @example
 * // Edit mode
 * <ArtPieceMaterialDialog
 *   currentArtPieceMaterial={selectedMaterial}
 *   open={editDialogOpen}
 *   onClose={() => setEditDialogOpen(false)}
 *   onSuccess={handleMaterialUpdate}
 *   title="Quick Edit Material"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceMaterial} - ArtPieceMaterial entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceMaterialDialog({
  currentArtPieceMaterial,
  open,
  onClose,
  onSuccess,
  title,
  maxWidth = 'sm',
  fullWidth = true,
  user, // Legacy support
}) {
  // Generate title based on mode if not provided
  const isEdit = Boolean(
    currentArtPieceMaterial?.id || currentArtPieceMaterial?.artPieceMaterialId
  );
  const dialogTitle = title || (isEdit ? 'Edit Art Piece Material' : 'Create Art Piece Material');

  /**
   * Handles successful form submission by closing dialog and calling success callback.
   * @memberof CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog
   * @function handleSuccess
   * @param {Object} result - Form submission result from art piece material form
   * @returns {void}
   */
  const handleSuccess = useCallback(
    (result) => {
      debugLog(
        'CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog.handleSuccess',
        'Form submission successful, closing dialog',
        {
          operation: result?.operation || 'unknown',
          artPieceMaterialId:
            result?.artPieceMaterialData?.artPieceMaterialId ||
            currentArtPieceMaterial?.artPieceMaterialId,
          materialName: result?.artPieceMaterialData?.name || currentArtPieceMaterial?.name,
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
            'CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog.handleSuccess',
            'Failed to execute success callback',
            {
              error: error.message,
              result: result ? 'provided' : 'missing',
              artPieceMaterialId:
                result?.artPieceMaterialData?.artPieceMaterialId ||
                currentArtPieceMaterial?.artPieceMaterialId,
            }
          );
        }
      }
    },
    [onClose, onSuccess, currentArtPieceMaterial?.artPieceMaterialId, currentArtPieceMaterial?.name]
  );

  /**
   * Handles form cancellation by closing the dialog.
   * @memberof CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog
   * @function handleCancel
   * @returns {void}
   */
  const handleCancel = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog.handleCancel',
      'Form cancelled by user',
      {
        artPieceMaterialId: currentArtPieceMaterial?.artPieceMaterialId,
        materialName: currentArtPieceMaterial?.name,
      }
    );

    onClose();
  }, [onClose, currentArtPieceMaterial?.artPieceMaterialId, currentArtPieceMaterial?.name]);

  /**
   * Handles keyboard navigation within the dialog.
   * @memberof CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog
   * @function handleKeyDown
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        debugLog(
          'CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog.handleKeyDown',
          'Dialog closed via Escape key',
          {
            artPieceMaterialId: currentArtPieceMaterial?.artPieceMaterialId,
          }
        );
        onClose();
      }
    },
    [onClose, currentArtPieceMaterial?.artPieceMaterialId]
  );

  // Log dialog open/close state changes for debugging
  if (process.env.NODE_ENV === 'development') {
    debugLog(
      'CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog.render',
      'Dialog state',
      {
        open,
        artPieceMaterialId: currentArtPieceMaterial?.artPieceMaterialId,
        materialName: currentArtPieceMaterial?.name,
        hasCurrentArtPieceMaterial: !!currentArtPieceMaterial,
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
      aria-labelledby="art-piece-material-dialog-title"
      aria-describedby="art-piece-material-dialog-description"
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
        id="art-piece-material-dialog-title"
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
        id="art-piece-material-dialog-description"
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
        <ArtPieceMaterialForm
          currentArtPieceMaterial={currentArtPieceMaterial}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          user={user} // Legacy support for existing usage
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialDialog
 * @description PropTypes validation for ArtPieceMaterialDialog component
 */
ArtPieceMaterialDialog.propTypes = {
  currentArtPieceMaterial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    artPieceMaterialId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
