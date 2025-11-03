/**
 * @namespace CityArtWalks.Components.Icons.MapIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Map icon component using SvgColor for map and navigation features.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.MapIcon
 * @function MapIcon
 * @description Renders a map icon using the SvgColor component.
 * Commonly used for map views, navigation features, and location-based content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered MapIcon component.
 *
 * @example
 * <MapIcon size={16} />
 * <MapIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function MapIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/components/ic-extra-map.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
