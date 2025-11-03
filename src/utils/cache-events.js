/**
 * @fileoverview Cache Invalidation Event System
 *
 * Provides a centralized event system for coordinating cache invalidation
 * across different components and views in the IndexNow submission system.
 * This ensures that when data is updated in one part of the application,
 * other components can react and refresh their data accordingly.
 *
 * @namespace CityArtWalks.Utils.CacheEvents
 * @version 1.0.0
 * @author GitHub Copilot
 *
 * @example
 * // Listen for IndexNow submission updates
 * import { subscribeToIndexNowUpdates, emitIndexNowUpdate } from 'src/utils/cache-events';
 *
 * // In a component
 * useEffect(() => {
 *   const unsubscribe = subscribeToIndexNowUpdates(() => {
 *     // Refresh data when updates occur
 *     refreshData();
 *   });
 *   return unsubscribe;
 * }, []);
 *
 * // When processing a submission
 * emitIndexNowUpdate('123');
 */

import { debugLog } from 'src/lib/debug';

/**
 * Global event target for cache invalidation events
 * @private
 */
const cacheEventTarget = new EventTarget();

/**
 * Event types for cache invalidation
 * @readonly
 * @enum {string}
 */
export const CACHE_EVENT_TYPES = {
  INDEXNOW_SUBMISSION_UPDATE: 'indexnow-submission-update',
  INDEXNOW_SUBMISSION_PROCESS: 'indexnow-submission-process',
  INDEXNOW_LIST_REFRESH: 'indexnow-list-refresh',
};

/**
 * Emits an IndexNow submission update event
 *
 * @memberof CityArtWalks.Utils.CacheEvents
 * @function emitIndexNowUpdate
 * @param {string|number} submissionId - The ID of the updated submission
 * @param {Object} [data] - Additional data about the update
 *
 * @example
 * emitIndexNowUpdate('123', { status: 'SUCCESS' });
 */
export function emitIndexNowUpdate(submissionId, data = {}) {
  const event = new CustomEvent(CACHE_EVENT_TYPES.INDEXNOW_SUBMISSION_UPDATE, {
    detail: { submissionId, ...data },
  });

  debugLog(
    'CityArtWalks.Utils.CacheEvents.emitIndexNowUpdate',
    `Emitting IndexNow update event for submission: ${submissionId}`,
    data
  );

  cacheEventTarget.dispatchEvent(event);
}

/**
 * Emits an IndexNow submission process event
 *
 * @memberof CityArtWalks.Utils.CacheEvents
 * @function emitIndexNowProcess
 * @param {string|number} submissionId - The ID of the processed submission
 * @param {Object} [data] - Additional data about the processing
 *
 * @example
 * emitIndexNowProcess('123', { success: true });
 */
export function emitIndexNowProcess(submissionId, data = {}) {
  const event = new CustomEvent(CACHE_EVENT_TYPES.INDEXNOW_SUBMISSION_PROCESS, {
    detail: { submissionId, ...data },
  });

  debugLog(
    'CityArtWalks.Utils.CacheEvents.emitIndexNowProcess',
    `Emitting IndexNow process event for submission: ${submissionId}`,
    data
  );

  cacheEventTarget.dispatchEvent(event);
}

/**
 * Emits a general IndexNow list refresh event
 *
 * @memberof CityArtWalks.Utils.CacheEvents
 * @function emitIndexNowListRefresh
 * @param {Object} [data] - Additional data about the refresh
 *
 * @example
 * emitIndexNowListRefresh({ source: 'bulk-action' });
 */
export function emitIndexNowListRefresh(data = {}) {
  const event = new CustomEvent(CACHE_EVENT_TYPES.INDEXNOW_LIST_REFRESH, {
    detail: data,
  });

  debugLog(
    'CityArtWalks.Utils.CacheEvents.emitIndexNowListRefresh',
    'Emitting IndexNow list refresh event',
    data
  );

  cacheEventTarget.dispatchEvent(event);
}

/**
 * Subscribes to IndexNow submission update events
 *
 * @memberof CityArtWalks.Utils.CacheEvents
 * @function subscribeToIndexNowUpdates
 * @param {Function} callback - Function to call when updates occur
 * @returns {Function} Unsubscribe function
 *
 * @example
 * const unsubscribe = subscribeToIndexNowUpdates((event) => {
 *   console.log('Submission updated?:', event.detail.submissionId);
 *   refreshData();
 * });
 *
 * // Later, to unsubscribe
 * unsubscribe();
 */
export function subscribeToIndexNowUpdates(callback) {
  const handler = (event) => {
    debugLog(
      'CityArtWalks.Utils.CacheEvents.subscribeToIndexNowUpdates.handler',
      'Received IndexNow update event',
      event.detail
    );
    callback(event);
  };

  cacheEventTarget.addEventListener(CACHE_EVENT_TYPES.INDEXNOW_SUBMISSION_UPDATE, handler);

  return () => {
    cacheEventTarget.removeEventListener(CACHE_EVENT_TYPES.INDEXNOW_SUBMISSION_UPDATE, handler);
  };
}

/**
 * Subscribes to IndexNow submission process events
 *
 * @memberof CityArtWalks.Utils.CacheEvents
 * @function subscribeToIndexNowProcess
 * @param {Function} callback - Function to call when processing occurs
 * @returns {Function} Unsubscribe function
 *
 * @example
 * const unsubscribe = subscribeToIndexNowProcess((event) => {
 *   console.log('Submission processed?:', event.detail.submissionId);
 *   refreshList();
 * });
 */
export function subscribeToIndexNowProcess(callback) {
  const handler = (event) => {
    debugLog(
      'CityArtWalks.Utils.CacheEvents.subscribeToIndexNowProcess.handler',
      'Received IndexNow process event',
      event.detail
    );
    callback(event);
  };

  cacheEventTarget.addEventListener(CACHE_EVENT_TYPES.INDEXNOW_SUBMISSION_PROCESS, handler);

  return () => {
    cacheEventTarget.removeEventListener(CACHE_EVENT_TYPES.INDEXNOW_SUBMISSION_PROCESS, handler);
  };
}

/**
 * Subscribes to IndexNow list refresh events
 *
 * @memberof CityArtWalks.Utils.CacheEvents
 * @function subscribeToIndexNowListRefresh
 * @param {Function} callback - Function to call when list refresh is needed
 * @returns {Function} Unsubscribe function
 *
 * @example
 * const unsubscribe = subscribeToIndexNowListRefresh((event) => {
 *   console.log('List refresh requested?:', event.detail);
 *   refreshList();
 * });
 */
export function subscribeToIndexNowListRefresh(callback) {
  const handler = (event) => {
    debugLog(
      'CityArtWalks.Utils.CacheEvents.subscribeToIndexNowListRefresh.handler',
      'Received IndexNow list refresh event',
      event.detail
    );
    callback(event);
  };

  cacheEventTarget.addEventListener(CACHE_EVENT_TYPES.INDEXNOW_LIST_REFRESH, handler);

  return () => {
    cacheEventTarget.removeEventListener(CACHE_EVENT_TYPES.INDEXNOW_LIST_REFRESH, handler);
  };
}
