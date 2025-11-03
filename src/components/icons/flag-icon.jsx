/**
 * @namespace CityArtWalks.Components.Icons.FlagIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Flag icon component using solar:flag-bold icon for reporting and flagging actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.FlagIcon
 * @function FlagIcon
 * @description Renders a flag icon using the solar:flag-bold icon.
 * Commonly used for report buttons, flag content actions, and moderation indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered FlagIcon component.
 *
 * @example
 * <FlagIcon size={16} />
 * <FlagIcon size={20} sx={{ color: 'warning.main' }} />
 */
export function FlagIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:flag-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
