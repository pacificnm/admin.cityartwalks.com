/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceTabList
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';

import { useGetArtPieceByArtist } from 'src/actions/art-piece';

import { LoadingScreen } from 'src/components/loading-screen';
import { ArtPieceEmpty, ArtPieceCardList } from 'src/components/art-piece';

import { ErrorView } from '../error/error-view';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabList
 * @function ArtPieceTabList
 * @description Fetches and displays a list of art pieces for a specific artist, with loading, error, and empty states.
 *
 * @param {Object} props - The component properties.
 * @param {number} props.artistId - The ID of the artist whose art pieces are to be fetched and displayed.
 * @param {string} [props.artistSlug] - The artist slug for creating new art pieces when showing empty state.
 * @returns {JSX.Element} The rendered ArtPieceTabList component.
 *
 * @example
 * <ArtPieceTabList artistId={123} artistSlug="vincent-van-gogh" />
 */
export function ArtPieceTabList({ artistId, artistSlug }) {
  const { data, isLoading, error } = useGetArtPieceByArtist(artistId);

  // Show loading screen during fetching or validation
  if (isLoading) return <LoadingScreen />;

  // Show error view if there's an issue fetching the data
  if (error) return <ErrorView message={error.message} status={error.status} />;

  // if no data is returned, show the empty view
  if (!data || data.length === 0)
    return (
      <ArtPieceEmpty
        title="No Art Pieces"
        description="This artist does not have any art pieces. Check back offten as we add art pieces daily."
        artistSlug={artistSlug}
      />
    );

  // Render the list of art pieces
  return (
    <Grid container spacing={3} sx={{ mb: 8 }}>
      <Grid xs={12}>
        <ArtPieceCardList artPieces={data} />
      </Grid>
    </Grid>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabList
 * @prop {number} artistId - The ID of the artist whose art pieces are to be fetched and displayed. This prop is required.
 * @prop {string} [artistSlug] - The artist slug for creating new art pieces when showing empty state. This prop is optional.
 */
ArtPieceTabList.propTypes = {
  artistId: PropTypes.number.isRequired,
  artistSlug: PropTypes.string,
};
