/**
 * @version 2.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Forms.Artist
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { debugError } from 'src/lib/debug';
import { useCreateArtist, useUpdateArtist } from 'src/actions/artist/hooks';
import {
  createArtistSchema,
  updateArtistSchema,
  defaultArtistValues,
  getCreateArtistDefaults,
} from 'src/validators/artist';
import {
  ElementName,
  ElementSlug,
  ElementStatus,
  ElementWebsite,
  ElementFacebook,
  ElementLocation,
  ElementViewCount,
  ElementArtistBio,
  ElementBirthDate,
  ElementDeathDate,
  ElementInstagram,
  ElementArtistMetaTitle,
  ElementArtistMetaKeywords,
  ElementArtistMetaDescription,
} from 'src/forms/elements';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.Artist
 * @function ArtistForm
 * @description Form component for creating and updating artist information with proper validation and error handling.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentArtist=null] - Current artist data for editing, null for creating new artist
 * @param {Object} [props.initialValues={}] - Initial values for creating new artist (when currentArtist is null)
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 *   Receives object with: { result, operation, artistData, isEdit, artist, data }
 *   - result: Full API response
 *   - operation: 'create' or 'update'
 *   - artistData: The artist data from the response
 *   - isEdit: Boolean indicating if this was an edit operation
 *   - artist: Convenience property pointing to artistData
 *   - data: Backward compatibility property pointing to artistData
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ArtistForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtistForm({ currentArtist = null, initialValues = {}, onSuccess, onCancel }) {
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentArtist?.artistId);

  // Use appropriate hooks for create/update operations
  const createArtist = useCreateArtist(accessToken);
  const updateArtist = useUpdateArtist(accessToken);

  // Get default values using appropriate function based on operation
  const baseDefaults = isEdit ? defaultArtistValues(currentArtist) : getCreateArtistDefaults();

  // Merge with initial values for new artists
  const defaultValues = isEdit ? baseDefaults : { ...baseDefaults, ...initialValues };

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateArtistSchema : createArtistSchema;

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
   * @memberof CityArtWalks.Forms.Artist.ArtistForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      let result;

      if (isEdit) {
        // Update existing artist
        if (!currentArtist?.artistId) {
          debugError(
            'CityArtWalks.Forms.Artist.ArtistForm.onSubmit',
            'Artist ID is required for update operation',
            {
              currentArtist: currentArtist ? 'provided' : 'null',
              hasArtistId: !!currentArtist?.artistId,
            }
          );
          toast.error('Artist ID is required for update operation');
          return;
        }

        result = await updateArtist(currentArtist.artistId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Artist.ArtistForm.onSubmit',
            'Update artist operation returned null result',
            {
              artistId: currentArtist.artistId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update artist - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedArtistData = result.data || result || currentArtist;
        reset(defaultArtistValues(updatedArtistData));
        toast.success('Your artist has been updated successfully!');
      } else {
        // Create new artist
        result = await createArtist(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.Artist.ArtistForm.onSubmit',
            'Create artist operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create artist - no response from server');
          return;
        }

        // Reset form with created artist data
        const createdArtistData = result.data || result;
        reset(defaultArtistValues(createdArtistData));
        toast.success('Artist created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        const artistData = result.data || result;
        onSuccess({
          result,
          operation: isEdit ? 'update' : 'create',
          artistData,
          isEdit,
          // Convenience property for quick access to the artist
          artist: artistData,
          // For backward compatibility
          data: artistData,
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.Artist.ArtistForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} artist`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          artistId: currentArtist?.artistId,
          formData: data ? Object.keys(data).join(', ') : 'missing',
          timestamp: new Date().toISOString(),
          isEdit,
        }
      );

      // Enhanced error message based on error type
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} artist. Please check your information and try again.`;

      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      toast.error(errorMessage);
    }
  });

  /**
   * @memberof CityArtWalks.Forms.Artist.ArtistForm
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
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          <ElementName name="name" label="Artist Name" required />
          <ElementSlug name="slug" label="Slug" sourceField="name" disabled />
          <ElementStatus name="status" label="Status" />
        </Box>

        <Box sx={{ mt: 3 }}>
          <ElementArtistBio name="biography" label="Biography" currentArtist={currentArtist} />
        </Box>

        {/* Date Information */}
        <Divider sx={{ my: 3 }} />
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <ElementBirthDate name="birthDate" label="Birth Date" />
          <ElementDeathDate name="deathDate" label="Death Date" />
        </Box>

        {/* Social Media Information */}
        <Divider sx={{ my: 3 }} />
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
          }}
        >
          <ElementFacebook name="facebook" label="Facebook" />
          <ElementInstagram name="instagram" label="Instagram" />
          <ElementWebsite name="website" label="Website" />
        </Box>

        {/* Location Information */}
        <Divider sx={{ my: 3 }} />
        <ElementLocation />

        {/* SEO Meta Tags Section */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            SEO Meta Tags
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Optimize your artist profile for search engines with custom meta tags. These help
            improve visibility and click-through rates in search results.
          </Typography>
        </Box>

        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
          }}
        >
          <ElementArtistMetaTitle
            name="metaTitle"
            label="Meta Title"
            currentArtist={currentArtist}
          />

          <ElementArtistMetaDescription
            name="metaDescription"
            label="Meta Description"
            currentArtist={currentArtist}
          />

          <ElementArtistMetaKeywords
            name="metaKeywords"
            label="Meta Keywords"
            currentArtist={currentArtist}
          />
        </Box>

        {/* System Information (Edit Only) */}
        {isEdit && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              <ElementViewCount name="viewCount" label="Views" disabled />
            </Box>
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
            {isEdit ? 'Save changes' : 'Create artist'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
