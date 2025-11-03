/**
 * @namespace CityArtWalks.Form.Element.Country
 * @version 1.0.0.0
 * @author [Jaimie Garner]
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetPaginatedCountries } from 'src/actions/country/hooks';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Form.Element.Country
 * @description ElementCountry component renders a country selection dropdown using Material-UI's TextField
 * and the useGetPaginatedCountries hook for data fetching.
 *
 * The component provides a dropdown interface for country selection within forms,
 * with proper loading states, error handling, and React Hook Form integration.
 *
 * Key Features:
 * - Fetches countries using proper hooks architecture
 * - Integrates with React Hook Form
 * - Handles loading and error states
 * - Provides accessible form controls
 * - Supports callback for country change events
 *
 * @component
 * @example
 * // Used within a React Hook Form
 * <ElementCountry
 *   name="countryId"
 *   onCountryChange={handleCountryChange}
 * />
 *
 * @param {Object} props - The props for the component.
 * @param {function} props.onCountryChange - Callback function to handle country change.
 * @param {string} props.name - The name of the form field.
 * @param {boolean} [props.native] - If true, renders a native select element.
 * @param {boolean} [props.returnNumeric=false] - If true, returns numeric values; if false, returns string values.
 * @param {Object} [props.slotProps] - Additional props for customizing the select menu, inputLabel, and input.
 * @param {string} [props.helperText] - Helper text to display below the input.
 * @param {Object} [props.inputProps] - Deprecated. Use slotProps.input instead.
 * @param {Object} [props.InputLabelProps] - Deprecated. Use slotProps.inputLabel instead.
 * @param {Object} [props.other] - Other props to pass to the TextField component.
 * @returns {JSX.Element} The rendered ElementCountry component.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 */
export function ElementCountry(props) {
  const {
    onCountryChange, // prevent from leaking to DOM
    name,
    native,
    returnNumeric = false,
    slotProps,
    helperText,
    inputProps,
    InputLabelProps,
    ...other
  } = props;
  const { control } = useFormContext();
  const { accessToken } = useAuthContext();
  const labelId = `${name}-select-label`;

  // Get countries using the proper hook
  const { countries, countriesLoading, countriesError } = useGetPaginatedCountries(
    {},
    1,
    1000,
    accessToken
  ); // Get many countries for dropdown

  // Handle loading and error states
  if (countriesLoading) {
    return (
      <TextField
        fullWidth
        label="Country"
        disabled
        slotProps={{
          input: {
            endAdornment: <CircularProgress size={20} />,
          },
        }}
      />
    );
  }

  if (countriesError) {
    return (
      <TextField fullWidth label="Country" disabled helperText="Error loading countries." error />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => {
        // Ensure the current value exists in available options
        const currentValue = field.value;
        // Accept empty string as a valid value (for "Select Country" option)
        const hasValidOption =
          currentValue === '' ||
          (currentValue &&
            Array.isArray(countries) &&
            countries.some((country) => country.countryId === currentValue));

        // If current value is not in options, use empty string to show placeholder
        const safeValue = hasValidOption ? currentValue : '';

        return (
          <TextField
            {...field}
            value={safeValue}
            select
            fullWidth
            label="Country"
            onChange={(e) => {
              const value = e.target.value;
              // Convert value based on returnNumeric prop
              const processedValue = returnNumeric
                ? value === ''
                  ? null
                  : parseInt(value, 10)
                : value; // Keep as string for query parameters
              field.onChange(processedValue);
              if (onCountryChange) {
                onCountryChange(e); // Call external handler
              }
            }}
            slotProps={{
              ...slotProps,
              inputLabel: { htmlFor: labelId, ...InputLabelProps, ...slotProps?.inputLabel },
              input: { id: labelId, ...inputProps, ...slotProps?.input },
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
            <MenuItem value="">
              <em>Select Country</em>
            </MenuItem>
            {Array.isArray(countries) &&
              countries.map((country) => (
                <MenuItem key={country.countryId} value={country.countryId}>
                  {country.name}
                </MenuItem>
              ))}
          </TextField>
        );
      }}
    />
  );
}
ElementCountry.propTypes = {
  onCountryChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  native: PropTypes.bool,
  returnNumeric: PropTypes.bool,
  slotProps: PropTypes.object,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
};
