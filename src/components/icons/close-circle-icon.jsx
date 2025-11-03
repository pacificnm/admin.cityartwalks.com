/**
 * @namespace CityArtWalks.Components.Icons.CloseCircleIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Close circle icon component using solar:close-circle-bold icon for error and failure indicators.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CloseCircleIcon
 * @function CloseCircleIcon
 * @description Renders a close circle icon using the solar:close-circle-bold icon.
 * Commonly used for error states, failed actions, bounced emails, and negative indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CloseCircleIcon component.
 *
 * @example
 * <CloseCircleIcon size={16} />
 * <CloseCircleIcon size={24} sx={{ color: 'error.main' }} />
 */
export function CloseCircleIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:close-circle-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
