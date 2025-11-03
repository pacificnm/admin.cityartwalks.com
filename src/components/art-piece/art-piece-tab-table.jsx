/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceTabTable
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import { useGetArtPieceByArtist } from 'src/actions/art-piece';

import { ErrorView } from 'src/components/error';
import { LoadingScreen } from 'src/components/loading-screen';
import { ArtPieceEmpty, ArtPieceTable } from 'src/components/art-piece';
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabTable
 * @function ArtPieceTabTable
 * @description Fetches and displays a table of art pieces for a specific artist, with loading, error, and empty states.
 *
 * @param {Object} props - The component properties.
 * @param {number} props.artistId - The ID of the artist whose art pieces are to be fetched and displayed in the table.
 * @param {string} props.slug - The slug of the artist used for generating links in the table.
 * @returns {JSX.Element} The rendered ArtPieceTabTable component.
 *
 * @example
 * <ArtPieceTabTable artistId={123} slug="van-gogh" />
 */
export default function ArtPieceTabTable({ artistId, slug }) {
  const { data, isLoading, error } = useGetArtPieceByArtist(artistId);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorView message={error.message} status={error.status} />;
  if (!data) return <ArtPieceEmpty artistSlug={slug} />;

  return <ArtPieceTable data={data} slug={slug} />;
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceTabTable
 * @prop {number} artistId - The ID of the artist whose art pieces are to be fetched and displayed in the table. This prop is required.
 * @prop {string} slug - The slug of the artist used for generating links in the table. This prop is required.
 */
ArtPieceTabTable.propTypes = {
  artistId: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
};
