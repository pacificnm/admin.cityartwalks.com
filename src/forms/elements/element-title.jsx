/**
 * @namespace CityArtWalks.Forms.Elements.Title
 * @version 1.0.0
 * @author Claude Code Assistant
 * @fileoverview Reusable form element for title input with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.Title
 * @function ElementTitle
 * @description Reusable form element component for entering titles with proper validation.
 *
 * This component provides a generic text input field designed for title inputs across
 * different entities (posts, art pieces, artists, etc.), with integrated form validation
 * and error handling through React Hook Form.
 *
 * Features:
 * - Text input with proper validation
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Configurable for different title types
 * - Support for multiline titles when needed
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="title"] - The name of the form field
 * @param {string} [props.label="Title"] - Label text for the input field
 * @param {string} [props.placeholder="Enter title..."] - Placeholder text for the input field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.multiline=false] - Whether to render as multiline input
 * @param {number} [props.rows] - Number of rows for multiline input
 * @param {number} [props.maxRows] - Maximum number of rows for multiline input
 * @param {string} [props.helperText="Enter a descriptive title"] - Helper text to display below the input field
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [props.inputProps] - Deprecated - use slotProps.input instead
 * @param {Object} [props.InputLabelProps] - Deprecated - use slotProps.inputLabel instead
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered title input element
 *
 * @example
 * // Basic usage
 * <ElementTitle />
 *
 * @example
 * // For a post title
 * <ElementTitle
 *   name="title"
 *   label="Post Title"
 *   placeholder="Enter an engaging title..."
 *   required
 *   helperText="Create a compelling title that captures readers' attention"
 * />
 *
 * @example
 * // For an art piece title
 * <ElementTitle
 *   name="title"
 *   label="Art Piece Title"
 *   placeholder="Enter the artwork title..."
 *   required
 *   helperText="Enter the official title of the artwork"
 * />
 *
 * @example
 * // Multiline title for longer content
 * <ElementTitle
 *   name="title"
 *   label="Event Title"
 *   multiline
 *   rows={2}
 *   maxRows={3}
 *   helperText="Enter the full event title (can span multiple lines)"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */
export function ElementTitle(props) {
  const {
    name = 'title',
    label = 'Title',
    placeholder = 'Enter title...',
    required = false,
    disabled = false,
    multiline = false,
    rows,
    maxRows,
    helperText = 'Enter a descriptive title',
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

ElementTitle.propTypes = {
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
