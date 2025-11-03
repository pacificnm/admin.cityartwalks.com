/**
 * @namespace CityArtWalks.Components.Icons.CloseIcon
 * @version 2.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Close icon component using solar:close-bold for dismissing modals and dialogs.
 * Commonly used for close buttons, dialog dismissal, and cancellation actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CloseIcon
 * @function CloseIcon
 * @description Renders a close icon using the solar:close-bold icon.
 * Commonly used for close buttons, modal dismissal, and cancellation actions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CloseIcon component.
 *
 * @example
 * <CloseIcon size={16} />
 * <CloseIcon size={24} sx={{ color: 'error.main' }} />
 */
export function CloseIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:close-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
