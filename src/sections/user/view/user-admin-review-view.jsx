'use client';

import { ReviewTable } from 'src/components/review';

import { View403 } from 'src/sections/error/403-view';

import { useAuthContext } from 'src/auth/hooks';

export function UserAdminReviewView({ userId }) {
  const { loading, authenticated, accessToken } = useAuthContext();

  // Handle loading state
  if (loading) return null;

  // Handle unauthorized access
  if (!authenticated || !accessToken) return <View403 />;

  // Filters to show only this user's reviews
  const filters = {
    createdBy: userId,
    status: 'all',
  };

  // Tab options for review status filtering
  const tabOptions = [
    { value: 'all', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'DELETED', label: 'Deleted' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'FLAGGED', label: 'Flagged' },
  ];

  // Display filters configuration
  const displayFilters = {
    search: true,
    rating: true,
    createdBy: false, // Hide createdBy filter since we're filtering by specific user
    status: true,
    artPieceId: true, // Show which art piece the review is for
    toolMenu: true,
  };

  return (
    <ReviewTable
      filters={filters}
      accessToken={accessToken}
      tabOptions={tabOptions}
      displayFilters={displayFilters}
    />
  );
}
