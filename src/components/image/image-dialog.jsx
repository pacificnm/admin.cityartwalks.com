'use client';

import Image from 'next/image';
import * as React from 'react';
import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { debugLog, debugError } from 'src/lib/debug';
import { incrementImageViewCount } from 'src/actions/image/requests';

import { CloseIcon } from 'src/components/icons';
import { ReviewCardList } from 'src/components/review/review-card-list';

import { ImageMetadata } from './image-metadata';

/**
 * Transition component for sliding the dialog in from the bottom.
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * ImageDialog displays a full-screen dialog with an image and its reviews.
 *
 * @param {Object} props - The component props.
 * @param {string} props.url - The image URL.
 * @param {string} [props.alt] - The image alt text.
 * @param {number} [props.width] - The image width (defaults to 800).
 * @param {number} [props.height] - The image height (defaults to 600).
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Function to close the dialog.
 * @param {number} [props.imageId] - The image ID for loading reviews.
 * @param {string} [props.caption] - The image caption.
 * @param {string} [props.photographer] - The photographer name.
 * @param {number} [props.createdBy] - The user ID who created the image.
 * @param {string} [props.createdAt] - The image creation timestamp.
 * @param {number} [props.viewCount] - The image view count.
 * @param {string} [props.type] - The MIME type of the image.
 * @param {number} [props.width] - The image width in pixels.
 * @param {number} [props.height] - The image height in pixels.
 * @param {number} [props.fileSize] - The file size in bytes.
 * @returns {JSX.Element} The rendered component.
 */
export function ImageDialog({
  url,
  alt,
  width = 800,
  height = 600,
  open,
  onClose,
  imageId,
  caption,
  photographer,
  createdBy,
  createdAt,
  viewCount,
  type,
  imageWidth,
  imageHeight,
  fileSize,
}) {
  const hasIncrementedView = useRef(false);

  // Increment view count when dialog opens
  useEffect(() => {
    if (open && imageId && !hasIncrementedView.current) {
      const incrementViewCount = async () => {
        try {
          debugLog('ImageDialog.incrementViewCount', 'Incrementing view count', { imageId });

          // Use the public view count increment endpoint
          const response = await incrementImageViewCount(imageId);
          hasIncrementedView.current = true;

          debugLog('ImageDialog.incrementViewCount', 'View count incremented successfully', {
            imageId,
            oldViewCount: viewCount,
            newViewCount: response.data?.viewCount,
          });
        } catch (error) {
          debugError('ImageDialog.incrementViewCount', 'Failed to increment view count', error);
          // Don't show user error for view count failures as it's not critical
        }
      };

      incrementViewCount();
    }

    // Reset the flag when dialog closes
    if (!open) {
      hasIncrementedView.current = false;
    }
  }, [open, imageId, viewCount]);

  const closeDialog = () => {
    onClose(false);
  };

  return (
    <Dialog fullScreen open={open} onClose={closeDialog} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {alt || caption || 'Image'}
          </Typography>
          <IconButton edge="end" onClick={closeDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 0 }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Image Display */}
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              bgcolor: 'grey.100',
            }}
          >
            <Image
              src={url}
              alt={alt || caption || 'Image'}
              width={width}
              height={height}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                width: 'auto',
                height: 'auto',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Grid>

          {/* Reviews Panel */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              borderLeft: { md: 1 },
              borderColor: { md: 'divider' },
              height: { md: 'calc(100vh - 64px)' },
              overflow: 'auto',
            }}
          >
            {imageId && (
              <Box sx={{ p: 3 }}>
                <ImageMetadata
                  imageId={imageId}
                  createdAt={createdAt}
                  width={imageWidth}
                  height={imageHeight}
                  fileSize={fileSize}
                  viewCount={viewCount}
                  type={type}
                  sx={{ mb: 3 }}
                />
                <ReviewCardList
                  filters={{
                    imageId: imageId?.toString() || '',
                    status: 'ACTIVE',
                  }}
                  pageSize={5}
                  compact
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
