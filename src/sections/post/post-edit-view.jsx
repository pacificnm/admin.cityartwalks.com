'use client';

import { paths } from 'src/routes/paths';

import { PostForm } from 'src/forms/post';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function PostEditView({ post }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.post.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.post.root },
          { name: post?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PostForm currentPost={post} />
    </DashboardContent>
  );
}
