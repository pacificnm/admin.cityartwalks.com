/**
 * @namespace CityArtWalks.Components.Path.PathFollowers
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { fNumber } from 'src/utils/format-number';

import ErrorBoundary from 'src/components/error/error-boundary';

/**
 * @memberof CityArtWalks.Components.Path.PathFollowers
 * @descripion PathFollowers component displays the counts of followers, total pieces, views, and reviews.
 * @function PathFollowers
 * @param {Object} props - The component props.
 * @param {number} [props.favoriteCount=0] - The number of followers.
 * @param {number} [props.pieceCount=0] - The total number of pieces.
 * @param {number} [props.viewCount=0] - The number of views.
 * @param {number} [props.reviewCount=0] - The number of reviews.
 * @returns {JSX.Element} The rendered component.
 */
export function PathFollowers({
  favoriteCount = 0,
  pieceCount = 0,
  viewCount = 0,
  reviewCount = 0,
}) {
  return (
    <ErrorBoundary>
      <Box data-cy="path-followers">
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
      </Box>
    </ErrorBoundary>
  );
}
