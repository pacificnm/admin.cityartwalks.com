/**
 * @namespace CityArtWalks.Components.Icons.GoogleIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Google icon component for Google authentication and social login.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.GoogleIcon
 * @function GoogleIcon
 * @description Renders a Google icon using the logos:google-icon icon.
 * Commonly used for Google sign-in buttons and authentication flows.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered GoogleIcon component.
 *
 * @example
 * <GoogleIcon size={16} />
 * <GoogleIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function GoogleIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="logos:google-icon"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
