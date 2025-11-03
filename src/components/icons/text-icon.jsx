/**
 * @namespace CityArtWalks.Components.Icons.TextIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Text icon component using solar:text-bold icon for text content.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.TextIcon
 * @function TextIcon
 * @description Renders a text icon using the solar:text-bold icon.
 * Commonly used for text content, plain text views, and typography features.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered TextIcon component.
 *
 * @example
 * <TextIcon size={16} />
 * <TextIcon size={24} sx={{ color: 'text.primary' }} />
 */
export function TextIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:text-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
