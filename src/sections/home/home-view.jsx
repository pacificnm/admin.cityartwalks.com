"use client";

import { useUser } from '@auth0/nextjs-auth0/client';

import {
  Box,
  Card,
  Alert,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

import { paths } from "src/routes/paths";

import { useGetPaginatedUsers } from 'src/actions/user/hooks';

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

export function HomeView() {
  const { user, isLoading: userLoading } = useUser();
  
  // Test the API with user data fetching - tokens handled automatically by ApiClient
  const {
    results,
    usersLoading,
    usersError,
  } = useGetPaginatedUsers({
    page: 1,
    limit: 5,
    search: '',
    role: '',
    status: '',
  });

  // Extract data from results
  const users = results?.data || [];

  return (
    <>
      <CustomBreadcrumbs
        heading="Admin Dashboard"
        links={[{ name: "Home", href: paths.root }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* User Info Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Authenticated User
            </Typography>
            {userLoading ? (
              <CircularProgress size={20} />
            ) : user ? (
              <Box>
                <Typography variant="body2">
                  <strong>Name:</strong> {user.name || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {user.email || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Roles:</strong> {JSON.stringify(user['https://pdxartwalks.com/roles'] || [])}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {user['https://pdxartwalks.com/status'] || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Access Token:</strong> ✅ Automatically managed by session
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="error">
                No user data available
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* API Test Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              API Connection Test - Users
            </Typography>
            {usersLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Loading users from API...</Typography>
              </Box>
            ) : usersError ? (
              <Alert severity="error">
                <Typography variant="body2">
                  <strong>API Error:</strong> {usersError.message || 'Failed to fetch users'}
                </Typography>
              </Alert>
            ) : users ? (
              <Box>
                <Typography variant="body2" color="success.main" gutterBottom>
                  ✅ Successfully connected to API!
                </Typography>
                <Typography variant="body2">
                  <strong>Total Users:</strong> {results?.total || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Users Fetched:</strong> {users.length}
                </Typography>
                <Typography variant="body2">
                  <strong>Page:</strong> {results?.page || 1} of {results?.totalPages || 1}
                </Typography>
                <Typography variant="body2">
                  <strong>Has Next Page:</strong> {results?.hasNextPage ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                  <strong>Query Time:</strong> {results?.performance?.totalQueryTime || 0}ms
                </Typography>
                <Typography variant="body2">
                  <strong>Efficiency:</strong> {results?.performance?.efficiency || 0}%
                </Typography>
                <Typography variant="body2">
                  <strong>Records Returned:</strong> {results?.performance?.recordsReturned || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Timestamp:</strong> {results?.timestamp ? new Date(results.timestamp).toLocaleTimeString() : 'N/A'}
                </Typography>
                {users.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Sample Users:</strong>
                    </Typography>
                    {users.slice(0, 3).map((userData, index) => (
                      <Typography key={userData.id || index} variant="body2" sx={{ ml: 2 }}>
                        • {userData.name || userData.email || `User ${userData.id}`}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="warning.main">
                No user data received from API
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
