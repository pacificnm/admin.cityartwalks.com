/**
 * @namespace CityArtWalks.Components.ArtPieceTag.ArtPieceTagTableFiltersResult
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useMemo, useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

/**
 * ArtPieceTag Table Filters Result component for displaying active filters dynamically
 *
 * Displays active filters as removable chips with ID-based display for optimal performance.
 * Avoids API calls for relationship data fetching to prevent performance issues.
 * Shows active filters for art piece tag searches and filtering.
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
 * @example
 * <ArtPieceTagTableFiltersResult
 *   filters={{ active: 'true', createdBy: '123' }}
 *   totalResults={45}
 *   onResetPage={() => setPage(0)}
 *   onClearFilters={handleClearFilters}
 *   onFilterChange={handleFilterChange}
 *   search="urban"
 *   displayFilters={{ active: true, createdBy: true }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Complete guidelines
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag model documentation
 */
export function ArtPieceTagTableFiltersResult({
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
      // Skip empty values, null, undefined, empty arrays, and system fields
      if (
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        systemFields.includes(key)
      ) {
        return;
      }

      // Skip 'all' status filters (means no actual filtering)
      if (key === 'active' && value === 'all') {
        return;
      }

      active[key] = value;
    });

    return active;
  }, [filters]);

  // Generate display configuration for each active filter
  const filterDisplays = useMemo(() => {
    const displays = [];

    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      // Check if this filter should be displayed
      if (displayFilters && !displayFilters[filterKey]) {
        return;
      }

      let label = '';
      let value = '';

      switch (filterKey) {
        case 'active':
          label = 'Status';
          value = filterValue === 'true' || filterValue === true ? 'Active' : 'Inactive';
          break;

        case 'createdBy':
          label = 'Created By';
          // Display User ID directly to avoid API calls
          value = `User ID: ${filterValue}`;
          break;

        case 'sortBy':
          label = 'Sort By';
          value = filterValue.charAt(0).toUpperCase() + filterValue.slice(1);
          break;

        case 'sortOrder':
          label = 'Sort Order';
          value = filterValue === 'asc' ? 'Ascending' : 'Descending';
          break;

        default:
          // Generic handling for other filter types
          label = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
          value = typeof filterValue === 'string' ? filterValue : String(filterValue);
          break;
      }

      if (label && value) {
        displays.push({
          key: filterKey,
          label,
          value,
          filterValue,
        });
      }
    });

    return displays;
  }, [activeFilters, displayFilters]);

  // Handler for removing individual filter chips
  const handleRemoveFilter = useCallback(
    (filterKey) => {
      const newFilters = { ...filters };

      // Set filter to appropriate "empty" value based on type
      if (filterKey === 'active') {
        newFilters[filterKey] = 'all';
      } else if (Array.isArray(filters[filterKey])) {
        newFilters[filterKey] = [];
      } else {
        delete newFilters[filterKey];
      }

      onFilterChange(newFilters);
      onResetPage();
    },
    [filters, onFilterChange, onResetPage]
  );

  // Handler for clearing all filters
  const handleClearAll = useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  // Don't render if no active filters or search
  const hasVisibleContent = filterDisplays.length > 0 || Boolean(search);
  if (!hasVisibleContent) {
    return null;
  }

  return (
    <FiltersResult totalResults={totalResults} sx={sx}>
      <FiltersBlock
        label="Active Status:"
        sx={{ display: filterDisplays.length ? 'flex' : 'none' }}
      >
        {filterDisplays.map((filter) => (
          <Chip
            key={filter.key}
            label={`${filter.label}: ${filter.value}`}
            size="small"
            onDelete={() => handleRemoveFilter(filter.key)}
            {...chipProps}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" sx={{ display: search ? 'flex' : 'none' }}>
        <Chip
          label={search}
          size="small"
          onDelete={() => onFilterChange('search', '')}
          {...chipProps}
        />
      </FiltersBlock>

      <FiltersBlock label="Clear All:" sx={{ display: hasVisibleContent ? 'flex' : 'none' }}>
        <Chip label="Clear" size="small" onDelete={handleClearAll} {...chipProps} />
      </FiltersBlock>
    </FiltersResult>
  );
}
