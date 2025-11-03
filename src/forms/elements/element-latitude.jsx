/**
 * @namespace CityArtWalks.Forms.Elements.Latitude
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for latitude coordinate input with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Coordinates} - Coordinate handling documentation
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.Latitude
 * @function ElementLatitude
 * @description Form element component for entering latitude coordinates with proper validation.
 *
 * This component provides a numeric input field specifically designed for latitude coordinates,
 * with integrated form validation and error handling through React Hook Form.
 *
 * Features:
 * - Numeric input with latitude-specific validation (-90 to 90 degrees)
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Decimal precision support
 * - Placeholder text with example coordinate
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="latitude"] - The name of the form field
 * @param {string} [props.label="Latitude"] - Label text for the input field
 * @param {string} [props.placeholder="e.g., 45.5152"] - Placeholder text for the input field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [props.inputProps] - Deprecated - use slotProps.input instead
 * @param {Object} [props.InputLabelProps] - Deprecated - use slotProps.inputLabel instead
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered latitude input element
 *
 * @example
 * // Basic usage
 * <ElementLatitude />
 *
 * @example
 * // With custom props
 * <ElementLatitude
 *   name="customLatitude"
 *   label="Location Latitude"
 *   required
 *   helperText="Enter the latitude coordinate for this location"
 * />
 *
 * @example
 * // With custom validation range (still respects -90 to 90 constraint)
 * <ElementLatitude
 *   name="latitude"
 *   placeholder="e.g., 40.7128"
 *   slotProps={{
 *     input: {
 *       step: 'any',
 *       inputProps: {
 *         min: -90,
 *         max: 90,
 *       },
 *     },
 *   }}
 * />
 */
export function ElementLatitude(props) {
  const {
    name = 'latitude',
    label = 'Latitude',
    placeholder = 'e.g., 45.5152',
    required = false,
    disabled = false,
    helperText,
    slotProps,
    inputProps, // Deprecated
    InputLabelProps, // Deprecated
    ...other
  } = props;

  const { control } = useFormContext();
  const labelId = `${name}-input-label`;

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => (
          <TextField
            {...field}
            value={field.value || ''}
            fullWidth
            type="number"
            label={label}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            slotProps={{
              ...slotProps,
              inputLabel: {
                htmlFor: labelId,
                ...InputLabelProps, // Deprecated fallback
                ...slotProps?.inputLabel,
              },
              input: {
                id: labelId,
                step: 'any',
                inputProps: {
                  min: -90,
                  max: 90,
                },
                ...inputProps, // Deprecated fallback
                ...slotProps?.input,
              },
            }}
            error={!!fieldError}
            helperText={fieldError ? fieldError.message : helperText}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementLatitude.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  slotProps: PropTypes.object,
  inputProps: PropTypes.object, // Deprecated
  InputLabelProps: PropTypes.object, // Deprecated
};
