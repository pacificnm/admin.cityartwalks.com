/**
 * @namespace CityArtWalks.Components.Icons.DevicesIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Devices icon component using solar:devices-bold icon for device and technology indicators.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.DevicesIcon
 * @function DevicesIcon
 * @description Renders a devices icon using the solar:devices-bold icon.
 * Commonly used for device information, technology indicators, and multi-platform references.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered DevicesIcon component.
 *
 * @example
 * <DevicesIcon size={16} />
 * <DevicesIcon size={24} sx={{ color: 'action.active' }} />
 */
export function DevicesIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:devices-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
