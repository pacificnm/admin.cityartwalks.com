/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.Artist.View.ArtistArtworkSkeleton
 * @description Skeleton view for the ArtistArtworkView component.
 */

'use client';

import {
  Tab,
  Box,
  Card,
  Tabs,
  Grid,
  Button,
  Skeleton,
  Container,
  useMediaQuery,
} from '@mui/material';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ArtistIcon, ArtPieceIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

/**
 * @constant TABS
 * @description Defines the tab configurations for the ArtistArtworkSkeleton component.
 * @type {Array<Object>}
 */
const TABS = [
  {
    value: 'artist',
    label: 'Artist',
    icon: <ArtistIcon width={24} />,
  },
  {
    value: 'art',
    label: 'Art Collection',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'artwork',
    label: 'Art Map',
    icon: <ArtPieceIcon width={24} />,
  },
];

/**
 * @function ArtistArtworkSkeleton
 * @description Displays a skeleton view for ArtistArtworkView while data is loading.
 *
 * @returns {JSX.Element} The skeleton component for ArtistArtworkView.
 */
export function ArtistArtworkSkeleton() {
  const pageProgress = useScrollProgress();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens

  return (
    <ErrorBoundary>
      <Box data-cy="artist-artwork-skeleton">
        <ScrollProgress
          data-cy="scroll-progress"
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop data-cy="back-to-top" />
        <Container maxWidth={false} sx={{ mb: 4 }}>
          {!isSmallScreen && (
            <CustomBreadcrumbs
              data-cy="breadcrumbs"
              heading={<Skeleton width="40%" />}
              links={[
                { name: 'Home', href: '#' },
                { name: 'Art', href: '#' },
                { name: 'Artist', href: '#' },
                { name: 'Artwork', href: '#' },
              ]}
              action={
                <Button
                  variant="contained"
                  disabled
                  sx={{ mt: 1 }}
                  startIcon={<Skeleton variant="circular" width={24} height={24} />}
                >
                  New Artwork
                </Button>
              }
              sx={{ mb: 3 }}
            />
          )}

          <Card sx={{ mb: 3, height: 290 }}>
            <Skeleton variant="rectangular" height={200} />
            <Tabs
              value={TABS[0].value}
              sx={{
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                [`& .MuiTabs-flexContainer`]: {
                  pr: { md: 3 },
                  justifyContent: { sm: 'center', md: 'flex-end' },
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  icon={<Skeleton variant="circular" width={24} height={24} />}
                  label={<Skeleton width={50} />}
                />
              ))}
            </Tabs>
          </Card>

          <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
