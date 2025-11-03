/**
 * @namespace CityArtWalks.Components.Icons.ChatIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Chat icon component using SVG asset for communication and review actions.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.ChatIcon
 * @function ChatIcon
 * @description Renders a chat icon using the navbar/ic-chat.svg asset.
 * Commonly used for review buttons, comment indicators, and communication UI elements.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered ChatIcon component.
 *
 * @example
 * <ChatIcon size={16} />
 * <ChatIcon size={20} sx={{ color: 'primary.main' }} />
 */
export function ChatIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-chat.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
