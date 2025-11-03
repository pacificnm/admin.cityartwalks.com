/**
 * @namespace CityArtWalks.Components.Icons.DeleteIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Delete icon component using solar:trash-bin-trash-bold icon for deletion actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.DeleteIcon
 * @function DeleteIcon
 * @description Renders a trash/delete icon using the solar:trash-bin-trash-bold icon.
 * Commonly used for delete buttons, removal actions, and trash indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered DeleteIcon component.
 *
 * @example
 * <DeleteIcon size={16} />
 * <DeleteIcon size={20} sx={{ color: 'error.main' }} />
 */
export function DeleteIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:trash-bin-trash-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
