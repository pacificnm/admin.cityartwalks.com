'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber, fPercent } from 'src/utils/format-number';

import { debugLog, debugError } from 'src/lib/debug';

import { LetterIcon } from 'src/components/icons/letter-icon';
import { TrendingUpIcon } from 'src/components/icons/trending-up-icon';
import { CheckCircleIcon } from 'src/components/icons/check-circle-icon';
import { CloseCircleIcon } from 'src/components/icons/close-circle-icon';
import { ClockCircleIcon } from 'src/components/icons/clock-circle-icon';
import { LetterOpenedIcon } from 'src/components/icons/letter-opened-icon';
import { TrendingDownIcon } from 'src/components/icons/trending-down-icon';

// ----------------------------------------------------------------------

const StatCard = ({ icon, title, value, trend, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              size="small"
              label={`${trend.value}%`}
              icon={trend.isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
              color={trend.isUp ? 'success' : 'error'}
              variant="soft"
            />
          )}
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// ----------------------------------------------------------------------

export function EmailAnalyticsWidget() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalSent: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalFailed: 0,
    totalPending: 0,
    deliveryRate: 0,
    openRate: 0,
    averageDeliveryTime: 0,
    trends: {
      sent: { value: 0, isUp: true },
      delivered: { value: 0, isUp: true },
      opened: { value: 0, isUp: true },
      failed: { value: 0, isUp: false },
    },
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      debugLog('EmailAnalyticsWidget.fetchAnalytics', 'Fetching email analytics');

      // TODO: Replace with actual API call
      // const response = await fetch('/api/email/analytics');
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        setAnalytics({
          totalSent: 15234,
          totalDelivered: 14892,
          totalOpened: 8234,
          totalFailed: 342,
          totalPending: 127,
          deliveryRate: 97.76,
          openRate: 55.29,
          averageDeliveryTime: 2.4,
          trends: {
            sent: { value: 12.5, isUp: true },
            delivered: { value: 11.8, isUp: true },
            opened: { value: 8.3, isUp: true },
            failed: { value: 2.1, isUp: false },
          },
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      debugError('EmailAnalyticsWidget.fetchAnalytics', 'Failed to fetch analytics', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Email Analytics Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<LetterIcon />}
            title="Total Sent"
            value={fNumber(analytics.totalSent)}
            trend={analytics.trends.sent}
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<CheckCircleIcon />}
            title="Delivered"
            value={fNumber(analytics.totalDelivered)}
            trend={analytics.trends.delivered}
            color="success"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<LetterOpenedIcon />}
            title="Opened"
            value={fNumber(analytics.totalOpened)}
            trend={analytics.trends.opened}
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<CloseCircleIcon />}
            title="Failed"
            value={fNumber(analytics.totalFailed)}
            trend={analytics.trends.failed}
            color="error"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h4" color="success.main">
                  {fPercent(analytics.deliveryRate)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Delivery Rate
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h4" color="info.main">
                  {fPercent(analytics.openRate)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open Rate
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h4" color="warning.main">
                  {fNumber(analytics.totalPending)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Emails
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ClockCircleIcon sx={{ color: 'action.main' }} />
                  <Typography variant="h4">{analytics.averageDeliveryTime}s</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Avg. Delivery Time
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
