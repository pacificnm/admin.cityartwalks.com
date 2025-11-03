/**
 * @namespace CityArtWalks.Components.Icons.LocationIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Location icon component using SvgColor for geographic and location features.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.LocationIcon
 * @function LocationIcon
 * @description Renders a location icon using the SvgColor component.
 * Commonly used for location markers, geographic filters, and address display.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered LocationIcon component.
 *
 * @example
 * <LocationIcon size={16} />
 * <LocationIcon size={24} sx={{ color: 'error.main' }} />
 */
export function LocationIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-label.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
