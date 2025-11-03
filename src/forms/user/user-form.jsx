/**
 * @file user-form.jsx
 * @description Form component for creating and updating user information with validation and error handling.
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Forms.User
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User} - User entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { debugLog, debugError } from 'src/lib/debug';
import { ElementCity } from 'src/forms/elements/element-city';
import { ElementAbout } from 'src/forms/elements/element-about';
import { ElementState } from 'src/forms/elements/element-state';
import { ElementCountry } from 'src/forms/elements/element-country';
import { useCreateUser, useUpdateUser } from 'src/actions/user/hooks';
import { createUserSchema, updateUserSchema, defaultUserValues } from 'src/validators/user';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.User
 * @function UserForm
 * @description Form component for creating and updating user information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentUser=null] - Current user data for editing, null for creating new user
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered UserForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/User} - User entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function UserForm(props) {
  const { currentUser = null, onSuccess, onCancel } = props;
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
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = methods;

  // Debug form state
  debugLog('CityArtWalks.Forms.User.UserForm', 'Form state', {
    isSubmitting,
    isValid,
    hasErrors: Object.keys(errors).length > 0,
    errors: Object.keys(errors),
  });

  /**
   * @memberof CityArtWalks.Forms.User.UserForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  /**
   * @memberof CityArtWalks.Forms.User.UserForm
   * @function onSubmitError
   * @description Handles client-side validation errors.
   */
  const onSubmitError = (validationErrors) => {
    // Handle client-side validation errors
    debugError('CityArtWalks.Forms.User.UserForm.onSubmitError', 'Client-side validation failed', {
      errors: Object.keys(validationErrors),
      errorCount: Object.keys(validationErrors).length,
    });

    // Show validation errors in toast
    const errorMessages = Object.values(validationErrors)
      .map((error) => error.message)
      .filter(Boolean)
      .slice(0, 3) // Limit to first 3 errors
      .join(', ');

    if (errorMessages) {
      toast.error(`Please fix the following errors: ${errorMessages}`);
    } else {
      toast.error('Please fix the validation errors and try again.');
    }
  };

  const onSubmitSuccess = async (data) => {
    try {
      debugLog('CityArtWalks.Forms.User.UserForm.onSubmit', 'Form submission started', {
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
          debugError(
            'CityArtWalks.Forms.User.UserForm.onSubmit',
            'User ID is required for update operation',
            {
              currentUser: currentUser ? 'provided' : 'null',
              hasUserId: !!currentUser?.userId,
              formData: cleanedData ? 'provided' : 'missing',
            }
          );
          toast.error('User ID is required for update operation');
          return;
        }

        result = await updateUser(currentUser.userId, cleanedData);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.User.UserForm.onSubmit',
            'Update user operation returned null result',
            {
              userId: currentUser.userId,
              formData: cleanedData ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update user - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedUserData = result.data || result || currentUser;
        reset(defaultUserValues(updatedUserData));
        toast.success('Your information has been saved successfully!');
      } else {
        // Create new user
        result = await createUser(cleanedData);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.User.UserForm.onSubmit',
            'Create user operation returned null result',
            {
              formData: cleanedData ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create user - no response from server');
          return;
        }

        // Reset form with created user data
        const createdUserData = result.data || result;
        reset(defaultUserValues(createdUserData));
        toast.success('User created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.User.UserForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} user`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          userId: currentUser?.userId,
          formData: 'provided',
          timestamp: new Date().toISOString(),
        }
      );

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
  };

  const onSubmit = handleSubmit(onSubmitSuccess, onSubmitError);

  /**
   * @memberof CityArtWalks.Forms.User.UserForm
   * @function handleCountryChange
   * @description Handles country selection change and resets dependent fields.
   */
  const handleCountryChange = (event) => {
    const countryId = event.target.value || '';
    setSelectedCountry(countryId);
    setSelectedState(''); // Reset state when country changes

    // Clear state and city fields in the form - use empty string instead of null
    methods.setValue('stateId', '');
    methods.setValue('cityId', '');
  };

  /**
   * @memberof CityArtWalks.Forms.User.UserForm
   * @function handleStateChange
   * @description Handles state selection change and resets city field.
   */
  const handleStateChange = (event) => {
    const stateId = event.target.value || '';
    setSelectedState(stateId);

    // Clear city field in the form - use empty string instead of null
    methods.setValue('cityId', '');
  };

  /**
   * @memberof CityArtWalks.Forms.User.UserForm
   * @function handleCancel
   * @description Handles form cancellation by resetting to original values.
   */
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
      <Card sx={{ p: 3 }}>
        {/* Personal Information Section */}
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

        {/* Company Information Section */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <Field.Text name="company" label="Company" />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Social Media Section */}
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <Field.Text
            name="facebook"
            label="Facebook URL"
            placeholder="https://facebook.com/username"
          />
          <Field.Text
            name="instagram"
            label="Instagram URL"
            placeholder="https://instagram.com/username"
          />

          {/* Read-only system fields for existing users */}
          {isEdit && (
            <>
              <Field.Text
                name="auth0Id"
                label="Auth0 ID"
                disabled
                helperText="System-generated identifier"
              />
              <Field.DateTimePicker
                name="lastLogin"
                label="Last Login"
                disabled
                helperText="Automatically updated on login"
              />
            </>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* About Section */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <ElementAbout
            name="about"
            label="About"
            helperText="Tell us about yourself, your background, and your connection to art"
          />
        </Box>

        {/* Form Actions */}
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
    </Form>
  );
}
