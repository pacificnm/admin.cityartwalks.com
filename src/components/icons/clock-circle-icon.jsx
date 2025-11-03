/**
 * @namespace CityArtWalks.Components.Icons.ClockCircleIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Clock circle icon component using solar:clock-circle-bold icon for pending and time-related indicators.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.ClockCircleIcon
 * @function ClockCircleIcon
 * @description Renders a clock circle icon using the solar:clock-circle-bold icon.
 * Commonly used for pending states, waiting actions, scheduled items, and time indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ClockCircleIcon component.
 *
 * @example
 * <ClockCircleIcon size={16} />
 * <ClockCircleIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function ClockCircleIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:clock-circle-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
