/**
 * @fileoverview AttachIcon Component
 * @description Attach icon component using solar:clip-bold icon for attachment actions.
 * @author City Art Walks
 * @created 2024
 * @namespace CityArtWalks.Components.Icons
 */

/**
 * @description Renders an attach/paperclip icon using the solar:clip-bold icon.
 * Used for file attachments, linking documents, and associating content.
 *
 * @memberof CityArtWalks.Components.Icons
 * @param {Object} props - Component props
 * @param {number} [props.size=24] - Icon size in pixels
 * @param {Object} [props.sx] - Material-UI sx prop for styling
 * @param {...Object} props - Additional props passed to Iconify component
 * @returns {JSX.Element} AttachIcon component
 *
 * @example
 * ```jsx
 * <AttachIcon />
 * <AttachIcon size={32} sx={{ color: 'primary.main' }} />
 * ```
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Icons|Icon Documentation}
 */

import { Iconify } from 'src/components/iconify';

export function AttachIcon({ size = 24, sx, ...props }) {
  return <Iconify icon="solar:clip-bold" width={size} height={size} sx={sx} {...props} />;
}

export default AttachIcon;
