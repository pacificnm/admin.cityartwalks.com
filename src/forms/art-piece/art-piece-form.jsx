/**
 * @file art-piece-form.jsx
 * @description Form component for creating and updating art piece information with proper validation and error handling.
 * @version 1.2.0
 * @author jaimie garner
 * @namespace CityArtWalks.Forms.ArtPiece
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation patterns
 */

'use client';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { withTracking } from 'src/utils/with-tracking';

import { debugError } from 'src/lib/debug';
import { useCreateArtPiece, useUpdateArtPiece } from 'src/actions/art-piece/hooks';
import {
  createArtPieceSchema,
  updateArtPieceSchema,
  defaultArtPieceValues,
} from 'src/validators/art-piece';
import {
  ElementSlug,
  ElementAudit,
  ElementLocation,
  ElementLatitude,
  ElementLongitude,
  ElementSelectArtist,
  ElementArtPieceTags,
  ElementArtPieceType,
  ElementArtPieceTitle,
  ElementArtPieceStatus,
  ElementArtPieceFeatured,
  ElementArtPieceMaterials,
  ElementArtPieceMetaTitle,
  ElementArtPieceDescription,
  ElementArtPieceMetaKeywords,
  ElementArtPieceMetaDescription,
  ElementArtPieceInstallationDate,
} from 'src/forms/elements';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

/**
 * @memberof CityArtWalks.Forms.ArtPiece
 * @function ArtPieceForm
 * @description Form component for creating and updating art piece information with proper validation and error handling.
 *
 * Features:
 * - Dual mode support (create/edit) with appropriate validation schemas
 * - Creator-only editing: Only the user who created the art piece can edit it
 * - Custom element integration for art piece specific fields
 * - Comprehensive error handling and user feedback
 * - File upload support with proper FormData handling
 * - Real-time form validation and state management
 * - Role-based access control for sensitive operations
 * - Visual feedback for editing permissions with alert notifications
 *
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentArtPiece=null] - Current art piece data for editing, null for creating new art piece
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @param {string} [props.artistId] - Artist ID for new art piece creation
 * @param {string} [props.slug] - Slug for new art piece creation
 * @param {Object} [props.location] - Location data for new art piece creation
 * @returns {JSX.Element} The rendered ArtPieceForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 */
