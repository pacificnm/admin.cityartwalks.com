/**
 * @namespace CityArtWalks.Components.Icons.LockIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Lock icon component using SvgColor for security and authentication features.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.LockIcon
 * @function LockIcon
 * @description Renders a lock icon using the SvgColor component.
 * Commonly used for password fields, security features, and private content indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered LockIcon component.
 *
 * @example
 * <LockIcon size={16} />
 * <LockIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function LockIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-lock.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
