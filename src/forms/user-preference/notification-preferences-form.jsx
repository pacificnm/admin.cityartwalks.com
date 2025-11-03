/**
 * Notification Preferences Form Component
 *
 * This component provides a comprehensive form for managing user notification
 * preferences including email and in-app notification settings for the review system.
 *
 * @namespace CityArtWalks.Forms.UserPreference
 * @fileoverview Notification preferences form with validation and state management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} Form/Field - Form components
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth} useAuthContext - Authentication context
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User-Preferences} - User preferences documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Notification-System} - Notification system documentation
 */

'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import {
  Card,
  Chip,
  Grid,
  Alert,
  Paper,
  Stack,
  Button,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Default notification preference values
 */
const DEFAULT_VALUES = {
  emailNotifications: true,
  reviewApprovalEmails: true,
  reviewRejectionEmails: true,
  newReviewOwnerEmails: true,
  reviewFlaggedEmails: false,
  moderationDecisionEmails: true,
  inAppNotifications: true,
  reviewApprovalNotifications: true,
  reviewRejectionNotifications: true,
  newReviewOwnerNotifications: true,
  reviewFlaggedNotifications: true,
  moderationDecisionNotifications: true,
  digestEmails: false,
  marketingEmails: false,
  systemEmails: true,
  profilePublic: false,
};

/**
 * Notification Preferences Form Component
 *
 * @memberof CityArtWalks.Forms.UserPreference
 * @function NotificationPreferencesForm
 * @param {Object} props - Component props
 * @param {number} props.userId - User ID to manage preferences for
 * @param {Object|null} [props.currentPreferences=null] - Current preferences data
 * @param {Function} [props.onSuccess] - Callback function called after successful update
 * @param {Function} [props.onCancel] - Callback function called when form is cancelled
 * @returns {JSX.Element} The rendered notification preferences form
 */
