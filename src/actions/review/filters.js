/**
 * @file use-review-filters.js
 * @description Custom hook for managing review filtering, pagination, and search logic
 * @namespace CityArtWalks.Hooks.UseReviewFilters
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { useGetPaginatedReviews } from 'src/actions/review/hooks';
import { saveFiltersToIndexedDb, loadFiltersFromIndexedDb } from 'src/lib/indexDb-filters';

/**
 * @memberof CityArtWalks.Hooks.UseReviewFilters
 * @description Custom hook that manages review filtering, pagination, and search functionality.
 * Consolidates common logic shared across artist, artpiece, path, profile, and admin views.
 *
 * Features: * - Pagination state management (0-based for Material-UI compatibility)
 * - Filter state for review properties and entity relationships
 * - Search functionality with debounced input
 * - API filter preparation and validation
 * - Common event handlers for filter changes
 * - Support for filtering by Artist, ArtPiece, Path, PathMap, and Image relationships
 *
 * @example
 * // Basic usage in artist view (show reviews for specific artist)
 * const {
 *   reviews,
 *   reviewsLoading,
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
 * } = useReviewFilters({
 *   initialFilters: { artistId: 123 },
 *   defaultRowsPerPage: 10,
 *   accessToken
 * });
 *
 * @param {Object} options - Configuration options for the hook
 * @param {Object} [options.initialFilters={}] - Initial filter state
 * @param {number} [options.defaultRowsPerPage=10] - Default items per page
 * @param {string} [options.accessToken=''] - Authentication token for API calls
 * @param {number} [options.cacheTime=3600] - SWR cache time in seconds
 * @param {string} [options.viewType='profile'] - View type for IndexedDB storage key
 * @param {Object} [options.searchParams={}] - URL search parameters for storage key
 * @param {boolean} [options.persistFilters=true] - Enable filter persistence in IndexedDB
 * @param {Function} [options.onFiltersChange] - Callback when filters change
 * @param {Function} [options.onSearchChange] - Callback when search changes
 * @param {Function} [options.onPageChange] - Callback when page changes
 * @returns {Object} Hook state and handlers
 */
