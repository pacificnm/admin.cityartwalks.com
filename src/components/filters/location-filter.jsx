/**
 * @namespace CityArtWalks.Components.ArtPiece.LocationFilter
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */

'use client';

import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useGetPaginatedCities } from 'src/actions/city/hooks';
import { useGetPaginatedStates } from 'src/actions/state/hooks';
import { useGetPaginatedCountries } from 'src/actions/country/hooks';

/**
 * @memberof CityArtWalks.Components.ArtPiece.LocationFilter
 * @description LocationFilter component provides a cascading location selector for table filtering.
 * It handles the chaining logic where selecting a country enables state selection, and selecting a state enables city selection.
 * This component is specifically designed for table toolbars and doesn't require React Hook Form.
 *
 * Key Features:
 * - Cascading dependencies (country -> state -> city)
 * - Integrates with table filter state management
 * - Individual clear buttons for each filter level
 * - Responsive layout with proper spacing
 * - Accessibility support with ARIA labels
 *
 * @component
 * @example
 * // Basic usage in table toolbar
 * <LocationFilter
 *   filters={filters}
 *   onFilterChange={handleGeographicFilterChange}
 *   filterOptions={filterOptions}
 *   displayFilters={displayFilters}
 * />
 *
 * @param {Object} props - The component props.
 * @param {Object} props.filters - Current filter state containing countryId, stateId, cityId.
 * @param {Function} props.onFilterChange - Callback function to handle filter changes.
 * @param {Object} [props.displayFilters] - Controls which location filters are shown.
 * @param {string} [props.accessToken] - Access token for API calls.
 * @param {Function} [props.onLocationSelect] - Callback when a location is selected, receives (type, locationData).
 * @param {Object} [props.sx] - Additional styling for the container Box.
 * @returns {JSX.Element} The rendered location filter component.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Components documentation
 */
