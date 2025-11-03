/**
 * @fileoverview Generic view count element component for forms
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

import { Controller, useFormContext } from 'react-hook-form';

import { TextField } from '@mui/material';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Elements
 * @function ElementViewCount
 * @description Generic view count display component for forms. Shows view count as a read-only
 * numeric field with proper formatting and consistent styling across all forms.
 *
 * @param {Object} props - Component props
 * @param {string} [props.name="viewCount"] - Form field name for the view count
 * @param {string} [props.label="View Count"] - Display label for the field
 * @param {string} [props.helperText="Number of times this item has been viewed"] - Helper text explaining the field
 * @param {boolean} [props.disabled=true] - Whether the field is disabled (default: true for read-only)
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the TextField component
 *
 * @returns {JSX.Element} The rendered view count element component
 *
 * @example
 * // Basic usage with default props
 * <ElementViewCount />
 *
 * @example
 * // Custom field name and label
 * <ElementViewCount
 *   name="articleViewCount"
 *   label="Article Views"
 *   helperText="Total article page views"
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementViewCount({
  name = 'viewCount',
  label = 'View Count',
  helperText = 'Number of times this item has been viewed',
  disabled = true,
  sx,
  ...other
}) {
  const { control } = useFormContext();

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
            type="number"
            disabled={disabled}
            error={!!error}
            helperText={error ? error.message : helperText}
            value={field.value || 0}
            slotProps={{
              input: {
                inputProps: {
                  min: 0,
                  step: 1,
                  readOnly: disabled,
                },
              },
            }}
            sx={sx}
            {...other}
          />
        )}
      />
    </ErrorBoundary>
  );
}

export default ElementViewCount;
