/**
 * @namespace CityArtWalks.Components.Icons.MinimizeIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Minimize icon component using solar:minimize-square-bold icon for minimize actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.MinimizeIcon
 * @function MinimizeIcon
 * @description Renders a minimize icon using the solar:minimize-square-bold icon.
 * Commonly used for minimize controls, collapse actions, and window management.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered MinimizeIcon component.
 *
 * @example
 * <MinimizeIcon size={16} />
 * <MinimizeIcon size={24} sx={{ color: 'action.active' }} />
 */
export function MinimizeIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:minimize-square-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
