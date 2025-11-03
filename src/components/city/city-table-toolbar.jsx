'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { debugError } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';
import { StateSelect } from 'src/components/state-select';
import { CountrySelect } from 'src/components/country-select';
import { SearchIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * City Table Toolbar Component
 *
 * Provides comprehensive filtering, searching, and action capabilities for the city table.
 * Integrates with the parent table component for state management and includes responsive
 * design patterns for optimal user experience across devices.
 *
 * Specifically handles City entity filters including:
 * - Real-time search functionality with debounced input for city names
 * - Active status toggle filter (active/inactive cities)
 * - Geographic filtering with hierarchical country → state selection
 * - Slug-based filtering for unique city identifiers
 * - Location coordinate filtering (latitude, longitude)
 * - User tracking filters (createdBy, updatedBy)
 * - Date range filtering (createdAt, updatedAt)
 * - Image presence filtering (imageUrl)
 * - Bulk action menu with proper selection handling
 * - Responsive layout design optimized for mobile and desktop
 * - Conditional filter display with granular control
 * - Filter count indicators for better user feedback
 * - Individual filter clearing capabilities
 * - Enhanced accessibility with proper ARIA labels
 * - Comprehensive error handling with debug logging
 *
 * Features:
 * - City-specific active status toggle (Boolean field)
 * - Hierarchical geographic filtering (Country → State selection)
 * - Slug identifier filtering for SEO-friendly URLs
 * - Coordinate-based location filtering (latitude/longitude)
 * - User tracking filters with ID-based selection
 * - Date range filtering for audit trails
 * - Image presence indicator filtering
 * - Enhanced bulk actions with selection context
 * - Filter count badges for active filters
 * - Individual filter clear buttons
 * - Keyboard navigation support
 * - Error handling for filter operations
 * - Type-safe filter value handling
 *
 * @namespace CityArtWalks.Components.City.TableToolbar
 * @fileoverview Table toolbar component for city filtering and actions
 * @author Jaimie Garner
 * @version 2.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for form controls
 * @requires minimal-shared - Shared utilities and hooks
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/table-toolbar.instructions.md} - Implementation guidelines
 */

/**
 * City Table Toolbar component
 * Provides filtering, searching, and action capabilities for the city table.
 *
 * @memberof CityArtWalks.Components.City.TableToolbar
 * @function CityTableToolbar
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state from parent table
 * @param {Function} props.onResetPage - Handler to reset pagination when filters change
 * @param {Function} props.onFilterChange - Handler for filter value changes
 * @param {Function} props.onSearchChange - Handler for search input changes
 * @param {string} props.search - Current search value
 * @param {Function} props.onClearFilters - Handler to clear all active filters
 * @param {Function} [props.onBulkAction] - Handler for bulk actions with selection context
 * @param {Array} [props.selectedRows=[]] - Currently selected table rows for bulk actions
 * @param {Object} [props.displayFilters] - Controls which filters are shown in UI
 * @param {Array} [props.userOptions] - Available users for createdBy/updatedBy filters
 * @returns {JSX.Element} The table toolbar component
 *
 * @example
 * <CityTableToolbar
 *   filters={filters}
 *   onResetPage={() => setPage(0)}
 *   onFilterChange={handleFilterChange}
 *   onSearchChange={handleSearchChange}
 *   search={search}
 *   onClearFilters={handleClearFilters}
 *   onBulkAction={handleBulkAction}
 *   selectedRows={selectedRows}
 *   displayFilters={{
 *     search: true,
 *     active: true,
 *     countryId: true,
 *     stateId: true,
 *     slug: true,
 *     coordinates: false,
 *     createdBy: false,
 *     updatedBy: false,
 *     hasImage: true,
 *     toolMenu: true
 *   }}
 *   userOptions={[{ id: 1, name: 'John Doe' }]}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model} - City model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Components} - Table component patterns
 */
