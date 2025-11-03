import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';
// ----------------------------------------------------------------------

/**
 * AppCurrentDownload displays a donut chart with legends and a loading spinner in the card header.
 * Used for analytics widgets such as top browsers or downloads.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - If true, shows a loading spinner and disables chart/legends
 * @param {string} props.title - The title of the widget
 * @param {string} [props.subheader] - Optional subheader text
 * @param {Object} props.chart - Chart data and options
 * @param {Array<{label: string, value: number}>} props.chart.series - Data series for the donut chart
 * @param {string[]} [props.chart.colors] - Optional color palette for the chart
 * @param {Object} [props.chart.options] - Additional ApexCharts options
 * @param {Object|Object[]} [props.sx] - Optional style overrides for the Card
 * @returns {JSX.Element}
 * @param {...any} [props.other] - Additional props passed to the Card
 */
export function AppCurrentDownload({ isLoading, title, subheader, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.primary.lighter,
    theme.palette.primary.light,
    theme.palette.primary.dark,
    theme.palette.primary.darker,
  ];

  const chartSeries = chart.series.map((item) => item.value);

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            value: { formatter: (value) => fNumber(value) },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...chart.options,
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Box component="span" sx={{ typography: 'body2' }}>
                Loading...
              </Box>
            </Box>
          ) : null
        }
      />
      {/* Chart and legends only render when not loading */}
      {!isLoading && (
        <>
          <Chart
            type="donut"
            series={chartSeries}
            options={chartOptions}
            sx={{
              my: 6,
              mx: 'auto',
              width: { xs: 240, xl: 260 },
              height: { xs: 240, xl: 260 },
            }}
          />
          <Divider sx={{ borderStyle: 'dashed' }} />
          <ChartLegends
            labels={chartOptions?.labels}
            colors={chartOptions?.colors}
            sx={{ p: 3, justifyContent: 'center' }}
          />
        </>
      )}
    </Card>
  );
}
