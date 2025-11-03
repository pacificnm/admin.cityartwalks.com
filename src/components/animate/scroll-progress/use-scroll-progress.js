/**
 * @file use-scroll-progress.js
 * @description React hook for tracking scroll progress with Framer Motion integration
 * @namespace CityArtWalks.Components.Animate.ScrollProgress.Hooks
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/ScrollProgress-Hooks.md} - ScrollProgress Hooks Documentation
 */

'use client';

import { useRef, useMemo } from 'react';
import { useScroll } from 'framer-motion';

// ----------------------------------------------------------------------

/**
 * Custom hook for tracking scroll progress with Framer Motion
 * Provides scroll progress values for both X and Y axes with optional container targeting
 *
 * @memberof CityArtWalks.Components.Animate.ScrollProgress.Hooks
 * @param {string} [target='document'] - Scroll target ('document' for window or 'container' for element)
 * @returns {Object} Scroll progress tracking object
 * @returns {React.RefObject} returns.elementRef - Ref to attach to container element (when target='container')
 * @returns {MotionValue} returns.scrollXProgress - Horizontal scroll progress (0-1)
 * @returns {MotionValue} returns.scrollYProgress - Vertical scroll progress (0-1)
 *
 * @example
 * // Track document scroll progress
 * const { scrollYProgress } = useScrollProgress();
 *
 * @example
 * // Track container scroll progress
 * const { elementRef, scrollYProgress } = useScrollProgress('container');
 * return (
 *   <div ref={elementRef} style={{ height: '300px', overflow: 'auto' }}>
 *     <ScrollProgress progress={scrollYProgress} />
 *     <div style={{ height: '1000px' }}>Long content...</div>
 *   </div>
 * );
 *
 * @example
 * // Use both X and Y progress
 * const { scrollXProgress, scrollYProgress } = useScrollProgress();
 * return (
 *   <>
 *     <ScrollProgress progress={scrollYProgress} variant="linear" />
 *     <ScrollProgress progress={scrollXProgress} variant="circular" />
 *   </>
 * );
 */
export function useScrollProgress(target = 'document') {
  const elementRef = useRef(null);

  const options = { container: elementRef };

  const { scrollYProgress, scrollXProgress } = useScroll(
    target === 'container' ? options : undefined
  );

  const memoizedValue = useMemo(
    () => ({ elementRef, scrollXProgress, scrollYProgress }),
    [elementRef, scrollXProgress, scrollYProgress]
  );

  return memoizedValue;
}
