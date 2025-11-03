/**
 * Artist Image Upload Dialog Component
 *
 * Modal dialog component for uploading images to artists with responsive design
 * and accessibility support. Provides comprehensive interface for managing
 * artist image uploads including file selection, metadata input, and progress tracking.
 *
 * Features:
 * - Full accessibility with ARIA labels and focus management
 * - Responsive dialog sizing for different screen sizes
 * - Integration with ArtistImageUploadForm for consistent validation and UX
 * - Proper success and cancellation handling
 * - Close button and escape key support
 * - Professional dialog styling with Material-UI
 * - Dynamic title based on create/edit mode
 *
 * @namespace CityArtWalks.Components.Artist
 * @fileoverview Dialog component for artist image upload management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/artist - Artist image upload form component
 * @requires src/components/iconify - Icon component for close button
 * @requires src/lib/debug - Debug and error logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
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
import { ArtistImageUploadForm } from 'src/forms/artist';

import { CloseIcon } from 'src/components/icons';

import { OwnerGuard } from 'src/auth/guard';

/**
 * Artist Image Upload Dialog component
 * Modal dialog component for uploading images to artists with responsive design and accessibility support.
 *
 * Provides comprehensive interface for managing artist image uploads with proper form validation,
 * file upload handling, and user feedback. Includes owner-based access control to ensure only
 * authorized users can upload images.
 *
 * @memberof CityArtWalks.Components.Artist
 * @function ArtistImageUploadDialog
 * @param {Object} props - Component props
 * @param {string} props.artistId - The ID of the artist to upload images for
 * @param {string|number} props.createdBy - The user ID of who created/owns this artist
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful image upload
 * @param {string} [props.title='Upload Artist Image'] - Optional custom title for the dialog
 * @param {string} [props.maxWidth='sm'] - Maximum width of the dialog
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @param {string} [props.currentImageUrl] - Current image URL for the artist
 * @returns {JSX.Element} The rendered ArtistImageUploadDialog component
 * @throws {Error} When upload operations fail or validation errors occur
 *
 * @example
 * // Basic usage
 * <ArtistImageUploadDialog
 *   artistId="123"
 *   createdBy="user456"
 *   open={uploadDialogOpen}
 *   onClose={() => setUploadDialogOpen(false)}
 *   onSuccess={handleImageUploadSuccess}
 * />
 *
 * @example
 * // With custom title and size
 * <ArtistImageUploadDialog
 *   artistId="456"
 *   createdBy="user789"
 *   open={isOpen}
 *   onClose={handleClose}
 *   onSuccess={handleSuccess}
 *   title="Update Artist Image"
 *   maxWidth="md"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtistImageUploadDialog(props) {
  const {
    artistId,
    createdBy,
    open,
    onClose,
    onSuccess,
    title = 'Upload Artist Image',
    maxWidth = 'sm',
    fullWidth = true,
    currentImageUrl,
  } = props;

  /**
   * Handles successful image upload by logging the event and calling external callbacks.
   * @param {Object} result - The upload result from the form submission
   */
  const handleSuccess = useCallback(
    async (result) => {
      debugLog(
        'CityArtWalks.Components.Artist.ArtistImageUploadDialog.handleSuccess',
        'Image upload completed successfully',
        {
          artistId,
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
            'CityArtWalks.Components.Artist.ArtistImageUploadDialog.handleSuccess',
            'Failed to execute success callback',
            {
              error: error.message,
              result: result ? 'provided' : 'missing',
              artistId,
            }
          );
          // Re-throw to prevent dialog from closing on error
          throw error;
        }
      } else {
        onClose();
      }
    },
    [onSuccess, onClose, artistId]
  );

  /**
   * Handles dialog close action with proper cleanup and logging
   */
  const handleClose = useCallback(() => {
    debugLog(
      'CityArtWalks.Components.Artist.ArtistImageUploadDialog.handleClose',
      'Dialog closed by user',
      {
        artistId,
      }
    );
    onClose();
  }, [onClose, artistId]);

  return (
    <OwnerGuard userId={createdBy}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'background.default',
          },
        }}
        aria-labelledby="artist-image-upload-dialog-title"
        aria-describedby="artist-image-upload-dialog-description"
      >
        <DialogTitle
          id="artist-image-upload-dialog-title"
          sx={{
            pb: 2,
            pr: 6,
            position: 'relative',
          }}
        >
          {title}
          <Box
            sx={{
              top: 16,
              right: 16,
              position: 'absolute',
            }}
          >
            <IconButton onClick={handleClose} aria-label="Close dialog">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 0, pb: 3 }}>
          <ArtistImageUploadForm
            artistId={artistId}
            onSuccess={handleSuccess}
            onCancel={handleClose}
            currentImageUrl={currentImageUrl}
          />
        </DialogContent>
      </Dialog>
    </OwnerGuard>
  );
}

/**
 * PropTypes for ArtistImageUploadDialog component
 * @memberof CityArtWalks.Components.Artist.ArtistImageUploadDialog
 */
ArtistImageUploadDialog.propTypes = {
  artistId: PropTypes.string.isRequired,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  title: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  currentImageUrl: PropTypes.string,
};
