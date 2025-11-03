/**
 * @namespace CityArtWalks.Components.Image.ImageFavoriteButton
 * @version 1.0.0
 * @author jaimie garner
 * @memberof CityArtWalks.Components.Image
 * @description Self-contained favorite button component that manages its own state and API calls.
 */

'use client';

import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { debugLog, debugError } from 'src/lib/debug';
import {
  useGetUserFavoriteImage,
  useToggleUserFavoriteImage,
} from 'src/actions/user-favorite-image';

import { toast } from 'src/components/snackbar';
import { FavoriteIcon } from 'src/components/icons';

import { useAuthContext } from 'src/auth/hooks';

/**
 * @memberof CityArtWalks.Components.Image.ImageFavoriteButton
 * @function ImageFavoriteButton
 * @description Self-contained favorite button that checks favorite status and handles toggling.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.imageId - The unique ID of the image.
 * @param {number} [props.size=20] - Icon size.
 * @param {Function} [props.onToggle] - Optional callback after successful toggle.
 * @returns {JSX.Element} The rendered ImageFavoriteButton component.
 */
export function ImageFavoriteButton({ imageId, size = 20, onToggle }) {
  const { user } = useAuthContext();
  const [isToggling, setIsToggling] = useState(false);

  // Get current favorite status
  const { isFavorited, favoriteLoading, favoriteError } = useGetUserFavoriteImage(imageId);

  // Get toggle function
  const toggleFavorite = useToggleUserFavoriteImage();

  /**
   * @memberof CityArtWalks.Components.Image.ImageFavoriteButton
   * @function handleToggle
   * @description Handles favorite toggle with optimistic UI updates and error handling.
   * @private
   * @async
   */
  const handleToggle = async () => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    if (isToggling || favoriteLoading) {
      return; // Prevent double-clicks
    }

    try {
      setIsToggling(true);

      debugLog(
        'CityArtWalks.Components.Image.ImageFavoriteButton.handleToggle',
        'Toggling favorite',
        {
          imageId,
          currentStatus: isFavorited,
        }
      );

      const result = await toggleFavorite(imageId);

      if (result.status === 'success') {
        const newStatus = result.data.meta.isFavorite;
        const message = newStatus ? 'Added to favorites' : 'Removed from favorites';
        toast.success(message);

        // Call parent callback if provided
        if (onToggle) {
          onToggle(imageId, newStatus);
        }

        debugLog(
          'CityArtWalks.Components.Image.ImageFavoriteButton.handleToggle',
          'Toggle successful',
          {
            imageId,
            newStatus,
          }
        );
      } else {
        throw new Error('Toggle failed');
      }
    } catch (error) {
      debugError(
        'CityArtWalks.Components.Image.ImageFavoriteButton.handleToggle',
        'Failed to toggle favorite',
        error
      );
      toast.error('Failed to update favorite. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  // Show loading state
  if (favoriteLoading) {
    return (
      <Tooltip title="Loading...">
        <span>
          <IconButton size="small" disabled>
            <FavoriteIcon size={size} />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  // Show error state
  if (favoriteError) {
    return (
      <Tooltip title="Error loading favorite status">
        <span>
          <IconButton size="small" disabled>
            <FavoriteIcon size={size} />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
      <IconButton
        size="small"
        onClick={handleToggle}
        disabled={isToggling}
        color={isFavorited ? 'primary' : 'default'}
        sx={{
          opacity: isToggling ? 0.6 : 1,
          transition: 'opacity 0.2s ease',
        }}
      >
        <FavoriteIcon size={size} filled={isFavorited} />
      </IconButton>
    </Tooltip>
  );
}
