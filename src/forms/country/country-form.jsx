/**
 * @version 2.0.0
 * @author Jaimie Garner
 * @memberof CityArtWalks.Forms.Country
 * @fileoverview Form component for creating and updating Country entities.
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Validators}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation}
 */

'use client';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { debugError } from 'src/lib/debug';
import { useCreateCountry, useUpdateCountry } from 'src/actions/country/hooks';
import {
  createCountrySchema,
  updateCountrySchema,
  getCountryDefaultValues,
} from 'src/validators/country';
import {
  ElementName,
  ElementSlug,
  ElementAudit,
  ElementActive,
  ElementLatitude,
  ElementLongitude,
  ElementCountryCode,
} from 'src/forms/elements';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
/**
 * @memberof CityArtWalks.Forms.Country
 * @function CountryForm
 * @description Form component for creating and updating country information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentCountry=null] - Current country data for editing, null for creating new country
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered CountryForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country} - Country entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function CountryForm(props) {
  const { currentCountry = null, onSuccess, onCancel } = props;

  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentCountry);

  // Use appropriate hooks for create/update operations
  const createCountry = useCreateCountry(accessToken);
  const updateCountry = useUpdateCountry(accessToken);

  // Get default values using validator utility
  const defaultValues = getCountryDefaultValues(currentCountry);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateCountrySchema : createCountrySchema;

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * @memberof CityArtWalks.Forms.Country.CountryForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Clean and prepare data for API
      const cleanData = {
        name: data.name,
        code: data.code,
        slug: data.slug,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        active: Boolean(data.active), // Ensure proper boolean conversion
        imageUrl: data.imageUrl || null,
      };

      // Remove null/undefined values
      const formData = Object.fromEntries(
        Object.entries(cleanData).filter(([_, value]) => value !== null && value !== undefined)
      );

      let result;

      if (isEdit) {
        // Update existing country
        if (!currentCountry.countryId) {
          debugError(
            'CityArtWalks.Forms.Country.CountryForm.onSubmit',
            'Country ID is required for update operation',
            {
              currentCountry: currentCountry ? 'provided' : 'null',
              hasCountryId: !!currentCountry?.countryId,
            }
          );
          toast.error('Country ID is required for update operation');
          return;
        }

        result = await updateCountry(currentCountry.countryId, formData);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Country.CountryForm.onSubmit',
            'Update country operation returned null result',
            {
              countryId: currentCountry.countryId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update country - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedCountryData = result.data || result || currentCountry;
        reset(getCountryDefaultValues(updatedCountryData));
        toast.success('Your country has been updated successfully!');
      } else {
        // Create new country
        result = await createCountry(formData);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Country.CountryForm.onSubmit',
            'Create country operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create country - no response from server');
          return;
        }

        // Reset form with created country data
        const createdCountryData = result.data || result;
        reset(getCountryDefaultValues(createdCountryData));
        toast.success('Country created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          result,
          operation: isEdit ? 'update' : 'create',
          countryData: result.data || result,
          isEdit,
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.Country.CountryForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} country`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          countryId: currentCountry?.countryId,
          formData: data ? Object.keys(data).join(', ') : 'missing',
          timestamp: new Date().toISOString(),
          isEdit,
        }
      );

      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} country. Please check your information and try again.`;
      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'This country already exists. Please use different values.';
      }

      toast.error(errorMessage);
    }
  });

  /**
   * @memberof CityArtWalks.Forms.Country.CountryForm
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
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            },
          }}
        >
          <ElementName name="name" label="Country Name" required />
          <ElementCountryCode name="code" label="Country Code" required />
          <ElementSlug
            sourceField="name"
            label="Country Slug"
            helperText="Auto-generated URL identifier from country name"
          />
          <ElementActive name="active" label="Active" />
          <ElementLatitude />
          <ElementLongitude />
          <Field.Text name="imageUrl" label="Image URL" />
        </Box>

        {/* System Fields (Edit Only) */}
        {isEdit && (
          <>
            <Divider sx={{ my: 3 }} />
            <ElementAudit />
          </>
        )}

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create country'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}

/**
 * @memberof CityArtWalks.Forms.Country.CountryForm
 * @description PropTypes validation for the CountryForm component
 */
CountryForm.propTypes = {
  /**
   * Current country data for editing operations
   * @type {Object|null}
   */
  currentCountry: PropTypes.shape({
    countryId: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    slug: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    imageUrl: PropTypes.string,
    active: PropTypes.bool,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    createdBy: PropTypes.number,
    updatedBy: PropTypes.number,
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
