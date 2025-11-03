'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * ArtPieceType Table Filter Results Component
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
 * @namespace CityArtWalks.Components.ArtPieceType
 * @fileoverview Table filter results component for art piece type management
 * @author Jaimie Garner
 * @version 2.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for chip display
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */

/**
 * ArtPieceType Table Filters Result component
 * Displays active filters as removable chips with simple ID-based formatting.
 *
 * @namespace CityArtWalks.Components.ArtPieceType
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
 * <ArtPieceTypeTableFiltersResult
 *   filters={filters}
 *   totalResults={totalResults}
 *   onResetPage={() => setPage(0)}
 *   onClearFilters={handleClearFilters}
 *   onFilterChange={handleFilterChange}
 *   search={search}
 *   displayFilters={{
 *     search: true,
 *     active: true,
 *     createdBy: false
 *   }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */
export function ArtPieceTypeTableFiltersResult({
  filters = {},
  totalResults,
  onResetPage,
  onClearFilters,
  onFilterChange,
  search,
  displayFilters,
  ...sx
}) {
  /**
   * Determines which filters are currently active and should be displayed as chips
   * @memberof CityArtWalks.Components.ArtPieceType
   * @returns {Object} Object containing only active filters with non-default values
   */
  const activeFilters = useMemo(() => {
    const systemFields = ['search']; // Fields handled separately
    const active = {};

    Object.entries(filters).forEach(([key, value]) => {
      // Skip system fields and hidden filters
      if (systemFields.includes(key)) return;
      if (displayFilters && !displayFilters[key]) return;

      // Include filters with non-default values
      if (key === 'active' && value !== 'all' && value !== '') {
        active[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        active[key] = value;
      } else if (value !== '' && value !== null && value !== undefined && value !== 'all') {
        active[key] = value;
      }
    });

    return active;
  }, [filters, displayFilters]);

  /**
   * Maps filter keys to human-readable display names
   * @memberof CityArtWalks.Components.ArtPieceType
   * @param {string} key - The filter key
   * @returns {string} Human-readable display name
   */
  const getFilterDisplayName = useCallback((key) => {
    const displayNames = {
      // User-related filters
      createdBy: 'Created By',
      updatedBy: 'Updated By',

      // Status and feature filters
      active: 'Status',

      // Content filters
      name: 'Name',
      description: 'Description',

      // Date filters
      createdAt: 'Created Date',
      updatedAt: 'Updated Date',

      // Sort parameters
      sortBy: 'Sort By',
      sortOrder: 'Sort Order',
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }, []);

  /**
   * Formats filter values for display with simple ID-based formatting
   * @memberof CityArtWalks.Components.ArtPieceType
   * @param {*} value - The filter value
   * @param {string} filterKey - The filter key for context
   * @returns {string} Formatted display value
   */
  const getFilterValueDisplay = useCallback((value, filterKey) => {
    // Handle relationship fields with ID display
    if (filterKey === 'createdBy') {
      return `User ID: ${value}`;
    }

    if (filterKey === 'updatedBy') {
      return `User ID: ${value}`;
    }

    // Handle boolean values for active status
    if (filterKey === 'active') {
      if (value === 'true' || value === true) return 'Active';
      if (value === 'false' || value === false) return 'Inactive';
      return String(value);
    }

    // Handle sort order
    if (filterKey === 'sortOrder') {
      return value === 'asc' ? 'Ascending' : 'Descending';
    }

    // Handle sort by with proper capitalization
    if (filterKey === 'sortBy') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    // Handle date values
    if (filterKey.includes('Date') || filterKey.includes('At')) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return String(value);
      }
    }

    // Default string conversion
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return String(value);
  }, []);

  /**
   * Handles removal of individual filter values with proper state management
   * @memberof CityArtWalks.Components.ArtPieceType
   * @param {string} filterKey - The filter key to modify
   * @param {*} filterValue - Specific value to remove (for arrays) or null
   */
  const handleRemoveFilter = useCallback(
    (filterKey, filterValue = null) => {
      // Reset pagination when filters change
      onResetPage && onResetPage();

      const newFilters = { ...filters };

      if (filterValue !== null && Array.isArray(newFilters[filterKey])) {
        // Remove specific value from array filter
        newFilters[filterKey] = newFilters[filterKey].filter((item) => item !== filterValue);
        if (newFilters[filterKey].length === 0) {
          delete newFilters[filterKey];
        }
      } else if (filterKey === 'active') {
        // Reset active to default value
        newFilters[filterKey] = 'all';
      } else {
        // Remove the filter entirely
        delete newFilters[filterKey];
      }

      onFilterChange(newFilters);
    },
    [filters, onResetPage, onFilterChange]
  );

  /**
   * Counts visible filters including search to determine component visibility
   * @memberof CityArtWalks.Components.ArtPieceType
   * @returns {number} Total count of visible filter chips
   */
  const visibleFilterCount = useMemo(() => {
    const activeCount = Object.keys(activeFilters).length;
    const searchCount = search && (!displayFilters || displayFilters.search) ? 1 : 0;
    return activeCount + searchCount;
  }, [activeFilters, search, displayFilters]);

  // Component only renders when filters are active
  if (visibleFilterCount === 0) {
    return null;
  }

  return (
    <FiltersResult totalResults={totalResults} onReset={onClearFilters} sx={sx}>
      {/* Search filter - displayed separately */}
      <FiltersBlock label="Search:" isShow={!!search && (!displayFilters || displayFilters.search)}>
        <Chip
          {...chipProps}
          label={search}
          onDelete={() => {
            onResetPage && onResetPage();
            // Search clearing handled by parent component
            // Could call a dedicated onSearchClear prop if available
          }}
          aria-label={`Remove search filter: ${search}`}
        />
      </FiltersBlock>

      {/* Dynamic filter chips for non-search filters */}
      {Object.entries(activeFilters).map(([key, value]) => (
        <FiltersBlock key={key} label={`${getFilterDisplayName(key)}:`} isShow>
          {Array.isArray(value) ? (
            // Handle array values (multiple selections)
            value.map((item) => (
              <Chip
                {...chipProps}
                key={`${key}-${item}`}
                label={getFilterValueDisplay(item, key)}
                onDelete={() => handleRemoveFilter(key, item)}
                aria-label={`Remove ${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(item, key)}`}
              />
            ))
          ) : (
            // Handle single values
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
    </FiltersResult>
  );
}

/**
 * Props documentation for ArtPieceTypeTableFiltersResult component
 * @memberof CityArtWalks.Components.ArtPieceType
 */
ArtPieceTypeTableFiltersResult.propTypes = {
  // Props would be defined here with PropTypes if needed
};
