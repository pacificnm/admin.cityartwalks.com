/**
 * @namespace CityArtWalks.Components.Icons.CalendarIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Calendar icon component using solar:calendar-date-bold icon.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CalendarIcon
 * @function CalendarIcon
 * @description Renders a calendar icon using the solar:calendar-date-bold icon.
 * Commonly used for date-related UI elements and metadata display.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CalendarIcon component.
 *
 * @example
 * <CalendarIcon size={16} />
 * <CalendarIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function CalendarIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:calendar-date-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
