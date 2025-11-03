/**
 * @fileoverview ActivityIcon component using Solar pulse-bold-duotone icon
 * @namespace CityArtWalks.Components.Icons.ActivityIcon
 * @version 1.0.0
 * @author CityArtWalks Team
 * @description Activity icon component using solar:pulse-bold-duotone icon for activity indicators.
 * Commonly used for activity indicators, pulse displays, and dynamic status.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.ActivityIcon
 * @function ActivityIcon
 * @description Renders an activity icon using the solar:pulse-bold-duotone icon.
 * Commonly used for activity indicators, pulse displays, and dynamic status.
 *
 * @param {number} [size=24] - Icon size in pixels
 * @param {Object} [sx={}] - Material-UI sx prop for styling
 * @param {Object} [...props] - Additional props passed to Iconify component
 * @returns {JSX.Element} The rendered ActivityIcon component.
 *
 * @example
 * <ActivityIcon size={16} />
 * <ActivityIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function ActivityIcon({ size = 24, sx = {}, ...props }) {
  return <Iconify icon="solar:pulse-bold-duotone" width={size} height={size} sx={sx} {...props} />;
}
