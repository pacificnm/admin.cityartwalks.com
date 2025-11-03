'use client';

import { usePopover } from 'minimal-shared/hooks';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { debugLog } from 'src/lib/debug';
import { useArtPieceFilters } from 'src/actions/art-piece/filters';
import { createFilterOptions } from 'src/actions/art-piece/filter-options';

import { ChevronDownIcon } from 'src/components/icons';
import { TablePaginationCustom } from 'src/components/table';
import {
  ToolMenu,
  TabsFilter,
  DateFilter,
  ActionsMenu,
  ArtistFilter,
  SearchFilter,
  FilterCounts,
  BooleanFilter,
  LocationFilter,
  NumberRangeFilter,
} from 'src/components/filters';

import { useAuthContext } from 'src/auth/hooks';

import { ArtPieceFiltersSkeleton } from './art-piece-filters-skeleton';
import { ArtPieceTableFiltersResult } from './art-piece-table-filters-result';

/**
 * ArtPiece Table Toolbar Component
 *
 * This component manages all its own state internally and accepts children to render different view types.
 * It handles filtering, pagination, search, and provides data to its children.
 * The component never rerenders from parent changes since it manages everything internally.
 *
 * @param {Object} props
 * @param {string} props.viewType - The view type for filter configuration ('explore', 'home', etc.)
 * @param {Object} props.initialFilters - Custom initial filters to override defaults
 * @param {React.ReactNode|Function} props.children - Content to render (can be component or render function)
 */
export const ArtPieceTableToolbar = React.memo(function ArtPieceTableToolbar({
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

  // Use the centralized art piece filters hook - all state is managed here
  const {
    artPieces,
    artPiecesLoading,
    artPiecesError,
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
    location,
    mapCenter,
  } = useArtPieceFilters({
    initialFilters: {
      status: 'ACTIVE',
      ...initialFilters,
    },
    defaultRowsPerPage: 12,
    accessToken: accessToken ?? '',
    autoGeoLocation: true,
    viewType, // Pass viewType for IndexedDB storage key
    persistFilters: true, // Enable filter persistence
  });

  // Action menu popover state
  const menuActions = usePopover();

  // Accordion state for filters with localStorage persistence
  const [filtersExpanded, setFiltersExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('artPieceFiltersExpanded');
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
      localStorage.setItem('artPieceFiltersExpanded', JSON.stringify(filtersExpanded));
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
   * Handles artist filter changes with additional artist information storage
   */
  const handleArtistFilterChange = useCallback(
    (key, value, artistInfo = null) => {
      setSelectedArtistInfo(artistInfo);
      handleFilterChange(key, value);
    },
    [handleFilterChange]
  );

  /**
   * Handles clearing all filters including artist selection info
   */
  const handleClearFiltersWithReset = useCallback(() => {
    setSelectedArtistInfo(null);
    setFiltersExpanded(false);
    handleClearFilters();
  }, [handleClearFilters]);

  /**
   * Handles status tab changes
   */
  const handleTabChange = useCallback(
    (_, newValue) => {
      handleFilterChange('status', newValue);
    },
    [handleFilterChange]
  );

  /**
   * Enhanced location select handler that captures geographic data
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
              placeholder="Search art pieces by title, artist, location..."
              ariaLabel="Search art pieces"
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

        {/* Artist Filter */}
        {(!displayFilters || displayFilters.artistId) && (
          <ArtistFilter
            value={filters.artistId || ''}
            onChange={handleArtistFilterChange}
            artists={enhancedFilterOptions.artists}
          />
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
      handleArtistFilterChange,
      enhancedFilterOptions.artists,
    ]
  );

  // Show skeleton while loading IndexedDB or initial data (but not during filter changes)
  if (!hasLoadedFromStorage || (artPiecesLoading && (!artPieces || artPieces.length === 0))) {
    return <ArtPieceFiltersSkeleton expanded={filtersExpanded} />;
  }

  // Show error state
  if (artPiecesError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
        Error loading art pieces: {artPiecesError.message}
      </Box>
    );
  }

  debugLog('ArtPieceTableToolbar.render', 'Rendering with filters:', filters);

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
                <ArtPieceTableFiltersResult
                  filters={filters}
                  totalResults={paginationMeta?.total || 0}
                  onClearFilters={handleClearFiltersWithReset}
                  onFilterChange={handleFilterChange}
                  search={safeSearch}
                  displayFilters={displayFilters}
                  filterOptions={enhancedFilterOptions}
                  location={location}
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
              artPieces: artPieces || [],
              loading: artPiecesLoading,
              error: artPiecesError,
              paginationMeta,
              location,
              mapCenter,
            })
          : children}
        {/* Show subtle loading indicator during filter changes */}
        {artPiecesLoading && artPieces && artPieces.length > 0 && (
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