export function NotificationPreferencesForm({
  userId,
  currentPreferences = null,
  onSuccess,
  onCancel,
}) {
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(currentPreferences || DEFAULT_VALUES);

  const methods = useForm({
    defaultValues: preferences,
    values: preferences, // This ensures form updates when preferences change
  });

  const { handleSubmit, watch, reset } = methods;

  // Watch master toggles to disable/enable related options
  const emailNotifications = watch('emailNotifications');
  const inAppNotifications = watch('inAppNotifications');

  /**
   * Fetches current notification preferences
   */
  const fetchPreferences = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/user-preference/user/${userId}/notifications`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      setPreferences(data);
      reset(data); // Reset form with new data

      debugLog(
        'CityArtWalks.Forms.UserPreference.NotificationPreferencesForm.fetchPreferences',
        'Fetched notification preferences',
        { userId, data }
      );
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.UserPreference.NotificationPreferencesForm.fetchPreferences',
        error
      );
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  }, [userId, accessToken, reset]);

  /**
   * Handles form submission
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      debugLog(
        'CityArtWalks.Forms.UserPreference.NotificationPreferencesForm.onSubmit',
        'Updating notification preferences',
        { userId, data }
      );

      const response = await fetch(`/api/user-preference/user/${userId}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedPreferences = await response.json();
      setPreferences(updatedPreferences);

      toast.success('Notification preferences updated successfully');

      if (onSuccess) {
        onSuccess(updatedPreferences);
      }

      debugLog(
        'CityArtWalks.Forms.UserPreference.NotificationPreferencesForm.onSubmit',
        'Successfully updated notification preferences',
        { userId }
      );
    } catch (error) {
      debugError('CityArtWalks.Forms.UserPreference.NotificationPreferencesForm.onSubmit', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets preferences to defaults
   */
  const handleResetToDefaults = () => {
    reset(DEFAULT_VALUES);
    toast.info('Preferences reset to defaults');
  };

  // Fetch preferences on mount if not provided
  useEffect(() => {
    if (!currentPreferences && userId) {
      fetchPreferences();
    }
  }, [userId, currentPreferences, fetchPreferences]);

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Header */}
        <Card>
          <CardHeader
            avatar={<Iconify icon="solar:bell-bing-bold" sx={{ color: 'primary.main' }} />}
            title="Notification Preferences"
            subheader="Manage how you receive notifications about reviews and content"
            action={
              <Chip
                icon={<Iconify icon="solar:settings-bold" />}
                label="Customizable"
                variant="outlined"
                size="small"
              />
            }
          />
        </Card>

        {/* Master Email Toggle */}
        <Card>
          <CardHeader
            avatar={
              <Iconify
                icon="solar:letter-bold"
                sx={{ color: emailNotifications ? 'primary.main' : 'text.disabled' }}
              />
            }
            title="Email Notifications"
            subheader="Control all email notifications from CityArtWalks"
          />
          <CardContent>
            <Field.Switch
              name="emailNotifications"
              label="Enable email notifications"
              helperText={
                emailNotifications
                  ? 'You will receive email notifications based on your preferences below'
                  : 'All email notifications are disabled'
              }
            />

            {!emailNotifications && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Email notifications are disabled. You will only receive in-app notifications.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Email Notification Preferences */}
        <Card>
          <CardHeader
            title="Email Notification Types"
            subheader="Choose which events trigger email notifications"
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Review Events
                  </Typography>
                  <Stack spacing={1}>
                    <Field.Switch
                      name="reviewApprovalEmails"
                      label="Review approved"
                      disabled={!emailNotifications}
                      helperText="When your review is approved and published"
                    />
                    <Field.Switch
                      name="reviewRejectionEmails"
                      label="Review rejected"
                      disabled={!emailNotifications}
                      helperText="When your review is not approved"
                    />
                    <Field.Switch
                      name="newReviewOwnerEmails"
                      label="New review on my content"
                      disabled={!emailNotifications}
                      helperText="When someone reviews your art, artist profile, etc."
                    />
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Moderation Events
                  </Typography>
                  <Stack spacing={1}>
                    <Field.Switch
                      name="reviewFlaggedEmails"
                      label="Review flagged"
                      disabled={!emailNotifications}
                      helperText="When your review is flagged for moderation"
                    />
                    <Field.Switch
                      name="moderationDecisionEmails"
                      label="Moderation decisions"
                      disabled={!emailNotifications}
                      helperText="When flagged content is resolved"
                    />
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Master In-App Toggle */}
        <Card>
          <CardHeader
            avatar={
              <Iconify
                icon="solar:bell-bing-bold"
                sx={{ color: inAppNotifications ? 'primary.main' : 'text.disabled' }}
              />
            }
            title="In-App Notifications"
            subheader="Control notifications shown when you use CityArtWalks"
          />
          <CardContent>
            <Field.Switch
              name="inAppNotifications"
              label="Enable in-app notifications"
              helperText={
                inAppNotifications
                  ? 'You will see notification alerts when using the website'
                  : 'All in-app notifications are disabled'
              }
            />

            {!inAppNotifications && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                In-app notifications are disabled. You might miss important updates while using the
                site.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* In-App Notification Preferences */}
        <Card>
          <CardHeader
            title="In-App Notification Types"
            subheader="Choose which events show notifications in the app"
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Review Events
                  </Typography>
                  <Stack spacing={1}>
                    <Field.Switch
                      name="reviewApprovalNotifications"
                      label="Review approved"
                      disabled={!inAppNotifications}
                    />
                    <Field.Switch
                      name="reviewRejectionNotifications"
                      label="Review rejected"
                      disabled={!inAppNotifications}
                    />
                    <Field.Switch
                      name="newReviewOwnerNotifications"
                      label="New review on my content"
                      disabled={!inAppNotifications}
                    />
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Moderation Events
                  </Typography>
                  <Stack spacing={1}>
                    <Field.Switch
                      name="reviewFlaggedNotifications"
                      label="Review flagged"
                      disabled={!inAppNotifications}
                    />
                    <Field.Switch
                      name="moderationDecisionNotifications"
                      label="Moderation decisions"
                      disabled={!inAppNotifications}
                    />
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Advanced Preferences */}
        <Card>
          <CardHeader
            title="Advanced Preferences"
            subheader="Additional notification and communication settings"
          />
          <CardContent>
            <Stack spacing={2}>
              <Field.Switch
                name="digestEmails"
                label="Daily digest emails"
                disabled={!emailNotifications}
                helperText="Receive a summary of activity in a single daily email"
              />
              <Field.Switch
                name="systemEmails"
                label="System notifications"
                disabled={!emailNotifications}
                helperText="Important account and security notifications (recommended)"
              />
              <Field.Switch
                name="marketingEmails"
                label="Marketing emails"
                disabled={!emailNotifications}
                helperText="Updates about new features, art events, and promotions"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader
            avatar={<Iconify icon="solar:shield-user-bold" sx={{ color: 'primary.main' }} />}
            title="Privacy Settings"
            subheader="Control how others can view your profile and contributions"
          />
          <CardContent>
            <Stack spacing={2}>
              <Field.Switch
                name="profilePublic"
                label="Make Profile Public"
                helperText="Allow other users to view your public profile showing your contributions (artists, art pieces, paths, and reviews). When disabled, only you can see your complete profile."
              />
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
            </Stack>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" disabled={loading} size="large">
                  {loading ? 'Saving...' : 'Save Preferences'}
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
