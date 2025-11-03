'use client';

import { useState, useCallback } from 'react';

import Tabs from '@mui/material/Tabs';
import { Tab, Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { ListIcon, DashboardIcon } from 'src/components/icons';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ReviewModerationDashboard } from 'src/components/review/review-moderation-dashboard';

import { useAuthContext } from 'src/auth/hooks';

const TABS = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    value: 'queue',
    label: 'Moderation Queue',
    icon: <ListIcon />,
  },
];

export function ModerationView() {
  const { authenticated, accessToken } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('dashboard');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  if (!authenticated || !accessToken) {
    return <DashboardContent>Access denied</DashboardContent>;
  }

  return (
    <DashboardContent maxWidth>
      <CustomBreadcrumbs
        heading="Review Moderation"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Moderation' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 2,
            bgcolor: 'background.neutral',
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'dashboard' && <ReviewModerationDashboard />}
    </DashboardContent>
  );
}
