/**
 * @fileoverview Generic updated date element component for forms
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

import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements
 * @function ElementUpdatedAt
 * @description Generic updated date display component for forms. Shows last update timestamp as a read-only
 * date-time picker with proper formatting and consistent styling across all forms.
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="updatedAt"] - Form field name for the updated date
 * @param {string} [props.label="Updated At"] - Display label for the field
 * @param {string} [props.helperText="System field - automatically updated when record is modified"] - Helper text explaining the field
 * @param {boolean} [props.disabled=true] - Whether the field is disabled (default: true for read-only)
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the DateTimePicker component
 *
 * @returns {JSX.Element} The rendered updated date element component
 *
 * @example
 * // Basic usage with default props
 * <ElementUpdatedAt />
 *
 * @example
 * // Custom field name and label
 * <ElementUpdatedAt
 *   name="recordUpdatedAt"
 *   label="Last Modified"
 *   helperText="When this record was last updated"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementUpdatedAt(props) {
  const {
    name = 'updatedAt',
    label = 'Updated At',
    helperText = 'System field - automatically updated when record is modified',
    disabled = true,
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
            <DateTimePicker
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
              readOnly={disabled}
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

ElementUpdatedAt.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
