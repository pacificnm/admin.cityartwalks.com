'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { USER_STATUS_OPTIONS } from 'src/_mock';
import { debugLog, debugError } from 'src/lib/debug';
import { updateUser } from 'src/actions/user/requests';
import { ROLE_OPTIONS } from 'src/actions/user/filter-options';
import { userQuickEditSchema, defaultQuickEditValues } from 'src/validators/user-quick-edit';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, open, onClose, mutate }) {
  const { accessToken } = useAuthContext();

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(userQuickEditSchema),
    defaultValues: defaultQuickEditValues(currentUser),
  });

  const {
    reset,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  // Reset form values when currentUser changes
  useEffect(() => {
    if (currentUser) {
      reset(defaultQuickEditValues(currentUser));
    }
  }, [currentUser, reset]);

  // Debug form state
  debugLog('UserQuickEditForm', 'Form state', {
    isSubmitting,
    hasErrors: Object.keys(errors).length > 0,
    errors: Object.keys(errors),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      debugLog('UserQuickEditForm.onSubmit', 'Form submission started', {
        userId: currentUser?.userId,
        hasData: !!data,
        dataKeys: Object.keys(data || {}),
      });

      // Use form data directly - no complex field cleaning needed
      const cleanedData = data;

      const response = await updateUser(currentUser.userId, cleanedData, accessToken);

      if (response) {
        toast.success('User updated successfully');
        // Reset form with updated data
        const updatedUserData = response.data || response || currentUser;
        reset(defaultQuickEditValues(updatedUserData));
      }

      if (mutate) mutate();
      onClose();
    } catch (error) {
      debugError('UserQuickEditForm.onSubmit', 'Failed to update user', {
        error: error.message,
        userId: currentUser?.userId,
      });

      // Handle validation errors from API
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;

        // Map API errors to form fields
        Object.entries(apiErrors).forEach(([field, message]) => {
          setError(field, {
            type: 'server',
            message: Array.isArray(message) ? message[0] : message,
          });
        });

        const errorMessages = Object.values(apiErrors).flat().slice(0, 3).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error('Failed to update user. Please check your information and try again.');
      }
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Quick update</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Quick edit - Only essential fields (email, display name, status, role) are validated
          </Alert>

          {/* Admin-specific fields section */}
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              mb: 3,
            }}
          >
            <Field.Select name="status" label="Status" required>
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="role" label="Role" required>
              {ROLE_OPTIONS.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>

          {/* Personal Information section */}
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              mb: 3,
            }}
          >
            <Field.Text name="displayName" label="Display name" required />
            <Field.Text name="email" label="Email address" required type="email" />
            <Field.Text name="phoneNumber" label="Phone number" />
            <Field.Text name="company" label="Company" />
          </Box>

          {/* Location Information section */}
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              mb: 3,
            }}
          >
            <Field.Text name="address" label="Address" />
            <Field.Text name="zipCode" label="Zip/code" />
          </Box>

          {/* System Information section - Read-only fields for admin reference */}
          {currentUser?.auth0Id && (
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                opacity: 0.7,
              }}
            >
              <Field.Text name="auth0Id" label="Auth0 ID" disabled helperText="System identifier" />
              {currentUser?.lastLogin && (
                <Field.DateTimePicker
                  name="lastLogin"
                  label="Last Login"
                  disabled
                  helperText="Last login timestamp"
                />
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            Update
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
