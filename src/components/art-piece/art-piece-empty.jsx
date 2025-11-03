/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceEmpty
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import { Box, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { AddIcon } from 'src/components/icons';
import { EmptyContent } from 'src/components/empty-content';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceEmpty
 * @function ArtPieceEmpty
 * @description Displays an empty state message when no art pieces are available.
 * Allows customization of the title and description. Optionally shows a create button
 * if an artistSlug is provided.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.title] - The title of the empty state message. Defaults to "No Art Pieces".
 * @param {string} [props.description] - The description of the empty state message. Defaults to "This artist does not have any art pieces yet.".
 * @param {string} [props.artistSlug] - The artist slug for creating new art pieces. If provided, shows a create button.
 * @returns {JSX.Element} The rendered ArtPieceEmpty component.
 *
 * @example
 * // Usage example with create button
 * import { ArtPieceEmpty } from './ArtPieceEmpty';
 *
 * function App() {
 *   return (
 *     <ArtPieceEmpty
 *       title="No Available Art"
 *       description="Currently, there are no art pieces to display."
 *       artistSlug="vincent-van-gogh"
 *     />
 *   );
 * }
 *
 * @example
 * // Default Behavior without create button
 * import { ArtPieceEmpty } from './ArtPieceEmpty';
 *
 * function App() {
 *   return <ArtPieceEmpty />;
 *   // Output: Title will be "No Art Pieces" and description will be "This artist does not have any art pieces yet."
 * }
 */
export function ArtPieceEmpty({ title, description, artistSlug, ...other }) {
  const createButton = artistSlug ? (
    <Button
      variant="contained"
      size="large"
      startIcon={<AddIcon />}
      href={paths.artPiece.create(artistSlug)}
      sx={{ mt: 3 }}
    >
      Create Art Piece
    </Button>
  ) : null;

  return (
    <Box {...other} data-cy="art-piece-empty">
      <EmptyContent
        filled
        title={title || 'No Art Pieces'}
        description={description || 'This artist does not have any art pieces yet.'}
        action={createButton}
        sx={{ py: 10, mb: 5 }}
      />
    </Box>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceEmpty
 * @prop {string} [title] - The title of the empty state message. Defaults to "No Art Pieces". This prop is optional.
 * @prop {string} [description] - The description of the empty state message. Defaults to "This artist does not have any art pieces yet.". This prop is optional.
 * @prop {string} [artistSlug] - The artist slug for creating new art pieces. If provided, shows a create button. This prop is optional.
 */
ArtPieceEmpty.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  artistSlug: PropTypes.string,
};
