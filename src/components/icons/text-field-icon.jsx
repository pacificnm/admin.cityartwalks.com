/**
 * @namespace CityArtWalks.Components.Icons.TextFieldIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Text field icon component using solar:text-field-bold icon for text input controls.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.TextFieldIcon
 * @function TextFieldIcon
 * @description Renders a text field icon using the solar:text-field-bold icon.
 * Commonly used for text input controls, form fields, and input interfaces.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered TextFieldIcon component.
 *
 * @example
 * <TextFieldIcon size={16} />
 * <TextFieldIcon size={24} sx={{ color: 'text.secondary' }} />
 */
export function TextFieldIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:text-field-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
