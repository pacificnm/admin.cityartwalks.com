/**
 * @file post-comment-form.jsx
 * @description Form component for creating comments on posts with proper validation and error handling.
 * @version 1.0.0
 * @author Claude Code Assistant
 * @namespace CityArtWalks.Forms.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment} - Comment entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { withTracking } from 'src/utils/with-tracking';

import { debugError } from 'src/lib/debug';
import { useCreateComment } from 'src/actions/comment/hooks';
import { createCommentSchema, defaultCommentValues } from 'src/validators/comment';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { AttachIcon } from 'src/components/icons';
import { Form, Field } from 'src/components/hook-form';
import { EmojiIcon } from 'src/components/icons/emoji-icon';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * @memberof CityArtWalks.Forms.Post
 * @function PostCommentForm
 * @description Form component for creating comments on posts with proper validation and error handling.
 *
 * Features:
 * - Comment creation with rich text support
 * - User authentication integration
 * - Real-time form validation
 * - Comprehensive error handling and user feedback
 * - User avatar display
 * - Reply functionality support (via parentId)
 * - Role-based access control (requires authentication)
 * - Comment content validation (min/max length)
 * - Automatic form reset after successful submission
 *
 * @param {Object} props - Component props
 * @param {string|number} props.postId - The ID of the post to comment on (required)
 * @param {string|number} [props.parentId] - Optional parent comment ID for replies
 * @param {Function} [props.onSuccess] - Optional callback function called after successful comment creation
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @param {string} [props.placeholder] - Custom placeholder text for the comment field
 * @param {boolean} [props.showAvatar=true] - Whether to show user avatar
 * @param {boolean} [props.autoFocus=false] - Whether to auto-focus the comment field
 * @returns {JSX.Element} The rendered PostCommentForm component
 * @throws {Error} When form validation fails or API request encounters an error
 *
 * @example
 * // Basic comment form
 * <PostCommentForm
 *   postId="123"
 *   onSuccess={handleCommentSuccess}
 * />
 *
 * @example
 * // Reply form with parent comment
 * <PostCommentForm
 *   postId="123"
 *   parentId="456"
 *   placeholder="Write your reply..."
 *   showAvatar={false}
 *   autoFocus={true}
 *   onSuccess={handleReplySuccess}
 *   onCancel={handleReplyCancel}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Comment} - Comment entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function PostCommentForm({
  postId,
  parentId = null,
  onSuccess,
  onCancel,
  placeholder = 'Write your comment...',
  showAvatar = true,
  autoFocus = false,
}) {
  const { accessToken, user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook for creating comments
  const createComment = useCreateComment(accessToken);

  // Get default values using validator utility
  const defaultValues = useMemo(() => {
    const baseDefaults = defaultCommentValues();

    return {
      ...baseDefaults,
      postId: parseInt(postId, 10),
      parentId: parentId ? parseInt(parentId, 10) : null,
      createdBy: user?.userId || null,
    };
  }, [postId, parentId, user?.userId]);

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createCommentSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  const {
    reset,
    handleSubmit,
    formState: { isValid },
  } = methods;

  /**
   * @memberof CityArtWalks.Forms.Post.PostCommentForm
   * @function onSubmit
   * @description Handles form submission for comment creation.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    if (!user?.userId) {
      toast.error('You must be logged in to post comments');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!data.postId) {
        debugError(
          'CityArtWalks.Forms.Post.PostCommentForm.onSubmit',
          'Post ID is required for comment creation',
          {
            postId: data.postId,
            userId: user?.userId,
          }
        );
        toast.error('Post ID is required to create a comment');
        return;
      }

      if (!data.content || data.content.trim().length === 0) {
        toast.error('Comment content cannot be empty');
        return;
      }

      // Prepare comment data
      const commentData = {
        ...data,
        content: data.content.trim(),
        createdBy: user.userId,
        status: 'ACTIVE',
      };

      const result = await createComment(commentData);

      if (!result) {
        debugError(
          'CityArtWalks.Forms.Post.PostCommentForm.onSubmit',
          'Create comment operation returned null result',
          {
            postId: data.postId,
            parentId: data.parentId || 'None',
            userId: user.userId,
          }
        );
        toast.error('Failed to create comment - no response from server');
        return;
      }

      // Reset form on success
      reset(defaultValues);

      toast.success(parentId ? 'Reply posted successfully!' : 'Comment posted successfully!');

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          result,
          operation: 'create',
          commentData: result.data || result,
          isReply: Boolean(parentId),
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError('CityArtWalks.Forms.Post.PostCommentForm.onSubmit', 'Failed to create comment', {
        error: error.message,
        stack: error.stack,
        postId: data.postId,
        parentId: data.parentId || 'None',
        userId: user?.userId,
        contentLength: data.content?.length || 0,
        timestamp: new Date().toISOString(),
      });

      // Enhanced error message based on error type
      let errorMessage = 'Failed to post comment. Please try again.';

      if (error.message.includes('validation')) {
        errorMessage = 'Please check your comment for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to post comments.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'This comment already exists.';
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  /**
   * @memberof CityArtWalks.Forms.Post.PostCommentForm
   * @function handleCancel
   * @description Handles form cancellation by resetting to original values.
   */
  const handleCancel = () => {
    reset(defaultValues);
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <RoleBasedGuard
      allowedRoles={['USER', 'MEMBER', 'ADMIN']}
      displayMode="content"
      protecting="PostCommentForm"
      fallback={
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Please <strong>sign in</strong> to post comments
          </Typography>
        </Box>
      }
    >
      <ErrorBoundary>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* User Avatar */}
            {showAvatar && (
              <Avatar
                src={user?.picture || user?.avatar}
                alt={user?.name || user?.displayName || 'User'}
                sx={{ width: 40, height: 40 }}
              >
                {(user?.name || user?.displayName || 'U').charAt(0).toUpperCase()}
              </Avatar>
            )}

            {/* Comment Form */}
            <Box sx={{ flexGrow: 1 }}>
              <Field.Text
                name="content"
                placeholder={placeholder}
                multiline
                rows={4}
                autoFocus={autoFocus}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />

              {/* Form Actions and Tools */}
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Comment Tools */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    sx={{ color: 'text.secondary' }}
                    title="Add image (coming soon)"
                    disabled
                  >
                    <Iconify icon="solar:gallery-add-bold" />
                  </IconButton>

                  <IconButton
                    size="small"
                    sx={{ color: 'text.secondary' }}
                    title="Attach file (coming soon)"
                    disabled
                  >
                    <AttachIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    sx={{ color: 'text.secondary' }}
                    title="Add emoji (coming soon)"
                    disabled
                  >
                    <EmojiIcon />
                  </IconButton>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {onCancel && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={isSubmitting || !isValid}
                    onClick={withTracking(() => {}, {
                      event: 'form_submit',
                      data: {
                        label: parentId ? 'Post Reply' : 'Post Comment',
                        form: 'Post Comment Form',
                        operation: 'create',
                        postId,
                        parentId: parentId || 'None',
                        isReply: Boolean(parentId),
                      },
                      userId: user?.userId,
                    })}
                  >
                    {isSubmitting ? 'Posting...' : parentId ? 'Post Reply' : 'Post Comment'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Form>
      </ErrorBoundary>
    </RoleBasedGuard>
  );
}

PostCommentForm.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  placeholder: PropTypes.string,
  showAvatar: PropTypes.bool,
  autoFocus: PropTypes.bool,
};
