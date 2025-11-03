/**
 * @namespace CityArtWalks.Components.Icons.ViewIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description View icon component using solar:eye-bold icon for visibility and viewing actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.ViewIcon
 * @function ViewIcon
 * @description Renders a view/eye icon using the solar:eye-bold icon.
 * Commonly used for view buttons, visibility indicators, and view count displays.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ViewIcon component.
 *
 * @example
 * <ViewIcon size={16} />
 * <ViewIcon size={20} sx={{ color: 'primary.main' }} />
 */
export function ViewIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:eye-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
