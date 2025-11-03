/**
 * @namespace CityArtWalks.Components.Icons.PopoverIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Popover icon component using solar:menu-dots-bold for menu and action triggers.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.PopoverIcon
 * @function PopoverIcon
 * @description Renders a horizontal more icon using the solar:menu-dots-bold icon.
 * Commonly used for dropdown menus, action popovers, and context menus.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered PopoverIcon component.
 *
 * @example
 * <PopoverIcon size={16} />
 * <PopoverIcon size={24} sx={{ color: 'text.secondary' }} />
 */
export function PopoverIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:menu-dots-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
