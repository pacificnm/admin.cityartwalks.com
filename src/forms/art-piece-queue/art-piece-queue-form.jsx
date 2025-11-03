/**
 * Art Piece Queue Form Component
 *
 * Form component for creating and editing art piece queue items with
 * comprehensive validation, error handling, and integration with harvesting pipeline.
 * Focuses on URL input interface for new harvests.
 *
 * @namespace CityArtWalks.Forms.ArtPieceQueue
 * @version 1.0.0
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { debugError } from 'src/lib/debug';
import { ElementLocation } from 'src/forms/elements/element-location';
import { ElementSelectArtist } from 'src/forms/elements/element-select-artist';
import { ElementArtPieceTags } from 'src/forms/elements/element-art-piece-tags';
import { ElementArtPieceType } from 'src/forms/elements/element-art-piece-type';
import { ElementArtPieceMaterials } from 'src/forms/elements/element-art-piece-materials';
import { ElementArtPieceDescription } from 'src/forms/elements/element-art-piece-description';
import { useCreateArtPieceQueue, useUpdateArtPieceQueue } from 'src/actions/art-piece-queue/hooks';
import {
  createArtPieceQueueSchema,
  updateArtPieceQueueSchema,
  defaultArtPieceQueueValues,
} from 'src/validators/art-piece-queue';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Forms.ArtPieceQueue
 * @function ArtPieceQueueForm
 * @description Form component for creating and updating art piece queue information with proper validation and error handling.
 * Focuses on URL input interface for new harvest operations.
 * @param {Object} props - Component props
 * @param {Object|null} [props.currentArtPieceQueue=null] - Current art piece queue data for editing, null for creating new queue item
 * @param {Function} [props.onSuccess] - Optional callback function called after successful form submission
 * @param {Function} [props.onCancel] - Optional callback function called when form is cancelled
 * @returns {JSX.Element} The rendered ArtPieceQueueForm component
 * @throws {Error} When form validation fails or API request encounters an error
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceQueue} - ArtPieceQueue entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Forms documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema-Validation} - Schema validation documentation
 */
