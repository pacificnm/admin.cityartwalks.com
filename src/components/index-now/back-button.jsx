/**
 * @fileoverview IndexNow Back Button Component
 *
 * Reusable navigation button specifically designed for IndexNow-related interfaces.
 * Provides consistent back navigation styling and behavior across all IndexNow
 * dashboard components while maintaining Material-UI design patterns.
 *
 * @namespace CityArtWalks.Components.IndexNow
 * @version 1.0.0
 * @author Jaimie Garner
 * @since 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for button structure
 * @requires src/routes/components - RouterLink for navigation
 * @requires src/components/icons - Icon components library
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Components} - IndexNow Components Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Design-System} - Design System Guidelines
 */

'use client';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { ArrowLeftIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * IndexNow Back Button Component
 *
 * Standardized back navigation button for IndexNow dashboard interfaces. Provides
 * consistent styling, routing behavior, and accessibility features across
 * all IndexNow-related components including detail views, statistics, and processing views.
 *
 * @memberof CityArtWalks.Components.IndexNow
 * @function BackButton
 * @param {Object} props - Component props
 * @param {string} props.href - Navigation URL path for back button
 * @param {string} [props.children='Back to List'] - Button text content
 * @param {'small'|'medium'|'large'} [props.size='small'] - Button size variant
 * @param {'contained'|'outlined'|'text'} [props.variant='outlined'] - Button style variant
 * @param {boolean} [props.disabled=false] - Disabled state for the button
 * @param {Object} [props.sx] - Additional Material-UI styling overrides
 * @returns {JSX.Element} Back navigation button component
 *
 * @example
 * // Basic usage in statistics view
 * <BackButton href={paths.dashboard.indexNow.root} />
 *
 * @example
 * // Custom text and styling
 * <BackButton
 *   href={paths.dashboard.indexNow.root}
 *   size="medium"
 *   variant="text"
 *   sx={{ mb: 2 }}
 * >
 *   Back to Dashboard
 * </BackButton>
 *
 * @example
 * // Disabled state
 * <BackButton
 *   href={paths.dashboard.indexNow.root}
 *   disabled={isLoading}
 * />
 */
export function BackButton({
  href,
  children = 'Back to List',
  size = 'small',
  variant = 'outlined',
  disabled = false,
  sx,
  ...other
}) {
  return (
    <Button
      component={RouterLink}
      href={href}
      startIcon={<ArrowLeftIcon />}
      variant={variant}
      size={size}
      disabled={disabled}
      sx={sx}
      {...other}
    >
      {children}
    </Button>
  );
}
