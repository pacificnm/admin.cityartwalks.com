/**
 * @namespace CityArtWalks.Components.Icons.StarOutlineIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Star outline icon component using solar:star-outline for ratings and favorites.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.StarOutlineIcon
 * @function StarOutlineIcon
 * @description Renders a star outline icon using the solar:star-outline icon.
 * Commonly used for ratings, reviews, unfilled favorites, and quality indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered StarOutlineIcon component.
 *
 * @example
 * <StarOutlineIcon size={16} />
 * <StarOutlineIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function StarOutlineIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:star-outline"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
