'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ReviewModerationQueue } from 'src/components/review/review-moderation-queue';

import { useAuthContext } from 'src/auth/hooks';

export function ModerationQueueView() {
  const { authenticated, accessToken } = useAuthContext();

  if (!authenticated || !accessToken) {
    return <DashboardContent>Access denied</DashboardContent>;
  }

  return (
    <DashboardContent maxWidth>
      <CustomBreadcrumbs
        heading="Review Moderation Queue"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Moderation', href: paths.dashboard.moderation },
          { name: 'Queue' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ReviewModerationQueue />
    </DashboardContent>
  );
}
