/**
 * @todo migrate and fix

import { endpoints } from 'src/endpoints';
import { axiosInstance } from 'src/lib/axios';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
// 2. MUI imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ARTIST_STATUS } from 'src/assets/data/artist';
import FormProvider, { RHFTextField, RHFSelect, RHFSwitch } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import * as Yup from 'yup';

export default function ArtistGalleryQuickEditForm({ currentImage, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  // Validation schema for the form
  const ImageSchema = Yup.object().shape({
    caption: Yup.string().required('Caption is required'),
    viewCount: Yup.number().required('View count is required'),
    featured: Yup.boolean().required('Featured is required'),
    status: Yup.string().required('Status is required'),
  });

  // Default form values
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

  // Initialize form methods
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
      const formdata = new FormData();
      formdata.append('fields', JSON.stringify(data));

      const response = await axiosInstance.put(endpoints.image.update(currentImage?.id), formdata);

      if (response.status !== 202) {
        enqueueSnackbar(`Failed to save image: ${response.status}`, { variant: 'error' });
      } else {
        reset();
        enqueueSnackbar('Artist Image was saved.', { variant: 'success' });
        onClose(); // Close the dialog on successful save
      }
    } catch (error) {
      enqueueSnackbar('Error updating Art Piece.', { variant: 'error' });
      console.error(error);
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
                    {ARTIST_STATUS.map((service) => (
                      <MenuItem key={service.value} value={service.value}>
                        {service.label}
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

// Define prop types
ArtistGalleryQuickEditForm.propTypes = {
  currentImage: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
 */
