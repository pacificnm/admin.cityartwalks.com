/**
 * @file use-auth-context.js
 * @description Custom hook to access the authentication context.
 * @namespace CityArtWalks.Auth.Hooks.UseAuthContext
 * @version 1.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Use-Auth-Context} - Complete documentation
 */

'use client';

import { use } from 'react';

import { AuthContext } from '../context/auth-context';

// ----------------------------------------------------------------------

export function useAuthContext() {
  const context = use(AuthContext);

  if (!context) {
    throw new Error('useAuthContext: Context must be used inside AuthProvider');
  }

  return context;
}
