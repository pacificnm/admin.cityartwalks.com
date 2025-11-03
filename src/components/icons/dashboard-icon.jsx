/**
 * @namespace CityArtWalks.Components.Icons.DashboardIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Dashboard icon component using SvgColor for navigation to admin dashboard.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.DashboardIcon
 * @function DashboardIcon
 * @description Renders a dashboard icon using the SvgColor component.
 * Commonly used for dashboard navigation, admin areas, and overview sections.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered DashboardIcon component.
 *
 * @example
 * <DashboardIcon size={16} />
 * <DashboardIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function DashboardIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-dashboard.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