export function useReviewFilters({
  initialFilters = {},
  defaultRowsPerPage = 10,
  accessToken = '',
  cacheTime = 3600,
  viewType = 'profile',
  searchParams = {},
  persistFilters = true,
  onFiltersChange,
  onSearchChange,
  onPageChange,
} = {}) {
  // State management with IndexedDB persistence
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0); // 0-based for Material-UI
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load filters from IndexedDB on mount (match Artist hook behaviour)
  useEffect(() => {
    // If persistence is disabled, mark as loaded and skip
    if (!persistFilters) {
      setHasLoadedFromStorage(true);
      return;
    }

    // Avoid re-loading if we've already loaded saved state
    if (hasLoadedFromStorage) return;

    const loadStoredFilters = async () => {
      try {
        const storedData = await loadFiltersFromIndexedDb('review', viewType, searchParams);
        if (storedData && typeof storedData === 'object') {
          debugLog(
            'useReviewFilters.loadStoredFilters',
            'Loaded filters from IndexedDB?:',
            storedData
          );

          // Merge with initial filters, giving priority to stored data
          if (storedData.filters) {
            setFilters((prev) => ({ ...initialFilters, ...prev, ...storedData.filters }));
          }
          if (storedData.search) {
            setSearch(storedData.search);
          }
          if (storedData.page !== undefined) {
            setPage(storedData.page);
          }
          if (storedData.rowsPerPage) {
            setRowsPerPage(storedData.rowsPerPage);
          }
        }
      } catch (error) {
        debugWarn(
          'useReviewFilters.loadStoredFilters',
          'Failed to load filters from storage?:',
          error
        );
      } finally {
        // Ensure we only attempt to load once
        setHasLoadedFromStorage(true);
      }
    };

    loadStoredFilters();
  }, [viewType, searchParams, persistFilters, initialFilters, hasLoadedFromStorage]);

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      debugLog('useReviewFilters.debouncedSearch', '🔍 Search debounced?:', search);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [search]);

  // Save filters to IndexedDB when they change (only after we've loaded stored state)
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
        await saveFiltersToIndexedDb('review', viewType, searchParams, dataToSave);
        debugLog('useReviewFilters.saveFilters', 'Saved filters to IndexedDB?:', dataToSave);
      } catch (error) {
        debugWarn('useReviewFilters.saveFilters', 'Failed to save filters to storage?:', error);
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

    // Handle rating filters - convert to API format
    if (baseFilters.rating && baseFilters.rating !== 'all') {
      if (baseFilters.rating === '5') {
        baseFilters.rating = 5;
      } else if (baseFilters.rating === '4-plus') {
        baseFilters.ratingMin = 4;
        delete baseFilters.rating;
      } else if (baseFilters.rating === '3-plus') {
        baseFilters.ratingMin = 3;
        delete baseFilters.rating;
      } else if (baseFilters.rating === '2-plus') {
        baseFilters.ratingMin = 2;
        delete baseFilters.rating;
      } else if (baseFilters.rating === '1') {
        baseFilters.rating = 1;
      }
    }

    // Remove empty values to avoid unnecessary API filtering
    const cleanFilters = Object.fromEntries(
      Object.entries(baseFilters).filter(([key, value]) => {
        // Always include specific keys if they have values
        if (['createdBy', 'userId', 'entityId', 'entityType'].includes(key)) {
          return value !== '' && value !== null && value !== undefined;
        }
        // Special handling for rating (can be 0)
        if (key === 'rating' || key === 'ratingMin') {
          return value !== '' && value !== null && value !== undefined;
        }
        // Standard filtering for other values
        return value !== '' && value !== null && value !== undefined && value !== 'all';
      })
    );

    debugLog('useReviewFilters.apiFilters', '🔍 Prepared API filters?:', cleanFilters);
    return cleanFilters;
  }, [filters, debouncedSearch]);

  // Fetch reviews - Convert page from 0-based to 1-based for API
  const {
    reviews,
    reviewsLoading,
    reviewsError,
    paginationMeta,
    mutate: mutateReviews,
  } = useGetPaginatedReviews({
    ...apiFilters,
    page: page + 1, // Convert 0-based to 1-based
    rowsPerPage,
    token: accessToken,
    revalidate: cacheTime,
  });

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
      // Avoid updating state if filters are identical to prevent unnecessary renders
      try {
        const prevStr = JSON.stringify(filters || {});
        const nextStr = JSON.stringify(newFilters || {});
        if (prevStr === nextStr) {
          return; // no-op
        }
      } catch {
        // If stringify fails for any reason, fall back to setting filters
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

  // Helper function for setting entity-specific filters
  const handleEntitySelect = useCallback(
    (entityType, entityId) => {
      debugLog('useReviewFilters.handleEntitySelect', 'Entity selected?:', {
        entityType,
        entityId,
      });

      const entityFilters = {};
      if (entityType === 'artist' && entityId) {
        entityFilters.artistId = entityId;
      } else if (entityType === 'artpiece' && entityId) {
        entityFilters.artPieceId = entityId;
      } else if (entityType === 'path' && entityId) {
        entityFilters.pathId = entityId;
      } else if (entityType === 'pathmap' && entityId) {
        entityFilters.pathMapId = entityId;
      } else if (entityType === 'image' && entityId) {
        entityFilters.imageId = entityId;
      }

      handleFilterChange(entityFilters);
    },
    [handleFilterChange]
  );

  const handlePageChange = useCallback(
    (_, newPage) => {
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

  // Tab change handler for status filtering
  const handleFilterTab = useCallback(
    (_, newValue) => {
      handleFilterChange('status', newValue);
    },
    [handleFilterChange]
  );

  // Rating filter handler
  const handleRatingFilter = useCallback(
    (rating) => {
      handleFilterChange('rating', rating);
    },
    [handleFilterChange]
  );

  // Entity type filter handler
  const handleEntityTypeFilter = useCallback(
    (entityType) => {
      handleFilterChange('entityType', entityType);
    },
    [handleFilterChange]
  );

  // Date range filter handler
  const handleDateRangeFilter = useCallback(
    (startDate, endDate) => {
      handleFilterChange({
        startDate: startDate?.toISOString() || '',
        endDate: endDate?.toISOString() || '',
      });
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

  // Calculate if filters can be reset
  const canReset = useMemo(
    () =>
      Object.entries(filters).some(([key, value]) => {
        if (key === 'status') return value !== 'all';
        if (Array.isArray(value)) return value.length > 0;
        return value !== '' && value !== null && value !== undefined && value !== 'all';
      }) || !!search,
    [filters, search]
  );

  return {
    // Data
    reviews: reviews || [],
    reviewsLoading,
    reviewsError,
    paginationMeta,
    mutate: mutateReviews,

    // State
    filters,
    search,
    page,
    rowsPerPage,

    // Handlers
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handleEntitySelect,
    handlePageChange,
    handleRowsPerPageChange,
    handleFilterTab,
    handleRatingFilter,
    handleEntityTypeFilter,
    handleDateRangeFilter,

    // Utilities
    resetPage,
    updateFilters,

    // Computed values
    apiFilters,
    safeSearch: typeof search === 'string' ? search.trim() : '',
    totalResults: paginationMeta?.total || 0,
    hasResults: (reviews || []).length > 0,
    hasFilters: Object.keys(apiFilters).length > 0,
    canReset,
    hasLoadedFromStorage,
  };
}
