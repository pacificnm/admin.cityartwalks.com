/**
 * @namespace CityArtWalks.Components.Icons.RadioButtonOffIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Radio button off icon component using solar:clock-circle-outline for unselected state.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.RadioButtonOffIcon
 * @function RadioButtonOffIcon
 * @description Renders a radio button off (unselected) icon using the solar:clock-circle-outline icon.
 * Commonly used for checkbox unselected states, radio button off states, and unselected options.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered RadioButtonOffIcon component.
 *
 * @example
 * <RadioButtonOffIcon size={22} />
 * <RadioButtonOffIcon size={24} sx={{ color: 'text.disabled' }} />
 */
export function RadioButtonOffIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:clock-circle-outline"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
