/**
 * IndexedDB utility functions for filter state persistence without TTL
 *
 * This module provides specialized functions for storing and retrieving
 * filter state in IndexedDB with permanent storage (no expiration).
 * Used specifically for preserving user filter preferences across navigation.
 *
 * @namespace CityArtWalks.Lib.IndexDBFilters
 * @fileoverview IndexedDB filter persistence utilities without TTL
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/jakearchibald/idb-keyval} idb-keyval - Simple IndexedDB wrapper for key-value storage
 * @requires CityArtWalks.Utils.Debug - Debug utilities for filter operation logging and error handling
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexDB} - IndexedDB documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Filters} - Filter persistence documentation
 */
import { get, set, del } from 'idb-keyval';

import { debugLog, debugError } from './debug';

/**
 * Creates a unique storage key for filter state based on entity type, viewType and search params
 *
 * @function createFilterStorageKey
 * @memberof CityArtWalks.Lib.IndexDBFilters
 * @param {string} entityType - The entity type (e.g., 'art-piece', 'artist', 'city')
 * @param {string} viewType - The view type (e.g., 'explore', 'home', 'profile')
 * @param {Object} searchParams - Current URL search parameters
 * @returns {string} Unique storage key for the filter state
 *
 * @example
 * createFilterStorageKey('art-piece', 'explore', { country: 'US', state: 'CA' })
 * // => "art-piece-filters?::explore?::country=US&state=CA"
 *
 * createFilterStorageKey('artist', 'home', {})
 * // => "artist-filters?::home"
 */
