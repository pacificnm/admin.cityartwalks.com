/**
 * Email Preferences Form
 *
 * This component provides a form for managing user email notification preferences
 * including review notifications, system emails, and marketing communications.
 *
 * @namespace CityArtWalks.Forms.UserPreferences
 * @fileoverview Email preferences form with master toggles and granular controls
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
import { useMemo, useState } from 'react';

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
 * Default email preference values
 */
const DEFAULT_VALUES = {
  emailNotifications: true,
  reviewApprovalEmails: true,
  reviewRejectionEmails: true,
  newReviewOwnerEmails: true,
  reviewFlaggedEmails: true,
  moderationDecisionEmails: true,
  digestEmails: false,
  marketingEmails: false,
  systemEmails: true,
};

/**
 * Email Preferences Form Component
 *
 * @memberof CityArtWalks.Forms.UserPreferences
 * @function EmailPreferencesForm
 * @param {Object} props - Component props
 * @param {number} props.userId - User ID to manage preferences for
 * @param {Object|null} [props.currentPreferences=null] - Current preferences data
 * @param {Function} [props.onSuccess] - Callback function called after successful update
 * @param {Function} [props.onCancel] - Callback function called when form is cancelled
 * @returns {JSX.Element} The rendered email preferences form
 */
export function EmailPreferencesForm({ userId, currentPreferences = null, onSuccess, onCancel }) {
  const { accessToken } = useAuthContext();

  // Use the proper hooks for data fetching
  const { userPreferences, userPreferencesLoading, mutateUserPreferences } =
    useGetUserPreferencesByUser(userId, accessToken);

  const [isUpdating, setIsUpdating] = useState(false);

  // Extract email preferences from the user preferences data
  const emailPreferences = useMemo(() => {
    if (currentPreferences) return currentPreferences;
    if (userPreferences?.emailPreferences) return userPreferences.emailPreferences;
    return DEFAULT_VALUES;
  }, [currentPreferences, userPreferences]);

  const methods = useForm({
    defaultValues: emailPreferences,
    values: emailPreferences, // This ensures form updates when preferences change
  });

  const { handleSubmit, watch, reset } = methods;

  // Watch master toggle to show/hide related options
  const emailNotifications = watch('emailNotifications');

  // Use the loading state from hooks
  const isLoading = userPreferencesLoading || isUpdating;

  /**
   * Handles form submission using hooks
   */
  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);
      debugLog('EmailPreferencesForm', 'Submitting email preferences update', { data });

      const updatedPreferences = await userPreferenceRequests.updateUserEmailPreferences(
        userId,
        data,
        accessToken
      );

      debugLog('EmailPreferencesForm', 'Email preferences updated successfully', {
        updatedPreferences,
      });

      // Update SWR cache
      await mutateUserPreferences();

      toast.success('Email preferences updated successfully');

      if (onSuccess) {
        onSuccess(updatedPreferences.emailPreferences);
      }
    } catch (error) {
      debugError('EmailPreferencesForm', 'Error updating email preferences', { error, data });
      toast.error('Failed to save email preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Resets preferences to defaults
   */
  const handleResetToDefaults = () => {
    reset(DEFAULT_VALUES);
    toast.info('Email preferences reset to defaults');
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* Header */}
        <Card>
          <CardHeader
            avatar={<Iconify icon="solar:letter-bold" sx={{ color: 'primary.main' }} />}
            title="Email Preferences"
            subheader="Control what emails you receive and how often"
            action={
              <Chip
                icon={<Iconify icon="solar:mailbox-bold" />}
                label={emailNotifications ? 'Enabled' : 'Disabled'}
                variant="outlined"
                size="small"
                color={emailNotifications ? 'success' : 'default'}
              />
            }
          />
        </Card>

        {/* Master Email Toggle */}
        <Card>
          <CardHeader
            avatar={
              <Iconify
                icon="solar:letter-opened-bold"
                sx={{ color: emailNotifications ? 'primary.main' : 'text.disabled' }}
              />
            }
            title="Email Notifications"
            subheader="Master control for all email notifications"
          />
          <CardContent>
            <Field.Switch
              name="emailNotifications"
              label="Enable email notifications"
              helperText="Receive email notifications for activities related to your account. When disabled, you will only receive critical system emails."
            />

            {!emailNotifications && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Email notifications are disabled.</strong>
                  <br />
                  You will only receive critical system emails for account security and important
                  updates. All other email preferences below will be ignored.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Review Notifications */}
        <Card>
          <CardHeader
            title="Review Notifications"
            subheader="Email notifications about review activities"
          />
          <CardContent>
            <Stack spacing={2}>
              <Field.Switch
                name="reviewApprovalEmails"
                disabled={!emailNotifications}
                label="Review approved"
                helperText={
                  emailNotifications
                    ? 'Get notified when your submitted reviews are approved and published'
                    : 'Email notifications must be enabled'
                }
              />
              <Field.Switch
                name="reviewRejectionEmails"
                disabled={!emailNotifications}
                label="Review rejected"
                helperText={
                  emailNotifications
                    ? 'Get notified when your submitted reviews are rejected with feedback'
                    : 'Email notifications must be enabled'
                }
              />
              <Field.Switch
                name="newReviewOwnerEmails"
                disabled={!emailNotifications}
                label="New reviews on your content"
                helperText={
                  emailNotifications
                    ? 'Get notified when someone reviews art pieces, artists, or paths you created'
                    : 'Email notifications must be enabled'
                }
              />
              <Field.Switch
                name="reviewFlaggedEmails"
                disabled={!emailNotifications}
                label="Review flagged for moderation"
                helperText={
                  emailNotifications
                    ? 'Get notified when your reviews are flagged and require moderation'
                    : 'Email notifications must be enabled'
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Moderation Notifications */}
        <Card>
          <CardHeader
            title="Moderation Notifications"
            subheader="Email notifications about content moderation decisions"
          />
          <CardContent>
            <Field.Switch
              name="moderationDecisionEmails"
              disabled={!emailNotifications}
              label="Moderation decisions"
              helperText={
                emailNotifications
                  ? 'Get notified about moderation decisions affecting your content (approvals, rejections, warnings)'
                  : 'Email notifications must be enabled'
              }
            />
          </CardContent>
        </Card>

        <Divider />

        {/* Digest and Marketing */}
        <Card>
          <CardHeader
            title="Periodic Communications"
            subheader="Regular updates and promotional content"
          />
          <CardContent>
            <Stack spacing={2}>
              <Field.Switch
                name="digestEmails"
                disabled={!emailNotifications}
                label="Weekly digest emails"
                helperText={
                  emailNotifications
                    ? 'Receive a weekly summary of new art pieces, featured artists, and popular content in your area'
                    : 'Email notifications must be enabled'
                }
              />
              <Field.Switch
                name="marketingEmails"
                disabled={!emailNotifications}
                label="Marketing and promotional emails"
                helperText={
                  emailNotifications
                    ? 'Receive occasional emails about new features, events, and special offers'
                    : 'Email notifications must be enabled'
                }
              />
            </Stack>
          </CardContent>
        </Card>

        {/* System Emails */}
        <Card>
          <CardHeader
            title="System Communications"
            subheader="Important account and security notifications"
          />
          <CardContent>
            <Field.Switch
              name="systemEmails"
              label="System and security emails"
              helperText="Important account and security notifications (recommended). These emails cannot be disabled for account security."
              disabled
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>System emails are always enabled</strong>
                <br />
                These include password resets, login alerts, account changes, and critical system
                notifications. They are essential for account security and cannot be disabled.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Email Management Info */}
        <Card>
          <CardContent>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Managing Your Emails</strong>
                <br />
                You can unsubscribe from any email category using the links in our emails. Changes
                to these preferences may take up to 24 hours to take effect. If you have questions
                about our emails, please contact our support team.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" disabled={isLoading} size="large">
                  {isLoading ? 'Saving...' : 'Save Email Settings'}
                </Button>
                {onCancel && (
                  <Button variant="outlined" onClick={onCancel} disabled={isLoading} size="large">
                    Cancel
                  </Button>
                )}
              </Stack>
              <Button
                variant="text"
                onClick={handleResetToDefaults}
                disabled={isLoading}
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
