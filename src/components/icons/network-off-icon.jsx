/**
 * @namespace CityArtWalks.Components.Icons.NetworkOffIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Network off icon component for network error and connectivity issues.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.NetworkOffIcon
 * @function NetworkOffIcon
 * @description Renders a network off icon using the solar:wifi-router-minimalistic-broken icon.
 * Commonly used for network errors, connection issues, and offline states.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered NetworkOffIcon component.
 *
 * @example
 * <NetworkOffIcon size={16} />
 * <NetworkOffIcon size={64} sx={{ color: 'text.disabled' }} />
 */
export function NetworkOffIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:wifi-router-minimalistic-broken"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
