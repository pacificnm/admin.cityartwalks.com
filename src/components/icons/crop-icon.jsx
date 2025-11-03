/**
 * @namespace CityArtWalks.Components.Icons.CropIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Crop icon component using solar:pen-bold icon for image cropping and editing actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CropIcon
 * @function CropIcon
 * @description Renders a crop icon using the solar:pen-bold icon.
 * Commonly used for image cropping tools and editing functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CropIcon component.
 *
 * @example
 * <CropIcon size={16} />
 * <CropIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function CropIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:pen-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
