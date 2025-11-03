/**
 * @namespace CityArtWalks.Components.Icons.MapPointIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Map point icon component using solar:map-point-bold icon for location and geographic indicators.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.MapPointIcon
 * @function MapPointIcon
 * @description Renders a map point icon using the solar:map-point-bold icon.
 * Commonly used for location indicators, geographic markers, and position references.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered MapPointIcon component.
 *
 * @example
 * <MapPointIcon size={16} />
 * <MapPointIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function MapPointIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:map-point-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
