/**
 * @namespace CityArtWalks.Forms.Elements.ImageDescription
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Form element for image description input with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image} - Image entity documentation
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.ImageDescription
 * @function ElementImageDescription
 * @description Form element component for entering image descriptions with proper validation.
 *
 * This component provides a multiline text input field specifically designed for image descriptions,
 * with integrated form validation and error handling through React Hook Form.
 *
 * Features:
 * - Multiline text input with proper validation
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Configurable rows and character limits
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="description"] - The name of the form field
 * @param {string} [props.label="Image Description"] - Label text for the input field
 * @param {string} [props.placeholder="Enter a detailed description of the image"] - Placeholder text
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {boolean} [props.multiline=true] - Whether to render as multiline input
 * @param {number} [props.rows=4] - Number of rows for multiline input
 * @param {number} [props.maxRows=8] - Maximum number of rows for multiline input
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {number} [props.maxLength] - Maximum character length for the description
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered image description input element
 *
 * @example
 * // Basic usage
 * <ElementImageDescription />
 *
 * @example
 * // With custom configuration
 * <ElementImageDescription
 *   name="imageDescription"
 *   label="Describe Your Image"
 *   required
 *   rows={6}
 *   maxLength={500}
 *   placeholder="Provide a detailed description of what's shown in the image..."
 * />
 *
 * @example
 * // With helper text and validation
 * <ElementImageDescription
 *   name="description"
 *   label="Image Description"
 *   helperText="This description will be used for accessibility and SEO"
 *   maxLength={1000}
 * />
 */
export function ElementImageDescription(props) {
  const {
    name = 'description',
    label = 'Image Description',
    placeholder = 'Enter a detailed description of the image',
    required = false,
    disabled = false,
    multiline = true,
    rows = 4,
    maxRows = 8,
    helperText,
    maxLength,
    slotProps,
    ...other
  } = props;

  const { control } = useFormContext();

  // Create enhanced helper text with character count if maxLength is specified
  const getHelperText = (error, currentValue) => {
    if (error) return error.message;

    let text = helperText || '';
    if (maxLength && currentValue) {
      const charCount = `${currentValue.length}/${maxLength}`;
      text = text ? `${text} (${charCount})` : charCount;
    }
    return text || undefined;
  };

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
            helperText={getHelperText(error, field.value)}
            inputProps={{
              maxLength,
              ...slotProps?.input,
            }}
            slotProps={{
              ...slotProps,
              input: {
                maxLength,
                ...slotProps?.input,
              },
            }}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementImageDescription.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  maxRows: PropTypes.number,
  helperText: PropTypes.string,
  maxLength: PropTypes.number,
  slotProps: PropTypes.object,
};
