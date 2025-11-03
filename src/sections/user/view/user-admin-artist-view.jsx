'use client';

import { ArtistTable } from 'src/components/artist';

import { View403 } from 'src/sections/error/403-view';

import { useAuthContext } from 'src/auth/hooks';

export function UserAdminArtistView({ userId }) {
  // fetch the user context
  const { loading, authenticated, accessToken } = useAuthContext();

  // Conditional rendering based on auth and loading state
  if (!authenticated || !accessToken) return <View403 />;

  const filters = { createdBy: userId, status: 'all' };

  const tabOptions = [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const displayFilters = {
    search: true,
    featured: true,
    createdBy: false,
    status: true,
    toolMenu: false,
  };

  if (loading) return null;
  if (!authenticated || !accessToken) return <View403 />;

  return (
    <ArtistTable
      filters={filters}
      accessToken={accessToken}
      tabOptions={tabOptions}
      displayFilters={displayFilters}
    />
  );
}
