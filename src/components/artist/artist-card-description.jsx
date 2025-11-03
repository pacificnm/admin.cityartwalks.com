/**
 * @namespace CityArtWalks.Components.Artist.ArtistCardDescription
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Stack from '@mui/material/Stack';

import { stripHtmlTags } from 'src/utils/change-case';

import { TextMaxLine } from 'src/components/text-max-line';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistCardDescription
 * @function ArtistCardDescription
 * @description Renders the description of an artist card.
 * Ensures the description is properly formatted and handles cases where the description is missing or empty.
 *
 * @param {Object} props - The component props.
 * @param {string} props.biography - The biography or description of the artist.
 * If not provided, a default message will be displayed.
 * @returns {JSX.Element} The rendered ArtistCardDescription component.
 *
 * @example
 * // Usage example
 * import { ArtistCardDescription } from './ArtistCardDescription';
 *
 * function App() {
 *   return <ArtistCardDescription biography="Vincent van Gogh was a Dutch painter." />;
 * }
 */
export function ArtistCardDescription({ biography }) {
  // Handle cases where the description might be missing or empty
  const displayDescription = biography ? stripHtmlTags(biography) : 'No description available.';

  return (
    <Stack direction="row" justifyContent="center" spacing={1} sx={{ p: 1, minHeight: '12em' }}>
      <TextMaxLine line={8} variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
        {displayDescription}
      </TextMaxLine>
    </Stack>
  );
}
