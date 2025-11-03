/**
 * @namespace CityArtWalks.Components.Icons.RotateRightIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Rotate right icon component using solar:restart-bold icon for image rotation actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.RotateRightIcon
 * @function RotateRightIcon
 * @description Renders a rotate right icon using the solar:restart-bold icon.
 * Commonly used for image rotation controls, image editing tools, and orientation adjustments.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered RotateRightIcon component.
 *
 * @example
 * <RotateRightIcon size={16} />
 * <RotateRightIcon size={20} sx={{ color: 'primary.main' }} />
 */
export function RotateRightIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:restart-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
