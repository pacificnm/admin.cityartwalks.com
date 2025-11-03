/**
 * @namespace CityArtWalks.Components.Icons.ArchiveIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Archive icon component using solar:archive-bold icon for archive actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.ArchiveIcon
 * @function ArchiveIcon
 * @description Renders an archive icon using the solar:archive-bold icon.
 * Commonly used for archive actions, storage indicators, and organization features.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ArchiveIcon component.
 *
 * @example
 * <ArchiveIcon size={16} />
 * <ArchiveIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function ArchiveIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:archive-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
