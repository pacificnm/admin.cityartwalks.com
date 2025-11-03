/**
 * @file filters.js
 * @description Custom hook for managing post filtering, pagination, and search logic
 * @namespace CityArtWalks.Actions.PostFilters
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post-Model} - Post model documentation
 */

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { useGetPaginatedPosts } from 'src/actions/post/hooks';
import { saveFiltersToIndexedDb, loadFiltersFromIndexedDb } from 'src/lib/indexDb-filters';

/**
 * @memberof CityArtWalks.Actions.PostFilters
 * @description Custom hook that manages post filtering, pagination, and search functionality.
 * Consolidates common logic shared across explore, profile, and admin views.
 *
 * Features: * - Pagination state management (0-based for Material-UI compatibility)
 * - Filter state for post-specific fields (status, category, tags, featured)
 * - Search functionality with debounced input
 * - API filter preparation and validation
 * - Common event handlers for filter changes
 * - IndexedDB persistence for user preferences
 *
 * @example
 * // Basic usage in explore view
 * const {
 *   posts,
 *   postsLoading,
 *   paginationMeta,
 *   filters,
 *   search,
 *   page,
 *   rowsPerPage,
 *   handleSearchChange,
 *   handleFilterChange,
 *   handleClearFilters,
 *   handlePageChange,
 *   handleRowsPerPageChange
 * } = usePostFilters({
 *   initialFilters: { status: 'PUBLISHED' },
 *   defaultRowsPerPage: 12,
 *   accessToken
 * });
 *
 * @example
 * // Usage in profile view with user filtering
 * const {
 *   posts,
 *   handleFilterChange,
 * } = usePostFilters({
 *   initialFilters: { createdBy: user?.userId, status: 'all' },
 *   defaultRowsPerPage: 12,
 *   accessToken
 * });
 *
 * @example
 * // Usage in admin view with full filtering
 * const {
 *   posts,
 *   filters,
 *   handleFilterChange,
 * } = usePostFilters({
 *   initialFilters: { status: 'all' },
 *   defaultRowsPerPage: 25,
 *   accessToken,
 *   viewType: 'admin'
 * });
 *
 * @param {Object} options - Configuration options for the hook
 * @param {Object} [options.initialFilters={}] - Initial filter state
 * @param {number} [options.defaultRowsPerPage=12] - Default items per page
 * @param {string} [options.accessToken=''] - Authentication token for API calls
 * @param {number} [options.cacheTime=3600] - SWR cache time in seconds
 * @param {string} [options.viewType='default'] - View type for IndexedDB storage key
 * @param {Object} [options.searchParams={}] - URL search parameters for storage key
 * @param {boolean} [options.persistFilters=true] - Enable filter persistence in IndexedDB
 * @param {Function} [options.onFiltersChange] - Callback when filters change
 * @param {Function} [options.onSearchChange] - Callback when search changes
 * @param {Function} [options.onPageChange] - Callback when page changes
 * @returns {Object} Hook state and handlers
 */