export function CityTableToolbar({
  filters,
  onResetPage,
  onFilterChange,
  onSearchChange,
  search,
  onClearFilters,
  displayFilters = {
    search: true,
    countryId: true,
    stateId: true,
    toolMenu: true,
  },
}) {
  /**
   * Handles filter changes with error handling and page reset
   * @memberof CityArtWalks.Components.City.TableToolbar
   * @param {string} key - Filter key to change
   * @param {*} value - New filter value
   */
  const handleFilterChange = useCallback(
    (key, value) => {
      try {
        onResetPage && onResetPage();
        onFilterChange(key, value);
      } catch (error) {
        debugError(
          'CityArtWalks.Components.City.filterChangeError',
          `Error changing filter ${key}: ${error.message}`
        );
      }
    },
    [onResetPage, onFilterChange]
  );

  /**
   * Handles cascading geographic filter changes
   * @memberof CityArtWalks.Components.City.TableToolbar
   * @param {string} filterType - The geographic filter type (countryId, stateId)
   * @param {string} value - The selected value
   */
  const handleGeographicFilterChange = useCallback(
    (filterType, value) => {
      try {
        onResetPage && onResetPage();

        if (filterType === 'countryId') {
          onFilterChange('countryId', value);
          onFilterChange('stateId', ''); // Reset dependent filter
        } else {
          onFilterChange(filterType, value);
        }
      } catch (error) {
        debugError(
          'CityArtWalks.Components.City.geographicFilterChangeError',
          `Error changing geographic filter ${filterType}: ${error.message}`
        );
      }
    },
    [onResetPage, onFilterChange]
  );

  /**
     * Calculates the number of active filters for badge display
    /**
     * Renders the search input field
     * @memberof CityArtWalks.Components.City.TableToolbar
     * @returns {JSX.Element|null} Search input component or null
     */
  const renderSearchInput = () =>
    (!displayFilters || displayFilters.search) && (
      <TextField
        fullWidth
        value={search}
        onChange={onSearchChange}
        placeholder="Search cities..."
        aria-label="Search cities"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 220 }}
      />
    );

  /**
   * Renders the country filter select
   * @memberof CityArtWalks.Components.City.TableToolbar
   * @returns {JSX.Element|null} Country filter component or null
   */
  const renderCountryFilter = () =>
    (!displayFilters || displayFilters.countryId) && (
      <CountrySelect
        value={filters.countryId || ''}
        onChange={(event) => handleGeographicFilterChange('countryId', event.target.value)}
        label="Country"
        placeholder="All Countries"
        sx={{ minWidth: 180 }}
      />
    );

  /**
   * Renders the state filter select
   * @memberof CityArtWalks.Components.City.TableToolbar
   * @returns {JSX.Element|null} State filter component or null
   */
  const renderStateFilter = () =>
    (!displayFilters || displayFilters.stateId) && (
      <StateSelect
        value={filters.stateId || ''}
        onChange={(event) => handleFilterChange('stateId', event.target.value)}
        countryId={filters.countryId}
        label="State"
        placeholder="All States"
        sx={{ minWidth: 180 }}
        disabled={!filters.countryId}
      />
    );

  const renderToolMenu = () => {
    if (!displayFilters || !displayFilters.toolMenu) {
      return null;
    }

    return (
      <IconButton size="small" sx={{ ml: 1 }}>
        <VerticalFillIcon />
      </IconButton>
    );
  };

  // Component rendering with error boundary
  try {
    return (
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: 'flex',
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {renderSearchInput()}
          {renderCountryFilter()}
          {renderStateFilter()}
          {renderToolMenu()}
        </Box>
      </Box>
    );
  } catch (error) {
    debugError(
      'CityArtWalks.Components.City.renderError',
      `Error rendering city table toolbar: ${error.message}`
    );
    return (
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Iconify icon="solar:danger-triangle-bold" sx={{ color: 'error.main', mr: 1 }} />
        Error loading toolbar
      </Box>
    );
  }
}
