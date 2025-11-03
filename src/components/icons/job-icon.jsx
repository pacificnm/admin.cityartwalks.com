/**
 * @namespace CityArtWalks.Components.Icons.JobIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Job icon component using SvgColor for employment and career features.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.JobIcon
 * @function JobIcon
 * @description Renders a job icon using the SvgColor component.
 * Commonly used for job listings, career sections, and employment features.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered JobIcon component.
 *
 * @example
 * <JobIcon size={16} />
 * <JobIcon size={24} sx={{ color: 'info.main' }} />
 */
export function JobIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-job.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
