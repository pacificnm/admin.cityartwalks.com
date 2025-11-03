'use client';

import { useMemo } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { fNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { EditIcon } from 'src/components/icons/edit-icon';
import { ChatIcon } from 'src/components/icons/chat-icon';

import { useAuthContext } from 'src/auth/hooks';

export function CommentSummaryCard({
  postId,
  postTitle,
  onCreateComment,
  showCreateButton = true,
  totalCount = 0,
  sx,
  ...other
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuthContext();

  // Format the comment count text
  const commentCountText = useMemo(() => {
    if (totalCount === 0) return 'No comments yet';
    if (totalCount === 1) return '1 comment';
    return `${fNumber(totalCount)} comments`;
  }, [totalCount]);

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, ...sx }} {...other}>
      <Stack spacing={3}>
        {/* Header Section */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChatIcon
              size={{ xs: 20, sm: 24 }}
              sx={{
                color: 'primary.main',
              }}
            />
            <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Comments
            </Typography>
            <Chip
              label={commentCountText}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>

          {/* Write Comment Button */}
          {showCreateButton && onCreateComment && user && (
            <Button
              variant="contained"
              color="primary"
              onClick={onCreateComment}
              startIcon={<EditIcon size={16} />}
              size={isMobile ? 'medium' : 'small'}
              sx={{
                py: 0.5,
                px: { xs: 2, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '0.8rem' },
                minWidth: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              Write Comment
            </Button>
          )}
        </Box>

        <Divider />

        {/* Comment Stats */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Engagement Message */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify
              icon="solar:chat-round-dots-bold"
              width={20}
              sx={{ color: theme.palette.text.secondary }}
            />
            <Typography variant="body2" color="text.secondary">
              {totalCount === 0
                ? 'Be the first to share your thoughts!'
                : 'Join the conversation below'}
            </Typography>
          </Box>

          {/* Guidelines */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor:
                theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            }}
          >
            <Typography variant="caption" color="text.secondary" component="div">
              <strong>Community Guidelines:</strong>
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  • Be respectful and constructive
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  • Stay on topic
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  • Add value to the discussion
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Login prompt for non-authenticated users */}
          {!user && showCreateButton && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: theme.palette.primary.lighter,
                border: `1px solid ${theme.palette.primary.light}`,
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Typography variant="body2" color="primary.main" fontWeight="medium">
                  Want to join the discussion?
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  href="/auth/login"
                  sx={{ fontSize: '0.875rem' }}
                >
                  Sign in to comment
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  );
}

CommentSummaryCard.propTypes = {
  postId: PropTypes.number.isRequired,
  postTitle: PropTypes.string,
  onCreateComment: PropTypes.func,
  showCreateButton: PropTypes.bool,
  totalCount: PropTypes.number,
  sx: PropTypes.object,
};
