/**
 * @fileoverview Auth0 Authentication Provider for City Art Walks
 *
 * This module provides the main Auth0 authentication provider that configures
 * the Auth0Provider and wraps the application with authentication context.
 * The core authentication logic is handled by the AuthProviderContainer component.
 *
 * Key features:
 * - Auth0Provider configuration and setup
 * - Authentication redirect handling
 * - Configuration validation
 * - Clean separation of concerns with AuthProviderContainer
 *
 * @module src/auth/context/auth0/auth-provider
 * @namespace CityArtWalks.Auth.Auth0
 * @author Jaimie Garner
 * @version 2.1.0
 *
 * @requires @auth0/auth0-react - Auth0 React SDK for authentication
 * @requires CityArtWalks.Lib.Debug - Debug logging utilities
 * @requires CityArtWalks.Auth.Auth0.Container - Authentication container logic
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Authentication} - Authentication documentation
 * @see {@link https://auth0.com/docs/libraries/auth0-react} - Auth0 React documentation
 */

'use client';

import { useCallback } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

import { CONFIG } from 'src/global-config';
import { debugError } from 'src/lib/debug';

import { AuthProviderContainer } from './auth-provider-container';

/**
 * Main Auth0 Authentication Provider component that configures Auth0Provider
 * and wraps the application with authentication context.
 *
 * This component sets up the Auth0Provider with the necessary configuration
 * including domain, client ID, callback URL, and authentication parameters.
 * It also handles redirect callbacks after authentication.
 *
 * @function AuthProvider
 * @memberof CityArtWalks.Auth.Auth0
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap with auth context
 * @returns {JSX.Element} Auth0Provider wrapper with AuthProviderContainer
 * @throws {Error} Throws error if Auth0 configuration is missing
 *
 * @example
 * ```jsx
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <YourAppComponents />
 *     </AuthProvider>
 *   );
 * }
 * ```
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Authentication} - Authentication setup guide
 */
export function AuthProvider({ children }) {
  const { domain, clientId, callbackUrl } = CONFIG.auth0;

  /**
   * Callback function to handle Auth0 redirect after authentication.
   * Redirects user to their intended destination or current pathname.
   *
   * @function onRedirectCallback
   * @memberof CityArtWalks.Auth.Auth0.AuthProvider
   * @param {Object} appState - Auth0 application state
   * @param {string} [appState.returnTo] - URL to redirect to after auth
   */
  const onRedirectCallback = useCallback((appState) => {
    window.location.replace(appState?.returnTo || window.location.pathname);
  }, []);

  if (!(domain && clientId && callbackUrl)) {
    debugError('CityArtWalks.Auth.Auth0.AuthProvider', { domain, clientId, callbackUrl });
    throw new Error('Missing configuration, domain, clientId, or callbackUrl');
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUrl,
        audience: 'https://cityartwalks.com',
        scope: 'openid profile email offline_access',
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens
      useRefreshTokensFallback={false}
    >
      <AuthProviderContainer>{children}</AuthProviderContainer>
    </Auth0Provider>
  );
}
