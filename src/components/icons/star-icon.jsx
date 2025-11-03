/**
 * @namespace CityArtWalks.Components.Icons.StarIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Star icon component using solar:star-bold icon for ratings, favorites, and featured content.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.StarIcon
 * @function StarIcon
 * @description Renders a filled star icon using the solar:star-bold icon.
 * Commonly used for rating systems, featured badges, and star indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered StarIcon component.
 *
 * @example
 * <StarIcon size={16} />
 * <StarIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function StarIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:star-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