export function createFilterStorageKey(entityType, viewType, searchParams = {}) {
  const baseKey = `${entityType}-filters?::${viewType}`;

  // Convert search params to sorted string for consistent key generation
  const paramEntries = Object.entries(searchParams)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));

  if (paramEntries.length === 0) {
    return baseKey;
  }

  const paramString = paramEntries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${baseKey}::${paramString}`;
}

/**
 * Save filter state to IndexedDB with permanent storage (no TTL)
 *
 * Stores filter state including filters, search, pagination settings without expiration.
 * The stored entry persists until explicitly cleared or overwritten.
 *
 * @function saveFiltersToIndexedDb
 * @memberof CityArtWalks.Lib.IndexDBFilters
 * @param {string} entityType - The entity type (e.g., 'art-piece', 'artist', 'city')
 * @param {string} viewType - The view type identifier
 * @param {Object} searchParams - Current URL search parameters
 * @param {Object} filterState - The complete filter state to save
 * @param {Object} filterState.filters - Filter values object
 * @param {string} filterState.search - Search query string
 * @param {number} filterState.page - Current page number
 * @param {number} filterState.rowsPerPage - Items per page
 * @returns {Promise<void>} Promise that resolves when filters are saved
 *
 * @example
 * await saveFiltersToIndexedDb('art-piece', 'explore', {}, {
 *   filters: { countryId: 'US', featured: true },
 *   search: 'sculpture',
 *   page: 0,
 *   rowsPerPage: 12
 * });
 */
export async function saveFiltersToIndexedDb(entityType, viewType, searchParams, filterState) {
  const key = createFilterStorageKey(entityType, viewType, searchParams);

  try {
    const dataToStore = {
      filters: filterState.filters || {},
      search: filterState.search || '',
      page: filterState.page || 0,
      rowsPerPage: filterState.rowsPerPage || 12,
      savedAt: Date.now(), // For debugging/reference only, not for TTL
      viewType,
      searchParams,
    };

    await set(key, dataToStore);
    debugLog(
      'IndexDBFilters.saveFiltersToIndexedDb',
      `Saved ${entityType} filters for ${viewType}:`,
      dataToStore
    );
  } catch (err) {
    debugError('IndexDBFilters.saveFiltersToIndexedDb', `Save failed for ${key}:`, err);
  }
}

/**
 * Load filter state from IndexedDB with permanent storage
 *
 * Retrieves stored filter state from IndexedDB. Since there's no TTL,
 * the data persists until explicitly cleared or the browser storage is cleared.
 *
 * @function loadFiltersFromIndexedDb
 * @memberof CityArtWalks.Lib.IndexDBFilters
 * @param {string} entityType - The entity type (e.g., 'art-piece', 'artist', 'city')
 * @param {string} viewType - The view type identifier
 * @param {Object} searchParams - Current URL search parameters
 * @returns {Promise<Object|null>} Stored filter state if found, null otherwise
 *
 * @example
 * const savedState = await loadFiltersFromIndexedDb('art-piece', 'explore', {});
 * if (savedState) {
 *   // Apply saved filters, search, and pagination
 *   setFilters(savedState.filters);
 *   setSearch(savedState.search);
 *   setPage(savedState.page);
 * }
 */
export async function loadFiltersFromIndexedDb(entityType, viewType, searchParams) {
  const key = createFilterStorageKey(entityType, viewType, searchParams);

  try {
    const storedData = await get(key);

    if (!storedData) {
      debugLog(
        'IndexDBFilters.loadFiltersFromIndexedDb',
        `No stored ${entityType} filters found for ${viewType}`
      );
      return null;
    }

    debugLog(
      'IndexDBFilters.loadFiltersFromIndexedDb',
      `Loaded ${entityType} filters for ${viewType}:`,
      storedData
    );
    return {
      filters: storedData.filters || {},
      search: storedData.search || '',
      page: storedData.page || 0,
      rowsPerPage: storedData.rowsPerPage || 12,
    };
  } catch (err) {
    debugError('IndexDBFilters.loadFiltersFromIndexedDb', `Load failed for ${key}:`, err);
    return null;
  }
}

/**
 * Clear specific filter state from IndexedDB
 *
 * Removes a specific filter state entry from IndexedDB. Useful for
 * resetting filters or cleaning up when filters are manually cleared.
 *
 * @function clearFiltersFromIndexedDb
 * @memberof CityArtWalks.Lib.IndexDBFilters
 * @param {string} entityType - The entity type (e.g., 'art-piece', 'artist', 'city')
 * @param {string} viewType - The view type identifier
 * @param {Object} searchParams - Current URL search parameters
 * @returns {Promise<void>} Promise that resolves when filters are cleared
 *
 * @example
 * await clearFiltersFromIndexedDb('art-piece', 'explore', {});
 */
export async function clearFiltersFromIndexedDb(entityType, viewType, searchParams) {
  const key = createFilterStorageKey(entityType, viewType, searchParams);

  try {
    await del(key);
    debugLog(
      'IndexDBFilters.clearFiltersFromIndexedDb',
      `Cleared ${entityType} filters for ${viewType}`
    );
  } catch (err) {
    debugError('IndexDBFilters.clearFiltersFromIndexedDb', `Clear failed for ${key}:`, err);
  }
}

/**
 * Clear all filter states for a specific view type
 *
 * This function is more complex as IndexedDB doesn't support prefix-based deletion.
 * It would require getting all keys and filtering, which is not efficient.
 * For now, we'll provide a simpler version that clears the base key.
 *
 * @function clearAllFiltersForViewType
 * @memberof CityArtWalks.Lib.IndexDBFilters
 * @param {string} entityType - The entity type (e.g., 'art-piece', 'artist', 'city')
 * @param {string} viewType - The view type identifier
 * @returns {Promise<void>} Promise that resolves when base filters are cleared
 *
 * @example
 * await clearAllFiltersForViewType('art-piece', 'explore');
 */
export async function clearAllFiltersForViewType(entityType, viewType) {
  // For now, just clear the base key (no search params)
  await clearFiltersFromIndexedDb(entityType, viewType, {});
}

/**
 * Check if filter state exists for the given viewType and search params
 *
 * @function hasStoredFilters
 * @memberof CityArtWalks.Lib.IndexDBFilters
 * @param {string} entityType - The entity type (e.g., 'art-piece', 'artist', 'city')
 * @param {string} viewType - The view type identifier
 * @param {Object} searchParams - Current URL search parameters
 * @returns {Promise<boolean>} True if stored filters exist, false otherwise
 *
 * @example
 * const hasFilters = await hasStoredFilters('art-piece', 'explore', {});
 * if (hasFilters) {
 *   // Load and apply stored filters
 * }
 */
export async function hasStoredFilters(entityType, viewType, searchParams) {
  const key = createFilterStorageKey(entityType, viewType, searchParams);

  try {
    const storedData = await get(key);
    return storedData !== undefined;
  } catch (err) {
    debugError('IndexDBFilters.hasStoredFilters', `Check failed for ${key}:`, err);
    return false;
  }
}
