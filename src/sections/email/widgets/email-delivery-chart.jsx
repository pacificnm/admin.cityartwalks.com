'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import ToggleButton from '@mui/material/ToggleButton';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { debugLog, debugError } from 'src/lib/debug';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function EmailDeliveryChart() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  useEffect(() => {
    fetchChartData(timeRange);
  }, [timeRange]);

  const fetchChartData = async (range) => {
    try {
      debugLog('EmailDeliveryChart.fetchChartData', 'Fetching delivery chart data', { range });
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/email/analytics/delivery-chart?range=${range}`);
      // const data = await response.json();

      // Mock data based on time range
      setTimeout(() => {
        let mockData = {};

        if (range === '24h') {
          mockData = {
            categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
            series: [
              {
                name: 'Delivered',
                data: [120, 145, 190, 225, 180, 165, 140],
              },
              {
                name: 'Failed',
                data: [5, 8, 12, 15, 10, 8, 6],
              },
              {
                name: 'Pending',
                data: [10, 15, 8, 5, 12, 20, 15],
              },
            ],
          };
        } else if (range === '7d') {
          mockData = {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            series: [
              {
                name: 'Delivered',
                data: [820, 945, 1090, 1225, 980, 665, 540],
              },
              {
                name: 'Failed',
                data: [25, 38, 52, 45, 30, 18, 16],
              },
              {
                name: 'Pending',
                data: [40, 55, 38, 25, 42, 60, 45],
              },
            ],
          };
        } else {
          mockData = {
            categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            series: [
              {
                name: 'Delivered',
                data: [3820, 4245, 4890, 5125],
              },
              {
                name: 'Failed',
                data: [125, 138, 152, 145],
              },
              {
                name: 'Pending',
                data: [140, 155, 138, 125],
              },
            ],
          };
        }

        setChartData(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      debugError('EmailDeliveryChart.fetchChartData', 'Failed to fetch chart data', error);
      setLoading(false);
    }
  };

  const chartOptions = useChart({
    colors: [theme.palette.success.main, theme.palette.error.main, theme.palette.warning.main],
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      title: {
        text: 'Number of Emails',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} emails`,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
    },
  });

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Email Delivery Rates"
        action={
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
          >
            <ToggleButton value="24h">24H</ToggleButton>
            <ToggleButton value="7d">7D</ToggleButton>
            <ToggleButton value="30d">30D</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Chart type="bar" series={chartData.series} options={chartOptions} height={364} />
        )}
      </CardContent>
    </Card>
  );
}
