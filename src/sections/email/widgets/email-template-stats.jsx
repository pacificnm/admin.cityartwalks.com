'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber, fPercent } from 'src/utils/format-number';

import { debugLog, debugError } from 'src/lib/debug';

import { Chart, useChart } from 'src/components/chart';
import { LetterIcon } from 'src/components/icons/letter-icon';
import { TrendingUpIcon } from 'src/components/icons/trending-up-icon';
import { TrendingDownIcon } from 'src/components/icons/trending-down-icon';

// ----------------------------------------------------------------------

export function EmailTemplateStats() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [templateStats, setTemplateStats] = useState({
    totalTemplates: 0,
    activeTemplates: 0,
    topTemplates: [],
    usageByCategory: {},
  });

  useEffect(() => {
    fetchTemplateStats();
  }, []);

  const fetchTemplateStats = async () => {
    try {
      debugLog('EmailTemplateStats.fetchTemplateStats', 'Fetching template statistics');

      // TODO: Replace with actual API call
      // const response = await fetch('/api/email/analytics/template-stats');
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        setTemplateStats({
          totalTemplates: 24,
          activeTemplates: 18,
          topTemplates: [
            {
              id: '1',
              name: 'Welcome Email',
              category: 'Onboarding',
              usageCount: 3456,
              successRate: 98.5,
              trend: { value: 12.5, isUp: true },
            },
            {
              id: '2',
              name: 'Weekly Digest',
              category: 'Newsletter',
              usageCount: 2890,
              successRate: 97.2,
              trend: { value: 8.3, isUp: true },
            },
            {
              id: '3',
              name: 'Password Reset',
              category: 'Transactional',
              usageCount: 1567,
              successRate: 99.8,
              trend: { value: 3.2, isUp: false },
            },
            {
              id: '4',
              name: 'New Art Notification',
              category: 'Notification',
              usageCount: 1234,
              successRate: 96.5,
              trend: { value: 15.7, isUp: true },
            },
            {
              id: '5',
              name: 'Path Approved',
              category: 'Notification',
              usageCount: 890,
              successRate: 99.1,
              trend: { value: 5.4, isUp: true },
            },
          ],
          usageByCategory: {
            Onboarding: 3456,
            Newsletter: 2890,
            Transactional: 2457,
            Notification: 3124,
            Marketing: 1865,
          },
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      debugError('EmailTemplateStats.fetchTemplateStats', 'Failed to fetch template stats', error);
      setLoading(false);
    }
  };

  const chartData = {
    series: Object.values(templateStats.usageByCategory),
    labels: Object.keys(templateStats.usageByCategory),
  };

  const chartOptions = useChart({
    labels: chartData.labels,
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.error.main,
    ],
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper],
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Sent',
              formatter: () =>
                fNumber(Object.values(templateStats.usageByCategory).reduce((a, b) => a + b, 0)),
            },
          },
        },
      },
    },
  });

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

  const maxUsage = Math.max(...templateStats.topTemplates.map((t) => t.usageCount));

  return (
    <Card>
      <CardHeader
        title="Template Usage Statistics"
        subheader={`${templateStats.activeTemplates} of ${templateStats.totalTemplates} templates active`}
      />
      <CardContent>
        <Stack spacing={3}>
          {/* Usage by Category Chart */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
              Usage by Category
            </Typography>
            <Chart type="donut" series={chartData.series} options={chartOptions} height={240} />
          </Box>

          {/* Top Templates List */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Top Performing Templates
            </Typography>
            <List disablePadding>
              {templateStats.topTemplates.map((template, index) => (
                <ListItem key={template.id} sx={{ px: 0 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <LetterIcon sx={{ width: 20, height: 20 }} />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{template.name}</Typography>
                        <Chip label={template.category} size="small" variant="soft" />
                      </Box>
                    }
                    secondary={
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(template.usageCount / maxUsage) * 100}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 1,
                              bgcolor: 'divider',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 1,
                              },
                            }}
                          />
                          <Typography variant="caption" sx={{ minWidth: 50 }}>
                            {fNumber(template.usageCount)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Success: {fPercent(template.successRate)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {template.trend.isUp ? (
                              <TrendingUpIcon
                                sx={{ width: 16, height: 16, color: 'success.main' }}
                              />
                            ) : (
                              <TrendingDownIcon
                                sx={{ width: 16, height: 16, color: 'error.main' }}
                              />
                            )}
                            <Typography
                              variant="caption"
                              color={template.trend.isUp ? 'success.main' : 'error.main'}
                            >
                              {template.trend.value}%
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
