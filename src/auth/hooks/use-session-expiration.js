/**
 * @file use-session-expiration.js
 * @description Hook to handle Auth0 session expiration and token refresh failures.
 * Listens for auth:session-expired events and redirects to login or shows a dialog.
 * @namespace CityArtWalks.Auth.Hooks.UseSessionExpiration
 * @version 1.0.0
 * @author Jaimie Garner
 */

'use client';

import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

/**
 * Hook to handle session expiration events from ApiClient.
 * When a token cannot be refreshed (401 + refresh fails), the ApiClient
 * dispatches an 'auth:session-expired' event. This hook catches it and
 * redirects the user to login.
 *
 * @function useSessionExpiration
 * @memberof CityArtWalks.Auth.Hooks.UseSessionExpiration
 *
 * @example
 * export function MyComponent() {
 *   useSessionExpiration(); // Just add this hook at the top level
 *   return <div>Your component</div>;
 * }
 *
 * @returns {void}
 */
export function useSessionExpiration() {
  const router = useRouter();

  useEffect(() => {
    /**
     * Handle session expired event from ApiClient
     * @param {CustomEvent} event - Event dispatched by ApiClient
     * @param {Object} event.detail - Event details
     * @param {string} event.detail.path - The path that failed
     * @param {string} event.detail.message - The error message
     */
    const handleSessionExpired = (event) => {
      console.warn('[useSessionExpiration] Session expired:', event.detail);

      // Option 1: Redirect to Auth0 login (simplest)
      window.location.href = '/api/auth/login';

      // Option 2: You could also show a modal first, then redirect
      // This is commented out, but you could implement:
      // - Show a toast/snackbar: "Your session has expired. Please log in again."
      // - Wait for user acknowledgment
      // - Then redirect
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [router]);
}
