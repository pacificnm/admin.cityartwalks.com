/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceCardTitle
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import ListItemText from '@mui/material/ListItemText';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardTitle
 * @function ArtPieceCardTitle
 * @description Renders the title of an art piece card.
 * Displays "Untitled" if no title is provided.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.title] - The title of the art piece. Defaults to "Untitled" if not provided.
 * @returns {JSX.Element} The rendered ArtPieceCardTitle component.
 *
 * @example
 * // Usage example
 * import { ArtPieceCardTitle } from './ArtPieceCardTitle';
 *
 * function App() {
 *   return (
 *     <div>
 *       <ArtPieceCardTitle title="Starry Night" />
 *       <ArtPieceCardTitle />
 *     </div>
 *   );
 * }
 *
 * // Output:
 * // - "Starry Night" for the first title.
 * // - "Untitled" for the second (default value).
 */
export function ArtPieceCardTitle({ title }) {
  return (
    <ListItemText
      sx={{ mt: 7, mb: 1 }}
      primary={title || 'Untitled'}
      slotProps={{
        primary: { typography: 'subtitle1', textAlign: 'center' },
        secondary: { component: 'span', mt: 0.5 },
      }}
    />
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardTitle
 * @prop {string} [title] - The title of the art piece. Defaults to "Untitled" if not provided. This prop is optional.
 */
ArtPieceCardTitle.propTypes = {
  title: PropTypes.string,
};
