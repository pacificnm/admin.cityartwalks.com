/**
 * @file auth-context.jsx
 * @description Provides the authentication context definition for the application.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth-Context} - Complete documentation
 */

'use client';

import { createContext } from 'react';

/**
 * React Context for authentication state and actions.
 * Provides authentication-related data and methods to consuming components.
 * The actual provider implementation is in src/auth/context/auth0/auth-provider-container.jsx
 * @type {React.Context<undefined | AuthContextType>}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth-Context} - Complete documentation
 */
export const AuthContext = createContext(undefined);
