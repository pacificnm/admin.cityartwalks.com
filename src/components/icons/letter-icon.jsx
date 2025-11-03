/**
 * @namespace CityArtWalks.Components.Icons.LetterIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Letter icon component using solar:letter-bold icon for email and messaging actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.LetterIcon
 * @function LetterIcon
 * @description Renders a letter/email icon using the solar:letter-bold icon.
 * Commonly used for email status, messaging actions, and mail indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered LetterIcon component.
 *
 * @example
 * <LetterIcon size={16} />
 * <LetterIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function LetterIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:letter-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
