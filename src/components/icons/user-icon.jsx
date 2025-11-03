/**
 * @namespace CityArtWalks.Components.Icons.UserIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description User icon component using SvgColor for user-related features.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.UserIcon
 * @function UserIcon
 * @description Renders a user icon using the SvgColor component.
 * Commonly used for user profiles, account management, and authentication features.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered UserIcon component.
 *
 * @example
 * <UserIcon size={16} />
 * <UserIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function UserIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-user.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
