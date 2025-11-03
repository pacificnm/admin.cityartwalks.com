'use client';

import { usePopover } from 'minimal-shared/hooks';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { debugLog } from 'src/lib/debug';
import { usePostFilters } from 'src/actions/post/filters';
import { createFilterOptions } from 'src/actions/post/filter-options';

import { ChevronDownIcon } from 'src/components/icons';
import { TablePaginationCustom } from 'src/components/table';
import {
  ToolMenu,
  DateFilter,
  TabsFilter,
  UserFilter,
  ActionsMenu,
  FilterCounts,
  SearchFilter,
  BooleanFilter,
  NumberRangeFilter,
  PostCategoryFilter,
} from 'src/components/filters';

import { useAuthContext } from 'src/auth/hooks';

import { PostFiltersSkeleton } from './post-filters-skeleton';
import { PostTableFiltersResult } from './post-table-filters-result';

/**
 * Post Table Toolbar Component
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
export const PostTableToolbar = React.memo(function PostTableToolbar({
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

  // Use the centralized post filters hook - all state is managed here
  const {
    posts,
    postsLoading,
    postsError,
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
  } = usePostFilters({
    initialFilters: {
      status: 'PUBLISHED',
      ...initialFilters,
    },
    defaultRowsPerPage: 12,
    accessToken: accessToken ?? '',
    viewType, // Pass viewType for IndexedDB storage key
    persistFilters: true, // Enable filter persistence
  });

  // Action menu popover state
  const menuActions = usePopover();

  // Accordion state for filters with localStorage persistence
  const [filtersExpanded, setFiltersExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('postFiltersExpanded');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // State to store selected author information for display in filter results
  const [selectedAuthorInfo, setSelectedAuthorInfo] = useState(null);

  // Save accordion state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('postFiltersExpanded', JSON.stringify(filtersExpanded));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [filtersExpanded]);

  // Accordion toggle handler for filters
  const handleFiltersAccordionChange = useCallback((_, isExpanded) => {
    setFiltersExpanded(isExpanded);
  }, []);

  /**
   * Handles author filter changes with additional author information storage
   */
  const handleAuthorFilterChange = useCallback(
    (key, value, authorInfo = null) => {
      setSelectedAuthorInfo(authorInfo);
      handleFilterChange(key, value);
    },
    [handleFilterChange]
  );

  /**
   * Handles clearing all filters including author selection info
   */
  const handleClearFiltersWithReset = useCallback(() => {
    setSelectedAuthorInfo(null);
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

  // Enhanced filter options that include selected author info
  const enhancedFilterOptions = useMemo(
    () => ({
      users: selectedAuthorInfo
        ? [selectedAuthorInfo].filter(
            (author, index, arr) => arr.findIndex((a) => a.id === author.id) === index
          )
        : [],
    }),
    [selectedAuthorInfo]
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
              placeholder="Search posts by title, content, category..."
              ariaLabel="Search posts"
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

        {/* Category and Status Filters Row */}
        {(!displayFilters ||
          displayFilters.category ||
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
            {/* Category Filter */}
            {(!displayFilters || displayFilters.category) && (
              <PostCategoryFilter
                value={filters.category || ''}
                onChange={(value) => handleFilterChange('category', value)}
                label="Category"
                placeholder="All Categories"
                ariaLabel="Filter by category"
                sx={{ minWidth: 200 }}
              />
            )}

            {/* Featured Filter */}
            {(!displayFilters || displayFilters.featured) && (
              <BooleanFilter
                value={filters.featured || false}
                onChange={(checked) => handleFilterChange('featured', checked)}
                onClear={() => handleFilterChange('featured', false)}
                label="Featured"
                ariaLabel="Filter by featured posts"
                clearAriaLabel="Clear featured filter"
                color="info"
              />
            )}
          </Box>
        )}

        {/* Author Filter */}
        {(!displayFilters || displayFilters.createdBy) && (
          <UserFilter
            value={filters.createdBy || ''}
            onChange={handleAuthorFilterChange}
            users={enhancedFilterOptions.users}
            label="Author"
            placeholder="Search authors..."
            ariaLabel="Filter by author"
          />
        )}

        {/* Publication Date Range Filter */}
        {(!displayFilters || displayFilters.publishedAt) && (
          <DateFilter
            fromValue={filters.publishedAtFrom || null}
            toValue={filters.publishedAtTo || null}
            onFromChange={(value) => handleFilterChange('publishedAtFrom', value)}
            onToChange={(value) => handleFilterChange('publishedAtTo', value)}
            onClear={() => {
              handleFilterChange('publishedAtFrom', null);
              handleFilterChange('publishedAtTo', null);
            }}
            fromLabel="Published From"
            toLabel="Published To"
            fromAriaLabel="Filter by publication date from"
            toAriaLabel="Filter by publication date to"
            clearAriaLabel="Clear publication date filter"
          />
        )}

        {/* Creation Date Range Filter */}
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
      handleFilterChange,
      handleAuthorFilterChange,
      enhancedFilterOptions.users,
    ]
  );

  // Show skeleton while loading IndexedDB or initial data (but not during filter changes)
  if (!hasLoadedFromStorage || (postsLoading && (!posts || posts.length === 0))) {
    return <PostFiltersSkeleton expanded={filtersExpanded} />;
  }

  // Show error state
  if (postsError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, color: 'error.main' }}>
        Error loading posts: {postsError.message}
      </Box>
    );
  }

  debugLog('PostTableToolbar.render', 'Rendering with filters:', filters);

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
                <PostTableFiltersResult
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
              posts: posts || [],
              loading: postsLoading,
              error: postsError,
              paginationMeta,
            })
          : children}
        {/* Show subtle loading indicator during filter changes */}
        {postsLoading && posts && posts.length > 0 && (
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
