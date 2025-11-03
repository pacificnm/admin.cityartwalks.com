/**
 * @namespace CityArtWalks.Components.Icons.CheckCircleIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Check circle icon component using solar:check-circle-bold icon for success and completion indicators.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CheckCircleIcon
 * @function CheckCircleIcon
 * @description Renders a check circle icon using the solar:check-circle-bold icon.
 * Commonly used for success states, completed actions, delivered status, and positive indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CheckCircleIcon component.
 *
 * @example
 * <CheckCircleIcon size={16} />
 * <CheckCircleIcon size={24} sx={{ color: 'success.main' }} />
 */
export function CheckCircleIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:check-circle-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
