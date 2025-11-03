/**
 * @file filters.js
 * @description Custom hook for managing notification filtering, pagination, and search logic
 * @namespace CityArtWalks.Hooks.UseNotificationFilters
 * @version 1.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Notification-Model} - Notification model documentation
 */

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { useGetPaginatedNotifications } from 'src/actions/notification/hooks';
import { saveFiltersToIndexedDb, loadFiltersFromIndexedDb } from 'src/lib/indexDb-filters';

/**
 * @memberof CityArtWalks.Hooks.UseNotificationFilters
 * @description Custom hook that manages notification filtering, pagination, and search functionality.
 * Consolidates common logic shared across profile and admin views.
 *
 * Features: * - Pagination state management (0-based for Material-UI compatibility)
 * - Filter state for notification properties
 * - Search functionality with debounced input
 * - API filter preparation and validation
 * - Common event handlers for filter changes
 *
 * @example
 * // Basic usage in profile view
 * const {
 *   notifications,
 *   notificationsLoading,
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
 * } = useNotificationFilters({
 *   initialFilters: { isRead: false },
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
export function useNotificationFilters({
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
  const [page, setPage] = useState(0); // 0-based for Material-UI
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load filters from IndexedDB on mount
  useEffect(() => {
    if (!persistFilters) {
      setHasLoadedFromStorage(true);
      return;
    }

    const loadStoredFilters = async () => {
      try {
        const storedData = await loadFiltersFromIndexedDb('notification', viewType, searchParams);
        if (storedData && typeof storedData === 'object') {
          debugLog(
            'useNotificationFilters.loadStoredFilters',
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
          'useNotificationFilters.loadStoredFilters',
          'Failed to load filters from storage?:',
          error
        );
      } finally {
        setHasLoadedFromStorage(true);
      }
    };

    loadStoredFilters();
  }, [viewType, searchParams, persistFilters, initialFilters]);

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
        await saveFiltersToIndexedDb('notification', viewType, searchParams, dataToSave);
        debugLog('useNotificationFilters.saveFilters', 'Saved filters to IndexedDB?:', dataToSave);
      } catch (error) {
        debugWarn(
          'useNotificationFilters.saveFilters',
          'Failed to save filters to storage?:',
          error
        );
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

  // Defensive programming: ensure valid search string
  const safeSearch = typeof search === 'string' ? search : '';

  // Prepare API filters - filter out empty values and 'all' status
  const apiFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: safeSearch,
    };

    // Remove 'all' values for filters
    Object.keys(baseFilters).forEach((key) => {
      if (baseFilters[key] === 'all') {
        delete baseFilters[key];
      }
    });

    // Handle boolean filters (isRead)
    if (baseFilters.isRead === 'true') {
      baseFilters.isRead = true;
    } else if (baseFilters.isRead === 'false') {
      baseFilters.isRead = false;
    } else if (baseFilters.isRead === 'all') {
      delete baseFilters.isRead;
    }

    // Remove empty string values to avoid unnecessary filtering
    return Object.fromEntries(
      Object.entries(baseFilters).filter(
        ([key, value]) => value !== '' && value !== null && value !== undefined
      )
    );
  }, [filters, safeSearch]);

  // Fetch notifications - Convert page from 0-based to 1-based for API
  const { notifications, notificationsLoading, notificationsError, paginationMeta } =
    useGetPaginatedNotifications(
      apiFilters,
      page + 1, // Convert 0-based to 1-based
      rowsPerPage,
      accessToken,
      cacheTime
    );

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
    const defaultFilters = { ...initialFilters };
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
  const canReset = useMemo(
    () =>
      Object.entries(filters).some(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== '' && value !== null && value !== undefined && value !== 'all';
      }) || !!safeSearch,
    [filters, safeSearch]
  );

  return {
    // Data
    notifications: notifications || [],
    notificationsLoading,
    notificationsError,
    paginationMeta,

    // Filter state
    filters,
    search,
    safeSearch,
    page,
    rowsPerPage,
    canReset,
    hasLoadedFromStorage,

    // Event handlers
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
  };
}
