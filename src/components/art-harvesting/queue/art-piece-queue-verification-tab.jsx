/**
 * @file art-piece-queue-verification-tab.jsx
 * @description Verification tab component for art piece queue detail view with validation and conversion
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue.VerificationTab
 * @author Generated
 * @version 1.1.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Harvesting} - Art harvesting pipeline documentation
 */

'use client';

import slugify from 'slugify';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import LoadingButton from '@mui/lab/LoadingButton';

import { debugError } from 'src/lib/debug';
import { createArtPieceSchema } from 'src/validators/art-piece';
import { useCreateArtPiece } from 'src/actions/art-piece/hooks';
import { useUpdateArtPieceQueue } from 'src/actions/art-piece-queue/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue.VerificationTab
 * @function ArtPieceQueueVerificationTab
 * @description React component that provides verification panel and controls for art piece queue items.
 * Includes comprehensive validation, data conversion, and the ability to convert approved queue items
 * to actual ArtPiece records in the database.
 *
 * Features:
 * - Schema validation against ArtPiece creation requirements
 * - Visual validation feedback with detailed error reporting
 * - AI confidence scoring and data quality indicators
 * - One-click conversion from queue item to published ArtPiece
 * - Automatic slug generation and data mapping
 * - Progress tracking and error handling
 *
 * @param {Object} props - Component props
 * @param {Object} props.artPieceQueue - The art piece queue object to validate and convert
 * @param {number} props.artPieceQueue.artPieceQueueId - Unique identifier for the queue item
 * @param {string} props.artPieceQueue.title - Title of the art piece
 * @param {number} props.artPieceQueue.artistId - Artist ID reference
 * @param {number} props.artPieceQueue.latitude - Geographic latitude
 * @param {number} props.artPieceQueue.longitude - Geographic longitude
 * @param {Function} [props.onQueueUpdated] - Callback when queue is updated
 * @param {Function} [props.onArtPieceCreated] - Callback when art piece is created
 * @returns {JSX.Element} The rendered verification tab component
 *
 * @example
 * <ArtPieceQueueVerificationTab
 *   artPieceQueue={queueItem}
 *   onQueueUpdated={handleQueueUpdate}
 *   onArtPieceCreated={handleArtPieceCreated}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Harvesting} - Art harvesting pipeline documentation
 */
