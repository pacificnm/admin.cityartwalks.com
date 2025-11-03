/**
 * @file review-trends-chart.jsx
 * @description Review trends visualization chart component
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Review.ReviewTrendsChart
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fNumber } from 'src/utils/format-number';

import { debugLog } from 'src/lib/debug';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';
import { TrendingUpIcon, TrendingDownIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Review.ReviewTrendsChart
 * @description Time period options for trends
 * @constant {Array<Object>} TIME_PERIODS
 */
const TIME_PERIODS = [
  { value: '7d', label: '7 Days', days: 7 },
  { value: '30d', label: '30 Days', days: 30 },
  { value: '90d', label: '90 Days', days: 90 },
  { value: '1y', label: '1 Year', days: 365 },
];

/**
 * @memberof CityArtWalks.Components.Review.ReviewTrendsChart
 * @description Metric types for visualization
 * @constant {Array<Object>} METRIC_TYPES
 */
const METRIC_TYPES = [
  {
    value: 'reviews',
    label: 'Review Count',
    color: '#1976d2',
    icon: 'solar:star-bold-duotone',
  },
  {
    value: 'rating',
    label: 'Average Rating',
    color: '#ed6c02',
    icon: 'solar:medal-star-bold-duotone',
  },
  {
    value: 'activity',
    label: 'Activity Score',
    color: '#2e7d32',
    icon: 'solar:chart-2-bold-duotone',
  },
];

/**
 * @memberof CityArtWalks.Components.Review.ReviewTrendsChart
 * @description Generate mock trend data for demonstration
 * @function generateMockTrendData
 * @param {number} days - Number of days
 * @param {string} metric - Metric type
 * @returns {Array<Object>} Trend data points
 */
function generateMockTrendData(days, metric) {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    let value;
    switch (metric) {
      case 'reviews':
        // Simulate review count with some variability
        value = Math.floor(Math.random() * 10) + 1;
        break;
      case 'rating':
        // Simulate average rating between 3.5 and 5.0
        value = (Math.random() * 1.5 + 3.5).toFixed(1);
        break;
      case 'activity':
        // Simulate activity score 0-100
        value = Math.floor(Math.random() * 40) + 30;
        break;
      default:
        value = 0;
    }

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value),
      displayDate: date.toLocaleDateString(),
    });
  }

  return data;
}

/**
 * @memberof CityArtWalks.Components.Review.ReviewTrendsChart
 * @description Main review trends chart component
 * @function ReviewTrendsChart
 * @param {Object} props - Component props
 * @param {Array} [props.trendsData] - Trends data array
 * @param {boolean} [props.loading] - Loading state
 * @param {Error} [props.error] - Error state
 * @param {string} [props.title] - Chart title
 * @param {Object} [props.sx] - Additional styling
 * @returns {JSX.Element} Review trends chart component
 */
