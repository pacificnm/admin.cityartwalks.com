/**
 * @namespace CityArtWalks.Components.Icons.FavoriteAddIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Favorite add icon component using SvgColor for adding items to favorites.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.FavoriteAddIcon
 * @function FavoriteAddIcon
 * @description Renders a favorite add icon using the SvgColor component.
 * Commonly used for adding art pieces to favorites, bookmarking content, and user preferences.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered FavoriteAddIcon component.
 *
 * @example
 * <FavoriteAddIcon size={16} />
 * <FavoriteAddIcon size={24} sx={{ color: 'error.main' }} />
 */
export function FavoriteAddIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/apps/ic_favorite.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
