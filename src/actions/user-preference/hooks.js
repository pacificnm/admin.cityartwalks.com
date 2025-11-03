/**
 * React hooks for UserPreference operations using SWR
 *
 * This module provides React hooks for UserPreference CRUD operations with SWR caching,
 * location preference management, and automatic cache invalidation. All hooks delegate to
 * requests functions and provide consistent loading/error states with proper token handling.
 *
 * @namespace CityArtWalks.Actions.UserPreferences.Hooks
 * @fileoverview React hooks for UserPreference data operations
 * @author Jaimie Garner
 * @version 2.1.0
 *
 * @requires useSWR - SWR library for data fetching
 * @requires React - React hooks (useMemo)
 * @requires CityArtWalks.Actions.UserPreferences.Requests - Request functions
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks} - Hooks documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Actions layer documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Requests} - Requests patterns documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/UserPreference-Model} - UserPreference model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#UserPreference} - Database schema reference
 */

import useSWR from 'swr';
import { useMemo } from 'react';

import * as requests from './requests.js';

/**
 * @memberof CityArtWalks.Actions.UserPreferences.Hooks
 * @description SWR configuration options to control revalidation behavior.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
};

/**
 * @memberof CityArtWalks.Actions.UserPreferences.Hooks
 * @function useGetUserPreferences
 * @description SWR hook for fetching all user preferences with authentication support.
 * Corresponds to GET /api/user-preference route.
 *
 * @param {string} [token=''] - Auth token for authentication
 * @returns {Object} User preferences result
 * @returns {Array} returns.userPreferences - Array of UserPreference objects
 * @returns {boolean} returns.userPreferencesLoading - Loading state
 * @returns {Error} returns.userPreferencesError - Error state
 * @returns {boolean} returns.userPreferencesValidating - Validating state
 * @returns {boolean} returns.userPreferencesEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserPreferences(token = '') {
  const key = ['getUserPreferences', token];
  const { data, isLoading, error, isValidating } = useSWR(
    key,
    () => requests.getUserPreferences(token),
    swrOptions
  );

  return useMemo(() => {
    const userPreferences = data?.data?.preferences || [];
    return {
      userPreferences,
      userPreferencesLoading: isLoading,
      userPreferencesError: error,
      userPreferencesValidating: isValidating,
      userPreferencesEmpty: !isLoading && userPreferences.length === 0,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.UserPreferences.Hooks
 * @function useGetUserPreference
 * @description SWR hook for fetching a user preference by ID with authentication support.
 * Corresponds to GET /api/user-preference/[id] route.
 *
 * @param {number} userPreferenceId - User preference ID
 * @param {string} [token=''] - Auth token for authentication
 * @returns {Object} User preference result
 * @returns {Object|null} returns.userPreference - UserPreference object or null
 * @returns {boolean} returns.userPreferenceLoading - Loading state
 * @returns {Error} returns.userPreferenceError - Error state
 * @returns {boolean} returns.userPreferenceValidating - Validating state
 * @returns {boolean} returns.userPreferenceEmpty - Empty state
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserPreference(userPreferenceId, token = '') {
  const key = ['getUserPreference', userPreferenceId, token];
  const { data, isLoading, error, isValidating } = useSWR(
    userPreferenceId ? key : null,
    () => requests.getUserPreferences(userPreferenceId, token),
    swrOptions
  );

  return useMemo(() => {
    const userPreference = data?.data?.userPreference || null;
    return {
      userPreference,
      userPreferenceLoading: isLoading,
      userPreferenceError: error,
      userPreferenceValidating: isValidating,
      userPreferenceEmpty: !isLoading && !userPreference,
    };
  }, [data, isLoading, error, isValidating]);
}

/**
 * @memberof CityArtWalks.Actions.UserPreferences.Hooks
 * @function useGetUserPreferencesByUser
 * @description SWR hook for fetching user preferences by user ID with authentication support.
 * Corresponds to GET /api/user-preference/user/[userId] route.
 *
 * @param {number} userId - User ID
 * @param {string} [token=''] - Auth token for authentication
 * @returns {Object} User preferences result
 * @returns {Array} returns.userPreferences - Array of UserPreference objects
 * @returns {boolean} returns.userPreferencesLoading - Loading state
 * @returns {Error} returns.userPreferencesError - Error state
 * @returns {boolean} returns.userPreferencesValidating - Validating state
 * @returns {boolean} returns.userPreferencesEmpty - Empty state
 * @returns {Function} returns.mutateUserPreferences - SWR mutate function for cache updates
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserPreferencesByUser(userId, token = '') {
  const key = ['getUserPreferences', userId, token];
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    userId ? key : null,
    () => requests.getUserPreferences(userId, token),
    swrOptions
  );

  return useMemo(() => {
    const userPreferences = data?.data?.preferences || [];
    return {
      userPreferences,
      userPreferencesLoading: isLoading,
      userPreferencesError: error,
      userPreferencesValidating: isValidating,
      userPreferencesEmpty: !isLoading && userPreferences.length === 0,
      mutateUserPreferences: mutate, // Add the mutate function
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.UserPreferences.Hooks
 * @function useGetUserLocationPreferences
 * @description SWR hook for fetching user location preferences with authentication support.
 * Retrieves country, state, and city preference settings for location-based filtering.
 *
 * @param {number} userId - User ID
 * @param {string} [token=''] - Auth token for authentication
 * @returns {Object} Location preferences result
 * @returns {Object|null} returns.locationPreferences - Location preference data or null
 * @returns {boolean} returns.locationPreferencesLoading - Loading state
 * @returns {Error} returns.locationPreferencesError - Error state
 * @returns {boolean} returns.locationPreferencesValidating - Validating state
 * @returns {boolean} returns.locationPreferencesEmpty - Empty state
 * @returns {Function} returns.mutateLocationPreferences - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserLocationPreferences(userId, token = '') {
  const key = ['getUserLocationPreferences', userId, token];
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    userId ? key : null,
    () => requests.getUserLocationPreferences(userId, token),
    swrOptions
  );

  return useMemo(() => {
    const locationPreferences = data?.data || null;
    return {
      locationPreferences,
      locationPreferencesLoading: isLoading,
      locationPreferencesError: error,
      locationPreferencesValidating: isValidating,
      locationPreferencesEmpty: !isLoading && !locationPreferences,
      mutateLocationPreferences: mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.UserPreferences.Hooks
 * @function useGetUserPrivacyPreferences
 * @description SWR hook for fetching user privacy preferences with authentication support.
 * Retrieves profile visibility and data sharing preference settings.
 *
 * @param {number} userId - User ID
 * @param {string} [token=''] - Auth token for authentication
 * @returns {Object} Privacy preferences result
 * @returns {Object|null} returns.privacyPreferences - Privacy preference data or null
 * @returns {boolean} returns.privacyPreferencesLoading - Loading state
 * @returns {Error} returns.privacyPreferencesError - Error state
 * @returns {boolean} returns.privacyPreferencesValidating - Validating state
 * @returns {boolean} returns.privacyPreferencesEmpty - Empty state
 * @returns {Function} returns.mutatePrivacyPreferences - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserPrivacyPreferences(userId, token = '') {
  const key = ['getUserPrivacyPreferences', userId, token];
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    userId ? key : null,
    () => requests.getUserPrivacyPreferences(userId, token),
    swrOptions
  );

  return useMemo(() => {
    const privacyPreferences = data?.data || null;
    return {
      privacyPreferences,
      privacyPreferencesLoading: isLoading,
      privacyPreferencesError: error,
      privacyPreferencesValidating: isValidating,
      privacyPreferencesEmpty: !isLoading && !privacyPreferences,
      mutatePrivacyPreferences: mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.UserPreferences.Hooks
 * @function useGetUserPreferencesWithLocation
 * @description SWR hook for fetching user preferences with enriched location data.
 * Includes related Country, State, and City entities for comprehensive preference management.
 *
 * @param {number} userId - User ID
 * @param {string} [token=''] - Auth token for authentication
 * @returns {Object} User preferences with location data
 * @returns {Object|null} returns.userPreferences - UserPreference object with location data
 * @returns {boolean} returns.userPreferencesLoading - Loading state
 * @returns {Error} returns.userPreferencesError - Error state
 * @returns {boolean} returns.userPreferencesValidating - Validating state
 * @returns {boolean} returns.userPreferencesEmpty - Empty state
 * @returns {boolean} returns.hasLocationPreferences - Whether location preferences are set
 * @returns {Object|null} returns.defaultCountry - Default country data
 * @returns {Object|null} returns.defaultState - Default state data
 * @returns {Object|null} returns.defaultCity - Default city data
 * @returns {Function} returns.mutateUserPreferences - SWR mutate function
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useGetUserPreferencesWithLocation(userId, token = '') {
  const key = ['getUserPreferencesWithLocation', userId, token];
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    userId ? key : null,
    () => requests.getUserPreferences(userId, token),
    swrOptions
  );

  return useMemo(() => {
    const userPreferences = data?.data?.userPreference || null;
    const hasLocationPreferences =
      userPreferences?.defaultCountryId ||
      userPreferences?.defaultStateId ||
      userPreferences?.defaultCityId;

    return {
      userPreferences,
      userPreferencesLoading: isLoading,
      userPreferencesError: error,
      userPreferencesValidating: isValidating,
      userPreferencesEmpty: !isLoading && !userPreferences,
      hasLocationPreferences,
      defaultCountry: userPreferences?.DefaultCountry || null,
      defaultState: userPreferences?.DefaultState || null,
      defaultCity: userPreferences?.DefaultCity || null,
      mutateUserPreferences: mutate,
    };
  }, [data, isLoading, error, isValidating, mutate]);
}

/**
 * @memberof CityArtWalks.Actions.UserPreferences.Hooks
 * @function useLocationPreferenceMutations
 * @description Hook for location preference mutations with optimistic updates and cache invalidation.
 * Provides functions to update and clear location preferences with proper error handling.
 *
 * @param {number} userId - User ID
 * @param {string} [token=''] - Auth token for authentication
 * @returns {Object} Mutation functions for location preferences
 * @returns {Function} returns.updateLocationPreferences - Update location preferences
 * @returns {Function} returns.clearLocationPreferences - Clear location preferences
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Actions} - Complete documentation
 */
