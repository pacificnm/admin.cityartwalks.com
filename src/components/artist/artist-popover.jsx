/**
 * @namespace CityArtWalks.Components.Artist.ArtistPopover
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';

import IconButton from '@mui/material/IconButton';

import { CustomPopover } from 'src/components/custom-popover';
import { ArtistMenuIndexNow } from 'src/components/index-now';
import { Website, FaceBook, Instagram } from 'src/components/social';
import {
  ArtistUserFavorite,
  ArtistMenuEditItem,
  ArtistMenuImageUpload,
} from 'src/components/artist';

import { RoleBasedGuard } from 'src/auth/guard';

import { PopoverIcon } from '../icons';
import ErrorBoundary from '../error/error-boundary';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistPopover
 * @function ArtistPopover
 * @description Renders a popover for artist-related actions and social media links.
 * Includes options for visiting the artist's website, Instagram, Facebook, favoriting the artist, and editing (with appropriate permissions).
 *
 * @param {Object} props - The component props.
 * @param {string} props.artistId - The unique ID of the artist.
 * @param {string} [props.name] - The name of the artist.
 * @param {string} [props.slug] - The slug of the artist for URL generation.
 * @param {string} [props.website] - The URL of the artist's website.
 * @param {string} [props.instagram] - The URL of the artist's Instagram profile.
 * @param {string} [props.facebook] - The URL of the artist's Facebook profile.
 * @param {string|number} props.createdBy - The user ID of who created/owns this artist.
 * @param {Object} props.editDialog - An object with methods to control the edit dialog state, including `onTrue`.
 * @param {Function} [props.onImageUpload] - Optional callback when image upload succeeds.
 * @returns {JSX.Element} The rendered ArtistPopover component.
 *
 * @example
 * // Usage example
 * import { ArtistPopover } from './ArtistPopover';
 *
 * function App() {
 *   const editDialog = {
 *     onTrue: () => console.log("Edit dialog opened"),
 *   };
 *
 *   return (
 *     <ArtistPopover
 *       artistId="123"
 *       name="Vincent van Gogh"
 *       slug="vincent-van-gogh"
 *       website="https://artistwebsite.com"
 *       instagram="https://instagram.com/artist_profile"
 *       facebook="https://facebook.com/artist_profile"
 *       createdBy="user123"
 *       editDialog={editDialog}
 *     />
 *   );
 * }
 */
export function ArtistPopover({
  artistId,
  name,
  slug,
  website,
  instagram,
  facebook,
  createdBy,
  editDialog,
  onImageUpload,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    track('artist_popover_open', {
      artistId,
      location: 'Artist About',
      hasWebsite: !!website,
      hasInstagram: !!instagram,
      hasFacebook: !!facebook,
    });
  };

  // Close the popover
  const handleClose = () => {
    setAnchorEl(null);
    track('artist_popover_close', {
      artistId,
      location: 'Artist About',
    });
  };

  const open = Boolean(anchorEl); // Determine if the popover is open

  return (
    <ErrorBoundary>
      <IconButton color={open ? 'inherit' : 'default'} onClick={handleOpen}>
        <PopoverIcon />
      </IconButton>
      <CustomPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        slotProps={{
          arrow: {
            placement: 'right-top', // Arrow positioned at top-right
            size: 14, // Size of the arrow
            offset: 12, // Offset for the arrow's placement
          },
        }}
      >
        <Website path={website} />
        <Instagram path={instagram} />
        <FaceBook path={facebook} />
        <ArtistUserFavorite artistId={artistId} handleClose={handleClose} />
        <ArtistMenuImageUpload
          artistId={artistId}
          createdBy={createdBy}
          handleClose={handleClose}
          onUploadSuccess={onImageUpload}
        />
        <RoleBasedGuard allowedRoles={['ADMIN']} displayMode="hidden" protecting="IndexNow Menu">
          <ArtistMenuIndexNow
            artistId={artistId}
            artistSlug={slug}
            name={name}
            handleClose={handleClose}
          />
        </RoleBasedGuard>
        <ArtistMenuEditItem
          editDialog={editDialog}
          handleClose={handleClose}
          createdBy={createdBy}
        />
      </CustomPopover>
    </ErrorBoundary>
  );
}
