/**
 * @namespace CityArtWalks.Components.Icons.ArrowUpIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Arrow up icon component using solar:arrow-up-bold icon for expand/collapse controls.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.ArrowUpIcon
 * @function ArrowUpIcon
 * @description Renders an upward arrow icon using the solar:arrow-up-bold icon.
 * Commonly used for collapse controls, upward navigation, and sorting indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ArrowUpIcon component.
 *
 * @example
 * <ArrowUpIcon size={16} />
 * <ArrowUpIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function ArrowUpIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:arrow-up-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
