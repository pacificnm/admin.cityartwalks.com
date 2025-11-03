/**
 * @file post-form.jsx
 * @description Form component for creating and updating post information with proper validation and error handling.
 * @version 1.0.0
 * @author Claude Code Assistant
 * @namespace CityArtWalks.Forms.Post
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { withTracking } from 'src/utils/with-tracking';

import { debugError } from 'src/lib/debug';
import { useCreatePost, useUpdatePost } from 'src/actions/post/hooks';
import {
  createPostSchema,
  updatePostSchema,
  publishPostSchema,
  defaultPostValues,
} from 'src/validators/post';
import {
  ElementSlug,
  ElementTags,
  ElementAudit,
  ElementTitle,
  ElementPostDescription,
} from 'src/forms/elements';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

// Default category options for post categorization
const DEFAULT_CATEGORY_OPTIONS = [
  'News & Updates',
  'Artists',
  'Art Pieces',
  'Walking Paths',
  'Art History',
  'Local Culture',
  'Exhibition Reviews',
  'Street Art',
  'Public Art',
  'Gallery Features',
  'Artist Interviews',
  'Art Education',
  'Community Stories',
  'Behind the Scenes',
];

/**
 * @memberof CityArtWalks.Forms.Post
 * @function PostForm
 * @description Form component for creating and updating post information with proper validation and error handling.
 *
 * Features:
 * - Dual mode support (create/edit) with appropriate validation schemas
 * - Creator-only editing: Only the user who created the post can edit it
 * - Draft and publish functionality with different validation requirements
 * - Rich text editor for content creation
 * - SEO optimization with meta fields
 * - Tag system using art-piece tags for consistency
 * - Featured image handling
 * - Comprehensive error handling and user feedback
 * - Real-time form validation and state management
 * - Role-based access control for sensitive operations
 *
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentPost=null] - Current post data for editing, null for creating new post
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @param {boolean} [props.showDraftSave=true] - Whether to show draft save functionality
 * @param {string} [props.mode='create'] - Form mode: 'create' or 'edit'
 * @returns {JSX.Element} The rendered PostForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Post} - Post entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function PostForm({
  currentPost = null,
  onSuccess,
  onCancel,
  showDraftSave = true,
  mode = 'create',
}) {
  const { accessToken, user } = useAuthContext();
  const isEdit = Boolean(currentPost);

  // State to control form editing permissions
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);

  // Check if current user can edit this post
  useEffect(() => {
    if (!isEdit) {
      // Allow editing for new posts
      setIsDisabled(false);
    } else if (currentPost && user) {
      // For existing posts, only allow editing if user is the creator or admin
      const userId = String(user.userId);
      const createdBy = String(currentPost.createdBy);
      const isAdmin = user.roles?.includes('ADMIN');
      const canEdit = userId === createdBy || isAdmin;
      setIsDisabled(!canEdit);
    } else {
      // Default to disabled if no user or post data
      setIsDisabled(true);
    }
  }, [isEdit, currentPost, user]);

  // Use appropriate hooks for create/update operations
  const createPost = useCreatePost(accessToken);
  const updatePost = useUpdatePost(accessToken);

  // Get default values using validator utility
  const defaultValues = useMemo(() => {
    const baseDefaults = defaultPostValues(currentPost);

    // For new posts, the createdBy will be set by the API route
    if (!currentPost && user) {
      return {
        ...baseDefaults,
        // Don't set createdBy here - it will be added by the API route with audit fields
      };
    }

    return baseDefaults;
  }, [currentPost, user]);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updatePostSchema : createPostSchema;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  const {
    reset,
    handleSubmit,
    trigger,
    getValues,
    formState: { isSubmitting },
  } = methods;

  // Watch for changes to currentPost and reset the form
  useEffect(() => {
    if (currentPost) {
      reset(defaultPostValues(currentPost));
    }
  }, [currentPost, reset]);

  /**
   * @memberof CityArtWalks.Forms.Post.PostForm
   * @function onSubmitInternal
   * @description Internal function that handles form submission for both create and update operations.
   * @param {Object} data - Validated form data
   * @param {boolean} [publish=false] - Whether to publish the post immediately
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmitInternal = async (data, publish = false) => {
    try {
      let result;

      // Clean data by removing fields that should not be sent from the form
      // These fields are managed by the API route with audit functions
      // eslint-disable-next-line no-unused-vars
      const { authorId, createdBy, createdAt, updatedAt, postId, ...cleanData } = data;

      // Set status based on action and handle publishedAt properly
      const submitData = {
        ...cleanData,
        status: publish ? 'PUBLISHED' : cleanData.status || 'DRAFT',
        // Only set publishedAt if we're actually publishing
        publishedAt: publish ? cleanData.publishedAt || new Date().toISOString() : null,
        // Handle featured field - convert empty string to false
        featured: cleanData.featured === '' ? false : cleanData.featured,
      };

      // Validate for publish if publishing
      if (publish) {
        try {
          publishPostSchema.parse(submitData);
        } catch (validationError) {
          debugError('Publish validation failed', validationError);
          toast.error(
            'Please fill in all required fields for publishing: content (min 100 chars), excerpt, and category'
          );
          return;
        }
      }

      if (isEdit) {
        // Update existing post
        if (!currentPost.postId) {
          debugError(
            'CityArtWalks.Forms.Post.PostForm.onSubmit',
            'Post ID is required for update operation',
            {
              currentPost: currentPost ? 'provided' : 'null',
              hasPostId: !!currentPost?.postId,
            }
          );
          toast.error('Post ID is required for update operation');
          return;
        }

        result = await updatePost(currentPost.postId, submitData);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Post.PostForm.onSubmit',
            'Update post operation returned null result',
            {
              postId: currentPost.postId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update post - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedPostData = result.data || result || currentPost;
        reset(defaultPostValues(updatedPostData));
        toast.success(
          publish ? 'Post published successfully!' : 'Your post has been updated successfully!'
        );
      } else {
        // Create new post
        result = await createPost(submitData);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Post.PostForm.onSubmit',
            'Create post operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create post - no response from server');
          return;
        }

        // Reset form with created post data
        const createdPostData = result.data || result;
        reset(defaultPostValues(createdPostData));
        toast.success(
          publish ? 'Post created and published successfully!' : 'Post created successfully!'
        );
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          result,
          operation: isEdit ? 'update' : 'create',
          postData: result.data || result,
          isEdit,
          isPublished: publish,
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.Post.PostForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} post`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          postId: currentPost?.postId,
          formData: data ? Object.keys(data).join(', ') : 'missing',
          timestamp: new Date().toISOString(),
          isEdit,
          publish,
        }
      );

      // Enhanced error message based on error type
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} post. Please check your information and try again.`;

      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'This post already exists. Please use different values.';
      }

      toast.error(errorMessage);
    } finally {
      setIsPublishing(false);
      setIsDraftSaving(false);
    }
  };

  // Create the form submit handler
  const onSubmit = handleSubmit(onSubmitInternal);

  /**
   * @memberof CityArtWalks.Forms.Post.PostForm
   * @function handleCancel
   * @description Handles form cancellation by resetting to original values.
   */
  const handleCancel = () => {
    reset(defaultValues);
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  /**
   * @memberof CityArtWalks.Forms.Post.PostForm
   * @function handlePublish
   * @description Handles publishing the post with validation.
   */
  const handlePublish = async () => {
    setIsPublishing(true);

    // Trigger validation and get form data
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please correct the form errors before publishing');
      setIsPublishing(false);
      return;
    }

    const formData = getValues();
    await onSubmitInternal(formData, true);
  };

  /**
   * @memberof CityArtWalks.Forms.Post.PostForm
   * @function handleSaveDraft
   * @description Handles saving the post as draft.
   */
  const handleSaveDraft = async () => {
    setIsDraftSaving(true);

    // Trigger validation and get form data
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please correct the form errors before saving');
      setIsDraftSaving(false);
      return;
    }

    const formData = getValues();
    await onSubmitInternal(formData, false);
  };

  return (
    <RoleBasedGuard allowedRoles={['MEMBER', 'ADMIN']} displayMode="content" protecting="PostForm">
      <ErrorBoundary>
        <Form methods={methods} onSubmit={onSubmit}>
          <Card sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
                {isEdit ? 'Edit Post' : 'Create New Post'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEdit
                  ? 'Update your existing post with new content and information.'
                  : 'Create engaging content to share with the art community.'}
              </Typography>
            </Box>

            {/* Permission Alert */}
            {isEdit && isDisabled && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                You can only edit posts that you created. This post was created by another user.
              </Alert>
            )}
            {isEdit && !isDisabled && (
              <Alert severity="info" sx={{ mb: 3 }}>
                You can edit this post because you are the{' '}
                {user.roles?.includes('ADMIN') ? 'administrator' : 'author'}.
              </Alert>
            )}

            {/* Primary Information Section */}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <ElementTitle
                name="title"
                label="Post Title"
                placeholder="Enter an engaging title..."
                required
                disabled={isDisabled}
                helperText="Create a compelling title that captures readers' attention"
              />
              <ElementSlug
                sourceField="title"
                label="Post Slug"
                disabled
                helperText="Auto-generated from title for SEO-friendly URLs"
              />
            </Box>

            {/* Content Section */}
            <Box sx={{ mt: 3 }}>
              <ElementPostDescription
                name="content"
                label="Content"
                disabled={isDisabled}
                currentPost={currentPost}
                helperText="Write engaging content for your blog post. Use the AI Assist button for content enhancement and formatting suggestions (minimum 100 characters required for publishing)"
                sx={{ '& .ProseMirror': { minHeight: 400 } }}
              />
            </Box>

            {/* Excerpt and Featured Image */}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                mt: 3,
              }}
            >
              <Field.Text
                name="excerpt"
                label="Excerpt"
                placeholder="Brief summary of your post..."
                multiline
                rows={3}
                disabled={isDisabled}
                helperText="A short description that appears in post previews (required for published posts)"
              />
              <Field.Text
                name="featuredImage"
                label="Featured Image URL"
                placeholder="https://example.com/image.jpg"
                disabled={isDisabled}
                helperText="URL to the main image for this post (optional)"
              />
            </Box>

            {/* Categories and Tags */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categorization
            </Typography>

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Autocomplete
                name="category"
                label="Category"
                placeholder="Select or create a category..."
                disabled={isDisabled}
                options={DEFAULT_CATEGORY_OPTIONS}
                freeSolo
                getOptionLabel={(option) => (typeof option === 'string' ? option : '')}
                helperText="Choose an existing category or create a new one"
              />
              <ElementTags name="tags" label="Tags" disabled={isDisabled} />
            </Box>

            {/* SEO Settings */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              SEO Settings
            </Typography>

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              <Field.Text
                name="metaTitle"
                label="Meta Title"
                placeholder="SEO title for search engines..."
                disabled={isDisabled}
                helperText="Optimized title for search engines (leave blank to use post title)"
              />
              <Field.Text
                name="metaDescription"
                label="Meta Description"
                placeholder="SEO description for search engines..."
                multiline
                rows={2}
                disabled={isDisabled}
                helperText="Brief description for search engine results (recommended 150-160 characters)"
              />
            </Box>

            {/* Post Settings */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Post Settings
            </Typography>

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Select
                name="status"
                label="Status"
                disabled={isDisabled}
                helperText="Current publication status"
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="PUBLISHED">Published</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </Field.Select>
              <Field.DateTimePicker
                name="publishedAt"
                label="Publish Date"
                disabled={isDisabled}
                helperText="Schedule when this post should be published (leave blank for immediate)"
              />
            </Box>

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Switch
                name="featured"
                label="Featured Post"
                disabled={isDisabled}
                helperText="Mark this post as featured to highlight it"
              />
            </Box>

            {/* System Fields (Edit Only) */}
            {isEdit && (
              <>
                <Divider sx={{ my: 3 }} />
                <ElementAudit
                  title="Post Audit Information"
                  recordIdLabel="Post ID"
                  recordIdField="postId"
                  recordIdHelperText="Unique identifier for this post"
                  showCard={false}
                />
              </>
            )}

            {/* Form Actions */}
            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              {onCancel && (
                <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
              {showDraftSave && (
                <Button
                  variant="outlined"
                  onClick={withTracking(handleSaveDraft, {
                    event: 'form_submit',
                    data: {
                      label: 'Save Draft',
                      form: 'Post Form',
                      operation: isEdit ? 'update' : 'create',
                      postId: currentPost?.postId,
                      action: 'draft',
                    },
                    userId: user?.userId,
                  })}
                  disabled={isSubmitting || isDisabled || isDraftSaving}
                >
                  {isDraftSaving ? 'Saving...' : 'Save Draft'}
                </Button>
              )}
              <Button
                variant="contained"
                onClick={withTracking(handlePublish, {
                  event: 'form_submit',
                  data: {
                    label: isEdit ? 'Update & Publish' : 'Create & Publish',
                    form: 'Post Form',
                    operation: isEdit ? 'update' : 'create',
                    postId: currentPost?.postId,
                    action: 'publish',
                  },
                  userId: user?.userId,
                })}
                disabled={isSubmitting || isDisabled || isPublishing}
              >
                {isPublishing ? 'Publishing...' : isEdit ? 'Update & Publish' : 'Create & Publish'}
              </Button>
            </Stack>
          </Card>
        </Form>
      </ErrorBoundary>
    </RoleBasedGuard>
  );
}

PostForm.propTypes = {
  currentPost: PropTypes.shape({
    postId: PropTypes.number,
    title: PropTypes.string,
    slug: PropTypes.string,
    content: PropTypes.string,
    excerpt: PropTypes.string,
    metaTitle: PropTypes.string,
    metaDescription: PropTypes.string,
    featuredImage: PropTypes.string,
    status: PropTypes.oneOf(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
    publishedAt: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    featured: PropTypes.bool,
    createdBy: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  showDraftSave: PropTypes.bool,
  mode: PropTypes.oneOf(['create', 'edit']),
};
