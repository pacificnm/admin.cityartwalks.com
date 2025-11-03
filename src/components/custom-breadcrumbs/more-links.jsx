/**
 * @file more-links.jsx
 * @description Additional expandable links component for breadcrumb navigation
 * @namespace CityArtWalks.Components.CustomBreadcrumbs.MoreLinks
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/MoreLinks-Component.md} - MoreLinks Component Documentation
 */

import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Additional expandable links component for breadcrumb navigation
 * Renders a vertical list of external links that open in new tabs
 *
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.MoreLinks
 * @param {Object} props - Component props
 * @param {Array<string>} [props.links=[]] - Array of URL strings to display as external links
 * @param {Object|Array} [props.sx] - Material-UI sx prop for custom styling
 * @param {...Object} other - Additional props passed to the root ul element
 * @returns {JSX.Element} Rendered list of external links
 *
 * @example
 * // Basic more links with URLs
 * <MoreLinks
 *   links={[
 *     'https://example.com/about',
 *     'https://example.com/contact',
 *     'https://example.com/help'
 *   ]}
 * />
 *
 * @example
 * // With custom styling
 * <MoreLinks
 *   links={[
 *     'https://artist-portfolio.com',
 *     'https://artist-social.com'
 *   ]}
 *   sx={{
 *     mt: 2,
 *     '& a': {
 *       color: 'primary.main',
 *       textDecoration: 'underline'
 *     }
 *   }}
 * />
 *
 * @example
 * // In breadcrumb context
 * <CustomBreadcrumbs
 *   heading="Artist Profile"
 *   links={[...breadcrumbLinks]}
 *   moreLinks={[
 *     'https://artist-website.com',
 *     'https://artist-instagram.com'
 *   ]}
 * />
 */
export function MoreLinks({ links, sx, ...other }) {
  return (
    <MoreLinksRoot sx={sx} {...other}>
      {links?.map((href) => (
        <li key={href}>
          <Link href={href} variant="body2" target="_blank" rel="noopener noreferrer">
            {href}
          </Link>
        </li>
      ))}
    </MoreLinksRoot>
  );
}

/**
 * PropTypes for MoreLinks component
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.MoreLinks
 */
MoreLinks.propTypes = {
  /**
   * Array of URL strings to display as external links
   */
  links: PropTypes.arrayOf(PropTypes.string),

  /**
   * Material-UI sx prop for custom styling
   */
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// ----------------------------------------------------------------------

/**
 * Styled unordered list container for external links
 * Displays links in a vertical column layout with flexbox
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.MoreLinks
 */
const MoreLinksRoot = styled('ul')(() => ({
  display: 'flex',
  flexDirection: 'column',
  '& > li': { display: 'flex' },
}));
