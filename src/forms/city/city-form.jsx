/**
 * @fileoverview Enhanced City form component for creating and updating city information
 * @version 2.2.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Forms.City
 *
 * @requires {@link module:react-hook-form} - Form management library
 * @requires {@link module:@hookform/resolvers/zod} - Zod validation resolver
 * @requires {@link module:@mui/material} - Material-UI components
 * @requires {@link module:@mui/lab} - Material-UI lab components
 * @requires {@link module:slugify} - URL slug generation utility
 * @requires {@link module:src/lib/debug} - Debug and error logging utilities
 * @requires {@link module:src/actions/city/hooks} - City data operation hooks
 * @requires {@link module:src/actions/map/hooks} - Map generation hooks
 * @requires {@link module:src/utils/format-number} - Number formatting utilities
 * @requires {@link module:src/components/snackbar} - Toast notification system
 * @requires {@link module:src/components/hook-form} - Form component library
 * @requires {@link module:src/auth/hooks} - Authentication context hooks
 * @requires {@link module:./city-validator} - Form-specific validation schemas
 * @requires {@link module:../elements} - Form element components
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City} - City entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 */

'use client';

import slugify from 'slugify';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Divider,
  Typography,
  CircularProgress,
} from '@mui/material';

import { fData } from 'src/utils/format-number';

import { debugLog, debugError } from 'src/lib/debug';
import { useCreateStaticMap } from 'src/actions/map/hooks';
import { useCreateCity, useUpdateCity, useDeleteCity } from 'src/actions/city/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useAuthContext } from 'src/auth/hooks';

import { createCitySchema, updateCitySchema, getCityDefaultValues } from '../../validators/city.js';
import {
  ElementName,
  ElementState,
  ElementActive,
  ElementCountry,
  ElementLatitude,
  ElementLongitude,
} from '../elements';

/**
 * @memberof CityArtWalks.Forms.City
 * @description
 * Enhanced form component for creating and updating city information with comprehensive
 * validation, error handling, and user experience features. Supports both creation and
 * update operations with proper authentication, field validation, and interactive features
 * like static map generation and geographic coordinate handling.
 *
 * Key features:
 * - Dual mode operation (create/edit) with dynamic form behavior
 * - Real-time slug generation from city name
 * - Geographic coordinate validation and static map generation
 * - Cascading country/state selection with proper data synchronization
 * - Enhanced error handling with detailed logging and user feedback
 * - Form state management with proper cleanup and reset functionality
 * - Accessibility compliance with proper labeling and keyboard navigation
 *
 * @function CityForm
 * @param {Object} props - The component props
 * @param {Object|null} [props.currentCity=null] - Current city data for editing, null for creating new city
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered city form component
 * @throws {Error} When form validation fails or API request encounters an error
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City} - City entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City} - Database schema reference
 *
 * @example
 * // Create new city
 * <CityForm
 *   onSuccess={(result) => console.log('City created:', result.cityData)}
 *   onCancel={() => router.back()}
 * />
 *
 * @example
 * // Edit existing city
 * <CityForm
 *   currentCity={existingCityData}
 *   onSuccess={(result) => router.push(`/admin/cities/${result.cityData.cityId}`)}
 *   onCancel={() => router.back()}
 * />
 */
