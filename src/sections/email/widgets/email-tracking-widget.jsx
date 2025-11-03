'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber, fPercent } from 'src/utils/format-number';

import { debugLog, debugError } from 'src/lib/debug';

import { ViewIcon } from 'src/components/icons/view-icon';
import { LinkIcon } from 'src/components/icons/link-icon';
import { CursorIcon } from 'src/components/icons/cursor-icon';
import { HandStarsIcon } from 'src/components/icons/hand-stars-icon';
import { InfoCircleIcon } from 'src/components/icons/info-circle-icon';

// ----------------------------------------------------------------------

const TrackingMetric = ({ icon, label, value, total, color, info }) => {
  const percentage = (value / total) * 100;

  return (
    <Stack spacing={1}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: `${color}.main` }}>{icon}</Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        {info && (
          <Tooltip title={info}>
            <IconButton size="small">
              <InfoCircleIcon sx={{ fontSize: 'small' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: `${color}.lighter`,
              '& .MuiLinearProgress-bar': {
                bgcolor: `${color}.main`,
                borderRadius: 1,
              },
            }}
          />
        </Box>
        <Typography variant="subtitle2" sx={{ minWidth: 60, textAlign: 'right' }}>
          {fPercent(percentage)}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {fNumber(value)} of {fNumber(total)} emails
      </Typography>
    </Stack>
  );
};

// ----------------------------------------------------------------------

export function EmailTrackingWidget() {
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState({
    totalSent: 0,
    opened: 0,
    clicked: 0,
    uniqueClicks: 0,
    linkClicks: {},
    deviceBreakdown: {
      desktop: 0,
      mobile: 0,
      tablet: 0,
    },
  });

  useEffect(() => {
    fetchTrackingData();
  }, []);

  const fetchTrackingData = async () => {
    try {
      debugLog('EmailTrackingWidget.fetchTrackingData', 'Fetching tracking data');

      // TODO: Replace with actual API call
      // const response = await fetch('/api/email/analytics/tracking');
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        setTrackingData({
          totalSent: 14892,
          opened: 8234,
          clicked: 3456,
          uniqueClicks: 2890,
          linkClicks: {
            'View Art Piece': 1234,
            'Artist Profile': 890,
            'Path Details': 567,
            Unsubscribe: 45,
          },
          deviceBreakdown: {
            desktop: 4567,
            mobile: 2890,
            tablet: 777,
          },
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      debugError('EmailTrackingWidget.fetchTrackingData', 'Failed to fetch tracking data', error);
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

  const topLinks = Object.entries(trackingData.linkClicks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader title="Email Tracking" subheader="Open and click metrics" />
      <CardContent>
        <Stack spacing={3}>
          <TrackingMetric
            icon={<ViewIcon />}
            label="Opened"
            value={trackingData.opened}
            total={trackingData.totalSent}
            color="info"
            info="Unique email opens tracked"
          />

          <TrackingMetric
            icon={<HandStarsIcon />}
            label="Clicked"
            value={trackingData.clicked}
            total={trackingData.opened}
            color="success"
            info="Total clicks on links"
          />

          <TrackingMetric
            icon={<CursorIcon />}
            label="Unique Clicks"
            value={trackingData.uniqueClicks}
            total={trackingData.opened}
            color="warning"
            info="Unique recipients who clicked"
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
              Top Clicked Links
            </Typography>
            <Stack spacing={1}>
              {topLinks.map(([link, clicks]) => (
                <Box
                  key={link}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkIcon sx={{ fontSize: 'small', color: 'action.main' }} />
                    <Typography variant="caption">{link}</Typography>
                  </Box>
                  <Chip label={fNumber(clicks)} size="small" variant="soft" color="primary" />
                </Box>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
              Device Breakdown
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">Desktop</Typography>
                <Typography variant="caption" color="text.secondary">
                  {fPercent((trackingData.deviceBreakdown.desktop / trackingData.opened) * 100)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">Mobile</Typography>
                <Typography variant="caption" color="text.secondary">
                  {fPercent((trackingData.deviceBreakdown.mobile / trackingData.opened) * 100)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">Tablet</Typography>
                <Typography variant="caption" color="text.secondary">
                  {fPercent((trackingData.deviceBreakdown.tablet / trackingData.opened) * 100)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
