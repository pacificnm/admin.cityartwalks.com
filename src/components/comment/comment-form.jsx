'use client';

import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';

import { debugLog, debugError } from 'src/lib/debug';
import { useCreateComment } from 'src/actions/comment/hooks';
import { createCommentSchema, defaultCommentValues } from 'src/validators/comment';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { Form } from 'src/components/hook-form/form-provider';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Comment form component for creating new comments
 *
 * @component CommentForm
 * @memberof Comment.Components
 * @param {Object} props
 * @param {number} props.postId - Post ID to create comment for
 * @param {number} props.parentId - Parent comment ID for replies (optional)
 * @param {Function} props.onCommentAdded - Callback when comment is successfully added
 * @param {string} props.placeholder - Placeholder text for comment input
 * @param {boolean} props.compact - Whether to show compact form
 * @returns {JSX.Element} Comment form component
 */
export function CommentForm({
  postId,
  parentId = null,
  onCommentAdded,
  placeholder = 'What are your thoughts?',
  compact = false,
}) {
  const { user } = useAuthContext();
  const { createComment } = useCreateComment();

  const methods = useForm({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      ...defaultCommentValues(),
      postId,
      parentId,
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const content = watch('content') || '';
  const characterCount = content.length;
  const maxCharacters = 1000; // Adjust based on your validation schema
  const characterPercentage = (characterCount / maxCharacters) * 100;

  const onSubmit = handleSubmit(async (data) => {
    try {
      debugLog('CommentForm.onSubmit', 'Creating comment', {
        postId,
        parentId,
        contentLength: data.content.length,
      });

      const result = await createComment({
        data: {
          postId,
          parentId,
          content: data.content.trim(),
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to create comment');
      }

      toast.success(parentId ? 'Reply posted successfully' : 'Comment posted successfully');

      // Reset form
      reset();

      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded(result.data);
      }
    } catch (error) {
      debugError('CommentForm.onSubmit', 'Failed to create comment', error);
      toast.error(error.message || 'Failed to post comment');
    }
  });

  const handleCancel = useCallback(() => {
    debugLog('CommentForm.handleCancel', 'Canceling comment form');
    reset();
  }, [reset]);

  // Don't render if user doesn't have permission
  if (!user || !['MEMBER', 'ADMIN'].includes(user.role)) {
    return null;
  }

  return (
    <Card sx={{ p: compact ? 2 : 3 }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2}>
          {/* Header with User Info */}
          {!compact && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 40, height: 40 }}>
                {user.firstName?.[0] || user.username?.[0] || '?'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username || 'Anonymous'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {parentId ? 'Replying to comment' : 'Add a comment'}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Comment Input */}
          <Box>
            <RHFTextField
              name="content"
              multiline
              rows={compact ? 3 : 4}
              placeholder={placeholder}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            {/* Character Count */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Typography variant="caption" color="text.secondary">
                {characterCount}/{maxCharacters} characters
              </Typography>

              {characterCount > maxCharacters * 0.8 && (
                <LinearProgress
                  variant="determinate"
                  value={Math.min(characterPercentage, 100)}
                  sx={{
                    width: 100,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'grey.300',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: characterPercentage > 100 ? 'error.main' : 'primary.main',
                    },
                  }}
                />
              )}
            </Stack>
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {content.trim() && (
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
                size={compact ? 'small' : 'medium'}
              >
                Cancel
              </Button>
            )}

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!content.trim() || characterCount > maxCharacters}
              startIcon={<Iconify icon="solar:chat-round-money-bold" />}
              size={compact ? 'small' : 'medium'}
            >
              {isSubmitting
                ? parentId
                  ? 'Posting Reply...'
                  : 'Posting Comment...'
                : parentId
                  ? 'Post Reply'
                  : 'Post Comment'}
            </LoadingButton>
          </Stack>

          {/* Guidelines */}
          {!compact && content.trim() && (
            <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Community Guidelines:</strong> Be respectful and constructive. Comments that
                violate our community standards will be moderated or removed.
              </Typography>
            </Box>
          )}
        </Stack>
      </Form>
    </Card>
  );
}

CommentForm.propTypes = {
  postId: PropTypes.number.isRequired,
  parentId: PropTypes.number,
  onCommentAdded: PropTypes.func,
  placeholder: PropTypes.string,
  compact: PropTypes.bool,
};
