/**
 * @file use-art-piece-filters.js
 * @description Custom hook for managing art piece filtering, pagination, and search logic
 * @namespace CityArtWalks.Hooks.UseArtPieceFilters
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece-Model} - ArtPiece model documentation
 */

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { useGetGeoLocation } from 'src/actions/geo-location/hooks';
import { useGetPaginatedArtPieces } from 'src/actions/art-piece/hooks';
import { saveFiltersToIndexedDb, loadFiltersFromIndexedDb } from 'src/lib/indexDb-filters';

/**
 * @memberof CityArtWalks.Hooks.UseArtPieceFilters
 * @description Custom hook that manages art piece filtering, pagination, and search functionality.
 * Consolidates common logic shared across explore, profile, and admin views.
 *
 * Features: * - Pagination state management (0-based for Material-UI compatibility)
 * - Filter state with geographic location integration
 * - Search functionality with debounced input
 * - Map center coordination for location-based filtering
 * - Automatic geolocation integration
 * - API filter preparation and validation
 * - Common event handlers for filter changes
 *
 * @example
 * // Basic usage in explore view
 * const {
 *   artPieces,
 *   artPiecesLoading,
 *   paginationMeta,
 *   filters,
 *   search,
 *   page,
 *   rowsPerPage,
 *   mapCenter,
 *   handleSearchChange,
 *   handleFilterChange,
 *   handleClearFilters,
 *   handleLocationSelect,
 *   handlePageChange,
 *   handleRowsPerPageChange
 * } = useArtPieceFilters({
 *   initialFilters: { status: 'ACTIVE' },
 *   defaultRowsPerPage: 24,
 *   accessToken
 * });
 *
 * @example
 * // Usage in profile view with user filtering
 * const {
 *   artPieces,
 *   handleFilterChange,
 *   handleLocationSelect
 * } = useArtPieceFilters({
 *   initialFilters: { createdBy: user?.userId, status: 'all' },
 *   defaultRowsPerPage: 12,
 *   accessToken,
 *   autoGeoLocation: true
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
 */
