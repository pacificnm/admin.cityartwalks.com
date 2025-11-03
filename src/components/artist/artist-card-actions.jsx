/**
 * @namespace CityArtWalks.Components.Artist.ArtistCardActions
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { fNumber } from 'src/utils/format-number';

import ErrorBoundary from '../error/error-boundary';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistCardActions
 * @function ArtistCardActions
 * @description Renders action buttons and statistics for an artist card component.
 * Displays engagement metrics including favorites, art pieces, views, and reviews in a responsive layout.
 * This component provides visual feedback for user engagement and content performance metrics.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} [props.favoriteCount=0] - The number of users who have favorited this artist.
 * @param {number} [props.pieceCount=0] - The total number of art pieces created by this artist.
 * @param {number} [props.viewCount=0] - The total number of profile views for this artist.
 * @param {number} [props.reviewCount=0] - The number of reviews written about this artist or their work.
 * @param {string} [props.artistId] - The unique identifier for the artist (for future action implementations).
 * @param {Function} [props.onFavoriteClick] - Callback fired when the favorite action is triggered.
 * @param {Function} [props.onViewProfile] - Callback fired when the view profile action is triggered.
 * @returns {JSX.Element} The rendered ArtistCardActions component.
 *
 * @example
 * // Basic usage with statistics
 * import { ArtistCardActions } from './ArtistCardActions';
 *
 * function ArtistCard() {
 *   return (
 *     <ArtistCardActions
 *       favoriteCount={42}
 *       pieceCount={15}
 *       viewCount={1250}
 *       reviewCount={8}
 *       artistId="artist-123"
 *       onFavoriteClick={() => handleFavoriteToggle()}
 *       onViewProfile={() => navigateToProfile()}
 *     />
 *   );
 * }
 */
export function ArtistCardActions({
  favoriteCount = 0,
  pieceCount = 0,
  viewCount = 0,
  reviewCount = 0,
  artistId,
  onFavoriteClick,
  onViewProfile,
  ...other
}) {
  return (
    <ErrorBoundary>
      <Box data-cy="artist-card-actions" {...other}>
        <Box sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          >
            {/* Followers Count */}
            <Stack width={1}>
              {fNumber(favoriteCount)}
              <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                Followers
              </Box>
            </Stack>

            {/* Total Pieces Count */}
            <Stack width={1}>
              {fNumber(pieceCount)}
              <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                Pieces
              </Box>
            </Stack>

            {/* Review Count */}
            <Stack width={1}>
              {fNumber(reviewCount)}
              <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                Reviews
              </Box>
            </Stack>

            {/* View Count */}
            <Stack width={1}>
              {fNumber(viewCount)}
              <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                Views
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </ErrorBoundary>
  );
}

/**
 * PropTypes Validation for ArtistCardActions Component
 *
 * @memberof CityArtWalks.Components.Artist.ArtistCardActions
 * @name ArtistCardActions.propTypes
 * @type {Object}
 */
ArtistCardActions.propTypes = {
  favoriteCount: PropTypes.number,
  pieceCount: PropTypes.number,
  viewCount: PropTypes.number,
  reviewCount: PropTypes.number,
  artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFavoriteClick: PropTypes.func,
  onViewProfile: PropTypes.func,
};

/**
 * Default Props for ArtistCardActions Component
 *
 * @memberof CityArtWalks.Components.Artist.ArtistCardActions
 * @name ArtistCardActions.defaultProps
 * @type {Object}
 */
ArtistCardActions.defaultProps = {
  favoriteCount: 0,
  pieceCount: 0,
  viewCount: 0,
  reviewCount: 0,
};
