'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import MenuItem from '@mui/material/MenuItem';

import {
  useGetUserFavoriteArtist,
  useToggleUserFavoriteArtist,
} from 'src/actions/user-favorite-artist/hooks';

import { toast } from 'src/components/snackbar';
import { UserSignUpDialog } from 'src/components/user';
import { ProductUpgradeDialog } from 'src/components/product';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

import { FavoriteIcon } from '../icons';

/**
 * ArtistUserFavorite component - Allows the user to add or remove an artist from their favorites.
 * Displays an upgrade dialog if the user doesn't have the required role (MEMBER).
 *
 * @component
 * @memberof CityArtWalks.Components.Artist
 * @param {Object} props - The component props.
 * @param {number} props.artistId - The ID of the artist.
 * @param {Function} props.handleClose - Function to close the parent menu/popover.
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * Role-based favorite functionality:
 * - PUBLIC/USER roles: Shows menu item, opens upgrade dialog on click
 * - MEMBER/ADMIN roles: Shows menu item, executes add/remove favorite on click
 * - Requires MEMBER role or higher to actually add/remove favorites
 *
 * @example
 * <ArtistUserFavorite
 *   artistId={123}
 *   handleClose={() => setMenuOpen(false)}
 * />
 */
export function ArtistUserFavorite(props) {
  const { artistId, handleClose } = props;

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);

  const { user } = useAuthContext();
  const currentRole = user?.role;
  const isPublicUser = !currentRole || String(currentRole).toLowerCase() === 'public';
  // Check if user has required role (MEMBER or ADMIN)
  const hasRequiredRole = currentRole && ['MEMBER', 'ADMIN'].includes(currentRole);

  // Get favorite status using SWR hook
  const { favoriteLoading, isFavorited } = useGetUserFavoriteArtist(artistId);
  const toggleFavorite = useToggleUserFavoriteArtist();

  // Determine if this artist is favorited
  const isFavorite = Boolean(isFavorited);
  const loading = favoriteLoading;

  const renderAddIcon = 'Add Favorite';
  const renderRemoveIcon = 'Remove Favorite';

  const handleToggleFavorite = async () => {
    try {
      const result = await toggleFavorite(artistId);

      if (result.status === 'success') {
        const message = result.data.userFavoriteArtist.isFavorite
          ? `Added to favorites!`
          : `Removed from favorites!`;
        toast.success(message);
      } else {
        toast.error('Failed to update favorite status');
      }
    } catch {
      toast.error('Failed to update favorite status');
    }
  };

  const handleMenuItemClick = () => {
    track('artist_menu_favorite', {
      action: 'favorite_toggle_click',
      artistId: String(artistId),
      isFavorite,
      userRole: currentRole || 'public',
    });

    if (isPublicUser) {
      // Not signed in or public role: prompt signup
      setSignupDialogOpen(true);
      return;
    }
    if (!hasRequiredRole) {
      // Signed in as USER: prompt upgrade
      setUpgradeDialogOpen(true);
      return;
    }
    // MEMBER/ADMIN: execute toggle favorite action
    handleToggleFavorite();
    if (handleClose) {
      handleClose();
    }
  };

  const handleUpgradeDialogClose = () => {
    setUpgradeDialogOpen(false);
  };

  const handleSignUpDialogClose = () => {
    setSignupDialogOpen(false);
  };

  return (
    <ErrorBoundary>
      <MenuItem onClick={handleMenuItemClick} disabled={loading}>
        <FavoriteIcon size={20} />
        {loading ? 'Loading...' : isFavorite ? renderRemoveIcon : renderAddIcon}
      </MenuItem>
      <UserSignUpDialog open={signupDialogOpen} onClose={handleSignUpDialogClose} />
      <ProductUpgradeDialog
        open={upgradeDialogOpen}
        onClose={handleUpgradeDialogClose}
        showUpgradeButton={false}
      />
    </ErrorBoundary>
  );
}

ArtistUserFavorite.propTypes = {
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleClose: PropTypes.func,
};
