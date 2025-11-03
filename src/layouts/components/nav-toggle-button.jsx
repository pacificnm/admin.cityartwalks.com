/**
 * Navigation Toggle Button Component - Layout Navigation Control
 *
 * This component provides a toggle button for collapsing and expanding the navigation sidebar
 * in the City Art Walks application layout. The button dynamically positions itself based on
 * the current navigation state (mini or full) and provides smooth transitions between states.
 * It integrates with the overall layout system's CSS custom properties for consistent theming
 * and responsive behavior across different screen sizes and navigation configurations.
 *
 * @fileoverview Navigation toggle button for sidebar collapse/expand functionality
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Layouts.Components
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Navigation-System|Navigation System}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Layout-Components|Layout Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/user/User-Components|User Interface Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Button-Components|Button Components}
 */

import { varAlpha } from 'minimal-shared/utils';

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Navigation Toggle Button Component
 *
 * Renders a floating toggle button that allows users to collapse or expand the navigation
 * sidebar. The button automatically positions itself at the edge of the navigation panel
 * and displays the appropriate arrow icon based on the current navigation state. Features
 * smooth transitions, hover effects, and RTL language support for international accessibility.
 *
 * Key Features:
 * - Dynamic positioning based on navigation state (mini/full width)
 * - Smooth CSS transitions matching layout animation timing
 * - Hover effects with theme-aware color changes
 * - RTL (Right-to-Left) language support with icon mirroring
 * - Integration with Material-UI theme system
 * - Responsive design with CSS custom properties
 * - Accessibility-compliant interactive states
 *
 * Design Patterns:
 * - Follows Material Design button interaction patterns
 * - Uses layout CSS custom properties for consistent positioning
 * - Implements theme-aware styling with color tokens
 * - Provides visual feedback through hover and focus states
 *
 * @memberof CityArtWalks.Layouts.Components
 * @function NavToggleButton
 * @param {Object} props - The component props
 * @param {boolean} props.isNavMini - Whether the navigation is in mini/collapsed state
 * @param {Object} [props.sx] - Additional Material-UI sx styling props for customization
 * @param {Object} [props.other] - Additional props spread to the root IconButton component
 * @returns {JSX.Element} The rendered navigation toggle button with dynamic positioning and icons
 *
 * @throws {Error} Renders error boundary fallback if Iconify component fails to load
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Navigation-System|Navigation System}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Layout-Components|Layout Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Iconify-Components|Iconify Components}
 * @see {@link https://mui.com/material-ui/react-button/#icon-button|Material-UI IconButton}
 *
 * @example
 * // Basic usage with navigation state
 * import { NavToggleButton } from 'src/layouts/components/nav-toggle-button';
 *
 * function LayoutHeader({ isNavMini, onToggleNav }) {
 *   return (
 *     <header>
 *       <NavToggleButton
 *         isNavMini={isNavMini}
 *         onClick={onToggleNav}
 *       />
 *     </header>
 *   );
 * }
 *
 * @example
 * // With custom styling and additional props
 * <NavToggleButton
 *   isNavMini={navigationCollapsed}
 *   onClick={handleNavigationToggle}
 *   sx={{
 *     zIndex: 1300,
 *     '&:hover': {
 *       bgcolor: 'primary.lighter'
 *     }
 *   }}
 *   aria-label="Toggle navigation sidebar"
 *   data-testid="nav-toggle-button"
 * />
 *
 * @example
 * // Integration with layout context
 * import { useLayout } from 'src/contexts/layout-context';
 *
 * function NavigationControls() {
 *   const { isNavMini, toggleNavMini } = useLayout();
 *
 *   return (
 *     <NavToggleButton
 *       isNavMini={isNavMini}
 *       onClick={toggleNavMini}
 *     />
 *   );
 * }
 *
 * @example
 * // Styling behavior and CSS custom properties:
 * // - Uses --layout-nav-zIndex for proper layering
 * // - Positions relative to --layout-nav-mini-width (collapsed state)
 * // - Positions relative to --layout-nav-vertical-width (expanded state)
 * // - Transitions use --layout-transition-duration and --layout-transition-easing
 * // - Top position calculated from --layout-header-desktop-height
 *
 * @example
 * // Icon behavior and accessibility:
 * // - Shows forward arrow (solar:arrow-right-bold) when navigation is collapsed
 * // - Shows backward arrow (solar:arrow-left-bold) when navigation is expanded
 * // - Icons automatically flip for RTL languages using CSS transform: scaleX(-1)
 * // - 16px icon size for optimal visibility and touch target compliance
 * // - Inherits theme colors for consistent visual integration
 *
 * @example
 * // Animation and transition details:
 * // - Button position animates smoothly when navigation state changes
 * // - Hover effects transition color and background with theme timing
 * // - Position transitions use layout-specific easing for consistent feel
 * // - All animations respect user's reduced motion preferences
 * // - Z-index ensures button stays above navigation content during transitions
 */
export function NavToggleButton({ isNavMini, sx, ...other }) {
  return (
    <IconButton
      size="small"
      sx={[
        (theme) => ({
          p: 0.5,
          position: 'absolute',
          color: 'action.active',
          bgcolor: 'background.default',
          transform: 'translate(-50%, -50%)',
          zIndex: 'var(--layout-nav-zIndex)',
          top: 'calc(var(--layout-header-desktop-height) / 2)',
          left: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
          border: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
          transition: theme.transitions.create(['left'], {
            easing: 'var(--layout-transition-easing)',
            duration: 'var(--layout-transition-duration)',
          }),
          '&:hover': {
            color: 'text.primary',
            bgcolor: 'background.neutral',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify
        width={16}
        icon={isNavMini ? 'solar:arrow-right-bold' : 'solar:arrow-left-bold'}
        sx={(theme) => ({
          ...(theme.direction === 'rtl' && { transform: 'scaleX(-1)' }),
        })}
      />
    </IconButton>
  );
}
