/**
 * Art Piece Image Upload Dialog Component
 *
 * Modal dialog component for uploading images to art pieces with responsive design
 * and accessibility support. Provides comprehensive interface for managing
 * art piece image uploads including file selection, metadata input, and progress tracking.
 *
 * Features:
 * - Full accessibility with ARIA labels and focus management
 * - Responsive dialog sizing for different screen sizes
 * - Integration with ArtPieceImageUploadForm for consistent validation and UX
 * - Proper success and cancellation handling
 * - Close button and escape key support
 * - Professional dialog styling with Material-UI
 * - Dynamic title based on create/edit mode
 *
 * @namespace CityArtWalks.Components.ArtPiece
 * @fileoverview Dialog component for art piece image upload management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/art-piece - ArtPiece image upload form component
 * @requires src/components/iconify - Icon component for close button
 * @requires src/lib/debug - Debug and error logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { debugLog, debugError } from 'src/lib/debug';
import { ArtPieceImageUploadForm } from 'src/forms/art-piece';

import { CloseIcon } from 'src/components/icons';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * Art Piece Image Upload Dialog component
 * Modal dialog component for uploading images to art pieces with responsive design and accessibility support.
 *
 * Provides comprehensive interface for managing art piece image uploads with proper form validation,
 * file upload handling, and user feedback. Includes role-based access control to ensure only
 * authorized users can upload images.
 *
 * @memberof CityArtWalks.Components.ArtPiece
 * @function ArtPieceImageUploadDialog
 * @param {Object} props - Component props
 * @param {string} props.artPieceId - The ID of the art piece to upload images for
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful image upload
 * @param {string} [props.title='Upload Art Piece Image'] - Optional custom title for the dialog
 * @param {Object} [props.user] - User object for permissions (legacy support)
 * @returns {JSX.Element} The rendered ArtPieceImageUploadDialog component
 * @throws {Error} When upload operations fail or validation errors occur
 *
 * @example
 * // Basic usage
 * <ArtPieceImageUploadDialog
 *   artPieceId="123"
 *   open={uploadDialogOpen}
 *   onClose={() => setUploadDialogOpen(false)}
 *   onSuccess={handleImageUploadSuccess}
 * />
 *
 * @example
 * // With custom title
 * <ArtPieceImageUploadDialog
 *   artPieceId="456"
 *   open={isOpen}
 *   onClose={handleClose}
 *   onSuccess={handleSuccess}
 *   title="Add New Image"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceImageUploadDialog(props) {
  const {
    artPieceId,
    open,
    onClose,
    onSuccess,
    title = 'Upload Art Piece Image',
    user, // Legacy support
  } = props;

  /**
   * Handles successful image upload by logging the event and calling external callbacks.
   * @param {Object} result - The upload result from the form submission
   */
  const handleSuccess = useCallback(
    async (result) => {
      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceImageUploadDialog.handleSuccess',
        'Image upload completed successfully',
        {
          artPieceId,
          uploadResult: result ? 'provided' : 'missing',
          hasImageData: !!result?.imageData,
          imageName: result?.imageData?.caption || 'no caption provided',
        }
      );

      // Call external success callback if provided FIRST
      if (onSuccess && typeof onSuccess === 'function') {
        try {
          await onSuccess(result);
          // Only close dialog if callback succeeds
          onClose();
        } catch (error) {
          console.error('External onSuccess callback failed:', error);
          debugError(
            'CityArtWalks.Components.ArtPiece.ArtPieceImageUploadDialog.handleSuccess',
            'Failed to execute success callback',
            {
              error: error.message,
              result: result ? 'provided' : 'missing',
              artPieceId,
            }
          );
          // Don't close dialog if callback fails, so user can retry
          return;
        }
      } else {
        // No callback provided, just close the dialog
        onClose();
      }
    },
    [onClose, onSuccess, artPieceId]
  );

  /**
   * Handles form cancellation by closing the dialog.
   */
  const handleCancel = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.ArtPiece.ArtPieceImageUploadDialog.handleCancel',
      'Image upload dialog cancelled',
      {
        artPieceId,
      }
    );
    onClose();
  }, [onClose, artPieceId]);

  /**
   * Handles keyboard events for dialog accessibility.
   * @param {KeyboardEvent} event - The keyboard event
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-labelledby="art-piece-image-upload-dialog-title"
      aria-describedby="art-piece-image-upload-dialog-description"
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent
        sx={{
          p: 3,
          flex: 1,
          overflow: 'auto',
        }}
      >
        <RoleBasedGuard
          allowedRoles={['MEMBER', 'ADMIN']}
          displayMode="content"
          protecting="ArtPieceImageUploadDialog"
        >
          <ArtPieceImageUploadForm
            artPieceId={artPieceId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            user={user} // Legacy support for existing usage
          />
        </RoleBasedGuard>
      </DialogContent>
    </Dialog>
  );
}

ArtPieceImageUploadDialog.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  title: PropTypes.string,
  user: PropTypes.object, // Legacy support
};
