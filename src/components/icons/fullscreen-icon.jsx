import { forwardRef } from 'react';

import { Iconify } from '../iconify';

/**
 * @fileoverview FullscreenIcon component using Solar full-screen-square-outline icon
 * @see https://github.com/pacificnm/cityartwalks.com/wiki/Solar-Icon-Integration
 * @namespace CityArtWalks.Components.Icons
 */

/**
 * FullscreenIcon component using Solar full-screen-square-outline icon for fullscreen actions
 * Used for expanding content to fullscreen, modal dialogs, and maximize controls
 *
 * @memberof CityArtWalks.Components.Icons
 * @see https://github.com/pacificnm/cityartwalks.com/wiki/Icons-Components
 * @param {object} props - Component props
 * @param {number} [props.width] - Icon width
 * @param {number} [props.height] - Icon height
 * @param {string} [props.sx] - Material-UI sx styles
 * @param {...object} other - Additional props passed to Iconify
 * @returns {JSX.Element} FullscreenIcon component
 */
const FullscreenIcon = forwardRef(({ width, height, sx, ...other }, ref) => (
  <Iconify
    ref={ref}
    icon="solar:full-screen-square-outline"
    width={width}
    height={height}
    sx={sx}
    {...other}
  />
));

FullscreenIcon.displayName = 'FullscreenIcon';

export { FullscreenIcon };
