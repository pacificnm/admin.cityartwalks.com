/**
 * @namespace CityArtWalks.Forms.Elements.Description
 * @version 1.0.0
 * @author GitHub Copilot
 * @fileoverview Generic form element for description input with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.Description
 * @function ElementDescription
 * @description Generic form element component for entering descriptions with proper validation.
 *
 * This component provides a text input field specifically designed for description fields,
 * with integrated form validation and error handling through React Hook Form.
 * It defaults to multiline mode for longer text input and can be used for any entity description field.
 *
 * Features:
 * - Multiline text input with proper validation
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Configurable for different description types
 * - Default multiline configuration for longer text
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="description"] - The name of the form field
 * @param {string} [props.label="Description"] - Label text for the input field
 * @param {string} [props.placeholder] - Placeholder text for the input field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.multiline=true] - Whether to render as multiline input
 * @param {number} [props.rows=4] - Number of rows for multiline input
 * @param {number} [props.maxRows] - Maximum number of rows for multiline input
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [props.inputProps] - Deprecated - use slotProps.input instead
 * @param {Object} [props.InputLabelProps] - Deprecated - use slotProps.inputLabel instead
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered description input element
 *
 * @example
 * // Basic usage within a form
 * <ElementDescription />
 *
 * @example
 * // For art piece material descriptions
 * <ElementDescription
 *   name="description"
 *   label="Description"
 *   placeholder="Describe the material properties, characteristics, or usage..."
 *   helperText="Optional description of the material"
 * />
 *
 * @example
 * // For art piece descriptions
 * <ElementDescription
 *   name="description"
 *   label="Art Piece Description"
 *   placeholder="Describe the artwork, its meaning, and context..."
 *   required
 *   rows={6}
 *   helperText="Provide a detailed description of the art piece"
 * />
 *
 * @example
 * // For location descriptions
 * <ElementDescription
 *   name="locationDescription"
 *   label="Location Description"
 *   placeholder="Describe the location, surroundings, and accessibility..."
 *   helperText="Optional description of the location"
 * />
 *
 * @example
 * // Single line description
 * <ElementDescription
 *   name="shortDescription"
 *   label="Short Description"
 *   multiline={false}
 *   placeholder="Brief description..."
 *   helperText="Brief one-line description"
 * />
 *
 * @example
 * // Disabled field (for display only)
 * <ElementDescription
 *   disabled
 *   helperText="System-generated description"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */
export function ElementDescription(props) {
  const {
    name = 'description',
    label = 'Description',
    placeholder,
    required = false,
    disabled = false,
    multiline = true,
    rows = 4,
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

ElementDescription.propTypes = {
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
