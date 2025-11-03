/**
 * @namespace CityArtWalks.Form.Element.City
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

import { useGetPaginatedCities } from 'src/actions/city/hooks';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Form.Element.City
 * @description ElementCity component renders a city selection dropdown based on the selected state.
 * It uses react-hook-form's Controller for form state management and the useGetPaginatedCities
 * hook for data fetching.
 *
 * The component fetches cities filtered by the selected state ID and provides a dropdown
 * interface for city selection within forms.
 *
 * Key Features:
 * - Fetches cities using proper hooks architecture
 * - Filters cities by selected state
 * - Integrates with React Hook Form
 * - Handles loading and error states
 * - Provides accessible form controls
 *
 * @component
 * @example
 * // Used within a React Hook Form with state selection
 * <ElementCity
 *   name="cityId"
 *   selectedState={selectedStateId}
 *   onCityChange={handleCityChange}
 * />
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.selectedState - The selected state to fetch cities for.
 * @param {function} props.onCityChange - Callback function to handle city change.
 * @param {string} props.name - The name of the form field.
 * @param {boolean} [props.native] - If true, renders a native select element.
 * @param {boolean} [props.returnNumeric=false] - If true, returns numeric values; if false, returns string values.
 * @param {Object} [props.slotProps] - Additional props for the select element, inputLabel, and input.
 * @param {string} [props.helperText] - Helper text to display below the input.
 * @param {Object} [props.inputProps] - Deprecated. Use slotProps.input instead.
 * @param {Object} [props.InputLabelProps] - Deprecated. Use slotProps.inputLabel instead.
 * @param {Object} [props.other] - Other props to pass to the TextField component.
 * @returns {JSX.Element} The rendered city selection dropdown.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 */
export function ElementCity(props) {
  const {
    name,
    selectedState, // internal, not passed to <TextField />
    stateId, // also accept stateId as an alias for selectedState
    onCityChange, // internal, not passed to <TextField />
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

  // Use either selectedState or stateId prop
  const effectiveStateId = selectedState || stateId;

  // Get cities using the proper hook, filtered by state
  // Only make API call if selectedState is provided and not null
  const shouldFetchCities =
    effectiveStateId != null && effectiveStateId !== '' && effectiveStateId !== 0;

  // Create a custom hook call that conditionally fetches
  const citiesFetchResult = useGetPaginatedCities(
    shouldFetchCities ? { stateId: effectiveStateId } : {}, // Pass stateId only when valid
    1,
    1000, // Get many cities for dropdown
    accessToken // Pass authentication token
  );

  // Extract results, but only use them if we should fetch cities
  const { cities, citiesLoading, citiesError } = shouldFetchCities
    ? citiesFetchResult
    : { cities: [], citiesLoading: false, citiesError: null };

  // Handle loading and error states
  if (citiesLoading) {
    return (
      <TextField
        fullWidth
        label="City"
        disabled
        slotProps={{
          input: {
            endAdornment: <CircularProgress size={20} />,
          },
        }}
      />
    );
  }

  if (citiesError) {
    return <TextField fullWidth label="City" disabled helperText="Error loading cities." error />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => {
        // Ensure the current value exists in available options
        const currentValue = field.value;
        // Accept empty string as a valid value (for "Select City" option)
        const hasValidOption =
          currentValue === '' ||
          (currentValue &&
            Array.isArray(cities) &&
            cities.some((city) => city.cityId === currentValue));

        // If current value is not in options, use empty string to show placeholder
        const safeValue = hasValidOption ? currentValue : '';

        return (
          <TextField
            {...field}
            value={safeValue}
            select
            fullWidth
            label="City"
            onChange={(e) => {
              const value = e.target.value;
              // Convert value based on returnNumeric prop
              const processedValue = returnNumeric
                ? value === ''
                  ? null
                  : parseInt(value, 10)
                : value; // Keep as string for query parameters
              field.onChange(processedValue);
              if (onCityChange) {
                onCityChange(e); // Call external handler
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
            helperText={fieldError ? fieldError?.message : helperText}
            {...other}
          >
            <MenuItem value="">
              <em>Select City</em>
            </MenuItem>
            {Array.isArray(cities) &&
              cities.map((city) => (
                <MenuItem key={city.cityId} value={city.cityId}>
                  {city.name}
                </MenuItem>
              ))}
          </TextField>
        );
      }}
    />
  );
}

ElementCity.propTypes = {
  selectedState: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCityChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  native: PropTypes.bool,
  returnNumeric: PropTypes.bool,
  slotProps: PropTypes.object,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
};
