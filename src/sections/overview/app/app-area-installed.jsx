import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

export function AppAreaInstalled({ isLoading, title, subheader, chart, sx, ...other }) {
  const theme = useTheme();
  const [selectedSeries, setSelectedSeries] = useState(chart.series?.[0]?.name || '');

  const chartColors = [
    theme.palette.success.main, // dashboard
    theme.palette.warning.main, // art
    theme.palette.info.main, // explore
    theme.palette.error.main, // home
    theme.palette.primary.main, // auth
  ];

  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors, // array of colors for each bar
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: { y: { formatter: (value) => fNumber(value) } },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        distributed: true, // ✅ critical fix
      },
    },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  return (
    <Card sx={{ height: '100%' }} {...other}>
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Box component="span" sx={{ typography: 'body2' }}>
            Loading...
          </Box>
        </Box>
      ) : null}
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors || []} // ✅ directly matches bar colors
        labels={chart.categories || []} // ✅ same order as data
        values={currentSeries?.data?.map((val) => fShortenNumber(val)) || []}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        key={selectedSeries}
        type="bar"
        series={
          currentSeries?.data
            ? [{ name: currentSeries.name, data: currentSeries.data }]
            : [{ name: 'Top Pages', data: [0] }]
        }
        options={chartOptions}
        slotProps={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 320,
        }}
      />
    </Card>
  );
}
