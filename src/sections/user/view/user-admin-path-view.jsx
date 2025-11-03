'use client';

import { PathCardList, PathTableToolbar } from 'src/components/path';

import { View403 } from 'src/sections/error/403-view';

import { useAuthContext } from 'src/auth/hooks';

export function UserAdminPathView({ userId }) {
  const { loading, authenticated, accessToken } = useAuthContext();

  // Handle loading state
  if (loading) return null;

  // Handle unauthorized access
  if (!authenticated || !accessToken) return <View403 />;

  return (
    <PathTableToolbar
      viewType="admin"
      initialFilters={{
        createdBy: userId,
        status: 'all',
      }}
    >
      {({ paths }) => (
        <PathCardList
          paths={paths}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)',
          }}
        />
      )}
    </PathTableToolbar>
  );
}
