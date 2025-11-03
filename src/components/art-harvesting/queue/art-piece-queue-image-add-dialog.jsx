/**
 * @file art-piece-queue-image-add-dialog.jsx
 * @description Dialog component for adding additional images to art piece queue items
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @author Generated
 * @version 1.0.0
 */

'use client';

import { z } from 'zod';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugError } from 'src/lib/debug';
import { useUpdateArtPieceQueue } from 'src/actions/art-piece-queue/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { AddIcon, CloseIcon } from 'src/components/icons';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useAuthContext } from 'src/auth/hooks';

// Validation schema for adding images
const addImageSchema = z.object({
  imageUrl: z
    .string()
    .min(1, 'Image URL is required')
    .url('Please enter a valid URL')
    .refine((url) => {
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
      return imageExtensions.test(url) || url.includes('images') || url.includes('photo');
    }, 'URL should point to an image file'),
});

/**
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue.ImageManagement
 * @function ImagePreview
 * @description Image preview component with error handling and loading states.
 * Displays image previews with graceful fallbacks for blocked or failed images.
 *
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - URL of the image to preview
 * @returns {JSX.Element} The rendered image preview component
 */
function ImagePreview({ imageUrl }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 300,
        height: 200,
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'grey.100',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!imageError && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && (
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Iconify icon="svg-spinners:3-dots-bounce" width={24} sx={{ color: 'grey.500' }} />
              <Typography variant="caption" color="text.secondary">
                Loading preview...
              </Typography>
            </Box>
          )}
        </>
      )}

      {imageError && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            gap: 1,
            p: 2,
          }}
        >
          <Iconify icon="solar:image-broken" width={32} sx={{ color: 'grey.500' }} />
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Image blocked by source
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            textAlign="center"
            sx={{ fontSize: '0.65rem' }}
          >
            Will be saved but may not display
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue.ImageManagement
 * @function ArtPieceQueueImageAddDialog
 * @description Dialog component for adding additional images to art piece queue items.
 * Provides interface for adding image URLs with validation and preview functionality.
 * Supports bulk image management and URL validation with image format checking.
 *
 * Features:
 * - URL validation with image format detection
 * - Image preview before adding
 * - Bulk image URL management
 * - Real-time validation feedback
 * - Integration with queue update hooks
 * - Automatic queue data synchronization
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @param {Object} props.artPieceQueue - The art piece queue object to update
 * @param {number} props.artPieceQueue.artPieceQueueId - Queue item ID
 * @param {string[]} [props.artPieceQueue.imageUrls] - Current image URLs array
 * @param {Function} [props.onSuccess] - Callback when image is successfully added
 * @returns {JSX.Element} The rendered image add dialog component
 *
 * @example
 * <ArtPieceQueueImageAddDialog
 *   open={dialogOpen}
 *   onClose={handleClose}
 *   artPieceQueue={queueItem}
 *   onSuccess={handleImageAdded}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Harvesting} - Art harvesting pipeline documentation
 */
