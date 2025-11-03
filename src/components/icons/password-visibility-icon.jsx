'use client';

import { forwardRef } from 'react';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

/**
 * Password visibility toggle icon component
 *
 * @namespace CityArtWalks.Components.Icons
 * @memberof CityArtWalks.Components.Icons
 *
 * @description Dedicated component for password visibility toggle icons.
 * Replaces direct Iconify usage for eye/eye-closed icons throughout auth components.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether password is currently visible
 * @param {number} [props.width=20] - Icon width
 * @param {number} [props.height] - Icon height (defaults to width)
 * @param {Object} [props.sx] - Material-UI sx prop for styling
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Password visibility toggle icon
 *
 * @example
 * // Basic usage
 * <PasswordVisibilityIcon visible={showPassword} />
 *
 * @example
 * // With custom size
 * <PasswordVisibilityIcon visible={showPassword} width={24} />
 *
 * @example
 * // In a toggle button
 * <IconButton onClick={toggleVisibility}>
 *   <PasswordVisibilityIcon visible={showPassword} />
 * </IconButton>
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Icons Icons Documentation}
 */
export const PasswordVisibilityIcon = forwardRef(
  ({ visible, width = 20, height, sx, className, ...other }, ref) => {
    const iconName = visible ? 'solar:eye-bold' : 'solar:eye-closed-bold';

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

PasswordVisibilityIcon.displayName = 'PasswordVisibilityIcon';
