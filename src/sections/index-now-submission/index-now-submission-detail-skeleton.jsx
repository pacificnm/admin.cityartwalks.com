/**
 * @fileoverview IndexNow Submission Detail Skeleton Loading Component
 *
 * Provides a skeleton placeholder interface for the IndexNow submission detail page
 * during initial loading or data fetching states. Maintains the exact layout structure
 * of the IndexNowSubmissionDetailView component with skeleton placeholders for all
 * interactive elements and content areas.
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
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Detail-View} - IndexNow Detail View Documentation
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
 * IndexNow Submission Detail Skeleton Component
 *
 * Renders a skeleton loading interface that matches the exact layout structure
 * of the IndexNowSubmissionDetailView component. Displays placeholder content
 * for all major sections including header, basic information, URL details,
 * response information, entity data, and audit trail.
 *
 * @memberof CityArtWalks.Sections.IndexNowSubmission
 * @function IndexNowSubmissionDetailSkeleton
 * @returns {JSX.Element} Skeleton loading interface for IndexNow submission details
 *
 * @example
 * // Usage in IndexNowSubmissionDetailView component
 * if (loading) {
 *   return <IndexNowSubmissionDetailSkeleton />;
 * }
 */
export function IndexNowSubmissionDetailSkeleton() {
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
              <Skeleton variant="text" width={300} height={40} />
              <Skeleton variant="text" width={400} height={24} />
            </Box>

            <Stack direction="row" spacing={1}>
              <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
            </Stack>
          </Stack>

          {/* Basic Information Skeleton */}
          <Card>
            <CardContent>
              <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={2}>
                    {[...Array(4)].map((_, index) => (
                      <Stack key={index} direction="row" justifyContent="space-between">
                        <Skeleton variant="text" width={80} height={20} />
                        <Skeleton variant="text" width={100} height={20} />
                      </Stack>
                    ))}
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={2}>
                    {[...Array(4)].map((_, index) => (
                      <Stack key={index} direction="row" justifyContent="space-between">
                        <Skeleton variant="text" width={80} height={20} />
                        <Skeleton variant="text" width={120} height={20} />
                      </Stack>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* URL Information Skeleton */}
          <Card>
            <CardContent>
              <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Skeleton variant="text" width="100%" height={20} />
              </Box>
            </CardContent>
          </Card>

          {/* API Response Skeleton */}
          <Card>
            <CardContent>
              <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                }}
              >
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            </CardContent>
          </Card>

          {/* Entity Information Skeleton */}
          <Card>
            <CardContent>
              <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[...Array(6)].map((_, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Stack direction="row" justifyContent="space-between">
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="text" width={100} height={20} />
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Audit Trail Skeleton */}
          <Card>
            <CardContent>
              <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
              <Stack spacing={2}>
                {[...Array(2)].map((_, index) => (
                  <Stack key={index} direction="row" justifyContent="space-between">
                    <Skeleton variant="text" width={100} height={20} />
                    <Skeleton variant="text" width={80} height={20} />
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
