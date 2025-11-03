/**
 * @namespace CityArtWalks.Forms.Elements.Status
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for selecting entity status with role-based restrictions
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema} - Database schema documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { Box, MenuItem, TextField, CircularProgress } from '@mui/material';

import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Elements.Status
 * @constant STATUS_OPTIONS
 * @description Available status options with their configurations for the Status enum
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#status} - Status enum documentation
 */
const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active', adminOnly: false },
  { value: 'PENDING', label: 'Pending', adminOnly: false },
  { value: 'ARCHIVED', label: 'Archived', adminOnly: false },
  { value: 'REVIEW', label: 'Under Review', adminOnly: true },
  { value: 'DELETED', label: 'Deleted', adminOnly: true },
  { value: 'BANNED', label: 'Banned', adminOnly: true },
  { value: 'REJECTED', label: 'Rejected', adminOnly: true },
  { value: 'FLAGGED', label: 'Flagged', adminOnly: true },
];

/**
 * @memberof CityArtWalks.Forms.Elements.Status
 * @function ElementStatus
 * @description Form element component for selecting entity status with role-based restrictions.
 *
 * This component provides a dropdown select for status values with proper role-based
 * access control. Non-admin users can only select ACTIVE, PENDING, and ARCHIVED statuses.
 * Admin users can select all available status options.
 *
 * Features:
 * - Role-based status option filtering
 * - Dropdown selection of available statuses
 * - Loading and error state handling
 * - Authentication-aware functionality
 * - Form validation integration
 *
 * @param {Object} props - Component props
 * @param {string} [props.name='status'] - Field name for form control
 * @param {string} [props.label='Status'] - Input label text
 * @param {boolean} [props.native=false] - Use native select element
 * @param {Object} [props.slotProps] - Props for Material-UI slots
 * @param {string} [props.helperText] - Helper text to display
 * @param {Object} [props.inputProps] - Props for input element
 * @param {Object} [props.InputLabelProps] - Props for input label
 * @param {boolean} [props.disabled=false] - Disable the input
 *
 * @returns {JSX.Element} The rendered status selection component
 *
 * @example
 * // Basic usage
 * <ElementStatus name="status" label="Status" />
 *
 * @example
 * // Custom field name and label
 * <ElementStatus name="artistStatus" label="Artist Status" />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 */
export function ElementStatus(props) {
  const {
    name = 'status',
    label = 'Status',
    slotProps,
    helperText,
    inputProps,
    InputLabelProps,
    disabled = false,
    ...other
  } = props;

  const { control } = useFormContext();
  const { user, userIsLoading } = useAuthContext();

  const labelId = `status-select-label`;

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
    <ErrorBoundary componentName="ElementStatus" errorContext={{ name, label }}>
      <Box sx={{ minWidth: 120 }}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              fullWidth
              label={label}
              error={!!error}
              helperText={error ? error?.message : helperText}
              InputLabelProps={{
                id: labelId,
                ...InputLabelProps,
              }}
              disabled={disabled}
              slotProps={slotProps}
              inputProps={inputProps}
              {...other}
            >
              {availableStatuses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>
    </ErrorBoundary>
  );
}

ElementStatus.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  slotProps: PropTypes.object,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  disabled: PropTypes.bool,
};
