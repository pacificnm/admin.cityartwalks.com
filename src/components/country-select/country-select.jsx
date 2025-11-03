/**
 * React Hook Form Database Country Select Field Component
 *
 * Database-integrated country selection field for react-hook-form with proper
 * validation and error handling. Fetches countries from the API and manages
 * countryId values for form submission.
 *
 * Features:
 * - Integration with Country API (database-driven)
 * - Proper countryId handling for form submission
 * - React Hook Form validation
 * - Loading and error states
 * - Accessibility support
 * - Search functionality
 * - Works both inside and outside form contexts
 * - Flag icon display for enhanced UX
 *
 * @namespace CityArtWalks.Components.CountrySelect
 * @fileoverview Database country select field component for react-hook-form
 * @author Jaimie Garner
 * @version 1.0.2
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components
 * @requires react-hook-form - Form state management
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Country}
 */

'use client';

import { useId, useMemo, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { filledInputClasses } from '@mui/material/FilledInput';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputAdornment, { inputAdornmentClasses } from '@mui/material/InputAdornment';

import { useGetPaginatedCountries } from 'src/actions/country/hooks';

import { FlagIcon } from 'src/components/flag-icon';

/**
 * Gets country data by various identifiers (ID, name, code)
 * @memberof CityArtWalks.Components.CountrySelect
 * @param {*} inputValue - Country identifier (ID, name, or code)
 * @param {Array} countries - Array of country objects from API
 * @returns {Object} Country object with fallback structure
 */
const getDatabaseCountry = (inputValue, countries = []) => {
  if (!inputValue || !countries.length) {
    return { countryId: null, name: '', code: '', phone: '' };
  }

  const country = countries.find(
    (c) =>
      c.countryId === inputValue ||
      c.id === inputValue ||
      c.name === inputValue ||
      c.code === inputValue ||
      c.phone === inputValue
  );

  return country || { countryId: null, name: '', code: '', phone: '' };
};

/**
 * Database Country Select Field component for react-hook-form and standalone use
 * Integrates with Country API for database-driven country selection with flag icons.
 *
 * @memberof CityArtWalks.Components.CountrySelect
 * @param {Object} props - Component props
 * @param {string} [props.name] - Field name for form integration (required when using with react-hook-form)
 * @param {string} props.label - Field label
 * @param {boolean} [props.required=false] - Whether field is required
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.helperText] - Helper text
 * @param {boolean} [props.multiple=false] - Allow multiple selection
 * @param {string} [props.variant] - TextField variant
 * @param {boolean} [props.hiddenLabel] - Hide label
 * @param {*} [props.value] - Current value (for standalone use)
 * @param {Function} [props.onChange] - Change handler (for standalone use)
 * @param {Object} [props.sx] - Additional styling
 * @returns {JSX.Element} The database country select field component
 *
 * @example
 * // For react-hook-form usage
 * <CountrySelect
 *   name="countryId"
 *   label="Country"
 *   required
 *   placeholder="Choose a country"
 * />
 *
 * // For standalone usage
 * <CountrySelect
 *   label="Country"
 *   value={selectedCountryId}
 *   onChange={(event) => setSelectedCountryId(event.target.value)}
 *   placeholder="Choose a country"
 * />
 */
export function CountrySelect({
  name,
  label,
  required = false,
  placeholder,
  helperText,
  multiple = false,
  variant,
  hiddenLabel,
  value,
  onChange,
  sx,
  ...other
}) {
  const uniqueId = useId();

  // Try to get form context, but don't fail if it doesn't exist
  let control;
  try {
    const formContext = useFormContext();
    control = formContext?.control;
  } catch {
    // Form context doesn't exist, use standalone mode
    control = null;
  }

  // Use paginated hook with high limit to get all active countries
  const {
    countries: countriesData,
    countriesLoading,
    countriesError,
  } = useGetPaginatedCountries(
    { active: true }, // Filter for active countries only
    1, // page
    9999, // rowsPerPage - high limit to get all countries
    '', // token - will be handled by the hook
    600 // revalidate
  );

  // Extract countries array from the paginated response
  const countries = useMemo(() => countriesData || [], [countriesData]);

  // Transform database countries into options array
  const options = useMemo(() => {
    if (!countries || !Array.isArray(countries)) return [];
    return countries;
  }, [countries]);

  // Get option label (always return string)
  const getOptionLabel = useCallback((option) => {
    if (!option) return '';
    if (typeof option === 'string') return option;
    if (typeof option === 'number') return String(option);
    if (typeof option === 'object') {
      return option.name || `Country ${option.countryId || option.id}`;
    }
    return String(option);
  }, []);

  // Render option with flag and country details
  const renderOption = useCallback((props, option) => {
    const { key, ...otherProps } = props;

    return (
      <li key={key} {...otherProps}>
        <FlagIcon
          code={option.code}
          sx={{
            mr: 1,
            width: 22,
            height: 22,
            borderRadius: '50%',
          }}
        />
        {option.name} {option.code && `(${option.code})`} {option.phone && `+${option.phone}`}
      </li>
    );
  }, []);

  // Render input field with flag adornment
  const renderInput = useCallback(
    (params, field, error, currentValue) => {
      const selectedCountry = getDatabaseCountry(currentValue, countries);

      const textFieldStyles = {
        [`& .${inputAdornmentClasses.root}`]: {
          ml: 0.5,
          mr: 1,
        },
        [`& .${outlinedInputClasses.root}, .${filledInputClasses.root}`]: {
          [`& .${autocompleteClasses.input}`]: {
            pl: 0,
          },
        },
        [`& .${filledInputClasses.root}`]: {
          [`& .${inputAdornmentClasses.root}`]: {
            transform: hiddenLabel ? 'unset' : 'translateY(-8px)',
          },
        },
      };

      const hasAdornment = !multiple && !!selectedCountry.code;
      const hasError = !!(error || countriesError);

      // Build TextField props conditionally
      const textFieldProps = {
        ...params,
        label,
        variant,
        placeholder,
        helperText: error?.message || (countriesError ? 'Error loading countries' : helperText),
        hiddenLabel,
        required,
        slotProps: {
          htmlInput: {
            ...params.inputProps,
            autoComplete: 'new-password',
          },
          input: {
            ...params.InputProps,
            ...(hasAdornment && {
              startAdornment: (
                <InputAdornment position="start">
                  <FlagIcon
                    code={selectedCountry.code}
                    sx={{ width: 22, height: 22, borderRadius: '50%' }}
                  />
                </InputAdornment>
              ),
            }),
            endAdornment: (
              <>
                {countriesLoading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          },
        },
        sx: [!multiple && textFieldStyles, sx],
      };

      // Only add error prop when there's actually an error
      if (hasError) {
        textFieldProps.error = true;
      }

      return <TextField {...textFieldProps} />;
    },
    [
      countries,
      countriesError,
      countriesLoading,
      helperText,
      hiddenLabel,
      label,
      multiple,
      placeholder,
      required,
      sx,
      variant,
    ]
  );

  // Render value chips for multiple selection
  const renderValue = useCallback(
    (selected, getItemProps) =>
      selected.map((option, index) => {
        const country = getDatabaseCountry(option, countries);

        return (
          <Chip
            {...getItemProps({ index })}
            key={country.countryId || country.name}
            label={country.name}
            size="small"
            variant="soft"
            icon={
              <FlagIcon code={country.code} sx={{ width: 16, height: 16, borderRadius: '50%' }} />
            }
          />
        );
      }),
    [countries]
  );

  // Standalone component (not in form context)
  const renderStandalone = () => (
    <Autocomplete
      id={`${uniqueId}-country-select`}
      options={options}
      loading={countriesLoading}
      multiple={multiple}
      autoHighlight={!multiple}
      disableCloseOnSelect={multiple}
      disabled={countriesLoading || !!countriesError}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={(params) => renderInput(params, null, null, value)}
      renderValue={multiple ? renderValue : undefined}
      isOptionEqualToValue={(option, currentValue) => {
        if (!option || !currentValue) return option === currentValue;

        // For numeric countryId values
        if (typeof currentValue === 'number') {
          return (option.countryId || option.id) === currentValue;
        }

        // For object comparison
        if (typeof currentValue === 'object') {
          return (option.countryId || option.id) === (currentValue.countryId || currentValue.id);
        }

        // Default comparison
        return option === currentValue;
      }}
      onChange={(event, newValue) => {
        if (onChange) {
          if (multiple) {
            // For multiple selection, store array of countryIds
            const countryIds = (newValue || [])
              .map((country) => country.countryId || country.id)
              .filter(Boolean);
            const syntheticEvent = {
              target: {
                name: name || '',
                value: countryIds,
              },
            };
            onChange(syntheticEvent);
          } else {
            // For single selection, store countryId
            const syntheticEvent = {
              target: {
                name: name || '',
                value:
                  newValue && typeof newValue === 'object'
                    ? newValue.countryId || newValue.id
                    : newValue,
              },
            };
            onChange(syntheticEvent);
          }
        }
      }}
      value={
        // Find the selected option object from the countryId value
        value
          ? multiple
            ? Array.isArray(value)
              ? value
                  .map((id) =>
                    countries?.find((country) => (country.countryId || country.id) === id)
                  )
                  .filter(Boolean)
              : []
            : countries?.find((country) => (country.countryId || country.id) === value) || null
          : multiple
            ? []
            : null
      }
      sx={sx}
      {...other}
    />
  );

  // Form-controlled component
  const renderFormControlled = () => (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? `${label} is required` : false,
      }}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          id={`${uniqueId}-country-select`}
          options={options}
          loading={countriesLoading}
          multiple={multiple}
          autoHighlight={!multiple}
          disableCloseOnSelect={multiple}
          disabled={countriesLoading || !!countriesError}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={(params) => renderInput(params, field, error, field.value)}
          renderValue={multiple ? renderValue : undefined}
          isOptionEqualToValue={(option, currentValue) => {
            if (!option || !currentValue) return option === currentValue;

            // For numeric countryId values
            if (typeof currentValue === 'number') {
              return (option.countryId || option.id) === currentValue;
            }

            // For object comparison
            if (typeof currentValue === 'object') {
              return (
                (option.countryId || option.id) === (currentValue.countryId || currentValue.id)
              );
            }

            // Default comparison
            return option === currentValue;
          }}
          onChange={(event, newValue) => {
            if (multiple) {
              // For multiple selection, store array of countryIds
              const countryIds = (newValue || [])
                .map((country) => country.countryId || country.id)
                .filter(Boolean);
              field.onChange(countryIds);
            } else {
              // For single selection, store countryId
              if (newValue && typeof newValue === 'object') {
                field.onChange(newValue.countryId || newValue.id);
              } else {
                field.onChange(newValue);
              }
            }
          }}
          value={
            // Find the selected option object from the countryId value
            field.value
              ? multiple
                ? Array.isArray(field.value)
                  ? field.value
                      .map((id) =>
                        countries?.find((country) => (country.countryId || country.id) === id)
                      )
                      .filter(Boolean)
                  : []
                : countries?.find((country) => (country.countryId || country.id) === field.value) ||
                  null
              : multiple
                ? []
                : null
          }
          sx={sx}
          {...other}
        />
      )}
    />
  );

  // Return appropriate component based on context
  if (control && name) {
    return renderFormControlled();
  } else {
    return renderStandalone();
  }
}
