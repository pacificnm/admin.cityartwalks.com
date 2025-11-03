'use client';

import { useState, useCallback } from 'react';

import { tabsClasses } from '@mui/material/Tabs';
import { Box, Tab, Card, Tabs, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { withTracking } from 'src/utils/with-tracking';

import { useGetCity } from 'src/actions/city';

import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ProfileHeader } from 'src/components/profile/profile-header';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { BlogIcon, ArtistIcon, WalkingIcon, ArtPieceIcon } from 'src/components/icons';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { TabPathView } from 'src/sections/path';
import { TabArtistView } from 'src/sections/artist';
import { TabArtPieceView } from 'src/sections/art-piece';

import { TabFormView } from '.';

export function CityDetailsView({ cityId }) {
  const { city, cityLoading, cityError } = useGetCity(cityId);
  const pageProgress = useScrollProgress();
  const [currentTab, setCurrentTab] = useState('form');

  // Handle tab change
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  if (cityLoading) return null;
  if (cityError) return <ErrorView message="There was an error loading cities" />;
  if (!city) return <ErrorView message="City not found" />;

  // console.log('[CityDetailsView] Rendered city:', city);
  return (
    <ErrorBoundary>
      <Box>
        <ScrollProgress
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={{ position: 'fixed' }}
        />
        <BackToTop />
        <Container maxWidth={false} sx={{ mb: 4 }}>
          <CustomBreadcrumbs
            heading="Admin City"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Cities', href: paths.dashboard.state },
              { name: city?.name || 'State Details' },
            ]}
            sx={{ mb: 3 }}
          />
          <Card sx={{ mb: 3, height: 290 }}>
            <ProfileHeader
              headerImage={city.imageUrl}
              avatarImage={city.imageUrl}
              avatarName={city.name}
            />

            <Tabs
              value={currentTab}
              onChange={withTracking(handleChangeTab, {
                event: 'tab_click',
                data: (event, newValue) => ({
                  tab: newValue,
                  section: 'State details',
                }),
              })}
              sx={{
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                [`& .${tabsClasses.list}`]: {
                  pr: { md: 3 },
                  justifyContent: {
                    sm: 'center',
                    md: 'flex-end',
                  },
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </Card>
          {currentTab === 'form' && <TabFormView currentCity={city} />}
          {currentTab === 'artist' && <TabArtistView artists={city.artist} />}
          {currentTab === 'artPiece' && <TabArtPieceView artPieces={city.artPiece} />}
          {currentTab === 'paths' && <TabPathView path={city.paths} />}
        </Container>
      </Box>
    </ErrorBoundary>
  );
}

export const TABS = [
  {
    value: 'form',
    label: 'City Details',
    icon: <BlogIcon width={24} />,
  },
  {
    value: 'artist',
    label: 'Artist',
    icon: <ArtistIcon width={24} />,
  },
  {
    value: 'artPiece',
    label: 'Art Piece',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'paths',
    label: 'Paths',
    icon: <WalkingIcon width={24} />,
  },
];
