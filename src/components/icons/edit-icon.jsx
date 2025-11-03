/**
 * @namespace CityArtWalks.Components.Icons.EditIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Edit icon component using Iconify for editing actions and forms.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.EditIcon
 * @function EditIcon
 * @description Renders an edit icon using the Iconify component.
 * Commonly used for editing records, updating content, and form modifications.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered EditIcon component.
 *
 * @example
 * <EditIcon size={16} />
 * <EditIcon size={24} sx={{ color: 'warning.main' }} />
 */
export function EditIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:pen-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
