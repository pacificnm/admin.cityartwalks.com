/**
 * @namespace CityArtWalks.Components.Review.ReviewTableToolbar
 * @version 2.0.0
 * @author jaimie garner
 */

'use client';

import { usePopover } from 'minimal-shared/hooks';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { debugLog } from 'src/lib/debug';
import { useReviewFilters } from 'src/actions/review/filters';
import { createFilterOptions } from 'src/actions/review/filter-options';

import { ChevronDownIcon } from 'src/components/icons';
import { TablePaginationCustom } from 'src/components/table';
import {
  ToolMenu,
  TabsFilter,
  DateFilter,
  ActionsMenu,
  SearchFilter,
  FilterCounts,
} from 'src/components/filters';

import { useAuthContext } from 'src/auth/hooks';

import { ReviewFiltersSkeleton } from './review-skeletons';
import { ReviewTableFiltersResult } from './review-table-filters-result';

/**
 * Review Table Toolbar Component
 *
 * This component manages all its own state internally and accepts children to render different view types.
 * It handles filtering, pagination, search, and provides data to its children.
 * The component never rerenders from parent changes since it manages everything internally.
 *
 * @param {Object} props - Component props
 * @param {string} [props.viewType='public'] - The view type for filter configuration ('public', 'profile', 'moderation', 'admin')
 * @param {Object} [props.initialFilters={}] - Custom initial filters to override defaults
 * @param {boolean} [props.persistFilters=true] - Whether to persist filters to storage
 * @param {React.ReactNode|Function} props.children - Content to render (can be component or render function)
 * @returns {JSX.Element} The review table toolbar component
 *
 * @example
 * // Basic usage with render function
 * <ReviewTableToolbar viewType="public">
 *   {({ reviews, loading, filters, onFilterChange }) => (
 *     <ReviewTable reviews={reviews} loading={loading} />
 *   )}
 * </ReviewTableToolbar>
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Toolbar-Guidelines} - Complete guidelines
 */
