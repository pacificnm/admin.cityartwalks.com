/**
 * @namespace CityArtWalks.Components.Icons.ImageIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Image icon component using solar:gallery-bold icon for image galleries and image-related actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.ImageIcon
 * @function ImageIcon
 * @description Renders an image/gallery icon using the solar:gallery-bold icon.
 * Commonly used for image galleries, image upload buttons, and image-related navigation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ImageIcon component.
 *
 * @example
 * <ImageIcon size={16} />
 * <ImageIcon size={20} sx={{ color: 'primary.main' }} />
 */
export function ImageIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:gallery-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
