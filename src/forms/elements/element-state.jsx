/**
 * @namespace CityArtWalks.Form.Element.State
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

import { useGetPaginatedStates } from 'src/actions/state/hooks';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Form.Element.State
 * @description ElementState component renders a controlled TextField with a list of states
 * based on the selected country. It handles loading and error states and
 * integrates with react-hook-form for form control.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.selectedCountry - The selected country to fetch states for.
 * @param {function} props.onStateChange - Callback function to handle state change.
 * @param {string} props.name - The name of the form field.
 * @param {boolean} props.native - If true, renders native select element.
 * @param {boolean} [props.returnNumeric=false] - If true, returns numeric values; if false, returns string values.
 * @param {Object} props.slotProps - Additional props for customizing the select menu.
 * @param {string} props.helperText - Helper text to display below the TextField.
 * @param {Object} props.inputProps - Additional props for the input element.
 * @param {Object} props.InputLabelProps - Additional props for the InputLabel element.
 * @param {Object} props.other - Other props to pass to the TextField component.
 * @returns {JSX.Element} The rendered ElementState component.
 */
export function ElementState(props) {
  const {
    selectedCountry, // internal
    countryId, // also accept countryId as an alias for selectedCountry
    onStateChange, // internal
    name,
    native,
    returnNumeric = false,
    slotProps,
    helperText,
    inputProps,
    InputLabelProps,
    ...other // safe props to forward
  } = props;

  const { control } = useFormContext();
  const labelId = `${name}-select-label`;

  // Use either selectedCountry or countryId prop
  const effectiveCountryId = selectedCountry || countryId;

  // Fetch states using the custom hook, filtered by selected country
  // Only make API call if selectedCountry is provided and not null
  const shouldFetchStates =
    effectiveCountryId != null && effectiveCountryId !== '' && effectiveCountryId !== 0;

  // Create a custom hook call that conditionally fetches
  const statesFetchResult = useGetPaginatedStates(
    shouldFetchStates ? { countryId: effectiveCountryId } : {}, // Pass countryId only when valid
    1, // page
    100, // rowsPerPage - get all states for the country
    '', // Use empty token for public endpoint
    600 // revalidate seconds
  );

  // Extract results, but only use them if we should fetch states
  const { states, statesLoading, statesError } = shouldFetchStates
    ? statesFetchResult
    : { states: [], statesLoading: false, statesError: null };

  // Handle loading and error states
  if (statesLoading) {
    return (
      <TextField
        fullWidth
        label="State"
        disabled
        slotProps={{
          input: {
            endAdornment: <CircularProgress size={20} />,
          },
        }}
      />
    );
  }

  if (statesError) {
    return <TextField fullWidth label="State" disabled helperText="Error loading states." error />;
  }

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => {
          // Ensure the current value exists in available options
          const currentValue = field.value;
          // Accept empty string as a valid value (for "Select State" option)
          const hasValidOption =
            currentValue === '' ||
            (currentValue &&
              Array.isArray(states) &&
              states.some((state) => state.stateId === currentValue));

          // If current value is not in options, use empty string to avoid MUI warning
          const safeValue = hasValidOption ? currentValue : '';

          return (
            <TextField
              {...field}
              value={safeValue}
              select
              fullWidth
              label="State"
              slotProps={{
                input: { id: labelId, ...inputProps },
                inputLabel: { htmlFor: labelId, ...InputLabelProps },
                select: {
                  native,
                  MenuProps: { PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } } },
                  sx: { textTransform: 'capitalize' },
                },
              }}
              onChange={(e) => {
                const value = e.target.value;
                // Convert value based on returnNumeric prop
                const processedValue = returnNumeric
                  ? value === ''
                    ? null
                    : parseInt(value, 10)
                  : value; // Keep as string for query parameters
                field.onChange(processedValue);
                if (onStateChange) {
                  onStateChange(e); // Call external handler
                }
              }}
              error={!!fieldError}
              helperText={fieldError ? fieldError?.message : helperText}
              {...other}
            >
              <MenuItem value="">
                <em>Select State</em>
              </MenuItem>
              {Array.isArray(states) &&
                states.map((state) => (
                  <MenuItem key={state.stateId} value={state.stateId}>
                    {state.name}
                  </MenuItem>
                ))}
            </TextField>
          );
        }}
      />
    </ErrorBoundary>
  );
}

ElementState.propTypes = {
  selectedCountry: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onStateChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  native: PropTypes.bool,
  returnNumeric: PropTypes.bool,
  slotProps: PropTypes.object,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
};
