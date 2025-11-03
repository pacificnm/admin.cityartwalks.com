/**
 * @namespace CityArtWalks.Components.Icons.LetterOpenedIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Letter opened icon component using solar:letter-opened-bold icon for opened email status.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.LetterOpenedIcon
 * @function LetterOpenedIcon
 * @description Renders an opened letter/email icon using the solar:letter-opened-bold icon.
 * Commonly used for opened email status, read messages, and email engagement indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered LetterOpenedIcon component.
 *
 * @example
 * <LetterOpenedIcon size={16} />
 * <LetterOpenedIcon size={24} sx={{ color: 'info.main' }} />
 */
export function LetterOpenedIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:letter-opened-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
