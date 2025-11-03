/**
 * @fileoverview Generic art piece installation date element component for forms
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Forms.Elements
 *
 * @requires {@link module:react} - React library
 * @requires {@link module:react-hook-form} - Form management library
 * @requires {@link module:@mui/x-date-pickers} - Material-UI date picker components
 * @requires {@link module:src/components/error/error-boundary} - Error boundary wrapper
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements
 * @function ElementArtPieceInstallationDate
 * @description Generic installation date picker component for art pieces. Provides a date picker
 * for selecting when an art piece was installed with proper validation and consistent styling.
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="installation_date"] - Form field name for the installation date
 * @param {string} [props.label="Installation Date"] - Display label for the field
 * @param {string} [props.helperText="Date when the art piece was installed"] - Helper text explaining the field
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the DatePicker component
 *
 * @returns {JSX.Element} The rendered installation date element component
 *
 * @example
 * // Basic usage with default props
 * <ElementArtPieceInstallationDate />
 *
 * @example
 * // Custom field name and label
 * <ElementArtPieceInstallationDate
 *   name="dateInstalled"
 *   label="Date Installed"
 *   helperText="When was this art piece first installed?"
 * />
 *
 * @example
 * // Disabled field for display only
 * <ElementArtPieceInstallationDate
 *   disabled={true}
 *   helperText="Installation date is set automatically"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementArtPieceInstallationDate(props) {
  const {
    name = 'installation_date',
    label = 'Installation Date',
    helperText = '',
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
        render={({ field, fieldState: { error } }) => {
          // Validate and safely parse the date value
          let dateValue = null;
          if (field.value) {
            // First check if the value is a valid date string/object
            // This prevents RangeError: Invalid time value
            try {
              // Check if it's a valid date before passing to dayjs
              const testDate = new Date(field.value);
              if (!isNaN(testDate.getTime())) {
                const parsedDate = dayjs(field.value);
                dateValue = parsedDate.isValid() ? parsedDate : null;
              }
            } catch {
              // If any error occurs during date parsing, keep dateValue as null
              dateValue = null;
            }
          }

          return (
            <DatePicker
              {...field}
              value={dateValue}
              onChange={(newValue) => {
                // Validate before converting to ISO string
                if (newValue && dayjs.isDayjs(newValue) && newValue.isValid()) {
                  try {
                    const isoString = newValue.toISOString();
                    field.onChange(isoString);
                  } catch {
                    // If ISO conversion fails, set to null
                    field.onChange(null);
                  }
                } else {
                  field.onChange(null);
                }
              }}
              label={label}
              disabled={disabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error ? error.message : helperText,
                  sx,
                },
              }}
              {...other}
            />
          );
        }}
      />
    </ErrorBoundary>
  );
}

ElementArtPieceInstallationDate.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