export function CityForm(props) {
  const { currentCity = null, onSuccess, onCancel } = props;

  // Authentication and operation mode
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentCity?.cityId);

  // Component state management (selectedState used in ElementState cascade logic)
  const [selectedCountry, setSelectedCountry] = useState(currentCity?.countryId || null);
  const [selectedState, setSelectedState] = useState(currentCity?.stateId || null);
  const [mapGenerationLoading, setMapGenerationLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Data operation hooks with accessToken
  const createCity = useCreateCity(accessToken);
  const updateCity = useUpdateCity(accessToken);
  const deleteCity = useDeleteCity(accessToken);
  const { createStaticMap } = useCreateStaticMap();

  // Form configuration with correct validation
  const defaultValues = getCityDefaultValues(currentCity);
  const validationSchema = isEdit ? updateCitySchema : createCitySchema;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });
  const {
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  // Watch form fields for reactive updates
  const name = watch('name');

  // Auto-generate slug from name with proper sanitization
  useEffect(() => {
    if (name && typeof name === 'string' && name.trim()) {
      const slug = slugify(name.trim(), { lower: true, strict: true });
      setValue('slug', slug, { shouldValidate: false });
    }
  }, [name, setValue]);

  // Update cascading select state when currentCity changes
  useEffect(() => {
    setSelectedCountry(currentCity?.countryId || null);
    setSelectedState(currentCity?.stateId || null);
  }, [currentCity]);

  /**
   * @memberof CityArtWalks.Forms.City.CityForm
   * @function onSubmit
   * @description Enhanced form submission handler with comprehensive error handling and logging
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      debugLog('CityArtWalks.Forms.City.CityForm.onSubmit', 'Starting form submission', {
        operation: isEdit ? 'update' : 'create',
        cityId: currentCity?.cityId,
        formFields: Object.keys(data).join(', '),
        hasCoordinates: !!(data.latitude && data.longitude),
      });

      let result;

      if (isEdit) {
        // Update existing city
        if (!currentCity?.cityId) {
          debugError(
            'CityArtWalks.Forms.City.CityForm.onSubmit',
            'City ID is required for update operation',
            {
              currentCity: currentCity ? 'provided' : 'null',
              hasCityId: !!currentCity?.cityId,
            }
          );
          toast.error('City ID is required for update operation');
          return;
        }

        debugLog('CityArtWalks.Forms.City.CityForm.onSubmit', 'Updating existing city', {
          cityId: currentCity.cityId,
          cityName: data.name,
        });

        result = await updateCity(currentCity.cityId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.City.CityForm.onSubmit',
            'Update city operation returned null result',
            {
              cityId: currentCity.cityId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update city - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedCityData = result.data || result || currentCity;
        reset(getCityDefaultValues(updatedCityData));
        toast.success('Your city has been updated successfully!');
        debugLog('CityArtWalks.Forms.City.CityForm.onSubmit', 'City updated successfully', {
          cityId: currentCity.cityId,
          updatedName: updatedCityData.name,
        });
      } else {
        // Create new city
        debugLog('CityArtWalks.Forms.City.CityForm.onSubmit', 'Creating new city', {
          cityName: data.name,
          country: data.countryId,
          state: data.stateId,
        });

        result = await createCity(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.City.CityForm.onSubmit',
            'Create city operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create city - no response from server');
          return;
        }

        // Reset form with created city data
        const createdCityData = result.data || result;
        reset(getCityDefaultValues(createdCityData));
        toast.success('City created successfully!');
        debugLog('CityArtWalks.Forms.City.CityForm.onSubmit', 'City created successfully', {
          cityId: createdCityData.cityId,
          cityName: createdCityData.name,
        });
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        debugLog('CityArtWalks.Forms.City.CityForm.onSubmit', 'Calling success callback', {
          operation: isEdit ? 'update' : 'create',
          hasCallback: true,
        });

        onSuccess({
          result,
          operation: isEdit ? 'update' : 'create',
          cityData: result.data || result,
          isEdit,
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.City.CityForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} city`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          cityId: currentCity?.cityId,
          formData: data ? Object.keys(data).join(', ') : 'missing',
          timestamp: new Date().toISOString(),
          isEdit,
          validationSchema: validationSchema.name || 'unknown',
        }
      );

      // Enhanced error message based on error type
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} city. Please check your information and try again.`;

      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('unauthorized')) {
        errorMessage = 'You are not authorized to perform this action.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'A city with this name already exists in the selected state.';
      }

      toast.error(errorMessage);
    }
  }); /**
   * @memberof CityArtWalks.Forms.City.CityForm
   * @function handleCancel
   * @description Handles form cancellation by resetting to original values and calling cancel callback
   */
  const handleCancel = () => {
    debugLog('CityArtWalks.Forms.City.CityForm.handleCancel', 'Form cancelled by user', {
      isEdit,
      isDirty,
      cityId: currentCity?.cityId,
    });

    reset(getCityDefaultValues(currentCity));
    setSelectedCountry(currentCity?.countryId || null);
    setSelectedState(currentCity?.stateId || null);

    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  /**
   * @memberof CityArtWalks.Forms.City.CityForm
   * @function handleCountryChange
   * @description Handles country selection changes with proper state cascade
   */
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    debugLog('CityArtWalks.Forms.City.CityForm.handleCountryChange', 'Country selection changed', {
      newCountryId: countryId,
      previousCountryId: selectedCountry,
      willResetState: true,
    });

    setSelectedCountry(countryId);
    setSelectedState(null); // Reset state when country changes
    setValue('stateId', null, { shouldValidate: true });
  };

  /**
   * @memberof CityArtWalks.Forms.City.CityForm
   * @function handleStateChange
   * @description Handles state selection changes
   */
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    debugLog('CityArtWalks.Forms.City.CityForm.handleStateChange', 'State selection changed', {
      newStateId: stateId,
      previousStateId: selectedState,
      countryId: selectedCountry,
    });

    setSelectedState(stateId);
  };

  /**
   * @memberof CityArtWalks.Forms.City.CityForm
   * @function handleGenerateStaticMap
   * @description Creates a static map URL for the city using coordinates and name
   */
  const handleGenerateStaticMap = async () => {
    const formData = methods.getValues();

    if (!formData.latitude || !formData.longitude || !formData.name) {
      debugError(
        'CityArtWalks.Forms.City.CityForm.handleGenerateStaticMap',
        'Missing required fields for map generation',
        {
          hasName: !!formData.name,
          hasLatitude: !!formData.latitude,
          hasLongitude: !!formData.longitude,
        }
      );
      toast.error('Please provide city name, latitude, and longitude before generating a map.');
      return;
    }

    debugLog(
      'CityArtWalks.Forms.City.CityForm.handleGenerateStaticMap',
      'Starting static map generation',
      {
        cityName: formData.name,
        coordinates: `${formData.latitude}, ${formData.longitude}`,
      }
    );

    setMapGenerationLoading(true);

    try {
      const result = await createStaticMap({
        title: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });

      if (result?.data?.url) {
        setValue('imageUrl', result.data.url, { shouldValidate: true });
        toast.success('Static map generated successfully!');
        debugLog(
          'CityArtWalks.Forms.City.CityForm.handleGenerateStaticMap',
          'Static map generated successfully',
          {
            cityName: formData.name,
            mapUrl: result.data.url ? 'generated' : 'missing',
          }
        );
      } else {
        throw new Error('Invalid response from map service');
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.City.CityForm.handleGenerateStaticMap',
        'Failed to create static map',
        {
          error: error.message,
          cityName: formData.name,
          coordinates: `${formData.latitude}, ${formData.longitude}`,
        }
      );

      toast.error(error?.message || 'Failed to generate static map');
    } finally {
      setMapGenerationLoading(false);
    }
  };

  /**
   * @memberof CityArtWalks.Forms.City.CityForm
   * @function handleDelete
   * @description Handles city deletion with confirmation dialog
   */
  const handleDelete = async () => {
    if (!currentCity?.cityId) {
      debugError(
        'CityArtWalks.Forms.City.CityForm.handleDelete',
        'Cannot delete city - invalid city ID',
        {
          currentCity: currentCity ? 'provided' : 'null',
          hasCityId: !!currentCity?.cityId,
        }
      );
      toast.error('Cannot delete city - invalid city ID');
      return;
    }

    debugLog('CityArtWalks.Forms.City.CityForm.handleDelete', 'Starting city deletion', {
      cityId: currentCity.cityId,
      cityName: currentCity.name,
    });

    try {
      await deleteCity(currentCity.cityId);
      toast.success('City deleted successfully!');
      setDeleteDialogOpen(false);

      debugLog('CityArtWalks.Forms.City.CityForm.handleDelete', 'City deleted successfully', {
        cityId: currentCity.cityId,
        cityName: currentCity.name,
      });

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          operation: 'delete',
          cityData: currentCity,
          result: { deleted: true },
        });
      }
    } catch (error) {
      debugError('CityArtWalks.Forms.City.CityForm.handleDelete', 'Failed to delete city', {
        error: error.message,
        cityId: currentCity.cityId,
        cityName: currentCity.name,
      });

      toast.error(error?.message || 'Failed to delete city');
    }
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {/* Left Column - Image Upload and Status Controls */}
          <Grid size={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                {/* Image Upload Section */}
                <Field.Upload
                  name="imageUrl"
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
                      City image, Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />

                {/* Active Status Toggle */}
                <ElementActive
                  name="active"
                  label="Active Status"
                  helperText={isEdit ? 'Update city visibility' : 'Enable this city when created'}
                  sx={{
                    mx: 0,
                    mb: 3,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />

                {/* Edit Mode Actions */}
                {isEdit && (
                  <>
                    <Divider sx={{ my: 3 }} />

                    {/* Static Map Generation */}
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleGenerateStaticMap}
                        disabled={mapGenerationLoading}
                        startIcon={mapGenerationLoading && <CircularProgress size={16} />}
                      >
                        {mapGenerationLoading ? 'Generating...' : 'Generate Static Map'}
                      </Button>

                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', textAlign: 'center' }}
                      >
                        Generate a map image using the city&apos;s coordinates
                      </Typography>
                    </Stack>

                    {/* Danger Zone */}
                    <Divider sx={{ my: 3 }} />
                    <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                      <Button
                        variant="soft"
                        color="error"
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={isSubmitting}
                      >
                        Delete City
                      </Button>
                    </Stack>
                  </>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Right Column - Form Fields */}
          <Grid size={8}>
            <Card sx={{ p: 3 }}>
              {/* Primary Information Section */}
              <Typography variant="h6" sx={{ mb: 3 }}>
                {isEdit ? 'Edit City Information' : 'Create New City'}
              </Typography>

              {/* City Name Field */}
              <ElementName
                name="name"
                label="City Name"
                placeholder="Enter city name"
                required
                fullWidth
                autoFocus
                slotProps={{
                  input: {
                    autoComplete: 'off',
                  },
                }}
                sx={{ mb: 3 }}
              />

              {/* Geographic and Administrative Fields */}
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                sx={{ mb: 3 }}
              >
                <ElementCountry
                  onCountryChange={handleCountryChange}
                  name="countryId"
                  label="Country"
                  required
                />

                <ElementState
                  selectedCountry={selectedCountry}
                  onStateChange={handleStateChange}
                  name="stateId"
                  label="State/Province"
                  required
                />

                <ElementLatitude name="latitude" label="Latitude" />

                <ElementLongitude name="longitude" label="Longitude" />
              </Box>

              {/* System Fields - Read Only */}
              {isEdit && (
                <Box sx={{ mb: 3 }}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                    System Information
                  </Typography>

                  <Field.Text
                    name="slug"
                    label="URL Slug"
                    disabled
                    helperText="Auto-generated from city name"
                    fullWidth
                  />
                </Box>
              )}

              {/* Form Actions */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
                sx={{ mt: 4 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  size="large"
                >
                  Cancel
                </Button>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={!isDirty && isEdit}
                  size="large"
                >
                  {isSubmitting
                    ? `${isEdit ? 'Updating' : 'Creating'}...`
                    : `${isEdit ? 'Update' : 'Create'} City`}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete City"
        content={
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete <strong>{currentCity?.name}</strong>?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              This action cannot be undone. All associated data will be permanently removed.
            </Typography>
            {/* Add warning about dependencies if needed */}
            <Typography variant="caption" sx={{ color: 'warning.main' }}>
              ⚠️ Ensure this city has no associated art pieces before deleting.
            </Typography>
          </Box>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={isSubmitting}>
            Delete City
          </Button>
        }
      />
    </>
  );
}
/**
 * @memberof CityArtWalks.Forms.City.Form.CityForm
 * @description PropTypes validation for the CityForm component
 */
CityForm.propTypes = {
  /**
   * Current city data for editing operations
   * @type {Object|null}
   */
  currentCity: PropTypes.shape({
    cityId: PropTypes.number,
    name: PropTypes.string,
    slug: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    imageUrl: PropTypes.string,
    active: PropTypes.bool,
    stateId: PropTypes.number,
    countryId: PropTypes.number,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    createdBy: PropTypes.number,
    updatedBy: PropTypes.number,
    // Additional fields from populated queries
    state: PropTypes.shape({
      stateId: PropTypes.number,
      name: PropTypes.string,
      slug: PropTypes.string,
    }),
    country: PropTypes.shape({
      countryId: PropTypes.number,
      name: PropTypes.string,
      slug: PropTypes.string,
    }),
    _count: PropTypes.shape({
      artPieces: PropTypes.number,
      artists: PropTypes.number,
    }),
  }),

  /**
   * Success callback function called after successful form operations
   * @type {Function}
   */
  onSuccess: PropTypes.func,

  /**
   * Cancel callback function called when form is cancelled
   * @type {Function}
   */
  onCancel: PropTypes.func,
};

/**
 * @memberof CityArtWalks.Forms.City.Form.CityForm
 * @description Default props for the CityForm component
 */
CityForm.defaultProps = {
  currentCity: null,
  onSuccess: undefined,
  onCancel: undefined,
};
