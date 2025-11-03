import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { useDeletePost } from 'src/actions/post/hooks';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

import { PostItemSkeleton } from './post-skeleton';
import { PostItemHorizontal } from './post-item-horizontal';

// ----------------------------------------------------------------------

export function PostListHorizontal({ posts, loading, onPostDeleted }) {
  const { accessToken } = useAuthContext();
  const deletePost = useDeletePost(accessToken);

  const handleDeletePost = useCallback(
    async (postId) => {
      try {
        await deletePost(postId);
        toast.success('Post deleted successfully');
        // Call the callback to refresh the list
        if (onPostDeleted) {
          onPostDeleted(postId);
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        toast.error('Failed to delete post');
      }
    },
    [deletePost, onPostDeleted]
  );

  const renderLoading = () => <PostItemSkeleton variant="horizontal" />;

  const renderList = () =>
    posts.map((post) => (
      <PostItemHorizontal
        key={post.postId}
        post={post}
        detailsHref={paths.dashboard.post.details(post.slug)}
        editHref={paths.dashboard.post.edit(post.slug)}
        onDelete={handleDeletePost}
      />
    ));

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        {loading ? renderLoading() : renderList()}
      </Box>

      {posts.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
