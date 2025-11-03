/**
 * @file artist-table-toolbar.jsx
 * @description Artist table toolbar component with filtering, search, pagination, and data management
 * @namespace CityArtWalks.Components.Artist.ArtistTableToolbar
 * @version 3.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

'use client';

import PropTypes from 'prop-types';
import { usePopover } from 'minimal-shared/hooks';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { debugLog } from 'src/lib/debug';
import { useArtistFilters } from 'src/actions/artist/filters';
import { createFilterOptions } from 'src/actions/artist/filter-options';

import { ChevronDownIcon } from 'src/components/icons';
import { TablePaginationCustom } from 'src/components/table';
import {
  ToolMenu,
  TabsFilter,
  DateFilter,
  ActionsMenu,
  SearchFilter,
  FilterCounts,
  BooleanFilter,
  LocationFilter,
  NumberRangeFilter,
} from 'src/components/filters';

import { useAuthContext } from 'src/auth/hooks';

import { ArtistFiltersSkeleton } from './artist-filters-skeleton';
import { ArtistTableFiltersResult } from './artist-table-filters-result';

/**
 * Artist Table Toolbar Component that manages filtering, search, pagination, and data loading.
 * This component handles all state internally and provides data to children via render props or direct rendering.
 * Features include geographic filters, search, status tabs, date ranges, and persistent filter state.
 *
 * @function ArtistTableToolbar
 * @memberof CityArtWalks.Components.Artist.ArtistTableToolbar
 * @param {Object} props - Component props
 * @param {string} [props.viewType='explore'] - View type for filter configuration ('explore', 'admin', 'profile')
 * @param {Object} [props.initialFilters={}] - Initial filter values to override defaults
 * @param {React.ReactNode|Function} props.children - Content to render (component or render function)
 * @returns {JSX.Element} The artist table toolbar with filters, search, and data management
 *
 * @example
 * // Basic usage with render function
 * <ArtistTableToolbar viewType="explore">
 *   {({ artists, loading, error, paginationMeta }) => (
 *     <ArtistCardList artists={artists} loading={loading} />
 *   )}
 * </ArtistTableToolbar>
 *
 * @example
 * // Admin view with custom initial filters
 * <ArtistTableToolbar
 *   viewType="admin"
 *   initialFilters={{ status: 'PENDING', featured: true }}
 * >
 *   {({ artists, loading }) => <ArtistTable artists={artists} />}
 * </ArtistTableToolbar>
 *
 * @description Features:
 * - Comprehensive filtering (location, status, dates, view counts)
 * - Search functionality with debouncing
 * - Persistent filter state via localStorage and IndexedDB
 * - Status tabs for different view types
 * - Responsive design with accordion-based filter organization
 * - Loading states and error handling
 * - Pagination with customizable page sizes
 */
