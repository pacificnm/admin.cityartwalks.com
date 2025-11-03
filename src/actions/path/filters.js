/**
 * @file filters.js
 * @description Custom hook for managing path filtering, pagination, and search logic
 * @namespace CityArtWalks.Hooks.UsePathFilters
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path-Model} - Path model documentation
 */

'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { useGetPaginatedPaths } from 'src/actions/path/hooks';
import { useGetGeoLocation } from 'src/actions/geo-location/hooks';
import { saveFiltersToIndexedDb, loadFiltersFromIndexedDb } from 'src/lib/indexDb-filters';

/**
 * @memberof CityArtWalks.Hooks.UsePathFilters
 * @description Custom hook that manages path filtering, pagination, and search functionality.
 * Consolidates common logic shared across explore, profile, and admin views.
 *
 * Features: * - Pagination state management (0-based for Material-UI compatibility)
 * - Filter state with geographic location integration
 * - Search functionality with debounced input
 * - Automatic geolocation integration
 * - API filter preparation and validation
 * - Common event handlers for filter changes
 *
 * @example
 * // Basic usage in explore view
 * const {
 *   paths,
 *   pathsLoading,
 *   paginationMeta,
 *   filters,
 *   search,
 *   page,
 *   rowsPerPage,
 *   handleSearchChange,
 *   handleFilterChange,
 *   handleClearFilters,
 *   handleLocationSelect,
 *   handlePageChange,
 *   handleRowsPerPageChange
 * } = usePathFilters({
 *   initialFilters: { status: 'ACTIVE' },
 *   defaultRowsPerPage: 10,
 *   accessToken
 * });
 *
 * @param {Object} options - Configuration options for the hook
 * @param {Object} [options.initialFilters={}] - Initial filter state
 * @param {number} [options.defaultRowsPerPage=10] - Default items per page
 * @param {string} [options.accessToken=''] - Authentication token for API calls
 * @param {boolean} [options.autoGeoLocation=false] - Auto-apply user's geolocation to filters
 * @param {number} [options.cacheTime=3600] - SWR cache time in seconds
 * @param {string} [options.viewType='default'] - View type for IndexedDB storage key
 * @param {Object} [options.searchParams={}] - URL search parameters for storage key
 * @param {boolean} [options.persistFilters=true] - Enable filter persistence in IndexedDB
 * @param {Function} [options.onFiltersChange] - Callback when filters change
 * @param {Function} [options.onSearchChange] - Callback when search changes
 * @param {Function} [options.onPageChange] - Callback when page changes
 * @returns {Object} Hook state and handlers
 */
