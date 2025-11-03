/**
 * @file breadcrumb-link.jsx
 * @description Individual breadcrumb link component with icon support and disabled states
 * @namespace CityArtWalks.Components.CustomBreadcrumbs.BreadcrumbLink
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/BreadcrumbLink-Component.md} - BreadcrumbLink Component Documentation
 */

import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

/**
 * Individual breadcrumb link component with conditional navigation and icon support
 * Renders as clickable link when href is provided, otherwise as plain text
 *
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.BreadcrumbLink
 * @param {Object} props - Component props
 * @param {string} [props.href] - URL for navigation (makes link clickable)
 * @param {React.ReactNode} [props.icon] - Icon element to display before text
 * @param {string} props.name - Display text for the breadcrumb link
 * @param {boolean} [props.disabled=false] - Whether the link should be disabled
 * @param {...Object} other - Additional props passed to the root element
 * @returns {JSX.Element} Rendered breadcrumb link component
 *
 * @example
 * // Clickable breadcrumb link with icon
 * <BreadcrumbsLink
 *   href="/artists"
 *   icon={<PersonIcon />}
 *   name="Artists"
 * />
 *
 * @example
 * // Non-clickable current page breadcrumb
 * <BreadcrumbsLink
 *   name="John Doe"
 *   disabled={true}
 * />
 *
 * @example
 * // Simple clickable link without icon
 * <BreadcrumbsLink
 *   href="/dashboard"
 *   name="Dashboard"
 * />
 */
export function BreadcrumbsLink({ href, icon, name, disabled, ...other }) {
  /**
   * Renders the link content with optional icon and text
   * @returns {JSX.Element} Styled content container with icon and name
   */
  const renderContent = () => (
    <ItemRoot disabled={disabled} {...other}>
      {icon && <ItemIcon>{icon}</ItemIcon>}
      {name}
    </ItemRoot>
  );

  if (href) {
    return (
      <Link
        component={RouterLink}
        href={href}
        color="inherit"
        sx={{
          display: 'inline-flex',
          ...(disabled && { pointerEvents: 'none' }),
        }}
      >
        {renderContent()}
      </Link>
    );
  }

  return renderContent();
}

/**
 * PropTypes for BreadcrumbsLink component
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.BreadcrumbLink
 */
BreadcrumbsLink.propTypes = {
  /**
   * URL for navigation (makes link clickable)
   */
  href: PropTypes.string,

  /**
   * Icon element to display before text
   */
  icon: PropTypes.node,

  /**
   * Display text for the breadcrumb link
   */
  name: PropTypes.string.isRequired,

  /**
   * Whether the link should be disabled
   */
  disabled: PropTypes.bool,
};

// ----------------------------------------------------------------------

/**
 * Styled root container for breadcrumb link content
 * Handles typography, spacing, colors, and disabled states
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.BreadcrumbLink
 */
const ItemRoot = styled('div', {
  shouldForwardProp: (prop) => !['disabled', 'sx'].includes(prop),
})(({ disabled, theme }) => ({
  ...theme.typography.body2,
  alignItems: 'center',
  gap: theme.spacing(1),
  display: 'inline-flex',
  color: theme.vars.palette.text.primary,
  ...(disabled && {
    cursor: 'default',
    pointerEvents: 'none',
    color: theme.vars.palette.text.disabled,
  }),
}));

/**
 * Styled container for breadcrumb icons with SSR-safe sizing
 * Ensures consistent icon dimensions and proper display inheritance
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.BreadcrumbLink
 */
const ItemIcon = styled('span')(() => ({
  display: 'inherit',
  /**
   * As ':first-child' for ssr
   * https://github.com/emotion-js/emotion/issues/1105#issuecomment-1126025608
   */
  '& >:first-of-type:not(style):not(:first-of-type ~ *), & > style + *': {
    width: 20,
    height: 20,
  },
}));
