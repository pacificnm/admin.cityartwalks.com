/**
 * @namespace CityArtWalks.Components.Icons.FavoriteIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Favorite icon component using solar heart icons for displaying favorite items.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.FavoriteIcon
 * @function FavoriteIcon
 * @description Renders a favorite icon using solar heart icons.
 * Commonly used for displaying favorite art pieces, liked content, and user preferences.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {boolean} [props.filled=false] - Whether to display filled heart (true) or outline heart (false).
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered FavoriteIcon component.
 *
 * @example
 * <FavoriteIcon size={16} />
 * <FavoriteIcon size={24} filled={true} sx={{ color: 'error.main' }} />
 */
export function FavoriteIcon({ size = 24, filled = false, sx = {}, ...props }) {
  return (
    <Iconify
      icon={filled ? 'solar:heart-bold' : 'solar:heart-outline'}
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