export function usePostFilters({
  initialFilters = {},
  defaultRowsPerPage = 12,
  accessToken = '',
  cacheTime = 3600,
  viewType = 'default',
  searchParams = {},
  persistFilters = true,
  onFiltersChange,
  onSearchChange,
  onPageChange,
} = {}) {
  // Pagination state - 0-based for Material-UI compatibility
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Filter and search state
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Track if we've loaded from IndexedDB to prevent overwriting restored state
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load saved filters from IndexedDB on initialization
  useEffect(() => {
    if (!persistFilters || hasLoadedFromStorage) return;

    const loadSavedFilters = async () => {
      try {
        const savedState = await loadFiltersFromIndexedDb('post', viewType, searchParams);
        if (savedState) {
          debugLog('usePostFilters', '💾 Loaded saved filters from IndexedDB?:', savedState);

          // Apply saved state
          setFilters((prev) => ({ ...initialFilters, ...prev, ...savedState.filters }));
          setSearch(savedState.search || '');
          setPage(savedState.page || 0);
          setRowsPerPage(savedState.rowsPerPage || defaultRowsPerPage);
        }
        setHasLoadedFromStorage(true);
      } catch (error) {
        debugWarn('usePostFilters', 'Failed to load saved filters?:', error);
        setHasLoadedFromStorage(true);
      }
    };

    loadSavedFilters();
  }, [
    viewType,
    searchParams,
    persistFilters,
    hasLoadedFromStorage,
    initialFilters,
    defaultRowsPerPage,
  ]);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      debugLog('usePostFilters.debouncedSearch', '🔍 Search debounced?:', search);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [search]);

  // Prepare API filters - clean and transform for backend
  const apiFilters = useMemo(() => {
    const safeSearch = typeof debouncedSearch === 'string' ? debouncedSearch.trim() : '';
    const baseFilters = {
      ...filters,
      ...(safeSearch && { search: safeSearch }),
    };

    // Remove 'all' status - no filter when status is 'all'
    if (filters.status === 'all') {
      delete baseFilters.status;
    }

    // Remove 'all' category - no filter when category is 'all'
    if (filters.category === 'all') {
      delete baseFilters.category;
    }

    // Remove 'all' featured - no filter when featured is 'all'
    if (filters.featured === 'all') {
      delete baseFilters.featured;
    }

    // Remove empty values to avoid unnecessary API filtering
    const cleanFilters = Object.fromEntries(
      Object.entries(baseFilters).filter(([key, value]) => {
        // Always include specific keys if they have values
        if (['createdBy', 'userId'].includes(key)) {
          return value !== '' && value !== null && value !== undefined;
        }
        // Special handling for boolean values
        if (key === 'featured') {
          return value === true || value === false;
        }
        // Special handling for arrays (tags)
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        // Standard filtering for other values
        return value !== '' && value !== null && value !== undefined;
      })
    );

    debugLog('usePostFilters.apiFilters', '🔍 Prepared API filters?:', cleanFilters);
    return cleanFilters;
  }, [filters, debouncedSearch]);

  // Fetch data using the pagination hook
  const {
    posts,
    postsLoading,
    postsError,
    paginationMeta,
    mutate: mutatePosts,
  } = useGetPaginatedPosts(
    apiFilters,
    Math.max(1, page + 1), // Convert 0-based to 1-based for API
    Math.max(1, rowsPerPage),
    accessToken,
    cacheTime
  );

  // Save current state to IndexedDB (defined early to avoid hoisting issues)
  const saveFiltersToStorage = useCallback(
    async (newFilters, newSearch, newPage, newRowsPerPage) => {
      if (!persistFilters || !hasLoadedFromStorage) return;

      try {
        await saveFiltersToIndexedDb('post', viewType, searchParams, {
          filters: newFilters,
          search: newSearch,
          page: newPage,
          rowsPerPage: newRowsPerPage,
        });
      } catch (error) {
        debugWarn('usePostFilters', 'Failed to save filters to IndexedDB?:', error);
      }
    },
    [viewType, searchParams, persistFilters, hasLoadedFromStorage]
  );

  // Search input handler
  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? '';
      setSearch(value);
      setPage(0); // Reset to first page on search

      // Save to IndexedDB
      saveFiltersToStorage(filters, value, 0, rowsPerPage);

      // Call optional callback
      onSearchChange?.(value);

      debugLog('usePostFilters.handleSearchChange', '🔍 Search changed?:', value);
    },
    [onSearchChange, filters, rowsPerPage, saveFiltersToStorage]
  );

  // Generic filter change handler
  const handleFilterChange = useCallback(
    (filterKeyOrObject, filterValue) => {
      let filterUpdate = {};

      if (typeof filterKeyOrObject === 'string') {
        // Single filter change
        filterUpdate = { [filterKeyOrObject]: filterValue };
      } else {
        // Multiple filter changes (object merge)
        filterUpdate = filterKeyOrObject;
      }

      setFilters((prev) => {
        const newFilters = { ...prev, ...filterUpdate };

        // Save to IndexedDB
        saveFiltersToStorage(newFilters, search, 0, rowsPerPage);

        // Call optional callback
        onFiltersChange?.(newFilters);

        debugLog('usePostFilters.handleFilterChange', '🔍 Filters changed?:', filterUpdate);
        return newFilters;
      });

      setPage(0); // Reset to first page on filter change
    },
    [onFiltersChange, search, rowsPerPage, saveFiltersToStorage]
  );

  // Filter reset handler
  const handleClearFilters = useCallback(() => {
    const defaultFilters = initialFilters;

    setFilters(defaultFilters);
    setSearch('');
    setDebouncedSearch('');
    setPage(0);

    // Save cleared state to IndexedDB
    saveFiltersToStorage(defaultFilters, '', 0, rowsPerPage);

    debugLog('usePostFilters.handleClearFilters', '🧹 Filters cleared, reset to?:', defaultFilters);
  }, [initialFilters, rowsPerPage, saveFiltersToStorage]);

  // Pagination handlers
  const handlePageChange = useCallback(
    (_, newPage) => {
      const safePage = Math.max(0, parseInt(newPage, 10) || 0);
      setPage(safePage);

      // Save to IndexedDB
      saveFiltersToStorage(filters, search, safePage, rowsPerPage);

      // Call optional callback
      onPageChange?.(safePage);

      debugLog('usePostFilters.handlePageChange', '📄 Page changed to?:', safePage);
    },
    [onPageChange, filters, search, rowsPerPage, saveFiltersToStorage]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      const safeRowsPerPage = Math.max(1, parseInt(event.target.value, 10) || defaultRowsPerPage);
      setRowsPerPage(safeRowsPerPage);
      setPage(0); // Reset to first page when changing page size

      // Save to IndexedDB
      saveFiltersToStorage(filters, search, 0, safeRowsPerPage);

      debugLog(
        'usePostFilters.handleRowsPerPageChange',
        '📊 Rows per page changed to?:',
        safeRowsPerPage
      );
    },
    [defaultRowsPerPage, filters, search, saveFiltersToStorage]
  );

  // Tab change handler for status filtering
  const handleFilterTab = useCallback(
    (_, newValue) => {
      handleFilterChange('status', newValue);
    },
    [handleFilterChange]
  );

  // Reset page to first (useful for external triggers)
  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  // Update specific filter values (useful for external control)
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  }, []);

  return {
    // Data
    posts,
    postsLoading,
    postsError,
    paginationMeta,
    mutatePosts,

    // State
    filters,
    search,
    page,
    rowsPerPage,

    // Handlers
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
    handleFilterTab,

    // Utilities
    resetPage,
    updateFilters,

    // Computed values
    apiFilters,
    safeSearch: typeof search === 'string' ? search.trim() : '',
    totalResults: paginationMeta?.total || 0,
    hasResults: (posts || []).length > 0,
    hasFilters: Object.keys(apiFilters).length > 0,
    hasLoadedFromStorage,
  };
}
