/**
 * @namespace CityArtWalks.Components.Icons.BlogIcon
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Icons
 * @description Blog icon component using SvgColor for displaying blog references.
 */

import { SvgColor } from 'src/components/svg-color';

/**
 * @memberof CityArtWalks.Components.Icons.BlogIcon
 * @function BlogIcon
 * @description Renders a blog icon using the SvgColor component.
 * Commonly used for blog navigation, blog posts, and content sections.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.size=24] - The size of the icon in pixels.
 * @param {Object} [props.sx={}] - Additional Material-UI sx styling props.
 * @returns {JSX.Element} The rendered BlogIcon component.
 *
 * @example
 * <BlogIcon size={16} />
 * <BlogIcon size={24} sx={{ color: 'info.main' }} />
 */
export function BlogIcon({ size = 24, sx = {}, ...props }) {
  return (
    <SvgColor
      src="/assets/icons/navbar/ic-blog.svg"
      width={size}
      sx={{ width: size, height: size, ...sx }}
      {...props}
    />
  );
}
