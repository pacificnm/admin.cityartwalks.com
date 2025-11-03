'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { debugLog } from 'src/lib/debug';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * City Table Filters Result Component
 *
 * Displays active city table filters as removable chips with City-specific formatting.
 * Integrates with the parent table component for filter state management and provides
 * user-friendly display of filter combinations with proper City field handling.
 *
 * Specifically handles City entity filters including:
 * - Location relationships (stateId, countryId)
 * - Geographic coordinates (latitude, longitude)
 * - Status filters (active boolean)
 * - User tracking (createdBy, updatedBy)
 * - Search queries
 * - Date ranges (createdAt, updatedAt)
 * - Content fields (name, slug, imageUrl)
 *
 * Features:
 * - City-specific filter display names and value formatting
 * - Boolean active status formatting (active/inactive)
 * - Geographic coordinate formatting with precision
 * - Date filter formatting with localized display
 * - Individual and bulk filter removal
 * - Search filter display and removal
 * - Conditional visibility based on active filters
 * - Array value handling for multi-select filters
 * - Enhanced accessibility with ARIA labels
 * - Simple ID-based display for relationship fields (no API calls)
 * - Proper error handling with debug logging
 *
 * @namespace CityArtWalks.Components.City.TableFiltersResult
 * @fileoverview Table filter results component for city management
 * @author Jaimie Garner
 * @version 2.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for chip display
 * @requires CityArtWalks.Components.FiltersResult - Base filter result components
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/table-filter-results.instructions.md} - Implementation guidelines
 */

