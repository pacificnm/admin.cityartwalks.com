/**
 * Post Image Upload Dialog Component
 *
 * Modal dialog component for uploading images to posts with responsive design
 * and accessibility support. Provides comprehensive interface for managing
 * post image uploads including file selection, metadata input, and progress tracking.
 *
 * Features:
 * - Full accessibility with ARIA labels and focus management
 * - Responsive dialog sizing for different screen sizes
 * - Integration with PostImageUploadForm for consistent validation and UX
 * - Proper success and cancellation handling
 * - Close button and escape key support
 * - Professional dialog styling with Material-UI
 * - Dynamic title based on create/edit mode
 *
 * @namespace CityArtWalks.Components.Post
 * @fileoverview Dialog component for post image upload management
 * @author Claude Code Assistant
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/post - Post image upload form component
 * @requires src/components/iconify - Icon component for close button
 * @requires src/lib/debug - Debug and error logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
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
import { PostImageUploadForm } from 'src/forms/post';

import { CloseIcon } from 'src/components/icons';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * Post Image Upload Dialog component
 * Modal dialog component for uploading images to posts with responsive design and accessibility support.
 *
 * Provides comprehensive interface for managing post image uploads with proper form validation,
 * file upload handling, and user feedback. Includes role-based access control to ensure only
 * authorized users can upload images.
 *
 * @memberof CityArtWalks.Components.Post
 * @function PostImageUploadDialog
 * @param {Object} props - Component props
 * @param {string|number} props.postId - The ID of the post to upload images for
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful image upload
 * @param {string} [props.title='Upload Post Image'] - Optional custom title for the dialog
 * @param {Object} [props.user] - User object for permissions (legacy support)
 * @returns {JSX.Element} The rendered PostImageUploadDialog component
 * @throws {Error} When upload operations fail or validation errors occur
 *
 * @example
 * // Basic usage
 * <PostImageUploadDialog
 *   postId="123"
 *   open={uploadDialogOpen}
 *   onClose={() => setUploadDialogOpen(false)}
 *   onSuccess={handleImageUploadSuccess}
 * />
 *
 * @example
 * // With custom title
 * <PostImageUploadDialog
 *   postId="456"
 *   open={isOpen}
 *   onClose={handleClose}
 *   onSuccess={handleSuccess}
 *   title="Add New Image"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function PostImageUploadDialog(props) {
  const { postId, open, onClose, onSuccess, title = 'Upload Post Image', user, ...other } = props;

  /**
   * Handles successful image upload
   * Calls the onSuccess callback and closes the dialog
   */
  const handleSuccess = useCallback(
    (result) => {
      debugLog('PostImageUploadDialog.handleSuccess', 'Image upload completed successfully', {
        postId,
        result,
      });

      try {
        // Call parent success handler first
        if (onSuccess) {
          onSuccess(result);
        }

        // Close dialog
        onClose();
      } catch (error) {
        debugError('PostImageUploadDialog.handleSuccess', 'Error in success handler', error);
      }
    },
    [postId, onSuccess, onClose]
  );

  /**
   * Handles dialog close with cleanup
   */
  const handleClose = useCallback(() => {
    debugLog('PostImageUploadDialog.handleClose', 'Dialog closed by user', { postId });
    onClose();
  }, [postId, onClose]);

  /**
   * Handles form cancellation
   */
  const handleCancel = useCallback(() => {
    debugLog('PostImageUploadDialog.handleCancel', 'Upload cancelled by user', { postId });
    onClose();
  }, [postId, onClose]);

  return (
    <RoleBasedGuard hasContent roles={['MEMBER', 'ADMIN']}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={false}
        aria-labelledby="post-image-upload-dialog-title"
        aria-describedby="post-image-upload-dialog-description"
        {...other}
      >
        {/* Dialog Header */}
        <AppBar position="relative" elevation={0}>
          <Toolbar>
            <Typography
              variant="h6"
              component="h2"
              id="post-image-upload-dialog-title"
              sx={{ flexGrow: 1 }}
            >
              {title}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close dialog">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Dialog Content */}
        <DialogContent
          id="post-image-upload-dialog-description"
          sx={{
            py: 3,
            px: 3,
            minHeight: 400,
          }}
        >
          <PostImageUploadForm
            postId={postId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            user={user}
          />
        </DialogContent>
      </Dialog>
    </RoleBasedGuard>
  );
}

PostImageUploadDialog.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  title: PropTypes.string,
  user: PropTypes.object,
};
