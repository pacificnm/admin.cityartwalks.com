'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { debugLog } from 'src/lib/debug';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetPaginatedEmails } from 'src/actions/email/hooks';

import { EditIcon } from 'src/components/icons/edit-icon';
import { ViewIcon } from 'src/components/icons/view-icon';
import { ChartIcon } from 'src/components/icons/chart-icon';
import { useSettingsContext } from 'src/components/settings';
import { CursorIcon } from 'src/components/icons/cursor-icon';
import { LetterIcon } from 'src/components/icons/letter-icon';
import { BellOffIcon } from 'src/components/icons/bell-off-icon';
import { DocumentIcon } from 'src/components/icons/document-icon';
import { SettingsIcon } from 'src/components/icons/settings-icon';
import { UsersGroupIcon } from 'src/components/icons/users-group-icon';
import { CheckCircleIcon } from 'src/components/icons/check-circle-icon';
import { ShieldWarningIcon } from 'src/components/icons/shield-warning-icon';
import { ArrowDoubleUpIcon } from 'src/components/icons/arrow-double-up-icon';
import { ArrowDoubleDownIcon } from 'src/components/icons/arrow-double-down-icon';

import { useAuthContext } from 'src/auth/hooks';

import { EmailRecentTable } from './widgets/email-recent-table';
import { EmailDeliveryChart } from './widgets/email-delivery-chart';
import { EmailTemplateStats } from './widgets/email-template-stats';
import { EmailTrackingWidget } from './widgets/email-tracking-widget';
import { EmailTimelineWidget } from './widgets/email-timeline-widget';
import { EmailAnalyticsWidget } from './widgets/email-analytics-widget';

// ----------------------------------------------------------------------

// Summary Card Component
function SummaryCard({ icon, title, value, subtitle, color = 'primary', trend }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1.5,
                bgcolor: `${color}.lighter`,
                color: `${color}.main`,
              }}
            >
              {icon}
            </Box>
            {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {trend > 0 ? (
                  <ArrowDoubleUpIcon sx={{ color: 'success.main', width: 16, height: 16 }} />
                ) : (
                  <ArrowDoubleDownIcon sx={{ color: 'error.main', width: 16, height: 16 }} />
                )}
                <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
                  {Math.abs(trend)}%
                </Typography>
              </Stack>
            )}
          </Stack>
          <Box>
            <Typography variant="h4">{value}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.disabled">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function EmailDashboardView() {
  const settings = useSettingsContext();
  const { accessToken } = useAuthContext();
  const [stats, setStats] = useState({
    totalSent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    failed: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
  });

  // Get recent emails to calculate statistics
  const { emails, paginationMeta } = useGetPaginatedEmails({}, 1, 100, accessToken ?? '', 600);

  useEffect(() => {
    if (emails && emails.length > 0) {
      calculateStatsFromEmails(emails, paginationMeta.total);
    }
  }, [emails, paginationMeta]);

  const calculateStatsFromEmails = (emailData, total) => {
    try {
      const statusCounts = emailData.reduce((acc, email) => {
        const status = email.deliveryStatus;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const delivered = statusCounts.delivered || 0;
      const failed = statusCounts.failed || 0;
      const bounced = statusCounts.bounced || 0;
      const pending = statusCounts.pending || 0;
      const sent = total - pending;

      const calculatedStats = {
        totalSent: sent,
        delivered,
        opened: 0, // Would need to check EmailAnalytic table for opened events
        clicked: 0, // Would need to check EmailAnalytic table for clicked events
        bounced,
        failed,
        deliveryRate: sent > 0 ? ((delivered / sent) * 100).toFixed(1) : 0,
        openRate: 0, // Would need analytics data
        clickRate: 0, // Would need analytics data
      };

      setStats(calculatedStats);
      debugLog('EmailDashboardView.calculateStatsFromEmails', 'Stats calculated', calculatedStats);
    } catch (error) {
      debugLog('EmailDashboardView.calculateStatsFromEmails', 'Error calculating stats', error);
    }
  };

  return (
    <DashboardContent maxWidth={settings.compactLayout ? false : 'xl'}>
      <Container maxWidth={settings.compactLayout ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h4">Email Dashboard</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              component={RouterLink}
              href={paths.dashboard.emailTemplate.root}
              variant="outlined"
              startIcon={<DocumentIcon />}
            >
              Templates
            </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.email.management}
              variant="contained"
              startIcon={<SettingsIcon />}
            >
              Manage Emails
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    component={RouterLink}
                    href={paths.dashboard.emailTemplate.create}
                  >
                    Create Template
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<UsersGroupIcon />}
                    component={RouterLink}
                    href={paths.dashboard.email.users}
                  >
                    User Communications
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ChartIcon />}
                    component={RouterLink}
                    href={paths.dashboard.email.management}
                  >
                    Analytics
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ShieldWarningIcon />}
                    component={RouterLink}
                    href={paths.dashboard.email.management}
                  >
                    Bounce Management
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BellOffIcon />}
                    component={RouterLink}
                    href={paths.dashboard.email.management}
                  >
                    Unsubscribes
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary Cards */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCard
              icon={<LetterIcon />}
              title="Total Sent"
              value={stats.totalSent.toLocaleString()}
              subtitle="Last 30 days"
              color="primary"
              trend={12}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCard
              icon={<CheckCircleIcon />}
              title="Delivered"
              value={stats.delivered.toLocaleString()}
              subtitle={`${stats.deliveryRate}% delivery rate`}
              color="success"
              trend={5}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCard
              icon={<ViewIcon />}
              title="Opened"
              value={stats.opened.toLocaleString()}
              subtitle={`${stats.openRate}% open rate`}
              color="info"
              trend={8}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCard
              icon={<CursorIcon />}
              title="Clicked"
              value={stats.clicked.toLocaleString()}
              subtitle={`${stats.clickRate}% click rate`}
              color="warning"
              trend={-3}
            />
          </Grid>

          {/* Email Analytics Overview Widget */}
          <Grid size={{ xs: 12, md: 12 }}>
            <EmailAnalyticsWidget />
          </Grid>

          {/* Delivery Rate Charts */}
          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            <EmailDeliveryChart />
          </Grid>

          {/* Open/Click Tracking */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <EmailTrackingWidget />
          </Grid>

          {/* Template Usage Statistics */}
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <EmailTemplateStats />
          </Grid>

          {/* User Communication Timeline */}
          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            <EmailTimelineWidget />
          </Grid>

          {/* Recent Emails Table */}
          <Grid size={{ xs: 12 }}>
            <EmailRecentTable />
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}