export function ArtPieceQueueVerificationTab({ artPieceQueue, onQueueUpdated, onArtPieceCreated }) {
  const { accessToken } = useAuthContext();
  const [isCreating, setIsCreating] = useState(false);

  // Hooks for API operations
  const createArtPiece = useCreateArtPiece(accessToken);
  const updateArtPieceQueue = useUpdateArtPieceQueue(accessToken);

  // Validate the queue data against ArtPiece creation schema
  const validationResult = useMemo(() => {
    if (!artPieceQueue) {
      return { success: false, errors: [{ path: ['general'], message: 'No queue data provided' }] };
    }

    // Check for required fields and provide helpful fallbacks where possible
    const hasTitle = artPieceQueue.title && artPieceQueue.title.trim().length > 0;
    const hasArtistId = artPieceQueue.artistId && !isNaN(Number(artPieceQueue.artistId));
    const hasLatitude =
      artPieceQueue.latitude &&
      !isNaN(Number(artPieceQueue.latitude)) &&
      Number(artPieceQueue.latitude) !== 0;
    const hasLongitude =
      artPieceQueue.longitude &&
      !isNaN(Number(artPieceQueue.longitude)) &&
      Number(artPieceQueue.longitude) !== 0;
    const hasArtPieceType =
      artPieceQueue.artPieceType &&
      (typeof artPieceQueue.artPieceType === 'string'
        ? artPieceQueue.artPieceType.trim().length > 0
        : Array.isArray(artPieceQueue.artPieceType) && artPieceQueue.artPieceType.length > 0);
    const hasArtPieceMaterial =
      artPieceQueue.artPieceMaterial &&
      Array.isArray(artPieceQueue.artPieceMaterial) &&
      artPieceQueue.artPieceMaterial.length > 0;
    const hasArtPieceTag =
      artPieceQueue.artPieceTag &&
      Array.isArray(artPieceQueue.artPieceTag) &&
      artPieceQueue.artPieceTag.length > 0;
    // Map ArtPieceQueue fields to ArtPiece fields with proper validation
    const artPieceData = {
      // Required fields
      title: hasTitle ? artPieceQueue.title.trim() : undefined,
      slug: hasTitle
        ? slugify(artPieceQueue.title.trim(), {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g, // Remove special characters that might cause issues
          })
        : 'untitled-artwork', // Always provide a fallback slug

      // Required numeric fields
      artistId: hasArtistId ? Number(artPieceQueue.artistId) : undefined,
      latitude: hasLatitude ? Number(artPieceQueue.latitude) : undefined,
      longitude: hasLongitude ? Number(artPieceQueue.longitude) : undefined,

      // Optional fields
      ...(artPieceQueue.description ? { description: artPieceQueue.description } : {}),
      ...(artPieceQueue.city ? { city: artPieceQueue.city } : {}),
      ...(artPieceQueue.state ? { state: artPieceQueue.state } : {}),
      ...(artPieceQueue.cityId ? { cityId: Number(artPieceQueue.cityId) } : {}),
      ...(artPieceQueue.stateId ? { stateId: Number(artPieceQueue.stateId) } : {}),
      ...(artPieceQueue.countryId ? { countryId: Number(artPieceQueue.countryId) } : {}),
      ...(artPieceQueue.creationDate ? { creationDate: new Date(artPieceQueue.creationDate) } : {}),
      ...(artPieceQueue.installationDate
        ? { installationDate: new Date(artPieceQueue.installationDate) }
        : {}),

      // Transfer JSON fields for ArtPiece type, materials, and tags
      ...(hasArtPieceType ? { artPieceType: artPieceQueue.artPieceType } : {}),
      ...(hasArtPieceMaterial ? { artPieceMaterial: artPieceQueue.artPieceMaterial } : {}),
      ...(hasArtPieceTag ? { artPieceTag: artPieceQueue.artPieceTag } : {}),

      // Default values for required fields
      status: 'ACTIVE',
      viewCount: 0,
      featured: false,
    };

    // First run the schema validation
    const schemaValidation = createArtPieceSchema.safeParse(artPieceData);

    // Add custom validation for required fields that are optional in schema
    if (schemaValidation.success) {
      const customErrors = [];

      if (!hasArtPieceType) {
        customErrors.push({
          path: ['artPieceType'],
          message: 'At least one art piece type must be selected',
          code: 'custom',
        });
      }

      if (!hasArtPieceMaterial) {
        customErrors.push({
          path: ['artPieceMaterial'],
          message: 'At least one material must be selected',
          code: 'custom',
        });
      }

      if (!hasArtPieceTag) {
        customErrors.push({
          path: ['artPieceTag'],
          message: 'At least one tag must be selected',
          code: 'custom',
        });
      }

      if (customErrors.length > 0) {
        return {
          success: false,
          error: {
            errors: customErrors,
          },
        };
      }
    }

    return schemaValidation;
  }, [artPieceQueue]);

  /**
   * Handles converting the queue item to an ArtPiece
   */
  const handleConvertToArtPiece = async () => {
    if (!artPieceQueue || !validationResult.success) {
      toast.error('Cannot convert: validation errors exist');
      return;
    }

    if (artPieceQueue.status !== 'APPROVED') {
      toast.error('Queue item must be APPROVED before conversion');
      return;
    }

    setIsCreating(true);

    try {
      // Prepare data for ArtPiece creation - use validated data from validation result
      if (!validationResult.success) {
        throw new Error(
          'Validation failed: ' + validationResult.error.errors.map((e) => e.message).join(', ')
        );
      }

      const artPieceData = validationResult.data;

      // Create the ArtPiece
      const result = await createArtPiece(artPieceData);

      if (result && result.data && result.data.artPieceId) {
        // Update the queue item to PUBLISHED status and set artPieceId
        const queueUpdateData = {
          status: 'PUBLISHED',
          artPieceId: result.data.artPieceId,
        };

        await updateArtPieceQueue(artPieceQueue.artPieceQueueId, queueUpdateData);

        toast.success('ArtPiece created successfully!');

        // Call callbacks to refresh parent components
        if (onArtPieceCreated) {
          onArtPieceCreated(result.data);
        }
        if (onQueueUpdated) {
          onQueueUpdated({ ...artPieceQueue, ...queueUpdateData });
        }
      } else {
        throw new Error('Failed to create ArtPiece - no ID returned');
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtHarvesting.Queue.VerificationTab.ArtPieceQueueVerificationTab.handleConvertToArtPiece',
        'Error converting queue item to ArtPiece',
        error,
        {
          artPieceQueueId: artPieceQueue.artPieceQueueId,
          errorMessage: error.message,
        }
      );
      toast.error(`Failed to create ArtPiece: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Extract AI confidence data from extractedData
  const aiConfidence = useMemo(() => {
    if (!artPieceQueue?.extractedData) {
      return null;
    }

    // This would be based on your AI extraction structure
    const data = artPieceQueue.extractedData;
    return {
      title: data?.confidence?.title || 'Unknown',
      artistName: data?.confidence?.artistName || 'Unknown',
      location: data?.confidence?.location || 'Unknown',
      imageQuality: data?.confidence?.imageQuality || 'Unknown',
    };
  }, [artPieceQueue]);

  const isValid = validationResult.success;
  const validationErrors = validationResult.success ? [] : validationResult.error.errors;

  return (
    <Stack spacing={3}>
      {/* Validation Status */}
      <Box>
        <Typography variant="h6" gutterBottom>
          ArtPiece Validation Status
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Validation against ArtPiece creation requirements to determine if this queue item is ready
          to become an ArtPiece.
        </Typography>

        <Alert
          severity={isValid ? 'success' : 'error'}
          icon={<Iconify icon={isValid ? 'solar:check-circle-bold' : 'solar:close-circle-bold'} />}
        >
          <AlertTitle>
            {isValid ? 'Ready for ArtPiece Creation' : 'Validation Errors Found'}
          </AlertTitle>
          {isValid
            ? 'All required fields are valid and this queue item can be converted to an ArtPiece.'
            : `${validationErrors.length} validation error${validationErrors.length !== 1 ? 's' : ''} must be resolved before creating an ArtPiece.`}
        </Alert>

        {/* ArtPiece Conversion Button */}
        {isValid && artPieceQueue?.status === 'APPROVED' && (
          <Box sx={{ mt: 2 }}>
            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              loading={isCreating}
              startIcon={<Iconify icon="solar:add-circle-bold" />}
              onClick={handleConvertToArtPiece}
              sx={{
                minWidth: 200,
                bgcolor: 'success.main',
                '&:hover': {
                  bgcolor: 'success.dark',
                },
              }}
            >
              {isCreating ? 'Creating ArtPiece...' : 'Convert to ArtPiece'}
            </LoadingButton>
          </Box>
        )}

        {/* Status Requirements Info */}
        {isValid && artPieceQueue?.status !== 'APPROVED' && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info">
              <AlertTitle>Ready for Approval</AlertTitle>
              This queue item passes validation but requires APPROVED status before it can be
              converted to an ArtPiece. Current status:{' '}
              <Chip label={artPieceQueue?.status || 'Unknown'} size="small" />
            </Alert>
          </Box>
        )}

        {/* Already Published Info */}
        {artPieceQueue?.status === 'PUBLISHED' && artPieceQueue?.artPieceId && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success">
              <AlertTitle>Already Published</AlertTitle>
              This queue item has been converted to ArtPiece ID:{' '}
              <strong>{artPieceQueue.artPieceId}</strong>
            </Alert>
          </Box>
        )}

        {/* Validation Errors */}
        {!isValid && validationErrors.length > 0 && (
          <Card sx={{ mt: 2, p: 3, bgcolor: 'error.lighter' }}>
            <Typography variant="subtitle1" color="error.main" gutterBottom>
              <Iconify icon="solar:danger-bold" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Validation Errors
            </Typography>
            <Stack spacing={1}>
              {validationErrors.map((error, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Chip
                    label={error.path.join('.')}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="error.main">
                    {error.message}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        )}
      </Box>

      {/* AI Extraction Results */}
      <Box>
        <Typography variant="h6" gutterBottom>
          AI Extraction Results
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Confidence scores and quality metrics from the AI extraction process.
        </Typography>
        <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1">AI Confidence Scores</Typography>
            {aiConfidence ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">• Title Extraction:</Typography>
                  <Chip
                    label={aiConfidence.title}
                    size="small"
                    color={
                      aiConfidence.title === 'High'
                        ? 'success'
                        : aiConfidence.title === 'Medium'
                          ? 'warning'
                          : 'error'
                    }
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">• Artist Name:</Typography>
                  <Chip
                    label={aiConfidence.artistName}
                    size="small"
                    color={
                      aiConfidence.artistName === 'High'
                        ? 'success'
                        : aiConfidence.artistName === 'Medium'
                          ? 'warning'
                          : 'error'
                    }
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">• Location:</Typography>
                  <Chip
                    label={aiConfidence.location}
                    size="small"
                    color={
                      aiConfidence.location === 'High'
                        ? 'success'
                        : aiConfidence.location === 'Medium'
                          ? 'warning'
                          : 'error'
                    }
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">• Image Quality:</Typography>
                  <Chip
                    label={aiConfidence.imageQuality}
                    size="small"
                    color={
                      aiConfidence.imageQuality === 'Good'
                        ? 'success'
                        : aiConfidence.imageQuality === 'Fair'
                          ? 'warning'
                          : 'error'
                    }
                  />
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No AI confidence data available
              </Typography>
            )}
          </Stack>
        </Card>
      </Box>

      {/* Quick Summary */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Validation Summary
        </Typography>
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify
                icon={
                  artPieceQueue?.title && artPieceQueue.title.trim()
                    ? 'solar:check-circle-bold'
                    : 'solar:close-circle-bold'
                }
                sx={{
                  color:
                    artPieceQueue?.title && artPieceQueue.title.trim()
                      ? 'success.main'
                      : 'error.main',
                }}
              />
              <Typography variant="body2">
                Title:{' '}
                {artPieceQueue?.title && artPieceQueue.title.trim()
                  ? 'Present'
                  : 'Missing (Required)'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify
                icon={
                  artPieceQueue?.artistId && !isNaN(Number(artPieceQueue.artistId))
                    ? 'solar:check-circle-bold'
                    : 'solar:close-circle-bold'
                }
                sx={{
                  color:
                    artPieceQueue?.artistId && !isNaN(Number(artPieceQueue.artistId))
                      ? 'success.main'
                      : 'error.main',
                }}
              />
              <Typography variant="body2">
                Artist:{' '}
                {artPieceQueue?.artistId && !isNaN(Number(artPieceQueue.artistId))
                  ? 'Linked'
                  : 'Not linked (Required)'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify
                icon={
                  artPieceQueue?.latitude !== null &&
                  artPieceQueue?.latitude !== undefined &&
                  !isNaN(Number(artPieceQueue.latitude)) &&
                  artPieceQueue?.longitude !== null &&
                  artPieceQueue?.longitude !== undefined &&
                  !isNaN(Number(artPieceQueue.longitude))
                    ? 'solar:check-circle-bold'
                    : 'solar:close-circle-bold'
                }
                sx={{
                  color:
                    artPieceQueue?.latitude !== null &&
                    artPieceQueue?.latitude !== undefined &&
                    !isNaN(Number(artPieceQueue.latitude)) &&
                    artPieceQueue?.longitude !== null &&
                    artPieceQueue?.longitude !== undefined &&
                    !isNaN(Number(artPieceQueue.longitude))
                      ? 'success.main'
                      : 'error.main',
                }}
              />
              <Typography variant="body2">
                Location:{' '}
                {artPieceQueue?.latitude !== null &&
                artPieceQueue?.latitude !== undefined &&
                !isNaN(Number(artPieceQueue.latitude)) &&
                artPieceQueue?.longitude !== null &&
                artPieceQueue?.longitude !== undefined &&
                !isNaN(Number(artPieceQueue.longitude))
                  ? 'Present'
                  : 'Missing (Required)'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify
                icon={isValid ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                sx={{ color: isValid ? 'success.main' : 'error.main' }}
              />
              <Typography variant="body2">
                Overall Status: {isValid ? 'Ready for ArtPiece Creation' : 'Requires attention'}
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
}
