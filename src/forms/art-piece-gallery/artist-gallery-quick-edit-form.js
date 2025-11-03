/**
 * @todo Migrat and fix

import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSWRConfig } from 'swr';
import { endpoints } from 'src/endpoints';
import { axiosInstance } from 'src/lib/axios';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { ARTIST_STATUS } from 'src/assets/data/artist';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect, RHFSwitch } from 'src/components/hook-form';

export default function ArtistGalleryQuickEditForm({ currentImage, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = useSWRConfig();

  // Validation schema for the form
  const ImageSchema = Yup.object().shape({
    caption: Yup.string().required('Caption is required'),
    viewCount: Yup.number().required('View count is required'),
    featured: Yup.boolean().required('Featured is required'),
    status: Yup.string().required('Status is required'),
  });

  // Default values for the form
  const defaultValues = useMemo(
    () => ({
      imageId: currentImage?.imageId || '',
      caption: currentImage?.caption || '',
      artistId: currentImage?.artistId || '',
      artPieceId: currentImage?.artPieceId || '',
      viewCount: currentImage?.viewCount || 0,
      featured: currentImage?.featured || false,
      status: currentImage?.status || 'REVIEW',
    }),
    [currentImage]
  );

  // Form methods
  const methods = useForm({
    resolver: yupResolver(ImageSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Handle form submission
  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('fields', JSON.stringify(data));

      const response = await axiosInstance.put(endpoints.image.update(currentImage?.id), formData);

      if (response.status !== 202) {
        enqueueSnackbar(`Failed to save image: ${response.status}`, { variant: 'error' });
      } else {
        reset();
        enqueueSnackbar('Artist Image was saved.', { variant: 'success' });
        onClose(); // Close dialog on success
        mutate(); // Optional: revalidate the SWR cache
      }
    } catch (error) {
      enqueueSnackbar(`Error updating Art Piece: ${error.message}`, { variant: 'error' });
    }
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Quick Update</DialogTitle>
      <DialogContent sx={{ maxHeight: '100vh', overflow: 'auto' }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Card sx={{ p: 3 }}>
                <Box rowGap={3} display="grid">
                  <RHFTextField
                    name="caption"
                    label="Image Caption"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                  sx={{ mt: 3 }}
                >
                  <RHFSelect name="status" label="Status" InputLabelProps={{ shrink: true }}>
                    {ARTIST_STATUS.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>

                  <RHFTextField
                    name="viewCount"
                    label="View Count"
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFSwitch name="featured" label="Featured" />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {currentImage ? 'Save Changes': 'Create Image'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

// Prop types validation
ArtistGalleryQuickEditForm.propTypes = {
  currentImage: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
 */
