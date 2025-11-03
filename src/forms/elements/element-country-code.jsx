/**
 * @namespace CityArtWalks.Forms.Elements.CountryCode
 * @version 1.0.0
 * @author GitHub Copilot
 * @fileoverview Generic form element for country code input with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country} - Country entity documentation
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.CountryCode
 * @function ElementCountryCode
 * @description Generic form element component for entering country codes with proper validation.
 *
 * This component provides a text input field specifically designed for country code fields,
 * with integrated form validation and error handling through React Hook Form.
 * It supports both 2-letter (ISO 3166-1 alpha-2) and 3-letter (ISO 3166-1 alpha-3) country codes.
 *
 * Features:
 * - Text input with country code validation
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Uppercase transformation for country codes
 * - Built-in helper text with formatting guidance
 * - Support for both ISO formats
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="code"] - The name of the form field
 * @param {string} [props.label="Country Code"] - Label text for the input field
 * @param {string} [props.placeholder] - Placeholder text for the input field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {string} [props.helperText] - Helper text to display below the input field
 * @param {number} [props.maxLength=3] - Maximum length for country code (2 or 3 characters)
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [...props.other] - Other props to pass to the TextField component
 *
 * @returns {JSX.Element} The rendered country code input element
 *
 * @example
 * // Basic country code input
 * <ElementCountryCode
 *   name="code"
 *   label="Country Code"
 *   required
 * />
 *
 * @example
 * // Country code with custom validation
 * <ElementCountryCode
 *   name="countryCode"
 *   label="ISO Country Code"
 *   placeholder="e.g., US, USA"
 *   helperText="Enter 2 or 3 letter ISO country code"
 *   required
 * />
 *
 * @example
 * // 2-letter country code only
 * <ElementCountryCode
 *   name="alpha2Code"
 *   label="Alpha-2 Code"
 *   maxLength={2}
 *   helperText="2-letter ISO 3166-1 alpha-2 code (e.g., US, CA, UK)"
 * />
 */
export function ElementCountryCode({
  name = 'code',
  label = 'Country Code',
  placeholder,
  required = false,
  disabled = false,
  helperText,
  maxLength = 3,
  slotProps,
  ...other
}) {
  const { control } = useFormContext();

  const defaultHelperText =
    maxLength === 2
      ? '2-letter ISO country code (e.g., US, CA, UK)'
      : '2 or 3 letter ISO country code (e.g., US, USA, CA, CAN)';

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
            error={!!error}
            helperText={error ? error.message : helperText || defaultHelperText}
            slotProps={{
              input: {
                maxLength,
                style: { textTransform: 'uppercase' },
                ...slotProps?.input,
              },
              inputLabel: {
                ...slotProps?.inputLabel,
              },
              ...slotProps,
            }}
            onChange={(e) => {
              // Transform to uppercase for country codes
              const value = e.target.value.toUpperCase();
              field.onChange(value);
            }}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Forms.Elements.CountryCode.ElementCountryCode
 * @description PropTypes validation for the ElementCountryCode component
 */
ElementCountryCode.propTypes = {
  /**
   * The name of the form field
   * @type {string}
   */
  name: PropTypes.string,

  /**
   * Label text for the input field
   * @type {string}
   */
  label: PropTypes.string,

  /**
   * Placeholder text for the input field
   * @type {string}
   */
  placeholder: PropTypes.string,

  /**
   * Whether the field is required
   * @type {boolean}
   */
  required: PropTypes.bool,

  /**
   * Whether the field is disabled
   * @type {boolean}
   */
  disabled: PropTypes.bool,

  /**
   * Helper text to display below the input field
   * @type {string}
   */
  helperText: PropTypes.string,

  /**
   * Maximum length for country code input
   * @type {number}
   */
  maxLength: PropTypes.number,

  /**
   * Additional props to pass to input components
   * @type {Object}
   */
  slotProps: PropTypes.object,
};
