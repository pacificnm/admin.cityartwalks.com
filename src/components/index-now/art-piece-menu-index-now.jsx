/**
 * @fileoverview ArtPieceMenuIndexNow component for submitting art pieces to IndexNow API.
 * @namespace CityArtWalks.Components.IndexNow.ArtPieceMenuIndexNow
 * @author jaimie garner
 * @version 1.0.0
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - Documentation
 */

'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { track } from '@vercel/analytics';

import MenuItem from '@mui/material/MenuItem';

import { paths } from 'src/routes/paths';

import { createIndexNowSubmission } from 'src/actions/index-now-submission/requests';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import ErrorBoundary from 'src/components/error/error-boundary';

import { useAuthContext } from 'src/auth/hooks';

/**
 * ArtPieceMenuIndexNow - Menu item for submitting art piece URLs to IndexNow API.
 * Allows admin users to queue art piece URLs for search engine indexing.
 *
 * @memberof CityArtWalks.Components.IndexNow
 * @function ArtPieceMenuIndexNow
 * @param {Object} props - Component props
 * @param {string|number} props.artPieceId - The ID of the art piece to submit
 * @param {string} props.artPieceSlug - The slug of the art piece for URL generation
 * @param {string} props.artistSlug - The slug of the artist for URL generation
 * @param {string} props.title - The title of the art piece for user feedback
 * @param {Function} props.handleClose - Function to close the parent menu
 * @returns {JSX.Element} The rendered menu item
 *
 * @example
 * <ArtPieceMenuIndexNow
 *   artPieceId="123"
 *   artPieceSlug="starry-night"
 *   artistSlug="vincent-van-gogh"
 *   title="Starry Night"
 *   handleClose={handleClose}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - Documentation
 */
export function ArtPieceMenuIndexNow(props) {
  const { artPieceId, artPieceSlug, artistSlug, title, handleClose } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, accessToken } = useAuthContext();

  // Only admin users can submit to IndexNow
  const canSubmit = user?.role === 'ADMIN';

  const handleIndexNowSubmit = async () => {
    if (!canSubmit) {
      toast.error('Only administrators can submit URLs to IndexNow.');
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    setIsSubmitting(true);

    try {
      // Generate the art piece URL using proper routing
      const artPiecePath = paths.art.artist.artwork.details(artistSlug, artPieceSlug);
      const url = `https://www.cityartwalks.com${artPiecePath}`;

      // Submit to IndexNow queue
      const response = await createIndexNowSubmission(
        {
          url,
          entityType: 'ART_PIECE',
          entityId: parseInt(artPieceId, 10),
          action: 'UPDATED',
        },
        accessToken
      );

      if (response.status === 'success') {
        toast.success(`${title} has been queued for IndexNow submission.`);
        track('art_piece_index_now_submit', {
          action: 'submit_success',
          section: 'Art Piece Popover',
          artPieceId,
          title,
          url,
        });
      } else {
        throw new Error(response.message || 'Failed to queue IndexNow submission');
      }
    } catch (error) {
      console.error('Failed to submit to IndexNow:', error);
      toast.error(`Failed to queue ${title} for IndexNow submission.`);
      track('art_piece_index_now_submit', {
        action: 'submit_error',
        section: 'Art Piece Popover',
        artPieceId,
        title,
        error: error.message,
      });
    } finally {
      setIsSubmitting(false);
      if (handleClose) {
        handleClose();
      }
    }
  };

  // Don't render for non-admin users
  if (!canSubmit) {
    return null;
  }

  return (
    <ErrorBoundary>
      <MenuItem onClick={handleIndexNowSubmit} disabled={isSubmitting}>
        <Iconify icon="solar:share-bold" size={20} sx={{ opacity: isSubmitting ? 0.5 : 1 }} />
        {isSubmitting ? 'Submitting...' : 'Submit to IndexNow'}
      </MenuItem>
    </ErrorBoundary>
  );
}

ArtPieceMenuIndexNow.propTypes = {
  artPieceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  artPieceSlug: PropTypes.string.isRequired,
  artistSlug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};
