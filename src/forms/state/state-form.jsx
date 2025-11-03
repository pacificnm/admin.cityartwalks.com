/**
 * @memberof CityArtWalks.Forms.State
 * @function StateForm
 * @description Form component for creating and updating State information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentState=null] - Current State data for editing, null for creating new State
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered StateForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @version 2.1.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State} - State entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { debugError } from 'src/lib/debug';
import { useCreateState, useUpdateState } from 'src/actions/state/hooks';
import { ElementSlug, ElementAudit, ElementLatitude, ElementLongitude } from 'src/forms/elements';
import { createStateSchema, updateStateSchema, getStateDefaultValues } from 'src/validators/state';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

export function StateForm({ currentState = null, onSuccess, onCancel }) {
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentState);

  // Use appropriate hooks for create/update operations
  const createState = useCreateState(accessToken);
  const updateState = useUpdateState(accessToken);

  // Get default values using validator utility
  const defaultValues = getStateDefaultValues(currentState);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateStateSchema : createStateSchema;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * @memberof CityArtWalks.Forms.State.StateForm
   * @function onSubmit
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Clean and prepare data for API
      const cleanData = {
        name: data.name,
        abbreviation: data.abbreviation,
        slug: data.slug,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        active: Boolean(data.active), // Ensure proper boolean conversion
        countryId: data.countryId ? parseInt(data.countryId) : null,
        imageUrl: data.imageUrl || null,
      };

      // Remove null/undefined values
      const formData = Object.fromEntries(
        Object.entries(cleanData).filter(([_, value]) => value !== null && value !== undefined)
      );

      console.log('Sending form data:', formData); // Debug log

      let result;

      if (isEdit) {
        // Update existing state
        if (!currentState.stateId) {
          toast.error('State ID is required for update operation');
          return;
        }

        result = await updateState(currentState.stateId, formData);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.State.StateForm.onSubmit',
            'Update state operation returned null result',
            {
              stateId: currentState.stateId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update state - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedStateData = result.data || result || currentState;
        reset(getStateDefaultValues(updatedStateData));
        toast.success('State has been updated successfully!');
      } else {
        // Create new state
        result = await createState(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.State.StateForm.onSubmit',
            'Create state operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create state - no response from server');
          return;
        }

        // Reset form with created state data
        const createdStateData = result.data || result;
        reset(getStateDefaultValues(createdStateData));
        toast.success('State created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          result,
          operation: isEdit ? 'update' : 'create',
          stateData: result.data || result,
          isEdit,
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.State.StateForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} state`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          stateId: currentState?.stateId,
          formData: data ? Object.keys(data).join(', ') : 'missing',
          timestamp: new Date().toISOString(),
          isEdit,
        }
      );

      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} state. Please check your information and try again.`;
      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'This state already exists. Please use different values.';
      }

      toast.error(errorMessage);
    }
  });

  /**
   * @memberof CityArtWalks.Forms.State.StateForm
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
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        {/* Primary Information Section */}
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <Field.Text name="name" label="Name" required />
          <Field.Text name="abbreviation" label="Abbreviation" required />
          <ElementSlug name="slug" label="Slug" sourceField="name" required disabled={isEdit} />
          <Field.CountrySelect
            name="countryId"
            label="Country"
            required
            placeholder="Choose a country"
          />
          <ElementLatitude name="latitude" label="Latitude" />
          <ElementLongitude name="longitude" label="Longitude" />
          <Field.Switch name="active" label="Active" helperText="Enable or disable this state" />
          <Field.Text name="imageUrl" label="Image URL" type="url" />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* System Fields (Edit Only) */}
        {isEdit && (
          <>
            <Divider sx={{ my: 3 }} />

            <ElementAudit
              title="State Audit Information"
              recordIdField="stateId"
              recordIdLabel="State ID"
              recordIdHelperText="System-generated identifier for this state"
              showCard={false}
            />
          </>
        )}

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" loading={isSubmitting} disabled={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create State'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
