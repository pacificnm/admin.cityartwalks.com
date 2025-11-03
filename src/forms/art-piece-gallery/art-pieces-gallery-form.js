/**
 * @todo Migrate and fix

// 1. Third-party imports
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
// 2. MUI imports
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { useMemo, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ARTIST_STATUS } from 'src/assets/data/artist';
import FormProvider, {
  RHFUpload,
  RHFTextField,
  RHFSelect,
  RHFSwitch,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { endpoints } from 'src/endpoints';
import { axiosInstance } from 'src/lib/axios';
import { fData } from 'src/utils/format-number';
import * as Yup from 'yup';

export default function ArtPieceGalleryForm({ currentImage, artistId, artPieceId, setCurrentTab }) {
  const { enqueueSnackbar } = useSnackbar();

  // Validation schema for the form
  const ImageSchema = Yup.object().shape({
    caption: Yup.string().required('Caption is required'),
    viewCount: Yup.number().required('View count is required'),
    featured: Yup.boolean().required('Featured is required'),
    status: Yup.string().required('Status is required'),
    imageUrl: Yup.mixed()
      .test('fileSize', 'File size is too large', (value) => {
        if (!value) return true;
        return value.size <= 3145728;
      })
      .required('Image is required'),
  });

  // Default form values
  const defaultValues = useMemo(
    () => ({
      caption: currentImage?.caption || '',
      artistId: currentImage?.artistId || null,
      artPieceId: currentImage?.artPieceId || null,
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Reset form when the currentImage changes
  useEffect(() => {
    if (currentImage) {
      reset(defaultValues);
    }
  }, [currentImage, defaultValues, reset]);

  // Handle form submission
  const onSubmit = handleSubmit(async (data) => {
    try {
      data.artistId = artistId;
      data.artPieceId = artPieceId;

      const formData = new FormData();
      formData.append('files', data.imageUrl);
      formData.append('fields', JSON.stringify(data));

      const response = await axiosInstance.post(endpoints.image.create, formData);

      if (response.status !== 201) {
        enqueueSnackbar(`Failed to save image: ${response.status}`, { variant: 'error' });
      } else {
        reset();
        enqueueSnackbar('Artist Image was saved.', { variant: 'success' });
        setCurrentTab('gallery');
      }
    } catch (error) {
      enqueueSnackbar(`Error creating image: ${error.message}`, { variant: 'error' });
    }
  });

  // Handle file drop
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('imageUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // Handle file removal
  const handleRemoveFile = useCallback(() => {
    setValue('imageUrl', null);
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 3, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUpload
                name="imageUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
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
  );
}

// Define prop types
ArtPieceGalleryForm.propTypes = {
  currentImage: PropTypes.object,
  artistId: PropTypes.string.isRequired,
  artPieceId: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
};
 */
