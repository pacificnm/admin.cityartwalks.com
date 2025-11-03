/**
 * @namespace CityArtWalks.Components.Image.ImageMetadata
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Image metadata component that displays creation date, view count, and file type.
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fData, fNumber } from 'src/utils/format-number';

import { ViewIcon, FileIcon, ImageIcon, CalendarIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Image.ImageMetadata
 * @function ImageMetadata
 * @description Displays image metadata including ID, creation date, dimensions, file size, view count, and file type.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.imageId] - The image ID.
 * @param {string} props.createdAt - The creation/upload timestamp.
 * @param {number} [props.width] - The image width in pixels.
 * @param {number} [props.height] - The image height in pixels.
 * @param {number} [props.fileSize] - The file size in bytes.
 * @param {number} [props.viewCount=0] - The number of views.
 * @param {string} [props.type] - The MIME type of the image.
 * @param {Object} [props.sx] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ImageMetadata component.
 *
 * @example
 * <ImageMetadata
 *   imageId={123}
 *   createdAt="2025-01-01T00:00:00Z"
 *   width={1920}
 *   height={1080}
 *   fileSize={245760}
 *   viewCount={150}
 *   type="image/jpeg"
 * />
 */
export function ImageMetadata(props) {
  const { imageId, createdAt, width, height, fileSize, viewCount = 0, type, sx, ...other } = props;

  return (
    <Stack spacing={1} sx={{ mb: 2, ...sx }} {...other}>
      {/* Image ID */}
      {imageId && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ImageIcon size={16} />
          <Typography variant="caption" color="text.secondary">
            ID: {imageId}
          </Typography>
        </Box>
      )}

      {/* Dimensions */}
      {width && height && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ImageIcon size={16} />
          <Typography variant="caption" color="text.secondary">
            {fNumber(width)} × {fNumber(height)} pixels
          </Typography>
        </Box>
      )}

      {/* File Size */}
      {fileSize && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileIcon size={16} />
          <Typography variant="caption" color="text.secondary">
            {fData(fileSize)}
          </Typography>
        </Box>
      )}

      {/* File Type */}
      {type && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileIcon size={16} />
          <Typography variant="caption" color="text.secondary">
            {type.split('/')[1]?.toUpperCase() || type}
          </Typography>
        </Box>
      )}

      {/* View Count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ViewIcon size={16} />
        <Typography variant="caption" color="text.secondary">
          {fNumber(viewCount)} views
        </Typography>
      </Box>

      {/* Creation Date */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarIcon size={16} />
        <Typography variant="caption" color="text.secondary">
          {fDate(createdAt)}
        </Typography>
      </Box>
    </Stack>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageMetadata
 * PropTypes validation for the ImageMetadata component
 */
ImageMetadata.propTypes = {
  imageId: PropTypes.number,
  createdAt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  fileSize: PropTypes.number,
  viewCount: PropTypes.number,
  type: PropTypes.string,
  sx: PropTypes.object,
};
