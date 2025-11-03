/**
 * @namespace CityArtWalks.Components.Social.Website
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Link from 'next/link';

import MenuItem from '@mui/material/MenuItem';

import { GlobalIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.Social.Website
 * @description Renders a menu item for navigating to a website.
 * If no `path` is provided, the menu item is disabled.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.path] - The URL of the website. If not provided, the menu item will be disabled.
 * @returns {JSX.Element} The rendered Website component.
 *
 * @example
 * // Usage example
 * import { Website } from './Website';
 *
 * function App() {
 *   return (
 *     <>
 *       <Website path="https://example.com" />
 *       <Website />
 *     </>
 *   );
 * }
 */
export function Website({ path }) {
  if (!path) {
    return (
      <MenuItem disabled>
        <GlobalIcon /> Website
      </MenuItem>
    );
  }

  return (
    <MenuItem component={Link} href={path} target="_blank">
      <GlobalIcon /> Website
    </MenuItem>
  );
}
