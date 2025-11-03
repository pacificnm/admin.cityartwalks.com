import { forwardRef } from 'react';

import { Iconify } from '../iconify';

/**
 * @fileoverview EmojiIcon component using Solar like-bold icon as emoji replacement
 * @see https://github.com/pacificnm/cityartwalks.com/wiki/Solar-Icon-Integration
 * @namespace CityArtWalks.Components.Icons
 */

/**
 * EmojiIcon component using Solar like-bold icon as emoji/reaction icon
 * Used for chat emoji buttons, comment reactions, and general emoji UI elements
 *
 * @memberof CityArtWalks.Components.Icons
 * @see https://github.com/pacificnm/cityartwalks.com/wiki/Icons-Components
 * @param {object} props - Component props
 * @param {number} [props.width] - Icon width
 * @param {number} [props.height] - Icon height
 * @param {string} [props.sx] - Material-UI sx styles
 * @param {...object} other - Additional props passed to Iconify
 * @returns {JSX.Element} EmojiIcon component
 */
const EmojiIcon = forwardRef(({ width, height, sx, ...other }, ref) => (
  <Iconify ref={ref} icon="solar:like-bold" width={width} height={height} sx={sx} {...other} />
));

EmojiIcon.displayName = 'EmojiIcon';

export { EmojiIcon };
