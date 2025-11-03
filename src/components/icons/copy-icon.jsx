/**
 * @namespace CityArtWalks.Components.Icons.CopyIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Copy icon component using solar:copy-bold icon for copy actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CopyIcon
 * @function CopyIcon
 * @description Renders a copy icon using the solar:copy-bold icon.
 * Commonly used for copy actions, duplicate operations, and clipboard functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CopyIcon component.
 *
 * @example
 * <CopyIcon size={16} />
 * <CopyIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function CopyIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:copy-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
