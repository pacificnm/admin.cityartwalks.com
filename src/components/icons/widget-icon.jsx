/**
 * @namespace CityArtWalks.Components.Icons.WidgetIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Widget icon component using solar:widget-2-bold icon for widget and component features.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.WidgetIcon
 * @function WidgetIcon
 * @description Renders a widget icon using the solar:widget-2-bold icon.
 * Commonly used for widget controls, component interfaces, and modular features.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered WidgetIcon component.
 *
 * @example
 * <WidgetIcon size={16} />
 * <WidgetIcon size={24} sx={{ color: 'primary.main' }} />
 */
export function WidgetIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:widget-2-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
