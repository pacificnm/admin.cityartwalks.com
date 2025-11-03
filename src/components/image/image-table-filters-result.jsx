/**
 * @file image-table-filters-result.jsx
 * @description Component displaying active image filters and results
 * @namespace CityArtWalks.Components.Image.ImageTableFiltersResult
 * @version 1.0.0
 * @author Claude
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Filter-Components} - Filter documentation
 */

'use client';

import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { debugLog } from 'src/lib/debug';
import {
  IMAGE_SIZE_OPTIONS,
  IMAGE_TYPE_OPTIONS,
  IMAGE_FORMAT_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  IMAGE_CATEGORY_OPTIONS,
} from 'src/actions/image/filter-options';

import { CloseIcon, RefreshIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Image.ImageTableFiltersResult
 * @description Component that displays active image filters as chips and total results count.
 * Shows the current filter state and allows clearing individual filters or all filters at once.
 *
 * This component handles complex filter display including:
 * - Geographic filters (Country → State → City cascading)
 * - Image-specific filters (format, size, aspect ratio, type, category)
 * - Technical filters (resolution, color space, file size)
 * - Status and moderation filters
 * - Date range filters
 * - Search queries
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state object
 * @param {number} [props.totalResults=0] - Total number of results
 * @param {Function} props.onClearFilters - Callback to clear all filters
 * @param {Function} props.onFilterChange - Callback to change a specific filter
 * @param {string} [props.search=''] - Current search query
 * @param {Object} [props.displayFilters={}] - Which filters to display
 * @param {Object} [props.filterOptions={}] - Additional filter options data
 * @param {Object} [props.sx={}] - Additional Material-UI sx props
 * @returns {JSX.Element|null} The filter results component
 *
 * @example
 * // Basic usage
 * <ImageTableFiltersResult
 *   filters={{
 *     imageFormat: 'JPEG',
 *     imageSize: 'large',
 *     featured: true,
 *     countryId: '1',
 *     category: 'STREET_ART'
 *   }}
 *   totalResults={42}
 *   onClearFilters={() => console.log('Clear all filters')}
 *   onFilterChange={(key, value) => console.log('Filter changed:', key, value)}
 *   search="urban art"
 *   displayFilters={{ imageFormat: true, imageSize: true }}
 *   filterOptions={{
 *     countries: [{ id: '1', name: 'United States' }],
 *     states: [],
 *     cities: []
 *   }}
 * />
 */
export function ImageTableFiltersResult({
  filters = {},
  totalResults = 0,
  onClearFilters,
  onFilterChange,
  search = '',
  displayFilters = {},
  filterOptions = {},
  sx = {},
}) {
  // Helper function to get human-readable filter labels
  const getFilterLabel = useMemo(() => {
    const formatLookups = {
      imageFormat: IMAGE_FORMAT_OPTIONS.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {}),
      imageSize: IMAGE_SIZE_OPTIONS.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {}),
      aspectRatio: ASPECT_RATIO_OPTIONS.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {}),
      imageType: IMAGE_TYPE_OPTIONS.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {}),
      category: IMAGE_CATEGORY_OPTIONS.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {}),
    };

    return (filterKey, filterValue) => {
      // Handle special cases first
      if (filterKey === 'search' && search) {
        return `Search: "${search}"`;
      }

      // Handle geographic filters
      if (filterKey === 'countryId' && filterOptions?.countries) {
        const country = filterOptions.countries.find(
          (c) => c.id === filterValue || c.countryId === filterValue
        );
        return country ? `Country: ${country.name}` : `Country: ${filterValue}`;
      }
      if (filterKey === 'stateId' && filterOptions?.states) {
        const state = filterOptions.states.find(
          (s) => s.id === filterValue || s.stateId === filterValue
        );
        return state ? `State: ${state.name}` : `State: ${filterValue}`;
      }
      if (filterKey === 'cityId' && filterOptions?.cities) {
        const city = filterOptions.cities.find(
          (c) => c.id === filterValue || c.cityId === filterValue
        );
        return city ? `City: ${city.name}` : `City: ${filterValue}`;
      }

      // Handle boolean filters
      if (typeof filterValue === 'boolean') {
        const booleanLabels = {
          featured: filterValue ? 'Featured' : 'Not Featured',
          isVerified: filterValue ? 'Verified' : 'Not Verified',
        };
        return booleanLabels[filterKey] || `${filterKey}: ${filterValue ? 'Yes' : 'No'}`;
      }

      // Handle status filters
      if (filterKey === 'status') {
        const statusLabels = {
          ACTIVE: 'Active',
          DRAFT: 'Draft',
          PRIVATE: 'Private',
          PENDING: 'Pending Review',
          REJECTED: 'Rejected',
          ARCHIVED: 'Archived',
          FLAGGED: 'Flagged',
        };
        return statusLabels[filterValue] || filterValue;
      }

      // Handle moderation status filters
      if (filterKey === 'moderationStatus') {
        const moderationLabels = {
          PENDING: 'Pending Moderation',
          APPROVED: 'Approved',
          REJECTED: 'Rejected',
          FLAGGED: 'Flagged',
        };
        return moderationLabels[filterValue] || filterValue;
      }

      // Handle date filters
      if (filterKey.includes('Date') && filterValue instanceof Date) {
        return `${filterKey}: ${filterValue.toLocaleDateString()}`;
      }

      // Handle range filters
      if (filterKey.startsWith('min') || filterKey.startsWith('max')) {
        const baseKey = filterKey.replace(/^(min|max)/, '').toLowerCase();
        const prefix = filterKey.startsWith('min') ? 'Min' : 'Max';
        const rangeLabels = {
          viewcount: 'Views',
          downloadcount: 'Downloads',
          filesize: 'File Size',
          qualityscore: 'Quality Score',
        };
        const label = rangeLabels[baseKey] || baseKey;
        return `${prefix} ${label}: ${filterValue}`;
      }

      // Use lookup tables for standard filters
      if (formatLookups[filterKey]) {
        return formatLookups[filterKey][filterValue] || filterValue;
      }

      // Handle user/creator filters
      if (filterKey === 'userId' || filterKey === 'createdBy') {
        return `User ID: ${filterValue}`;
      }

      // Default: capitalize key and show value
      const readableKey = filterKey.charAt(0).toUpperCase() + filterKey.slice(1);
      return `${readableKey}: ${filterValue}`;
    };
  }, [search, filterOptions]);

  // Generate filter chips
  const filterChips = useMemo(() => {
    const chips = [];

    // Add search chip if there's a search query
    if (search && search.trim()) {
      chips.push({
        key: 'search',
        label: getFilterLabel('search', search),
        onDelete: () => onFilterChange('search', ''),
      });
    }

    // Add chips for each active filter
    Object.entries(filters).forEach(([key, value]) => {
      // Skip empty, null, or 'all' values
      if (!value || value === 'all' || value === '') return;

      // Skip system filters
      if (['search'].includes(key)) return;

      // Skip filters not enabled for display
      if (displayFilters && Object.keys(displayFilters).length > 0 && !displayFilters[key]) {
        return;
      }

      chips.push({
        key,
        label: getFilterLabel(key, value),
        onDelete: () => {
          // Handle clearing geographic cascade filters
          if (key === 'countryId') {
            onFilterChange('countryId', '');
            onFilterChange('stateId', '');
            onFilterChange('cityId', '');
          } else if (key === 'stateId') {
            onFilterChange('stateId', '');
            onFilterChange('cityId', '');
          } else {
            onFilterChange(key, '');
          }
        },
      });
    });

    return chips;
  }, [filters, search, getFilterLabel, onFilterChange, displayFilters]);

  // Don't render if no active filters
  if (filterChips.length === 0) {
    return null;
  }

  debugLog('ImageTableFiltersResult.render', 'Rendering filter chips:', filterChips);

  return (
    <Box sx={{ ...sx }}>
      {/* Results count and clear button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {totalResults.toLocaleString()} {totalResults === 1 ? 'image' : 'images'} found
        </Typography>

        <Button
          size="small"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onClearFilters}
          sx={{ textTransform: 'none' }}
        >
          Clear all filters
        </Button>
      </Box>

      {/* Active filter chips */}
      <Stack direction="row" flexWrap="wrap" spacing={1}>
        {filterChips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            size="small"
            variant="outlined"
            color="primary"
            onDelete={chip.onDelete}
            deleteIcon={<CloseIcon />}
            sx={{
              height: 28,
              fontSize: '0.75rem',
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

ImageTableFiltersResult.propTypes = {
  filters: PropTypes.object,
  totalResults: PropTypes.number,
  onClearFilters: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  search: PropTypes.string,
  displayFilters: PropTypes.object,
  filterOptions: PropTypes.object,
  sx: PropTypes.object,
};
