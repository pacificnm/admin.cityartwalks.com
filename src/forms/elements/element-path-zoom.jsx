/**
 * @namespace CityArtWalks.Form.Element.PathZoom
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

import { useGetPathZoomLevels } from 'src/actions/path/hooks';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Form.Element.PathZoom
 * @function ElementPathZoom
 * @description Renders a controlled TextField component for selecting a zoom level.
 * Fetches zoom options from the custom hook and displays them in a dropdown menu.
 * Handles loading and error states during data fetching.
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.name - The name of the form field.
 * @param {boolean} [props.native] - If true, the select element will be native.
 * @param {Object} [props.slotProps] - Additional props for customizing the select menu.
 * @param {string} [props.helperText] - Helper text to display below the input.
 * @param {Object} [props.inputProps] - Additional props for the input element.
 * @param {Object} [props.InputLabelProps] - Additional props for the input label.
 * @param {Object} [props.other] - Other props to pass to the TextField component.
 * @returns {JSX.Element} The rendered component.
 */
export function ElementPathZoom(props) {
  const { name, native, slotProps, helperText, inputProps, InputLabelProps, ...other } = props;

  const { control } = useFormContext();
  const { accessToken } = useAuthContext();
  const labelId = `${name}-select-label`;

  // Fetch path zoom levels using the custom hook
  const { pathZoomLevels, pathZoomLevelsLoading, pathZoomLevelsError } =
    useGetPathZoomLevels(accessToken);

  // Handle loading and error states
  if (pathZoomLevelsLoading) {
    return (
      <TextField
        fullWidth
        label="Zoom"
        disabled
        slotProps={{
          input: {
            endAdornment: <CircularProgress size={20} />,
          },
        }}
      />
    );
  }

  if (pathZoomLevelsError) {
    return (
      <TextField
        fullWidth
        label="Zoom"
        disabled
        helperText="Error loading path zoom levels."
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
          label="Zoom"
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
          {Array.isArray(pathZoomLevels) &&
            pathZoomLevels.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                {level.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}

ElementPathZoom.propTypes = {
  name: PropTypes.string.isRequired,
  native: PropTypes.bool,
  slotProps: PropTypes.object,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
};
