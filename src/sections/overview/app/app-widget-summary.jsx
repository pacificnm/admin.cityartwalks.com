import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber, fPercent } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';
// ----------------------------------------------------------------------

/**
 * AppWidgetSummary component displays a summary card with a title, total value, percent change, and a mini bar chart.
 * Shows a loading spinner in the header when loading.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - If true, shows a loading spinner and disables chart/trending
 * @param {string} props.title - The title of the widget
 * @param {number} props.percent - The percent change value (positive or negative)
 * @param {number|string} props.total - The total value to display (number or formatted string)
 * @param {Object} props.chart - Chart data and options
 * @param {number[]} props.chart.series - Data series for the bar chart
 * @param {string[]} [props.chart.categories] - Categories for the x-axis
 * @param {string[]} [props.chart.colors] - Optional color palette for the chart
 * @param {Object} [props.chart.options] - Additional ApexCharts options
 * @param {Object|Object[]} [props.sx] - Optional style overrides for the Card
 * @returns {JSX.Element}
 * @param {...any} [props.other] - Additional props passed to the Card
 */
export function AppWidgetSummary({ isLoading, title, percent, total, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [theme.palette.primary.main];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: {
      y: { formatter: (value) => fNumber(value), title: { formatter: () => '' } },
    },
    plotOptions: { bar: { borderRadius: 1.5, columnWidth: '64%' } },
    ...chart.options,
  });

  /**
   * Renders the trending indicator with percent change and icon.
   * @private
   * @returns {JSX.Element}
   */
  const renderTrending = () => (
    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Box component="span" sx={{ typography: 'body2' }}>
            Loading...
          </Box>
        </Box>
      ) : null}
      <Iconify
        width={24}
        icon={
          percent < 0
            ? 'solar:double-alt-arrow-down-bold-duotone'
            : 'solar:double-alt-arrow-up-bold-duotone'
        }
        sx={{
          flexShrink: 0,
          color: 'success.main',
          ...(percent < 0 && { color: 'error.main' }),
        }}
      />

      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>

      <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
        last 7 days
      </Box>
    </Box>
  );

  return (
    <Card
      sx={[
        () => ({
          p: 3,
          display: 'flex',
          zIndex: 'unset',
          overflow: 'unset',
          alignItems: 'center',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ typography: 'subtitle2' }}>{title}</Box>
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Box component="span" sx={{ typography: 'body2' }}>
                Loading...
              </Box>
            </Box>
          ) : null}
        </Box>

        <Box sx={{ mt: 1.5, mb: 1, typography: 'h3' }}>
          {typeof total === 'number' ? fNumber(total) : total}
        </Box>

        {!isLoading && renderTrending()}
      </Box>

      {!isLoading && (
        <Chart
          type="bar"
          series={[{ data: chart.series }]}
          options={chartOptions}
          sx={{ width: 60, height: 40 }}
        />
      )}
    </Card>
  );
}
