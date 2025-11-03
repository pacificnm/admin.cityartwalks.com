/**
 * @namespace CityArtWalks.Forms.Elements.ImageTitle
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for image title input with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image} - Image entity documentation
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.ImageTitle
 * @function ElementImageTitle
 * @description Form element component for entering image titles with proper validation.
 *
 * This component provides a text input field specifically designed for image titles,
 * with integrated form validation and error handling through React Hook Form.
 *
 * Features:
 * - Text input with proper validation
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="title"] - The name of the form field
 * @param {string} [props.label="Image Title"] - Label text for the input field
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
 * @returns {JSX.Element} The rendered image title input element
 *
 * @example
 * // Basic usage
 * <ElementImageTitle />
 *
 * @example
 * // With custom label and validation
 * <ElementImageTitle
 *   name="imageTitle"
 *   label="Upload Image Title"
 *   required
 *   placeholder="Enter a descriptive title for your image"
 * />
 *
 * @example
 * // With helper text and multiline
 * <ElementImageTitle
 *   name="title"
 *   label="Image Title"
 *   multiline
 *   rows={2}
 *   helperText="Enter a title that describes the image content"
 * />
 */
export function ElementImageTitle(props) {
  const {
    name = 'title',
    label = 'Image Title',
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
            fullWidth
            label={label}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            maxRows={maxRows}
            error={!!error}
            helperText={error ? error?.message : helperText}
            slotProps={{
              input: {
                ...slotProps?.input,
                ...inputProps, // Support deprecated prop
              },
              inputLabel: {
                ...slotProps?.inputLabel,
                ...InputLabelProps, // Support deprecated prop
              },
              ...slotProps,
            }}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementImageTitle.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  maxRows: PropTypes.number,
  helperText: PropTypes.string,
  slotProps: PropTypes.object,
  // Deprecated props - maintained for backward compatibility
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
};
