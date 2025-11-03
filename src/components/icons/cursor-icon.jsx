/**
 * @namespace CityArtWalks.Components.Icons.CursorIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Cursor icon component using solar:cursor-bold icon for click and interaction indicators.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CursorIcon
 * @function CursorIcon
 * @description Renders a cursor icon using the solar:cursor-bold icon.
 * Commonly used for click tracking, interaction indicators, and clickable elements.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CursorIcon component.
 *
 * @example
 * <CursorIcon size={16} />
 * <CursorIcon size={24} sx={{ color: 'secondary.main' }} />
 */
export function CursorIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:cursor-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
