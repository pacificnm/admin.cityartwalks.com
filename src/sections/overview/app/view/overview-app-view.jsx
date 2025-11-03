'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appFeatured, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';
import { TopPagesWidget } from 'src/components/analytics/top-pages-widget';
import { ErrorTableWidget } from 'src/components/analytics/error-table-widget';
import { WeeklyUsersWidget } from 'src/components/analytics/weekly-users-widget';
import { TopBrowsersWidget } from 'src/components/analytics/top-browsers-widget';
import { WeeklyPageViewsWidget } from 'src/components/analytics/weekly-page-views-widget';
import { WeeklyTimeOnSiteWidget } from 'src/components/analytics/weekly-time-on-site-widget';
import { AppTrafficInsightsWidget } from 'src/components/analytics/app-traffic-insights-widget';

import { useAuthContext } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopInstalledCountries } from '../app-top-installed-countries';
// ----------------------------------------------------------------------

/**
 * OverviewAppView renders the main dashboard view for the app overview page.
 * Displays widgets for user stats, analytics, featured content, and more, using a responsive grid layout.
 *
 * @component
 * @returns {JSX.Element}
 */

export function OverviewAppView() {
  const { user } = useAuthContext();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WeeklyUsersWidget />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WeeklyPageViewsWidget />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WeeklyTimeOnSiteWidget />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <TopBrowsersWidget />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <TopPagesWidget />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <ErrorTableWidget />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppTrafficInsightsWidget />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppTopInstalledCountries title="Top installed countries" list={_appInstalled} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppTopAuthors title="Top authors" list={_appAuthors} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{ series: 48 }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="solar:letter-bold"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{
                bgcolor: 'info.dark',
                [`& .${svgColorClasses.root}`]: { color: 'info.light' },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
