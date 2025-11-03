/**
 * @namespace CityArtWalks.Components.Icons.RefreshIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Refresh icon component using solar:refresh-bold icon for refresh and reload actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.RefreshIcon
 * @function RefreshIcon
 * @description Renders a refresh icon using the solar:refresh-bold icon.
 * Commonly used for refresh buttons, reload actions, resend functionality, and data updates.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered RefreshIcon component.
 *
 * @example
 * <RefreshIcon size={16} />
 * <RefreshIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function RefreshIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:refresh-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
