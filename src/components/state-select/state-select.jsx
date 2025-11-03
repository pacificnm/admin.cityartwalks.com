/**
 * React Hook Form Database State Select Field Component
 *
 * Database-integrated state selection field for react-hook-form with proper
 * validation and error handling. Fetches states from the API and manages
 * stateId values for form submission. Supports filtering by countryId.
 *
 * Features:
 * - Integration with State API (database-driven)
 * - Proper stateId handling for form submission
 * - Country filtering support
 * - React Hook Form validation
 * - Loading and error states
 * - Accessibility support
 * - Search functionality
 * - Works both inside and outside form contexts
 *
 * @namespace CityArtWalks.Components.StateSelect
 * @fileoverview Database state select field component for react-hook-form
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components
 * @requires react-hook-form - Form state management
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
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

import { useGetPaginatedStates } from 'src/actions/state/hooks';

import { Iconify } from 'src/components/iconify';

/**
 * Gets state data by various identifiers (ID, name, slug)
 * @memberof CityArtWalks.Components.StateSelect
 * @param {*} inputValue - State identifier (ID, name, or slug)
 * @param {Array} states - Array of state objects from API
 * @returns {Object} State object with fallback structure
 */
const getDatabaseState = (inputValue, states = []) => {
  if (!inputValue || !states.length) {
    return { stateId: null, name: '', abbreviation: '', slug: '' };
  }

  const state = states.find(
    (stateItem) =>
      stateItem.stateId === inputValue ||
      stateItem.id === inputValue ||
      stateItem.name === inputValue ||
      stateItem.abbreviation === inputValue ||
      stateItem.slug === inputValue
  );

  return state || { stateId: null, name: '', abbreviation: '', slug: '' };
};

/**
 * Database State Select Field component for react-hook-form and standalone use
 * Integrates with State API for database-driven state selection with country filtering.
 *
 * @memberof CityArtWalks.Components.StateSelect
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
 * @param {number} [props.countryId] - Country ID to filter states
 * @param {Object} [props.sx] - Additional styling
 * @returns {JSX.Element} The database state select field component
 *
 * @example
 * // For react-hook-form usage with country filter
 * <StateSelect
 *   name="stateId"
 *   label="State"
 *   required
 *   placeholder="Choose a state"
 *   countryId={selectedCountryId}
 * />
 *
 * // For standalone usage
 * <StateSelect
 *   label="State"
 *   value={selectedStateId}
 *   onChange={(event) => setSelectedStateId(event.target.value)}
 *   placeholder="Choose a state"
 *   countryId={186}
 * />
 */
