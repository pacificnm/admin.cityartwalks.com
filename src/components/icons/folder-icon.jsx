/**
 * @namespace CityArtWalks.Components.Icons.FolderIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Folder icon component using SvgColor for file organization and categories.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.FolderIcon
 * @function FolderIcon
 * @description Renders a folder icon using the SvgColor component.
 * Commonly used for file management, category organization, and content grouping.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered FolderIcon component.
 *
 * @example
 * <FolderIcon size={16} />
 * <FolderIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function FolderIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-folder.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
