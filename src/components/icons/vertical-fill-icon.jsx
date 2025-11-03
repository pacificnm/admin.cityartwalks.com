/**
 * @namespace CityArtWalks.Components.Icons.VerticalFillIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Vertical fill icon component using solar:menu-dots-bold-duotone for vertical menu triggers.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.VerticalFillIcon
 * @function VerticalFillIcon
 * @description Renders a vertical more icon using the solar:menu-dots-bold-duotone icon.
 * Commonly used for vertical dropdown menus, action lists, and context menu triggers.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered VerticalFillIcon component.
 *
 * @example
 * <VerticalFillIcon size={16} />
 * <VerticalFillIcon size={24} sx={{ color: 'text.secondary' }} />
 */
export function VerticalFillIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:menu-dots-bold-duotone"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