export function ArtPieceQueueForm({ currentArtPieceQueue = null, onSuccess, onCancel }) {
  const { accessToken } = useAuthContext();
  const isEdit = Boolean(currentArtPieceQueue);

  // Determine if fields should be disabled based on status
  const currentStatus = currentArtPieceQueue?.status;
  const isFieldsDisabled = isEdit && currentStatus !== 'REVIEWING';

  // Use appropriate hooks for create/update operations - pass the token to the hooks
  const createArtPieceQueue = useCreateArtPieceQueue(accessToken);
  const updateArtPieceQueue = useUpdateArtPieceQueue(accessToken);

  // Get default values using validator utility
  const defaultValues = defaultArtPieceQueueValues(currentArtPieceQueue);

  // Use appropriate schema based on operation type
  const validationSchema = isEdit ? updateArtPieceQueueSchema : createArtPieceQueueSchema;

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
   * @memberof CityArtWalks.Forms.ArtPieceQueue.ArtPieceQueueForm
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
        // Update existing art piece queue
        if (!currentArtPieceQueue.artPieceQueueId) {
          debugError(
            'CityArtWalks.Forms.ArtPieceQueue.ArtPieceQueueForm.onSubmit',
            'Art piece queue ID is required for update operation',
            {
              currentArtPieceQueue: currentArtPieceQueue ? 'provided' : 'null',
              hasArtPieceQueueId: !!currentArtPieceQueue?.artPieceQueueId,
            }
          );
          toast.error('Art piece queue ID is required for update operation');
          return;
        }

        result = await updateArtPieceQueue(currentArtPieceQueue.artPieceQueueId, data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPieceQueue.ArtPieceQueueForm.onSubmit',
            'Update art piece queue operation returned null result',
            {
              artPieceQueueId: currentArtPieceQueue.artPieceQueueId,
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to update art piece queue - no response from server');
          return;
        }

        // Reset form with updated data
        const updatedQueueData = result.data || result || currentArtPieceQueue;
        reset(defaultArtPieceQueueValues(updatedQueueData));
        toast.success('Art piece queue has been updated successfully!');
      } else {
        // Create new art piece queue - this will trigger HTML download in API route
        result = await createArtPieceQueue(data);

        if (!result) {
          debugError(
            'CityArtWalks.Forms.ArtPieceQueue.ArtPieceQueueForm.onSubmit',
            'Create art piece queue operation returned null result',
            {
              formData: data ? 'provided' : 'missing',
            }
          );
          toast.error('Failed to create art piece queue - no response from server');
          return;
        }

        // Reset form with created queue data
        const createdQueueData = result.data || result;
        reset(defaultArtPieceQueueValues(createdQueueData));
        toast.success('Art piece queue created successfully! HTML download will begin shortly.');
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } catch (error) {
      // Enhanced error handling with proper logging
      debugError(
        'CityArtWalks.Forms.ArtPieceQueue.ArtPieceQueueForm.onSubmit',
        `Failed to ${isEdit ? 'update' : 'create'} art piece queue`,
        {
          error: error.message,
          stack: error.stack,
          operation: isEdit ? 'update' : 'create',
          artPieceQueueId: currentArtPieceQueue?.artPieceQueueId,
          formData: data ? 'provided' : 'missing',
          timestamp: new Date().toISOString(),
        }
      );

      // Show user-friendly error message
      const operation = isEdit ? 'update' : 'create';
      toast.error(
        `Failed to ${operation} art piece queue. Please check your information and try again.`
      );
    }
  });

  /**
   * @memberof CityArtWalks.Forms.ArtPieceQueue.ArtPieceQueueForm
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
        {!isEdit && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Enter the URL of an art piece or artist page to add it to the harvesting queue. Our
              system will download the HTML content and extract the art piece information
              automatically.
            </Typography>
          </Alert>
        )}

        {isSubmitting && !isEdit && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Processing URL... Downloading HTML content and preparing for AI extraction.
            </Typography>
          </Alert>
        )}

        {/* URL Input Section - Primary focus for new harvests */}
        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
          }}
        >
          <Field.Text
            name="sourceUrl"
            label="Source URL"
            required
            placeholder="https://example.com/art-piece"
            disabled
          />

          {/* Required fields information for edit mode */}
          {isEdit && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Required for Conversion:</strong> Fields marked with * are required to
                convert this queue item to a published Art Piece. Title, Artist, Coordinates
                (Latitude/Longitude), Art Piece Type, Materials, and Tags must be completed before
                conversion.
              </Typography>
            </Alert>
          )}

          {/* Optional manual fields for additional context */}
          {isEdit && (
            <>
              <Field.Text
                name="title"
                label="Title"
                placeholder="Art piece title (required for conversion)"
                disabled={isFieldsDisabled}
                required
                sx={{
                  '& .MuiFormLabel-asterisk': { color: 'error.main' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'warning.main',
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <ElementSelectArtist
                name="artistId"
                label="Artist"
                placeholder="Search for an artist..."
                helperText="Link this item to an existing artist in the system (required for conversion)"
                showAddButton={false}
                disabled={isFieldsDisabled}
                required
              />

              <ElementArtPieceDescription
                name="description"
                label="Description"
                currentArtPiece={currentArtPieceQueue}
                showAIButton={!isFieldsDisabled}
                sx={{ maxHeight: 400 }}
                disabled={isFieldsDisabled}
              />

              <ElementArtPieceType
                name="artPieceType"
                label="Art Piece Type"
                helperText="Select or add the type of this art piece (required for conversion)"
                disabled={isFieldsDisabled}
              />

              <ElementArtPieceMaterials
                name="artPieceMaterial"
                label="Materials"
                helperText="Select or add materials used in this art piece (required for conversion)"
                disabled={isFieldsDisabled}
                required
              />

              <ElementArtPieceTags
                name="artPieceTag"
                label="Tags"
                helperText="Add tags to categorize this art piece (required for conversion)"
                disabled={isFieldsDisabled}
                required
              />
            </>
          )}
        </Box>

        {/* Location Information (mainly for edit mode) */}
        {isEdit && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Location Information
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Location Information - Single info box */}
              <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Location Information (AI Extracted)
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* Country */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: 80 }}>
                      Country:
                    </Typography>
                    <Typography variant="body2">
                      {currentArtPieceQueue?.country || 'Not detected'}
                    </Typography>
                    {currentArtPieceQueue?.countryId && (
                      <Typography variant="caption" color="success.main">
                        ✓ Mapped
                      </Typography>
                    )}
                  </Box>

                  {/* State */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: 80 }}>
                      State:
                    </Typography>
                    <Typography variant="body2">
                      {currentArtPieceQueue?.state || 'Not detected'}
                    </Typography>
                    {currentArtPieceQueue?.stateId && (
                      <Typography variant="caption" color="success.main">
                        ✓ Mapped
                      </Typography>
                    )}
                  </Box>

                  {/* City */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: 80 }}>
                      City:
                    </Typography>
                    <Typography variant="body2">
                      {currentArtPieceQueue?.city || 'Not detected'}
                    </Typography>
                    {currentArtPieceQueue?.cityId && (
                      <Typography variant="caption" color="success.main">
                        ✓ Mapped
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>

              {/* Location component - Single line */}
              <ElementLocation disabled={isFieldsDisabled} />

              {/* Coordinates - Two columns */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Field.Text
                  name="latitude"
                  label="Latitude"
                  type="number"
                  placeholder="e.g., 40.7128 (required for conversion)"
                  inputProps={{ step: 'any' }}
                  disabled={isFieldsDisabled}
                  required
                  sx={{
                    '& .MuiFormLabel-asterisk': { color: 'error.main' },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'warning.main',
                        borderWidth: 2,
                      },
                    },
                  }}
                />

                <Field.Text
                  name="longitude"
                  label="Longitude"
                  type="number"
                  placeholder="e.g., -74.0060 (required for conversion)"
                  inputProps={{ step: 'any' }}
                  disabled={isFieldsDisabled}
                  required
                  sx={{
                    '& .MuiFormLabel-asterisk': { color: 'error.main' },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'warning.main',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </>
        )}

        {/* Status and Processing Information (edit mode only) */}
        {isEdit && currentArtPieceQueue && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Processing Status
            </Typography>

            {isFieldsDisabled && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Fields are read-only because this queue item status is &quot;{currentStatus}
                  &quot;. Only items with &quot;REVIEWING&quot; status can be edited.
                </Typography>
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* First line: Queue ID and Status */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Field.Text name="artPieceQueueId" label="Queue ID" disabled />

                <Field.Select name="status" label="Status">
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                  <MenuItem value="REVIEWING">Reviewing</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="ERROR">Error</MenuItem>
                </Field.Select>
              </Box>

              {/* Second line: Verification Notes */}
              <Field.Text
                name="verificationNotes"
                label="Verification Notes"
                multiline
                rows={3}
                placeholder="Notes about verification or processing..."
                disabled={isFieldsDisabled}
              />

              {/* Third line: Created At and Updated At */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Field.DateTimePicker name="createdAt" label="Created At" disabled />

                <Field.DateTimePicker name="updatedAt" label="Updated At" disabled />
              </Box>
            </Box>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Form Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={isSubmitting || isFieldsDisabled}>
            {isSubmitting ? 'Processing...' : isEdit ? 'Update Queue Item' : 'Add to Harvest Queue'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}
