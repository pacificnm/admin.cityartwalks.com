/**
 * @namespace CityArtWalks.Components.Icons.FilterIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Filter icon component using solar:filter-bold icon for filtering functionality.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.FilterIcon
 * @function FilterIcon
 * @description Renders a filter icon using the solar:filter-bold icon.
 * Commonly used for filter buttons, filter panels, and data filtering functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered FilterIcon component.
 *
 * @example
 * <FilterIcon size={16} />
 * <FilterIcon size={24} sx={{ color: 'action.active' }} />
 */
export function FilterIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:filter-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
