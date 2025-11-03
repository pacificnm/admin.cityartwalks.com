/**
 * React hooks for UserScore operations using SWR
 *
 * This module provides React hooks for user scoring system operations with SWR caching,
 * IndexedDB fallback, and automatic cache invalidation. This is a specialized scoring system
 * with read operations (leaderboard, history) and admin mutation operations (adjust, bonus, rebuild).
 * All hooks delegate to requests functions and provide consistent loading/error states.
 *
 * @namespace CityArtWalks.Actions.UserScore.Hooks
 * @fileoverview React hooks for user scoring data operations
 * @author CityArtWalks Development Team
 * @version 1.0.0
 *
 * @requires useSWR - SWR library for data fetching
 * @requires React - React hooks (useMemo, useEffect)
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 * @requires CityArtWalks.Lib.IndexedDB - IndexedDB caching utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserScore-Model} - UserScore model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserScore} - Database schema reference
 */

import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugError } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import * as requests from './requests.js';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
  dedupingInterval: 30000, // 30 seconds deduplication
};

/**
 * SWR hook for paginated user scores leaderboard with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.UserScore.Hooks
 * @function useGetPaginatedUserScores
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.search=''] - Search term for username/displayName fields
 * @param {string} [filters.timeFrame=''] - Time frame filter (day, week, month, year, all)
 * @param {string} [filters.minPoints=''] - Minimum points threshold
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated user scores result with IndexedDB caching
 * @returns {Array} returns.userScores - Array of user score objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.userScoresLoading - Loading state
 * @returns {Error} returns.userScoresError - Error state
 * @returns {boolean} returns.userScoresEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetPaginatedUserScores(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', timeFrame = '', minPoints = '' } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedUserScores',
      search,
      timeFrame,
      minPoints,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, timeFrame, minPoints, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getPaginatedUserScores(
          page,
          rowsPerPage,
          filters,
          token,
          revalidate
        );
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.UserScore.Hooks.useGetPaginatedUserScores',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.UserScore.Hooks.useGetPaginatedUserScores',
          'Failed to fetch paginated user scores',
          {
            error: err.message,
            filters,
            page,
            rowsPerPage,
            token: token ? '[REDACTED]' : 'none',
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.UserScore.Hooks.useGetPaginatedUserScores',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.UserScore.Hooks.useGetPaginatedUserScores',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      userScores: Array.isArray(data?.data?.userScores) ? data.data.userScores : [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      userScoresLoading: isLoading,
      userScoresError: error,
      userScoresEmpty:
        !isLoading && (!Array.isArray(data?.data?.userScores) || data.data.userScores.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for fetching a single user score by ID with IndexedDB caching
 *
 * @memberof CityArtWalks.Actions.UserScore.Hooks
 * @function useGetUserScoreById
 * @param {string|number} userId - The unique identifier of the user
 * @param {string} [token=''] - Optional Bearer token for authorization
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @returns {Object} User score data with loading and error states
 * @returns {Object} returns.userScore - User score object or null
 * @returns {boolean} returns.userScoreLoading - Loading state
 * @returns {Error} returns.userScoreError - Error state
 * @returns {boolean} returns.userScoreValidating - Revalidation state
 * @returns {boolean} returns.userScoreEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetUserScoreById(userId, token = '', revalidate = 600) {
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!userId) return { swrKey: null, cacheKey: null };
    const key = ['getUserScoreById', userId, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [userId, revalidate]);

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getUserScoreById(userId, token, revalidate);
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.UserScore.Hooks.useGetUserScoreById',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.UserScore.Hooks.useGetUserScoreById',
          'Failed to fetch user score by ID',
          {
            error: err.message,
            userId,
            token: token ? '[REDACTED]' : 'none',
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.UserScore.Hooks.useGetUserScoreById',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.UserScore.Hooks.useGetUserScoreById',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
            userId,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs, userId]);

  return useMemo(
    () => ({
      userScore: data?.data || null,
      userScoreLoading: isLoading,
      userScoreError: error,
      userScoreValidating: isValidating,
      userScoreEmpty: !isLoading && !data?.data,
    }),
    [data, isLoading, error, isValidating]
  );
}

/**
 * SWR hook for paginated user scoring history with IndexedDB caching support
 *
 * @memberof CityArtWalks.Actions.UserScore.Hooks
 * @function useGetUserScoreHistory
 * @param {Object} [filters={}] - Filter parameters object
 * @param {string} [filters.eventType=''] - Event type filter (ARTIST_CREATE, ART_PIECE_CREATE, etc.)
 * @param {string} [filters.startDate=''] - Start date for date range filtering
 * @param {string} [filters.endDate=''] - End date for date range filtering
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Required Bearer token for authorization (user or admin)
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger manual refresh
 * @returns {Object} Paginated user scoring history result with IndexedDB caching
 * @returns {Array} returns.userHistory - Array of user event objects
 * @returns {Object} returns.paginationMeta - Pagination metadata
 * @returns {boolean} returns.userHistoryLoading - Loading state
 * @returns {Error} returns.userHistoryError - Error state
 * @returns {boolean} returns.userHistoryEmpty - Empty state
 * @returns {Function} returns.mutate - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useGetUserScoreHistory(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { eventType = '', startDate = '', endDate = '' } = filters;
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getUserScoreHistory',
      eventType,
      startDate,
      endDate,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [eventType, startDate, endDate, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      try {
        const response = await requests.getUserScoreHistory(
          page,
          rowsPerPage,
          filters,
          token,
          revalidate
        );
        if (response && cacheKey) {
          await saveToIndexedDb(cacheKey, response);
          debugLog(
            'CityArtWalks.Actions.UserScore.Hooks.useGetUserScoreHistory',
            `[IndexedDB] Saved data for ${cacheKey}`
          );
        }
        return response;
      } catch (err) {
        debugError(
          'CityArtWalks.Actions.UserScore.Hooks.useGetUserScoreHistory',
          'Failed to fetch user score history',
          {
            error: err.message,
            filters,
            page,
            rowsPerPage,
            token: token ? '[REDACTED]' : 'none',
          }
        );
        throw err;
      }
    },
    swrOptions
  );

  // IndexedDB fallback loading
  useEffect(() => {
    if (!cacheKey || !mutate) return;
    (async () => {
      try {
        const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
        if (cached) {
          debugLog(
            'CityArtWalks.Actions.UserScore.Hooks.useGetUserScoreHistory',
            `[IndexedDB] Cache hit for ${cacheKey}`
          );
          mutate(cached, false);
        }
      } catch (cacheError) {
        debugError(
          'CityArtWalks.Actions.UserScore.Hooks.useGetUserScoreHistory',
          'IndexedDB cache operation failed',
          {
            error: cacheError.message,
            cacheKey,
          }
        );
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      userHistory: Array.isArray(data?.data?.userEvents) ? data.data.userEvents : [],
      paginationMeta: data?.data?.meta || {
        total: 0,
        page: 1,
        rowsPerPage: 10,
        totalPages: 0,
      },
      userHistoryLoading: isLoading,
      userHistoryError: error,
      userHistoryEmpty:
        !isLoading && (!Array.isArray(data?.data?.userEvents) || data.data.userEvents.length === 0),
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * Hook for adjusting a user's score manually (admin only operation) with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.UserScore.Hooks
 * @function useAdjustUserScore
 * @param {string} [token=''] - Required Bearer token for admin authorization
 * @returns {Function} Async function to adjust a user score
 * @returns {Promise<Object>} returns.result - Score adjustment response
 * @throws {Error} When adjustment data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useAdjustUserScore(token = '') {
  const { mutate } = useSWRConfig();

  return async (adjustmentData) => {
    try {
      const result = await requests.adjustUserScore(adjustmentData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('userScore') ||
            key.includes('getPaginatedUserScores') ||
            key.includes('getUserScoreHistory') ||
            (key.includes('getUserScoreById') && key.includes(adjustmentData.userId)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['userScore', 'getPaginatedUserScores', 'getUserScoreHistory'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.UserScore.Hooks.useAdjustUserScore',
        'Failed to adjust user score',
        {
          error: error.message,
          adjustmentData: adjustmentData ? 'provided' : 'missing',
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for awarding bonus points to a user (admin only operation) with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.UserScore.Hooks
 * @function useAwardBonusPoints
 * @param {string} [token=''] - Required Bearer token for admin authorization
 * @returns {Function} Async function to award bonus points
 * @returns {Promise<Object>} returns.result - Bonus award response
 * @throws {Error} When bonus data validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useAwardBonusPoints(token = '') {
  const { mutate } = useSWRConfig();

  return async (bonusData) => {
    try {
      const result = await requests.awardBonusPoints(bonusData, token);

      // Invalidate SWR cache
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('userScore') ||
            key.includes('getPaginatedUserScores') ||
            key.includes('getUserScoreHistory') ||
            (key.includes('getUserScoreById') && key.includes(bonusData.userId)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['userScore', 'getPaginatedUserScores', 'getUserScoreHistory'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.UserScore.Hooks.useAwardBonusPoints',
        'Failed to award bonus points',
        {
          error: error.message,
          bonusData: bonusData ? 'provided' : 'missing',
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Hook for rebuilding a user's score from event history (admin only operation) with automatic cache invalidation
 *
 * @memberof CityArtWalks.Actions.UserScore.Hooks
 * @function useRebuildUserScore
 * @param {string} [token=''] - Required Bearer token for admin authorization
 * @returns {Function} Async function to rebuild a user score
 * @returns {Promise<Object>} returns.result - Rebuild response
 * @throws {Error} When user ID is invalid or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useRebuildUserScore(token = '') {
  const { mutate } = useSWRConfig();

  return async (userId) => {
    try {
      const result = await requests.rebuildUserScore(userId, token);

      // Invalidate SWR cache - comprehensive invalidation
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key.includes('userScore') ||
            key.includes('getPaginatedUserScores') ||
            key.includes('getUserScoreHistory') ||
            (key.includes('getUserScoreById') && key.includes(userId)))
      );

      // Clear related IndexedDB cache entries manually
      const cachePatterns = ['userScore', 'getPaginatedUserScores', 'getUserScoreHistory'];
      for (const pattern of cachePatterns) {
        const cacheKey = buildCacheKeyFromSWRKey([pattern]);
        await saveToIndexedDb(cacheKey, null);
      }

      return result;
    } catch (error) {
      debugError(
        'CityArtWalks.Actions.UserScore.Hooks.useRebuildUserScore',
        'Failed to rebuild user score',
        {
          error: error.message,
          userId,
          token: token ? '[REDACTED]' : 'none',
        }
      );
      throw error;
    }
  };
}

/**
 * Combined hook that provides all user score mutation functions
 *
 * @memberof CityArtWalks.Actions.UserScore.Hooks
 * @function useUserScoreMutations
 * @param {string} [token=''] - Required Bearer token for admin authorization
 * @returns {Object} Object containing all mutation functions
 * @returns {Function} returns.adjustUserScore - Function to adjust user score
 * @returns {Function} returns.awardBonusPoints - Function to award bonus points
 * @returns {Function} returns.rebuildUserScore - Function to rebuild user score
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 */
export function useUserScoreMutations(token = '') {
  const adjustUserScore = useAdjustUserScore(token);
  const awardBonusPoints = useAwardBonusPoints(token);
  const rebuildUserScore = useRebuildUserScore(token);

  return {
    adjustUserScore,
    awardBonusPoints,
    rebuildUserScore,
  };
}
