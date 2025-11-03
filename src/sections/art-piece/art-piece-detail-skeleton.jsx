/**
 * @version 1.0.0
 * @namespace CityArtWalks.Sections.ArtPiece.View.ArtPieceDetailSkeleton
 * @description Skeleton view for the ArtPieceDetailView component.
 */

'use client';

import { Tab, Box, Card, Tabs, Skeleton, Container, useMediaQuery } from '@mui/material';

import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ArtistIcon, ArtPieceIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * @constant TABS
 * @description Defines the tab configurations for the ArtPieceDetailSkeleton component.
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
  {
    value: 'artPiece',
    label: 'Art Piece',
    icon: <ArtPieceIcon width={24} />,
  },
];

/**
 * @function ArtPieceDetailSkeleton
 * @description Displays a skeleton view for ArtPieceDetailView while data is loading.
 *
 * @returns {JSX.Element} The skeleton component for ArtPieceDetailView.
 */
export function ArtPieceDetailSkeleton() {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens
  const pageProgress = useScrollProgress();

  return (
    <ErrorBoundary>
      <Box data-cy="art-piece-detail-skeleton">
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
                { name: 'Artists', href: '#' },
                { name: 'Artwork', href: '#' },
              ]}
            />
          )}
          <RoleBasedGuard
            allowedRoles={['public', 'USER', 'MEMBER', 'ADMIN']}
            displayMode="view"
            protecting="ArtPieceDetailSkeleton"
          >
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

            <Box>
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={150}
                  sx={{ mb: 2, borderRadius: 1 }}
                />
              ))}
            </Box>
          </RoleBasedGuard>
        </Container>
      </Box>
    </ErrorBoundary>
  );
}
