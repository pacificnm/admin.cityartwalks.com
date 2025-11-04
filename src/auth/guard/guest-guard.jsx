'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export function GuestGuard({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, isLoading: loading } = useUser();

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (user) {
      router.replace(returnTo);
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

  return <>{children}</>;
}
