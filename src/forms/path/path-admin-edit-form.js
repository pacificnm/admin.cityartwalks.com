/**
 * @namespace CityArtWalks.Forms.Path.Admin
 */

'use client';

import PropTypes from 'prop-types';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { createPathSchema, getPathDefaultValues } from 'src/validators';
import {
  ElementCity,
  ElementState,
  ElementCountry,
  ElementPathType,
  ElementPathZoom,
  ElementPathMapType,
} from 'src/forms/elements';

import { toast } from 'src/components/snackbar';
import { ErrorView } from 'src/components/error';
import { UserAvatar } from 'src/components/user';
import { PermissionsGate } from 'src/components/auth';
import { Form, Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Forms.Path.Admin
 * @function PathAdminEditForm
 * @description PathAdminEditForm component for editing paths in the admin panel.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.currentPath - The current path data.
 * @param {Object} props.user - The current user data.
 *
 * @returns {JSX.Element} The rendered component.
 */
export function PathAdminEditForm(props) {
  const { currentPath } = props;
  const [editorKey, setEditorKey] = useState(0);
  const { user, userError, userIsLoading } = useUser();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [loading, setLoading] = useState(false);

  // fetch default values and set artistId, needed for new art piece.
  const defaultValues = useMemo(() => getPathDefaultValues(), []);

  // methods
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(createPathSchema),
    defaultValues,
  });

  // available methods
  // extract methods
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting }, // errors here
  } = methods;

  // effect to reset fields
  useEffect(() => {
    if (currentPath) {
      reset(defaultValues);
      setSelectedCountry(currentPath.countryId);
      setSelectedState(currentPath.stateId);
      setSelectedCity(currentPath.cityId);
      setEditorKey((prev) => prev + 1);
    }
  }, [currentPath, defaultValues, reset]);

  // handles country change for chained selects
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState('');
  };

  // handels state changes
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
  };

  // handels city chanegs
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  // creates a staic map url for the artist art pieces.
  const fetchStaticMap = async () => {
    setLoading(true);
    
  };

  // fetches a biography for the path
  const fetchBiography = async () => {
    setLoading(true);
    
  };

  // submit the data
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Initialize FormData
      const formData = new FormData();

      // Iterate over the data keys
      Object.keys(data).forEach((key) => {
        if (key === 'featured') {
          // Ensure featured is converted to a proper boolean
          formData.append(key, data[key] === 'true' || data[key] === true ? 'true' : 'false');
        } else if (key === 'imageUrl' && data.imageUrl) {
          // Handle imageUrl for file upload
          if (
            data.imageUrl instanceof File ||
            (Array.isArray(data.imageUrl) && data.imageUrl[0] instanceof File)
          ) {
            formData.append(
              'imageUrl',
              Array.isArray(data.imageUrl) ? data.imageUrl[0] : data.imageUrl
            );
          } else {
            // If imageUrl is a string (existing URL)
            formData.append('imageUrl', data.imageUrl);
          }
        } else if (key === 'static_map_url' && data.static_map_url) {
          // Handle static_map_url for file upload
          if (
            data.imageUrl instanceof File ||
            (Array.isArray(data.static_map_url) && data.static_map_url[0] instanceof File)
          ) {
            formData.append(
              'static_map_url',
              Array.isArray(data.static_map_url) ? data.static_map_url[0] : data.static_map_url
            );
          } else {
            // If imageUrl is a string (existing URL)
            formData.append('static_map_url', data.imageUrl);
          }
        } else {
          // Append other fields
          formData.append(key, data[key]);
        }
      });

      const updatedPath = false;

      // Handle response
      if (updatedPath) {
        toast.success('The path was saved.');
        reset(); // Reset the form
      } else {
        toast.error('There was an error saving the path.');
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Error updating path?:', error);
    }
  });

  if (userIsLoading) return null; // change this to load a skelleton
  if (userError) return <ErrorView message="There was an error loading the dashboard paths" />;

  return (
    <ErrorBoundary>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3, mt: 3 }}>
              <Box sx={{ mb: 5 }}>
                <PermissionsGate
                  permissions={user?.permissions}
                  requiredPermission="path?:create?:image"
                >
                  <Field.Upload
                    disabled={!currentPath || currentPath.length === 0} // Disable if no pieces
                    name="static_map_url"
                    maxSize={3145728}
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
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={fetchStaticMap}
                          disabled={!currentPath || currentPath.length === 0 || loading} // Disable if no pieces
                        >
                          {loading ? <CircularProgress size={16} /> : 'Generate Static Map'}
                        </Button>
                      </Typography>
                    }
                  />
                </PermissionsGate>
              </Box>
              <PermissionsGate permissions={user?.permissions} requiredPermission="path?:update">
                <Divider sx={{ mt: 3, mb: 3 }} />
                {currentPath && (
                  <FormControlLabel
                    labelPlacement="start"
                    control={
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value !== 'ACTIVE'}
                            onChange={(event) =>
                              field.onChange(event.target.checked ? 'BANNED' : 'ACTIVE')
                            }
                          />
                        )}
                      />
                    }
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Banned
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Disable this Path
                        </Typography>
                      </>
                    }
                    sx={{
                      mx: 0,
                      mb: 3,
                      width: 1,
                      justifyContent: 'space-between',
                    }}
                  />
                )}

                <Field.Switch
                  name="featured"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Featured Path
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Featured Path display on main pages and available to the public.
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                />

                {currentPath && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Created By
                      </Typography>
                      <UserAvatar userId={currentPath.created_by} alt={currentPath.email} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {currentPath.User.email}
                      </Typography>
                    </Box>

                    <Divider sx={{ mt: 3, mb: 3 }} />
                    <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                      <Button variant="soft" color="error">
                        Delete art path
                      </Button>
                    </Stack>
                  </>
                )}
              </PermissionsGate>
            </Card>
          </Grid>
          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Field.Text name="title" label="Path Title" />
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2">Description</Typography>
                  <PermissionsGate
                    permissions={user?.permissions}
                    requiredPermission="art-piece?:create?:biography"
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={fetchBiography}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={16} /> : 'Get AI Description'}
                    </Button>
                  </PermissionsGate>
                </Box>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Field.Editor
                      {...field}
                      key={editorKey} // Force re-render on value change
                      value={field.value} // Bind value
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      sx={{ maxHeight: 480 }}
                    />
                  )}
                />
              </Stack>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                sx={{ mt: 3 }}
              >
                <Field.Text name="slug" label="Path Slug" disabled />
              </Box>
              <Divider sx={{ pt: 3 }} />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                sx={{ mt: 3 }}
              >
                <ElementPathType name="path_type" />
                <ElementPathMapType name="map_type" />
                <ElementPathZoom name="zoom" />
              </Box>
              <Divider sx={{ pt: 3 }} />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                sx={{ mt: 3 }}
              >
                <ElementCountry
                  onCountryChange={handleCountryChange}
                  name="countryId"
                  label="Country"
                />
                <ElementState
                  selectedCountry={selectedCountry}
                  onStateChange={handleStateChange}
                  name="stateId"
                  label="State"
                />
                <ElementCity
                  selectedState={selectedState}
                  onCityChange={handleCityChange}
                  selectedCity={selectedCity}
                  name="cityId"
                  label="City"
                />

                <Field.Text name="viewCount" label="Views" />
                <Field.DatePicker name="created_date" label="Created" disabled />
                <Field.DatePicker name="last_update" label="Last Update" disabled />
              </Box>
              <Divider sx={{ pt: 3 }} />

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' }}
                sx={{ mt: 3 }}
              >
                <Field.Text name="distance" label="Distance" disabled />
                <Field.Text name="duration" label="Duration" disabled />
                <Field.Text name="weight" label="Weight" disabled />
                <Field.Text name="weight_name" label="Weight Type" disabled />
              </Box>
            </Card>
          </Grid>
          <Grid xs={12} md={12}>
            <Box display="flex" justifyContent="flex-end">
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Form>
    </ErrorBoundary>
  );
}
PathAdminEditForm.propTypes = {
  path: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number,
    title: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
    distance: PropTypes.number,
    duration: PropTypes.number,
    cityId: PropTypes.number,
    stateId: PropTypes.number,
    countryId: PropTypes.number,
    isFeatured: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};
