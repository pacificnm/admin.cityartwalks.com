import { useState } from 'react';
import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import MenuItem from '@mui/material/MenuItem';

import { useArtPieceCartContext } from 'src/contexts/art-piece-cart';

import { toast } from 'src/components/snackbar';
import { UserSignUpDialog } from 'src/components/user';
import { ProductUpgradeDialog } from 'src/components/product';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

import { WalkingIcon } from '../icons';

/**
 * ArtPieceMenuPath component - Allows the user to add an art piece to their path map.
 * Displays an upgrade dialog if the user doesn't have the required role (MEMBER).
 *
 * @component
 * @memberof CityArtWalks.Components.ArtPiece
 * @param {Object} props - The component props.
 * @param {number} props.artPieceId - The ID of the art piece.
 * @param {number} props.artistId - The ID of the artist.
 * @param {string} props.title - The title of the art piece.
 * @param {string} props.imageUrl - The image URL of the art piece.
 * @param {number} props.latitude - The latitude coordinate.
 * @param {number} props.longitude - The longitude coordinate.
 * @param {string} props.artPieceSlug - The art piece slug.
 * @param {string} props.artistSlug - The artist slug.
 * @param {string} props.artistName - The artist name.
 * @param {Function} props.handleClose - Function to close the parent menu/popover.
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * Role-based path functionality:
 * - PUBLIC/USER roles: Shows menu item, opens upgrade dialog on click
 * - MEMBER/ADMIN roles: Shows menu item, executes add to path on click
 * - Requires MEMBER role or higher to actually add to path
 *
 * @example
 * <ArtPieceMenuPath
 *   artPieceId={123}
 *   artistId={456}
 *   title="Art Piece Title"
 *   imageUrl="https://example.com/image.jpg"
 *   latitude={45.5152}
 *   longitude={-122.6784}
 *   artPieceSlug="art-piece-slug"
 *   artistSlug="artist-slug"
 *   artistName="Artist Name"
 *   handleClose={() => setMenuOpen(false)}
 * />
 */
export function ArtPieceMenuPath(props) {
  const {
    artPieceId,
    artistId,
    title,
    imageUrl,
    latitude,
    longitude,
    artPieceSlug,
    artistSlug,
    artistName,
    handleClose,
  } = props;

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);

  const { user } = useAuthContext();
  const { onAddArtPiece, isInCart } = useArtPieceCartContext();
  const currentRole = user?.role;
  const isPublicUser = !currentRole || String(currentRole).toLowerCase() === 'public';

  // Check if user has required role (MEMBER or ADMIN)
  const hasRequiredRole = currentRole && ['MEMBER', 'ADMIN'].includes(currentRole);

  // Check if this art piece is already in the cart
  const alreadyInCart = isInCart(artPieceId);

  const handleAddToPath = async () => {
    if (alreadyInCart) {
      toast.info(`${title} is already in your path basket.`);
      return;
    }

    const newArtPiece = {
      userId: user.userId,
      artPieceId,
      artistId,
      title,
      image: imageUrl,
      latitude,
      longitude,
      artPieceSlug,
      artistSlug,
      artistName,
    };

    try {
      const success = onAddArtPiece(newArtPiece);
      if (success) {
        toast.success(`Added ${title} to path basket.`);
      } else {
        toast.info(`${title} is already in your path basket.`);
      }
    } catch (error) {
      console.error('Failed to add to path basket', error);
      toast.error('Failed to add to path basket.');
    }
  };

  const handleMenuItemClick = () => {
    const action = isPublicUser
      ? 'signup_prompt'
      : !hasRequiredRole
        ? 'upgrade_prompt'
        : alreadyInCart
          ? 'already_in_cart'
          : 'add_to_path';

    track('art_piece_menu_add_to_path', {
      action,
      section: 'Art Piece Popover',
      artPieceId,
      title,
      userRole: currentRole || 'public',
      alreadyInCart,
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
    // MEMBER/ADMIN: execute add to path action
    handleAddToPath();
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
      <MenuItem onClick={handleMenuItemClick}>
        <WalkingIcon size={20} />
        Add To Path Map
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

ArtPieceMenuPath.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  artistName: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};
