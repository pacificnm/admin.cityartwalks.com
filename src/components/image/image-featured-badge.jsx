/**
 * @namespace CityArtWalks.Components.Image.ImageFeaturedBadge
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Featured badge component for highlighting featured images.
 */

'use client';

import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';

import { StarIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Image.ImageFeaturedBadge
 * @function ImageFeaturedBadge
 * @description Displays a featured badge for images that are marked as featured.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} [props.featured=false] - Whether the image is featured.
 * @returns {JSX.Element|null} The rendered ImageFeaturedBadge component or null if not featured.
 *
 * @example
 * <ImageFeaturedBadge featured={true} />
 */
export function ImageFeaturedBadge(props) {
  const { featured = false } = props;

  if (!featured) {
    return null;
  }

  return (
    <Chip
      label="Featured"
      size="small"
      color="primary"
      icon={<StarIcon size={16} />}
      sx={{
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 1,
      }}
    />
  );
}

/**
 * @memberof CityArtWalks.Components.Image.ImageFeaturedBadge
 * PropTypes validation for the ImageFeaturedBadge component
 */
ImageFeaturedBadge.propTypes = {
  featured: PropTypes.bool,
};
