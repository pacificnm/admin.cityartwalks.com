'use client';

import { useTabs } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fPercent, fShortenNumber } from 'src/utils/format-number';

import {
  useVisitorAnalytics,
  useBounceRateAnalytics,
  useTopReferrersAnalytics,
  useDeviceSessionsAnalytics,
} from 'src/actions/analytics/hooks';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ErrorBoundary } from 'src/components/error/';
import { CustomTabs } from 'src/components/custom-tabs';
// ----------------------------------------------------------------------

const TABS = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'all', label: 'All Time' },
];

// ----------------------------------------------------------------------

/**
 * AppTrafficInsightsWidget displays a traffic insights analytics card with tabs for different time ranges.
 * Shows new vs returning visitors, bounce rate, device sessions, and top referrers, with loading and empty states.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.title='Traffic Insights'] - The card title
 * @param {string} [props.subheader=''] - Optional subheader text
 * @param {Object|Object[]} [props.sx] - Optional style overrides for the Card
 * @returns {JSX.Element}
 * @param {...any} [props.other] - Additional props passed to the Card
 */
export function AppTrafficInsightsWidget({
  title = 'Traffic Insights',
  subheader = '',
  sx,
  ...other
}) {
  const { data: visitorsData, isLoading: isLoadingVisitors } = useVisitorAnalytics();
  const { data: bounceData, isLoading: isLoadingBounce } = useBounceRateAnalytics();
  const { data: devicesData, isLoading: isLoadingDevices } = useDeviceSessionsAnalytics();
  const { data: referrersData, isLoading: isLoadingReferrers } = useTopReferrersAnalytics();

  const tabs = useTabs('7days');

  // Compose loading state
  const loading = isLoadingVisitors || isLoadingBounce || isLoadingDevices || isLoadingReferrers;

  // Compose data from hooks (fix: referrersData is an array, not an object)
  const data = {
    newVsReturning: {
      new: visitorsData?.new || 0,
      returning: visitorsData?.returning || 0,
    },
    bounceRate: bounceData?.bounceRate || 0,
    deviceSessions: {
      desktop: devicesData?.desktop || 0,
      mobile: devicesData?.mobile || 0,
      tablet: devicesData?.tablet || 0,
    },
    topReferrers: Array.isArray(referrersData) ? referrersData : [],
  };

  const hasNoData =
    !data.topReferrers?.length &&
    !data.deviceSessions?.desktop &&
    !data.deviceSessions?.mobile &&
    !data.deviceSessions?.tablet &&
    !data.newVsReturning?.new &&
    !data.newVsReturning?.returning &&
    !data.bounceRate;

  const renderSection = (label, content) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      {content}
    </Box>
  );

  const renderMetric = (icon, label, value) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Iconify icon={icon} width={20} sx={{ mr: 1, color: 'text.secondary' }} />
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Box>
  );

  if (loading) {
    return (
      <Card sx={sx} {...other}>
        <CardHeader title={title} subheader={subheader} />
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading analytics...
          </Typography>
        </Box>
      </Card>
    );
  }

  if (hasNoData) {
    return (
      <Card sx={sx} {...other}>
        <CardHeader title={title} subheader={subheader} />
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No analytics data available for the selected range.
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
      <ErrorBoundary>
        <CustomTabs
          value={tabs.value}
          onChange={tabs.onChange}
          variant="fullWidth"
          slotProps={{ tab: { sx: { px: 0 } } }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </CustomTabs>

        <Scrollbar sx={{ px: 3, pt: 2, pb: 3 }}>
          <Stack spacing={3}>
            {renderSection(
              'New vs Returning',
              <>
                {renderMetric(
                  'solar:user-plus-bold',
                  'New Visitors',
                  fShortenNumber(data.newVsReturning.new)
                )}
                {renderMetric(
                  'solar:user-id-bold',
                  'Returning Visitors',
                  fShortenNumber(data.newVsReturning.returning)
                )}
              </>
            )}

            {renderSection(
              'Bounce Rate',
              <Label color="warning" variant="soft">
                {fPercent(data.bounceRate / 100)}
              </Label>
            )}

            {renderSection(
              'Sessions by Device',
              <>
                {renderMetric(
                  'solar:monitor-bold',
                  'Desktop',
                  fShortenNumber(data.deviceSessions.desktop)
                )}
                {renderMetric(
                  'solar:smartphone-bold',
                  'Mobile',
                  fShortenNumber(data.deviceSessions.mobile)
                )}
                {renderMetric(
                  'solar:tablet-bold',
                  'Tablet',
                  fShortenNumber(data.deviceSessions.tablet)
                )}
              </>
            )}

            {renderSection(
              'Top Referrers',
              <Stack spacing={1}>
                {data.topReferrers.map((ref) => (
                  <Box key={ref.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{ref.name}</Typography>
                    <Typography variant="subtitle2">{fShortenNumber(ref.count)}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Scrollbar>
      </ErrorBoundary>
    </Card>
  );
}
