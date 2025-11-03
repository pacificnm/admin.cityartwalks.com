/**
 * @file hooks.js
 * @description SWR hooks for notification data with IndexedDB caching and optimistic updates.
 * @author Jaimie Garner
 * @version 2.0.0
 * @namespace CityArtWalks.Actions.Notification.Hooks
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import useSWR from 'swr';
import { useMemo, useEffect } from 'react';

import { debugLog, debugWarn } from 'src/lib/debug';
import { saveToIndexedDb, loadFromIndexedDb, buildCacheKeyFromSWRKey } from 'src/lib/indexDb';

import { useAuthContext } from 'src/auth/hooks';

import * as notificationRequests from './requests';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * SWR hook for paginated notifications with IndexedDB caching support.
 * @function useGetPaginatedNotifications
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.search=''] - Search query
 * @param {string} [filters.type=''] - Filter by type
 * @param {string} [filters.status=''] - Filter by status
 * @param {boolean} [filters.isRead=null] - Filter by read status
 * @param {string} [filters.userId=''] - Filter by user ID
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger refresh
 * @returns {Object} Paginated notifications result with IndexedDB caching
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetPaginatedNotifications(
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', type = '', status = '', isRead = null, userId = '' } = filters;
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = [
      'getPaginatedNotifications',
      search,
      type,
      status,
      isRead,
      userId,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [search, type, status, isRead, userId, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await notificationRequests.getPaginatedNotifications(
        page,
        rowsPerPage,
        filters,
        authToken,
        revalidate
      );
      await saveToIndexedDb(cacheKey, response);
      return response;
    },
    swrOptions
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;

    (async () => {
      const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
      if (cached) {
        debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
        mutate(cached, false);
      } else {
        debugWarn(`[IndexedDB] Cache miss for ${cacheKey}`);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      notifications: data?.data?.notifications || [],
      paginationMeta: data?.meta || { total: 0, page, rowsPerPage },
      notificationLoading: isLoading,
      notificationError: error,
      notificationEmpty:
        !isLoading && (!data?.data?.notifications || data?.data?.notifications.length === 0),
      mutate,
    }),
    [data, isLoading, error, page, rowsPerPage, mutate]
  );
}

/**
 * SWR hook for notifications by user with IndexedDB caching support.
 * @function useGetNotificationsByUser
 * @param {string} userId - User ID
 * @param {Object} [filters={}] - Filter options
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [rowsPerPage=10] - Number of items per page
 * @param {string} [token=''] - Auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger refresh
 * @returns {Object} User notifications result with IndexedDB caching
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetNotificationsByUser(
  userId,
  filters = {},
  page = 1,
  rowsPerPage = 10,
  token = '',
  revalidate = 600,
  refreshKey
) {
  const { search = '', type = '', status = '', isRead = null } = filters;
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    if (!userId) {
      return { swrKey: null, cacheKey: null };
    }

    const key = [
      'getNotificationsByUser',
      userId,
      search,
      type,
      status,
      isRead,
      page,
      rowsPerPage,
      revalidate,
    ];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [userId, search, type, status, isRead, page, rowsPerPage, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await notificationRequests.getNotificationsByUser(
        userId,
        page,
        rowsPerPage,
        filters,
        authToken,
        revalidate
      );
      await saveToIndexedDb(cacheKey, response);
      return response;
    },
    swrOptions
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;

    (async () => {
      const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
      if (cached) {
        debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
        mutate(cached, false);
      } else {
        debugWarn(`[IndexedDB] Cache miss for ${cacheKey}`);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(() => {
    // API returns: { data: { data: { notifications: [...] }, meta: {...} } }
    const notifications = data?.data?.data?.notifications || [];
    const empty =
      !isLoading &&
      (!data?.data?.data?.notifications || data?.data?.data?.notifications.length === 0);

    // Debug logging for hook state
    const debugInfo = {
      userId,
      dataExists: !!data,
      dataStructure: data ? Object.keys(data) : null,
      dataDataExists: !!data?.data,
      dataDataStructure: data?.data ? Object.keys(data?.data) : null,
      dataDataDataExists: !!data?.data?.data,
      dataDataDataStructure: data?.data?.data ? Object.keys(data?.data?.data) : null,
      notificationsCount: notifications.length,
      isLoading,
      error: error?.message,
      empty,
    };

    debugLog('useGetNotificationsByUser', 'Hook result', debugInfo);

    return {
      notifications,
      paginationMeta: data?.meta || { total: 0, page, rowsPerPage },
      notificationLoading: isLoading,
      notificationError: error,
      notificationEmpty: empty,
      mutate,
    };
  }, [data, isLoading, error, page, rowsPerPage, mutate, userId]);
}

/**
 * SWR hook for unread notifications count.
 * @function useUnreadNotifications
 * @param {string|number} userId - User ID
 * @param {string} [token=''] - Auth token
 * @param {number} [revalidate=60] - Revalidate interval in seconds (default 60s for badge updates)
 * @returns {Object} Unread count and loading state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useUnreadNotifications(userId, token = '', revalidate = 60) {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';

  const { data, isLoading, error, mutate } = useSWR(
    userId ? ['getUnreadNotifications', userId, revalidate] : null,
    async () => {
      const response = await notificationRequests.getNotificationsByUser(
        userId,
        1,
        1, // Only need count, not full data
        { isRead: false },
        authToken,
        revalidate
      );
      return response?.data?.meta?.total || 0;
    },
    {
      ...swrOptions,
      refreshInterval: revalidate * 1000, // Auto-refresh for real-time updates
    }
  );

  return useMemo(
    () => ({
      unreadCount: data || 0,
      unreadLoading: isLoading,
      unreadError: error,
      mutateUnread: mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

/**
 * SWR hook for single notification with IndexedDB caching support.
 * @function useGetNotification
 * @param {string|number} id - Notification ID
 * @param {string} [token=''] - Auth token
 * @param {number} [revalidate=600] - Revalidate interval in seconds
 * @param {*} [refreshKey] - Key to trigger refresh
 * @returns {Object} Single notification result with IndexedDB caching
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetNotification(id, token = '', revalidate = 600, refreshKey) {
  const { accessToken } = useAuthContext();
  const authToken = token || accessToken || '';
  const revalidateMs = revalidate * 1000;

  const { swrKey, cacheKey } = useMemo(() => {
    const key = ['getNotification', id, revalidate];
    return {
      swrKey: key,
      cacheKey: buildCacheKeyFromSWRKey(key),
    };
  }, [id, revalidate]);

  const { data, isLoading, error, mutate } = useSWR(
    swrKey,
    async () => {
      const response = await notificationRequests.getNotification(id, authToken, revalidate);
      await saveToIndexedDb(cacheKey, response);
      return response;
    },
    swrOptions
  );

  useEffect(() => {
    if (!cacheKey || !mutate) return;

    (async () => {
      const cached = await loadFromIndexedDb(cacheKey, revalidateMs);
      if (cached) {
        debugLog(`[IndexedDB] Cache hit for ${cacheKey}`);
        mutate(cached, false);
      } else {
        debugWarn(`[IndexedDB] Cache miss for ${cacheKey}`);
      }
    })();
  }, [cacheKey, mutate, revalidateMs]);

  useEffect(() => {
    if (refreshKey) mutate();
  }, [refreshKey, mutate]);

  return useMemo(
    () => ({
      notification: data?.data || null,
      notificationLoading: isLoading,
      notificationError: error,
      notificationEmpty: !isLoading && !data?.data,
      mutate,
    }),
    [data, isLoading, error, mutate]
  );
}