export const ReviewTableToolbar = React.memo(function ReviewTableToolbar({
  viewType = 'public',
  initialFilters = {},
  persistFilters = true,
  children,
}) {
  const { accessToken } = useAuthContext();

  // Get filter configuration based on view type
  const { displayFilters, tabOptions, getStatusColor, getRatingColor } = useMemo(
    () =>
      createFilterOptions({
        viewType,
      }),
    [viewType]
  );

  // Use the centralized review filters hook - all state is managed here
  const {
    reviews,
    reviewsLoading,
    reviewsError,
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
    mutate: mutateReviews,
  } = useReviewFilters({
    initialFilters: {
      ...(viewType === 'public' ? { status: 'ACTIVE' } : {}),
      ...initialFilters,
    },
    defaultRowsPerPage: 12,
    accessToken: accessToken ?? '',
    viewType, // Pass viewType for IndexedDB storage key
    persistFilters, // Use the passed persistFilters prop
  });

  // Action menu popover state
  const menuActions = usePopover();

  // Accordion state for filters with localStorage persistence
  const [filtersExpanded, setFiltersExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('reviewFiltersExpanded');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Save accordion state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('reviewFiltersExpanded', JSON.stringify(filtersExpanded));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [filtersExpanded]);

  // Accordion toggle handler for filters
  const handleFiltersAccordionChange = useCallback((_, isExpanded) => {
    setFiltersExpanded(isExpanded);
  }, []);

  /**
   * Handles clearing all filters
   */
  const handleClearFiltersWithReset = useCallback(() => {
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
   * Calculates the number of active filters for badge display
   */
  const getActiveFilterCount = useCallback(() => {
    const filterCount = Object.entries(filters).filter(([key, value]) => {
      if (key === 'search') return false;
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
              placeholder="Search reviews by comment, reviewer, entity..."
              ariaLabel="Search reviews"
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

        {/* Rating and Entity Type Filters Row */}
        {(!displayFilters || displayFilters.rating || displayFilters.entityType) && (
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
            {/* Rating Filter */}
            {(!displayFilters || displayFilters.rating) && (
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={filters.rating || ''}
                  onChange={(event) => handleFilterChange('rating', event.target.value)}
                  label="Rating"
                  aria-label="Filter by rating"
                >
                  <MenuItem value="">All Ratings</MenuItem>
                  <MenuItem value="5">5 Stars</MenuItem>
                  <MenuItem value="4-plus">4+ Stars</MenuItem>
                  <MenuItem value="3-plus">3+ Stars</MenuItem>
                  <MenuItem value="2-plus">2+ Stars</MenuItem>
                  <MenuItem value="1">1 Star</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Entity Type Filter */}
            {(!displayFilters || displayFilters.entityType) && (
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value={filters.entityType || ''}
                  onChange={(event) => handleFilterChange('entityType', event.target.value)}
                  label="Entity Type"
                  aria-label="Filter by entity type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="ARTIST">Artists</MenuItem>
                  <MenuItem value="ART_PIECE">Art Pieces</MenuItem>
                  <MenuItem value="IMAGE">Images</MenuItem>
                  <MenuItem value="PATH">Paths</MenuItem>
                  <MenuItem value="PATH_MAP">Path Maps</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        )}

        {/* Creation Date Range Filter */}
        {(!displayFilters || displayFilters.creationDate) && (
          <DateFilter
            fromValue={filters.startDate || null}
            toValue={filters.endDate || null}
            onFromChange={(value) => handleFilterChange('startDate', value)}
            onToChange={(value) => handleFilterChange('endDate', value)}
            onClear={() => {
              handleFilterChange('startDate', null);
              handleFilterChange('endDate', null);
            }}
            fromLabel="From Date"
            toLabel="To Date"
            fromAriaLabel="Filter reviews from date"
            toAriaLabel="Filter reviews to date"
            clearAriaLabel="Clear date range filter"
          />
        )}

        {/* Priority Filter for moderation */}
        {(!displayFilters || displayFilters.priority) && (
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority || 'high_first'}
              onChange={(event) => handleFilterChange('priority', event.target.value)}
              label="Priority"
              aria-label="Sort by priority"
            >
              <MenuItem value="high_first">High Priority First</MenuItem>
              <MenuItem value="date_desc">Newest First</MenuItem>
              <MenuItem value="date_asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
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
      handleFilterChange,
    ]
  );

  // Show skeleton while loading IndexedDB or initial data (but not during filter changes)
  if (!hasLoadedFromStorage || (reviewsLoading && (!reviews || reviews.length === 0))) {
    return <ReviewFiltersSkeleton expanded={filtersExpanded} />;
  }

  // Show error state
  if (reviewsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
        Error loading reviews: {reviewsError.message}
      </Box>
    );
  }

  debugLog('ReviewTableToolbar.render', 'Rendering with filters:', {
    filters,
    viewType,
    totalCount: paginationMeta?.total,
    rowsPerPage,
    page,
  });

  return (
    <>
      {/* Status Tabs - Show for profile, moderation and admin views */}
      {(viewType === 'profile' || viewType === 'moderation' || viewType === 'admin') &&
        tabOptions && (
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
              <ReviewTableFiltersResult
                filters={filters}
                totalResults={paginationMeta?.total || 0}
                onClearFilters={handleClearFiltersWithReset}
                onFilterChange={handleFilterChange}
                search={safeSearch}
                displayFilters={displayFilters}
                getStatusColor={getStatusColor}
                getRatingColor={getRatingColor}
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
              reviews: reviews || [],
              loading: reviewsLoading,
              error: reviewsError,
              paginationMeta,
              onRefresh: mutateReviews,
            })
          : children}
        {/* Show subtle loading indicator during filter changes */}
        {reviewsLoading && reviews && reviews.length > 0 && (
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
