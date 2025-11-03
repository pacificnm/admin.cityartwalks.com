/**
 * Privacy Preferences Form Component
 *
 * This component provides a form for managing user privacy preferences
 * including profile visibility and data sharing controls.
 *
 * @namespace CityArtWalks.Forms.UserPreferences
 * @fileoverview Privacy preferences form with validation and state management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} Form/Field - Form components
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth} useAuthContext - Authentication context
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Preferences} - User preferences documentation
 */

'use client';

import { useForm } from 'react-hook-form';
import React, { useMemo, useState, useEffect } from 'react';

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
import * as userPreferenceRequests from 'src/actions/user-preference/requests';
import { useGetUserPrivacyPreferences } from 'src/actions/user-preference/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Default privacy preference values - only fields that exist in database
 */
const DEFAULT_VALUES = {
  profilePublic: false,
  // Note: showEmail, showLocation, etc. are not in database schema yet
  // These will need to be added to UserPreference model when implemented
};

/**
 * Privacy Preferences Form Component
 *
 * @memberof CityArtWalks.Forms.UserPreferences
 * @function PrivacyPreferencesForm
 * @param {Object} props - Component props
 * @param {number} props.userId - User ID to manage preferences for
 * @param {Object|null} [props.currentPreferences=null] - Current preferences data
 * @param {Function} [props.onSuccess] - Callback function called after successful update
 * @param {Function} [props.onCancel] - Callback function called when form is cancelled
 * @returns {JSX.Element} The rendered privacy preferences form
 */
export function PrivacyPreferencesForm({ userId, currentPreferences = null, onSuccess, onCancel }) {
  const { accessToken } = useAuthContext();

  // Use the proper hooks for data fetching
  const {
    privacyPreferences,
    privacyPreferencesLoading,
    privacyPreferencesError,
    mutatePrivacyPreferences,
  } = useGetUserPrivacyPreferences(userId, accessToken);

  const [isUpdating, setIsUpdating] = useState(false);

  // Use provided preferences or fetched preferences, ensuring all boolean fields are defined
  const preferences = useMemo(() => {
    const prefs = {
      ...DEFAULT_VALUES,
      ...(currentPreferences || privacyPreferences || {}),
    };

    // Ensure profilePublic is always a boolean (never undefined)
    if (typeof prefs.profilePublic !== 'boolean') {
      prefs.profilePublic = DEFAULT_VALUES.profilePublic;
    }

    return prefs;
  }, [currentPreferences, privacyPreferences]);

  const methods = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const { handleSubmit, watch, reset, setValue } = methods;

  // Update form values when preferences are loaded, but only once per preference change
  useEffect(() => {
    if (preferences?.profilePublic !== undefined) {
      setValue('profilePublic', Boolean(preferences.profilePublic), { shouldDirty: false });
    }
  }, [preferences?.profilePublic, setValue]);

  // Watch profile public to show/hide related options
  const profilePublic = watch('profilePublic');

  /**
   * Handles form submission using the proper request function
   */
  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);

      debugLog(
        'CityArtWalks.Forms.UserPreferences.PrivacyPreferencesForm.onSubmit',
        'Updating privacy preferences',
        { userId, data }
      );

      // Use the proper request function instead of direct fetch
      const result = await userPreferenceRequests.updateUserPrivacyPreferences(
        userId,
        data,
        accessToken
      );

      if (result?.status === 'success') {
        // Update the SWR cache
        mutatePrivacyPreferences();

        toast.success('Privacy preferences updated successfully');

        if (onSuccess) {
          onSuccess(data);
        }

        debugLog(
          'CityArtWalks.Forms.UserPreferences.PrivacyPreferencesForm.onSubmit',
          'Successfully updated privacy preferences',
          { userId }
        );
      } else {
        throw new Error(result?.message || result?.error || 'Failed to update preferences');
      }
    } catch (error) {
      debugError('CityArtWalks.Forms.UserPreferences.PrivacyPreferencesForm.onSubmit', error);
      toast.error('Failed to update privacy preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Resets preferences to defaults
   */
  const handleResetToDefaults = () => {
    reset(DEFAULT_VALUES);
    toast.info('Privacy preferences reset to defaults');
  };

  // Show loading state if fetching preferences and we don't have current preferences
  if (privacyPreferencesLoading && !currentPreferences) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading privacy preferences...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Show error state if failed to fetch preferences
  if (privacyPreferencesError && !currentPreferences) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">Failed to load privacy preferences. Please try again.</Alert>
        </CardContent>
      </Card>
    );
  }

  // Don't render the form until we have stable preference data
  if (
    !currentPreferences &&
    !privacyPreferences &&
    typeof preferences.profilePublic !== 'boolean'
  ) {
    return (
      <Card>
        <CardContent>
          <Typography>Initializing privacy preferences...</Typography>
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
            avatar={<Iconify icon="solar:shield-user-bold" sx={{ color: 'primary.main' }} />}
            title="Privacy Settings"
            subheader="Control how others can view your profile and what data you share"
            action={
              <Chip
                icon={<Iconify icon="solar:lock-bold" />}
                label="Secure"
                variant="outlined"
                size="small"
              />
            }
          />
        </Card>

        {/* Profile Visibility - Only field that exists in database */}
        <Card>
          <CardHeader
            avatar={
              <Iconify
                icon="solar:user-bold"
                sx={{ color: profilePublic ? 'primary.main' : 'text.disabled' }}
              />
            }
            title="Profile Visibility"
            subheader="Control how others can view your profile and contributions"
          />
          <CardContent>
            <Stack spacing={2}>
              <Field.Switch
                name="profilePublic"
                label="Make Profile Public"
                helperText="Allow other users to view your public profile showing your contributions (artists, art pieces, paths, and reviews). When disabled, only you can see your complete profile."
              />

              {profilePublic && (
                <Alert severity="info">
                  <Typography variant="body2" component="div">
                    <strong>What&apos;s included in your public profile:</strong>
                    <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
                      <li>Your display name and avatar</li>
                      <li>Artists you&apos;ve created</li>
                      <li>Art pieces you&apos;ve added</li>
                      <li>Art walks/paths you&apos;ve published</li>
                      <li>Reviews you&apos;ve written (approved only)</li>
                    </ul>
                  </Typography>
                </Alert>
              )}

              {!profilePublic && (
                <Alert severity="success">
                  Your profile is private. Only you can see your complete profile and contributions.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Future Privacy Features */}
        <Card>
          <CardContent>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>More Privacy Controls Coming Soon</strong>
                <br />
                We&apos;re working on additional privacy features including contact information
                visibility, communication preferences, and data processing controls. These will be
                available in future updates.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card>
          <CardContent>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Your Privacy Matters</strong>
                <br />
                We are committed to protecting your privacy. You can change these settings at any
                time. For more information about how we handle your data, please review our Privacy
                Policy.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" disabled={isUpdating} size="large">
                  {isUpdating ? 'Saving...' : 'Save Privacy Settings'}
                </Button>
                {onCancel && (
                  <Button variant="outlined" onClick={onCancel} disabled={isUpdating} size="large">
                    Cancel
                  </Button>
                )}
              </Stack>
              <Button
                variant="text"
                onClick={handleResetToDefaults}
                disabled={isUpdating}
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
