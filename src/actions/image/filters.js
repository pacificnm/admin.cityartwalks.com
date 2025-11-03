/**
 * @file filters.js
 * @description Custom hook for managing image filtering, pagination, and search logic
 *
 * This module provides a comprehensive hook for image filtering functionality,
 * consolidating pagination, search, geolocation integration, and filter persistence
 * across explore, profile, and admin views with IndexedDB caching support.
 * @namespace CityArtWalks.Actions.Image.Filters
 * @version 1.0.0
 * @author Claude
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Model} - Image model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Filters} - Filter components documentation
 */

'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { useGetPaginatedImages } from 'src/actions/image/hooks';
import { useGetGeoLocation } from 'src/actions/geo-location/hooks';
import { saveFiltersToIndexedDb, loadFiltersFromIndexedDb } from 'src/lib/indexDb-filters';

/**
 * Custom hook that manages image filtering, pagination, and search functionality.
 * Consolidates common logic shared across explore, profile, and admin views.
 *
 * Features:
 * - Pagination state management (0-based for Material-UI compatibility)
 * - Filter state with geographic location integration
 * - Search functionality with debounced input
 * - Automatic geolocation integration
 * - API filter preparation and validation
 * - Common event handlers for filter changes
 * - IndexedDB persistence for filter state
 * - SWR integration for efficient data fetching
 *
 * @function useImageFilters
 * @memberof CityArtWalks.Actions.Image.Filters
 *
 * @example
 * // Basic usage in explore view
 * const {
 *   images,
 *   imagesLoading,
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
 * } = useImageFilters({
 *   initialFilters: { status: 'ACTIVE' },
 *   defaultRowsPerPage: 10,
 *   accessToken
 * });
 *
 * @param {Object} options - Configuration options for the hook
 * @param {Object} [options.initialFilters={}] - Initial filter state
 * @param {number} [options.defaultRowsPerPage=24] - Default items per page
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
 * @returns {Array} returns.images - Array of image objects
 * @returns {boolean} returns.imagesLoading - Loading state for images
 * @returns {Error} returns.imagesError - Error state for images
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {Object} returns.filters - Current filter state
 * @returns {string} returns.search - Current search term
 * @returns {number} returns.page - Current page (0-based)
 * @returns {number} returns.rowsPerPage - Items per page
 * @returns {Function} returns.handleSearchChange - Search input handler
 * @returns {Function} returns.handleFilterChange - Filter change handler
 * @returns {Function} returns.handleClearFilters - Clear filters handler
 * @returns {Function} returns.handleLocationSelect - Location selection handler
 * @returns {Function} returns.handlePageChange - Page change handler
 * @returns {Function} returns.handleRowsPerPageChange - Rows per page handler
 */
export function useImageFilters({
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
        const savedState = await loadFiltersFromIndexedDb('image', viewType, searchParams);
        if (savedState) {
          debugLog('useImageFilters', '💾 Loaded saved filters from IndexedDB?:', savedState);

          // Apply saved state
          setFilters((prev) => ({ ...prev, ...savedState.filters }));
          setSearch(savedState.search || '');
          setPage(savedState.page || 0);
          setRowsPerPage(savedState.rowsPerPage || defaultRowsPerPage);
        }
        setHasLoadedFromStorage(true);
      } catch (error) {
        debugWarn('useImageFilters', 'Failed to load saved filters?:', error);
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
      debugLog('useImageFilters', '🌍 Applied geolocation filters?:', geoFilters);
    }
    return undefined;
  }, [location, filters.countryId, autoGeoLocation, hasLoadedFromStorage]);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      debugLog('useImageFilters.debouncedSearch', '🔍 Search debounced?:', search);
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
        await saveFiltersToIndexedDb('image', viewType, searchParams, dataToSave);
        debugLog('useImageFilters.saveFilters', 'Saved filters to IndexedDB?:', dataToSave);
      } catch (error) {
        debugWarn('useImageFilters.saveFilters', 'Failed to save filters to storage?:', error);
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
        if (['featured', 'isVerified'].includes(key)) {
          return value === true || value === false;
        }
        // Standard filtering for other values
        return value !== '' && value !== null && value !== undefined && value !== 'all';
      })
    );

    debugLog('useImageFilters.apiFilters', '🔍 Prepared API filters?:', cleanFilters);
    return cleanFilters;
  }, [filters, debouncedSearch]);

  // Fetch images using the pagination hook
  const { images, imagesLoading, imagesError, paginationMeta } = useGetPaginatedImages(
    apiFilters,
    Math.max(1, page + 1), // Convert 0-based to 1-based for API
    Math.max(1, rowsPerPage),
    accessToken,
    cacheTime
  );

  // Search input handler
  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? '';
      setSearch(value);
      setPage(0); // Reset to first page on search

      // Call optional callback
      onSearchChange?.(value);

      debugLog('useImageFilters.handleSearchChange', '🔍 Search changed?:', value);
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

        debugLog('useImageFilters.handleFilterChange', '🔍 Filters changed?:', filterUpdate);
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

    debugLog('useImageFilters.handleClearFilters', '🧹 Filters cleared');
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
        debugLog('useImageFilters.handleLocationSelect', '📍 Location selected?:', locationUpdate);
      }
    },
    [handleFilterChange]
  );

  // Pagination handlers
  const handlePageChange = useCallback(
    (_event, newPage) => {
      setPage(newPage);
      onPageChange?.(newPage);
      debugLog('useImageFilters.handlePageChange', '📄 Page changed?:', newPage);
    },
    [onPageChange]
  );

  const handleRowsPerPageChange = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
    debugLog(
      'useImageFilters.handleRowsPerPageChange',
      '📊 Rows per page changed?:',
      newRowsPerPage
    );
  }, []);

  // Calculate if filters can be reset
  const hasFilters = Object.keys(apiFilters).length > 0;

  return {
    // Data
    images: images || [],
    imagesLoading,
    imagesError,
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
    hasResults: (images || []).length > 0,
    hasFilters,
  };
}
