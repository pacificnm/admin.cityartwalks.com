'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { debugLog } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { UserPlusIcon, MagnifierIcon } from 'src/components/icons';

import { UserCommunicationList } from './components/user-communication-list';
import { UserFrequencyAnalysis } from './components/user-frequency-analysis';

// ----------------------------------------------------------------------

export function UserCommunicationView() {
  const settings = useSettingsContext();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((event) => {
    const query = event.target.value;
    debugLog('UserCommunicationView.handleSearchChange', 'Search query updated', { query });
    setSearchQuery(query);
  }, []);

  const handleUserSelect = useCallback((user) => {
    debugLog('UserCommunicationView.handleUserSelect', 'User selected', { userId: user?.id });
    // TODO: Implement user selection logic - navigate to user details or show user info
  }, []);

  return (
    <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
      <Container maxWidth={settings.compactLayout ? false : 'xl'}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4">User Communication History</Typography>
            <Button
              variant="contained"
              startIcon={<UserPlusIcon />}
              onClick={() => {
                // TODO: Implement add user to communication list
                debugLog('UserCommunicationView.addUser', 'Add user to communication list');
              }}
            >
              Add User
            </Button>
          </Box>

          {/* Search */}
          <Card sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search users by name, email, or activity..."
              value={searchQuery}
              onChange={handleSearchChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifierIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Card>

          {/* Frequency Analysis Overview */}
          <UserFrequencyAnalysis />

          {/* User Communication List */}
          <Card>
            <UserCommunicationList searchQuery={searchQuery} onUserSelect={handleUserSelect} />
          </Card>
        </Stack>
      </Container>
    </DashboardContent>
  );
}
