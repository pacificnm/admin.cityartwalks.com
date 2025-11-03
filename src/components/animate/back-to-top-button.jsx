/**
 * @file back-to-top-button.jsx
 * @description Enhanced back-to-top button component with custom render support and debouncing
 * @namespace CityArtWalks.Components.Animate.BackToTopButton
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/BackToTopButton-Component.md} - BackToTopButton Component Documentation
 */

import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import { useBackToTop } from 'minimal-shared/hooks';

import Fab from '@mui/material/Fab';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

/**
 * Enhanced back-to-top button component with customizable rendering and debouncing
 * Uses minimal-shared hook for scroll tracking with optional custom button rendering
 *
 * @memberof CityArtWalks.Components.Animate.BackToTopButton
 * @param {Object} props - Component props
 * @param {Object|Array} [props.sx] - Material-UI sx prop for custom styling
 * @param {boolean} [props.isDebounce] - Whether to debounce scroll events for performance
 * @param {Function} [props.renderButton] - Custom render function for button element
 * @param {string} [props.scrollThreshold='90%'] - Scroll threshold to show button (percentage or pixels)
 * @param {...Object} other - Additional props passed to Fab component (when not using custom render)
 * @returns {JSX.Element} Rendered back-to-top button component
 *
 * @example
 * // Basic usage with default Fab button
 * <BackToTopButton />
 *
 * @example
 * // Custom threshold and debouncing
 * <BackToTopButton
 *   scrollThreshold="50%"
 *   isDebounce={true}
 *   sx={{ right: 16, bottom: 80 }}
 * />
 *
 * @example
 * // Custom button rendering
 * <BackToTopButton
 *   renderButton={(isVisible) => (
 *     <Button
 *       variant="contained"
 *       sx={{
 *         position: 'fixed',
 *         bottom: 16,
 *         right: 16,
 *         opacity: isVisible ? 1 : 0,
 *         transition: 'opacity 0.3s'
 *       }}
 *     >
 *       Back to Top
 *     </Button>
 *   )}
 * />
 *
 * @example
 * // With pixel-based threshold
 * <BackToTopButton
 *   scrollThreshold="500px"
 *   sx={{
 *     backgroundColor: 'secondary.main',
 *     '&:hover': { backgroundColor: 'secondary.dark' }
 *   }}
 * />
 */
export function BackToTopButton({
  sx,
  isDebounce,
  renderButton,
  scrollThreshold = '90%',
  ...other
}) {
  const { onBackToTop, isVisible } = useBackToTop(scrollThreshold, isDebounce);

  if (renderButton) {
    return cloneElement(renderButton(isVisible), {
      onClick: onBackToTop,
    });
  }

  return (
    <Fab
      aria-label="Back to top"
      onClick={onBackToTop}
      sx={[
        (theme) => ({
          width: 48,
          height: 48,
          position: 'fixed',
          transform: 'scale(0)',
          right: { xs: 24, md: 32 },
          bottom: { xs: 24, md: 32 },
          zIndex: theme.zIndex.speedDial,
          transition: theme.transitions.create(['transform']),
          ...(isVisible && { transform: 'scale(1)' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify width={24} icon="solar:double-alt-arrow-up-bold-duotone" />
    </Fab>
  );
}

/**
 * PropTypes for BackToTopButton component
 * @memberof CityArtWalks.Components.Animate.BackToTopButton
 */
BackToTopButton.propTypes = {
  /**
   * Material-UI sx prop for custom styling
   */
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

  /**
   * Whether to debounce scroll events for performance
   */
  isDebounce: PropTypes.bool,

  /**
   * Custom render function for button element
   */
  renderButton: PropTypes.func,

  /**
   * Scroll threshold to show button (percentage or pixels)
   */
  scrollThreshold: PropTypes.string,
};
