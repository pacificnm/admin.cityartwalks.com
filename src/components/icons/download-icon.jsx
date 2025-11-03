/**
 * @namespace CityArtWalks.Components.Icons.DownloadIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Download icon component using solar:download-bold icon for download and export actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.DownloadIcon
 * @function DownloadIcon
 * @description Renders a download icon using the solar:download-bold icon.
 * Commonly used for download buttons, export functionality, and file saving actions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered DownloadIcon component.
 *
 * @example
 * <DownloadIcon size={16} />
 * <DownloadIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function DownloadIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:download-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
