/**
 * @namespace CityArtWalks.Form.Element.PathType
 * @version 1.0.0.0
 * @author [Jaimie Garner]
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

'use client';

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetPathTypes } from 'src/actions/path/hooks';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Form.Element.PathType
 * @function ElementPathType
 * @description ElementPathType component renders a controlled TextField with a select dropdown for path types.
 * It fetches path types using the custom hook and handles loading and error states.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the form field.
 * @param {boolean} props.native - If true, the select element will be native.
 * @param {Object} props.slotProps - Additional props for customizing the select menu.
 * @param {string} props.helperText - Helper text to display below the TextField.
 * @param {Object} props.inputProps - Additional props for the input element.
 * @param {Object} props.InputLabelProps - Additional props for the InputLabel component.
 * @param {Object} props.other - Other props to pass to the TextField component.
 * @returns {JSX.Element} The rendered ElementPathType component.
 */
export function ElementPathType(props) {
  const { name, native, slotProps, helperText, inputProps, InputLabelProps, ...other } = props;

  const { control } = useFormContext();
  const { accessToken } = useAuthContext();
  const labelId = `${name}-select-label`;

  // Fetch path types using the custom hook
  const { pathTypes, pathTypesLoading, pathTypesError } = useGetPathTypes(accessToken);

  // Handle loading and error states
  if (pathTypesLoading) {
    return (
      <TextField
        fullWidth
        label="Path Type"
        disabled
        slotProps={{
          input: {
            endAdornment: <CircularProgress size={20} />,
          },
        }}
      />
    );
  }

  if (pathTypesError) {
    return (
      <TextField
        fullWidth
        label="Path Type"
        disabled
        helperText="Error loading path types."
        error
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <TextField
          {...field}
          select
          fullWidth
          label="Path Type"
          onChange={(e) => {
            field.onChange(e.target.value); // Properly update field value
          }}
          slotProps={{
            inputLabel: { htmlFor: labelId, ...InputLabelProps },
            input: { id: labelId, ...inputProps },
            select: {
              native,
              MenuProps: { PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } } },
              sx: { textTransform: 'capitalize' },
            },
          }}
          error={!!fieldError}
          helperText={fieldError ? fieldError.message : helperText}
          {...other}
        >
          {Array.isArray(pathTypes) &&
            pathTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}

ElementPathType.propTypes = {
  name: PropTypes.string.isRequired,
  native: PropTypes.bool,
  slotProps: PropTypes.object,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
};
