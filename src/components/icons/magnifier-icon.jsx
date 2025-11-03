/**
 * @namespace CityArtWalks.Components.Icons.MagnifierIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Magnifier icon component using solar:magnifer-bold icon for search functionality.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.MagnifierIcon
 * @function MagnifierIcon
 * @description Renders a magnifier/search icon using the solar:magnifer-bold icon.
 * Commonly used for search inputs, search buttons, and search functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered MagnifierIcon component.
 *
 * @example
 * <MagnifierIcon size={16} />
 * <MagnifierIcon size={24} sx={{ color: 'text.secondary' }} />
 */
export function MagnifierIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:magnifer-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
