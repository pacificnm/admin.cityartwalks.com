/**
 * @namespace CityArtWalks.Components.ArtPiece.ArtPieceCardDescription
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import { stripHtmlTags } from 'src/utils/change-case';

import { TextMaxLine } from 'src/components/text-max-line';

/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardDescription
 * @function ArtPieceCardDescription
 * @description Renders a description for an art piece card.
 * Strips any HTML tags from the description and provides a default message if the description is missing.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.description] - The description of the art piece. Can include HTML content.
 * @returns {JSX.Element} The rendered ArtPieceCardDescription component.
 *
 * @example
 * // Usage example
 * import { ArtPieceCardDescription } from './ArtPieceCardDescription';
 *
 * function App() {
 *   return (
 *     <ArtPieceCardDescription description="A beautiful painting of a <strong>starry night</strong>." />
 *   );
 * }
 *
 * @example
 * // Example with missing description
 * import { ArtPieceCardDescription } from './ArtPieceCardDescription';
 *
 * function App() {
 *   return <ArtPieceCardDescription />;
 *   // Output: "No description available."
 * }
 */
export function ArtPieceCardDescription({ description }) {
  // Handle cases where the description might be missing or empty
  const displayDescription = description ? stripHtmlTags(description) : 'No description available.';

  return (
    <Stack direction="row" justifyContent="center" spacing={1} sx={{ p: 1 }}>
      <TextMaxLine variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        {displayDescription}
      </TextMaxLine>
    </Stack>
  );
}
/**
 * @memberof CityArtWalks.Components.ArtPiece.ArtPieceCardDescription
 * @prop {string} description - The description of the art piece. Can include HTML content. This prop is required.
 */
ArtPieceCardDescription.propTypes = {
  description: PropTypes.string.isRequired,
};
