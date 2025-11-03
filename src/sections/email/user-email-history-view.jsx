'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';
import { fNumber, fPercent } from 'src/utils/format-number';

import { debugLog, debugError } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { LetterIcon } from 'src/components/icons/letter-icon';
import { SettingsIcon } from 'src/components/icons/settings-icon';
import { ArrowLeftIcon } from 'src/components/icons/arrow-left-icon';
import { CheckCircleIcon } from 'src/components/icons/check-circle-icon';
import { ForbiddenCircleIcon } from 'src/components/icons/forbidden-circle-icon';

import { UserPreferenceManager } from './components/user-preference-manager';
import { UserEmailHistoryTable } from './components/user-email-history-table';
import { UserUnsubscribeTracker } from './components/user-unsubscribe-tracker';
import { UserCommunicationTimeline } from './components/user-communication-timeline';

// ----------------------------------------------------------------------

export function UserEmailHistoryView({ userId }) {
  const router = useRouter();
  const settings = useSettingsContext();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [preferenceDialogOpen, setPreferenceDialogOpen] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      debugLog('UserEmailHistoryView.fetchUserData', 'Fetching user data', { userId });
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${userId}/communication`);
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        const mockUser = {
          id: userId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: null,
          subscriptionStatus: 'subscribed',
          joinedAt: new Date('2023-03-15'),
          lastActivity: new Date(),
          emailStats: {
            totalSent: 145,
            delivered: 142,
            opened: 89,
            clicked: 34,
            bounced: 2,
            unsubscribed: 1,
            deliveryRate: 97.9,
            openRate: 62.7,
            clickRate: 38.2,
          },
          preferences: {
            newsletter: true,
            notifications: true,
            marketing: false,
            transactional: true,
            artUpdates: true,
            pathNotifications: true,
            weeklyDigest: true,
          },
          frequency: 'weekly',
          timezone: 'America/New_York',
          language: 'en',
          tags: ['active_user', 'art_enthusiast', 'subscriber'],
          unsubscribeHistory: [
            {
              date: new Date('2024-01-20'),
              type: 'marketing',
              reason: 'Too frequent',
              campaignId: 'marketing_jan_2024',
            },
          ],
        };

        setUser(mockUser);
        setLoading(false);
      }, 600);
    } catch (error) {
      debugError('UserEmailHistoryView.fetchUserData', 'Failed to fetch user data', error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  const handleBack = () => {
    router.push('/dashboard/email/users');
  };

  const handleSendEmail = () => {
    debugLog('UserEmailHistoryView.handleSendEmail', 'Send email to user', { userId });
    // TODO: Implement send email functionality
  };

  const handleManagePreferences = () => {
    setPreferenceDialogOpen(true);
  };

  const handleUnsubscribe = async () => {
    try {
      debugLog('UserEmailHistoryView.handleUnsubscribe', 'Unsubscribe user', { userId });
      // TODO: Implement unsubscribe functionality
      // await fetch(`/api/users/${userId}/unsubscribe`, { method: 'POST' });

      // Update local state
      setUser((prev) => ({
        ...prev,
        subscriptionStatus: 'unsubscribed',
      }));
    } catch (error) {
      debugError('UserEmailHistoryView.handleUnsubscribe', 'Failed to unsubscribe user', error);
    }
  };

  if (loading) {
    return (
      <DashboardContent>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </DashboardContent>
    );
  }

  if (!user) {
    return (
      <DashboardContent>
        <Container>
          <Typography variant="h6" color="error">
            User not found
          </Typography>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
      <Container maxWidth={settings.compactLayout ? false : 'xl'}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleBack}>
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="h4">User Email History</Typography>
          </Box>

          {/* User Profile Card */}
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar sx={{ width: 64, height: 64 }}>{user.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="h6">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={user.subscriptionStatus}
                          color={user.subscriptionStatus === 'subscribed' ? 'success' : 'error'}
                          size="small"
                          icon={
                            user.subscriptionStatus === 'subscribed' ? (
                              <CheckCircleIcon />
                            ) : (
                              <ForbiddenCircleIcon />
                            )
                          }
                        />
                      </Box>
                    </Box>
                  </Stack>
                </Grid>

                <Grid xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body2">{fDateTime(user.joinedAt)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Email Frequency
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {user.frequency}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid xs={12} md={4}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      startIcon={<LetterIcon />}
                      onClick={handleSendEmail}
                      disabled={user.subscriptionStatus === 'unsubscribed'}
                    >
                      Send Email
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      onClick={handleManagePreferences}
                    >
                      Preferences
                    </Button>
                    {user.subscriptionStatus === 'subscribed' && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<ForbiddenCircleIcon />}
                        onClick={handleUnsubscribe}
                      >
                        Unsubscribe
                      </Button>
                    )}
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Email Statistics */}
              <Grid container spacing={3}>
                <Grid xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {fNumber(user.emailStats.totalSent)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Sent
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {fPercent(user.emailStats.deliveryRate)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Delivery Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {fPercent(user.emailStats.openRate)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Open Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary.main">
                      {fPercent(user.emailStats.clickRate)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Click Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Communication Timeline */}
          <UserCommunicationTimeline userId={userId} />

          {/* Email History Table */}
          <Card>
            <UserEmailHistoryTable userId={userId} />
          </Card>

          {/* Unsubscribe Tracking */}
          <UserUnsubscribeTracker userId={userId} unsubscribeHistory={user.unsubscribeHistory} />

          {/* Preference Management Dialog */}
          <UserPreferenceManager
            open={preferenceDialogOpen}
            onClose={() => setPreferenceDialogOpen(false)}
            user={user}
            onUpdate={(updatedPreferences) => {
              setUser((prev) => ({
                ...prev,
                preferences: updatedPreferences,
              }));
            }}
          />
        </Stack>
      </Container>
    </DashboardContent>
  );
}
