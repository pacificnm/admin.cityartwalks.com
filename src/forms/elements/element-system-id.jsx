/**
 * @fileoverview Generic system ID element component for forms
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
 * @function ElementSystemId
 * @description Generic system ID display component for forms. Shows the system-generated ID as a read-only
 * field with proper formatting and consistent styling across all forms. Works with any entity ID field.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Form field name for the system ID (e.g., 'imageId', 'artistId', 'userId')
 * @param {string} [props.label="System ID"] - Display label for the field
 * @param {string} [props.helperText="System-generated identifier"] - Helper text explaining the field
 * @param {boolean} [props.disabled=true] - Whether the field is disabled (default: true for read-only)
 * @param {Object} [props.sx] - Additional Material-UI sx styling props
 * @param {Object} props.other - Additional props passed to the TextField component
 *
 * @returns {JSX.Element} The rendered system ID element component
 *
 * @example
 * // Basic usage with image ID
 * <ElementSystemId name="imageId" />
 *
 * @example
 * // Custom label for artist ID
 * <ElementSystemId
 *   name="artistId"
 *   label="Artist ID"
 *   helperText="Unique artist identifier"
 * />
 *
 * @example
 * // With custom styling
 * <ElementSystemId
 *   name="userId"
 *   label="User ID"
 *   sx={{ bgcolor: 'action.hover' }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ElementSystemId({
  name,
  label = 'System ID',
  helperText = 'System-generated identifier',
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
            value={field.value || ''}
            slotProps={{
              input: {
                inputProps: {
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

export default ElementSystemId;
