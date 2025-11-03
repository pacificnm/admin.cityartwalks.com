/**
 * @namespace CityArtWalks.Components.Icons.ArtistIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Artist icon component using SvgColor for displaying artist references.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.ArtistIcon
 * @function ArtistIcon
 * @description Renders an artist icon using the SvgColor component.
 * Commonly used for artist navigation, artist profiles, and artist identification.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ArtistIcon component.
 *
 * @example
 * <ArtistIcon size={16} />
 * <ArtistIcon size={24} sx={{ color: 'secondary.main' }} />
 */
export function ArtistIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic_art.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
