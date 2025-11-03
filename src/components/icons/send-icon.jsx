import { forwardRef } from 'react';

import { Iconify } from '../iconify';

/**
 * @fileoverview SendIcon component using Solar forward-bold icon
 * @see https://github.com/pacificnm/cityartwalks.com/wiki/Solar-Icon-Integration
 * @namespace CityArtWalks.Components.Icons
 */

/**
 * SendIcon component using Solar forward-bold icon for submit/send actions
 * Used for form submissions, sending messages, and submit buttons
 *
 * @memberof CityArtWalks.Components.Icons
 * @see https://github.com/pacificnm/cityartwalks.com/wiki/Icons-Components
 * @param {object} props - Component props
 * @param {number} [props.width] - Icon width
 * @param {number} [props.height] - Icon height
 * @param {string} [props.sx] - Material-UI sx styles
 * @param {...object} other - Additional props passed to Iconify
 * @returns {JSX.Element} SendIcon component
 */
const SendIcon = forwardRef(({ width, height, sx, ...other }, ref) => (
  <Iconify ref={ref} icon="solar:forward-bold" width={width} height={height} sx={sx} {...other} />
));

SendIcon.displayName = 'SendIcon';

export { SendIcon };
