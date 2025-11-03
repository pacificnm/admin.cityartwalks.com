'use client';

import { forwardRef } from 'react';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

/**
 * Social media platform icon component
 *
 * @namespace CityArtWalks.Components.Icons
 * @memberof CityArtWalks.Components.Icons
 *
 * @description Dedicated component for social media platform icons.
 * Replaces direct Iconify usage for social platform icons in auth and social features.
 *
 * @param {Object} props - Component props
 * @param {'google'|'github'|'twitter'|'facebook'|'instagram'|'linkedin'} props.platform - Social platform
 * @param {number} [props.width=24] - Icon width
 * @param {number} [props.height] - Icon height (defaults to width)
 * @param {Object} [props.sx] - Material-UI sx prop for styling
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Social media platform icon
 *
 * @example
 * // Google login button
 * <SocialIcon platform="google" />
 *
 * @example
 * // GitHub with custom size
 * <SocialIcon platform="github" width={32} />
 *
 * @example
 * // In social login buttons
 * <Button startIcon={<SocialIcon platform="google" />}>
 *   Sign in with Google
 * </Button>
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Icons Icons Documentation}
 */
export const SocialIcon = forwardRef(
  ({ platform, width = 24, height, sx, className, ...other }, ref) => {
    const iconMap = {
      google: 'socials:google',
      github: 'socials:github',
      twitter: 'socials:twitter',
      facebook: 'socials:facebook',
      instagram: 'socials:instagram',
      linkedin: 'socials:linkedin',
    };

    const iconName = iconMap[platform];

    if (!iconName) {
      console.warn(
        `SocialIcon: Invalid platform "${platform}". Use: google, github, twitter, facebook, instagram, linkedin`
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

SocialIcon.displayName = 'SocialIcon';
