/**
 * @namespace CityArtWalks.Components.Icons.ArtPieceIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Art piece icon component using SvgColor for displaying art piece references.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.ArtPieceIcon
 * @function ArtPieceIcon
 * @description Renders an art piece icon using the SvgColor component.
 * Commonly used for art piece navigation, art piece lists, and art piece identification.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ArtPieceIcon component.
 *
 * @example
 * <ArtPieceIcon size={16} />
 * <ArtPieceIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function ArtPieceIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic_art_piece.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
