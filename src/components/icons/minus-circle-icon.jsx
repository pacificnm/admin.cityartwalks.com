/**
 * @namespace CityArtWalks.Components.Icons.MinusCircleIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Minus circle icon component using solar:close-circle-bold for indeterminate states.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.MinusCircleIcon
 * @function MinusCircleIcon
 * @description Renders a minus circle icon using the solar:close-circle-bold icon.
 * Commonly used for indeterminate checkbox states, remove actions, and negative indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered MinusCircleIcon component.
 *
 * @example
 * <MinusCircleIcon size={22} />
 * <MinusCircleIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function MinusCircleIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:close-circle-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
