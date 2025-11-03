/**
 * @fileoverview IndexNow Refresh Button Component
 *
 * Reusable refresh button specifically designed for IndexNow-related interfaces.
 * Provides consistent styling, behavior, and accessibility across all IndexNow
 * dashboard components while maintaining Material-UI design patterns.
 *
 * @namespace CityArtWalks.Components.IndexNow
 * @version 1.0.0
 * @author Jaimie Garner
 * @since 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for button structure
 * @requires src/components/icons - Icon components library
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Components} - IndexNow Components Documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Design-System} - Design System Guidelines
 */

'use client';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { RefreshIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * IndexNow Refresh Button Component
 *
 * Standardized refresh button for IndexNow dashboard interfaces. Provides
 * consistent styling, loading states, and accessibility features across
 * all IndexNow-related components including lists, statistics, and processing views.
 *
 * @memberof CityArtWalks.Components.IndexNow
 * @function RefreshButton
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function called when button is pressed
 * @param {boolean} [props.loading=false] - Loading state indicator
 * @param {boolean} [props.disabled=false] - Disabled state for the button
 * @param {'small'|'medium'|'large'} [props.size='medium'] - Button size variant
 * @param {'contained'|'outlined'|'text'} [props.variant='outlined'] - Button style variant
 * @param {boolean} [props.iconOnly=false] - Whether to render as an icon-only button
 * @param {string} [props.title='Refresh'] - Tooltip/title text for accessibility
 * @param {string} [props.children='Refresh'] - Button text content
 * @param {Object} [props.sx] - Additional Material-UI styling overrides
 * @returns {JSX.Element} Refresh button component
 *
 * @example
 * // Basic usage in statistics view
 * <RefreshButton onClick={handleRefresh} />
 *
 * @example
 * // Icon-only button for toolbars
 * <RefreshButton onClick={handleRefresh} iconOnly />
 *
 * @example
 * // With loading state
 * <RefreshButton
 *   onClick={handleRefresh}
 *   loading={isRefreshing}
 *   disabled={isRefreshing}
 * />
 *
 * @example
 * // Compact size for toolbars
 * <RefreshButton
 *   onClick={handleRefresh}
 *   size="small"
 *   variant="text"
 * />
 *
 * @example
 * // Custom styling
 * <RefreshButton
 *   onClick={handleRefresh}
 *   sx={{ ml: 2 }}
 *   title="Refresh IndexNow data"
 * />
 */
export function RefreshButton({
  onClick,
  loading = false,
  disabled = false,
  size = 'medium',
  variant = 'outlined',
  iconOnly = false,
  title = 'Refresh',
  children = 'Refresh',
  sx,
  ...other
}) {
  if (iconOnly) {
    return (
      <IconButton
        onClick={onClick}
        disabled={disabled || loading}
        title={title}
        size={size}
        sx={sx}
        {...other}
      >
        <RefreshIcon />
      </IconButton>
    );
  }

  return (
    <Button
      onClick={onClick}
      startIcon={<RefreshIcon />}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      title={title}
      sx={sx}
      {...other}
    >
      {children}
    </Button>
  );
}
