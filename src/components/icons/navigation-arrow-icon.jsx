'use client';

import { forwardRef } from 'react';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

/**
 * Navigation arrow icon component
 *
 * @namespace CityArtWalks.Components.Icons
 * @memberof CityArtWalks.Components.Icons
 *
 * @description Dedicated component for navigation arrow icons.
 * Replaces direct Iconify usage for directional arrows throughout layouts and forms.
 *
 * @param {Object} props - Component props
 * @param {'left'|'right'|'up'|'down'} props.direction - Arrow direction
 * @param {number} [props.width=20] - Icon width
 * @param {number} [props.height] - Icon height (defaults to width)
 * @param {Object} [props.sx] - Material-UI sx prop for styling
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Navigation arrow icon
 *
 * @example
 * // Back button arrow
 * <NavigationArrowIcon direction="left" />
 *
 * @example
 * // Dropdown arrow
 * <NavigationArrowIcon direction="down" width={16} />
 *
 * @example
 * // In a button
 * <Button startIcon={<NavigationArrowIcon direction="left" />}>
 *   Back
 * </Button>
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Icons Icons Documentation}
 */
export const NavigationArrowIcon = forwardRef(
  ({ direction, width = 20, height, sx, className, ...other }, ref) => {
    const ICON_MAP = {
      up: 'solar:arrow-up-bold',
      down: 'solar:arrow-down-bold',
      left: 'solar:arrow-left-bold',
      right: 'solar:arrow-right-bold',
    };

    const iconName = ICON_MAP[direction];

    if (!iconName) {
      console.warn(
        `NavigationArrowIcon: Invalid direction "${direction}". Use: left, right, up, down`
      );
      return null;
    }

    return (
      <Iconify
        ref={ref}
        icon={iconName}
        width={width}
        height={height}
        sx={sx}
        className={className}
        {...other}
      />
    );
  }
);

NavigationArrowIcon.displayName = 'NavigationArrowIcon';
