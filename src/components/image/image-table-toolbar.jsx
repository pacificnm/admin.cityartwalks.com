/**
 * @file image-table-toolbar.jsx
 * @description Image table toolbar component with filtering and pagination
 * @namespace CityArtWalks.Components.Image.ImageTableToolbar
 * @version 1.0.0
 * @author Claude
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Filter-Components} - Filter documentation
 */

'use client';

import { usePopover } from 'minimal-shared/hooks';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { debugLog } from 'src/lib/debug';
import { useImageFilters } from 'src/actions/image/filters';
import { createFilterOptions } from 'src/actions/image/filter-options';

import { ChevronDownIcon } from 'src/components/icons';
import { TablePaginationCustom } from 'src/components/table';
import {
  ToolMenu,
  DateFilter,
  TabsFilter,
  ActionsMenu,
  FilterCounts,
  SearchFilter,
  BooleanFilter,
  NumberRangeFilter,
} from 'src/components/filters';

import { useAuthContext } from 'src/auth/hooks';

import { ImageTableFiltersResult } from './image-table-filters-result';

/**
 * @memberof CityArtWalks.Components.Image.ImageTableToolbar
 * @description Image Table Toolbar Component with comprehensive filtering capabilities.
 *
 * This component manages all its own state internally and accepts children to render different view types.
 * It handles filtering, pagination, search, and provides data to its children.
 * The component never rerenders from parent changes since it manages everything internally.
 *
 * Image-specific features:
 * - Image format filtering (JPEG, PNG, GIF, WebP, etc.)
 * - Image size categories (thumbnail, small, medium, large, extra_large)
 * - Aspect ratio filtering (square, widescreen, portrait, etc.)
 * - Image type classification (photograph, illustration, digital art, etc.)
 * - Content categorization (street art, sculpture, mural, etc.)
 * - Technical filters (resolution, color space, file size)
 * - Quality and compliance filters
 * - Upload and creation date filtering
 * - View and download count ranges
 *
 * @param {Object} props - Component props
 * @param {string} [props.viewType='explore'] - The view type for filter configuration ('explore', 'profile', 'admin')
 * @param {Object} [props.initialFilters={}] - Initial filters to apply (e.g., createdBy, status)
 * @param {React.ReactNode|Function} props.children - Content to render (can be component or render function)
 * @returns {JSX.Element} The image table toolbar component
 *
 * @example
 * // Basic usage with render function - profile view
 * <ImageTableToolbar viewType="profile">
 *   {({ images, loading, filters, onFilterChange }) => (
 *     <ImageTable images={images} loading={loading} />
 *   )}
 * </ImageTableToolbar>
 *
 * @example
 * // Admin view with full filtering capabilities
 * <ImageTableToolbar viewType="admin">
 *   {({ images, loading, error, paginationMeta }) => (
 *     <AdminImageGrid
 *       images={images}
 *       loading={loading}
 *       error={error}
 *       pagination={paginationMeta}
 *     />
 *   )}
 * </ImageTableToolbar>
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Toolbar-Guidelines} - Complete guidelines
 */
export const ImageTableToolbar = React.memo(function ImageTableToolbar({
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

  // Use the centralized image filters hook - all state is managed here
  const {
    images,
    imagesLoading,
    imagesError,
    paginationMeta,
    filters,
    page,
    rowsPerPage,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
    safeSearch,
    hasLoadedFromStorage,
  } = useImageFilters({
    initialFilters: {
      status: 'ACTIVE',
      ...initialFilters, // Merge passed filters
    },
    defaultRowsPerPage: 24,
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
      const saved = localStorage.getItem('imageFiltersExpanded');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // State to store geographic lookup data from LocationFilter
  const [geographicLookupData] = useState(() => ({
    countries: [],
    states: [],
    cities: [],
  }));

  // State to store selected image information for display in filter results
  const [selectedImageInfo, setSelectedImageInfo] = useState(null);

  // Save accordion state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('imageFiltersExpanded', JSON.stringify(filtersExpanded));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [filtersExpanded]);

  // Accordion toggle handler for filters
  const handleFiltersAccordionChange = useCallback((_, isExpanded) => {
    setFiltersExpanded(isExpanded);
  }, []);

  /**
   * Handles clearing all filters including image selection info
   */
  const handleClearFiltersWithReset = useCallback(() => {
    setSelectedImageInfo(null);
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

  // Enhanced filter options that include geographic lookup data and selected image info
  const enhancedFilterOptions = useMemo(
    () => ({
      ...geographicLookupData,
      images: selectedImageInfo
        ? [selectedImageInfo].filter(
            (image, index, arr) => arr.findIndex((i) => i.id === image.id) === index
          )
        : [],
    }),
    [geographicLookupData, selectedImageInfo]
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
              placeholder="Search images by title, description, tags..."
              ariaLabel="Search images"
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

        {/* Entity and featured filters row */}
        {(!displayFilters ||
          displayFilters.artistId ||
          displayFilters.artPieceId ||
          displayFilters.pathId ||
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

        {/* Date filters - creation and upload dates */}
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

        {(!displayFilters || displayFilters.uploadedAt) && (
          <DateFilter
            fromValue={filters.uploadedAtFrom || null}
            toValue={filters.uploadedAtTo || null}
            onFromChange={(value) => handleFilterChange('uploadedAtFrom', value)}
            onToChange={(value) => handleFilterChange('uploadedAtTo', value)}
            onClear={() => {
              handleFilterChange('uploadedAtFrom', null);
              handleFilterChange('uploadedAtTo', null);
            }}
            fromLabel="Uploaded From"
            toLabel="Uploaded To"
            fromAriaLabel="Filter by upload date from"
            toAriaLabel="Filter by upload date to"
            clearAriaLabel="Clear upload date filter"
          />
        )}

        {/* Analytics and engagement filters for admin view */}
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
      handleFilterChange,
    ]
  );

  // Show skeleton while loading IndexedDB or initial data (but not during filter changes)
  if (!hasLoadedFromStorage || (imagesLoading && (!images || images.length === 0))) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>Loading images...</Box>;
  }

  // Show error state
  if (imagesError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
        Error loading images: {imagesError.message}
      </Box>
    );
  }

  debugLog('ImageTableToolbar.render', 'Rendering with filters:', filters);

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

      {/* Filters Accordion */}
      <Accordion expanded={filtersExpanded} onChange={handleFiltersAccordionChange} sx={{ mb: 2 }}>
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
              <ImageTableFiltersResult
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
              images: images || [],
              loading: imagesLoading,
              error: imagesError,
              paginationMeta,
            })
          : children}
        {/* Show subtle loading indicator during filter changes */}
        {imagesLoading && images && images.length > 0 && (
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
          rowsPerPageOptions={[12, 24, 48, 96]}
        />
      </Box>
    </>
  );
});
