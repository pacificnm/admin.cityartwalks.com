/**
 * @namespace CityArtWalks.Components.Icons.AwardIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Award icon component using solar:cup-star-bold for achievements and recognition.
 */

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Icons.AwardIcon
 * @function AwardIcon
 * @description Renders an award icon using the solar:cup-star-bold icon.
 * Commonly used for awards, achievements, featured items, and recognition badges.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered AwardIcon component.
 *
 * @example
 * <AwardIcon />
 * <AwardIcon size={20} sx={{ color: 'warning.main' }} />
 */
export function AwardIcon({ size = 24, sx = {}, ...props }) {
  return (
    <Iconify
      icon="solar:cup-star-bold"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
