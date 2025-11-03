/**
 * @fileoverview IndexNow Statistics Skeleton Loading Component
 *
 * Provides a skeleton placeholder interface for the IndexNow statistics dashboard
 * during initial loading or data fetching states. Maintains the exact layout structure
 * of the IndexNowStatsView component with skeleton placeholders for all
 * summary cards, charts, and statistical content areas.
 *
 * @namespace CityArtWalks.Sections.IndexNowSubmission
 * @version 1.0.0
 * @author Jaimie Garner
 * @since 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for skeleton UI
 * @requires src/layouts/dashboard - Dashboard layout components
 * @requires src/components/settings - Settings context and utilities
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Statistics} - IndexNow Statistics Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Loading-States} - Loading States Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Skeleton-Components} - Skeleton Components Guidelines
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

/**
 * Summary Card Skeleton Component
 *
 * Renders a skeleton loading interface for summary cards that matches
 * the exact layout structure of the SummaryCard component.
 *
 * @memberof CityArtWalks.Sections.IndexNowSubmission
 * @function SummaryCardSkeleton
 * @returns {JSX.Element} Skeleton loading interface for summary cards
 */
function SummaryCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 2 }} />

          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={80} height={28} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={120} height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={100} height={16} />
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Skeleton variant="text" width={40} height={16} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

/**
 * IndexNow Statistics Skeleton Component
 *
 * Renders a skeleton loading interface that matches the exact layout structure
 * of the IndexNowStatsView component. Displays placeholder content for all
 * major sections including header, summary cards, entity type breakdown,
 * status distribution, recent activity, and queue status.
 *
 * @memberof CityArtWalks.Sections.IndexNowSubmission
 * @function IndexNowStatsSkeleton
 * @returns {JSX.Element} Skeleton loading interface for IndexNow statistics dashboard
 *
 * @example
 * // Usage in IndexNowStatsView component
 * if (loading) {
 *   return <IndexNowStatsSkeleton />;
 * }
 */
export function IndexNowStatsSkeleton() {
  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          {/* Header Skeleton */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
              </Stack>
              <Skeleton variant="text" width={280} height={40} />
              <Skeleton variant="text" width={420} height={24} />
            </Box>

            <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
          </Stack>

          {/* Summary Cards Skeleton */}
          <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <SummaryCardSkeleton />
              </Grid>
            ))}
          </Grid>

          {/* Entity Type and Status Breakdown Skeleton */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width={220} height={32} sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    {[...Array(4)].map((_, index) => (
                      <Stack key={index} direction="row" justifyContent="space-between">
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton variant="text" width={60} height={20} />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    {[...Array(4)].map((_, index) => (
                      <Stack key={index} direction="row" justifyContent="space-between">
                        <Skeleton variant="text" width={80} height={20} />
                        <Skeleton variant="text" width={60} height={20} />
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity Skeleton */}
          <Card>
            <CardContent>
              <Skeleton variant="text" width={240} height={32} sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                {[...Array(3)].map((_, index) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={index}>
                    <Stack alignItems="center" spacing={1}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="text" width={60} height={36} />
                      <Skeleton variant="text" width={80} height={20} />
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Queue Status Skeleton */}
          <Card>
            <CardContent>
              <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {[...Array(3)].map((_, index) => (
                  <Stack key={index} direction="row" justifyContent="space-between">
                    <Skeleton variant="text" width={150} height={20} />
                    <Skeleton variant="text" width={120} height={20} />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </DashboardContent>
  );
}
