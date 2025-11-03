/**
 * @namespace CityArtWalks.Components.Icons.SettingsIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Settings icon component using Iconify for configuration and preferences.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.SettingsIcon
 * @function SettingsIcon
 * @description Renders a settings icon using the Iconify component.
 * Commonly used for settings pages, configuration panels, and user preferences.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered SettingsIcon component.
 *
 * @example
 * <SettingsIcon size={16} />
 * <SettingsIcon size={24} sx={{ color: 'text.secondary' }} />
 */
export function SettingsIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:settings-bold-duotone"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
