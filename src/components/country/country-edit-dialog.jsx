/**
 * @version 1.1.0
 * @author Jaimie Garner
 * @memberof CityArtWalks.Components.Country
 * @fileoverview Modal dialog component for editing Country entities with responsive design and accessibility support.
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country} - Country entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { CountryForm } from 'src/forms/country';

import { CloseIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Country
 * @function CountryEditDialog
 * @description Modal dialog component for editing country information with responsive design and accessibility support.
 * @param {Object} props - Component props
 * @param {Object|null} props.currentCountry - Current country data for editing
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function called when dialog should close
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {string} [props.title] - Optional custom title for the dialog
 * @param {string} [props.maxWidth='md'] - Maximum width of the dialog
 * @param {boolean} [props.fullWidth=true] - Whether dialog should take full width
 * @returns {JSX.Element} The rendered CountryEditDialog component
 * @throws {Error} When form operations fail or validation errors occur
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country} - Country entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function CountryEditDialog({
  currentCountry,
  open,
  onClose,
  onSuccess,
  title = 'Edit Country',
  maxWidth = 'md',
  fullWidth = true,
}) {
  /**
   * @memberof CityArtWalks.Components.Country.CountryEditDialog
   * @function handleSuccess
   * @description Handles successful form submission by closing dialog and calling success callback.
   * @param {Object} result - Form submission result from country form
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
   * @memberof CityArtWalks.Components.Country.CountryEditDialog
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
      aria-labelledby="country-edit-dialog-title"
      aria-describedby="country-edit-dialog-description"
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      {/* Dialog Header with Close Button */}
      <DialogTitle
        id="country-edit-dialog-title"
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
      <DialogContent id="country-edit-dialog-description" sx={{ pb: 3 }}>
        <CountryForm
          currentCountry={currentCountry}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * PropTypes validation for the CountryEditDialog component
 * @memberof CityArtWalks.Components.Country.CountryEditDialog
 */
CountryEditDialog.propTypes = {
  /**
   * Current country data for editing operations
   * @type {Object|null}
   */
  currentCountry: PropTypes.shape({
    countryId: PropTypes.number,
    name: PropTypes.string,
    slug: PropTypes.string,
    code: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    imageUrl: PropTypes.string,
    active: PropTypes.bool,
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
