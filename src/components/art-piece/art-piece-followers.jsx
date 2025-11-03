/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceFollowers
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { fNumber } from 'src/utils/format-number';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceFollowers
 * @function ArtPieceFollowers
 * @description Renders a summary of metrics for an art piece, including the number of followers, total images, views, and reviews.
 * Handles loading and error states gracefully.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.artPieceId - The unique ID of the art piece for which metrics are fetched.
 * @param {number} props.favoriteCount - The number of favorites for this art piece.
 * @param {number} props.imageCount - The number of images for this art piece.
 * @param {number} props.viewCount - The number of views for this art piece.
 * @param {number} props.reviewCount - The number of reviews for this art piece.
 * @returns {JSX.Element|null} The rendered ArtPieceFollowers component, or `null` if loading or an error occurs.
 *
 * @example
 * // Usage example
 * import { ArtPieceFollowers } from './ArtPieceFollowers';
 *
 * function App() {
 *   return <ArtPieceFollowers artPieceId="123" favoriteCount={50} imageCount={10} viewCount={500} reviewCount={25} />;
 * }
 *
 * @example
 * // Expected `counts` API Response
 * // {
 * //   favoriteCount: 50,
 * //   imageCount: 10,
 * //   viewCount: 500,
 * //   reviewCount: 25
 * // }
 */
export function ArtPieceFollowers({
  favoriteCount = 0,
  imageCount = 0,
  viewCount = 0,
  reviewCount = 0,
}) {
  return (
    <Box sx={{ py: 2, textAlign: 'center', typography: 'subtitle1', color: 'text.secondary' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        {renderMetric(favoriteCount, 'Follower')}
        {renderMetric(imageCount, 'Total Images')}
        {renderMetric(reviewCount, 'Reviews')}
        {renderMetric(viewCount, 'Views')}
      </Stack>
    </Box>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceFollowers
 * @function renderMetric
 * @description Renders a metric display with a count and a label, formatted for use in a layout.
 *
 * @function
 * @param {number} count - The numeric value to display. This value is formatted using `fNumber`.
 * @param {string} label - The label for the metric, displayed below the count.
 * @returns {JSX.Element} The rendered metric component.
 *
 * @example
 * // Usage example
 * import { renderMetric } from './RenderMetric';
 *
 * function App() {
 *   return (
 *     <div>
 *       {renderMetric(50, 'Followers')}
 *       {renderMetric(10, 'Total Images')}
 *       {renderMetric(500, 'Views')}
 *     </div>
 *   );
 * }
 */
const renderMetric = (count, label) => (
  <Stack width={1}>
    {fNumber(count)}
    <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
      {label}
    </Box>
  </Stack>
);
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceFollowers
 * @description ArtPieceFollowersLoading component displays a loading state for metrics such as followers, total images, and views.
 * @function ArtPieceFollowersLoading
 * @component
 * @returns {JSX.Element} The rendered loading state for art piece followers and related metrics.
 *
 * @example
 * // Example usage in a loading scenario
 * <ArtPieceFollowersLoading />
 */
export function ArtPieceFollowersLoading() {
  return (
    <Box sx={{ py: 2, textAlign: 'center', typography: 'subtitle1', color: 'text.secondary' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        {renderMetric(0, 'Follower')}
        {renderMetric(0, 'Total Images')}
        {renderMetric(0, 'Views')}
      </Stack>
    </Box>
  );
}
