/**
 * @file art-piece-queue-image.jsx
 * @description Image gallery component for art piece queue items
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @author Generated
 * @version 1.0.0
 */

'use client';

import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog, debugError } from 'src/lib/debug';
import { useAttachImages } from 'src/actions/art-harvesting/hooks';

import { AddIcon } from 'src/components/icons';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { ArtPieceQueueImageAddDialog } from './art-piece-queue-image-add-dialog';

/**
 * ArtPieceQueueImage component
 * Displays a gallery of images from the artPieceQueue imageUrls array
 *
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue
 * @param {Object} props - Component props
 * @param {Object} props.artPieceQueue - Art piece queue data
 * @param {Array} props.artPieceQueue.imageUrls - Array of image URLs
 * @param {boolean} [props.allowAddImages=true] - Whether to show "Add Image" button
 * @param {Function} [props.onImageAdded] - Callback when image is added
 * @param {string} props.accessToken - Access token for API calls
 * @returns {JSX.Element} The image gallery component
 */
export function ArtPieceQueueImage({
  artPieceQueue,
  allowAddImages = true,
  onImageAdded,
  accessToken,
}) {
  const { imageUrls = [], status, artPieceId, title, artistName, imageUrl } = artPieceQueue;
  const addImageDialog = useBoolean();
  const [isAttaching, setIsAttaching] = useState(false);
  const attachImages = useAttachImages(accessToken);

  // Check if we can show the "Attach Images" button
  const canAttachImages = status === 'PUBLISHED' && artPieceId && imageUrls && imageUrls.length > 0;

  const handleAttachImages = async () => {
    if (!canAttachImages) return;

    setIsAttaching(true);
    try {
      const attachConfig = {
        artPieceId,
        artPieceTitle: title,
        artistName,
        imageUrl,
        imageUrls,
      };

      const result = await attachImages(attachConfig);

      debugLog(
        'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueImage.handleAttachImages',
        'Images attached successfully',
        { result, artPieceId, imageCount: imageUrls.length }
      );

      toast.success(
        `Successfully attached ${imageUrls.length} image${imageUrls.length !== 1 ? 's' : ''} to art piece!`
      );

      // Call success callback if provided
      if (onImageAdded && typeof onImageAdded === 'function') {
        onImageAdded(result);
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueImage.handleAttachImages',
        'Failed to attach images',
        {
          error: error.message,
          stack: error.stack,
          artPieceId,
          imageCount: imageUrls.length,
        }
      );
      toast.error(`Failed to attach images: ${error.message}`);
    } finally {
      setIsAttaching(false);
    }
  };

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Images</Typography>
          {allowAddImages && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={addImageDialog.onTrue}
            >
              Add Image
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
            bgcolor: 'grey.100',
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'grey.300',
            mb: canAttachImages ? 3 : 0,
          }}
        >
          <Stack spacing={1} alignItems="center">
            <Iconify icon="solar:gallery-broken" width={32} sx={{ color: 'grey.500' }} />
            <Typography variant="body2" color="text.secondary">
              No images available
            </Typography>
          </Stack>
        </Box>

        {/* Attach Images Button - Full Width at Bottom */}
        {canAttachImages && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            color="primary"
            startIcon={
              isAttaching ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Iconify icon="solar:upload-linear" />
              )
            }
            onClick={handleAttachImages}
            disabled={isAttaching}
            sx={{ mt: 2 }}
          >
            {isAttaching ? 'Attaching Images to Art Piece...' : 'Attach Images to Art Piece'}
          </Button>
        )}

        {/* Add Image Dialog */}
        <ArtPieceQueueImageAddDialog
          open={addImageDialog.value}
          onClose={addImageDialog.onFalse}
          artPieceQueue={artPieceQueue}
          onSuccess={(result) => {
            addImageDialog.onFalse();
            if (onImageAdded && typeof onImageAdded === 'function') {
              onImageAdded(result);
            }
          }}
        />
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Images ({imageUrls.length})</Typography>
        {allowAddImages && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={addImageDialog.onTrue}
          >
            Add Image
          </Button>
        )}
      </Stack>

      <Grid container spacing={2} sx={{ mb: canAttachImages ? 3 : 0 }}>
        {imageUrls.map((imgUrl, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ImageItem imageUrl={imgUrl} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Attach Images Button - Full Width at Bottom */}
      {canAttachImages && (
        <Button
          variant="contained"
          fullWidth
          size="large"
          color="primary"
          startIcon={
            isAttaching ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Iconify icon="solar:upload-linear" />
            )
          }
          onClick={handleAttachImages}
          disabled={isAttaching}
          sx={{ mt: 2 }}
        >
          {isAttaching
            ? 'Attaching Images to Art Piece...'
            : `Attach ${imageUrls.length} Image${imageUrls.length !== 1 ? 's' : ''} to Art Piece`}
        </Button>
      )}

      {/* Add Image Dialog */}
      <ArtPieceQueueImageAddDialog
        open={addImageDialog.value}
        onClose={addImageDialog.onFalse}
        artPieceQueue={artPieceQueue}
        onSuccess={(result) => {
          addImageDialog.onFalse();
          if (onImageAdded && typeof onImageAdded === 'function') {
            onImageAdded(result);
          }
        }}
      />
    </Card>
  );
}