export const ArtistTableToolbar = React.memo(function ArtistTableToolbar({
  viewType = 'explore',
  initialFilters = {},
  children,
}) {
  const { accessToken } = useAuthContext();

  // Get filter configuration based on view type
  const { displayFilters, tabOptions, getStatusColor } = useMemo(
    () =>
      createFilterOptions({
        viewType,
      }),
    [viewType]
  );

  // Check if any filters should be displayed
  const hasAnyFiltersEnabled = useMemo(() => {
    if (!displayFilters) return true; // Show filters if displayFilters is undefined
    return Object.values(displayFilters).some((filterEnabled) => filterEnabled === true);
  }, [displayFilters]);

  // Use the centralized artist filters hook - all state is managed here
  const {
    artists,
    artistsLoading,
    artistsError,
    paginationMeta,
    filters,
    page,
    rowsPerPage,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handleLocationSelect,
    handlePageChange,
    handleRowsPerPageChange,
    safeSearch,
    hasLoadedFromStorage,
  } = useArtistFilters({
    initialFilters: {
      ...(viewType === 'explore' ? { status: 'ACTIVE' } : {}),
      ...initialFilters,
    },
    defaultRowsPerPage: 12,
    accessToken: accessToken ?? '',
    autoGeoLocation: true, // Always auto-apply location to match art piece behavior
    viewType, // Pass viewType for IndexedDB storage key
    persistFilters: true, // Keep persisted filters behavior by default
  });

  // Action menu popover state
  const menuActions = usePopover();

  // Accordion state for filters with localStorage persistence
  const [filtersExpanded, setFiltersExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('artistFiltersExpanded');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // State to store geographic lookup data from LocationFilter
  const [geographicLookupData, setGeographicLookupData] = useState({
    countries: [],
    states: [],
    cities: [],
  });

  // State to store selected artist information for display in filter results
  const [selectedArtistInfo, setSelectedArtistInfo] = useState(null);

  // Save accordion state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('artistFiltersExpanded', JSON.stringify(filtersExpanded));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [filtersExpanded]);

  // Accordion toggle handler for filters
  const handleFiltersAccordionChange = useCallback((_, isExpanded) => {
    setFiltersExpanded(isExpanded);
  }, []);

  /**
   * Handles cascading geographic filter changes with dependent filter reset.
   * When a higher-level location filter changes, resets dependent filters to maintain data consistency.
   *
   * @function handleGeographicFilterChange
   * @memberof CityArtWalks.Components.Artist.ArtistTableToolbar
   * @param {string} filterType - The type of geographic filter ('countryId', 'stateId', 'cityId')
   * @param {string|number} value - The new filter value
   *
   * @example
   * // When country changes, state and city are reset
   * handleGeographicFilterChange('countryId', 'USA');
   * // Results in: countryId='USA', stateId='', cityId=''
   */
  const handleGeographicFilterChange = useCallback(
    (filterType, value) => {
      if (filterType === 'countryId') {
        handleFilterChange('countryId', value);
        handleFilterChange('stateId', ''); // Reset dependent filters
        handleFilterChange('cityId', '');
      } else if (filterType === 'stateId') {
        handleFilterChange('stateId', value);
        handleFilterChange('cityId', ''); // Reset dependent filter
      } else {
        handleFilterChange(filterType, value);
      }
    },
    [handleFilterChange]
  );

  /**
   * Handles clearing all filters and resetting component state.
   * Clears artist selection info, collapses filter accordion, and resets all filter values.
   *
   * @function handleClearFiltersWithReset
   * @memberof CityArtWalks.Components.Artist.ArtistTableToolbar
   *
   * @example
   * // Called from clear filters button or actions menu
   * handleClearFiltersWithReset();
   * // Results in: all filters reset, accordion collapsed, selection cleared
   */
  const handleClearFiltersWithReset = useCallback(() => {
    setSelectedArtistInfo(null);
    setFiltersExpanded(false);
    handleClearFilters();
  }, [handleClearFilters]);

  /**
   * Handles status tab changes for admin and profile views.
   * Updates the status filter when user clicks on different status tabs.
   *
   * @function handleTabChange
   * @memberof CityArtWalks.Components.Artist.ArtistTableToolbar
   * @param {Event} event - The tab change event
   * @param {string} newValue - The new status value ('all', 'ACTIVE', 'PENDING', etc.)
   *
   * @example
   * // When user clicks "Active" tab
   * handleTabChange(event, 'ACTIVE');
   * // Results in: filters.status = 'ACTIVE'
   */
  const handleTabChange = useCallback(
    (event, newValue) => {
      handleFilterChange('status', newValue);
    },
    [handleFilterChange]
  );

  /**
   * Enhanced location select handler that captures and stores geographic lookup data.
   * Updates both the filter state and geographic lookup data for enhanced filter options.
   *
   * @function handleLocationSelectWithData
   * @memberof CityArtWalks.Components.Artist.ArtistTableToolbar
   * @param {string} locationType - Type of location selected ('country', 'state', 'city')
   * @param {Object} locationData - The selected location data object
   * @param {Object} [lookupData] - Additional geographic lookup data from the API
   * @param {Array} [lookupData.countries] - Available countries list
   * @param {Array} [lookupData.states] - Available states list for selected country
   * @param {Array} [lookupData.cities] - Available cities list for selected state
   *
   * @example
   * // When user selects a state from dropdown
   * handleLocationSelectWithData('state', { stateId: 'CA', name: 'California' }, {
   *   countries: [...], states: [...], cities: [...]
   * });
   */
  const handleLocationSelectWithData = useCallback(
    (locationType, locationData, lookupData) => {
      if (lookupData) {
        setGeographicLookupData(lookupData);
      }
      if (handleLocationSelect) {
        handleLocationSelect(locationType, locationData);
      }
    },
    [handleLocationSelect]
  );

  /**
   * Calculates the number of active filters for badge display and UI feedback.
   * Excludes certain filters (search, createdBy, status) from the count and handles empty values.
   *
   * @function getActiveFilterCount
   * @memberof CityArtWalks.Components.Artist.ArtistTableToolbar
   * @returns {number} The total count of active filters including search
   *
   * @description Counting logic:
   * - Excludes: search, createdBy, status filters from main count
   * - Ignores: empty strings, 'all' values, zero values
   * - Includes: search as separate count if not empty
   * - Returns: sum of filter count + search count
   *
   * @example
   * // With filters: { countryId: 'USA', featured: true, status: 'ACTIVE' }
   * // and search: 'picasso'
   * getActiveFilterCount(); // Returns 3 (countryId + featured + search)
   */
  const getActiveFilterCount = useCallback(() => {
    const filterCount = Object.entries(filters).filter(([key, value]) => {
      if (key === 'search') return false;
      if (key === 'createdBy') return false;
      if (key === 'status') return false;
      if (!value) return false;
      if (value === '' || value === 'all' || value === 0) return false;
      return true;
    }).length;

    const searchCount = safeSearch && safeSearch.trim().length > 0 ? 1 : 0;
    return filterCount + searchCount;
  }, [filters, safeSearch]);

  const activeFilterCount = getActiveFilterCount();
  const hasActiveFilters = activeFilterCount > 0 || (safeSearch && safeSearch.trim().length > 0);

  // Enhanced filter options that include geographic lookup data and selected artist info
  const enhancedFilterOptions = useMemo(
    () => ({
      ...geographicLookupData,
      artists: selectedArtistInfo
        ? [selectedArtistInfo].filter(
            (artist, index, arr) => arr.findIndex((a) => a.id === artist.id) === index
          )
        : [],
    }),
    [geographicLookupData, selectedArtistInfo]
  );

  // Render filter content - memoized for performance
  const renderFilterContent = useMemo(
    () => (
      <Box
        sx={{
          gap: 1.5,
          flexGrow: 1,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          width: { xs: '100%', md: 'auto' },
        }}
      >
        {/* Search and Tool Menu Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 1.5,
          }}
        >
          {/* Search Input */}
          {(!displayFilters || displayFilters.search) && (
            <SearchFilter
              value={safeSearch || ''}
              onChange={handleSearchChange}
              placeholder="Search artists by name, bio, location..."
              ariaLabel="Search artists"
              sx={{ flexGrow: 1 }}
            />
          )}

          {/* Action Menu */}
          {(!displayFilters || displayFilters.toolMenu) && (
            <ToolMenu
              onClick={menuActions.onOpen}
              activeFilterCount={activeFilterCount}
              ariaLabel="Open action menu"
            />
          )}
        </Box>

        {/* Location Filters and Featured Filter Row */}
        {(!displayFilters ||
          displayFilters.countryId ||
          !displayFilters ||
          displayFilters.stateId ||
          !displayFilters ||
          displayFilters.cityId ||
          !displayFilters ||
          displayFilters.featured) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: 1.5,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            {/* Location Filters */}
            {(!displayFilters ||
              displayFilters.countryId ||
              !displayFilters ||
              displayFilters.stateId ||
              !displayFilters ||
              displayFilters.cityId) && (
              <LocationFilter
                filters={filters}
                onFilterChange={handleGeographicFilterChange}
                displayFilters={displayFilters}
                accessToken={accessToken ?? ''}
                onLocationSelect={handleLocationSelectWithData}
              />
            )}

            {/* Featured Filter */}
            {(!displayFilters || displayFilters.featured) && (
              <BooleanFilter
                value={filters.featured || false}
                onChange={(checked) => handleFilterChange('featured', checked)}
                onClear={() => handleFilterChange('featured', false)}
                label="Featured"
                ariaLabel="Filter by featured items"
                clearAriaLabel="Clear featured filter"
                color="info"
              />
            )}
          </Box>
        )}

        {/* Creation Date Range Filter */}
        {(!displayFilters || displayFilters.creationDate) && (
          <DateFilter
            fromValue={filters.creationDateFrom || null}
            toValue={filters.creationDateTo || null}
            onFromChange={(value) => handleFilterChange('creationDateFrom', value)}
            onToChange={(value) => handleFilterChange('creationDateTo', value)}
            onClear={() => {
              handleFilterChange('creationDateFrom', null);
              handleFilterChange('creationDateTo', null);
            }}
            fromLabel="Created From"
            toLabel="Created To"
            fromAriaLabel="Filter by creation date from"
            toAriaLabel="Filter by creation date to"
            clearAriaLabel="Clear creation date filter"
          />
        )}

        {/* Installation Date Range Filter */}
        {(!displayFilters || displayFilters.installationDate) && (
          <DateFilter
            fromValue={filters.installationDateFrom || null}
            toValue={filters.installationDateTo || null}
            onFromChange={(value) => handleFilterChange('installationDateFrom', value)}
            onToChange={(value) => handleFilterChange('installationDateTo', value)}
            onClear={() => {
              handleFilterChange('installationDateFrom', null);
              handleFilterChange('installationDateTo', null);
            }}
            fromLabel="Installed From"
            toLabel="Installed To"
            fromAriaLabel="Filter by installation date from"
            toAriaLabel="Filter by installation date to"
            clearAriaLabel="Clear installation date filter"
          />
        )}

        {/* View Count Range Filter */}
        {(!displayFilters || displayFilters.viewCount) && (
          <NumberRangeFilter
            minValue={filters.minViewCount || ''}
            maxValue={filters.maxViewCount || ''}
            onMinChange={(value) => handleFilterChange('minViewCount', value)}
            onMaxChange={(value) => handleFilterChange('maxViewCount', value)}
            onClear={() => {
              handleFilterChange('minViewCount', '');
              handleFilterChange('maxViewCount', '');
            }}
            minLabel="Min Views"
            maxLabel="Max Views"
            minAriaLabel="Minimum view count filter"
            maxAriaLabel="Maximum view count filter"
            clearAriaLabel="Clear view count filter"
          />
        )}
      </Box>
    ),
    [
      displayFilters,
      safeSearch,
      handleSearchChange,
      menuActions,
      activeFilterCount,
      filters,
      handleGeographicFilterChange,
      accessToken,
      handleLocationSelectWithData,
      handleFilterChange,
    ]
  );

  // Show skeleton while loading IndexedDB or initial data (but not during filter changes)
  if (!hasLoadedFromStorage || (artistsLoading && (!artists || artists.length === 0))) {
    return <ArtistFiltersSkeleton expanded={filtersExpanded} />;
  }

  // Show error state
  if (artistsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
        Error loading artists: {artistsError.message}
      </Box>
    );
  }

  debugLog('ArtistTableToolbar.render', 'Rendering with filters:', {
    filters,
    viewType,
    totalCount: paginationMeta?.total,
    rowsPerPage,
    page,
  });

  return (
    <>
      {/* Status Tabs - Show for profile and admin views */}
      {(viewType === 'profile' || viewType === 'admin') && tabOptions && (
        <TabsFilter
          value={filters.status || 'all'}
          onChange={handleTabChange}
          tabOptions={tabOptions}
          getStatusColor={getStatusColor}
          totalCount={paginationMeta?.total || 0}
          sx={{ mb: 2 }}
        />
      )}

      {/* Filters Accordion - Only show if any filters are enabled */}
      {hasAnyFiltersEnabled && (
        <Accordion
          expanded={filtersExpanded}
          onChange={handleFiltersAccordionChange}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ChevronDownIcon />}
            aria-controls="filters-content"
            id="filters-header"
          >
            <FilterCounts title="Search & Filters" activeFilterCount={activeFilterCount} />
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilterContent}

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <ArtistTableFiltersResult
                  filters={filters}
                  totalResults={paginationMeta?.total || 0}
                  onClearFilters={handleClearFiltersWithReset}
                  onFilterChange={handleFilterChange}
                  search={safeSearch}
                  displayFilters={displayFilters}
                  filterOptions={enhancedFilterOptions}
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Actions Menu */}
      <ActionsMenu
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        onClearFilters={handleClearFiltersWithReset}
        activeFilterCount={activeFilterCount}
      />

      {/* Content Area - children with loading state overlay */}
      <Box sx={{ position: 'relative' }}>
        {typeof children === 'function'
          ? children({
              artists: artists || [],
              loading: artistsLoading,
              error: artistsError,
              paginationMeta,
            })
          : children}
        {/* Show subtle loading indicator during filter changes */}
        {artistsLoading && artists && artists.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              bgcolor: 'primary.main',
              opacity: 0.8,
              borderRadius: 1,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        )}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TablePaginationCustom
          count={paginationMeta?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[6, 12, 24, 48]}
        />
      </Box>
    </>
  );
});

/**
 * PropTypes for ArtistTableToolbar component
 * @memberof CityArtWalks.Components.Artist.ArtistTableToolbar
 */
ArtistTableToolbar.propTypes = {
  /**
   * View type for filter configuration ('explore', 'admin', 'profile')
   */
  viewType: PropTypes.oneOf(['explore', 'admin', 'profile']),

  /**
   * Initial filter values to override defaults
   */
  initialFilters: PropTypes.object,

  /**
   * Content to render (component or render function)
   */
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};
