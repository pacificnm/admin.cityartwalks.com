/**
 * @namespace CityArtWalks.Components.Image.ImageFollowers
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
 * @memberof CityArtWalks.Components.Image.ImageFollowers
 * @function ImageFollowers
 * @description Renders a card displaying statistics about an image's favorites, views, and reviews.
 *
 * @param {Object} props - The component props.
 * @param {number} [props.favoriteCount=0] - The number of favorites for this image.
 * @param {number} [props.viewCount=0] - The number of views for this image.
 * @param {number} [props.reviewCount=0] - The number of reviews for this image.
 * @returns {JSX.Element} The rendered ImageFollowers component.
 *
 * @example
 * // Usage example
 * import { ImageFollowers } from './ImageFollowers';
 *
 * function App() {
 *   return <ImageFollowers favoriteCount={50} viewCount={500} reviewCount={25} />;
 * }
 */
export function ImageFollowers({ favoriteCount = 0, viewCount = 0, reviewCount = 0 }) {
  return (
    <ErrorBoundary>
      <Box data-cy="image-followers">
        <Box sx={{ py: 2, textAlign: 'center', typography: 'subtitle1', color: 'text.secondary' }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          >
            {/* Favorites Count */}
            <Stack width={1}>
              {fNumber(favoriteCount)}
              <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
                Favorites
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
