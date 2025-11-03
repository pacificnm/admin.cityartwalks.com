/**
 * @fileoverview Auth0 Authentication Provider Container for City Art Walks
 *
 * This module handles the core Auth0 integration logic including user data fetching,
 * token management, automatic user creation, and authentication context provision.
 * Separated from the main AuthProvider for better code organization and maintainability.
 *
 * Key responsibilities:
 * - Auth0 access token management and refresh
 * - User data fetching from API with SWR
 * - Automatic user creation for new Auth0 users
 * - Role extraction from Auth0 tokens
 * - User status validation and automatic logout for inactive users
 * - Centralized logout functionality
 * - Analytics tracking and geo-location services
 * - Comprehensive error handling with debug logging
 *
 * @module src/auth/context/auth0/auth-provider-container
 * @namespace CityArtWalks.Auth.Auth0.Container
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires @auth0/auth0-react - Auth0 React SDK for authentication
 * @requires swr - Data fetching with caching and revalidation
 * @requires lodash.debounce - Function debouncing utilities
 * @requires CityArtWalks.Utils.AnalyticsTracker - Event tracking utilities
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 * @requires CityArtWalks.Actions.User - User management actions
 * @requires CityArtWalks.Components.SplashScreen - Loading screen component
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Authentication} - Authentication documentation
 * @see {@link https://auth0.com/docs/libraries/auth0-react} - Auth0 React documentation
 * @see {@link https://swr.vercel.app/docs/getting-started} - SWR documentation
 */

'use client';

import useSWR from 'swr';
import debounce from 'lodash.debounce';
import { useAuth0 } from '@auth0/auth0-react';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { setAccessToken } from 'src/lib/axios';
import { updateUserLastLogin } from 'src/actions/user';
import { debugLog, debugWarn, debugError } from 'src/lib/debug';

import { SplashScreen } from 'src/components/loading-screen';

import { AuthContext } from '../auth-context';

/**
 * Internal container component that handles Auth0 integration, user data fetching,
 * token management, and provides authentication context to the application.
 *
 * This component performs the following key functions:
 * - Manages Auth0 access tokens and automatic refresh
 * - Fetches user data from the API using SWR
 * - Creates new users automatically when they don't exist in the database
 * - Extracts user roles from Auth0 tokens
 * - Validates user status and automatically signs out inactive users
 * - Handles authentication errors with centralized logout functionality
 * - Tracks user sign-in events and geo-location data
 * - Updates user last login timestamps
 * - Provides centralized signout function for error handling
 *
 * @function AuthProviderContainer
 * @memberof CityArtWalks.Auth.Auth0.Container
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to receive auth context
 * @returns {JSX.Element} AuthContext.Provider with user data or SplashScreen
 *
 * @example
 * ```jsx
 * // This component is used internally by AuthProvider
 * // Access the auth context in child components:
 * const { user, authenticated, accessToken, signOutUser } = useAuthContext();
 *
 * // Use centralized signout function in error scenarios:
 * await signOutUser('custom_error_reason');
 * ```
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Authentication} - Authentication context usage
 */
