/**
 * @namespace CityArtWalks.Components.ArtPieceMaterial.ArtPieceMaterialTableFiltersResult
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * ArtPieceMaterial Table Filters Result component for displaying active filters dynamically
 *
 * Displays active filters as removable chips with ID-based display for optimal performance.
 * Avoids API calls for relationship data fetching to prevent performance issues.
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {number} props.totalResults - Total number of results
 * @param {Function} props.onResetPage - Handler to reset pagination
 * @param {Function} props.onClearFilters - Handler to clear all filters
 * @param {Function} props.onFilterChange - Handler for filter changes
 * @param {string} props.search - Current search value
 * @param {Object} props.displayFilters - Object defining which filters should be displayed
 * @param {...Object} sx - Additional styling props
 * @returns {JSX.Element|null} The table filters result component or null if no visible filters
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Complete guidelines
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceMaterial} - Database schema reference
 */
export function ArtPieceMaterialTableFiltersResult({
  filters = {},
  totalResults,
  onResetPage,
  onClearFilters,
  onFilterChange,
  search,
  displayFilters,
  ...sx
}) {
  // Filter out empty/default values and system fields
  const activeFilters = useMemo(() => {
    const systemFields = ['search']; // Fields that shouldn't be displayed as filter chips
    const active = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (systemFields.includes(key)) return;

      // Check if this filter is allowed to be displayed
      if (displayFilters && !displayFilters[key]) return;

      // Show non-default values
      if (key === 'active' && value !== 'all') {
        active[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        active[key] = value;
      } else if (value !== '' && value !== null && value !== undefined && value !== 'all') {
        active[key] = value;
      }
    });

    return active;
  }, [filters, displayFilters]);

  // Count visible filters (including search if it's allowed and has a value)
  const visibleFilterCount = useMemo(() => {
    const activeCount = Object.keys(activeFilters).length;
    const searchCount = search && (!displayFilters || displayFilters.search) ? 1 : 0;
    return activeCount + searchCount;
  }, [activeFilters, search, displayFilters]);

  // Handler to remove individual filter
  const handleRemoveFilter = useCallback(
    (filterKey, filterValue = null) => {
      onResetPage && onResetPage();

      const newFilters = { ...filters };

      if (filterValue !== null && Array.isArray(newFilters[filterKey])) {
        // Remove specific value from array
        newFilters[filterKey] = newFilters[filterKey].filter((item) => item !== filterValue);
      } else if (filterKey === 'active') {
        // Reset active to 'all'
        newFilters[filterKey] = 'all';
      } else {
        // Remove the filter entirely
        delete newFilters[filterKey];
      }

      onFilterChange(newFilters);
    },
    [filters, onResetPage, onFilterChange]
  );

  // Format filter display names
  const getFilterDisplayName = useCallback((key) => {
    const displayNames = {
      name: 'Name',
      active: 'Status',
      createdBy: 'Created By',
      updatedBy: 'Updated By',
      description: 'Description',
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }, []);

  // Format filter value display using ID-based approach for performance
  const getFilterValueDisplay = useCallback((value, filterKey) => {
    // Use ID-based display for user relationships to avoid API calls
    if (filterKey === 'createdBy') {
      return `User ID: ${value}`;
    }

    if (filterKey === 'updatedBy') {
      return `User ID: ${value}`;
    }

    // Handle active boolean filter
    if (filterKey === 'active') {
      return value === true || value === 'true' ? 'Active' : 'Inactive';
    }

    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return String(value);
  }, []);

  return visibleFilterCount > 0 ? (
    <FiltersResult
      totalResults={totalResults}
      onReset={onClearFilters}
      sx={{ p: 2.5, pt: 0, ...sx }}
    >
      {/* Dynamic filter chips */}
      {Object.entries(activeFilters).map(([key, value]) => (
        <FiltersBlock key={key} label={`${getFilterDisplayName(key)}:`} isShow>
          {Array.isArray(value) ? (
            value.map((item) => (
              <Chip
                {...chipProps}
                key={`${key}-${item}`}
                label={getFilterValueDisplay(item, key)}
                onDelete={() => handleRemoveFilter(key, item)}
              />
            ))
          ) : (
            <Chip
              {...chipProps}
              label={getFilterValueDisplay(value, key)}
              onDelete={() => handleRemoveFilter(key)}
              sx={{ textTransform: 'capitalize' }}
            />
          )}
        </FiltersBlock>
      ))}

      {/* Search filter */}
      <FiltersBlock label="Search:" isShow={!!search && (!displayFilters || displayFilters.search)}>
        <Chip
          {...chipProps}
          label={search}
          onDelete={() => {
            onResetPage && onResetPage();
            const newFilters = { ...filters };
            delete newFilters.search;
            onFilterChange(newFilters);
          }}
        />
      </FiltersBlock>
    </FiltersResult>
  ) : null;
}
