/**
 * @namespace CityArtWalks.Actions.UserSessions.Hooks
 * @version 2.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */

import useSWR from 'swr';
import { useMemo } from 'react';

import * as requests from './requests';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * Hook to get all user sessions.
 * @function useGetUserSessions
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserSessions() {
  const key = ['getUserSessions'];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    requests.getUserSessions,
    swrOptions
  );

  return useMemo(() => {
    const userSessions = data?.data?.sessions || [];
    return {
      userSessions,
      userSessionsLoading: isLoading,
      userSessionsError: error,
      userSessionsValidating: isValidating,
      userSessionsEmpty: !isLoading && userSessions.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * Hook to get single user session by ID.
 * @function useGetUserSession
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserSession(userSessionId) {
  const key = ['getUserSession', userSessionId];
  const { data, isLoading, error, isValidating } = useSWR(
    userSessionId ? key : null,
    () => requests.getUserSession(userSessionId),
    swrOptions
  );

  return useMemo(() => {
    const userSession = data?.data?.userSession || null;
    return {
      userSession,
      userSessionLoading: isLoading,
      userSessionError: error,
      userSessionValidating: isValidating,
      userSessionEmpty: !isLoading && !userSession,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * Hook to get user sessions for a specific user.
 * @function useGetUserSessionsByUser
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserSessionsByUser(userId) {
  const key = ['getUserSessionsByUser', userId];
  const { data, isLoading, error, isValidating } = useSWR(
    userId ? key : null,
    () => requests.getUserSessionsByUser(userId),
    swrOptions
  );

  return useMemo(() => {
    const userSessions = data?.data?.sessions || [];
    return {
      userSessions,
      userSessionsLoading: isLoading,
      userSessionsError: error,
      userSessionsValidating: isValidating,
      userSessionsEmpty: !isLoading && userSessions.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * Hook for creating a user session.
 * @function useCreateUserSession
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useCreateUserSession() {
  return useMemo(
    () => ({
      createUserSession: (userSession) => requests.createUserSession(userSession),
    }),
    []
  );
}

/**
 * Hook for updating a user session.
 * @function useUpdateUserSession
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useUpdateUserSession() {
  return useMemo(
    () => ({
      updateUserSession: (id, userSession) => requests.updateUserSession(id, userSession),
    }),
    []
  );
}

/**
 * Hook for deleting a user session.
 * @function useDeleteUserSession
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useDeleteUserSession() {
  return useMemo(
    () => ({
      deleteUserSession: (id) => requests.deleteUserSession(id),
    }),
    []
  );
}

/**
 * Hook for all user session mutations.
 * @function useUserSessionMutations
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useUserSessionMutations() {
  return useMemo(
    () => ({
      createUserSession: (userSession) => requests.createUserSession(userSession),
      updateUserSession: (id, userSession) => requests.updateUserSession(id, userSession),
      deleteUserSession: (id) => requests.deleteUserSession(id),
    }),
    []
  );
}
