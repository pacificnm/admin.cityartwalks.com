'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { CityForm } from 'src/forms/city';

import { CloseIcon } from 'src/components/icons';

/**
 * City Edit Dialog Component
 *
 * Modal dialog component for editing city information with responsive design
 * and accessibility support. Provides a clean interface for updating
 * city details through the integrated CityForm component.
 *
 * @namespace CityArtWalks.Components.City
 * @fileoverview Edit dialog component for City entity management
 * @author Jaimie Garner
 * @version 3.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for dialog structure
 * @requires src/forms/city - City-specific form component
 * @requires src/components/iconify - Icon component for close button
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City} - City entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

/**
 * City Edit Dialog component
 * Modal dialog component for editing city information with clean, consistent design.
 *
 * @memberof CityArtWalks.Components.City
 * @function CityEditDialog
 * @param {Object} props - Component props
 * @param {Object|null} props.currentCity - Current city data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title='Edit City'] - Optional custom title for the dialog
 * @param {string} [props.maxWidth='md'] - Maximum width of the dialog
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @returns {JSX.Element} The rendered CityEditDialog component
 *
 * @example
 * <CityEditDialog
 *   currentCity={city}
 *   open={editDialogOpen}
 *   onClose={() => setEditDialogOpen(false)}
 *   onSuccess={handleCityUpdate}
 * />
 */
export function CityEditDialog({
  currentCity,
  open,
  onClose,
  onSuccess,
  title = 'Edit City',
  maxWidth = 'md',
  fullWidth = true,
}) {
  /**
   * @memberof CityArtWalks.Components.City.CityEditDialog
   * @function handleSuccess
   * @description Handles successful form submission by closing dialog and calling success callback.
   * @param {Object} result - Form submission result from city form
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
   * @memberof CityArtWalks.Components.City.CityEditDialog
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
      aria-labelledby="city-edit-dialog-title"
      aria-describedby="city-edit-dialog-description"
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      {/* Dialog Header with Close Button */}
      <DialogTitle
        id="city-edit-dialog-title"
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
      <DialogContent id="city-edit-dialog-description" sx={{ pb: 3 }}>
        <CityForm currentCity={currentCity} onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * PropTypes validation for the CityEditDialog component
 * @memberof CityArtWalks.Components.City.CityEditDialog
 */
CityEditDialog.propTypes = {
  /**
   * Current city data for editing operations
   * @type {Object|null}
   */
  currentCity: PropTypes.shape({
    cityId: PropTypes.number,
    name: PropTypes.string,
    slug: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    imageUrl: PropTypes.string,
    active: PropTypes.bool,
    stateId: PropTypes.number,
    countryId: PropTypes.number,
  }),

  /**
   * Whether the dialog is open
   * @type {boolean}
   */
  open: PropTypes.bool.isRequired,

  /**
   * Function called when dialog should close
   * @type {Function}
   */
  onClose: PropTypes.func.isRequired,

  /**
   * Optional callback function called after successful form submission
   * @type {Function}
   */
  onSuccess: PropTypes.func,

  /**
   * Optional custom title for the dialog
   * @type {string}
   */
  title: PropTypes.string,

  /**
   * Maximum width of the dialog
   * @type {string}
   */
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),

  /**
   * Whether dialog should take full width
   * @type {boolean}
   */
  fullWidth: PropTypes.bool,
};
