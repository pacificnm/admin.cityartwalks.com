/**
 * @file back-to-top.jsx
 * @description Animated back-to-top floating action button with scroll-triggered visibility
 * @namespace CityArtWalks.Components.Animate.BackToTop
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/BackToTop-Component.md} - BackToTop Component Documentation
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useScroll, useMotionValueEvent } from 'framer-motion';

import Fab from '@mui/material/Fab';
import SvgIcon from '@mui/material/SvgIcon';

// ----------------------------------------------------------------------

/**
 * Animated back-to-top floating action button component
 * Automatically shows/hides based on scroll position with smooth scrolling behavior
 *
 * @memberof CityArtWalks.Components.Animate.BackToTop
 * @param {Object} props - Component props
 * @param {number} [props.value=90] - Scroll percentage threshold to show button (0-100)
 * @param {Object|Array} [props.sx] - Material-UI sx prop for custom styling
 * @param {...Object} other - Additional props passed to Fab component
 * @returns {JSX.Element} Rendered back-to-top floating action button
 *
 * @example
 * // Basic usage with default threshold (90%)
 * <BackToTop />
 *
 * @example
 * // Custom threshold and styling
 * <BackToTop
 *   value={50}
 *   sx={{
 *     right: 16,
 *     bottom: 16,
 *     backgroundColor: 'primary.main'
 *   }}
 * />
 *
 * @example
 * // With custom positioning
 * <BackToTop
 *   value={75}
 *   sx={{
 *     right: { xs: 16, md: 24 },
 *     bottom: { xs: 80, md: 40 }, // Above bottom navigation
 *     width: 56,
 *     height: 56
 *   }}
 * />
 */
export function BackToTop({ value = 90, sx, ...other }) {
  const { scrollYProgress } = useScroll();

  const [show, setShow] = useState(false);

  /**
   * Scrolls to top of page with smooth animation
   * @returns {void}
   */
  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const isEnd = Math.floor(latest * 100) > value; // unit is %
    setShow(isEnd);
  });

  return (
    <Fab
      aria-label="Back to top"
      onClick={backToTop}
      sx={{
        width: 48,
        height: 48,
        position: 'fixed',
        transform: 'scale(0)',
        right: { xs: 24, md: 32 },
        bottom: { xs: 24, md: 32 },
        zIndex: (theme) => theme.zIndex.speedDial,
        transition: (theme) => theme.transitions.create(['transform']),
        ...(show && { transform: 'scale(1)' }),
        ...sx,
      }}
      {...other}
    >
      <SvgIcon>
        {/* https://icon-sets.iconify.design/solar/double-alt-arrow-up-bold-duotone/ */}
        <path
          fill="currentColor"
          d="M5 17.75a.75.75 0 0 1-.488-1.32l7-6a.75.75 0 0 1 .976 0l7 6A.75.75 0 0 1 19 17.75z"
          opacity="0.5"
        />
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M4.43 13.488a.75.75 0 0 0 1.058.081L12 7.988l6.512 5.581a.75.75 0 1 0 .976-1.138l-7-6a.75.75 0 0 0-.976 0l-7 6a.75.75 0 0 0-.081 1.057"
          clipRule="evenodd"
        />
      </SvgIcon>
    </Fab>
  );
}

/**
 * PropTypes for BackToTop component
 * @memberof CityArtWalks.Components.Animate.BackToTop
 */
BackToTop.propTypes = {
  /**
   * Scroll percentage threshold to show button (0-100)
   */
  value: PropTypes.number,

  /**
   * Material-UI sx prop for custom styling
   */
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
