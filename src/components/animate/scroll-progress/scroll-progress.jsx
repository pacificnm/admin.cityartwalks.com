/**
 * @file scroll-progress.jsx
 * @description Animated scroll progress component with circular and linear variants using Framer Motion for smooth animations
 * @namespace CityArtWalks.Components.Animate.ScrollProgress
 * @version 2.0.0
 * @author CityArtWalks Team
 * @see {@link https://cityartwalks.com.wiki/ScrollProgress-Component.md} - ScrollProgress Component Documentation
 */

import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { mergeClasses } from 'minimal-shared/utils';
import { m, useSpring, useTransform } from 'framer-motion';

import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import { styled, useTheme } from '@mui/material/styles';

import { createClasses } from 'src/theme/create-classes';

// ----------------------------------------------------------------------

/**
 * CSS classes for scroll progress component styling
 * @memberof CityArtWalks.Components.Animate.ScrollProgress
 * @type {Object}
 * @property {string} circular - Classes for circular progress variant
 * @property {string} linear - Classes for linear progress variant
 */
export const scrollProgressClasses = {
  circular: createClasses('scroll__progress__circular'),
  linear: createClasses('scroll__progress__linear'),
};

/**
 * Animated scroll progress component with circular and linear variants
 * Provides visual feedback for scroll position using Framer Motion animations
 *
 * @memberof CityArtWalks.Components.Animate.ScrollProgress
 * @param {Object} props - Component props
 * @param {Object|Array} [props.sx] - Material-UI sx prop for custom styling
 * @param {number} [props.size] - Size of the progress indicator (defaults: 64 for circular, 3 for linear)
 * @param {boolean} [props.portal=false] - Whether to render in a portal
 * @param {string} [props.variant='linear'] - Progress variant ('circular' or 'linear')
 * @param {Object} [props.slotProps] - Props for internal slots
 * @param {Object} [props.slotProps.wrapper] - Props for wrapper Box component
 * @param {string} [props.className] - Additional CSS class names
 * @param {number} [props.thickness=3.6] - Thickness of circular progress stroke
 * @param {string} [props.whenScroll='y'] - Scroll direction ('x' or 'y')
 * @param {string} [props.color='primary'] - Color theme ('primary', 'secondary', 'inherit', etc.)
 * @param {Object} props.progress - Framer Motion scroll progress value
 * @param {...Object} other - Additional props passed to root element
 * @returns {JSX.Element} Rendered scroll progress component
 *
 * @example
 * // Linear progress bar
 * <ScrollProgress
 *   variant="linear"
 *   progress={scrollYProgress}
 *   color="primary"
 *   size={4}
 * />
 *
 * @example
 * // Circular progress indicator
 * <ScrollProgress
 *   variant="circular"
 *   progress={scrollYProgress}
 *   size={80}
 *   thickness={4}
 *   portal
 * />
 */
export function ScrollProgress({
  sx,
  size,
  portal,
  variant,
  slotProps,
  className,
  thickness = 3.6,
  whenScroll = 'y',
  color = 'primary',
  progress: progressProps,
  ...other
}) {
  const theme = useTheme();

  const isRtl = theme.direction === 'rtl';

  const transformProgress = useTransform(progressProps, [0, -1], [0, 1]);

  const progress = isRtl && whenScroll === 'x' ? transformProgress : progressProps;

  const scaleX = useSpring(progress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const progressSize = variant === 'circular' ? (size ?? 64) : (size ?? 3);

  /**
   * Renders circular progress indicator using SVG
   * @returns {JSX.Element} Circular progress SVG element
   */
  const renderCircular = () => (
    <CircularRoot
      viewBox={`0 0 ${progressSize} ${progressSize}`}
      xmlns="http://www.w3.org/2000/svg"
      className={mergeClasses([scrollProgressClasses.circular, className])}
      sx={[
        {
          width: progressSize,
          height: progressSize,
          ...(color !== 'inherit' && { color: theme.vars.palette[color].main }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <circle
        cx={progressSize / 2}
        cy={progressSize / 2}
        r={progressSize / 2 - thickness - 4}
        strokeWidth={thickness}
        strokeOpacity={0.2}
      />

      <m.circle
        cx={progressSize / 2}
        cy={progressSize / 2}
        r={progressSize / 2 - thickness - 4}
        strokeWidth={thickness}
        style={{ pathLength: progress }}
      />
    </CircularRoot>
  );

  /**
   * Renders linear progress bar using animated div
   * @returns {JSX.Element} Linear progress div element
   */
  const renderLinear = () => (
    <LinearRoot
      className={mergeClasses([scrollProgressClasses.linear, className])}
      sx={[
        {
          height: progressSize,
          ...(color !== 'inherit' && {
            background: `linear-gradient(135deg, ${theme.vars.palette[color].light}, ${theme.vars.palette[color].main})`,
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      style={{ scaleX }}
      {...other}
    />
  );

  const PortalWrapper = portal ? Portal : Fragment;

  return (
    <PortalWrapper>
      <Box {...slotProps?.wrapper}>
        {variant === 'circular' ? renderCircular() : renderLinear()}
      </Box>
    </PortalWrapper>
  );
}

/**
 * PropTypes for ScrollProgress component
 * @memberof CityArtWalks.Components.Animate.ScrollProgress
 */
ScrollProgress.propTypes = {
  /**
   * Material-UI sx prop for custom styling
   */
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

  /**
   * Size of the progress indicator (defaults: 64 for circular, 3 for linear)
   */
  size: PropTypes.number,

  /**
   * Whether to render in a portal
   */
  portal: PropTypes.bool,

  /**
   * Progress variant ('circular' or 'linear')
   */
  variant: PropTypes.oneOf(['circular', 'linear']),

  /**
   * Props for internal slots
   */
  slotProps: PropTypes.shape({
    /**
     * Props for wrapper Box component
     */
    wrapper: PropTypes.object,
  }),

  /**
   * Additional CSS class names
   */
  className: PropTypes.string,

  /**
   * Thickness of circular progress stroke
   */
  thickness: PropTypes.number,

  /**
   * Scroll direction ('x' or 'y')
   */
  whenScroll: PropTypes.oneOf(['x', 'y']),

  /**
   * Color theme ('primary', 'secondary', 'inherit', etc.)
   */
  color: PropTypes.string,

  /**
   * Framer Motion scroll progress value
   */
  progress: PropTypes.object.isRequired,
};

// ----------------------------------------------------------------------

/**
 * Styled SVG component for circular progress indicator
 * Rotated -90 degrees to start from top position
 * @memberof CityArtWalks.Components.Animate.ScrollProgress
 */
const CircularRoot = styled(m.svg)(({ theme }) => ({
  transform: 'rotate(-90deg)',
  color: theme.vars.palette.text.primary,
  circle: { fill: 'none', strokeDashoffset: 0, stroke: 'currentColor' },
}));

/**
 * Styled div component for linear progress bar
 * Fixed positioning for overlay progress indication
 * @memberof CityArtWalks.Components.Animate.ScrollProgress
 */
const LinearRoot = styled(m.div)(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  transformOrigin: '0%',
  backgroundColor: theme.vars.palette.text.primary,
}));
