/**
 * IndexedDB utility functions for client-side caching with TTL support
 *
 * This module provides wrapper functions around idb-keyval for storing and retrieving
 * cached data in IndexedDB with automatic expiration handling. Used primarily for
 * caching API responses and reducing server load. Implements time-to-live (TTL)
 * functionality with automatic cleanup of expired entries.
 *
 * @namespace CityArtWalks.Lib.IndexDB
 * @fileoverview IndexedDB caching utilities with TTL support
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/jakearchibald/idb-keyval} idb-keyval - Simple IndexedDB wrapper for key-value storage
 * @requires CityArtWalks.Utils.Debug - Debug utilities for cache operation logging and error handling
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexDB} - IndexedDB documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Debug} - Debug utilities documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API} - IndexedDB API documentation
 * @see {@link https://github.com/jakearchibald/idb-keyval} - idb-keyval library documentation
 */
import { get, set, del } from 'idb-keyval';

import { debugInfo, debugError } from './debug';
/**
 * Save JSON data to IndexedDB with a timestamp for TTL caching.
 *
 * Stores data with automatic timestamp for cache expiration tracking.
 * The stored entry includes both the data and a timestamp for age calculation.
 *
 * @function saveToIndexedDb
 * @memberof CityArtWalks.Lib.IndexDB
 * @param {string} key - Cache key identifier
 * @param {Object} data - The data object to cache
 * @returns {Promise<void>} Promise that resolves when data is saved
 * @throws {Error} Logs error if IndexedDB save operation fails
 *
 * @example
 * await saveToIndexedDb('art-pieces-featured', { artPieces: [...] });
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexDB} - IndexedDB documentation
 */
export async function saveToIndexedDb(key, data) {
  try {
    await set(key, {
      data,
      timestamp: Date.now(),
    });
  } catch (err) {
    debugError(`[CityArtWalks.Lib.IndexDB.saveToIndexedDb] Save failed for ${key}:`, err);
  }
}

/**
 * Load cached JSON data if it's within the revalidation time window.
 *
 * Retrieves cached data from IndexedDB and checks if it's still valid based on
 * the provided revalidation window. Automatically deletes expired entries.
 * Provides detailed logging for cache hits, misses, and expirations.
 *
 * @function loadFromIndexedDb
 * @memberof CityArtWalks.Lib.IndexDB
 * @param {string} key - Cache key identifier
 * @param {number} [revalidateMs=600000] - Maximum age in milliseconds (default: 10 minutes)
 * @returns {Promise<Object|null>} Cached data if valid, null if expired or not found
 * @throws {Error} Logs error and returns null if IndexedDB operation fails
 *
 * @example
 * // Load with default 10-minute TTL
 * const data = await loadFromIndexedDb('art-pieces-featured');
 *
 * // Load with custom 1-hour TTL
 * const data = await loadFromIndexedDb('user-profile', 3600000);
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexDB} - IndexedDB documentation
 */
export async function loadFromIndexedDb(key, revalidateMs = 600_000) {
  try {
    const entry = await get(key);
    if (!entry) {
      debugInfo(`[CityArtWalks.Lib.IndexDB.loadFromIndexedDb] MISS: ${key} (no entry)`);
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const expired = age > revalidateMs;

    if (expired) {
      debugInfo(
        `[CityArtWalks.Lib.IndexDB.loadFromIndexedDb] EXPIRED: ${key} (age: ${Math.floor(age / 1000)}s, limit: ${Math.floor(revalidateMs / 1000)}s)`
      );
      await del(key);
      return null;
    }

    debugInfo(
      `[CityArtWalks.Lib.IndexDB.loadFromIndexedDb] HIT: ${key} (age: ${Math.floor(age / 1000)}s)`
    );
    return entry.data;
  } catch (err) {
    debugError(`[CityArtWalks.Lib.IndexDB.loadFromIndexedDb] ERROR: ${key}`, err);
    return null;
  }
}

/**
 * Clear a specific IndexedDB cache entry manually.
 *
 * Removes a specific cache entry from IndexedDB. Useful for cache invalidation
 * when data needs to be refreshed immediately or for cleanup operations.
 *
 * @function deleteFromIndexedDb
 * @memberof CityArtWalks.Lib.IndexDB
 * @param {string} key - Cache key identifier to delete
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 * @throws {Error} Logs error if IndexedDB delete operation fails
 *
 * @example
 * await deleteFromIndexedDb('art-pieces-featured');
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexDB} - IndexedDB documentation
 */
export async function deleteFromIndexedDb(key) {
  try {
    await del(key);
  } catch (err) {
    debugError(`[CityArtWalks.Lib.IndexDB.deleteFromIndexedDb] Delete failed for ${key}:`, err);
  }
}

/**
 * Converts an SWR key (array or string) into a stable, stringified cache key.
 *
 * Transforms SWR keys into consistent string format suitable for IndexedDB storage.
 * Handles both array and string keys with proper URL encoding to prevent conflicts.
 * Array elements are joined with '::' delimiter for readability and uniqueness.
 *
 * @function buildCacheKeyFromSWRKey
 * @memberof CityArtWalks.Lib.IndexDB
 * @param {string|Array} swrKey - The SWR key used for the request
 * @returns {string} A URL-encoded string cache key safe for IndexedDB
 *
 * @example
 * // Array key transformation
 * buildCacheKeyFromSWRKey(['getArtPieceFeatured', 'US', 'OR', 'Portland', 600])
 * // => "getArtPieceFeatured?::US?::OR?::Portland?::600"
 *
 * // String key transformation
 * buildCacheKeyFromSWRKey('/api/art-pieces')
 * // => "%2Fapi%2Fart-pieces"
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexDB} - IndexedDB documentation
 */
export function buildCacheKeyFromSWRKey(swrKey) {
  if (Array.isArray(swrKey)) {
    return swrKey.map((part) => encodeURIComponent(String(part))).join('::');
  }

  return encodeURIComponent(String(swrKey));
}
