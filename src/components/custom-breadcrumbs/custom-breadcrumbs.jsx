/**
 * @file custom-breadcrumbs.jsx
 * @description Customizable breadcrumbs navigation component with back link, heading, and action support
 * @namespace CityArtWalks.Components.CustomBreadcrumbs
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/CustomBreadcrumbs-Component.md} - CustomBreadcrumbs Component Documentation
 */

import PropTypes from 'prop-types';

import Breadcrumbs from '@mui/material/Breadcrumbs';

import { BackLink } from './back-link';
import { MoreLinks } from './more-links';
import { BreadcrumbsLink } from './breadcrumb-link';
import {
  BreadcrumbsRoot,
  BreadcrumbsHeading,
  BreadcrumbsContent,
  BreadcrumbsContainer,
  BreadcrumbsSeparator,
} from './styles';

// ----------------------------------------------------------------------

/**
 * Customizable breadcrumbs navigation component with advanced features
 * Supports heading, back navigation, action buttons, and expandable more links
 *
 * @memberof CityArtWalks.Components.CustomBreadcrumbs
 * @param {Object} props - Component props
 * @param {Object|Array} [props.sx] - Material-UI sx prop for custom styling
 * @param {React.ReactNode} [props.action] - Action element (button, menu, etc.) displayed on the right
 * @param {string} [props.backHref] - URL for back navigation link
 * @param {React.ReactNode} [props.heading] - Page heading text or element
 * @param {Object} [props.slots={}] - Custom slot components for advanced customization
 * @param {React.ReactNode} [props.slots.breadcrumbs] - Custom breadcrumbs component override
 * @param {Array} [props.links=[]] - Array of breadcrumb link objects
 * @param {Array} [props.moreLinks=[]] - Array of additional expandable links
 * @param {Object} [props.slotProps={}] - Props passed to internal slot components
 * @param {Object} [props.slotProps.heading] - Props for heading container
 * @param {Object} [props.slotProps.breadcrumbs] - Props for breadcrumbs component
 * @param {Object} [props.slotProps.content] - Props for content container
 * @param {Object} [props.slotProps.container] - Props for main container
 * @param {Object} [props.slotProps.moreLinks] - Props for more links component
 * @param {boolean} [props.activeLast=false] - Whether the last breadcrumb should be clickable
 * @param {...Object} other - Additional props passed to root container
 * @returns {JSX.Element} Rendered custom breadcrumbs component
 *
 * @example
 * // Basic breadcrumbs with heading
 * <CustomBreadcrumbs
 *   heading="Dashboard"
 *   links={[
 *     { name: 'Home', href: '/' },
 *     { name: 'Artists', href: '/artists' },
 *     { name: 'John Doe' }
 *   ]}
 * />
 *
 * @example
 * // With back navigation and action
 * <CustomBreadcrumbs
 *   heading="Artist Details"
 *   backHref="/artists"
 *   action={
 *     <Button variant="contained">Edit Artist</Button>
 *   }
 *   links={[
 *     { name: 'Home', href: '/' },
 *     { name: 'Artists', href: '/artists' },
 *     { name: 'John Doe' }
 *   ]}
 * />
 *
 * @example
 * // With icons and more links
 * <CustomBreadcrumbs
 *   heading="Art Piece Gallery"
 *   links={[
 *     { name: 'Home', href: '/', icon: <HomeIcon /> },
 *     { name: 'Artists', href: '/artists', icon: <PersonIcon /> },
 *     { name: 'John Doe', href: '/artists/john-doe' },
 *     { name: 'Gallery' }
 *   ]}
 *   moreLinks={[
 *     { name: 'About Artist', href: '/artists/john-doe/about' },
 *     { name: 'Contact', href: '/artists/john-doe/contact' }
 *   ]}
 *   activeLast={true}
 * />
 */
export function CustomBreadcrumbs({
  sx,
  action,
  backHref,
  heading,
  slots = {},
  links = [],
  moreLinks = [],
  slotProps = {},
  activeLast = false,
  ...other
}) {
  const lastLink = links[links.length - 1]?.name;

  /**
   * Renders the heading section with optional back link
   * @returns {JSX.Element} Heading component with back navigation support
   */
  const renderHeading = () => (
    <BreadcrumbsHeading {...slotProps?.heading}>
      {backHref ? <BackLink href={backHref} label={heading} /> : heading}
    </BreadcrumbsHeading>
  );

  /**
   * Renders the breadcrumb navigation links
   * @returns {JSX.Element} Breadcrumbs component with navigation links
   */
  const renderLinks = () =>
    slots?.breadcrumbs ?? (
      <Breadcrumbs separator={<BreadcrumbsSeparator />} {...slotProps?.breadcrumbs}>
        {links.map((link, index) => (
          <BreadcrumbsLink
            key={link.name ?? index}
            icon={link.icon}
            href={link.href}
            name={link.name}
            disabled={link.name === lastLink && !activeLast}
          />
        ))}
      </Breadcrumbs>
    );

  /**
   * Renders expandable more links section
   * @returns {JSX.Element} MoreLinks component for additional navigation
   */
  const renderMoreLinks = () => <MoreLinks links={moreLinks} {...slotProps?.moreLinks} />;

  return (
    <BreadcrumbsRoot sx={sx} {...other}>
      <BreadcrumbsContainer {...slotProps?.container}>
        <BreadcrumbsContent {...slotProps?.content}>
          {(heading || backHref) && renderHeading()}
          {(!!links.length || slots?.breadcrumbs) && renderLinks()}
        </BreadcrumbsContent>
        {action}
      </BreadcrumbsContainer>

      {!!moreLinks?.length && renderMoreLinks()}
    </BreadcrumbsRoot>
  );
}

/**
 * PropTypes for CustomBreadcrumbs component
 * @memberof CityArtWalks.Components.CustomBreadcrumbs
 */
CustomBreadcrumbs.propTypes = {
  /**
   * Material-UI sx prop for custom styling
   */
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

  /**
   * Action element (button, menu, etc.) displayed on the right
   */
  action: PropTypes.node,

  /**
   * URL for back navigation link
   */
  backHref: PropTypes.string,

  /**
   * Page heading text or element
   */
  heading: PropTypes.node,

  /**
   * Custom slot components for advanced customization
   */
  slots: PropTypes.shape({
    /**
     * Custom breadcrumbs component override
     */
    breadcrumbs: PropTypes.node,
  }),

  /**
   * Array of breadcrumb link objects
   */
  links: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Display name for the breadcrumb
       */
      name: PropTypes.string,
      /**
       * URL for navigation
       */
      href: PropTypes.string,
      /**
       * Icon element to display
       */
      icon: PropTypes.node,
    })
  ),

  /**
   * Array of additional expandable links
   */
  moreLinks: PropTypes.arrayOf(PropTypes.string),

  /**
   * Props passed to internal slot components
   */
  slotProps: PropTypes.shape({
    /**
     * Props for heading container
     */
    heading: PropTypes.object,
    /**
     * Props for breadcrumbs component
     */
    breadcrumbs: PropTypes.object,
    /**
     * Props for content container
     */
    content: PropTypes.object,
    /**
     * Props for main container
     */
    container: PropTypes.object,
    /**
     * Props for more links component
     */
    moreLinks: PropTypes.object,
  }),

  /**
   * Whether the last breadcrumb should be clickable
   */
  activeLast: PropTypes.bool,
};
