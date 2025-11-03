/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceImageList
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.ArtPiece
 * @description Art piece image list component with grid layout, pagination, and sorting for public display.
 */

'use client';

import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';

import { useBoolean } from 'src/hooks/use-boolean';

import { debugLog, debugError } from 'src/lib/debug';
import { updateImage } from 'src/actions/image/requests';
import { useGetPaginatedImages } from 'src/actions/image/hooks';

import { toast } from 'src/components/snackbar';
import { ImageCard, ImageEmpty } from 'src/components/image';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

import { ArtPieceImageToolbar } from './art-piece-image-toolbar';
import { ArtPieceImageUploadDialog } from './art-piece-image-upload-dialog';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageList
 * @function ArtPieceImageList
 * @description Displays a grid of images for a specific art piece with sorting and pagination.
 * Includes public-facing sort options by popularity (positive reviews) and date.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string|number} props.artPieceId - The ID of the art piece to display images for.
 * @param {Object} [props.gridTemplateColumns] - Grid template columns for responsive layout.
 * @param {number} [props.rowsPerPage=12] - Number of images per page.
 * @param {Function} [props.onImageDelete] - Callback when an image is deleted.
 * @param {Function} [props.onImageFlag] - Callback when an image is flagged.
 * @param {Function} [props.onImageFavorite] - Callback when an image is favorited.
 * @param {Function} [props.onImageReview] - Callback when an image is reviewed.
 * @param {Function} [props.onImageUpload] - Callback when upload is successful (for list refresh).
 * @param {Object} [props.sx] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ArtPieceImageList component.
 *
 * @example
 * <ArtPieceImageList
 *   artPieceId={123}
 *   rowsPerPage={16}
 *   onImageDelete={handleImageDelete}
 *   onImageFlag={handleImageFlag}
 *   onImageUpload={handleImageUpload}
 * />
 */
