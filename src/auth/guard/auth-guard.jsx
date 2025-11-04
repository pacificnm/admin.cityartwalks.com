'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const signInPath = paths.auth.auth0.signIn;

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isLoading: loading } = useUser();

  const [isChecking, setIsChecking] = useState(true);

  const createRedirectPath = (currentPath) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    // Don't redirect if already on the sign-in page
    if (pathname === signInPath) {
      setIsChecking(false);
      return;
    }

    if (!user) {
      const redirectPath = createRedirectPath(signInPath);
      router.replace(redirectPath);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  // Don't render children if no user
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