export function ReviewTrendsChart({
  trendsData = null,
  loading = false,
  error = null,
  title = 'Review Trends',
  sx,
  ...other
}) {
  const [timePeriod, setTimePeriod] = useState('30d');
  const [metricType, setMetricType] = useState('reviews');

  // Generate chart data
  const chartData = useMemo(() => {
    debugLog(
      'CityArtWalks.Components.Review.ReviewTrendsChart.chartData',
      `Generating chart for ${timePeriod} ${metricType}`
    );

    const selectedPeriod = TIME_PERIODS.find((p) => p.value === timePeriod);
    const selectedMetric = METRIC_TYPES.find((m) => m.value === metricType);

    // Use provided data or generate mock data
    const data = trendsData || generateMockTrendData(selectedPeriod.days, metricType);

    const categories = data.map((item) => item.displayDate || item.date);
    const series = data.map((item) => item.value);

    return {
      categories,
      series,
      color: selectedMetric.color,
      metricLabel: selectedMetric.label,
    };
  }, [timePeriod, metricType, trendsData]);

  // Chart options
  const chartOptions = useChart({
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: [chartData.color],
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: { fontSize: '12px' },
        maxHeight: 60,
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: chartData.metricLabel,
        style: { fontSize: '12px' },
      },
      labels: {
        formatter: (value) => {
          if (metricType === 'rating') {
            return value.toFixed(1);
          }
          return fNumber(value);
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          if (metricType === 'rating') {
            return `${value.toFixed(1)} stars`;
          }
          if (metricType === 'activity') {
            return `${value} points`;
          }
          return `${fNumber(value)} reviews`;
        },
      },
    },
    grid: {
      borderColor: alpha('#919EAB', 0.2),
      strokeDashArray: 3,
    },
    markers: {
      size: 4,
      colors: [chartData.color],
      strokeColors: '#fff',
      strokeWidth: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
  });

  // Handle time period change
  const handleTimePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      debugLog(
        'CityArtWalks.Components.Review.ReviewTrendsChart.handleTimePeriodChange',
        `Changed to ${newPeriod}`
      );
      setTimePeriod(newPeriod);
    }
  };

  // Handle metric type change
  const handleMetricTypeChange = (event, newMetric) => {
    if (newMetric !== null) {
      debugLog(
        'CityArtWalks.Components.Review.ReviewTrendsChart.handleMetricTypeChange',
        `Changed to ${newMetric}`
      );
      setMetricType(newMetric);
    }
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!chartData.series.length) return null;

    const values = chartData.series;
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Calculate trend (simple linear regression slope)
    const n = values.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices 0,1,2...n-1
    const sumXY = values.reduce((sum, val, index) => sum + val * index, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices
    const slope = (n * sumXY - sumX * total) / (n * sumXX - sumX * sumX);

    return {
      total,
      average,
      max,
      min,
      trend: slope,
      isIncreasing: slope > 0,
    };
  }, [chartData.series]);

  if (error) {
    return <Alert severity="error">Failed to load trends data: {error.message}</Alert>;
  }

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={3}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {summaryStats && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Avg:{' '}
                {metricType === 'rating'
                  ? summaryStats.average.toFixed(1)
                  : fNumber(summaryStats.average)}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                {summaryStats.isIncreasing ? (
                  <TrendingUpIcon
                    sx={{
                      color: 'success.main',
                      width: 16,
                      height: 16,
                    }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{
                      color: 'error.main',
                      width: 16,
                      height: 16,
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  color={summaryStats.isIncreasing ? 'success.main' : 'error.main'}
                >
                  {summaryStats.isIncreasing ? 'Trending up' : 'Trending down'}
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>

        <Stack spacing={2}>
          {/* Metric Type Toggle */}
          <ToggleButtonGroup
            size="small"
            value={metricType}
            exclusive
            onChange={handleMetricTypeChange}
          >
            {METRIC_TYPES.map((metric) => (
              <ToggleButton key={metric.value} value={metric.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Iconify icon={metric.icon} width={16} />
                  <Typography variant="caption">{metric.label}</Typography>
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Time Period Toggle */}
          <ToggleButtonGroup
            size="small"
            value={timePeriod}
            exclusive
            onChange={handleTimePeriodChange}
          >
            {TIME_PERIODS.map((period) => (
              <ToggleButton key={period.value} value={period.value}>
                {period.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {/* Chart */}
      {loading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : (
        <Chart
          type="area"
          series={[{ name: chartData.metricLabel, data: chartData.series }]}
          options={chartOptions}
          height={300}
        />
      )}

      {/* Stats Summary */}
      {summaryStats && !loading && (
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}
        >
          <Box textAlign="center">
            <Typography variant="h6" color="primary">
              {metricType === 'rating' ? summaryStats.max.toFixed(1) : fNumber(summaryStats.max)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Peak
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" color="text.primary">
              {metricType === 'rating'
                ? summaryStats.average.toFixed(1)
                : fNumber(summaryStats.average)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Average
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" color="text.secondary">
              {metricType === 'rating' ? summaryStats.min.toFixed(1) : fNumber(summaryStats.min)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Low
            </Typography>
          </Box>
        </Stack>
      )}
    </Card>
  );
}

export default ReviewTrendsChart;
