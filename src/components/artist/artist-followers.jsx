/**
 * @namespace CityArtWalks.Components.Artist.ArtistFollowers
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { fNumber } from 'src/utils/format-number';

import ErrorBoundary from '../error/error-boundary';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistFollowers
 * @function ArtistFollowers
 * @description Renders a card displaying statistics about an artist's followers, total pieces, views, and reviews.
 * Uses data fetched with the provided artist ID.
 *
 * @param {Object} props - The component props.
 * @param {string} props.artistId - The unique ID of the artist to fetch follower statistics for.
 * @param {number} props.favoriteCount - The number of favorites for this artist.
 * @param {number} props.pieceCount - The number of pieces for this artist.
 * @param {number} props.viewCount - The number of views for this artist.
 * @param {number} props.reviewCount - The number of reviews for this artist.
 * @param {Object} [props.other] - Additional props to pass to the outer `Card` component.
 * @returns {JSX.Element|null} The rendered ArtistFollowers component, or `null` if data is loading or an error occurs.
 *
 * @example
 * // Usage example
 * import { ArtistFollowers } from './ArtistFollowers';
 *
 * function App() {
 *   return <ArtistFollowers artistId="123" favoriteCount={50} pieceCount={10} viewCount={500} reviewCount={25} />;
 * }
 */
export function ArtistFollowers({
  favoriteCount = 0,
  pieceCount = 0,
  viewCount = 0,
  reviewCount = 0,
}) {
  return (
    <ErrorBoundary>
      <Box data-cy="artist-followers">
        <Card>
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
                  Total Pieces
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

          {/* Empty stack for potential future content */}
          <Stack spacing={2} sx={{ ml: 2, mt: 0, mb: 0, mr: 2 }} />
        </Card>
      </Box>
    </ErrorBoundary>
  );
}
