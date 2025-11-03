import Link from 'next/link';

/**
 * @namespace CityArtWalks.Components.Social.Instagram
 * @version 1.0.0
 * @author jaimie garner
 */
import MenuItem from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
/**
 * @memberof CityArtWalks.Components.Social.Instagram
 * @description Renders a menu item for navigating to an Instagram profile.
 * If no `path` is provided, the menu item is disabled.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.path] - The URL of the Instagram profile. If not provided, the menu item will be disabled.
 * @returns {JSX.Element} The rendered Instagram component.
 *
 * @example
 * // Usage example
 * import { Instagram } from './Instagram';
 *
 * function App() {
 *   return (
 *     <>
 *       <Instagram path="https://instagram.com/artist_profile" />
 *       <Instagram />
 *     </>
 *   );
 * }
 */
export function Instagram({ path }) {
  if (!path) {
    return (
      <MenuItem disabled>
        <Iconify icon="socials:instagram" /> Instagram
      </MenuItem>
    );
  }

  return (
    <MenuItem component={Link} href={path} target="_blank">
      <Iconify icon="socials:instagram" sx={{ color: '#E02D69' }} /> Instagram
    </MenuItem>
  );
}
