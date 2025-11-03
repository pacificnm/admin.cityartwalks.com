/**
 * @namespace CityArtWalks.Components.Social.FaceBook
 * @version 1.0.0
 * @author jaimie garner
 */
import Link from 'next/link';

import MenuItem from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

/**
 * @memberof CityArtWalks.Components.Social.FaceBook
 * @description Renders a menu item for navigating to a Facebook profile.
 * If no `path` is provided, the menu item is disabled.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.path] - The URL of the Facebook profile. If not provided, the menu item will be disabled.
 * @returns {JSX.Element} The rendered FaceBook component.
 *
 * @example
 * // Usage example
 * import { FaceBook } from './FaceBook';
 *
 * function App() {
 *   return (
 *     <>
 *       <FaceBook path="https://facebook.com/artist_profile" />
 *       <FaceBook />
 *     </>
 *   );
 * }
 */
export function FaceBook({ path }) {
  if (!path) {
    return (
      <MenuItem disabled>
        <Iconify icon="socials:facebook" /> Facebook
      </MenuItem>
    );
  }

  return (
    <MenuItem component={Link} href={path} target="_blank">
      <Iconify icon="socials:facebook" sx={{ color: '#1877F2' }} /> Facebook
    </MenuItem>
  );
}