export function LocationFilter({
  filters,
  onFilterChange,
  displayFilters = {},
  accessToken = '',
  onLocationSelect,
  sx,
  ...other
}) {
  // Fetch geographic data for location filters
  const { countries } = useGetPaginatedCountries({}, 1, 5000, accessToken, 3600);

  // Fetch states ONLY when a countryId is selected - otherwise return empty data
  const statesResult = useGetPaginatedStates(
    filters.countryId ? { countryId: filters.countryId } : {},
    1,
    5000, // Use very high limit to ensure we get ALL states
    accessToken,
    3600,
    filters.countryId // Use countryId as refreshKey to refetch when it changes
  );
  const filteredStates = useMemo(
    () => (filters.countryId ? statesResult.states : []),
    [filters.countryId, statesResult.states]
  );

  // Fetch cities ONLY when a stateId is selected - otherwise return empty data
  const citiesResult = useGetPaginatedCities(
    filters.stateId ? { stateId: filters.stateId } : {},
    1,
    5000, // Use very high limit to ensure we get ALL cities
    accessToken,
    3600,
    filters.stateId // Use stateId as refreshKey to refetch when it changes
  );
  const filteredCities = useMemo(
    () => (filters.stateId ? citiesResult.cities : []),
    [filters.stateId, citiesResult.cities]
  );

  // Initialize geographic lookup data when component loads (only once when data is first available)
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized && onLocationSelect && countries && countries.length > 0) {
      // Pass initial geographic data to parent
      onLocationSelect('init', null, {
        countries: countries || [],
        states: filteredStates || [],
        cities: filteredCities || [],
      });
      setHasInitialized(true);
    }
  }, [hasInitialized, onLocationSelect, countries, filteredStates, filteredCities]);

  /**
   * Handles cascading geographic filter changes and provides location data for map recentering
   */
  const handleGeographicFilterChange = useCallback(
    (filterType, value) => {
      if (filterType === 'countryId') {
        onFilterChange('countryId', value);
        onFilterChange('stateId', ''); // Reset dependent filters
        onFilterChange('cityId', '');

        // Pass the selected country data back to parent
        if (onLocationSelect && value) {
          const selectedCountry = countries?.find((c) => c.countryId === value);
          if (selectedCountry) {
            // Pass both location data for map AND filter data for toolbar
            onLocationSelect('country', selectedCountry, {
              countries: countries || [],
              states: [],
              cities: [],
            });
          }
        } else if (onLocationSelect && !value) {
          // Clear location data when country is cleared
          onLocationSelect('country', null, {
            countries: countries || [],
            states: [],
            cities: [],
          });
        }
      } else if (filterType === 'stateId') {
        onFilterChange('stateId', value);
        onFilterChange('cityId', ''); // Reset dependent filter

        if (onLocationSelect && value) {
          const selectedState = filteredStates?.find((s) => s.stateId === value);
          if (selectedState) {
            onLocationSelect('state', selectedState, {
              countries: countries || [],
              states: filteredStates || [],
              cities: [],
            });
          }
        } else if (onLocationSelect && !value) {
          onLocationSelect('state', null, {
            countries: countries || [],
            states: filteredStates || [],
            cities: [],
          });
        }
      } else if (filterType === 'cityId') {
        onFilterChange(filterType, value);

        if (onLocationSelect && value) {
          const selectedCity = filteredCities?.find((c) => c.cityId === value);
          if (selectedCity) {
            onLocationSelect('city', selectedCity, {
              countries: countries || [],
              states: filteredStates || [],
              cities: filteredCities || [],
            });
          }
        } else if (onLocationSelect && !value) {
          onLocationSelect('city', null, {
            countries: countries || [],
            states: filteredStates || [],
            cities: filteredCities || [],
          });
        }
      } else {
        onFilterChange(filterType, value);
      }
    },
    [onFilterChange, onLocationSelect, countries, filteredStates, filteredCities]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        pt: 1,
        alignItems: { xs: 'stretch', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap',
        width: '100%',
        ...sx,
      }}
      {...other}
    >
      {/* Country Filter */}
      {(!displayFilters || displayFilters.countryId) && (
        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            maxWidth: { xs: '100%', sm: 240 },
            flex: 1,
          }}
        >
          <InputLabel>Country</InputLabel>
          <Select
            value={
              filters.countryId && countries?.find((c) => c.countryId === filters.countryId)
                ? filters.countryId
                : ''
            }
            onChange={(event) => handleGeographicFilterChange('countryId', event.target.value)}
            label="Country"
            aria-label="Filter by country"
          >
            <MenuItem value="">All Countries</MenuItem>
            {countries?.map((country) => (
              <MenuItem key={country.countryId} value={country.countryId}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* State Filter */}
      {(!displayFilters || displayFilters.stateId) && (
        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            maxWidth: { xs: '100%', sm: 240 },
            flex: 1,
          }}
        >
          <InputLabel>State</InputLabel>
          <Select
            value={
              filters.stateId && filteredStates?.find((s) => s.stateId === filters.stateId)
                ? filters.stateId
                : ''
            }
            onChange={(event) => handleGeographicFilterChange('stateId', event.target.value)}
            label="State"
            aria-label="Filter by state"
            disabled={!filters.countryId}
          >
            <MenuItem value="">All States</MenuItem>
            {filteredStates.map((state) => (
              <MenuItem key={state.stateId} value={state.stateId}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* City Filter */}
      {(!displayFilters || displayFilters.cityId) && (
        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            maxWidth: { xs: '100%', sm: 240 },
            flex: 1,
          }}
        >
          <InputLabel>City</InputLabel>
          <Select
            value={
              filters.cityId && filteredCities?.find((c) => c.cityId === filters.cityId)
                ? filters.cityId
                : ''
            }
            onChange={(event) => handleGeographicFilterChange('cityId', event.target.value)}
            label="City"
            aria-label="Filter by city"
            disabled={!filters.stateId}
          >
            <MenuItem value="">All Cities</MenuItem>
            {filteredCities.map((city) => (
              <MenuItem key={city.cityId} value={city.cityId}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}

LocationFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  displayFilters: PropTypes.object,
  accessToken: PropTypes.string,
  onLocationSelect: PropTypes.func,
  sx: PropTypes.object,
};
