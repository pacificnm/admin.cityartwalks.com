/**
 * @fileoverview Generic death date element component for forms
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
 * @function ElementDeathDate
 * @description Generic death date picker component for artists. Provides a date picker
 * for selecting death dates with proper validation and consistent styling.
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="death_date"] - Form field name for the death date
 * @param {string} [props.label="Death Date"] - Display label for the field
 * @param {string} [props.helperText="Date of death (if applicable)"] - Helper text explaining the field
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the DatePicker component
 *
 * @returns {JSX.Element} The rendered death date element component
 *
 * @example
 * // Basic usage with default props
 * <ElementDeathDate />
 *
 * @example
 * // Custom field name and label
 * <ElementDeathDate
 *   name="dateOfDeath"
 *   label="Date of Death"
 *   helperText="When did this person pass away?"
 * />
 *
 * @example
 * // Disabled field for display only
 * <ElementDeathDate
 *   disabled={true}
 *   helperText="Death date cannot be modified"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementDeathDate(props) {
  const {
    name = 'death_date',
    label = 'Death Date',
    helperText = 'Date of death (if applicable)',
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
                // Validate before converting to Date object
                if (newValue && dayjs.isDayjs(newValue) && newValue.isValid()) {
                  try {
                    const dateObject = newValue.toDate();
                    field.onChange(dateObject);
                  } catch {
                    // If conversion fails, set to null
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

ElementDeathDate.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
