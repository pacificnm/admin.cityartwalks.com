/**
 * @namespace CityArtWalks.Components.Image.ImageViewDialog
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Dialog component for viewing complete image details with metadata, relations, and actions.
 */

'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fData } from 'src/utils/format-number';
import {
  getImageInfo,
  extractBlobUrlInfo,
  getMimeTypeFromExtension,
} from 'src/utils/vercel-blob-utils';

import { useDeleteImage, useGetImageById } from 'src/actions/image/hooks';

import { Label } from 'src/components/label';
import { UserBadge } from 'src/components/user';
import { Iconify } from 'src/components/iconify';
import { EditIcon, ViewIcon, CloseIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

import { ImageUpdateDialog } from './image-update-dialog';
import { ImageDialogDelete } from './image-dialog-delete';

/**
 * @memberof CityArtWalks.Components.Image.ImageViewDialog
 * @function ImageViewDialog
 * @description Dialog component for viewing complete image details including metadata, relations, and technical information.
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback to close the dialog
 * @param {number} props.imageId - The ID of the image to display
 * @returns {JSX.Element} The rendered ImageViewDialog component
 */
export function ImageViewDialog({ open, onClose, imageId, onUpdate, onDelete }) {
  const { accessToken } = useAuthContext();
  const [blobInfo, setBlobInfo] = useState({});
  const [imageInfo, setImageInfo] = useState({});
  const [loadingImageInfo, setLoadingImageInfo] = useState(false);

  // Dialog states
  const editDialog = useBoolean();
  const deleteDialog = useBoolean();

  // Only fetch image data if imageId is valid and dialog is open
  const shouldFetch = open && imageId && !isNaN(parseInt(imageId));

  // Fetch image data
  const { image, imageLoading, imageError, mutateImage } = useGetImageById(
    shouldFetch ? imageId : null,
    accessToken || ''
  );

  // Delete image hook
  const deleteImage = useDeleteImage(accessToken || '');

  // Extract blob information when image data changes
  useEffect(() => {
    if (image?.url) {
      const info = extractBlobUrlInfo(image.url);
      setBlobInfo(info);

      // Get image dimensions if it's an image
      if (info.extension && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(info.extension)) {
        setLoadingImageInfo(true);
        getImageInfo(image.url).then((imgInfo) => {
          setImageInfo(imgInfo);
          setLoadingImageInfo(false);
        });
      }
    }
  }, [image?.url]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleEdit = () => {
    editDialog.onTrue();
  };

  const handleDelete = () => {
    deleteDialog.onTrue();
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteImage(id);

      // Refresh image list if callback provided
      if (onDelete) {
        onDelete(id);
      }

      // Close all dialogs
      deleteDialog.onFalse();
      handleClose();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const handleUpdateSuccess = (updatedData) => {
    // Refresh image data
    mutateImage();

    // Call parent callback if provided
    if (onUpdate) {
      onUpdate(updatedData);
    }

    editDialog.onFalse();
  };

  const renderImagePreview = () => (
    <Card sx={{ mb: 3 }}>
      <Box
        sx={{
          position: 'relative',
          paddingTop: '56.25%', // 16:9 aspect ratio
          overflow: 'hidden',
        }}
      >
        {image?.url && (
          <Image
            src={image.url}
            fill
            alt={image.caption || 'Image'}
            style={{ objectFit: 'cover' }}
          />
        )}
      </Box>
      {image?.caption && (
        <CardContent>
          <Typography variant="h6">{image.caption}</Typography>
        </CardContent>
      )}
    </Card>
  );

  const renderImageMetadata = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Image Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Label
              variant="soft"
              color={
                (image?.status === 'ACTIVE' && 'success') ||
                (image?.status === 'PENDING' && 'warning') ||
                (image?.status === 'INACTIVE' && 'error') ||
                'default'
              }
            >
              {image?.status || 'Unknown'}
            </Label>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Featured
            </Typography>
            <Chip
              size="small"
              label={image?.featured ? 'Yes' : 'No'}
              color={image?.featured ? 'primary' : 'default'}
              variant={image?.featured ? 'filled' : 'outlined'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              View Count
            </Typography>
            <Typography variant="body1">{image?.viewCount || 0}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              File Size
            </Typography>
            <Typography variant="body1">
              {image?.fileSize ? fData(image.fileSize) : 'Unknown'}
            </Typography>
          </Grid>
          {/* Dimensions from database or extracted from image */}
          {(image?.width && image?.height) ||
          (imageInfo?.naturalWidth && imageInfo?.naturalHeight) ? (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Dimensions
                {loadingImageInfo && <CircularProgress size={12} sx={{ ml: 1 }} />}
              </Typography>
              <Typography variant="body1">
                {image?.width && image?.height
                  ? `${image.width} × ${image.height} px`
                  : imageInfo?.naturalWidth && imageInfo?.naturalHeight
                    ? `${imageInfo.naturalWidth} × ${imageInfo.naturalHeight} px`
                    : 'Loading...'}
              </Typography>
              {imageInfo?.aspectRatio && (
                <Typography variant="caption" color="text.secondary">
                  Aspect ratio: {imageInfo.aspectRatio.toFixed(2)}:1
                </Typography>
              )}
            </Grid>
          ) : null}

          {/* MIME Type from database or extracted from file extension */}
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              File Type
            </Typography>
            <Typography variant="body1">
              {image?.mimeType ||
                (blobInfo?.extension ? getMimeTypeFromExtension(blobInfo.extension) : 'Unknown')}
            </Typography>
          </Grid>

          {/* Original filename from blob URL */}
          {blobInfo?.originalFilename && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Original Filename
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                {blobInfo.originalFilename}
                {blobInfo.extension && `.${blobInfo.extension}`}
              </Typography>
            </Grid>
          )}

          {/* File extension */}
          {blobInfo?.extension && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                File Extension
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
                {blobInfo.extension}
              </Typography>
            </Grid>
          )}

          {/* Blob hash/ID */}
          {blobInfo?.blobHash && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Blob Hash
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  wordBreak: 'break-all',
                }}
              >
                {blobInfo.blobHash}
              </Typography>
            </Grid>
          )}

          {/* Storage provider */}
          {blobInfo?.isVercelBlob && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Storage Provider
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1">Vercel Blob</Typography>
                <Chip size="small" label="CDN" color="info" variant="outlined" />
              </Stack>
            </Grid>
          )}

          {/* Vercel Blob Browser Link */}
          {blobInfo?.isVercelBlob && image?.url && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Blob Storage
              </Typography>
              <Link
                href={`https://vercel.com/pdxartwalks-projects/cityartwalks-com/stores/blob/store_0wFfK7GP4DMp1U2g/browser?file_url=${encodeURIComponent(image.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <Iconify icon="solar:link-bold" width={16} />
                <Typography variant="body2">View in Vercel</Typography>
              </Link>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderRelations = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Relations
        </Typography>
        <Stack spacing={2}>
          {image?.Artist && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Artist
              </Typography>
              <Link
                href={paths.art.artist.details(image.Artist.slug)}
                underline="hover"
                color="primary"
                sx={{ fontWeight: 'medium' }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:user-bold" width={16} />
                  <Typography variant="body1">{image.Artist.name}</Typography>
                </Stack>
              </Link>
            </Box>
          )}
          {image?.ArtPiece && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Art Piece
              </Typography>
              <Link
                href={paths.art.artist.artwork.details(
                  image.ArtPiece.Artist.slug,
                  image.ArtPiece.slug
                )}
                underline="hover"
                color="primary"
                sx={{ fontWeight: 'medium' }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:gallery-bold" width={16} />
                  <Typography variant="body1">{image.ArtPiece.title}</Typography>
                </Stack>
              </Link>
            </Box>
          )}
          {image?.Path && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Path
              </Typography>
              <Link
                href={paths.dashboard.paths.details(image.Path.pathId)}
                underline="hover"
                color="primary"
                sx={{ fontWeight: 'medium' }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:map-point-bold" width={16} />
                  <Typography variant="body1">{image.Path.name}</Typography>
                </Stack>
              </Link>
            </Box>
          )}
          {!image?.Artist && !image?.ArtPiece && !image?.Path && (
            <Typography variant="body2" color="text.disabled">
              No relations found
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  const renderModerationDetails = () => {
    const hasModerationData =
      image?.flaggedAt ||
      image?.moderatedAt ||
      image?.status === 'FLAGGED' ||
      image?.status === 'REMOVED';

    if (!hasModerationData) return null;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Moderation Details
          </Typography>
          <Grid container spacing={2}>
            {(image?.status === 'FLAGGED' || image?.status === 'REMOVED') && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Moderation Status
                </Typography>
                <Label
                  variant="soft"
                  color={
                    (image?.status === 'FLAGGED' && 'warning') ||
                    (image?.status === 'REMOVED' && 'error') ||
                    'default'
                  }
                >
                  {image?.status || 'Unknown'}
                </Label>
              </Grid>
            )}
            {image?.flaggedAt && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Flagged At
                </Typography>
                <Typography variant="body1">{fDate(image.flaggedAt)}</Typography>
              </Grid>
            )}
            {image?.flaggedBy && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Flagged By
                </Typography>
                <UserBadge userId={image.flaggedBy} size="small" />
              </Grid>
            )}
            {image?.FlaggedByUser && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Flagged By User
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:user-bold" width={16} />
                  <Typography variant="body1">{image.FlaggedByUser.name}</Typography>
                </Stack>
              </Grid>
            )}
            {image?.flagReason && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Flag Reason
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    p: 1,
                    bgcolor: 'warning.lighter',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'warning.light',
                  }}
                >
                  {image.flagReason}
                </Typography>
              </Grid>
            )}
            {image?.moderatedAt && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Moderated At
                </Typography>
                <Typography variant="body1">{fDate(image.moderatedAt)}</Typography>
              </Grid>
            )}
            {image?.moderatedBy && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Moderated By
                </Typography>
                <UserBadge userId={image.moderatedBy} size="small" />
              </Grid>
            )}
            {image?.moderationNotes && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Moderation Notes
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    p: 1,
                    bgcolor: 'info.lighter',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'info.light',
                  }}
                >
                  {image.moderationNotes}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderTimestamps = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Timestamps & Users
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {image?.createdAt ? fDate(image.createdAt) : 'Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Updated At
            </Typography>
            <Typography variant="body1">
              {image?.updatedAt ? fDate(image.updatedAt) : 'Unknown'}
            </Typography>
          </Grid>
          {image?.uploadedAt && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Uploaded At
              </Typography>
              <Typography variant="body1">{fDate(image.uploadedAt)}</Typography>
            </Grid>
          )}
          {image?.createdBy && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created By
              </Typography>
              <UserBadge userId={image.createdBy} size="small" />
            </Grid>
          )}
          {image?.updatedBy && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Updated By
              </Typography>
              <UserBadge userId={image.updatedBy} size="small" />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (!shouldFetch) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Invalid Image ID
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No valid image ID provided.
          </Typography>
        </Box>
      );
    }

    if (imageLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (imageError || !image) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load image
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The image could not be found or there was an error loading it.
          </Typography>
        </Box>
      );
    }

    return (
      <>
        {renderImagePreview()}
        {renderImageMetadata()}
        {renderRelations()}
        {renderModerationDetails()}
        {renderTimestamps()}
      </>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ pr: 6 }}>
          <ViewIcon width={24} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Image Details
          </Typography>
          {image && (
            <Typography variant="body2" color="text.secondary">
              ID: {image.imageId}
            </Typography>
          )}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon size={24} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>{renderContent()}</DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-minimalistic-bold" width={20} />}
          onClick={handleDelete}
          disabled={!image}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon width={20} />}
          onClick={handleEdit}
          disabled={!image}
        >
          Edit
        </Button>
        <Button variant="contained" onClick={handleClose} startIcon={<CloseIcon size={20} />}>
          Close
        </Button>
      </DialogActions>

      {/* Update Dialog */}
      <ImageUpdateDialog
        open={editDialog.value}
        onClose={editDialog.onFalse}
        onSuccess={handleUpdateSuccess}
        imageId={imageId}
      />

      {/* Delete Dialog */}
      <ImageDialogDelete
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        onDelete={handleDeleteConfirm}
        imageId={imageId}
        filename={image?.caption || 'Image'}
      />
    </Dialog>
  );
}
