/**
 * @namespace CityArtWalks.Components.Icons.Facebook
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Facebook icon component using Iconify for social media integration.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.Facebook
 * @function Facebook
 * @description Renders a Facebook icon using the Iconify component.
 * Commonly used for social media sharing, Facebook login, and social links.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered Facebook component.
 *
 * @example
 * <Facebook size={16} />
 * <Facebook size={24} sx={{ color: '#1877F2' }} />
 */
export function Facebook({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="logos:facebook"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
