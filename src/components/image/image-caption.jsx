/**
 * @namespace CityArtWalks.Components.Image.ImageCaption
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Caption component for displaying image captions with text truncation.
 */

'use client';

import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

/**
 * @memberof CityArtWalks.Components.Image.ImageCaption
 * @function ImageCaption
 * @description Displays image caption with text truncation for overflow.
 * Uses webkit box properties to limit text to 2 lines with ellipsis.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.caption] - The caption text to display.
 * @param {number} [props.maxLines=2] - Maximum number of lines to display before truncation.
 * @param {Object} [props.sx] - Additional Material-UI sx styling props.
 * @returns {JSX.Element|null} The rendered ImageCaption component or null if no caption.
 *
 * @example
 * <ImageCaption
 *   caption="This is a beautiful sunset over the mountains"
 *   maxLines={3}
 * />
 */
export function ImageCaption(props) {
  const { caption, maxLines = 2, sx, ...other } = props;

  // Don't render if no caption
  if (!caption) {
    return null;
  }

  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        mb: 2,
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLines,
        ...sx,
      }}
      {...other}
    >
      {caption}
    </Typography>
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageCaption
 * PropTypes validation for the ImageCaption component
 */
ImageCaption.propTypes = {
  caption: PropTypes.string,
  maxLines: PropTypes.number,
  sx: PropTypes.object,
};