export function usePathFilters({
  initialFilters = {},
  defaultRowsPerPage = 24,
  accessToken = '',
  autoGeoLocation = false,
  cacheTime = 3600,
  viewType = 'default',
  searchParams = {},
  persistFilters = true,
  onFiltersChange,
  onSearchChange,
  onPageChange,
} = {}) {
  // Store initialFilters in a ref to avoid dependency issues
  const initialFiltersRef = useRef(initialFilters);
  initialFiltersRef.current = initialFilters;

  // Get user's geolocation for auto-filtering
  const { location } = useGetGeoLocation(accessToken);

  // Pagination state - 0-based for Material-UI compatibility
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Filter and search state
  const [filters, setFilters] = useState(() => initialFilters);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Track if we've loaded from IndexedDB to prevent overwriting restored state
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load saved filters from IndexedDB on initialization
  useEffect(() => {
    if (!persistFilters || hasLoadedFromStorage) return;

    const loadSavedFilters = async () => {
      try {
        const savedState = await loadFiltersFromIndexedDb('path', viewType, searchParams);
        if (savedState) {
          debugLog('usePathFilters', '💾 Loaded saved filters from IndexedDB?:', savedState);

          // Apply saved state
          setFilters((prev) => ({ ...prev, ...savedState.filters }));
          setSearch(savedState.search || '');
          setPage(savedState.page || 0);
          setRowsPerPage(savedState.rowsPerPage || defaultRowsPerPage);
        }
        setHasLoadedFromStorage(true);
      } catch (error) {
        debugWarn('usePathFilters', 'Failed to load saved filters?:', error);
        setHasLoadedFromStorage(true);
      }
    };

    loadSavedFilters();
  }, [viewType, searchParams, persistFilters, hasLoadedFromStorage, defaultRowsPerPage]);

  // Apply geolocation to filters if enabled and available (only after loading from storage)
  useEffect(() => {
    if (!hasLoadedFromStorage || !autoGeoLocation) return undefined;

    if (location?.countryId && !filters.countryId) {
      const geoFilters = {
        countryId: location.countryId,
        stateId: location.stateId || '',
        cityId: location.cityId || '',
      };
      setFilters((prev) => ({ ...prev, ...geoFilters }));
      debugLog('usePathFilters', '🌍 Applied geolocation filters?:', geoFilters);
    }
    return undefined;
  }, [location, filters.countryId, autoGeoLocation, hasLoadedFromStorage]);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      debugLog('usePathFilters.debouncedSearch', '🔍 Search debounced?:', search);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [search]);

  // Save filters to IndexedDB when they change
  useEffect(() => {
    if (!persistFilters || !hasLoadedFromStorage) return;

    const saveFilters = async () => {
      try {
        const dataToSave = {
          filters,
          search,
          page,
          rowsPerPage,
          timestamp: Date.now(),
        };
        await saveFiltersToIndexedDb('path', viewType, searchParams, dataToSave);
        debugLog('usePathFilters.saveFilters', 'Saved filters to IndexedDB?:', dataToSave);
      } catch (error) {
        debugWarn('usePathFilters.saveFilters', 'Failed to save filters to storage?:', error);
      }
    };

    saveFilters();
  }, [
    filters,
    search,
    page,
    rowsPerPage,
    viewType,
    searchParams,
    persistFilters,
    hasLoadedFromStorage,
  ]);

  // Prepare filters for API requests
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
        // Standard filtering for other values
        return value !== '' && value !== null && value !== undefined && value !== 'all';
      })
    );

    debugLog('usePathFilters.apiFilters', '🔍 Prepared API filters?:', cleanFilters);
    return cleanFilters;
  }, [filters, debouncedSearch]);

  // Fetch paths using the pagination hook
  const { paths, pathsLoading, pathsError, paginationMeta } = useGetPaginatedPaths({
    page: Math.max(1, page + 1), // Convert 0-based to 1-based for API
    rowsPerPage: Math.max(1, rowsPerPage),
    search: apiFilters.search || '',
    status: apiFilters.status || '',
    path_type: apiFilters.pathType || '', // Map pathType to path_type
    created_by: apiFilters.createdBy || null, // Map createdBy to created_by
    countryId: apiFilters.countryId || null,
    stateId: apiFilters.stateId || null,
    cityId: apiFilters.cityId || null,
    featured: apiFilters.featured || false,
    token: accessToken,
    revalidate: cacheTime,
  });

  // Search input handler
  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? '';
      setSearch(value);
      setPage(0); // Reset to first page on search

      // Call optional callback
      onSearchChange?.(value);

      debugLog('usePathFilters.handleSearchChange', '🔍 Search changed?:', value);
    },
    [onSearchChange]
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

        // Call optional callback
        onFiltersChange?.(newFilters);

        debugLog('usePathFilters.handleFilterChange', '🔍 Filters changed?:', filterUpdate);
        return newFilters;
      });

      setPage(0); // Reset to first page on filter change
    },
    [onFiltersChange]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    const defaultFilters = { ...initialFiltersRef.current };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);

    // Call optional callbacks
    onFiltersChange?.(defaultFilters);
    onSearchChange?.('');

    debugLog('usePathFilters.handleClearFilters', '🧹 Filters cleared');
  }, [onFiltersChange, onSearchChange]);

  // Handle location selection for geographic filtering
  const handleLocationSelect = useCallback(
    (locationType, locationData) => {
      let locationUpdate = {};

      if (locationType === 'country' && locationData) {
        locationUpdate = {
          countryId: locationData.countryId || '',
          stateId: '', // Reset dependent filters
          cityId: '',
        };
      } else if (locationType === 'state' && locationData) {
        locationUpdate = {
          stateId: locationData.stateId || '',
          cityId: '', // Reset dependent filter
        };
      } else if (locationType === 'city' && locationData) {
        locationUpdate = { cityId: locationData.cityId || '' };
      }

      if (Object.keys(locationUpdate).length > 0) {
        handleFilterChange(locationUpdate);
        debugLog('usePathFilters.handleLocationSelect', '📍 Location selected?:', locationUpdate);
      }
    },
    [handleFilterChange]
  );

  // Pagination handlers
  const handlePageChange = useCallback(
    (_event, newPage) => {
      setPage(newPage);
      onPageChange?.(newPage);
      debugLog('usePathFilters.handlePageChange', '📄 Page changed?:', newPage);
    },
    [onPageChange]
  );

  const handleRowsPerPageChange = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
    debugLog(
      'usePathFilters.handleRowsPerPageChange',
      '📊 Rows per page changed?:',
      newRowsPerPage
    );
  }, []);

  // Calculate if filters can be reset
  const hasFilters = Object.keys(apiFilters).length > 0;

  return {
    // Data
    paths: paths || [],
    pathsLoading,
    pathsError,
    paginationMeta,

    // Filter state
    filters,
    search,
    page,
    rowsPerPage,
    hasLoadedFromStorage,

    // Event handlers
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handleLocationSelect,
    handlePageChange,
    handleRowsPerPageChange,

    // Computed values
    apiFilters,
    safeSearch: typeof search === 'string' ? search.trim() : '',
    totalResults: paginationMeta?.total || 0,
    hasResults: (paths || []).length > 0,
    hasFilters,
  };
}
