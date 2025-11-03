'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber, fPercent } from 'src/utils/format-number';

import { debugLog, debugError } from 'src/lib/debug';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const FrequencyCard = ({ title, value, total, color, description }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" color={`${color}.main`}>
              {fNumber(value)}
            </Typography>
            <Chip label={fPercent(percentage)} size="small" color={color} variant="soft" />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------

export function UserFrequencyAnalysis() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState({
    totalActiveUsers: 0,
    frequencyBreakdown: {
      daily: 0,
      weekly: 0,
      monthly: 0,
      occasional: 0,
    },
    engagementByFrequency: {
      daily: { openRate: 0, clickRate: 0, unsubscribeRate: 0 },
      weekly: { openRate: 0, clickRate: 0, unsubscribeRate: 0 },
      monthly: { openRate: 0, clickRate: 0, unsubscribeRate: 0 },
    },
    trendData: {
      categories: [],
      series: [],
    },
  });

  useEffect(() => {
    fetchFrequencyAnalysis();
  }, []);

  const fetchFrequencyAnalysis = async () => {
    try {
      debugLog('UserFrequencyAnalysis.fetchFrequencyAnalysis', 'Fetching frequency analysis data');

      // TODO: Replace with actual API call
      // const response = await fetch('/api/users/frequency-analysis');
      // const data = await response.json();

      // Mock data for now
      setTimeout(() => {
        setAnalysisData({
          totalActiveUsers: 8547,
          frequencyBreakdown: {
            daily: 1234,
            weekly: 3456,
            monthly: 2890,
            occasional: 967,
          },
          engagementByFrequency: {
            daily: { openRate: 78.5, clickRate: 34.2, unsubscribeRate: 1.2 },
            weekly: { openRate: 65.3, clickRate: 28.7, unsubscribeRate: 0.8 },
            monthly: { openRate: 52.1, clickRate: 18.9, unsubscribeRate: 0.3 },
          },
          trendData: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            series: [
              {
                name: 'Daily Users',
                data: [1100, 1150, 1200, 1180, 1220, 1234],
              },
              {
                name: 'Weekly Users',
                data: [3200, 3300, 3400, 3350, 3400, 3456],
              },
              {
                name: 'Monthly Users',
                data: [2700, 2750, 2800, 2850, 2870, 2890],
              },
            ],
          },
        });
        setLoading(false);
      }, 600);
    } catch (error) {
      debugError(
        'UserFrequencyAnalysis.fetchFrequencyAnalysis',
        'Failed to fetch frequency analysis',
        error
      );
      setLoading(false);
    }
  };

  // Chart for frequency distribution
  const frequencyChartData = {
    series: Object.values(analysisData.frequencyBreakdown),
    labels: Object.keys(analysisData.frequencyBreakdown).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    ),
  };

  const frequencyChartOptions = useChart({
    labels: frequencyChartData.labels,
    colors: [
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.info.main,
    ],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => `${fNumber(value)} users`,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Users',
              formatter: () => fNumber(analysisData.totalActiveUsers),
            },
          },
        },
      },
    },
  });

  // Chart for trends
  const trendChartOptions = useChart({
    xaxis: {
      categories: analysisData.trendData.categories,
    },
    yaxis: {
      title: {
        text: 'Number of Users',
      },
    },
    colors: [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main],
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${fNumber(val)} users`,
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

  return (
    <Card>
      <CardHeader title="Email Frequency Analysis" />
      <CardContent>
        <Grid container spacing={3}>
          {/* Frequency Breakdown Cards */}
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FrequencyCard
                  title="Daily Recipients"
                  value={analysisData.frequencyBreakdown.daily}
                  total={analysisData.totalActiveUsers}
                  color="error"
                  description="Users receiving daily emails"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FrequencyCard
                  title="Weekly Recipients"
                  value={analysisData.frequencyBreakdown.weekly}
                  total={analysisData.totalActiveUsers}
                  color="warning"
                  description="Users receiving weekly emails"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FrequencyCard
                  title="Monthly Recipients"
                  value={analysisData.frequencyBreakdown.monthly}
                  total={analysisData.totalActiveUsers}
                  color="success"
                  description="Users receiving monthly emails"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FrequencyCard
                  title="Occasional Recipients"
                  value={analysisData.frequencyBreakdown.occasional}
                  total={analysisData.totalActiveUsers}
                  color="info"
                  description="Users receiving occasional emails"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardHeader title="Frequency Distribution" />
              <CardContent>
                <Chart
                  type="donut"
                  series={frequencyChartData.series}
                  options={frequencyChartOptions}
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardHeader title="Frequency Trends" />
              <CardContent>
                <Chart
                  type="line"
                  series={analysisData.trendData.series}
                  options={trendChartOptions}
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Engagement by Frequency Table */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardHeader title="Engagement by Email Frequency" />
              <CardContent>
                <Box sx={{ overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: 'left',
                            padding: '12px',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Frequency
                        </th>
                        <th
                          style={{
                            textAlign: 'right',
                            padding: '12px',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Users
                        </th>
                        <th
                          style={{
                            textAlign: 'right',
                            padding: '12px',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Open Rate
                        </th>
                        <th
                          style={{
                            textAlign: 'right',
                            padding: '12px',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Click Rate
                        </th>
                        <th
                          style={{
                            textAlign: 'right',
                            padding: '12px',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          Unsubscribe Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(analysisData.frequencyBreakdown).map(([frequency, count]) => {
                        const engagement = analysisData.engagementByFrequency[frequency] || {
                          openRate: 0,
                          clickRate: 0,
                          unsubscribeRate: 0,
                        };
                        return (
                          <tr key={frequency}>
                            <td
                              style={{
                                padding: '12px',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {frequency}
                              </Typography>
                            </td>
                            <td
                              style={{
                                padding: '12px',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                textAlign: 'right',
                              }}
                            >
                              <Typography variant="body2">{fNumber(count)}</Typography>
                            </td>
                            <td
                              style={{
                                padding: '12px',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                textAlign: 'right',
                              }}
                            >
                              <Typography
                                variant="body2"
                                color={
                                  engagement.openRate > 60
                                    ? 'success.main'
                                    : engagement.openRate > 40
                                      ? 'warning.main'
                                      : 'error.main'
                                }
                              >
                                {fPercent(engagement.openRate)}
                              </Typography>
                            </td>
                            <td
                              style={{
                                padding: '12px',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                textAlign: 'right',
                              }}
                            >
                              <Typography
                                variant="body2"
                                color={
                                  engagement.clickRate > 25
                                    ? 'success.main'
                                    : engagement.clickRate > 15
                                      ? 'warning.main'
                                      : 'error.main'
                                }
                              >
                                {fPercent(engagement.clickRate)}
                              </Typography>
                            </td>
                            <td
                              style={{
                                padding: '12px',
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                textAlign: 'right',
                              }}
                            >
                              <Typography
                                variant="body2"
                                color={
                                  engagement.unsubscribeRate < 1
                                    ? 'success.main'
                                    : engagement.unsubscribeRate < 2
                                      ? 'warning.main'
                                      : 'error.main'
                                }
                              >
                                {fPercent(engagement.unsubscribeRate)}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
