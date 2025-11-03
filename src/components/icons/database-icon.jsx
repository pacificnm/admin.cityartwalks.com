/**
 * @namespace CityArtWalks.Components.Icons.DatabaseIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Database icon component using Iconify for database-related features.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.DatabaseIcon
 * @function DatabaseIcon
 * @description Renders a database icon using the Iconify component.
 * Commonly used for database, data management, and harvesting features.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered DatabaseIcon component.
 *
 * @example
 * <DatabaseIcon size={16} />
 * <DatabaseIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function DatabaseIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:database-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
