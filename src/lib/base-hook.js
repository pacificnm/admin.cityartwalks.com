/**
 * @file base-hook.js
 * @description Base hook utilities for SWR-based data fetching with IndexedDB caching and debug logging.
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Lib.BaseHook
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/BaseHook} - Complete documentation
 */

import { useMemo, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";

import { debugLog, debugWarn, debugError } from "src/lib/debug";
import {
  saveToIndexedDb,
  loadFromIndexedDb,
  buildCacheKeyFromSWRKey,
} from "src/lib/indexDb";

/**
 * Base hook factory that creates hook utilities with namespace support.
 * Use this to create consistent hook patterns across different entities.
 *
 * @param {string} namespace - The namespace for logging (e.g., 'CityArtWalks.Actions.User.Hooks')
 * @returns {Object} Hook utilities with consistent patterns
 */
export function useBaseHook(namespace = "BaseHook") {
  const defaultSWRConfig = {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  };

  const logger = useMemo(
    () => ({
      /**
       * Log informational messages with namespace.
       * @param {string} message - The message to log
       * @param {Object} [data={}] - Additional data to include in the log
       */
      log: (message, data = {}) => debugLog(`${namespace}.${message}`, data),

      /**
       * Log warning messages with namespace.
       * @param {string} message - The warning message to log
       * @param {Object} [data={}] - Additional data to include in the log
       */
      warn: (message, data = {}) => debugWarn(`${namespace}.${message}`, data),

      /**
       * Log error messages with namespace and function context.
       * @param {string} functionName - The name of the function where the error occurred
       * @param {string} message - The error message to log
       * @param {Object} [data={}] - Additional data to include in the log
       */
      error: (functionName, message, data = {}) =>
        debugError(`${namespace}.${functionName}`, message, data),
    }),
    [namespace]
  );

  const cacheUtils = useMemo(
    () => ({
      /**
       * Save data to IndexedDB cache with error handling.
       * @param {string} cacheKey - The cache key to store data under
       * @param {*} data - The data to cache
       * @returns {Promise<void>}
       */
      async saveToCache(cacheKey, data) {
        try {
          await saveToIndexedDb(cacheKey, data);
          logger.log(`Cache saved for ${cacheKey}`);
        } catch (err) {
          logger.error("saveToCache", "Failed to save to cache", {
            error: err.message,
            cacheKey,
          });
        }
      },

      /**
       * Load data from IndexedDB cache with staleness check.
       * @param {string} cacheKey - The cache key to retrieve data from
       * @param {number} revalidateMs - Maximum age in milliseconds before cache is considered stale
       * @returns {Promise<*|null>} The cached data or null if not found/stale
       */
      async loadFromCache(cacheKey, revalidateMs) {
        try {
          const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
          if (cached) {
            logger.log(`Cache hit for ${cacheKey}`);
            return cached;
          } else {
            logger.warn(`Cache miss for ${cacheKey}`);
            return null;
          }
        } catch (err) {
          logger.error("loadFromCache", "Failed to load from cache", {
            error: err.message,
            cacheKey,
          });
          return null;
        }
      },
    }),
    [logger]
  );

  const validators = useMemo(
    () => ({
      /**
       * Validate data using a Zod schema with proper error logging.
       * @param {*} data - Data to validate
       * @param {Object} schema - Zod schema to validate against
       * @param {string} functionName - Name of the function being validated (for error logging)
       * @param {boolean} [throwOnError=false] - Whether to throw an error on validation failure
       * @returns {Object} Result object with success boolean and data/error
       * @returns {boolean} returns.success - Whether validation passed
       * @returns {*} returns.data - Validated data (if success is true)
       * @returns {Object} returns.error - Zod error object (if success is false)
       * @throws {Error} When validation fails and throwOnError is true
       */
      validateWithSchema(data, schema, functionName, throwOnError = false) {
        try {
          const result = schema.safeParse(data);
          if (!result.success) {
            logger.error(functionName, "Schema validation failed", {
              errors: result.error.errors,
              data: data ? "provided" : "missing",
            });
            if (throwOnError) {
              throw new Error(
                `Validation failed: ${result.error.errors[0]?.message || "Unknown error"}`
              );
            }
          }
          return result;
        } catch (err) {
          logger.error(functionName, "Schema validation error", {
            error: err.message,
            data: data ? "provided" : "missing",
          });
          if (throwOnError) {
            throw err;
          }
          return { success: false, error: err };
        }
      },
    }),
    [logger]
  );

  const utils = useMemo(
    () => ({
      /**
       * Generate SWR key and corresponding IndexedDB cache key from parameters.
       * @param {Array} keyArray - Array of parameters to create the key from
       * @returns {Object} Object containing swrKey and cacheKey
       * @returns {Array} returns.swrKey - The SWR key array
       * @returns {string} returns.cacheKey - The IndexedDB cache key
       */
      generateKeys(keyArray) {
        return {
          swrKey: keyArray,
          cacheKey: buildCacheKeyFromSWRKey(keyArray),
        };
      },

      /**
       * Redact sensitive data for safe logging.
       * @param {*} value - The value to potentially redact
       * @param {string} [field='token'] - The type of field ('token', 'email', etc.)
       * @returns {string} Redacted or original value
       */
      redactSensitive(value, field = "token") {
        if (field === "token") {
          return value ? "[REDACTED]" : "none";
        }
        if (field === "email") {
          return value ? "[REDACTED]" : "empty";
        }
        return value;
      },

      /**
       * Invalidate SWR cache entries matching the given patterns.
       * @param {Function} mutate - SWR mutate function from useSWRConfig
       * @param {string[]} [cacheKeyPatterns=[]] - Array of patterns to match cache keys against
       */
      invalidateCache(mutate, cacheKeyPatterns = []) {
        mutate((key) => {
          if (!Array.isArray(key)) return false;
          return cacheKeyPatterns.some((pattern) => key.includes(pattern));
        });
      },
    }),
    []
  );

  /**
   * Custom hook for IndexedDB cache loading with automatic cache restoration.
   * @param {string|null} cacheKey - The cache key to load from
   * @param {Function} mutate - SWR mutate function to update cache
   * @param {number} revalidateMs - Maximum cache age in milliseconds
   */
  const useIndexedDBCache = (cacheKey, mutate, revalidateMs) => {
    useEffect(() => {
      if (!cacheKey || !mutate) return;

      (async () => {
        const cached = await cacheUtils.loadFromCache(cacheKey, revalidateMs);
        if (cached) {
          mutate({ data: cached }, false);
        }
      })();
    }, [cacheKey, mutate, revalidateMs]);
  };

  /**
   * Enhanced SWR hook with automatic IndexedDB caching.
   * @param {Array|null} swrKey - SWR key array or null to disable
   * @param {Function} fetcher - Async function that returns data
   * @param {number} [revalidate=600] - Revalidation time in seconds
   * @param {Object} [customConfig={}] - Additional SWR configuration options
   * @returns {Object} SWR hook result with data, loading states, error, and mutate function
   */
  const useSWRWithCache = (
    swrKey,
    fetcher,
    revalidate = 600,
    customConfig = {}
  ) => {
    const revalidateMs = revalidate * 1000;
    const { cacheKey } = utils.generateKeys(swrKey || []);

    const config = {
      ...defaultSWRConfig,
      ...customConfig,
    };

    const { data, isLoading, error, isValidating, mutate } = useSWR(
      swrKey,
      async () => {
        const response = await fetcher();
        if (cacheKey && response?.data) {
          await cacheUtils.saveToCache(cacheKey, response.data);
        }
        return response;
      },
      config
    );

    useIndexedDBCache(cacheKey, mutate, revalidateMs);

    return { data, isLoading, error, isValidating, mutate };
  };

  /**
   * Mutation hook with automatic cache invalidation.
   * @param {Function} mutationFn - Async function that performs the mutation
   * @param {string[]} [invalidationPatterns=[]] - Array of cache key patterns to invalidate
   * @returns {Function} Async function that executes the mutation and invalidates cache
   */
  const useMutationWithInvalidation = (
    mutationFn,
    invalidationPatterns = []
  ) => {
    const { mutate } = useSWRConfig();

    return async (...args) => {
      const result = await mutationFn(...args);
      utils.invalidateCache(mutate, invalidationPatterns);
      return result;
    };
  };

  return {
    /** Logger utilities with namespace support */
    logger,
    /** IndexedDB cache utilities */
    cacheUtils,
    /** Zod schema validation utilities */
    validators,
    /** General utility functions */
    utils,
    /** Hook for IndexedDB cache loading */
    useIndexedDBCache,
    /** Enhanced SWR hook with caching */
    useSWRWithCache,
    /** Mutation hook with cache invalidation */
    useMutationWithInvalidation,
  };
}
