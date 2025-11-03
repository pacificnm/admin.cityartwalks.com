/**
 * @namespace CityArtWalks.Components.Icons.ArrowDownIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Arrow down icon component using solar:arrow-down-bold icon for expand/collapse controls.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.ArrowDownIcon
 * @function ArrowDownIcon
 * @description Renders a downward arrow icon using the solar:arrow-down-bold icon.
 * Commonly used for expand controls, downward navigation, and sorting indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ArrowDownIcon component.
 *
 * @example
 * <ArrowDownIcon size={16} />
 * <ArrowDownIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function ArrowDownIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:arrow-down-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
