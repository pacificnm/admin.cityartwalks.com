/**
 * @namespace CityArtWalks.Components.Image.ImageCard
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Image card component that displays image with metadata, actions, and review capabilities.
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Image-Components} - Component documentation
 */

'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog } from 'src/lib/debug';

import { UserBadge } from 'src/components/user/user-badge';
import ErrorBoundary from 'src/components/error/error-boundary';
import { ImageDialog } from 'src/components/image/image-dialog';

import { ImageCaption } from './image-caption';
import { ImageMetadata } from './image-metadata';
import { ImageStatusBadge } from './image-status-badge';
import { ImageCardActions } from './image-card-actions';
import { ImageReviewSummary } from './image-review-summary';
import { ImageFeaturedBadge } from './image-featured-badge';

/**
 * @memberof CityArtWalks.Components.Image.ImageCard
 * @function ImageCard
 * @description Displays an image card with metadata, actions, and review summary.
 * Includes flagging capability for moderation and review integration.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.imageId - The unique ID of the image.
 * @param {string} props.url - The URL of the image.
 * @param {string} props.filename - The original filename.
 * @param {string} props.type - The MIME type of the image.
 * @param {string} props.caption - Optional caption for the image.
 * @param {string} props.status - The status of the image (ACTIVE, FLAGGED, etc.).
 * @param {boolean} props.featured - Whether the image is featured.
 * @param {number} props.viewCount - Number of views.
 * @param {string} props.createdAt - The upload timestamp.
 * @param {number} props.createdBy - The user ID who uploaded the image.
 * @param {number} [props.width] - The image width in pixels.
 * @param {number} [props.height] - The image height in pixels.
 * @param {number} [props.fileSize] - The file size in bytes.
 * @param {Array} [props.reviews=[]] - Array of reviews for the image.
 * @param {Function} [props.onDelete] - Callback for delete action.
 * @param {Function} [props.onFlag] - Callback for flag action.
 * @param {Function} [props.onFavorite] - Callback for favorite action.
 * @param {Function} [props.onReview] - Callback for review action.
 * @returns {JSX.Element} The rendered ImageCard component.
 *
 * @example
 * <ImageCard
 *   imageId={123}
 *   url="https://example.com/image.jpg"
 *   filename="sunset.jpg"
 *   type="image/jpeg"
 *   caption="Beautiful sunset"
 *   status="ACTIVE"
 *   featured={false}
 *   viewCount={150}
 *   createdAt="2025-01-01T00:00:00Z"
 *   createdBy={456}
 *   reviews={[]}
 *   favoriteCount={10}
 *   isFavorite={false}
 *   onDelete={handleDelete}
 *   onFlag={handleFlag}
 *   onFavorite={handleFavorite}
 *   onReview={handleReview}
 * />
 */
export function ImageCard(props) {
  const {
    imageId,
    url,
    filename,
    type,
    caption,
    status,
    featured,
    viewCount = 0,
    createdAt,
    createdBy,
    width,
    height,
    fileSize,
    reviews = [],
    onDelete,
    onFlag,
    onFavorite,
    onReview,
    ...other
  } = props;

  const viewDialog = useBoolean();

  /**
   * @memberof CityArtWalks.Components.Image.ImageCard
   * @function handleImageClick
   * @description Handles click on the image to open the full-screen dialog.
   * @private
   */
  const handleImageClick = () => {
    debugLog('CityArtWalks.Components.Image.ImageCard.handleImageClick', 'Opening image dialog', {
      imageId,
      filename,
    });
    viewDialog.onTrue();
  };

  return (
    <ErrorBoundary>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        data-cy="image-card"
        {...other}
      >
        {/* Status Badge */}
        <ImageStatusBadge status={status} />

        {/* Featured Badge */}
        <ImageFeaturedBadge featured={featured} />

        {/* Image */}
        <Box
          onClick={handleImageClick}
          sx={{
            position: 'relative',
            height: 250,
            cursor: 'pointer',
            overflow: 'hidden',
            '&:hover img': {
              transform: 'scale(1.02)',
            },
          }}
        >
          <Image
            src={url || '/assets/images/mock/cover/cover-1.webp'}
            alt={caption || filename}
            width={400}
            height={250}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.2s ease-in-out',
              width: '100%',
              height: '100%',
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 0 }}>
          {/* Filename and Type */}
          <Typography variant="subtitle1" noWrap gutterBottom>
            {filename}
          </Typography>

          {/* Caption */}
          <ImageCaption caption={caption} />

          {/* Metadata */}
          <ImageMetadata createdAt={createdAt} viewCount={viewCount} type={type} />

          {/* User Badge */}
          <UserBadge userId={createdBy} size="small" showMemberSince={false} sx={{ mb: 2 }} />

          {/* Review Summary */}
          <ImageReviewSummary reviews={reviews} />
        </CardContent>

        <Divider />

        {/* Actions */}
        <ImageCardActions
          imageId={imageId}
          caption={caption || filename}
          createdBy={createdBy}
          viewDialog={viewDialog}
          onDelete={onDelete}
          onFlag={onFlag}
          onFavorite={onFavorite}
          onReview={onReview}
        />
      </Card>

      {/* Image Dialog */}
      <ImageDialog
        url={url}
        alt={caption || filename}
        open={viewDialog.value}
        onClose={() => viewDialog.onFalse()}
        imageId={imageId}
        caption={caption}
        createdBy={createdBy}
        createdAt={createdAt}
        viewCount={viewCount}
        type={type}
        imageWidth={width}
        imageHeight={height}
        fileSize={fileSize}
      />
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageCard
 * PropTypes validation for the ImageCard component
 */
ImageCard.propTypes = {
  imageId: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  caption: PropTypes.string,
  status: PropTypes.oneOf(['ACTIVE', 'FLAGGED', 'REMOVED', 'ARCHIVED', 'DELETED']).isRequired,
  featured: PropTypes.bool,
  viewCount: PropTypes.number,
  createdAt: PropTypes.string.isRequired,
  createdBy: PropTypes.number.isRequired,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string,
    })
  ),
  onDelete: PropTypes.func,
  onFlag: PropTypes.func,
  onFavorite: PropTypes.func,
  onReview: PropTypes.func,
};
