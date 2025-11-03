/**
 * @memberof CityArtWalks.Components.Path
 * @function PathEditDialog
 * @description Modal dialog component for editing path information with responsive design and accessibility support.
 * Integrates with the PathUserEditForm component for form handling and validation.
 * Provides a consistent edit experience across the application.
 *
 * Features:
 * - Modal dialog with form integration
 * - Responsive design with mobile support
 * - Accessibility compliance (ARIA attributes, keyboard navigation)
 * - Multiple close methods (button, escape key, backdrop)
 * - Success/cancel callback handling
 * - Form error delegation
 * - Loading state management
 *
 * @author jaimie garner
 * @version 2.0.0
 *
 * @param {Object} props - Component properties
 * @param {Object|null} props.currentPath - Current path data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title='Edit Path'] - Optional custom title for the dialog
 * @param {string} [props.maxWidth='md'] - Maximum width of the dialog ('sm', 'md', 'lg', 'xl')
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @returns {JSX.Element} The rendered PathEditDialog component
 *
 * @throws {Error} When form operations fail or validation errors occur
 *
 * @example
 * // Basic usage
 * <PathEditDialog
 *   currentPath={selectedPath}
 *   open={dialogOpen}
 *   onClose={() => setDialogOpen(false)}
 *   onSuccess={handleEditSuccess}
 * />
 *
 * @example
 * // With custom title and sizing
 * <PathEditDialog
 *   currentPath={selectedPath}
 *   open={dialogOpen}
 *   onClose={() => setDialogOpen(false)}
 *   onSuccess={handleEditSuccess}
 *   title="Update Path Details"
 *   maxWidth="lg"
 *   fullWidth={true}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path} - Path entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Path} - Database schema reference
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/components/iconify - Icon component for UI elements
 * @requires src/forms/path - PathUserEditForm component for form handling
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { PathUserEditForm } from 'src/forms/path';

import { CloseIcon } from 'src/components/icons';

/**
 * Path Edit Dialog component
 * Modal dialog component for editing path information with clean, consistent design.
 *
 * @memberof CityArtWalks.Components.Path
 * @function PathEditDialog
 */
export function PathEditDialog({
  currentPath,
  open,
  onClose,
  onSuccess,
  onFormChange,
  title = 'Edit Path',
  maxWidth = 'md',
  fullWidth = true,
}) {
  /**
   * @memberof CityArtWalks.Components.Path.PathEditDialog
   * @function handleSuccess
   * @description Handles successful form submission by closing dialog and calling success callback.
   * @param {Object} result - Form submission result from path form
   * @returns {void}
   */
  const handleSuccess = (result) => {
    // Close dialog on successful submission
    onClose();

    // Call external success callback if provided
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess(result);
    }
  };

  /**
   * @memberof CityArtWalks.Components.Path.PathEditDialog
   * @function handleCancel
   * @description Handles form cancellation by closing the dialog.
   * @returns {void}
   */
  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      aria-labelledby="path-edit-dialog-title"
      aria-describedby="path-edit-dialog-description"
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      {/* Dialog Header with Close Button */}
      <DialogTitle
        id="path-edit-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
        }}
      >
        <Box component="span">{title}</Box>
        <IconButton onClick={onClose} aria-label="Close dialog" sx={{ color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent id="path-edit-dialog-description" sx={{ pb: 3 }}>
        <PathUserEditForm
          currentPath={currentPath}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onFormChange={onFormChange}
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * PropTypes validation for the PathEditDialog component
 * @memberof CityArtWalks.Components.Path.PathEditDialog
 */
PathEditDialog.propTypes = {
  currentPath: PropTypes.shape({
    pathId: PropTypes.number,
    title: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    pathType: PropTypes.string,
    distance: PropTypes.number,
    duration: PropTypes.number,
    cityId: PropTypes.number,
    stateId: PropTypes.number,
    countryId: PropTypes.number,
    viewCount: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  onFormChange: PropTypes.func,
  title: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
};
