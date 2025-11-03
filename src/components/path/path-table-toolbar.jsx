/**
 * @namespace CityArtWalks.Components.Path.PathTableToolbar
 * @version 2.0.0
 * @author jaimie garner
 */

'use client';

import { usePopover } from 'minimal-shared/hooks';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { debugLog } from 'src/lib/debug';
import { usePathFilters } from 'src/actions/path/filters';
import { createFilterOptions } from 'src/actions/path/filter-options';

import { ChevronDownIcon } from 'src/components/icons';
import { TablePaginationCustom } from 'src/components/table';
import {
  ToolMenu,
  DateFilter,
  TabsFilter,
  ActionsMenu,
  FilterCounts,
  SearchFilter,
  SelectFilter,
  BooleanFilter,
  LocationFilter,
  NumberRangeFilter,
} from 'src/components/filters';

import { useAuthContext } from 'src/auth/hooks';

import { PathFiltersSkeleton } from './path-filters-skeleton';
import { PathTableFiltersResult } from './path-table-filters-result';

/**
 * Path Table Toolbar Component
 *
 * This component manages all its own state internally and accepts children to render different view types.
 * It handles filtering, pagination, search, and provides data to its children.
 * The component never rerenders from parent changes since it manages everything internally.
 *
 * @param {Object} props - Component props
 * @param {string} [props.viewType='explore'] - The view type for filter configuration ('explore', 'admin', etc.)
 * @param {Object} [props.initialFilters={}] - Custom initial filters to override defaults
 * @param {React.ReactNode|Function} props.children - Content to render (can be component or render function)
 * @returns {JSX.Element} The path table toolbar component
 *
 * @example
 * // Basic usage with render function
 * <PathTableToolbar viewType="explore">
 *   {({ paths, loading, filters, onFilterChange }) => (
 *     <PathTable paths={paths} loading={loading} />
 *   )}
 * </PathTableToolbar>
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Toolbar-Guidelines} - Complete guidelines
 */
