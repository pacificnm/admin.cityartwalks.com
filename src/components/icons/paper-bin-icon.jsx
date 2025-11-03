/**
 * @namespace CityArtWalks.Components.Icons.PaperBinIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Paper bin icon component using solar:paper-bin-bold icon for archive/draft actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.PaperBinIcon
 * @function PaperBinIcon
 * @description Renders a paper bin icon using the solar:paper-bin-bold icon.
 * Commonly used for draft actions, archive operations, and document storage.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered PaperBinIcon component.
 *
 * @example
 * <PaperBinIcon size={16} />
 * <PaperBinIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function PaperBinIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:paper-bin-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
