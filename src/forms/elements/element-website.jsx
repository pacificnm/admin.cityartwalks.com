/**
 * @fileoverview Website URL element component for forms
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
 * @function ElementWebsite
 * @description Website URL input component with validation for website URLs.
 * Provides a text input field specifically designed for website URLs with proper validation.
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="website"] - Form field name for the website URL
 * @param {string} [props.label="Website"] - Display label for the field
 * @param {string} [props.placeholder="https://www.example.com"] - Placeholder text
 * @param {string} [props.helperText="Personal or business website URL"] - Helper text explaining the field
 * @param {boolean} [props.required=false] - Whether the field is required
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the TextField component
 *
 * @returns {JSX.Element} The rendered website URL element component
 *
 * @example
 * // Basic usage with default props
 * <ElementWebsite />
 *
 * @example
 * // Custom field name and label
 * <ElementWebsite
 *   name="portfolioUrl"
 *   label="Portfolio Website"
 *   helperText="Link to your online portfolio"
 * />
 *
 * @example
 * // Required field
 * <ElementWebsite
 *   required={true}
 *   helperText="Website URL is required for artist profile"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementWebsite(props) {
  const {
    name = 'website',
    label = 'Website',
    placeholder = 'https://www.example.com',
    helperText = 'Personal or business website URL',
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

ElementWebsite.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
