'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { debugLog, debugError } from 'src/lib/debug';
import { ElementCity } from 'src/forms/elements/element-city';
import { ElementAbout } from 'src/forms/elements/element-about';
import { ElementState } from 'src/forms/elements/element-state';
import { ElementCountry } from 'src/forms/elements/element-country';
import { useCreateUser, useUpdateUser } from 'src/actions/user/hooks';
import { createUserSchema, updateUserSchema, defaultUserValues } from 'src/validators/user';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

export function UserNewEditForm({ currentUser, mutate, onSuccess, onCancel }) {
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentUser);

  // State for cascading dropdowns - use empty string instead of null
  const [selectedCountry, setSelectedCountry] = useState(currentUser?.countryId || '');
  const [selectedState, setSelectedState] = useState(currentUser?.stateId || '');

  // Use appropriate hooks for create/update operations
  const createUser = useCreateUser(accessToken);
  const updateUser = useUpdateUser(accessToken);

  // Get default values using validator utility
  const defaultValues = defaultUserValues(currentUser);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateUserSchema : createUserSchema;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  const values = watch();

  // Debug form state
  debugLog('UserNewEditForm', 'Form state', {
    isSubmitting,
    isValid,
    hasErrors: Object.keys(errors).length > 0,
    errors: Object.keys(errors),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      debugLog('UserNewEditForm.onSubmit', 'Form submission started', {
        isEdit,
        hasData: !!data,
        dataKeys: Object.keys(data || {}),
      });

      // Convert empty strings to null for optional numeric fields
      const cleanedData = {
        ...data,
        countryId: data.countryId === '' ? null : Number(data.countryId) || null,
        stateId: data.stateId === '' ? null : Number(data.stateId) || null,
        cityId: data.cityId === '' ? null : Number(data.cityId) || null,
      };

      let result;

      if (isEdit) {
        // Update existing user
        if (!currentUser.userId) {
          debugError('UserNewEditForm.onSubmit', 'User ID is required for update operation');
          toast.error('User ID is required for update operation');
          return;
        }

        result = await updateUser(currentUser.userId, cleanedData);

        if (!result) {
          debugError('UserNewEditForm.onSubmit', 'Update user operation returned null result');
          toast.error('Failed to update user - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedUserData = result.data || result || currentUser;
        reset(defaultUserValues(updatedUserData));
        toast.success('User updated successfully!');
      } else {
        // Create new user
        result = await createUser(cleanedData);

        if (!result) {
          debugError('UserNewEditForm.onSubmit', 'Create user operation returned null result');
          toast.error('Failed to create user - no response from server');
          return;
        }

        // Reset form with created user data
        const createdUserData = result.data || result;
        reset(defaultUserValues(createdUserData));
        toast.success('User created successfully!');
      }

      // Call mutate if provided
      if (mutate) await mutate();

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError('UserNewEditForm.onSubmit', `Failed to ${isEdit ? 'update' : 'create'} user`, {
        error: error.message,
        stack: error.stack,
        operation: isEdit ? 'update' : 'create',
        userId: currentUser?.userId,
        formData: 'provided',
        timestamp: new Date().toISOString(),
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

        // Show validation errors in toast
        const errorMessages = Object.values(apiErrors)
          .flat()
          .slice(0, 3) // Limit to first 3 errors
          .join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        // Handle general errors
        const operation = isEdit ? 'update' : 'create';
        const errorMessage = error.message || `Failed to ${operation} user`;
        toast.error(`${errorMessage}. Please check your information and try again.`);
      }
    }
  });

  // Handle cascading dropdown changes
  const handleCountryChange = (event) => {
    const countryId = event.target.value || '';
    setSelectedCountry(countryId);
    setSelectedState(''); // Reset state when country changes

    // Clear state and city fields in the form - use empty string instead of null
    methods.setValue('stateId', '');
    methods.setValue('cityId', '');
  };

  const handleStateChange = (event) => {
    const stateId = event.target.value || '';
    setSelectedState(stateId);

    // Clear city field in the form - use empty string instead of null
    methods.setValue('cityId', '');
  };

  // Handle form cancellation
  const handleCancel = () => {
    reset(defaultValues);
    setSelectedCountry(currentUser?.countryId || '');
    setSelectedState(currentUser?.stateId || '');
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'ACTIVE' && 'success') ||
                  (values.value === 'PENDING' && 'warning') ||
                  (values.status === 'BANNED' && 'error') ||
                  (values.value === 'REJECTED' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <RoleBasedGuard
              allowedRoles={['ADMIN']}
              hasContent={false}
              protecting="UserNewEditForm"
            >
              <Field.Switch
                name="isVerified"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />

              {currentUser && (
                <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant="soft" color="error">
                    Delete user
                  </Button>
                </Stack>
              )}
            </RoleBasedGuard>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <RoleBasedGuard
              allowedRoles={['ADMIN']}
              hasContent={false}
              protecting="UserNewEditForm"
            >
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Select name="role" label="Role">
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="MEMBER">MEMBER</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Field.Select>

                <Field.Select name="status" label="Status">
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="BANNED">Banned</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Field.Select>
              </Box>
              <Divider sx={{ my: 3 }} />
            </RoleBasedGuard>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="displayName" label="Full name" required />
              <Field.Text name="email" label="Email address" required type="email" />
              <Field.Text name="phoneNumber" label="Phone number" />

              <ElementCountry name="countryId" onCountryChange={handleCountryChange} />

              <ElementState
                name="stateId"
                selectedCountry={selectedCountry}
                onStateChange={handleStateChange}
              />

              <ElementCity name="cityId" selectedState={selectedState} />

              <Field.Text name="address" label="Address" />
              <Field.Text name="zipCode" label="Zip/code" />
            </Box>

            <Box sx={{ mt: 3, mb: 3, rowGap: 1 }}>
              <Field.Text name="company" label="Company" />
            </Box>

            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="facebook" label="Facebook URL" />
              <Field.Text name="instagram" label="Instagram URL" />
              <RoleBasedGuard
                allowedRoles={['ADMIN']}
                hasContent={false}
                protecting="UserNewEditForm"
              >
                <Field.Text name="auth0Id" label="Auth0 ID" disabled />
                <Field.DateTimePicker name="lastLogin" label="Last Login" disabled />
              </RoleBasedGuard>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mt: 3, mb: 3, rowGap: 1 }}>
              <ElementAbout
                name="about"
                label="About"
                helperText="Tell us about yourself, your background, and your connection to art"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.DateTimePicker name="createdAt" label="Created At" disabled />
              <Field.DateTimePicker name="updatedAt" label="Updated At" disabled />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              {onCancel && (
                <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create user'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
