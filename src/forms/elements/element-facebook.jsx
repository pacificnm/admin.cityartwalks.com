/**
 * @fileoverview Facebook URL element component for forms
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
 * @function ElementFacebook
 * @description Facebook URL input component with validation for Facebook profile/page URLs.
 * Provides a text input field specifically designed for Facebook URLs with proper validation.
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="facebook"] - Form field name for the Facebook URL
 * @param {string} [props.label="Facebook"] - Display label for the field
 * @param {string} [props.placeholder="https://facebook.com/username"] - Placeholder text
 * @param {string} [props.helperText="Facebook profile or page URL"] - Helper text explaining the field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the TextField component
 *
 * @returns {JSX.Element} The rendered Facebook URL element component
 *
 * @example
 * // Basic usage with default props
 * <ElementFacebook />
 *
 * @example
 * // Custom field name and label
 * <ElementFacebook
 *   name="facebookUrl"
 *   label="Facebook Page"
 *   helperText="Link to your Facebook business page"
 * />
 *
 * @example
 * // Required field
 * <ElementFacebook
 *   required={true}
 *   helperText="Facebook URL is required for verification"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementFacebook(props) {
  const {
    name = 'facebook',
    label = 'Facebook',
    placeholder = 'https://facebook.com/username',
    helperText = 'Facebook profile or page URL',
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

ElementFacebook.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
