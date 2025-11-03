/**
 * Location Preferences Form Component
 *
 * This component provides a form for managing user location preferences
 * including default country, state, and city selections for personalized content.
 *
 * @namespace CityArtWalks.Forms.UserPreferences
 * @fileoverview Location preferences form with cascading location selectors
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} Form/Field - Form components
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth} useAuthContext - Authentication context
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Preferences} - User preferences documentation
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Card,
  Chip,
  Alert,
  Stack,
  Button,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';
import { ElementCity } from 'src/forms/elements/element-city';
import { ElementState } from 'src/forms/elements/element-state';
import { ElementCountry } from 'src/forms/elements/element-country';
import { invalidateUserLocationCache } from 'src/actions/geo-location/hooks';
import { useGetUserLocationPreferences } from 'src/actions/user-preference/hooks';
import { updateUserLocationPreferences } from 'src/actions/user-preference/requests';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Default location preference values - only fields that exist in database
 */
const DEFAULT_VALUES = {
  defaultCountryId: null,
  defaultStateId: null,
  defaultCityId: null,
  // Note: Other location fields like useCurrentLocation, autoUpdateLocation,
  // locationBasedRecommendations, etc. are not in database schema yet
};

/**
 * Location Preferences Form Component
 *
 * @memberof CityArtWalks.Forms.UserPreferences
 * @function LocationPreferencesForm
 * @param {Object} props - Component props
 * @param {number} props.userId - User ID to manage preferences for
 * @param {Object|null} [props.currentPreferences=null] - Current preferences data
 * @param {Function} [props.onSuccess] - Callback function called after successful update
 * @param {Function} [props.onCancel] - Callback function called when form is cancelled
 * @returns {JSX.Element} The rendered location preferences form
 */
export function LocationPreferencesForm({
  userId,
  currentPreferences = null,
  onSuccess,
  onCancel,
}) {
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // Use hooks to fetch location preferences if not provided
  const {
    locationPreferences,
    locationPreferencesLoading,
    locationPreferencesError,
    mutateLocationPreferences,
  } = useGetUserLocationPreferences(userId, accessToken);

  // Use provided preferences or fetched preferences
  const preferences = currentPreferences || locationPreferences || DEFAULT_VALUES;

  const methods = useForm({
    defaultValues: preferences,
    values: preferences, // This ensures form updates when preferences change
  });

  const { handleSubmit, watch, reset } = methods;

  // Watch location fields for cascading updates
  const selectedCountryId = watch('defaultCountryId');
  const selectedStateId = watch('defaultStateId');

  /**
   * Handles form submission
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      debugLog(
        'CityArtWalks.Forms.UserPreferences.LocationPreferencesForm.onSubmit',
        'Updating location preferences',
        { userId, data }
      );

      const response = await updateUserLocationPreferences(userId, data, accessToken);

      // Check if the response indicates success
      if (response?.status === 'success' || response?.data) {
        // Update the cache with new data
        if (mutateLocationPreferences) {
          mutateLocationPreferences();
        }

        // Invalidate geolocation cache so it refetches with new preferences
        await invalidateUserLocationCache(userId);

        toast.success('Location preferences updated successfully');

        if (onSuccess) {
          onSuccess(response?.data || response);
        }

        debugLog(
          'CityArtWalks.Forms.UserPreferences.LocationPreferencesForm.onSubmit',
          'Successfully updated location preferences and invalidated geolocation cache',
          { userId }
        );
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      debugError('CityArtWalks.Forms.UserPreferences.LocationPreferencesForm.onSubmit', error);
      toast.error('Failed to update location preferences');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets preferences to defaults
   */
  const handleResetToDefaults = () => {
    reset(DEFAULT_VALUES);
    toast.info('Location preferences reset to defaults');
  };

  // Show loading state if fetching preferences
  if (locationPreferencesLoading && !currentPreferences) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading location preferences...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Show error state if failed to fetch preferences
  if (locationPreferencesError && !currentPreferences) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">Failed to load location preferences. Please try again.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Header */}
        <Card>
          <CardHeader
            avatar={<Iconify icon="solar:map-point-bold" sx={{ color: 'primary.main' }} />}
            title="Location Preferences"
            subheader="Set your default location for personalized art recommendations"
            action={
              <Chip
                icon={<Iconify icon="solar:gps-bold" />}
                label="Smart Location"
                variant="outlined"
                size="small"
              />
            }
          />
        </Card>

        {/* Default Location Selection */}
        <Card>
          <CardHeader
            title="Default Location Preferences"
            subheader="Set your preferred default location for personalized content and recommendations"
          />
          <CardContent>
            <Stack spacing={3}>
              <Alert severity="info">
                <Typography variant="body2">
                  Choose your preferred country, state, and city to personalize your art discovery
                  experience. This helps us show you relevant local content and recommendations.
                </Typography>
              </Alert>

              <ElementCountry
                name="defaultCountryId"
                label="Default Country"
                placeholder="Select your preferred country"
                helperText="Choose the country where you'd like to discover art"
              />

              <ElementState
                name="defaultStateId"
                countryId={selectedCountryId}
                disabled={!selectedCountryId}
                label="Default State/Region"
                placeholder="Select your preferred state or region"
                helperText={
                  selectedCountryId
                    ? 'Choose the state or region within your selected country'
                    : 'Select a country first to choose a state/region'
                }
              />

              <ElementCity
                name="defaultCityId"
                stateId={selectedStateId}
                disabled={!selectedStateId}
                label="Default City"
                placeholder="Select your preferred city"
                helperText={
                  selectedStateId
                    ? 'Choose the city within your selected state/region'
                    : 'Select a state/region first to choose a city'
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Future Location Features */}
        <Card>
          <CardContent>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>More Location Features Coming Soon</strong>
                <br />
                We&apos;re working on additional location features including automatic location
                detection, location-based recommendations, and enhanced privacy settings. These will
                be available in future updates.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" disabled={loading} size="large">
                  {loading ? 'Saving...' : 'Save Location Settings'}
                </Button>
                {onCancel && (
                  <Button variant="outlined" onClick={onCancel} disabled={loading} size="large">
                    Cancel
                  </Button>
                )}
              </Stack>
              <Button
                variant="text"
                onClick={handleResetToDefaults}
                disabled={loading}
                color="secondary"
              >
                Reset to Defaults
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Form>
  );
}
