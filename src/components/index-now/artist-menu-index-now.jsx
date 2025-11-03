/**
 * @fileoverview ArtistMenuIndexNow component for submitting artists to IndexNow API.
 * @namespace CityArtWalks.Components.IndexNow.ArtistMenuIndexNow
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
 * ArtistMenuIndexNow - Menu item for submitting artist URLs to IndexNow API.
 * Allows admin users to queue artist URLs for search engine indexing.
 *
 * @memberof CityArtWalks.Components.IndexNow
 * @function ArtistMenuIndexNow
 * @param {Object} props - Component props
 * @param {string|number} props.artistId - The ID of the artist to submit
 * @param {string} props.artistSlug - The slug of the artist for URL generation
 * @param {string} props.name - The name of the artist for user feedback
 * @param {Function} props.handleClose - Function to close the parent menu
 * @returns {JSX.Element} The rendered menu item
 *
 * @example
 * <ArtistMenuIndexNow
 *   artistId="123"
 *   artistSlug="vincent-van-gogh"
 *   name="Vincent van Gogh"
 *   handleClose={handleClose}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Integration} - Documentation
 */
export function ArtistMenuIndexNow(props) {
  const { artistId, artistSlug, name, handleClose } = props;

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
      // Generate the artist URL using proper routing
      const artistPath = paths.art.artist.details(artistSlug);
      const url = `https://www.cityartwalks.com${artistPath}`;

      // Submit to IndexNow queue
      const response = await createIndexNowSubmission(
        {
          url,
          entityType: 'ARTIST',
          entityId: parseInt(artistId, 10),
          action: 'UPDATED',
        },
        accessToken
      );

      if (response.status === 'success') {
        toast.success(`${name} has been queued for IndexNow submission.`);
        track('artist_index_now_submit', {
          action: 'submit_success',
          section: 'Artist Popover',
          artistId,
          name,
          url,
        });
      } else {
        throw new Error(response.message || 'Failed to queue IndexNow submission');
      }
    } catch (error) {
      console.error('Failed to submit to IndexNow:', error);
      toast.error(`Failed to queue ${name} for IndexNow submission.`);
      track('artist_index_now_submit', {
        action: 'submit_error',
        section: 'Artist Popover',
        artistId,
        name,
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

ArtistMenuIndexNow.propTypes = {
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  artistSlug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};
