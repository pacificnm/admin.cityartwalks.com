/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceMetadata
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import { useGetArtPieceCounts } from 'src/actions/art-piece';

import { ViewIcon, ChatIcon, ImageIcon, WalkingIcon, FavoriteIcon } from 'src/components/icons';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMetadata
 * @function ArtPieceMetadata
 * @description Renders metadata for an art piece, including favorite count, view count, and path count.
 * Displays a null component while loading or if there is an error fetching the data.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.artPieceId - The unique ID of the art piece to fetch metadata for.
 * @returns {JSX.Element|null} The rendered ArtPieceMetadata component or `null` if loading or an error occurs.
 *
 * @example
 * // Usage example
 * import { ArtPieceMetadata } from './ArtPieceMetadata';
 *
 * function App() {
 *   return <ArtPieceMetadata artPieceId="123" />;
 * }
 *
 * @example
 * // Expected `counts` API Response
 * // {
 * //   images: 6,
 * //   pathMaps: 6,
 * //   reviews: 0,
 * //   userFavorites: 2,
 * //   viewCount: 150
 * // }
 */
export function ArtPieceMetadata({ artPieceId }) {
  const { counts, countsLoading, countsError } = useGetArtPieceCounts(artPieceId);
  if (countsError || countsLoading) return null;

  const { userFavorites, viewCount, pathMaps, images, reviews } = counts;

  return (
    <Stack
      spacing={1.5}
      flexGrow={1}
      direction="row"
      flexWrap="wrap"
      justifyContent="flex-end"
      sx={{
        typography: 'caption',
        color: 'text.disabled',
      }}
    >
      <Stack direction="row" alignItems="center">
        <FavoriteIcon size={16} sx={{ mr: 0.5 }} />
        {userFavorites ?? 0}
      </Stack>
      <Stack direction="row" alignItems="center">
        <ViewIcon size={16} sx={{ mr: 0.5 }} />
        {viewCount ?? 0}
      </Stack>
      <Stack direction="row" alignItems="center">
        <WalkingIcon size={16} sx={{ mr: 0.5 }} />
        {pathMaps ?? 0}
      </Stack>
      <Stack direction="row" alignItems="center">
        <ImageIcon size={16} sx={{ mr: 0.5 }} />
        {images ?? 0}
      </Stack>
      <Stack direction="row" alignItems="center">
        <ChatIcon size={16} sx={{ mr: 0.5 }} />
        {reviews ?? 0}
      </Stack>
    </Stack>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceMetadata
 * @prop {string} artPieceId - The unique ID of the art piece to fetch metadata for. This prop is required.
 */
ArtPieceMetadata.propTypes = {
  artPieceId: PropTypes.string.isRequired,
};