export function useLocationPreferenceMutations(userId, token = '') {
  const { mutateLocationPreferences } = useGetUserLocationPreferences(userId, token);
  const { mutateUserPreferences } = useGetUserPreferencesWithLocation(userId, token);

  const updateLocationPreferences = async (locationData) => {
    try {
      // Optimistic update
      const optimisticData = {
        data: {
          locationPreferences: {
            defaultCountryId: locationData.defaultCountryId,
            defaultStateId: locationData.defaultStateId,
            defaultCityId: locationData.defaultCityId,
          },
        },
      };

      mutateLocationPreferences(optimisticData, false);

      // Make actual API call
      const result = await requests.updateUserLocationPreferences(userId, locationData, token);

      // Revalidate both caches
      mutateLocationPreferences();
      mutateUserPreferences();

      return result;
    } catch (error) {
      // Revert optimistic update on error
      mutateLocationPreferences();
      throw error;
    }
  };

  const clearLocationPreferences = async () => {
    try {
      const clearData = {
        defaultCountryId: null,
        defaultStateId: null,
        defaultCityId: null,
      };

      // Optimistic update
      const optimisticData = {
        data: {
          locationPreferences: clearData,
        },
      };

      mutateLocationPreferences(optimisticData, false);

      // Make actual API call
      const result = await requests.updateUserLocationPreferences(userId, clearData, token);

      // Revalidate both caches
      mutateLocationPreferences();
      mutateUserPreferences();

      return result;
    } catch (error) {
      // Revert optimistic update on error
      mutateLocationPreferences();
      throw error;
    }
  };

  return {
    updateLocationPreferences,
    clearLocationPreferences,
  };
}
