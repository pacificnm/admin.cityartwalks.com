import { forwardRef } from 'react';

import { Iconify } from '../iconify';

/**
 * @fileoverview FullscreenExitIcon component using Solar quit-full-screen-square-outline icon
 * @see https://github.com/pacificnm/cityartwalks.com/wiki/Solar-Icon-Integration
 * @namespace CityArtWalks.Components.Icons
 */

/**
 * FullscreenExitIcon component using Solar quit-full-screen-square-outline icon for exit fullscreen actions
 * Used for exiting fullscreen mode, closing expanded content, and minimize controls
 *
 * @memberof CityArtWalks.Components.Icons
 * @see https://github.com/pacificnm/cityartwalks.com/wiki/Icons-Components
 * @param {object} props - Component props
 * @param {number} [props.width] - Icon width
 * @param {number} [props.height] - Icon height
 * @param {string} [props.sx] - Material-UI sx styles
 * @param {...object} other - Additional props passed to Iconify
 * @returns {JSX.Element} FullscreenExitIcon component
 */
const FullscreenExitIcon = forwardRef(({ width, height, sx, ...other }, ref) => (
  <Iconify
    ref={ref}
    icon="solar:quit-full-screen-square-outline"
    width={width}
    height={height}
    sx={sx}
    {...other}
  />
));

FullscreenExitIcon.displayName = 'FullscreenExitIcon';

export { FullscreenExitIcon };
