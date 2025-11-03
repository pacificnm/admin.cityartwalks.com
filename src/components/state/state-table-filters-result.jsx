/**
 * State Table Filters Result Component
 *
 * Displays active table filters as removable chips with simple ID-based formatting.
 * Integrates with the parent table component for filter state management
 * and provides user-friendly display of filter combinations without relationship data fetching.
 *
 * Features:
 * - Dynamic chip generation for active filters
 * - Simple ID-based display for relationship fields
 * - Individual and bulk filter removal
 * - Search filter display and removal
 * - Conditional visibility based on active filters
 * - Array value handling for multi-select filters
 * - Lightweight implementation without API dependencies
 *
 * @namespace CityArtWalks.Components.State
 * @fileoverview Table filter results component for State management
 * @author Jaimie Garner
 * @version 1.0.1
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for chip display
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model} - State model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State} - Database schema reference
 */

'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * Maps filter keys to human-readable display names
 * @memberof CityArtWalks.Components.State
 * @param {string} key - The filter key
 * @returns {string} Human-readable display name
 */
const getFilterDisplayName = (key) => {
  const displayNames = {
    countryId: 'Country',
    stateId: 'State',
    cityId: 'City',
    name: 'Name',
    abbreviation: 'Abbreviation',
    slug: 'Slug',
    latitude: 'Latitude',
    longitude: 'Longitude',
    active: 'Active',
    imageUrl: 'Image URL',
    createdBy: 'Created By',
    updatedBy: 'Updated By',
    featured: 'Featured',
  };
  return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

/**
 * Formats filter values for display with simple ID-based formatting
 * @memberof CityArtWalks.Components.State
 * @param {*} value - The filter value
 * @param {string} filterKey - The filter key for context
 * @returns {string} Formatted display value
 */
const getFilterValueDisplay = (value, filterKey) => {
  if (filterKey === 'active') {
    return value ? 'Yes' : 'No';
  }
  if (filterKey === 'countryId') {
    return `Country ID: ${value}`;
  }
  if (filterKey === 'stateId') {
    return `State ID: ${value}`;
  }
  if (filterKey === 'cityId') {
    return `City ID: ${value}`;
  }
  if (filterKey === 'createdBy') {
    return `User ID: ${value}`;
  }
  if (filterKey === 'updatedBy') {
    return `User ID: ${value}`;
  }
  if (filterKey === 'featured' && value === true) {
    return 'Featured';
  }
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return String(value);
};

/**
 * State Table Filters Result component
 * Displays active filters as removable chips with simple ID-based formatting.
 *
 * @namespace CityArtWalks.Components.State
 * @param {Object} props - Component props
 * @param {Object} [props.filters={}] - Current filter state from parent table
 * @param {number} props.totalResults - Total number of filtered results
 * @param {Function} props.onResetPage - Handler to reset pagination when filters change
 * @param {Function} props.onClearFilters - Handler to clear all active filters
 * @param {Function} props.onFilterChange - Handler for individual filter changes
 * @param {string} props.search - Current search value
 * @param {Object} props.displayFilters - Controls which filters are shown in UI
 * @param {...Object} sx - Additional styling props (rest parameter)
 * @returns {JSX.Element|null} The table filter results component or null if no visible filters
 *
 * @example
 * <StateTableFiltersResult
 *   filters={filters}
 *   totalResults={totalResults}
 *   onResetPage={() => setPage(0)}
 *   onClearFilters={handleClearFilters}
 *   onFilterChange={handleFilterChange}
 *   search={search}
 *   displayFilters={{
 *     search: true,
 *     active: true,
 *     countryId: true,
 *     createdBy: false
 *   }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
 */
export function StateTableFiltersResult({
  filters = {},
  totalResults,
  onResetPage,
  onClearFilters,
  onFilterChange,
  search,
  displayFilters,
  ...sx
}) {
  // Detect active filters (excluding system fields and hidden filters)
  const activeFilters = useMemo(() => {
    const systemFields = ['search'];
    const active = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (systemFields.includes(key)) return;
      if (displayFilters && !displayFilters[key]) return;

      if (key === 'active' && typeof value === 'boolean') {
        active[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        active[key] = value;
      } else if (value !== '' && value !== null && value !== undefined && value !== 'all') {
        active[key] = value;
      }
    });

    return active;
  }, [filters, displayFilters]);

  // Count visible filters including search
  const visibleFilterCount = useMemo(() => {
    const activeCount = Object.keys(activeFilters).length;
    const searchCount = search && (!displayFilters || displayFilters.search) ? 1 : 0;
    return activeCount + searchCount;
  }, [activeFilters, search, displayFilters]);

  // Handler for removing individual filter values
  const handleRemoveFilter = useCallback(
    (filterKey, filterValue = null) => {
      onResetPage && onResetPage();

      const newFilters = { ...filters };

      if (filterValue !== null && Array.isArray(newFilters[filterKey])) {
        newFilters[filterKey] = newFilters[filterKey].filter((item) => item !== filterValue);
        if (newFilters[filterKey].length === 0) {
          delete newFilters[filterKey];
        }
      } else if (filterKey === 'active') {
        newFilters[filterKey] = false;
      } else {
        delete newFilters[filterKey];
      }

      onFilterChange(newFilters);
    },
    [filters, onResetPage, onFilterChange]
  );

  // Handler for clearing search
  const handleClearSearch = useCallback(() => {
    onResetPage && onResetPage();
    // Clear search by calling onFilterChange with empty search or use dedicated search clear handler
    // For now, we'll assume the parent handles search clearing through onClearFilters
    if (onClearFilters) {
      onClearFilters();
    }
  }, [onResetPage, onClearFilters]);

  // Only render if there are visible filters
  if (visibleFilterCount === 0) return null;

  return (
    <FiltersResult totalResults={totalResults} {...sx}>
      {/* Dynamic filter chips for non-search filters */}
      {Object.entries(activeFilters).map(([key, value]) => (
        <FiltersBlock
          key={key}
          label={`${getFilterDisplayName(key)}:`}
          isShow
          aria-live="polite"
          aria-label={`Active ${getFilterDisplayName(key)} filters`}
        >
          {Array.isArray(value) ? (
            value.map((item) => (
              <Chip
                {...chipProps}
                key={`${key}-${item}`}
                label={getFilterValueDisplay(item, key)}
                onDelete={() => handleRemoveFilter(key, item)}
                aria-label={`Remove ${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(item, key)}`}
                sx={{ textTransform: 'capitalize' }}
              />
            ))
          ) : (
            <Chip
              {...chipProps}
              label={getFilterValueDisplay(value, key)}
              onDelete={() => handleRemoveFilter(key)}
              aria-label={`Remove ${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(value, key)}`}
              sx={{ textTransform: 'capitalize' }}
            />
          )}
        </FiltersBlock>
      ))}

      {/* Search filter - displayed separately */}
      <FiltersBlock label="Search:" isShow={!!search && (!displayFilters || displayFilters.search)}>
        {search && (
          <Chip
            {...chipProps}
            label={search}
            onDelete={handleClearSearch}
            aria-label={`Remove search filter: ${search}`}
          />
        )}
      </FiltersBlock>
    </FiltersResult>
  );
}
