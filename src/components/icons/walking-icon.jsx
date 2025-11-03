/**
 * @namespace CityArtWalks.Components.Icons.WalkingIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Walking icon component using SvgColor for paths and walking routes.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.WalkingIcon
 * @function WalkingIcon
 * @description Renders a walking path icon using the SvgColor component.
 * Commonly used for walking paths, route navigation, and tour features.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered WalkingIcon component.
 *
 * @example
 * <WalkingIcon size={16} />
 * <WalkingIcon size={24} sx={{ color: 'success.main' }} />
 */
export function WalkingIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic_path.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