export function ArtPieceImageList(props) {
  const {
    artPieceId,
    gridTemplateColumns,
    rowsPerPage = 12,
    onImageDelete,
    onImageFavorite,
    onImageReview,
    onImageUpload,
    sx,
    ...other
  } = props;

  const { accessToken, user } = useAuthContext();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' or 'date'
  const uploadDialog = useBoolean();

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageList
   * @function buildFilters
   * @description Builds filter object for the pagination hook based on sorting preference.
   * @private
   */
  const filters = useMemo(() => {
    const baseFilters = {
      artPieceId: artPieceId?.toString() || '',
      status: 'ACTIVE',
    };

    // Add sorting - note: this would need to be implemented in the API
    // For now, we'll fetch all and sort client-side as a temporary solution
    return baseFilters;
  }, [artPieceId]);

  const {
    images,
    paginationMeta,
    imagesLoading,
    imagesError,
    imagesEmpty,
    mutate: mutateImages,
  } = useGetPaginatedImages(filters, page, rowsPerPage, accessToken);

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageList
   * @function sortedImages
   * @description Sorts images based on selected criteria (client-side sorting).
   * @private
   */
  const sortedImages = useMemo(() => {
    if (!images || images.length === 0) return [];

    const sorted = [...images];

    if (sortBy === 'popularity') {
      // Sort by number of positive reviews (4+ stars)
      sorted.sort((a, b) => {
        const aPositiveReviews = (a.reviews || []).filter((review) => review.rating >= 4).length;
        const bPositiveReviews = (b.reviews || []).filter((review) => review.rating >= 4).length;
        return bPositiveReviews - aPositiveReviews;
      });
    } else if (sortBy === 'date') {
      // Sort by creation date (newest first)
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    debugLog('CityArtWalks.Components.ArtPiece.ArtPieceImageList.sortedImages', 'Images sorted', {
      sortBy,
      count: sorted.length,
    });

    return sorted;
  }, [images, sortBy]);

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageList
   * @function handlePageChange
   * @description Handles pagination page change.
   * @private
   * @param {Object} event - The event object.
   * @param {number} newPage - The new page number.
   */
  const handlePageChange = (_event, newPage) => {
    debugLog(
      'CityArtWalks.Components.ArtPiece.ArtPieceImageList.handlePageChange',
      'Page changed',
      {
        from: page,
        to: newPage,
      }
    );
    setPage(newPage);
  };

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageList
   * @function handleSortChange
   * @description Handles sort option change from toolbar.
   * @private
   * @param {string} newSort - The new sort option.
   */
  const handleSortChange = (newSort) => {
    debugLog(
      'CityArtWalks.Components.ArtPiece.ArtPieceImageList.handleSortChange',
      'Sort changed',
      {
        from: sortBy,
        to: newSort,
      }
    );
    setSortBy(newSort);
  };

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageList
   * @function handleUploadSuccess
   * @description Handles successful image upload, refreshes the image list.
   * @private
   */
  const handleUploadSuccess = () => {
    debugLog(
      'CityArtWalks.Components.ArtPiece.ArtPieceImageList.handleUploadSuccess',
      'Image upload successful, refreshing list',
      {
        artPieceId,
      }
    );

    // Refresh the image list
    if (mutateImages) {
      mutateImages();
    }

    // Call parent callback if provided
    if (onImageUpload) {
      onImageUpload();
    }
  };

  /**
   * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageList
   * @function handleImageFlag
   * @description Handles flagging an image for moderation.
   * @private
   * @param {number} imageId - The ID of the image to flag.
   * @param {string} reason - The reason for flagging.
   */
  const handleImageFlag = async (imageId, reason) => {
    try {
      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceImageList.handleImageFlag',
        'Flagging image',
        {
          imageId,
          reason,
        }
      );

      // Update image status to FLAGGED
      const updateData = {
        status: 'FLAGGED',
        flagReason: reason,
        flaggedAt: new Date(),
        flaggedBy: user?.userId || null,
      };

      await updateImage(imageId, updateData, accessToken);

      // Show success message
      toast.success('Image has been flagged for review');

      // Refresh the image list to remove the flagged image
      if (mutateImages) {
        mutateImages();
      }

      debugLog(
        'CityArtWalks.Components.ArtPiece.ArtPieceImageList.handleImageFlag',
        'Image flagged successfully',
        {
          imageId,
        }
      );
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtPiece.ArtPieceImageList.handleImageFlag',
        'Failed to flag image',
        error
      );
      toast.error('Failed to flag image. Please try again.');
    }
  };

  // Error state
  if (imagesError) {
    debugError(
      'CityArtWalks.Components.ArtPiece.ArtPieceImageList',
      'Error loading images',
      imagesError
    );
    return (
      <ImageEmpty
        title="Error Loading Images"
        description="Unable to load images. Please try again later."
      />
    );
  }

  // Empty state
  if (imagesEmpty && !imagesLoading) {
    return (
      <ImageEmpty
        title="No Images Found"
        description="This art piece doesn't have any images yet."
      />
    );
  }

  return (
    <ErrorBoundary>
      <Stack spacing={3} sx={sx} {...other}>
        {/* Toolbar with Sort Options and Upload Button */}
        <ArtPieceImageToolbar
          artPieceId={artPieceId}
          totalCount={paginationMeta?.total || 0}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onUpload={uploadDialog.onTrue}
        />

        {/* Image Grid */}
        {imagesLoading ? (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: gridTemplateColumns || {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            }}
          >
            {Array.from({ length: rowsPerPage }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: gridTemplateColumns || {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            }}
          >
            {sortedImages.map((image) => (
              <ImageCard
                key={image.imageId}
                imageId={image.imageId}
                url={image.url}
                filename={image.filename}
                type={image.type}
                caption={image.caption}
                status={image.status}
                featured={image.featured}
                viewCount={image.viewCount}
                createdAt={image.createdAt}
                createdBy={image.createdBy}
                reviews={image.reviews || []}
                onDelete={onImageDelete}
                onFlag={handleImageFlag}
                onFavorite={onImageFavorite}
                onReview={onImageReview}
              />
            ))}
          </Box>
        )}

        {/* Pagination */}
        {paginationMeta?.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={paginationMeta.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Stack>

      {/* Upload Dialog */}
      <ArtPieceImageUploadDialog
        artPieceId={artPieceId}
        open={uploadDialog.value}
        onClose={uploadDialog.onFalse}
        onSuccess={handleUploadSuccess}
      />
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceImageList
 * PropTypes validation for the ArtPieceImageList component
 */
ArtPieceImageList.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  gridTemplateColumns: PropTypes.object,
  rowsPerPage: PropTypes.number,
  onImageDelete: PropTypes.func,
  onImageFlag: PropTypes.func,
  onImageFavorite: PropTypes.func,
  onImageReview: PropTypes.func,
  onImageUpload: PropTypes.func,
  sx: PropTypes.object,
};