export function ArtPieceQueueImageAddDialog({ open, onClose, artPieceQueue, onSuccess }) {
  const { accessToken } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const confirmDialog = useBoolean();
  const updateArtPieceQueue = useUpdateArtPieceQueue(accessToken);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(addImageSchema),
    defaultValues: {
      imageUrl: '',
    },
  });

  const imageUrl = watch('imageUrl');

  /**
   * Handles form submission to add new image URL
   */
  const onSubmit = useCallback(
    async (data) => {
      if (!artPieceQueue?.artPieceQueueId) {
        toast.error('No queue item selected');
        return;
      }

      try {
        setIsSubmitting(true);

        // Get current imageUrls array or initialize as empty array
        const currentImageUrls = artPieceQueue.imageUrls || [];

        // Check if URL already exists
        if (currentImageUrls.includes(data.imageUrl)) {
          toast.warning('This image URL is already in the list');
          return;
        }

        // Add new URL to the array
        const updatedImageUrls = [...currentImageUrls, data.imageUrl];

        // Update the art piece queue with new imageUrls array
        const updateData = {
          ...artPieceQueue,
          imageUrls: updatedImageUrls,
        };

        const result = await updateArtPieceQueue(artPieceQueue.artPieceQueueId, updateData);

        if (result) {
          toast.success('Image URL added successfully!');
          reset();
          onClose();

          // Call success callback if provided
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(result);
          }
        }
      } catch (error) {
        debugError(
          'CityArtWalks.Components.ArtHarvesting.Queue.ImageManagement.ArtPieceQueueImageAddDialog.onSubmit',
          'Failed to add image URL to queue',
          error,
          {
            artPieceQueueId: artPieceQueue.artPieceQueueId,
            imageUrl: data.imageUrl,
            errorMessage: error.message,
          }
        );
        toast.error(`Failed to add image URL: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [artPieceQueue, updateArtPieceQueue, reset, onClose, onSuccess]
  );

  /**
   * Handles dialog close and form reset
   */
  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  /**
   * Handles removing an image from the imageUrls array
   */
  const handleRemoveImage = useCallback(
    (indexToRemove) => {
      if (!artPieceQueue?.artPieceQueueId) {
        toast.error('No queue item selected');
        return;
      }

      // Get current imageUrls array
      const currentImageUrls = artPieceQueue.imageUrls || [];

      if (indexToRemove < 0 || indexToRemove >= currentImageUrls.length) {
        toast.error('Invalid image index');
        return;
      }

      // Store the image info and show confirm dialog
      setImageToDelete({
        index: indexToRemove,
        url: currentImageUrls[indexToRemove],
      });
      confirmDialog.onTrue();
    },
    [artPieceQueue, confirmDialog]
  );

  /**
   * Performs the actual image deletion after confirmation
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!imageToDelete || !artPieceQueue?.artPieceQueueId) {
      return;
    }

    try {
      // Get current imageUrls array
      const currentImageUrls = artPieceQueue.imageUrls || [];

      // Remove the image at the specified index
      const updatedImageUrls = currentImageUrls.filter((_, index) => index !== imageToDelete.index);

      // Update the art piece queue with new imageUrls array
      const updateData = {
        ...artPieceQueue,
        imageUrls: updatedImageUrls,
      };

      const result = await updateArtPieceQueue(artPieceQueue.artPieceQueueId, updateData);

      if (result) {
        toast.success('Image removed successfully!');

        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(result);
        }
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtHarvesting.Queue.ImageManagement.ArtPieceQueueImageAddDialog.handleConfirmDelete',
        'Failed to remove image from queue',
        error,
        {
          artPieceQueueId: artPieceQueue.artPieceQueueId,
          imageIndex: imageToDelete.index,
          imageUrl: imageToDelete.url,
          errorMessage: error.message,
        }
      );
      toast.error(`Failed to remove image: ${error.message}`);
    } finally {
      confirmDialog.onFalse();
      setImageToDelete(null);
    }
  }, [imageToDelete, artPieceQueue, updateArtPieceQueue, onSuccess, confirmDialog]);

  /**
   * Handles keyboard events in dialog
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      maxWidth="md"
      fullWidth
      aria-labelledby="add-image-dialog-title"
    >
      <DialogTitle
        id="add-image-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
        }}
      >
        Add Image URL
        <IconButton
          onClick={handleClose}
          aria-label="Close dialog"
          sx={{
            color: 'grey.500',
            '&:hover': {
              color: 'grey.700',
              backgroundColor: 'grey.100',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pb: 2 }}>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Add an additional image URL to this queue item. The image will be displayed in the
              image gallery.
            </Typography>

            <TextField
              {...register('imageUrl')}
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              fullWidth
              error={!!errors.imageUrl}
              helperText={errors.imageUrl?.message}
              multiline
              rows={2}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                },
              }}
            />

            {/* Image Preview */}
            {imageUrl && !errors.imageUrl && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Preview:
                </Typography>
                <ImagePreview imageUrl={imageUrl} />
              </Box>
            )}

            {/* Current Images */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Current Images ({artPieceQueue?.imageUrls?.length || 0})
              </Typography>

              {artPieceQueue?.imageUrls?.length > 0 ? (
                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 2, display: 'block' }}
                  >
                    This will be image #{artPieceQueue.imageUrls.length + 1}
                  </Typography>

                  <Stack spacing={1} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {artPieceQueue.imageUrls.map((url, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          bgcolor: 'white',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'grey.200',
                        }}
                      >
                        {/* Thumbnail */}
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            overflow: 'hidden',
                            bgcolor: 'grey.100',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <Box
                            sx={{
                              display: 'none',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                            }}
                          >
                            <Iconify
                              icon="solar:image-broken"
                              width={20}
                              sx={{ color: 'grey.500' }}
                            />
                          </Box>
                        </Box>

                        {/* Image info and link */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            Image #{index + 1}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontSize: '0.75rem',
                              color: 'primary.main',
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                            component="a"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {url}
                          </Typography>
                        </Box>

                        {/* External link icon */}
                        <IconButton
                          size="small"
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            color: 'grey.500',
                            '&:hover': { color: 'primary.main' },
                          }}
                        >
                          <Iconify icon="solar:link-outline" width={16} />
                        </IconButton>

                        {/* Delete button */}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          sx={{
                            color: 'grey.500',
                            '&:hover': {
                              color: 'error.main',
                              backgroundColor: 'error.50',
                            },
                          }}
                        >
                          <Iconify icon="solar:trash-bin-minimalistic-bold" width={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No images yet. This will be the first image.
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !imageUrl || !!errors.imageUrl}
            startIcon={isSubmitting ? <Iconify icon="line-md:loading-loop" /> : <AddIcon />}
          >
            {isSubmitting ? 'Adding...' : 'Add Image'}
          </Button>
        </DialogActions>
      </form>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Remove Image"
        content={
          imageToDelete ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to remove image #{imageToDelete.index + 1}?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                {imageToDelete.url.length > 80
                  ? `${imageToDelete.url.substring(0, 80)}...`
                  : imageToDelete.url}
              </Typography>
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                This action cannot be undone.
              </Typography>
            </Box>
          ) : (
            'Are you sure you want to remove this image?'
          )
        }
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Remove Image
          </Button>
        }
      />
    </Dialog>
  );
}

ImagePreview.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};

ArtPieceQueueImageAddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  artPieceQueue: PropTypes.shape({
    artPieceQueueId: PropTypes.number.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onSuccess: PropTypes.func,
};
