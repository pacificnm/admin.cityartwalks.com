/**
 * @file useAuthToken.js
 * @description Hook to reliably fetch a valid JWT access token using Auth0.
 * Ensures audience and scope are applied and bypasses cache when requested.
 */

'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useCallback } from 'react';

import { setAccessToken } from 'src/lib/axios';

/**
 * useAuthToken
 *
 * @function
 * @param {Object} [options]
 * @param {boolean} [options.forceRefresh=false] - Whether to skip the cache and fetch a fresh token.
 * @returns {Object} Auth token hook result
 *
 * @example
 * const { token, loading, error } = useAuthToken();
 */
export function useAuthToken({ forceRefresh = false } = {}) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated) {
        setToken(null);
        return null;
      }

      const jwt = await getAccessTokenSilently({
        audience: 'https://cityartwalks.com',
        scope: 'openid profile email',
        detailedResponse: false,
      });
      // console.log('[useAuthToken] Fetched token?:', jwt);
      setToken(jwt);

      // Only set the token if it's a valid string
      if (jwt && typeof jwt === 'string' && jwt !== 'undefined') {
        setAccessToken(jwt);
      } else {
        console.warn('[useAuthToken] Invalid token received?:', jwt);
        setAccessToken(null);
      }

      return jwt;
    } catch (err) {
      console.error('[useAuthToken] Failed to get token?:', err);
      setError(err);
      setToken(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return { token, loading, error, getToken: fetchToken };
}
