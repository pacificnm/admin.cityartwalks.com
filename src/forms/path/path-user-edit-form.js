/**
 * @namespace CityArtWalks.Forms.Path.User
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { debugError } from 'src/lib/debug';
import { useCreatePath, useUpdatePath } from 'src/actions/path/hooks';
import { createPathSchema, updatePathSchema, getPathDefaultValues } from 'src/validators/path';
import {
  ElementCity,
  ElementState,
  ElementCountry,
  ElementPathType,
  ElementPathZoom,
  ElementPathMapType,
} from 'src/forms/elements';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Forms.Path.User
 * @function PathUserEditForm
 * @description Form component for creating and updating path information with proper validation and error handling.
 * Provides a user-friendly interface for path management without admin-only features.
 *
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentPath=null] - Current path data for editing, null for creating new path
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered PathUserEditForm component
 * @throws {Error} When form validation fails or API request encounters an error
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Path} - Path entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 */
export function PathUserEditForm({ currentPath = null, onSuccess, onCancel, onFormChange }) {
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentPath);
  const [editorKey, setEditorKey] = useState(0);

  // Location state for chained selects
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Use appropriate hooks for create/update operations
  const createPath = useCreatePath(accessToken);
  const updatePath = useUpdatePath(accessToken);

  // Get default values using validator utility
  const defaultValues = useMemo(() => getPathDefaultValues(currentPath), [currentPath]);

  // Use appropriate schema based on operation type (excluding admin-only fields)
  const validationSchema = isEdit ? updatePathSchema : createPathSchema;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Watch for changes to map-related fields
  const watchedMapType = useWatch({ control, name: 'mapType' });
  const watchedZoom = useWatch({ control, name: 'zoom' });

  // Call onFormChange when map settings change
  useEffect(() => {
    if (onFormChange && watchedMapType) {
      onFormChange('mapType', watchedMapType);
    }
  }, [onFormChange, watchedMapType]);

  useEffect(() => {
    if (onFormChange && watchedZoom) {
      onFormChange('zoom', watchedZoom);
    }
  }, [onFormChange, watchedZoom]);

  // Effect to reset fields when currentPath changes
  useEffect(() => {
    if (currentPath) {
      const updatedValues = getPathDefaultValues(currentPath);
      reset(updatedValues);
      setEditorKey((prev) => prev + 1); // Reset editor to reflect new content

      // Set location states for chained selects
      if (currentPath.countryId) setSelectedCountry(currentPath.countryId);
      if (currentPath.stateId) setSelectedState(currentPath.stateId);
    }
  }, [currentPath, reset]);

  // Handle country change for chained selects
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState('');
  };

  // Handle state changes
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
  };

  // Handle city changes
  const handleCityChange = (e) => {
    // City selection is handled by the form field directly
  };

  /**
   * @memberof CityArtWalks.Forms.Path.User.PathUserEditForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      let result;

      if (isEdit) {
        // Update existing path
        if (!currentPath.pathId) {
          debugError(
            'CityArtWalks.Forms.Path.User.PathUserEditForm.onSubmit',
            'Path ID is required for update operation',
            {
              currentPath: currentPath ? 'provided' : 'null',
              hasPathId: !!currentPath?.pathId,
            }
          );
          toast.error('Path ID is required for update operation');
          return;
        }

        result = await updatePath(currentPath.pathId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Path.User.PathUserEditForm.onSubmit',
            'Update path operation returned null result',
            {
              pathId: currentPath.pathId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update path - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedPathData = result.data || result || currentPath;
        reset(getPathDefaultValues(updatedPathData));
        toast.success('Your path has been updated successfully!');
      } else {
        // Create new path
        result = await createPath(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Path.User.PathUserEditForm.onSubmit',
            'Create path operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create path - no response from server');
          return;
        }

        // Reset form with created path data
        const createdPathData = result.data || result;
        reset(getPathDefaultValues(createdPathData));
        toast.success('Path created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          operation: isEdit ? 'update' : 'create',
          data: result.data || result,
          form: 'PathUserEditForm',
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.Path.User.PathUserEditForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} path`,
        {
          error: error.message,
          isEdit,
          validationSchema: validationSchema.name || 'unknown',
        }
      );

      // User-friendly error messages
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} path. Please check your information and try again.`;

      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'This path already exists. Please use different values.';
      }

      toast.error(errorMessage);
    }
  });

  /**
   * @memberof CityArtWalks.Forms.Path.User.PathUserEditForm
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
    <ErrorBoundary>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              {/* Path Title */}
              <Field.Text name="title" label="Path Title" required />

              {/* Description with Editor */}
              <Stack spacing={1.5} sx={{ mt: 3 }}>
                <Typography variant="subtitle2">Description</Typography>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Field.Editor
                      {...field}
                      key={editorKey}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setValue('description', value);
                      }}
                      sx={{ maxHeight: 480 }}
                    />
                  )}
                />
              </Stack>

              {/* Path Configuration */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Path Configuration
              </Typography>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
              >
                <ElementPathType name="pathType" />
                <ElementPathMapType name="mapType" />
                <ElementPathZoom name="zoom" />
              </Box>

              {/* Location Information */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Location
              </Typography>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
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
                  name="cityId"
                  label="City"
                />
              </Box>

              {/* System Fields (Read-only for Edit) */}
              {isEdit && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Path Information
                  </Typography>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                  >
                    <Field.Text name="slug" label="Path Slug" disabled />
                    <Field.Text name="viewCount" label="Views" disabled />
                  </Box>

                  {/* Path Metrics (if available) */}
                  {(currentPath.distance || currentPath.duration) && (
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                      sx={{ mt: 3 }}
                    >
                      {currentPath.distance && (
                        <Field.Text name="distance" label="Distance" disabled />
                      )}
                      {currentPath.duration && (
                        <Field.Text name="duration" label="Duration" disabled />
                      )}
                    </Box>
                  )}
                </>
              )}
            </Card>
          </Grid>

          <Grid xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isEdit ? 'Update Path' : 'Create Path'}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {isEdit
                  ? 'Modify your path details and settings.'
                  : 'Create a new walking or cycling path connecting art pieces.'}
              </Typography>

              <Stack spacing={2}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  fullWidth
                  size="large"
                >
                  {isEdit ? 'Update Path' : 'Create Path'}
                </LoadingButton>

                {onCancel && (
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>

              {/* Help Text */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tips for Creating Paths
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                • Choose a clear, descriptive title • Add a detailed description of the route •
                Select the appropriate path type (walking/cycling) • Ensure all location information
                is accurate
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </ErrorBoundary>
  );
}

PathUserEditForm.propTypes = {
  currentPath: PropTypes.shape({
    pathId: PropTypes.number,
    title: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    pathType: PropTypes.string,
    distance: PropTypes.number,
    duration: PropTypes.number,
    cityId: PropTypes.number,
    stateId: PropTypes.number,
    countryId: PropTypes.number,
    viewCount: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  onFormChange: PropTypes.func,
};
