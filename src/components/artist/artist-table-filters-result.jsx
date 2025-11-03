/**
 * @namespace CityArtWalks.Components.Artist.ArtistTableFiltersResult
 * @version 1.1.0
 * @author jaimie garner
 */

'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * Artist Table Filters Result component for displaying active filters dynamically
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
 */
export function ArtistTableFiltersResult({
  filters = {},
  totalResults,
  onResetPage,
  onClearFilters,
  onFilterChange,
  onSearchChange,
  search,
  displayFilters,
  filterOptions = {},
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
      if (key === 'status' && value !== 'all') {
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

  // Format filter display names
  const getFilterDisplayName = useCallback((key) => {
    const displayNames = {
      // Core Artist fields
      name: 'Name',
      slug: 'Slug',
      nationality: 'Nationality',
      biography: 'Biography',

      // Geographic fields
      cityId: 'City',
      stateId: 'State',
      countryId: 'Country',

      // Status and features
      status: 'Status',
      featured: 'Featured',
      viewCount: 'View Count',

      // Dates
      createdAt: 'Created At',
      updatedAt: 'Updated At',

      // User tracking
      createdBy: 'Created By',
      updatedBy: 'Updated By',

      // Content fields
      imageUrl: 'Image',

      // Search
      search: 'Search',
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }, []);

  // Format filter value display using ID-based approach for performance
  const getFilterValueDisplay = useCallback(
    (value, filterKey) => {
      try {
        // Handle Artist status enum
        if (filterKey === 'status') {
          const statusDisplayNames = {
            ACTIVE: 'Active',
            ARCHIVED: 'Archived',
            DELETED: 'Deleted',
            REVIEW: 'Under Review',
            BANNED: 'Banned',
            REJECTED: 'Rejected',
            PENDING: 'Pending',
          };
          return statusDisplayNames[value] || value;
        }

        // Handle featured filter
        if (filterKey === 'featured') {
          return value ? 'Featured' : 'All';
        }

        // Handle numeric fields with formatting
        if (filterKey === 'viewCount') {
          return `${parseInt(value).toLocaleString()} views`;
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

        // Handle relationship fields with name lookup
        if (filterKey === 'createdBy' || filterKey === 'updatedBy') {
          return `User ID: ${value}`;
        }

        if (filterKey === 'cityId' || filterKey === 'stateId' || filterKey === 'countryId') {
          // Look up actual names from filterOptions
          let displayName = value;

          if (filterKey === 'countryId' && filterOptions.countries) {
            const country = filterOptions.countries.find((c) => c.countryId === parseInt(value));
            displayName = country ? country.name : value;
          } else if (filterKey === 'stateId' && filterOptions.states) {
            const state = filterOptions.states.find((s) => s.stateId === parseInt(value));
            displayName = state ? state.name : value;
          } else if (filterKey === 'cityId' && filterOptions.cities) {
            const city = filterOptions.cities.find((c) => c.cityId === parseInt(value));
            displayName = city ? city.name : value;
          }

          return displayName;
        }

        // Default string conversion
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        return String(value);
      } catch {
        return String(value || 'Unknown');
      }
    },
    [filterOptions.countries, filterOptions.states, filterOptions.cities]
  );

  return visibleFilterCount > 0 ? (
    <FiltersResult
      totalResults={totalResults}
      onReset={onClearFilters}
      sx={{ p: 2.5, pt: 0, ...sx }}
    >
      {/* Dynamic filter chips */}
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
                aria-label={`${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(item, key)}`}
              />
            ))
          ) : (
            <Chip
              {...chipProps}
              label={getFilterValueDisplay(value, key)}
              aria-label={`${getFilterDisplayName(key)} filter: ${getFilterValueDisplay(value, key)}`}
              sx={{ textTransform: 'capitalize' }}
            />
          )}
        </FiltersBlock>
      ))}

      {/* Search filter */}
      <FiltersBlock
        label="Search:"
        isShow={!!search && (!displayFilters || displayFilters.search)}
        aria-live="polite"
        aria-label="Active search filter"
      >
        <Chip {...chipProps} label={search} aria-label={`Search filter: ${search}`} />
      </FiltersBlock>
    </FiltersResult>
  ) : null;
}
