/**
 * @namespace CityArtWalks.Forms.Elements.ArtPieceStatus
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for selecting art piece status with role-based restrictions
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, MenuItem, TextField, CircularProgress } from '@mui/material';

import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceStatus
 * @constant STATUS_OPTIONS
 * @description Available status options with their configurations
 */
const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active', adminOnly: false },
  { value: 'PENDING', label: 'Pending', adminOnly: false },
  { value: 'ARCHIVED', label: 'Archived', adminOnly: false },
  { value: 'REVIEW', label: 'Under Review', adminOnly: true },
  { value: 'DELETED', label: 'Deleted', adminOnly: true },
  { value: 'BANNED', label: 'Banned', adminOnly: true },
  { value: 'REJECTED', label: 'Rejected', adminOnly: true },
];

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceStatus
 * @function ElementArtPieceStatus
 * @description Form element component for selecting art piece status with role-based restrictions.
 *
 * This component provides a dropdown select for art piece status values with proper role-based
 * access control. Non-admin users can only select ACTIVE, PENDING, and ARCHIVED statuses.
 * Admin users can select all available status options.
 *
 * Features:
 * - Role-based status option filtering
 * - Dropdown selection of available statuses
 * - Loading and error state handling
 * - Authentication-aware functionality
 * - Form validation integration
 * - Proper labeling and accessibility
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="status"] - The form field name for the status
 * @param {string} [props.label="Status"] - The label text for the select field
 * @param {boolean} [props.native=false] - Whether to use native HTML select element
 * @param {Object} [props.slotProps] - Additional props to pass to the Menu component
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {Object} [props.inputProps] - Additional props to pass to the input element
 * @param {Object} [props.InputLabelProps] - Additional props to pass to the InputLabel component
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered art piece status selection element
 *
 * @example
 * // Basic usage in a form
 * <ElementArtPieceStatus />
 *
 * @example
 * // With custom props
 * <ElementArtPieceStatus
 *   name="status"
 *   label="Art Piece Status"
 *   helperText="Select the current status of the art piece"
 *   disabled={false}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */
export function ElementArtPieceStatus(props) {
  const {
    name = 'status',
    label = 'Status',
    native = false,
    slotProps,
    helperText,
    inputProps,
    InputLabelProps,
    disabled = false,
    ...other
  } = props;

  const { control } = useFormContext();
  const { user, userIsLoading } = useAuthContext();

  const labelId = `art-piece-status-select-label`;

  // Determine if user is admin
  const isAdmin = user?.role === 'ADMIN';

  // Filter status options based on user role
  const availableStatuses = STATUS_OPTIONS.filter((status) => !status.adminOnly || isAdmin);

  if (userIsLoading) {
    return (
      <TextField
        fullWidth
        label={label}
        disabled
        slotProps={{
          input: {
            endAdornment: <CircularProgress size={20} />,
          },
        }}
      />
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error: fieldError } }) => (
            <TextField
              {...field}
              select
              fullWidth
              label={label}
              disabled={disabled}
              slotProps={{
                select: {
                  native,
                  MenuProps: { PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } } },
                  sx: { textTransform: 'capitalize' },
                },
                inputLabel: { htmlFor: labelId, ...InputLabelProps },
                input: { id: labelId, ...inputProps },
              }}
              error={!!fieldError}
              helperText={fieldError ? fieldError.message : helperText}
              {...other}
            >
              <MenuItem value="">
                <em>SELECT STATUS</em>
              </MenuItem>
              {availableStatuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Forms.Elements.ArtPieceStatus
 * @prop {string} [name="status"] - The form field name for the status. Defaults to "status".
 * @prop {string} [label="Status"] - The label text for the select field. Defaults to "Status".
 * @prop {boolean} [native=false] - Whether to use native HTML select element. This prop is optional.
 * @prop {Object} [slotProps] - Additional props to pass to the Menu component. This prop is optional.
 * @prop {string} [helperText] - Helper text to display below the input field. This prop is optional.
 * @prop {Object} [inputProps] - Additional props to pass to the input element. This prop is optional.
 * @prop {Object} [InputLabelProps] - Additional props to pass to the InputLabel component. This prop is optional.
 * @prop {boolean} [disabled=false] - Whether the field is disabled. This prop is optional.
 */
ElementArtPieceStatus.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  native: PropTypes.bool,
  slotProps: PropTypes.object,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  disabled: PropTypes.bool,
};