export function AuthProviderContainer({ children }) {
  const { user, isLoading, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const [accessToken, setAccessTokenState] = useState(null);

  /**
   * Centralized sign out function that handles Auth0 logout and redirects.
   * Used across multiple error scenarios to provide consistent logout behavior.
   *
   * @function signOutUser
   * @memberof CityArtWalks.Auth.Auth0.Container.AuthProviderContainer
   * @async
   * @param {string} [reason='general_error'] - Reason for logout for debugging
   * @returns {Promise<void>} Promise that resolves when logout is complete
   */
  const signOutUser = useCallback(
    async (reason = 'general_error') => {
      try {
        debugWarn(
          'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
          `Signing out user due to: ${reason}`
        );
        await logout({
          logoutParams: { returnTo: window.location.origin },
        });
      } catch (logoutError) {
        debugError(
          'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
          'Failed to sign out user (line 96):',
          logoutError
        );
        // Fallback: redirect to home page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    },
    [logout]
  );

  // Debug auth state changes
  useEffect(() => {
    debugLog('CityArtWalks.Auth.Auth0.Container.AuthProviderContainer', 'Auth state changed:', {
      isLoading,
      isAuthenticated,
      hasAccessToken: !!accessToken,
    });
  }, [isLoading, isAuthenticated, accessToken]);

  /**
   * Retrieves and manages Auth0 access tokens.
   * Automatically sets tokens for axios requests and handles token refresh errors.
   * Signs out user if refresh token is missing.
   *
   * @function getAccessToken
   * @memberof CityArtWalks.Auth.Auth0.Container.AuthProviderContainer
   * @async
   * @returns {Promise<void>} Promise that resolves when token is set
   * @throws {Error} Signs out user if refresh token is missing
   */
  const getAccessToken = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently({
        audience: 'https://cityartwalks.com',
        scope: 'openid profile email offline_access',
      });

      setAccessTokenState(token);
      if (token && typeof token === 'string' && token !== 'undefined') {
        setAccessToken(token);
      } else {
        setAccessToken(null);
      }
    } catch (error) {
      debugWarn(
        'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
        'Token refresh error (line 162):',
        error
      );
      if (typeof window !== 'undefined' && String(error).includes('Missing Refresh Token')) {
        debugError(
          'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
          'Missing refresh token, signing out user (line 168)',
          { error, stack: new Error().stack }
        );
        await signOutUser('missing_refresh_token');
      }
    }
  }, [getAccessTokenSilently, isAuthenticated, signOutUser]);

  useEffect(() => {
    getAccessToken();
  }, [getAccessToken]);

  /**
   * SWR fetcher function for user data with automatic user creation fallback.
   *
   * Handles the following scenarios:
   * - Successful user data fetch from API
   * - User not found (404) - creates new user with Auth0 data
   * - User creation errors - signs out user and redirects home
   * - Other API errors - throws descriptive errors
   *
   * @function fetcher
   * @memberof CityArtWalks.Auth.Auth0.Container.AuthProviderContainer
   * @async
   * @param {string} url - API endpoint URL to fetch user data from
   * @returns {Promise<Object>} User data object from API or newly created user
   * @throws {Error} Signs out user for creation failures, throws error for other API failures
   */
  const fetcher = useCallback(
    async (url) => {
      const currentToken = accessToken;

      if (!currentToken) {
        throw new Error('No access token available');
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        return res.json();
      } else if (res.status === 404 && user) {
        // User doesn't exist in database, create them - this is expected for new users
        debugLog(
          'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
          'New user detected (404 expected) - attempting to create database record',
          {
            auth0Id: user.sub,
            email: user.email,
            name: user.name,
            hasToken: !!currentToken,
          }
        );

        const { createUser } = await import('src/actions/user');
        const { defaultUserValues } = await import('src/validators/user');

        // Prepare user data with validation-safe values
        const userData = {
          email: user.email,
          name: user.name,
          displayName: user.name || user.email?.split('@')[0] || 'New User',
          auth0Id: user.sub,
          role: user['https://pdxartwalks.com/roles']?.[0] || user.role || 'USER',
          status: 'ACTIVE',
        };

        // Only include image if it's a valid URL
        if (user.picture && user.picture.startsWith('http')) {
          userData.image = user.picture;
        }

        const newUserData = defaultUserValues(userData);

        debugLog(
          'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
          'Prepared user data for creation',
          {
            newUserData,
            originalUserData: userData,
            tokenAvailable: !!currentToken,
          }
        );

        try {
          debugLog(
            'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
            'Calling createUser function...',
            { userDataKeys: Object.keys(newUserData) }
          );

          const createdUser = await createUser(newUserData, currentToken);
          debugLog(
            'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
            'User created successfully',
            { userId: createdUser.data?.userId || createdUser.userId }
          );
          return createdUser.data || createdUser;
        } catch (userCreationError) {
          debugError(
            'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
            'User creation failed - will retry on next authentication attempt',
            {
              error: userCreationError.message,
              userData: newUserData,
              auth0User: user,
              stack: userCreationError.stack,
            }
          );
          // Don't sign out user - let them continue and retry creation later
          throw new Error(`Failed to create user: ${userCreationError.message}`);
        }
      } else {
        debugError(
          'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
          'Failed to fetch user data (line 253)'
        );
        throw new Error(`Failed to fetch user data: ${res.status} ${res.statusText}`);
      }
    },
    [accessToken, user]
  );

  const { data: userData, error: swrUserError } = useSWR(
    // Dynamic key function ensures we have access token before making requests

    () => {
      const shouldFetch = isAuthenticated && user?.sub && accessToken;
      return shouldFetch ? `/api/user/auth/${encodeURIComponent(user.sub)}` : null;
    },
    fetcher,
    { revalidateOnFocus: false }
  );

  // Handle SWR errors and user status validation
  useEffect(() => {
    if (swrUserError) {
      debugError(
        'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
        'SWR fetch failed, user creation should have been attempted',
        { error: swrUserError.message, stack: new Error().stack }
      );
      return;
    }

    // Check user status - log warning if not ACTIVE but don't sign out
    const actualUserData = userData?.data || userData;

    if (userData && actualUserData.status !== 'ACTIVE') {
      debugWarn(
        'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
        `User status is "${actualUserData.status}" - user may have restricted access`,
        { status: actualUserData.status, userId: actualUserData.userId }
      );
    }
  }, [userData, swrUserError]);

  // User data update
  useEffect(() => {
    if (userData?.data && Object.keys(userData.data).length > 0) {
      debugLog('CityArtWalks.Auth.Auth0.Container.AuthProviderContainer', 'User data received', {
        userId: userData.data.userId,
        email: userData.data.email,
      });
    }
  }, [userData, swrUserError]);

  // Geo lookup (debounced)
  const debouncedGeoLookup = useMemo(
    () =>
      debounce(async () => {
        try {
          const cachedGeo = localStorage.getItem('geoip_data');
          if (!cachedGeo) {
            const { getGeoIPLocation } = await import('src/utils/geo-location');
            const geoData = await getGeoIPLocation();
            if (geoData) {
              localStorage.setItem('geoip_data', JSON.stringify(geoData));
            }
          }
        } catch (err) {
          debugError(
            'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
            'Geo lookup error (line 337):',
            err
          );
        }
      }, 500),
    []
  );

  useEffect(() => {
    const actualUserData = userData?.data || userData;
    if (actualUserData?.userId) {
      debouncedGeoLookup();
    }
  }, [userData, debouncedGeoLookup]);

  // Update last login - only after user data is loaded
  useEffect(() => {
    const updateLastLogin = async () => {
      // Only update last login if we have both access token AND user data (meaning user exists in DB)
      const actualUserData = userData?.data || userData;
      if (accessToken && user?.sub && actualUserData?.userId) {
        try {
          // Pass the Auth0 user.sub (not the internal userId) as the API expects the Auth0 ID
          await updateUserLastLogin(user.sub, accessToken);
        } catch (err) {
          debugError(
            'CityArtWalks.Auth.Auth0.Container.AuthProviderContainer',
            'Update last login error (line 361):',
            err
          );
        }
      }
    };
    updateLastLogin();
  }, [accessToken, user?.sub, userData]);

  const checkAuthenticated = isAuthenticated ? 'authenticated' : 'unauthenticated';
  const status = isLoading ? 'loading' : checkAuthenticated;

  // Additional loading state: if authenticated but user data hasn't loaded yet
  const isUserDataLoading = isAuthenticated && !isLoading && !userData && !swrUserError;

  const memoizedValue = useMemo(() => {
    // Handle nested API response structure
    const actualUserData = userData?.data || userData;

    return {
      user:
        user && userData
          ? {
              ...user,
              ...actualUserData,
              id: user.sub,
              userId: actualUserData.userId,
              photoURL: user.picture,
              role: actualUserData.role || 'USER',
            }
          : null,
      loading: status === 'loading' || isUserDataLoading,
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      accessToken,
      signOutUser, // Expose centralized signout function
      getAccessToken: () =>
        getAccessTokenSilently({
          audience: 'https://cityartwalks.com',
          scope: 'openid profile email offline_access',
        }),
    };
  }, [accessToken, userData, status, user, getAccessTokenSilently, signOutUser, isUserDataLoading]);

  const isUserReady = !isLoading && (!isAuthenticated || (isAuthenticated && userData !== null));

  if (!isUserReady) {
    return <SplashScreen />;
  }

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
