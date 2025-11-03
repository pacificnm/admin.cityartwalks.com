/**
 * @namespace CityArtWalks.Components.Icons.FileIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description File icon component using SVG asset for file-related actions and displays.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.FileIcon
 * @function FileIcon
 * @description Renders a file icon using the navbar/ic-file.svg asset.
 * Commonly used for file type displays, document indicators, and file-related UI elements.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered FileIcon component.
 *
 * @example
 * <FileIcon size={16} />
 * <FileIcon size={20} sx={{ color: 'text.secondary' }} />
 */
export function FileIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-file.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
