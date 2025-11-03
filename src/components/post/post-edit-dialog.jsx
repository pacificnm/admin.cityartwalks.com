'use client';

import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// import { toSnakeCase } from 'src/utils/format-string'; // TODO: Implement or find existing string utility
import { debugLog, debugError } from 'src/lib/debug';
import { useUpdatePost } from 'src/actions/post/hooks';
import { updatePostSchema, defaultPostValues } from 'src/validators/post';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form/form-provider';
import { RHFSwitch } from 'src/components/hook-form/rhf-switch';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import { RHFEditor } from 'src/components/hook-form/rhf-editor';
import { RHFTextField } from 'src/components/hook-form/rhf-text-field';

import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * Post edit dialog component for quick edits
 *
 * @component PostEditDialog
 * @memberof CityArtWalks.Components.Post
 * @param {Object} props
 * @param {boolean} props.open - Whether dialog is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.post - Post to edit
 * @param {Function} props.onSuccess - Success callback
 * @returns {JSX.Element} Edit dialog component
 */
export function PostEditDialog({ open, onClose, post, onSuccess }) {
  const { updatePost } = useUpdatePost();

  const methods = useForm({
    resolver: zodResolver(updatePostSchema),
    defaultValues: post || defaultPostValues(),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      debugLog('PostEditDialog.onSubmit', 'Updating post', { postId: post?.postId });

      // Generate slug from title if title changed
      if (data.title && data.title !== post?.title) {
        // Simple slug generation - convert to lowercase and replace spaces with dashes
        data.slug = data.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }

      // Update post
      const result = await updatePost({
        postId: post?.postId,
        data,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to update post');
      }

      toast.success('Post updated successfully');

      if (onSuccess) {
        onSuccess(result.data);
      }

      handleClose();
    } catch (error) {
      debugError('PostEditDialog.onSubmit', 'Failed to update post', error);
      toast.error(error.message || 'Failed to update post');
    }
  });

  return (
    <RoleBasedGuard roles={['ADMIN']}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Edit Post</Typography>
        </DialogTitle>

        <Form methods={methods} onSubmit={onSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Title" required fullWidth />

              <RHFTextField name="excerpt" label="Excerpt" multiline rows={3} fullWidth />

              <RHFEditor
                simple
                name="content"
                label="Content"
                placeholder="Write your post content here..."
              />

              <Stack direction="row" spacing={2}>
                <RHFSelect name="status" label="Status" fullWidth>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </RHFSelect>

                <RHFTextField name="category" label="Category" fullWidth />
              </Stack>

              <Stack direction="row" spacing={2}>
                <RHFSwitch name="featured" label="Featured" />

                <RHFTextField type="number" name="viewCount" label="View Count" fullWidth />
              </Stack>

              <RHFTextField
                name="tags"
                label="Tags (comma separated)"
                helperText="Enter tags separated by commas"
                fullWidth
              />

              <Stack spacing={2}>
                <Typography variant="subtitle2">SEO Settings</Typography>

                <RHFTextField name="metaTitle" label="Meta Title" fullWidth />

                <RHFTextField
                  name="metaDescription"
                  label="Meta Description"
                  multiline
                  rows={2}
                  fullWidth
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Update Post
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>
    </RoleBasedGuard>
  );
}

PostEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  post: PropTypes.object,
  onSuccess: PropTypes.func,
};
