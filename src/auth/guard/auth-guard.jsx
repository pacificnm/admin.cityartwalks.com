'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const signInPath = paths.auth.auth0.signIn;

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { authenticated, loading, accessToken } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const createRedirectPath = (currentPath) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  // Helper to check if a JWT is expired
  function isTokenExpired(token) {
    if (!token || typeof token !== 'string') return true;
    try {
      const [, payload] = token.split('.');
      const { exp } = JSON.parse(atob(payload));
      return exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    // Don't redirect if already on the sign-in page
    if (pathname === signInPath) {
      setIsChecking(false);
      return;
    }

    if (!authenticated) {
      const redirectPath = createRedirectPath(signInPath);
      router.replace(redirectPath);
      return;
    }

    // Check for valid access token
    if (!accessToken || isTokenExpired(accessToken)) {
      // Don't show spinner, let RoleBasedGuard handle redirect
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading, accessToken]);

  if (isChecking) {
    return <SplashScreen />;
  }

  // Don't render children if token is missing/expired
  if (!accessToken || isTokenExpired(accessToken)) {
    return null;
  }

  return <>{children}</>;
}