/**
 * City Table Filters Result component
 * Displays active city filters as removable chips with City-specific formatting.
 *
 * Integration with CityTable component:
 *
 * @example
 * // In CityTable component:
 * <CityTableFiltersResult
 *   filters={tableFilters}
 *   totalResults={cities.length}
 *   onResetPage={() => setPage(0)}
 *   onClearFilters={() => setFilters({})}
 *   onFilterChange={handleFilterChange}
 *   search={searchValue}
 *   displayFilters={{
 *     search: true,
 *     active: true,
 *     stateId: true,
 *     countryId: true,
 *     slug: true
 *   }}
 * />
 *
 * @memberof CityArtWalks.Components.City.TableFiltersResult
 * @function CityTableFiltersResult
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
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 */
export function CityTableFiltersResult({
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
   * Maps filter keys to human-readable display names for City filters
   * @memberof CityArtWalks.Components.City.TableFiltersResult
   * @param {string} key - The filter key
   * @returns {string} Human-readable display name
   */
  const getFilterDisplayName = useCallback((key) => {
    const displayNames = {
      // Core City fields
      name: 'Name',
      slug: 'Slug',
      active: 'Status',
      imageUrl: 'Image',

      // Geographic fields
      latitude: 'Latitude',
      longitude: 'Longitude',
      stateId: 'State',
      countryId: 'Country',

      // Date fields
      createdAt: 'Created At',
      updatedAt: 'Updated At',

      // User tracking
      createdBy: 'Created By',
      updatedBy: 'Updated By',

      // Search
      search: 'Search',
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }, []);

  /**
   * Formats filter values for display with City-specific handling
   * @memberof CityArtWalks.Components.City.TableFiltersResult
   * @param {*} value - The filter value
   * @param {string} filterKey - The filter key for context
   * @returns {string} Formatted display value
   */
  const getFilterValueDisplay = useCallback(
    (value, filterKey) => {
      try {
        // Handle City active boolean status
        if (filterKey === 'active') {
          return value ? 'Active' : 'Inactive';
        }

        // Handle geographic coordinates with precision (allow 0 values)
        if (filterKey === 'latitude' || filterKey === 'longitude') {
          return `${filterKey === 'latitude' ? 'Lat' : 'Lng'}: ${parseFloat(value).toFixed(6)}`;
        }

        // Handle date filters with formatting
        if (['createdAt', 'updatedAt'].includes(filterKey)) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString();
            }
          } catch {
            // Fallback to string
          }
        }

        // Handle relationship fields with simple ID display
        if (filterKey === 'createdBy' || filterKey === 'updatedBy') {
          return `User ID: ${value}`;
        }

        if (filterKey === 'stateId' || filterKey === 'countryId') {
          return `${getFilterDisplayName(filterKey)} ID: ${value}`;
        }

        // Default string conversion
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        return String(value);
      } catch (error) {
        debugLog(
          'CityArtWalks.Components.City.filterValueError',
          `Error formatting filter value for ${filterKey}: ${error.message}`
        );
        return String(value || 'Unknown');
      }
    },
    [getFilterDisplayName]
  );

  /**
   * Determines which City filters are currently active and should be displayed as chips
   * @memberof CityArtWalks.Components.City.TableFiltersResult
   * @returns {Object} Object containing only active filters with non-default values
   */
  const activeFilters = useMemo(() => {
    const systemFields = ['search']; // Fields handled separately
    const active = {};

    Object.entries(filters).forEach(([key, value]) => {
      // Skip system fields and hidden filters
      if (systemFields.includes(key)) return;
      if (displayFilters && !displayFilters[key]) return;

      // City-specific filter logic
      if (key === 'active' && typeof value === 'boolean') {
        active[key] = value;
      } else if (
        (key === 'latitude' || key === 'longitude') &&
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
        // Allow 0 values for coordinates (Gulf of Guinea is valid)
        active[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        active[key] = value;
      } else if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        value !== 'all' &&
        value !== 0
      ) {
        active[key] = value;
      }
    });

    return active;
  }, [filters, displayFilters]);

  /**
   * Counts visible filters including search to determine component visibility
   * @memberof CityArtWalks.Components.City.TableFiltersResult
   * @returns {number} Total count of visible filter chips
   */
  const visibleFilterCount = useMemo(() => {
    const activeCount = Object.keys(activeFilters).length;
    const searchCount = search && (!displayFilters || displayFilters.search) ? 1 : 0;
    return activeCount + searchCount;
  }, [activeFilters, search, displayFilters]);

  /**
   * Handles removal of individual filter values with proper state management
   * @memberof CityArtWalks.Components.City.TableFiltersResult
   * @param {string} filterKey - The filter key to modify
   * @param {*} filterValue - Specific value to remove (for arrays) or null
   */
  const handleRemoveFilter = useCallback(
    (filterKey, filterValue = null) => {
      try {
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
          // Reset active to default value (remove filter)
          delete newFilters[filterKey];
        } else if (filterKey === 'latitude' || filterKey === 'longitude') {
          // Reset coordinate values to remove
          delete newFilters[filterKey];
        } else {
          // Remove the filter entirely
          delete newFilters[filterKey];
        }

        onFilterChange(newFilters);
      } catch (error) {
        debugLog(
          'CityArtWalks.Components.City.filterRemovalError',
          `Error removing filter ${filterKey}: ${error.message}`
        );
      }
    },
    [filters, onResetPage, onFilterChange]
  );

  /**
   * Handles search filter removal with proper state management
   * @memberof CityArtWalks.Components.City.TableFiltersResult
   */
  const handleSearchRemoval = useCallback(() => {
    try {
      onResetPage && onResetPage();
      // Clear search through parent filter change
      const newFilters = { ...filters };
      delete newFilters.search;
      onFilterChange(newFilters);
    } catch (error) {
      debugLog(
        'CityArtWalks.Components.City.searchRemovalError',
        `Error removing search filter: ${error.message}`
      );
    }
  }, [filters, onResetPage, onFilterChange]);

  // Component only renders when filters are active
  try {
    return visibleFilterCount > 0 ? (
      <FiltersResult
        totalResults={totalResults}
        onReset={onClearFilters}
        sx={{ p: 2.5, pt: 0, ...sx }}
      >
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

        {/* Search filter - displayed separately */}
        <FiltersBlock
          label="Search:"
          isShow={!!search && (!displayFilters || displayFilters.search)}
          aria-live="polite"
          aria-label="Active search filter"
        >
          <Chip
            {...chipProps}
            label={search}
            onDelete={handleSearchRemoval}
            aria-label={`Remove search filter: ${search}`}
          />
        </FiltersBlock>
      </FiltersResult>
    ) : null;
  } catch (error) {
    debugLog(
      'CityArtWalks.Components.City.renderError',
      `Error rendering filter results: ${error.message}`
    );
    return null;
  }
}
