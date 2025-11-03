/**
 * @fileoverview Instagram URL element component for forms
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Forms.Elements
 *
 * @requires {@link module:react} - React library
 * @requires {@link module:react-hook-form} - Form management library
 * @requires {@link module:@mui/material} - Material-UI components
 * @requires {@link module:src/components/error/error-boundary} - Error boundary wrapper
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements
 * @function ElementInstagram
 * @description Instagram URL input component with validation for Instagram profile URLs.
 * Provides a text input field specifically designed for Instagram URLs with proper validation.
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="instagram"] - Form field name for the Instagram URL
 * @param {string} [props.label="Instagram"] - Display label for the field
 * @param {string} [props.placeholder="https://instagram.com/username"] - Placeholder text
 * @param {string} [props.helperText="Instagram profile URL"] - Helper text explaining the field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the TextField component
 *
 * @returns {JSX.Element} The rendered Instagram URL element component
 *
 * @example
 * // Basic usage with default props
 * <ElementInstagram />
 *
 * @example
 * // Custom field name and label
 * <ElementInstagram
 *   name="instagramUrl"
 *   label="Instagram Profile"
 *   helperText="Link to your Instagram account"
 * />
 *
 * @example
 * // Required field
 * <ElementInstagram
 *   required={true}
 *   helperText="Instagram URL is required for artist verification"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementInstagram(props) {
  const {
    name = 'instagram',
    label = 'Instagram',
    placeholder = 'https://instagram.com/username',
    helperText = 'Instagram profile URL',
    required = false,
    disabled = false,
    sx,
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
            type="url"
            error={!!error}
            helperText={error ? error.message : helperText}
            sx={sx}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

ElementInstagram.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
