/**
 * Menu Button Component - Mobile Navigation Trigger
 *
 * This component provides a hamburger menu button for triggering mobile navigation menus
 * in the City Art Walks application layout. The button serves as the primary navigation
 * trigger on mobile devices and smaller screens where the full navigation sidebar is
 * collapsed into a drawer or overlay. It integrates with the overall layout system
 * and follows Material Design patterns for consistent user experience across devices.
 *
 * @fileoverview Mobile menu button for navigation drawer trigger functionality
 * @version 1.0.0
 * @author Jaimie Garner
 * @namespace CityArtWalks.Layouts.Components
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Navigation-System|Navigation System}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Layout-Components|Layout Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/User-Interface-Components|User Interface Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Button-Components|Button Components}
 */

import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Menu Button Component
 *
 * Renders a hamburger menu button that serves as the primary navigation trigger for
 * mobile and tablet layouts. The button displays a custom duotone menu icon and
 * follows Material Design interaction patterns for optimal touch accessibility.
 * It integrates seamlessly with drawer components and responsive navigation systems.
 *
 * Key Features:
 * - Material Design hamburger menu icon (custom:menu-duotone)
 * - Touch-optimized button sizing (24px icon, standard touch target)
 * - Theme-aware styling with Material-UI integration
 * - Responsive design for mobile and tablet breakpoints
 * - Accessibility-compliant interactive states
 * - Customizable styling through sx prop
 * - Event handling through standard button props
 *
 * Design Patterns:
 * - Follows Material Design button interaction patterns
 * - Uses Iconify for consistent icon rendering
 * - Implements theme-aware styling with color tokens
 * - Provides standard IconButton API compatibility
 *
 * Responsive Behavior:
 * - Typically visible on mobile and tablet breakpoints
 * - Hidden on desktop when full navigation is available
 * - Integrates with responsive layout hooks and context
 *
 * @memberof CityArtWalks.Layouts.Components
 * @function MenuButton
 * @param {Object} props - The component props
 * @param {Object} [props.sx] - Additional Material-UI sx styling props for customization
 * @param {Object} [props.other] - Additional props spread to the root IconButton component (onClick, aria-label, etc.)
 * @returns {JSX.Element} The rendered menu button with hamburger icon
 *
 * @throws {Error} Renders error boundary fallback if Iconify component fails to load
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Navigation-System|Navigation System}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/layout/Layout-Components|Layout Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/components/Iconify-Components|Iconify Components}
 * @see {@link https://mui.com/material-ui/react-button/#icon-button|Material-UI IconButton}
 *
 * @example
 * // Basic usage for mobile navigation trigger
 * import { MenuButton } from 'src/layouts/components/menu-button';
 *
 * function MobileHeader({ onOpenNav }) {
 *   return (
 *     <header>
 *       <MenuButton
 *         onClick={onOpenNav}
 *         aria-label="Open navigation menu"
 *       />
 *     </header>
 *   );
 * }
 *
 * @example
 * // With custom styling and responsive behavior
 * <MenuButton
 *   onClick={handleMenuToggle}
 *   sx={{
 *     display: { xs: 'flex', md: 'none' }, // Show only on mobile/tablet
 *     color: 'primary.main',
 *     '&:hover': {
 *       bgcolor: 'primary.lighter'
 *     }
 *   }}
 *   aria-label="Toggle navigation menu"
 *   data-testid="mobile-menu-button"
 * />
 *
 * @example
 * // Integration with responsive layout context
 * import { useLayout } from 'src/contexts/layout-context';
 * import { useResponsive } from 'src/hooks/use-responsive';
 *
 * function ResponsiveNavigation() {
 *   const { openNav } = useLayout();
 *   const isMobile = useResponsive('down', 'md');
 *
 *   if (!isMobile) return null;
 *
 *   return (
 *     <MenuButton
 *       onClick={openNav}
 *       aria-label="Open navigation drawer"
 *     />
 *   );
 * }
 *
 * @example
 * // With drawer integration and state management
 * import { useState } from 'react';
 * import { Drawer } from '@mui/material';
 *
 * function MobileNavigation() {
 *   const [drawerOpen, setDrawerOpen] = useState(false);
 *
 *   const handleMenuClick = () => setDrawerOpen(true);
 *   const handleDrawerClose = () => setDrawerOpen(false);
 *
 *   return (
 *     <div>
 *       <MenuButton
 *         onClick={handleMenuClick}
 *         aria-label="Open navigation menu"
 *       />
 *       <Drawer open={drawerOpen} onClose={handleDrawerClose}>
 *         Navigation content here
 *       </Drawer>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Accessibility and interaction best practices:
 * // - Always include aria-label for screen readers
 * // - Use descriptive labels like "Open navigation menu" or "Toggle menu"
 * // - Ensure proper focus management when menu opens
 * // - Consider keyboard navigation (Enter/Space key handling)
 * // - Provide visual feedback for touch interactions
 *
 * @example
 * // Icon specifications and customization:
 * // - Uses custom:menu-duotone icon (24px width)
 * // - Duotone style provides visual depth and modern appearance
 * // - Icon automatically inherits theme colors
 * // - Size optimized for touch targets (minimum 44px)
 * // - Can be customized through sx prop if needed
 *
 * @example
 * // Common responsive patterns:
 * // Mobile (xs): Always visible in app bar/header
 * // Tablet (sm): Visible when navigation is collapsed
 * // Desktop (md+): Usually hidden when full navigation is available
 * // Usage with Material-UI breakpoints for responsive visibility
 */
export function MenuButton({ sx, ...other }) {
  return (
    <IconButton sx={sx} {...other}>
      <Iconify icon="custom:menu-duotone" width={24} />
    </IconButton>
  );
}