export function StateSelect({
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
  countryId,
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

  // Build filters for API call
  const filters = useMemo(() => {
    const filterObj = { active: true }; // Only active states
    if (countryId) {
      filterObj.countryId = countryId;
    }
    return filterObj;
  }, [countryId]);

  // Use paginated hook with high limit to get all active states
  const {
    states: statesData,
    statesLoading,
    statesError,
  } = useGetPaginatedStates(
    filters, // Filter for active states and optional countryId
    1, // page
    9999, // rowsPerPage - high limit to get all states
    '', // token - will be handled by the hook
    600 // revalidate
  );

  // Extract states array from the paginated response
  const states = useMemo(() => statesData || [], [statesData]);

  // Transform database states into options array
  const options = useMemo(() => {
    if (!states || !Array.isArray(states)) return [];
    return states;
  }, [states]);

  // Get option label (always return string)
  const getOptionLabel = useCallback((option) => {
    if (!option) return '';
    if (typeof option === 'string') return option;
    if (typeof option === 'number') return String(option);
    if (typeof option === 'object') {
      return option.name || `State ${option.stateId || option.id}`;
    }
    return String(option);
  }, []);

  // Render option with location icon and state details
  const renderOption = useCallback((props, option) => {
    const { key, ...otherProps } = props;

    return (
      <li key={key} {...otherProps}>
        <Iconify
          icon="solar:map-point-bold"
          sx={{
            mr: 1,
            width: 22,
            height: 22,
            color: 'text.secondary',
          }}
        />
        {option.name} {option.abbreviation && `(${option.abbreviation})`}
      </li>
    );
  }, []);

  // Render input field with location icon adornment
  const renderInput = useCallback(
    (params, field, error, currentValue) => {
      const selectedState = getDatabaseState(currentValue, states);

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

      const hasAdornment = !multiple && !!selectedState.name;
      const hasError = !!(error || statesError);

      // Build TextField props conditionally
      const textFieldProps = {
        ...params,
        label,
        variant,
        placeholder,
        helperText: error?.message || (statesError ? 'Error loading states' : helperText),
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
                  <Iconify
                    icon="solar:map-point-bold"
                    sx={{ width: 22, height: 22, color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            }),
            endAdornment: (
              <>
                {statesLoading && <CircularProgress color="inherit" size={20} />}
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
      states,
      statesError,
      statesLoading,
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
        const state = getDatabaseState(option, states);

        return (
          <Chip
            {...getItemProps({ index })}
            key={state.stateId || state.name}
            label={`${state.name} ${state.abbreviation ? `(${state.abbreviation})` : ''}`}
            size="small"
            variant="soft"
            icon={
              <Iconify
                icon="solar:map-point-bold"
                sx={{ width: 16, height: 16, color: 'text.secondary' }}
              />
            }
          />
        );
      }),
    [states]
  );

  // Standalone component (not in form context)
  const renderStandalone = () => (
    <Autocomplete
      id={`${uniqueId}-state-select`}
      options={options}
      loading={statesLoading}
      multiple={multiple}
      autoHighlight={!multiple}
      disableCloseOnSelect={multiple}
      disabled={statesLoading || !!statesError}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={(params) => renderInput(params, null, null, value)}
      renderValue={multiple ? renderValue : undefined}
      isOptionEqualToValue={(option, currentValue) => {
        if (!option || !currentValue) return option === currentValue;

        // For numeric stateId values
        if (typeof currentValue === 'number') {
          return (option.stateId || option.id) === currentValue;
        }

        // For object comparison
        if (typeof currentValue === 'object') {
          return (option.stateId || option.id) === (currentValue.stateId || currentValue.id);
        }

        // Default comparison
        return option === currentValue;
      }}
      onChange={(event, newValue) => {
        if (onChange) {
          if (multiple) {
            // For multiple selection, store array of stateIds
            const stateIds = (newValue || [])
              .map((state) => state.stateId || state.id)
              .filter(Boolean);
            const syntheticEvent = {
              target: {
                name: name || '',
                value: stateIds,
              },
            };
            onChange(syntheticEvent);
          } else {
            // For single selection, store stateId
            const syntheticEvent = {
              target: {
                name: name || '',
                value:
                  newValue && typeof newValue === 'object'
                    ? newValue.stateId || newValue.id
                    : newValue,
              },
            };
            onChange(syntheticEvent);
          }
        }
      }}
      value={
        // Find the selected option object from the stateId value
        value
          ? multiple
            ? Array.isArray(value)
              ? value
                  .map((id) => states?.find((state) => (state.stateId || state.id) === id))
                  .filter(Boolean)
              : []
            : states?.find((state) => (state.stateId || state.id) === value) || null
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
          id={`${uniqueId}-state-select`}
          options={options}
          loading={statesLoading}
          multiple={multiple}
          autoHighlight={!multiple}
          disableCloseOnSelect={multiple}
          disabled={statesLoading || !!statesError}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={(params) => renderInput(params, field, error, field.value)}
          renderValue={multiple ? renderValue : undefined}
          isOptionEqualToValue={(option, currentValue) => {
            if (!option || !currentValue) return option === currentValue;

            // For numeric stateId values
            if (typeof currentValue === 'number') {
              return (option.stateId || option.id) === currentValue;
            }

            // For object comparison
            if (typeof currentValue === 'object') {
              return (option.stateId || option.id) === (currentValue.stateId || currentValue.id);
            }

            // Default comparison
            return option === currentValue;
          }}
          onChange={(event, newValue) => {
            if (multiple) {
              // For multiple selection, store array of stateIds
              const stateIds = (newValue || [])
                .map((state) => state.stateId || state.id)
                .filter(Boolean);
              field.onChange(stateIds);
            } else {
              // For single selection, store stateId
              if (newValue && typeof newValue === 'object') {
                field.onChange(newValue.stateId || newValue.id);
              } else {
                field.onChange(newValue);
              }
            }
          }}
          value={
            // Find the selected option object from the stateId value
            field.value
              ? multiple
                ? Array.isArray(field.value)
                  ? field.value
                      .map((id) => states?.find((state) => (state.stateId || state.id) === id))
                      .filter(Boolean)
                  : []
                : states?.find((state) => (state.stateId || state.id) === field.value) || null
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