/**
 * Individual image item component
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - Image URL
 * @param {number} props.index - Image index
 * @returns {JSX.Element} The image item component
 */
function ImageItem({ imageUrl, index }) {
  const lightbox = useBoolean();
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
    <>
      <Card
        sx={{
          position: 'relative',
          cursor: imageError ? 'default' : 'pointer',
          '&:hover': !imageError && {
            boxShadow: (theme) => theme.customShadows.z8,
          },
        }}
        onClick={!imageError ? lightbox.onTrue : undefined}
      >
        <Box sx={{ position: 'relative', paddingTop: '75%' }}>
          {!imageError && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`Queue image ${index + 1}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
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
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                  }}
                >
                  <Stack spacing={1} alignItems="center">
                    <Iconify
                      icon="svg-spinners:3-dots-bounce"
                      width={24}
                      sx={{ color: 'grey.500' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Loading...
                    </Typography>
                  </Stack>
                </Box>
              )}
            </>
          )}

          {imageError && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: 1,
                border: '1px dashed',
                borderColor: 'grey.300',
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Iconify icon="solar:image-broken" width={32} sx={{ color: 'grey.500' }} />
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  Image blocked by source
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  textAlign="center"
                  sx={{ fontSize: '0.7rem' }}
                >
                  Site prevents hotlinking
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Image overlay with index */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
          }}
        >
          #{index + 1}
        </Box>

        {/* Expand icon */}
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
          size="small"
        >
          <Iconify icon="solar:expand-bold" width={16} />
        </IconButton>
      </Card>

      {/* Lightbox dialog */}
      {lightbox.value && (
        <ImageLightbox imageUrl={imageUrl} index={index} onClose={lightbox.onFalse} />
      )}
    </>
  );
}

/**
 * Lightbox component for full-screen image viewing
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - Image URL
 * @param {number} props.index - Image index
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} The lightbox component
 */
function ImageLightbox({ imageUrl, index, onClose }) {
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={onClose}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <Iconify icon="solar:close-circle-bold" width={32} />
      </IconButton>

      <Box
        sx={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!imageError && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`Queue image ${index + 1} - Full view`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
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
                  color: 'white',
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <Iconify icon="svg-spinners:3-dots-bounce" width={48} sx={{ color: 'white' }} />
                  <Typography variant="body1" color="white">
                    Loading image...
                  </Typography>
                </Stack>
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
              minWidth: '400px',
              minHeight: '300px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Iconify icon="solar:image-broken" width={64} sx={{ color: 'grey.400' }} />
              <Typography variant="h6" color="white" textAlign="center">
                Image cannot be displayed
              </Typography>
              <Typography variant="body2" color="grey.300" textAlign="center">
                This image is blocked by the source website and cannot be viewed directly.
              </Typography>
              <Typography variant="caption" color="grey.400" textAlign="center">
                Try opening the source URL to view the image on its original site.
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Image info */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          color: 'white',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          px: 2,
          py: 1,
          borderRadius: 1,
        }}
      >
        <Typography variant="body2">Image #{index + 1}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {imageUrl}
        </Typography>
      </Box>
    </Box>
  );
}

ArtPieceQueueImage.propTypes = {
  artPieceQueue: PropTypes.shape({
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  allowAddImages: PropTypes.bool,
  onImageAdded: PropTypes.func,
  accessToken: PropTypes.string.isRequired,
};

ImageItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

ImageLightbox.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};
