/**
 * Notification Preferences Form Component
 *
 * This component provides a form for managing user in-app notification preferences
 * including review notifications, moderation alerts, and system notifications.
 *
 * @namespace CityArtWalks.Forms.UserPreferences
 * @fileoverview In-app notification preferences form with master toggles and granular controls
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
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import {
  Card,
  Chip,
  Alert,
  Stack,
  Button,
  Divider,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';
import * as userPreferenceRequests from 'src/actions/user-preference/requests';
import { useGetUserPreferencesByUser } from 'src/actions/user-preference/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * Default notification preference values
 */
const DEFAULT_VALUES = {
  inAppNotifications: true,
  reviewApprovalNotifications: true,
  reviewRejectionNotifications: true,
  newReviewOwnerNotifications: true,
  reviewFlaggedNotifications: true,
  moderationDecisionNotifications: true,
  browserNotifications: false,
  soundNotifications: false,
  desktopNotifications: false,
  notificationFrequency: 'immediate', // 'immediate', 'hourly', 'daily'
};

/**
 * Notification Preferences Form Component
 *
 * @memberof CityArtWalks.Forms.UserPreferences
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

  // Use the proper hooks for data fetching
  const { userPreferences, mutateUserPreferences } = useGetUserPreferencesByUser(
    userId,
    accessToken
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(false);
  const [browserPermission, setBrowserPermission] = useState('default');

  // Extract notification preferences from the user preferences data
  const notificationPreferences = useMemo(() => {
    if (currentPreferences) return currentPreferences;
    if (userPreferences?.notificationPreferences) return userPreferences.notificationPreferences;
    return DEFAULT_VALUES;
  }, [currentPreferences, userPreferences]);

  const methods = useForm({
    defaultValues: notificationPreferences,
    values: notificationPreferences, // This ensures form updates when preferences change
  });

  const { handleSubmit, watch, reset, setValue } = methods;

  // Watch master toggle to show/hide related options
  const inAppNotifications = watch('inAppNotifications');
  const browserNotifications = watch('browserNotifications');

  /**
   * Checks browser notification support and permission
   */
  const checkBrowserNotificationSupport = useCallback(() => {
    if ('Notification' in window) {
      setBrowserSupported(true);
      setBrowserPermission(Notification.permission);
    } else {
      setBrowserSupported(false);
    }
  }, []);

  /**
   * Requests browser notification permission
   */
  const requestBrowserPermission = useCallback(async () => {
    if (!browserSupported) {
      toast.error('Browser notifications are not supported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);

      if (permission === 'granted') {
        setValue('browserNotifications', true);
        toast.success('Browser notifications enabled');
      } else {
        setValue('browserNotifications', false);
        toast.info('Browser notifications denied');
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Forms.UserPreferences.NotificationPreferencesForm.requestBrowserPermission',
        error
      );
      toast.error('Failed to request notification permission');
    }
  }, [browserSupported, setValue]);

  /**
   * Handles form submission using the proper request function
   */
  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);

      debugLog(
        'CityArtWalks.Forms.UserPreferences.NotificationPreferencesForm.onSubmit',
        'Updating notification preferences',
        { userId, data }
      );

      // Use the proper request function instead of direct fetch
      await userPreferenceRequests.updateUserNotificationPreferences(userId, data, accessToken);

      // Update the SWR cache
      mutateUserPreferences();

      toast.success('Notification preferences updated successfully');

      if (onSuccess) {
        onSuccess(data);
      }

      debugLog(
        'CityArtWalks.Forms.UserPreferences.NotificationPreferencesForm.onSubmit',
        'Successfully updated notification preferences',
        { userId }
      );
    } catch (error) {
      debugError('CityArtWalks.Forms.UserPreferences.NotificationPreferencesForm.onSubmit', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Resets preferences to defaults
   */
  const handleResetToDefaults = () => {
    reset(DEFAULT_VALUES);
    toast.info('Notification preferences reset to defaults');
  };

  // Initialize browser notification support check
  useEffect(() => {
    checkBrowserNotificationSupport();
  }, [checkBrowserNotificationSupport]);

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Header */}
        <Card>
          <CardHeader
            avatar={<Iconify icon="solar:bell-bold" sx={{ color: 'primary.main' }} />}
            title="Notification Preferences"
            subheader="Control what notifications you receive within the app"
            action={
              <Chip
                icon={<Iconify icon="solar:notification-lines-remove-bold" />}
                label={inAppNotifications ? 'Enabled' : 'Disabled'}
                variant="outlined"
                size="small"
                color={inAppNotifications ? 'success' : 'default'}
              />
            }
          />
        </Card>

        {/* Master Notification Toggle */}
        <Card>
          <CardHeader
            avatar={
              <Iconify
                icon="solar:notification-lines-remove-bold"
                sx={{ color: inAppNotifications ? 'primary.main' : 'text.disabled' }}
              />
            }
            title="In-App Notifications"
            subheader="Master control for all in-app notifications"
          />
          <CardContent>
            <Field.Switch
              name="inAppNotifications"
              label="Enable in-app notifications"
              helperText="Show notifications within the app for activities related to your account. When disabled, you will only see critical system notifications."
            />

            {!inAppNotifications && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>In-app notifications are disabled.</strong>
                  <br />
                  You will only see critical system notifications for account security and important
                  updates. All other notification preferences below will be ignored.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Review Notifications */}
        <Card>
          <CardHeader
            title="Review Notifications"
            subheader="In-app notifications about review activities"
          />
          <CardContent>
            <Stack spacing={2}>
              <Field.Switch
                name="reviewApprovalNotifications"
                disabled={!inAppNotifications}
                label="Review approved"
                helperText={
                  inAppNotifications
                    ? 'Get notified when your submitted reviews are approved and published'
                    : 'In-app notifications must be enabled'
                }
              />
              <Field.Switch
                name="reviewRejectionNotifications"
                disabled={!inAppNotifications}
                label="Review rejected"
                helperText={
                  inAppNotifications
                    ? 'Get notified when your submitted reviews are rejected with feedback'
                    : 'In-app notifications must be enabled'
                }
              />
              <Field.Switch
                name="newReviewOwnerNotifications"
                disabled={!inAppNotifications}
                label="New reviews on your content"
                helperText={
                  inAppNotifications
                    ? 'Get notified when someone reviews art pieces, artists, or paths you created'
                    : 'In-app notifications must be enabled'
                }
              />
              <Field.Switch
                name="reviewFlaggedNotifications"
                disabled={!inAppNotifications}
                label="Review flagged for moderation"
                helperText={
                  inAppNotifications
                    ? 'Get notified when your reviews are flagged and require moderation'
                    : 'In-app notifications must be enabled'
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Moderation Notifications */}
        <Card>
          <CardHeader
            title="Moderation Notifications"
            subheader="In-app notifications about content moderation decisions"
          />
          <CardContent>
            <Field.Switch
              name="moderationDecisionNotifications"
              disabled={!inAppNotifications}
              label="Moderation decisions"
              helperText={
                inAppNotifications
                  ? 'Get notified about moderation decisions affecting your content (approvals, rejections, warnings)'
                  : 'In-app notifications must be enabled'
              }
            />
          </CardContent>
        </Card>

        <Divider />

        {/* Browser Notifications */}
        <Card>
          <CardHeader
            title="Browser Notifications"
            subheader="Push notifications through your browser"
          />
          <CardContent>
            <Stack spacing={2}>
              {!browserSupported && (
                <Alert severity="warning">Your browser does not support push notifications.</Alert>
              )}

              {browserSupported && (
                <>
                  <Field.Switch
                    name="browserNotifications"
                    disabled={
                      !inAppNotifications || !browserSupported || browserPermission === 'denied'
                    }
                    label="Browser push notifications"
                    helperText={
                      !inAppNotifications
                        ? 'In-app notifications must be enabled'
                        : browserPermission === 'denied'
                          ? 'Browser notifications are blocked. Please enable them in your browser settings.'
                          : browserPermission === 'default'
                            ? 'Click the button below to enable browser notifications'
                            : 'Receive push notifications even when the app is not open'
                    }
                  />

                  {browserPermission === 'default' && inAppNotifications && (
                    <Button
                      variant="outlined"
                      onClick={requestBrowserPermission}
                      startIcon={<Iconify icon="solar:bell-bing-bold" />}
                      disabled={isUpdating}
                    >
                      Enable Browser Notifications
                    </Button>
                  )}

                  {browserPermission === 'denied' && (
                    <Alert severity="info">
                      <Typography variant="body2">
                        Browser notifications are blocked. To enable them:
                        <br />
                        1. Click the lock icon in your browser&apos;s address bar
                        <br />
                        2. Set notifications to &quot;Allow&quot;
                        <br />
                        3. Refresh this page
                      </Typography>
                    </Alert>
                  )}
                </>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Notification Behavior */}
        <Card>
          <CardHeader
            title="Notification Behavior"
            subheader="Control how notifications are displayed"
          />
          <CardContent>
            <Stack spacing={3}>
              <Field.Switch
                name="soundNotifications"
                disabled={!inAppNotifications}
                label="Sound notifications"
                helperText={
                  inAppNotifications
                    ? 'Play a sound when you receive new notifications'
                    : 'In-app notifications must be enabled'
                }
              />

              <Field.Switch
                name="desktopNotifications"
                disabled={!inAppNotifications || !browserNotifications}
                label="Desktop notifications"
                helperText={
                  !inAppNotifications
                    ? 'In-app notifications must be enabled'
                    : !browserNotifications
                      ? 'Browser notifications must be enabled'
                      : 'Show notifications on your desktop even when the browser is minimized'
                }
              />

              <Field.RadioGroup
                name="notificationFrequency"
                label="Notification frequency"
                disabled={!inAppNotifications}
                options={[
                  { value: 'immediate', label: 'Immediate - Show notifications as they happen' },
                  {
                    value: 'hourly',
                    label: 'Hourly - Bundle notifications and show once per hour',
                  },
                  { value: 'daily', label: 'Daily - Send a daily summary of notifications' },
                ]}
                helperText={
                  inAppNotifications
                    ? 'Choose how often you want to receive notifications'
                    : 'In-app notifications must be enabled'
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Notification Management Info */}
        <Card>
          <CardContent>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Managing Your Notifications</strong>
                <br />
                You can mark notifications as read or dismiss them from the notification center.
                Critical system notifications cannot be disabled for account security. Changes to
                these preferences take effect immediately.
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
                  {isUpdating ? 'Saving...' : 'Save Notification Settings'}
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
