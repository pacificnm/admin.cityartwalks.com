/**
 * @namespace CityArtWalks.Components.Icons.TextItalicIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Text italic icon component using solar:text-italic-bold icon for italic text formatting.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.TextItalicIcon
 * @function TextItalicIcon
 * @description Renders a text italic icon using the solar:text-italic-bold icon.
 * Commonly used for text formatting controls and rich text editors.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered TextItalicIcon component.
 *
 * @example
 * <TextItalicIcon size={16} />
 * <TextItalicIcon size={24} sx={{ color: 'text.primary' }} />
 */
export function TextItalicIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:text-italic-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
