/**
 * @namespace CityArtWalks.Components.Icons.UserPlusIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description User plus icon component using solar:user-plus-bold icon for add user actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.UserPlusIcon
 * @function UserPlusIcon
 * @description Renders a user plus icon using the solar:user-plus-bold icon.
 * Commonly used for add user actions, invitation features, and user management.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered UserPlusIcon component.
 *
 * @example
 * <UserPlusIcon size={16} />
 * <UserPlusIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function UserPlusIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:user-plus-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
