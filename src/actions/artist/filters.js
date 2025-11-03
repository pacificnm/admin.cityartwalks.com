/**
 * @file filters.js
 * @description Custom hook for managing artist filtering, pagination, and search logic via ArtistLocation data
 * @namespace CityArtWalks.Actions.Artist.Filters
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { useGetGeoLocation } from 'src/actions/geo-location/hooks';
import { useGetPaginatedArtistLocations } from 'src/actions/artist-location/hooks';
import { saveFiltersToIndexedDb, loadFiltersFromIndexedDb } from 'src/lib/indexDb-filters';

/**
 * Custom hook that manages artist filtering, pagination, and search functionality via ArtistLocation data.
 * Consolidates common logic shared across explore, profile, and admin views.
 *
 * This hook now uses the ArtistLocation table to provide enhanced location-based filtering while
 * maintaining backward compatibility by transforming ArtistLocation data back to Artist objects.
 * Artists are deduplicated when they have multiple locations, with primary location data included.
 *
 * Features:
 * - Pagination state management (0-based for Material-UI compatibility)
 * - Filter state with geographic location integration via ArtistLocation
 * - Search functionality with debounced input
 * - Automatic geolocation integration
 * - API filter preparation and validation
 * - Common event handlers for filter changes
 * - Multi-location artist support with deduplication
 * - Primary location context for each artist
 *
 * @async
 * @function useArtistFilters
 * @memberof CityArtWalks.Actions.Artist.Filters
 *
 * @example
 * // Basic usage in explore view
 * const {
 *   artists,
 *   artistsLoading,
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
 * } = useArtistFilters({
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
export function useArtistFilters({
  initialFilters = {},
  defaultRowsPerPage = 10,
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
        const savedState = await loadFiltersFromIndexedDb('artist', viewType, searchParams);
        if (savedState) {
          debugLog('useArtistFilters', '💾 Loaded saved filters from IndexedDB?:', savedState);

          // Apply saved state
          setFilters((prev) => ({ ...initialFilters, ...prev, ...savedState.filters }));
          setSearch(savedState.search || '');
          setPage(savedState.page || 0);
          setRowsPerPage(savedState.rowsPerPage || defaultRowsPerPage);
        }
        setHasLoadedFromStorage(true);
      } catch (error) {
        debugWarn('useArtistFilters', 'Failed to load saved filters?:', error);
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
    if (!hasLoadedFromStorage || !autoGeoLocation) return undefined;

    if (location?.countryId && !filters.countryId) {
      const geoFilters = {
        countryId: location.countryId,
        stateId: location.stateId || '',
        cityId: location.cityId || '',
      };

      setFilters((prev) => ({ ...prev, ...geoFilters }));
      debugLog('useArtistFilters', '🌍 Applied geolocation filters?:', geoFilters);
    }
    return undefined;
  }, [location, filters.countryId, autoGeoLocation, hasLoadedFromStorage]);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      debugLog('useArtistFilters.debouncedSearch', '🔍 Search debounced?:', search);
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
        await saveFiltersToIndexedDb('artist', viewType, searchParams, dataToSave);
        debugLog('useArtistFilters.saveFilters', 'Saved filters to IndexedDB?:', dataToSave);
      } catch (error) {
        debugWarn('useArtistFilters.saveFilters', 'Failed to save filters to storage?:', error);
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
        return value !== '' && value !== null && value !== undefined;
      })
    );

    debugLog('useArtistFilters.apiFilters', '🔍 Prepared API filters?:', {
      originalFilters: filters,
      statusValue: filters.status,
      cleanFilters,
      willRemoveStatus: filters.status === 'all',
    });
    return cleanFilters;
  }, [filters, debouncedSearch]);

  // Fetch artist locations - Convert page from 0-based to 1-based for API
  const { artistLocations, artistLocationsLoading, artistLocationsError, paginationMeta } =
    useGetPaginatedArtistLocations(
      apiFilters,
      page + 1, // Convert 0-based to 1-based
      rowsPerPage,
      accessToken,
      cacheTime
    );

  // Transform artist locations to artists for backward compatibility
  const artists = useMemo(() => {
    if (!artistLocations || !Array.isArray(artistLocations)) return [];

    // Extract unique artists from artist locations, including related data
    const artistMap = new Map();

    artistLocations.forEach((artistLocation) => {
      if (artistLocation.Artist && !artistMap.has(artistLocation.Artist.artistId)) {
        // Add the artist with location context
        artistMap.set(artistLocation.Artist.artistId, {
          ...artistLocation.Artist,
          // Add location information for context
          primaryLocation: artistLocation.primary
            ? {
                countryId: artistLocation.countryId,
                stateId: artistLocation.stateId,
                cityId: artistLocation.cityId,
                Country: artistLocation.Country,
                State: artistLocation.State,
                City: artistLocation.City,
              }
            : null,
          // Track if this artist has multiple locations
          hasMultipleLocations:
            artistLocations.filter((l) => l.artistId === artistLocation.Artist.artistId).length > 1,
        });
      }
    });

    return Array.from(artistMap.values());
  }, [artistLocations]);

  // Map loading and error states
  const artistsLoading = artistLocationsLoading;
  const artistsError = artistLocationsError;

  // Event handlers
  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? '';
      setSearch(value);
      setPage(0); // Reset to first page on search
      if (onSearchChange) {
        onSearchChange(value);
      }
    },
    [onSearchChange]
  );

  const handleFilterChange = useCallback(
    (filterKeyOrObject, filterValue) => {
      let newFilters;
      if (typeof filterKeyOrObject === 'string') {
        // Single filter change
        newFilters = { ...filters, [filterKeyOrObject]: filterValue };
      } else {
        // Multiple filter changes (object)
        newFilters = { ...filters, ...filterKeyOrObject };
      }

      setFilters(newFilters);
      setPage(0); // Reset to first page on filter change

      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    },
    [filters, onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    // Reset to default values, preserving any base filters from props
    const defaultFilters = { ...initialFilters, status: 'all' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);

    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [initialFilters, onFiltersChange, onSearchChange]);

  const handleLocationSelect = useCallback(
    (locationType, locationData) => {
      debugLog('useArtistFilters.handleLocationSelect', 'Location selected?:', {
        locationType,
        locationData,
      });

      if (locationType === 'country' && locationData) {
        handleFilterChange({
          countryId: locationData.countryId || '',
          stateId: '', // Reset dependent filters
          cityId: '',
        });
      } else if (locationType === 'state' && locationData) {
        handleFilterChange({
          stateId: locationData.stateId || '',
          cityId: '', // Reset dependent filter
        });
      } else if (locationType === 'city' && locationData) {
        handleFilterChange('cityId', locationData.cityId || '');
      }
    },
    [handleFilterChange]
  );

  const handlePageChange = useCallback(
    (event, newPage) => {
      setPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    },
    [onPageChange]
  );

  const handleRowsPerPageChange = useCallback((event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
  }, []);

  // Calculate if filters can be reset
  const hasFilters = Object.keys(apiFilters).length > 0;

  return {
    // Data
    artists: artists || [],
    artistsLoading,
    artistsError,
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
    hasResults: (artists || []).length > 0,
    hasFilters,
  };
}
