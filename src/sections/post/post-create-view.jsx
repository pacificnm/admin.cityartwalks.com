'use client';

import { paths } from 'src/routes/paths';

import { PostForm } from 'src/forms/post';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function PostCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new post"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.post.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PostForm />
    </DashboardContent>
  );
}
