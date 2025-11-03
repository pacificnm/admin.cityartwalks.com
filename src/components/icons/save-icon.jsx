/**
 * @fileoverview SaveIcon component using Solar floppy-disk-bold icon
 * @namespace CityArtWalks.Components.Icons.SaveIcon
 * @version 1.0.0
 * @author CityArtWalks Team
 * @description Save icon component using solar:floppy-disk-bold icon for save actions.
 * Commonly used for save operations, data persistence, and form submissions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.SaveIcon
 * @function SaveIcon
 * @description Renders a save icon using the solar:floppy-disk-bold icon.
 * Commonly used for save operations, data persistence, and form submissions.
 *
 * @param {number} [size=24] - Icon size in pixels
 * @param {Object} [sx={}] - Material-UI sx prop for styling
 * @param {Object} [...props] - Additional props passed to Iconify component
 * @returns {JSX.Element} The rendered SaveIcon component.
 *
 * @example
 * <SaveIcon size={16} />
 * <SaveIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function SaveIcon({ size = 24, sx = {}, ...props }) {
  return <Iconify icon="solar:floppy-disk-bold" width={size} height={size} sx={sx} {...props} />;
}
