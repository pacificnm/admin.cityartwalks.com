/**
 * @namespace CityArtWalks.Components.Icons.CodeIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Code icon component using solar:code-bold icon for code-related actions.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.CodeIcon
 * @function CodeIcon
 * @description Renders a code icon using the solar:code-bold icon.
 * Commonly used for code views, HTML templates, and technical content.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered CodeIcon component.
 *
 * @example
 * <CodeIcon size={16} />
 * <CodeIcon size={24} sx={{ color: 'info.main' }} />
 */
export function CodeIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:code-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
