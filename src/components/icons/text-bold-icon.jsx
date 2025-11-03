/**
 * @namespace CityArtWalks.Components.Icons.TextBoldIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Text bold icon component using solar:text-bold-bold icon for bold text formatting.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.TextBoldIcon
 * @function TextBoldIcon
 * @description Renders a text bold icon using the solar:text-bold-bold icon.
 * Commonly used for text formatting controls and rich text editors.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered TextBoldIcon component.
 *
 * @example
 * <TextBoldIcon size={16} />
 * <TextBoldIcon size={24} sx={{ color: 'text.primary' }} />
 */
export function TextBoldIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:text-bold-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
