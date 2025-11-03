/**
 * @namespace CityArtWalks.Components.Icons.HomeIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Home icon component using Iconify for navigation to home page.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.HomeIcon
 * @function HomeIcon
 * @description Renders a home icon using the Iconify component.
 * Commonly used for home navigation, main page links, and dashboard navigation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered HomeIcon component.
 *
 * @example
 * <HomeIcon size={16} />
 * <HomeIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function HomeIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:home-angle-bold-duotone"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
