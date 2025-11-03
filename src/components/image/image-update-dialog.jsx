/**
 * @namespace CityArtWalks.Components.Image.ImageUpdateDialog
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Dialog component for updating image details including caption, status, featured flag, and relations.
 */

'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { updateImageSchema } from 'src/validators/image';
import { useUpdateImage, useGetImageById } from 'src/actions/image/hooks';

import { toast } from 'src/components/snackbar';
import { EditIcon, CloseIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard';

/**
 * @memberof CityArtWalks.Components.Image.ImageUpdateDialog
 * @function ImageUpdateDialog
 * @description Dialog component for updating image details with form validation and preview.
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @param {Function} props.onSuccess - Callback when update is successful
 * @param {number} props.imageId - The ID of the image to update
 * @returns {JSX.Element} The rendered ImageUpdateDialog component
 */
export function ImageUpdateDialog({ open, onClose, onSuccess, imageId }) {
  const { accessToken } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only fetch image data if imageId is valid and dialog is open
  const shouldFetch = open && imageId && !isNaN(parseInt(imageId));

  // Fetch image data
  const { image, imageLoading, imageError, mutateImage } = useGetImageById(
    shouldFetch ? imageId : null,
    accessToken || ''
  );

  // Update image hook
  const updateImage = useUpdateImage(accessToken || '');

  // Form setup with validation
  const methods = useForm({
    resolver: zodResolver(updateImageSchema),
    defaultValues: {
      caption: '',
      status: 'ACTIVE',
      featured: false,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = methods;

  // Reset form when image data changes
  useEffect(() => {
    if (image) {
      reset({
        caption: image.caption || '',
        status: image.status || 'ACTIVE',
        featured: image.featured || false,
      });
    }
  }, [image, reset]);

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      if (onClose) onClose();
    }
  };

  const onSubmit = async (data) => {
    if (!image) return;

    setIsSubmitting(true);
    try {
      await updateImage(image.imageId, data);

      // Refresh image data
      await mutateImage();

      toast.success('Image updated successfully');

      if (onSuccess) {
        onSuccess(data);
      }

      handleClose();
    } catch (error) {
      toast.error('Failed to update image');
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImagePreview = () => (
    <Card sx={{ mb: 3 }}>
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          overflow: 'hidden',
        }}
      >
        {image?.url && (
          <Image
            src={image.url}
            fill
            alt={image.caption || 'Image preview'}
            style={{ objectFit: 'cover' }}
          />
        )}
      </Box>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Update Image Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {image?.imageId} • Created:{' '}
          {image?.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Unknown'}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderForm = () => (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Caption */}
        <Grid item xs={12}>
          <Controller
            name="caption"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Caption"
                multiline
                rows={3}
                fullWidth
                placeholder="Enter image caption..."
                error={!!errors.caption}
                helperText={errors.caption?.message}
              />
            )}
          />
        </Grid>

        {/* Status */}
        <Grid item xs={12}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  <MenuItem value="ACTIVE">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }}
                      />
                      <span>Active</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="PENDING">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{ width: 8, height: 8, bgcolor: 'warning.main', borderRadius: '50%' }}
                      />
                      <span>Pending</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="INACTIVE">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{ width: 8, height: 8, bgcolor: 'error.main', borderRadius: '50%' }}
                      />
                      <span>Inactive</span>
                    </Stack>
                  </MenuItem>
                </Select>
                {errors.status && (
                  <Typography variant="caption" color="error">
                    {errors.status.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Featured - Admin Only */}
        <RoleBasedGuard
          allowedRoles={['ADMIN']}
          displayMode="hidden"
          protecting="ImageUpdateDialog"
        >
          <Grid item xs={12}>
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body1">Featured Image</Typography>
                      {field.value && <Chip size="small" label="Featured" color="primary" />}
                    </Stack>
                  }
                />
              )}
            />
          </Grid>
        </RoleBasedGuard>
      </Grid>
    </Box>
  );

  const renderContent = () => {
    if (!shouldFetch) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Invalid Image ID
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No valid image ID provided.
          </Typography>
        </Box>
      );
    }

    if (imageLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (imageError || !image) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load image
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The image could not be found or there was an error loading it.
          </Typography>
        </Box>
      );
    }

    return (
      <>
        {renderImagePreview()}
        {renderForm()}
      </>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ pr: 6 }}>
          <EditIcon width={24} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Update Image
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon size={24} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>{renderContent()}</DialogContent>

      {image && (
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting} color="inherit">
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            variant="contained"
            disabled={!isDirty}
            startIcon={<EditIcon width={16} />}
          >
            Update Image
          </LoadingButton>
        </DialogActions>
      )}
    </Dialog>
  );
}