export function useArtPieceFilters({
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
  // Get user's geolocation for auto-filtering
  const { location } = useGetGeoLocation(accessToken);

  // Map center state for location-based recentering
  const [mapCenter, setMapCenter] = useState(null);

  // Pagination state - 0-based for Material-UI compatibility
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Filter and search state
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Location readiness state - prevents API calls until geolocation is processed
  const [locationReady, setLocationReady] = useState(!autoGeoLocation);

  // Track if we've loaded from IndexedDB to prevent overwriting restored state
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load saved filters from IndexedDB on initialization
  useEffect(() => {
    if (!persistFilters || hasLoadedFromStorage) return;

    const loadSavedFilters = async () => {
      try {
        const savedState = await loadFiltersFromIndexedDb('art-piece', viewType, searchParams);
        if (savedState) {
          debugLog('useArtPieceFilters', '💾 Loaded saved filters from IndexedDB?:', savedState);

          // Apply saved state
          setFilters((prev) => ({ ...initialFilters, ...prev, ...savedState.filters }));
          setSearch(savedState.search || '');
          setPage(savedState.page || 0);
          setRowsPerPage(savedState.rowsPerPage || defaultRowsPerPage);

          // Restore mapCenter if available in saved state
          if (savedState.mapCenter) {
            setMapCenter(savedState.mapCenter);
            debugLog(
              'useArtPieceFilters',
              '🗺️ Restored mapCenter from IndexedDB?:',
              savedState.mapCenter
            );
          }
        }
        setHasLoadedFromStorage(true);
      } catch (error) {
        debugWarn('useArtPieceFilters', 'Failed to load saved filters?:', error);
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

  // Apply geolocation to filters if enabled and available (only after loading from storage)
  useEffect(() => {
    if (!hasLoadedFromStorage) return undefined; // Wait for storage load first

    if (autoGeoLocation && location?.countryId && !filters.countryId) {
      const geoFilters = {
        countryId: location.countryId,
        stateId: location.stateId || '',
        cityId: location.cityId || '',
      };
      setFilters((prev) => ({ ...prev, ...geoFilters }));

      // Also set initial map center to user's location if available
      if (location.lat && location.lon && !mapCenter) {
        debugLog('useArtPieceFilters', '🗺️ Setting initial map center to user location');
        setMapCenter({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          zoom: location.cityId ? 10 : location.stateId ? 7 : 5, // More specific = higher zoom
        });
      }

      setLocationReady(true); // Mark location as ready after applying filters
      debugLog('useArtPieceFilters', '🌍 Applied geolocation filters?:', geoFilters);
    } else if (autoGeoLocation && !location?.countryId) {
      // If no location data available after some time, still mark as ready to proceed
      // This prevents infinite loading when geolocation fails or is denied
      const timer = setTimeout(() => {
        setLocationReady(true);
        debugLog('useArtPieceFilters', '⚠️ Proceeding without geolocation data');
      }, 3000); // Wait 3 seconds for geolocation

      return () => clearTimeout(timer);
    } else {
      // Set initial map center even if not using auto geolocation
      if (location?.lat && location?.lon && !mapCenter) {
        debugLog('useArtPieceFilters', '🗺️ Setting initial map center to available location');
        setMapCenter({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          zoom: location.cityId ? 10 : location.stateId ? 7 : 5,
        });
      }
      setLocationReady(true);
    }
    return undefined;
  }, [location, filters.countryId, autoGeoLocation, hasLoadedFromStorage, mapCenter]);

  // Set initial map center from user's location when no explicit mapCenter is set
  // Only run this AFTER loading from IndexedDB to avoid overriding saved mapCenter
  useEffect(() => {
    if (!mapCenter && hasLoadedFromStorage && location?.lat && location?.lon) {
      const initialCenter = {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
        zoom: location.cityId ? 10 : location.stateId ? 7 : 5,
      };

      debugLog('useArtPieceFilters', '🗺️ Setting initial map center from user location');
      setMapCenter(initialCenter);
    }
  }, [mapCenter, hasLoadedFromStorage, location]);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      debugLog('useArtPieceFilters.debouncedSearch', '🔍 Search debounced?:', search);
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

    // Remove empty values to avoid unnecessary API filtering
    const cleanFilters = Object.fromEntries(
      Object.entries(baseFilters).filter(([key, value]) => {
        // Always include specific keys if they have values
        if (['createdBy', 'userId', 'artistId'].includes(key)) {
          return value !== '' && value !== null && value !== undefined;
        }
        // Special handling for boolean values
        if (key === 'featured') {
          return value === true || value === false;
        }
        // Standard filtering for other values
        return value !== '' && value !== null && value !== undefined;
      })
    );

    debugLog('useArtPieceFilters.apiFilters', '🔍 Prepared API filters?:', cleanFilters);
    return cleanFilters;
  }, [filters, debouncedSearch]);

  // Fetch data using the pagination hook - only when location is ready
  const {
    artPieces,
    artPiecesLoading,
    artPiecesError,
    paginationMeta,
    mutate: mutateArtPieces,
  } = useGetPaginatedArtPieces(
    locationReady ? apiFilters : null, // Pass null to prevent API call until location is ready
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
        const dataToSave = {
          filters: newFilters,
          search: newSearch,
          page: newPage,
          rowsPerPage: newRowsPerPage,
        };

        await saveFiltersToIndexedDb('art-piece', viewType, searchParams, dataToSave);
        debugLog('useArtPieceFilters', '💾 Saved filters to IndexedDB?:', dataToSave);
      } catch (error) {
        debugWarn('useArtPieceFilters', 'Failed to save filters to IndexedDB?:', error);
      }
    },
    [viewType, searchParams, persistFilters, hasLoadedFromStorage]
  );

  // Separate function for saving mapCenter only (to avoid render loops)
  const saveMapCenterToStorage = useCallback(
    async (newMapCenter) => {
      if (!persistFilters || !hasLoadedFromStorage) return;

      try {
        // Load current saved data first, then update just the mapCenter
        const currentData =
          (await loadFiltersFromIndexedDb('art-piece', viewType, searchParams)) || {};
        const updatedData = {
          ...currentData,
          mapCenter: newMapCenter,
        };

        await saveFiltersToIndexedDb('art-piece', viewType, searchParams, updatedData);
        debugLog('useArtPieceFilters', '💾 Saved mapCenter to IndexedDB?:', newMapCenter);
      } catch (error) {
        debugWarn('useArtPieceFilters', 'Failed to save mapCenter to IndexedDB?:', error);
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

      debugLog('useArtPieceFilters.handleSearchChange', '🔍 Search changed?:', value);
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

        debugLog('useArtPieceFilters.handleFilterChange', '🔍 Filters changed?:', filterUpdate);
        return newFilters;
      });

      setPage(0); // Reset to first page on filter change
    },
    [onFiltersChange, search, rowsPerPage, saveFiltersToStorage]
  );

  // Location selection handler for map recentering
  const handleLocationSelect = useCallback(
    (locationType, locationData) => {
      try {
        if (locationData?.latitude && locationData?.longitude) {
          let zoom;
          switch (locationType) {
            case 'country':
              zoom = 5;
              break;
            case 'state':
              zoom = 7;
              break;
            case 'city':
              zoom = 10;
              break;
            default:
              zoom = 8;
          }

          const newCenter = {
            latitude: parseFloat(locationData.latitude),
            longitude: parseFloat(locationData.longitude),
            zoom,
          };

          setMapCenter(newCenter);

          // Only save mapCenter to IndexedDB for city and state changes (meaningful location changes)
          if (locationType === 'city' || locationType === 'state') {
            saveMapCenterToStorage(newCenter);
            debugLog('useArtPieceFilters', '💾 Saved mapCenter for', locationType, 'change');
          }

          debugLog(
            'useArtPieceFilters.handleLocationSelect',
            `🗺️ Map recentered to ${locationType}:`,
            newCenter
          );
        }
      } catch (error) {
        debugWarn('useArtPieceFilters.handleLocationSelect', 'Failed to recenter map?:', error);
      }
    },
    [saveMapCenterToStorage]
  );

  // Filter reset handler
  const handleClearFilters = useCallback(() => {
    const defaultFilters =
      autoGeoLocation && location
        ? {
            ...initialFilters,
            countryId: location.countryId || '',
            stateId: location.stateId || '',
            cityId: location.cityId || '',
          }
        : initialFilters;

    setFilters(defaultFilters);
    setSearch('');
    setDebouncedSearch('');
    setPage(0);
    setMapCenter(null);

    // Save cleared state to IndexedDB
    saveFiltersToStorage(defaultFilters, '', 0, rowsPerPage);

    debugLog(
      'useArtPieceFilters.handleClearFilters',
      '🧹 Filters cleared, reset to?:',
      defaultFilters
    );
  }, [initialFilters, location, autoGeoLocation, rowsPerPage, saveFiltersToStorage]);

  // Pagination handlers
  const handlePageChange = useCallback(
    (_, newPage) => {
      const safePage = Math.max(0, parseInt(newPage, 10) || 0);
      setPage(safePage);

      // Save to IndexedDB
      saveFiltersToStorage(filters, search, safePage, rowsPerPage);

      // Call optional callback
      onPageChange?.(safePage);

      debugLog('useArtPieceFilters.handlePageChange', '📄 Page changed to?:', safePage);
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
        'useArtPieceFilters.handleRowsPerPageChange',
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
    artPieces,
    artPiecesLoading,
    artPiecesError,
    paginationMeta,
    mutateArtPieces,

    // State
    filters,
    search,
    page,
    rowsPerPage,
    mapCenter,
    location,

    // Handlers
    handleSearchChange,
    handleFilterChange,
    handleLocationSelect,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
    handleFilterTab,

    // Utilities
    resetPage,
    updateFilters,
    setMapCenter,

    // Computed values
    apiFilters,
    safeSearch: typeof search === 'string' ? search.trim() : '',
    totalResults: paginationMeta?.total || 0,
    hasResults: (artPieces || []).length > 0,
    hasFilters: Object.keys(apiFilters).length > 0,
    locationReady,
    hasLoadedFromStorage,
  };
}