export function ArtPieceForm(props) {
  const { currentArtPiece = null, onSuccess, onCancel, artistId, slug, location } = props;

  const { accessToken, user } = useAuthContext();
  const isEdit = Boolean(currentArtPiece);

  // State to control form editing permissions
  const [getDisabled, setDisabled] = useState(true);

  // Check if current user can edit this art piece
  useEffect(() => {
    if (!isEdit) {
      // Allow editing for new art pieces
      setDisabled(false);
    } else if (currentArtPiece && user) {
      // For existing art pieces, only allow editing if user is the creator
      // Convert both to strings for proper comparison (handles number vs string mismatches)
      const userId = String(user.userId);
      const createdBy = String(currentArtPiece.createdBy);
      const canEdit = userId === createdBy;
      setDisabled(!canEdit);
    } else {
      // Default to disabled if no user or art piece data
      setDisabled(true);
    }
  }, [isEdit, currentArtPiece, user]);

  // Use appropriate hooks for create/update operations
  const createArtPiece = useCreateArtPiece(accessToken);
  const updateArtPiece = useUpdateArtPiece(accessToken);

  // Get default values using validator utility
  const defaultValues = useMemo(() => {
    const baseDefaults = defaultArtPieceValues(currentArtPiece);

    // For new art pieces, set additional fields
    if (!currentArtPiece) {
      return {
        ...baseDefaults,
        artistId,
        city: location?.cityId,
        state: location?.regionName,
        slug,
      };
    }

    return baseDefaults;
  }, [currentArtPiece, artistId, location, slug]);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateArtPieceSchema : createArtPieceSchema;

  // methods
  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema),
    defaultValues,
    values: defaultValues, // Always use sanitized values
  });

  // available methods
  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // updated live values
  // eslint-disable-next-line no-unused-vars
  const values = watch();

  // Watch for changes to `currentArtPiece` and reset the form
  useEffect(() => {
    if (currentArtPiece) {
      reset(defaultArtPieceValues(currentArtPiece));
    }
  }, [currentArtPiece, reset]);

  /**
   * @memberof CityArtWalks.Forms.ArtPiece.ArtPieceForm
   * @function onSubmit
   * @description Handles form submission for both create and update operations.
   * Delegates FormData handling to hooks for proper file upload processing.
   * @param {Object} data - Validated form data from react-hook-form
   * @returns {Promise<void>}
   * @throws {Error} When API operation fails or validation errors occur
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      let result;

      if (isEdit) {
        // Update existing art piece
        if (!currentArtPiece.artPieceId) {
          debugError(
            'CityArtWalks.Forms.ArtPiece.ArtPieceForm.onSubmit',
            'ArtPiece ID is required for update operation',
            {
              currentArtPiece: currentArtPiece ? 'provided' : 'null',
              hasArtPieceId: !!currentArtPiece?.artPieceId,
            }
          );
          toast.error('ArtPiece ID is required for update operation');
          return;
        }
        // Let hooks handle FormData complexity for file uploads
        result = await updateArtPiece(currentArtPiece.artPieceId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPiece.ArtPieceForm.onSubmit',
            'Update art piece operation returned null result',
            {
              artPieceId: currentArtPiece.artPieceId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update art piece - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedArtPieceData = result.data || result || currentArtPiece;
        reset(defaultArtPieceValues(updatedArtPieceData));
        toast.success('Your art piece has been updated successfully!');
      } else {
        // Create new art piece
        // Add artistId for new art pieces
        const createData = { ...data, artistId };

        // Let hooks handle FormData complexity for file uploads
        result = await createArtPiece(createData);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPiece.ArtPieceForm.onSubmit',
            'Create art piece operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create art piece - no response from server');
          return;
        }

        // Reset form with created art piece data
        const createdArtPieceData = result.data || result;
        reset(defaultArtPieceValues(createdArtPieceData));
        toast.success('Art piece created successfully!');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess({
          result,
          operation: isEdit ? 'update' : 'create',
          artPieceData: result.data || result,
          isEdit,
        });
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.ArtPiece.ArtPieceForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} art piece`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          artPieceId: currentArtPiece?.artPieceId,
          formData: data ? Object.keys(data).join(', ') : 'missing',
          timestamp: new Date().toISOString(),
          isEdit,
        }
      );

      // Enhanced error message based on error type
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} art piece. Please check your information and try again.`;

      if (error.message.includes('validation')) {
        errorMessage = 'Please check the form fields for validation errors.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'This art piece already exists. Please use different values.';
      }

      toast.error(errorMessage);
    }
  });

  /**
   * @memberof CityArtWalks.Forms.ArtPiece.ArtPieceForm
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
    <ErrorBoundary>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 3 }}>
          {/* Permission Alert */}
          {isEdit && getDisabled && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              You can only edit art pieces that you created. This art piece was created by another
              user.
            </Alert>
          )}
          {isEdit && !getDisabled && (
            <Alert severity="success" sx={{ mb: 3 }}>
              You can edit this art piece because you are the creator.
            </Alert>
          )}

          {/* Primary Information Section */}
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <ElementArtPieceTitle name="title" label="Art Piece Title" disabled={getDisabled} />
            <ElementSlug sourceField="title" label="Art Piece Slug" disabled />
          </Box>

          {/* Description Section */}
          <Box sx={{ mt: 3 }}>
            <ElementArtPieceDescription
              name="description"
              label="Description"
              currentArtPiece={currentArtPiece}
              sx={{ maxHeight: 480 }}
            />
          </Box>

          {/* Location Information */}
          <Divider sx={{ my: 3 }} />
          <ElementLocation disabled={getDisabled} />

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              mt: 3,
            }}
          >
            <ElementLatitude disabled={getDisabled} />
            <ElementLongitude disabled={getDisabled} />
          </Box>

          {/* Art Piece Details */}
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <ElementArtPieceStatus disabled={getDisabled} />
            <ElementArtPieceType disabled={getDisabled} />
            <ElementArtPieceTags name="artPieceTag" label="Tags" disabled={getDisabled} />
            <ElementArtPieceMaterials
              name="artPieceMaterial"
              label="Materials"
              disabled={getDisabled}
            />
            <ElementArtPieceInstallationDate name="installationDate" disabled={getDisabled} />
            <ElementSelectArtist
              name="artistId"
              label="Artist"
              disabled={getDisabled}
              helperText="Select the artist who created this art piece"
            />
          </Box>

          {/* SEO Meta Tags Section */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              SEO Meta Tags
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Optimize your art piece for search engines with custom meta tags. These help improve
              visibility and click-through rates in search results.
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
            <ElementArtPieceMetaTitle
              name="metaTitle"
              label="Meta Title"
              currentArtPiece={currentArtPiece}
              disabled={getDisabled}
              showAIButton={!getDisabled}
            />

            <ElementArtPieceMetaDescription
              name="metaDescription"
              label="Meta Description"
              currentArtPiece={currentArtPiece}
              disabled={getDisabled}
              showAIButton={!getDisabled}
            />

            <ElementArtPieceMetaKeywords
              name="metaKeywords"
              label="Meta Keywords"
              currentArtPiece={currentArtPiece}
              disabled={getDisabled}
              showAIButton={!getDisabled}
            />
          </Box>

          {/* Admin Controls */}
          <RoleBasedGuard allowedRoles={['ADMIN']} displayMode="hidden" protecting="ArtPieceForm">
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <ElementArtPieceFeatured disabled={getDisabled} />
            </Box>
          </RoleBasedGuard>

          {/* System Fields (Edit Only) */}
          {isEdit && (
            <>
              <Divider sx={{ my: 3 }} />
              <ElementAudit
                title="Art Piece Audit Information"
                recordIdLabel="Art Piece ID"
                recordIdField="artPieceId"
                recordIdHelperText="Unique identifier for this art piece"
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
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || getDisabled}
              onClick={withTracking(() => {}, {
                event: 'form_submit',
                data: {
                  label: isEdit ? 'Save changes' : 'Create art piece',
                  form: 'Art Piece Form',
                  operation: isEdit ? 'update' : 'create',
                  artPieceId: currentArtPiece?.artPieceId,
                },
                userId: user?.id,
              })}
            >
              {isEdit ? 'Save changes' : 'Create art piece'}
            </Button>
          </Stack>
        </Card>
      </Form>
    </ErrorBoundary>
  );
}

ArtPieceForm.propTypes = {
  currentArtPiece: PropTypes.shape({
    artPieceId: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    address: PropTypes.string,
    cityId: PropTypes.number,
    stateId: PropTypes.number,
    countryId: PropTypes.number,
    artistId: PropTypes.number,
    userId: PropTypes.string,
    slug: PropTypes.string,
    status: PropTypes.string,
    pieceType: PropTypes.string,
    featured: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  slug: PropTypes.string,
  location: PropTypes.shape({
    cityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    regionName: PropTypes.string,
  }),
};
