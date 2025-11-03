/**
 * @namespace CityArtWalks.Forms.Elements.Name
 * @version 1.0.0
 * @author GitHub Copilot
 * @fileoverview Generic form element for name input with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.Name
 * @function ElementName
 * @description Generic form element component for entering names with proper validation.
 *
 * This component provides a text input field specifically designed for name fields,
 * with integrated form validation and error handling through React Hook Form.
 * It can be used for any entity name field (user names, material names, location names, etc.).
 *
 * Features:
 * - Text input with proper validation
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Configurable for different name types
 * - Support for multiline names when needed
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="name"] - The name of the form field
 * @param {string} [props.label="Name"] - Label text for the input field
 * @param {string} [props.placeholder] - Placeholder text for the input field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.multiline=false] - Whether to render as multiline input
 * @param {number} [props.rows] - Number of rows for multiline input
 * @param {number} [props.maxRows] - Maximum number of rows for multiline input
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [props.inputProps] - Deprecated - use slotProps.input instead
 * @param {Object} [props.InputLabelProps] - Deprecated - use slotProps.inputLabel instead
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered name input element
 *
 * @example
 * // Basic usage within a form
 * <ElementName />
 *
 * @example
 * // For material names
 * <ElementName
 *   name="name"
 *   label="Material name"
 *   placeholder="e.g., Bronze, Marble, Wood, Steel"
 *   required
 *   helperText="Enter the name of the art piece material"
 * />
 *
 * @example
 * // For user full names
 * <ElementName
 *   name="fullName"
 *   label="Full Name"
 *   placeholder="Enter your full name"
 *   required
 *   helperText="First and last name"
 * />
 *
 * @example
 * // For location names
 * <ElementName
 *   name="locationName"
 *   label="Location Name"
 *   placeholder="Enter location name"
 *   helperText="Name of the location or venue"
 * />
 *
 * @example
 * // Disabled field (for display only)
 * <ElementName
 *   disabled
 *   helperText="System-generated name"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */
export function ElementName(props) {
  const {
    name = 'name',
    label = 'Name',
    placeholder,
    required = false,
    disabled = false,
    multiline = false,
    rows,
    maxRows,
    helperText,
    slotProps,
    inputProps, // Deprecated
    InputLabelProps, // Deprecated
    ...other
  } = props;

  const { control } = useFormContext();

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            value={field.value || ''}
            fullWidth
            label={label}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            maxRows={maxRows}
            error={!!error}
            helperText={error ? error.message : helperText}
            slotProps={{
              input: {
                ...slotProps?.input,
                ...inputProps, // Legacy support
              },
              inputLabel: {
                ...slotProps?.inputLabel,
                ...InputLabelProps, // Legacy support
              },
            }}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementName.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  maxRows: PropTypes.number,
  helperText: PropTypes.string,
  slotProps: PropTypes.shape({
    input: PropTypes.object,
    inputLabel: PropTypes.object,
  }),
  inputProps: PropTypes.object, // Deprecated
  InputLabelProps: PropTypes.object, // Deprecated
};
