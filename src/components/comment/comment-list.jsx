'use client';

import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { CommentItem } from './comment-item';
import { CommentListSkeleton } from './comment-skeletons';

/**
 * CommentList component similar to ReviewList
 * Displays a paginated list of comments with actions
 */
export function CommentList({
  // Direct data props (used by PostComments section)
  comments: commentsProp,
  loading: loadingProp,
  totalCount,
  page: pageProp,
  rowsPerPage: rowsPerPageProp,
  onPageChange: onPageChangeProp,
  onRowsPerPageChange: onRowsPerPageChangeProp,
  postId,
  ownerId,
  onEdit,
  onDelete,
  sx,
  ...other
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useAuthContext();

  // Use direct props (we're being called by PostComments)
  const comments = commentsProp;
  const commentsLoading = loadingProp;

  // Handle page change
  const handlePageChange = useCallback(
    (event, newPage) => {
      if (onPageChangeProp) {
        // Convert to 0-based for parent component
        onPageChangeProp(event, newPage - 1);
      }
    },
    [onPageChangeProp]
  );

  // Mutation handlers
  const handleEdit = useCallback(
    (comment) => {
      if (onEdit) {
        onEdit(comment);
      }
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (comment) => {
      if (onDelete) {
        onDelete(comment);
      }
    },
    [onDelete]
  );

  // Handle loading state
  if (commentsLoading) {
    return <CommentListSkeleton sx={sx} {...other} />;
  }

  // Calculate pagination
  const currentPage = (pageProp || 0) + 1; // Convert 0-based to 1-based for display
  const totalPages = Math.ceil((totalCount || 0) / (rowsPerPageProp || 10));

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, ...sx }} {...other}>
      <Stack spacing={3}>
        {/* Comments List */}
        {comments && comments.length > 0 ? (
          <>
            <Stack spacing={2}>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  comment={comment}
                  postId={postId}
                  ownerId={ownerId}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </Stack>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            )}
          </>
        ) : (
          /* Empty State */
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Iconify
              icon="solar:chat-round-dots-bold"
              width={48}
              sx={{ color: 'text.disabled', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No comments yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share your thoughts!
            </Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
}

CommentList.propTypes = {
  comments: PropTypes.array,
  loading: PropTypes.bool,
  totalCount: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  postId: PropTypes.number,
  ownerId: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  sx: PropTypes.object,
};
