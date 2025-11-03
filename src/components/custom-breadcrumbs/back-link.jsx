/**
 * @file back-link.jsx
 * @description Back navigation link component with left arrow icon and hover effects
 * @namespace CityArtWalks.Components.CustomBreadcrumbs.BackLink
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/BackLink-Component.md} - BackLink Component Documentation
 */

import PropTypes from 'prop-types';

import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { ArrowLeftIcon } from 'src/components/icons';

import { iconifyClasses } from '../iconify';

// ----------------------------------------------------------------------

/**
 * Back navigation link component with animated left arrow icon
 * Provides consistent back navigation UI with hover effects and responsive spacing
 *
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.BackLink
 * @param {Object} props - Component props
 * @param {Object|Array} [props.sx] - Material-UI sx prop for custom styling
 * @param {React.ReactNode} props.label - Text label displayed next to the arrow icon
 * @param {...Object} other - Additional props passed to Link component (including href)
 * @returns {JSX.Element} Rendered back navigation link with arrow icon
 *
 * @example
 * // Basic back link
 * <BackLink
 *   href="/artists"
 *   label="Back to Artists"
 * />
 *
 * @example
 * // With custom styling
 * <BackLink
 *   href="/dashboard"
 *   label="Dashboard"
 *   sx={{
 *     fontSize: '1.1rem',
 *     fontWeight: 'medium',
 *     color: 'primary.main'
 *   }}
 * />
 *
 * @example
 * // In breadcrumb heading context
 * <CustomBreadcrumbs
 *   heading={
 *     <BackLink
 *       href="/artists/john-doe"
 *       label="Artist Profile"
 *     />
 *   }
 * />
 */
export function BackLink({ sx, label, ...other }) {
  return (
    <Link
      component={RouterLink}
      color="inherit"
      underline="none"
      sx={[
        (theme) => ({
          verticalAlign: 'middle',
          [`& .${iconifyClasses.root}`]: {
            verticalAlign: 'inherit',
            transform: 'translateY(-2px)',
            ml: {
              xs: '-14px',
              md: '-18px',
            },
            transition: theme.transitions.create(['opacity'], {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.sharp,
            }),
          },
          '&:hover': {
            [`& .${iconifyClasses.root}`]: {
              opacity: 0.48,
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <ArrowLeftIcon size={18} />
      {label}
    </Link>
  );
}

/**
 * PropTypes for BackLink component
 * @memberof CityArtWalks.Components.CustomBreadcrumbs.BackLink
 */
BackLink.propTypes = {
  /**
   * Material-UI sx prop for custom styling
   */
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

  /**
   * Text label displayed next to the arrow icon
   */
  label: PropTypes.node.isRequired,
};
