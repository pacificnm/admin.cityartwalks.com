/**
 * @namespace CityArtWalks.Form.Element.Location
 * @version 1.0.0.0
 * @author [Jaimie Garner]
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */

'use client';

import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { ElementCity } from './element-city';
import { ElementState } from './element-state';
import { ElementCountry } from './element-country';

/**
 * @memberof CityArtWalks.Form.Element.Location
 * @description ElementLocation component provides a cascading location selector using country, state, and city elements.
 * It handles the chaining logic where selecting a country enables state selection, and selecting a state enables city selection.
 * This component reuses the existing ElementCountry, ElementState, and ElementCity components to avoid code duplication.
 *
 * Key Features:
 * - Uses existing form elements (ElementCountry, ElementState, ElementCity)
 * - Handles cascading dependencies (country -> state -> city)
 * - Integrates with React Hook Form
 * - Supports custom grid layout and styling
 * - Provides callback handlers for each selection
 *
 * @component
 * @example
 * // Basic usage within a React Hook Form
 * <ElementLocation />
 *
 * @example
 * // With custom callbacks and styling
 * <ElementLocation
 *   onCountryChange={handleCountryChange}
 *   onStateChange={handleStateChange}
 *   onCityChange={handleCityChange}
 *   gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
 *   disabled={false}
 * />
 *
 * @param {Object} props - The component props.
 * @param {Function} [props.onCountryChange] - Callback function to handle country change.
 * @param {Function} [props.onStateChange] - Callback function to handle state change.
 * @param {Function} [props.onCityChange] - Callback function to handle city change.
 * @param {Object} [props.gridTemplateColumns] - Custom grid template columns for responsive layout.
 * @param {boolean} [props.disabled=false] - Whether the location fields are disabled.
 * @param {Object} [props.sx] - Additional styling for the container Box.
 * @param {Object} [props.other] - Other props to pass to the container Box.
 * @returns {JSX.Element} The rendered location selector component.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */
export function ElementLocation(props) {
  const {
    onCountryChange,
    onStateChange,
    onCityChange,
    gridTemplateColumns = { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
    disabled = false,
    sx,
    ...other
  } = props;

  const { watch, setValue } = useFormContext();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Watch form values to detect changes
  const countryId = watch('countryId');
  const stateId = watch('stateId');

  // Update local state when form values change
  useEffect(() => {
    setSelectedCountry(countryId || '');
  }, [countryId]);

  useEffect(() => {
    setSelectedState(stateId || '');
  }, [stateId]);

  /**
   * Handle country selection change
   */
  const handleCountryChange = (event) => {
    const countryValue = event.target.value;
    setSelectedCountry(countryValue);
    setSelectedState('');

    // Reset dependent fields
    setValue('stateId', '');
    setValue('cityId', '');

    if (onCountryChange) {
      onCountryChange(event);
    }
  };

  /**
   * Handle state selection change
   */
  const handleStateChange = (event) => {
    const stateValue = event.target.value;
    setSelectedState(stateValue);

    // Reset dependent fields
    setValue('cityId', '');

    if (onStateChange) {
      onStateChange(event);
    }
  };

  /**
   * Handle city selection change
   */
  const handleCityChange = (event) => {
    if (onCityChange) {
      onCityChange(event);
    }
  };

  return (
    <Box
      rowGap={3}
      columnGap={2}
      display="grid"
      gridTemplateColumns={gridTemplateColumns}
      sx={{ mt: 3, ...sx }}
      {...other}
    >
      <ElementCountry name="countryId" onCountryChange={handleCountryChange} disabled={disabled} />

      <ElementState
        name="stateId"
        selectedCountry={selectedCountry}
        onStateChange={handleStateChange}
        disabled={disabled}
      />

      <ElementCity
        name="cityId"
        selectedState={selectedState}
        onCityChange={handleCityChange}
        disabled={disabled}
      />
    </Box>
  );
}

ElementLocation.propTypes = {
  onCountryChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onCityChange: PropTypes.func,
  gridTemplateColumns: PropTypes.object,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};