export const PathTableToolbar = React.memo(function PathTableToolbar({
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

  // Use the centralized path filters hook - all state is managed here
  const {
    paths,
    pathsLoading,
    pathsError,
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
  } = usePathFilters({
    initialFilters: {
      status: 'ACTIVE',
      ...initialFilters,
    },
    defaultRowsPerPage: 12,
    accessToken: accessToken ?? '',
    autoGeoLocation: viewType !== 'profile', // Disable autoGeoLocation for profile view
    viewType,
    persistFilters: true,
  });

  // Action menu popover state
  const menuActions = usePopover();

  // Accordion state for filters with localStorage persistence
  const [filtersExpanded, setFiltersExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('pathFiltersExpanded');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // State to store geographic lookup data from LocationFilter
  const [geographicLookupData, setGeographicLookupData] = useState(() => ({
    countries: [],
    states: [],
    cities: [],
  }));

  // State to store selected path information for display in filter results
  const [selectedPathInfo, setSelectedPathInfo] = useState(null);

  // Save accordion state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('pathFiltersExpanded', JSON.stringify(filtersExpanded));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [filtersExpanded]);

  // Accordion toggle handler for filters
  const handleFiltersAccordionChange = useCallback((_, isExpanded) => {
    setFiltersExpanded(isExpanded);
  }, []);

  /**
   * Handles cascading geographic filter changes
   */
  const handleGeographicFilterChange = useCallback(
    (filterType, value) => {
      if (filterType === 'countryId') {
        handleFilterChange('countryId', value);
        handleFilterChange('stateId', '');
        handleFilterChange('cityId', '');
      } else if (filterType === 'stateId') {
        handleFilterChange('stateId', value);
        handleFilterChange('cityId', '');
      } else if (filterType === 'cityId') {
        handleFilterChange('cityId', value);
      }
    },
    [handleFilterChange]
  );

  /**
   * Handles clearing all filters including path selection info
   */
  const handleClearFiltersWithReset = useCallback(() => {
    setSelectedPathInfo(null);
    setFiltersExpanded(false);
    handleClearFilters();
  }, [handleClearFilters]);

  /**
   * Handles status tab changes
   */
  const handleTabChange = useCallback(
    (_event, newValue) => {
      handleFilterChange('status', newValue);
    },
    [handleFilterChange]
  );

  /**
   * Enhanced location select handler that captures geographic data
   */
  const handleLocationSelectWithData = useCallback(
    (locationType, locationData, lookupData) => {
      if (
        lookupData &&
        (lookupData.countries?.length > 0 ||
          lookupData.states?.length > 0 ||
          lookupData.cities?.length > 0)
      ) {
        setGeographicLookupData(lookupData);
      }
      if (handleLocationSelect) {
        handleLocationSelect(locationType, locationData);
      }
    },
    [handleLocationSelect]
  );

  /**
   * Calculates the number of active filters for badge display
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

  // Enhanced filter options that include geographic lookup data and selected path info
  const enhancedFilterOptions = useMemo(
    () => ({
      ...geographicLookupData,
      paths: selectedPathInfo
        ? [selectedPathInfo].filter(
            (path, index, arr) => arr.findIndex((p) => p.id === path.id) === index
          )
        : [],
    }),
    [geographicLookupData, selectedPathInfo]
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
        {/* Search and tool menu row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 1.5,
          }}
        >
          {/* Search Filter */}
          {(!displayFilters || displayFilters.search) && (
            <SearchFilter
              value={safeSearch || ''}
              onChange={handleSearchChange}
              placeholder="Search paths by title, description, location..."
              ariaLabel="Search paths"
              sx={{ flexGrow: 1 }}
            />
          )}

          {/* Tool Menu */}
          {(!displayFilters || displayFilters.toolMenu) && (
            <ToolMenu
              onClick={menuActions.onOpen}
              activeFilterCount={activeFilterCount}
              ariaLabel="Open action menu"
            />
          )}
        </Box>

        {/* Geographic and path type filters row */}
        {(!displayFilters ||
          displayFilters.countryId ||
          displayFilters.stateId ||
          displayFilters.cityId ||
          displayFilters.pathType ||
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
              displayFilters.stateId ||
              displayFilters.cityId) && (
              <LocationFilter
                filters={filters}
                onFilterChange={handleGeographicFilterChange}
                displayFilters={displayFilters}
                accessToken={accessToken ?? ''}
                onLocationSelect={handleLocationSelectWithData}
              />
            )}

            {/* Path Type Filter */}
            {(!displayFilters || displayFilters.pathType) && (
              <SelectFilter
                value={filters.pathType || ''}
                onChange={(value) => handleFilterChange('pathType', value)}
                onClear={() => handleFilterChange('pathType', '')}
                options={[
                  { value: 'WALKING', label: 'Walking' },
                  { value: 'CYCLING', label: 'Cycling' },
                  { value: 'DRIVING', label: 'Driving' },
                  { value: 'PUBLIC_TRANSPORT', label: 'Public Transport' },
                ]}
                label="Path Type"
                placeholder="Select path type"
                ariaLabel="Filter by path type"
                clearAriaLabel="Clear path type filter"
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

        {/* Date filters - only show if enabled */}
        {(!displayFilters || displayFilters.createdAt) && (
          <DateFilter
            fromValue={filters.createdAtFrom || null}
            toValue={filters.createdAtTo || null}
            onFromChange={(value) => handleFilterChange('createdAtFrom', value)}
            onToChange={(value) => handleFilterChange('createdAtTo', value)}
            onClear={() => {
              handleFilterChange('createdAtFrom', null);
              handleFilterChange('createdAtTo', null);
            }}
            fromLabel="Created From"
            toLabel="Created To"
            fromAriaLabel="Filter by creation date from"
            toAriaLabel="Filter by creation date to"
            clearAriaLabel="Clear creation date filter"
          />
        )}

        {/* Distance and Duration filters for admin view */}
        {(!displayFilters || displayFilters.distance) && (
          <NumberRangeFilter
            minValue={filters.minDistance || ''}
            maxValue={filters.maxDistance || ''}
            onMinChange={(value) => handleFilterChange('minDistance', value)}
            onMaxChange={(value) => handleFilterChange('maxDistance', value)}
            onClear={() => {
              handleFilterChange('minDistance', '');
              handleFilterChange('maxDistance', '');
            }}
            minLabel="Min Distance (km)"
            maxLabel="Max Distance (km)"
            minAriaLabel="Minimum distance filter"
            maxAriaLabel="Maximum distance filter"
            clearAriaLabel="Clear distance filter"
          />
        )}

        {(!displayFilters || displayFilters.duration) && (
          <NumberRangeFilter
            minValue={filters.minDuration || ''}
            maxValue={filters.maxDuration || ''}
            onMinChange={(value) => handleFilterChange('minDuration', value)}
            onMaxChange={(value) => handleFilterChange('maxDuration', value)}
            onClear={() => {
              handleFilterChange('minDuration', '');
              handleFilterChange('maxDuration', '');
            }}
            minLabel="Min Duration (min)"
            maxLabel="Max Duration (min)"
            minAriaLabel="Minimum duration filter"
            maxAriaLabel="Maximum duration filter"
            clearAriaLabel="Clear duration filter"
          />
        )}

        {/* View count filter - only show if enabled */}
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
      menuActions.onOpen,
      activeFilterCount,
      filters,
      handleGeographicFilterChange,
      accessToken,
      handleLocationSelectWithData,
      handleFilterChange,
    ]
  );

  // Show skeleton while loading IndexedDB or initial data (but not during filter changes)
  if (!hasLoadedFromStorage || (pathsLoading && (!paths || paths.length === 0))) {
    return <PathFiltersSkeleton expanded={filtersExpanded} />;
  }

  // Show error state
  if (pathsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
        Error loading paths: {pathsError.message}
      </Box>
    );
  }

  debugLog('PathTableToolbar.render', 'Rendering with filters:', filters);

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
                <PathTableFiltersResult
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
              paths: paths || [],
              loading: pathsLoading,
              error: pathsError,
              paginationMeta,
            })
          : children}
        {/* Show subtle loading indicator during filter changes */}
        {pathsLoading && paths && paths.length > 0 && (
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
