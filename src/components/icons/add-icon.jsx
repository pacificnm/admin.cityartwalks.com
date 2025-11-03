/**
 * @namespace CityArtWalks.Components.Icons.AddIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Add icon component using solar:add-circle-bold icon for creation and addition actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.AddIcon
 * @function AddIcon
 * @description Renders an add/plus icon using the solar:add-circle-bold icon.
 * Commonly used for add buttons, create actions, and addition indicators.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered AddIcon component.
 *
 * @example
 * <AddIcon size={16} />
 * <AddIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function AddIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:add-circle-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
