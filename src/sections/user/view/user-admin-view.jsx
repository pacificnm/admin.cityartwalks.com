'use client';

import { useState, useCallback } from 'react';

import Tabs from '@mui/material/Tabs';
import { Tab, Box, Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { withTracking } from 'src/utils/with-tracking';

import { useGetUser } from 'src/actions/user';
import { DashboardContent } from 'src/layouts/dashboard';

import { ProfileCover } from 'src/components/user';
import { ArtistIcon, ArtPieceIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserAdminForm } from 'src/sections/user/view/user-admin-form';

import { useAuthContext } from 'src/auth/hooks';

import {
  UserAdminPathView,
  UserAdminImageView,
  UserAdminArtistView,
  UserAdminReviewView,
  UserAdminArtPieceView,
  UserAdminAnalyticsView,
} from './';

const TABS = [
  {
    value: 'form',
    label: 'User Info',
    icon: <ArtistIcon width={24} />,
  },
  {
    value: 'analytics',
    label: 'Analytics',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'invoices',
    label: 'Invoices',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'artists',
    label: 'Artists',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'art-pieces',
    label: 'Art Pieces',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'paths',
    label: 'Paths',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'reviews',
    label: 'Reviews',
    icon: <ArtPieceIcon width={24} />,
  },
  {
    value: 'images',
    label: 'Images',
    icon: <ArtPieceIcon width={24} />,
  },
];

export function UseAdminView({ userId }) {
  const { accessToken } = useAuthContext();
  const { user: currentUser, userLoading, error, mutate } = useGetUser(userId, accessToken, 8600);
  const [currentTab, setCurrentTab] = useState('form');

  // Handle tab change
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  if (userLoading) {
    return <DashboardContent>Loading...</DashboardContent>;
  }
  if (error) {
    return <DashboardContent>Error loading user data</DashboardContent>;
  }

  return (
    <DashboardContent maxWidth>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.user.list}
        links={[
          { name: 'Dashboard', href: paths.root },
          { name: 'User List', href: paths.user.list },
          { name: currentUser?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card sx={{ mb: 3, height: 290 }}>
        <ProfileCover
          role={currentUser?.role}
          userId={currentUser?.userId}
          name={currentUser?.name}
          avatarUrl={currentUser?.image}
          coverUrl={currentUser?.coverImage}
        />
        <Box
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { md: 3 },
            display: 'flex',
            position: 'absolute',
            bgcolor: 'background.paper',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Tabs
            value={currentTab}
            onChange={withTracking(handleChangeTab, {
              event: 'tab_click',
              data: (event, newValue) => ({
                tab: newValue,
                section: 'Admin User Details',
              }),
            })}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '.MuiTabs-flexContainer': {
                gap: 2, // spacing between tabs
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
                data-cy={`tab-${tab.value}`}
              />
            ))}
          </Tabs>
        </Box>
      </Card>
      {currentTab === 'form' && <UserAdminForm currentUser={currentUser} mutate={mutate} />}
      {currentTab === 'analytics' && <UserAdminAnalyticsView userId={currentUser?.userId} />}
      {currentTab === 'images' && <UserAdminImageView userId={currentUser?.userId} />}
      {currentTab === 'art-pieces' && <UserAdminArtPieceView userId={currentUser?.userId} />}
      {currentTab === 'paths' && <UserAdminPathView userId={currentUser?.userId} />}
      {currentTab === 'reviews' && <UserAdminReviewView userId={currentUser?.userId} />}
      {currentTab === 'artists' && <UserAdminArtistView userId={currentUser?.userId} />}
    </DashboardContent>
  );
}
