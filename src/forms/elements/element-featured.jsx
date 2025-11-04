/**
 * @namespace CityArtWalks.Forms.Elements.Featured
 * @version 1.0.0
 * @author Jaimie Garner
 * @fileoverview Generic form element for featured checkbox with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.Featured
 * @function ElementFeatured
 * @description Generic form element component for featured checkboxes with proper validation.
 *
 * This component provides a checkbox input field specifically designed for featured states,
 * with integrated form validation and error handling through React Hook Form.
 * It can be used for any entity that has a featured state (images, artists, art pieces, etc.).
 *
 * Features:
 * - Checkbox input with proper validation
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Configurable for different featured types
 * - Default featured state configuration
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="featured"] - The name of the form field
 * @param {string} [props.label="Featured"] - Label text for the checkbox
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {string} [props.helperText] - Helper text to display below the checkbox
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [props.FormControlProps] - Props to pass to the FormControl component
 * @param {Object} [props.FormControlLabelProps] - Props to pass to the FormControlLabel component
 * @param {Object} [props.CheckboxProps] - Props to pass to the Checkbox component
 * @param {Object} [...props.other] - Other props to pass to the FormControl component
 *
 * @returns {JSX.Element} The rendered featured checkbox element
 *
 * @example
 * // Basic usage within a form
 * <ElementFeatured />
 *
 * @example
 * // For image featured state
 * <ElementFeatured
 *   name="featured"
 *   label="Featured"
 *   helperText="Whether this image is featured on the homepage"
 * />
 *
 * @example
 * // For artist featured state
 * <ElementFeatured
 *   name="isFeatured"
 *   label="Featured Artist"
 *   helperText="Whether this artist is featured in the gallery"
 * />
 *
 * @example
 * // For art piece featured state
 * <ElementFeatured
 *   name="featured"
 *   label="Featured Piece"
 *   helperText="Whether this art piece is featured in the collection"
 * />
 *
 * @example
 * // Disabled field (for display only)
 * <ElementFeatured
 *   disabled
 *   helperText="System-controlled featured state"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */
export function ElementFeatured(props) {
  const {
    name = 'featured',
    label = 'Featured',
    disabled = false,
    helperText,
    slotProps,
    FormControlProps,
    FormControlLabelProps,
    CheckboxProps,
    ...other
  } = props;

  const { control } = useFormContext();

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
          <FormControl error={!!error} disabled={disabled} {...FormControlProps} {...other}>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={Boolean(value)}
                  onChange={(event) => onChange(event.target.checked)}
                  disabled={disabled}
                  {...slotProps?.checkbox}
                  {...CheckboxProps}
                />
              }
              label={label}
              disabled={disabled}
              {...slotProps?.formControlLabel}
              {...FormControlLabelProps}
            />
            {(error || helperText) && (
              <FormHelperText>{error ? error.message : helperText}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </ErrorBoundary>
  );
}

ElementFeatured.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  slotProps: PropTypes.shape({
    checkbox: PropTypes.object,
    formControlLabel: PropTypes.object,
  }),
  FormControlProps: PropTypes.object,
  FormControlLabelProps: PropTypes.object,
  CheckboxProps: PropTypes.object,
};
