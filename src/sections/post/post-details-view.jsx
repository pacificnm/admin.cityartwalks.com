'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { paths } from 'src/routes/paths';

import { PostCommentForm } from 'src/forms/post';
import { useGetPostBySlug } from 'src/actions/post/hooks';

import { ErrorView } from 'src/components/error';
import { Markdown } from 'src/components/markdown';
import { EmptyContent } from 'src/components/empty-content';
import { BackToTop } from 'src/components/animate/back-to-top';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PostCommentList } from 'src/components/post/post-comment-list';
import { PostDetailsHero } from 'src/components/post/post-details-hero';
import { PostDetailsToolbar } from 'src/components/post/post-details-toolbar';
import { ChatIcon, EditIcon, DocumentIcon, InfoCircleIcon } from 'src/components/icons';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const getTabsWithCounts = (commentCount) => [
  {
    value: 'details',
    label: 'Details',
    icon: <DocumentIcon width={24} />,
  },
  {
    value: 'content',
    label: 'Content',
    icon: <EditIcon width={24} />,
  },
  {
    value: 'comments',
    label: `Comments${commentCount > 0 ? ` (${commentCount})` : ''}`,
    icon: <ChatIcon size={24} />,
  },
];

// ----------------------------------------------------------------------

export function PostDetailsView({ slug }) {
  const { accessToken } = useAuthContext();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const pageProgress = useScrollProgress();

  const [currentTab, setCurrentTab] = useState('details');

  const { loading: userIsLoading } = useAuthContext();
  const { post, postLoading, postError } = useGetPostBySlug(slug, accessToken, 3600);

  if (postError) return <ErrorView message="There was an error loading the post" />;
  if (userIsLoading || postLoading) return <div>Loading...</div>; // Temporary skeleton
  if (!post) {
    return (
      <EmptyContent
        filled
        title="Post Not Found"
        description={`The post with slug "${slug}" could not be found.`}
        imgUrl="/assets/icons/empty/ic-content.svg"
      />
    );
  }

  // Generate tabs with current counts
  const tabsWithCounts = getTabsWithCounts(post?._count?.comments || post?.comments?.length || 0);

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />
      <BackToTop />

      <Container maxWidth={false} sx={{ mb: 4 }}>
        {isSmallScreen && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" noWrap>
              {post.title}
            </Typography>
            <IconButton
              color="primary"
              aria-label="Help"
              sx={{
                bgcolor: 'primary.lighter',
                '&:hover': { bgcolor: 'primary.light' },
              }}
            >
              <InfoCircleIcon size={24} />
            </IconButton>
          </Box>
        )}

        {!isSmallScreen && (
          <CustomBreadcrumbs
            heading={post.title}
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Posts', href: paths.dashboard.post.root },
              { name: post.title },
            ]}
            action={
              <IconButton
                color="primary"
                aria-label="Help"
                sx={{
                  bgcolor: 'primary.lighter',
                  '&:hover': { bgcolor: 'primary.light' },
                }}
              >
                <InfoCircleIcon size={24} />
              </IconButton>
            }
            sx={{ mb: 3 }}
          />
        )}

        {/* Use existing toolbar */}
        <PostDetailsToolbar
          backHref={paths.dashboard.post.root}
          editHref={paths.dashboard.post.edit(post.slug)}
          liveHref={paths.post.details(post.slug)}
          publish={post.status}
          onChangePublish={() => {}}
          publishOptions={[]}
        />

        {/* Use existing hero with featured image */}
        <PostDetailsHero title={post.title} coverUrl={post.featuredImage} />

        {/* Simple tab content for now */}
        <Box sx={{ mt: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {tabsWithCounts.map((tab) => (
              <Box
                key={tab.value}
                onClick={() => setCurrentTab(tab.value)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: currentTab === tab.value ? 'primary.main' : 'background.neutral',
                  color: currentTab === tab.value ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: currentTab === tab.value ? 'primary.dark' : 'background.paper',
                  },
                }}
              >
                {tab.icon}
                <Typography variant="body2">{tab.label}</Typography>
              </Box>
            ))}
          </Box>

          {currentTab === 'details' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Post Details
              </Typography>
              <Typography variant="body1" paragraph>
                {post.excerpt}
              </Typography>
              <Typography variant="body2">Status: {post.status}</Typography>
              <Typography variant="body2">
                Published:{' '}
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString()
                  : 'Not published'}
              </Typography>
            </Box>
          )}

          {currentTab === 'content' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Content
              </Typography>
              <Markdown children={post.content} />
            </Box>
          )}

          {currentTab === 'comments' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Comments ({post?.comments?.length || 0})
              </Typography>
              <PostCommentForm postId={post.postId} />
              <PostCommentList comments={post?.comments ?? []} />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}
