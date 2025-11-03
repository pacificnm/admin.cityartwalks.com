/**
 * @namespace CityArtWalks.Forms.Elements.Active
 * @version 1.0.0
 * @author GitHub Copilot
 * @fileoverview Generic form element for active/inactive switch with validation
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements.Active
 * @function ElementActive
 * @description Generic form element component for active/inactive switches with proper validation.
 *
 * This component provides a switch input field specifically designed for active/inactive states,
 * with integrated form validation and error handling through React Hook Form.
 * It can be used for any entity that has an active/inactive state (materials, users, locations, etc.).
 *
 * Features:
 * - Switch input with proper validation
 * - React Hook Form integration
 * - Error state handling
 * - Consistent styling with other form elements
 * - Accessible form controls
 * - Configurable for different active state types
 * - Default active state configuration
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="active"] - The name of the form field
 * @param {string} [props.label="Active"] - Label text for the switch
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {string} [props.helperText] - Helper text to display below the switch
 * @param {Object} [props.slotProps] - Additional props to pass to input components
 * @param {Object} [props.FormControlProps] - Props to pass to the FormControl component
 * @param {Object} [props.FormControlLabelProps] - Props to pass to the FormControlLabel component
 * @param {Object} [props.SwitchProps] - Props to pass to the Switch component
 * @param {Object} [...props.other] - Other props to pass to the FormControl component
 *
 * @returns {JSX.Element} The rendered active switch element
 *
 * @example
 * // Basic usage within a form
 * <ElementActive />
 *
 * @example
 * // For material active state
 * <ElementActive
 *   name="active"
 *   label="Active"
 *   helperText="Whether this material is actively used in the system"
 * />
 *
 * @example
 * // For user active state
 * <ElementActive
 *   name="isActive"
 *   label="Account Active"
 *   helperText="Whether this user account is active and can log in"
 * />
 *
 * @example
 * // For location visibility
 * <ElementActive
 *   name="visible"
 *   label="Visible"
 *   helperText="Whether this location is visible to public users"
 * />
 *
 * @example
 * // For feature flags
 * <ElementActive
 *   name="enabled"
 *   label="Feature Enabled"
 *   helperText="Whether this feature is enabled for users"
 * />
 *
 * @example
 * // Disabled field (for display only)
 * <ElementActive
 *   disabled
 *   helperText="System-controlled active state"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */
export function ElementActive(props) {
  const {
    name = 'active',
    label = 'Active',
    disabled = false,
    helperText,
    slotProps,
    FormControlProps,
    FormControlLabelProps,
    SwitchProps,
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
                <Switch
                  {...field}
                  checked={Boolean(value)}
                  onChange={(event) => onChange(event.target.checked)}
                  disabled={disabled}
                  {...slotProps?.switch}
                  {...SwitchProps}
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

ElementActive.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  slotProps: PropTypes.shape({
    switch: PropTypes.object,
    formControlLabel: PropTypes.object,
  }),
  FormControlProps: PropTypes.object,
  FormControlLabelProps: PropTypes.object,
  SwitchProps: PropTypes.object,
};
