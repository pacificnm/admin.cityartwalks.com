/**
 * @namespace CityArtWalks.Components.Artist.ArtistAbout
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

import { fBirthdate } from 'src/utils/format-time';

import { ArtistCardBiography } from 'src/components/artist/artist-card-biography';

import { ArtistPopover } from '.';
import ErrorBoundary from '../error/error-boundary';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistAbout
 * @function ArtistAbout
 * @description Renders a detailed section about the artist, including biography, birth and death dates, and follower information.
 * @param {Object} props - The component props.
 * @param {string} props.artistId - The unique ID of the artist.
 * @param {string} [props.biography] - The biography or description of the artist. Parsed HTML content is rendered.
 * @param {string} [props.birthDate] - The birth date of the artist in ISO 8601 format (e.g., "1853-03-30").
 * @param {string} [props.deathDate] - The death date of the artist in ISO 8601 format (e.g., "1890-07-29").
 * @returns {JSX.Element} The rendered ArtistAbout component.
 *
 * @example
 * // Usage example
 * import { ArtistAbout } from './ArtistAbout';
 *
 * function App() {
 *   return (
 *     <ArtistAbout
 *       artistId="123"
 *       biography="Vincent van Gogh was a Dutch post-impressionist painter..."
 *       birthDate="1853-03-30"
 *       deathDate="1890-07-29"
 *     />
 *   );
 * }
 */
export function ArtistAbout(props) {
  const {
    name,
    artistId,
    slug,
    biography,
    birthDate,
    deathDate,
    website,
    instagram,
    facebook,
    editDialog,
    createdBy,
    ...other
  } = props;
  return (
    <ErrorBoundary>
      <Box {...other}>
        <Card>
          <CardHeader title={name ?? 'Untitled Artist'} />
          <Stack sx={{ mr: 3, ml: 3, mb: 2 }}>
            <Stack spacing={1} flexGrow={1}>
              <Box sx={{ typography: 'body2' }}>
                <ArtistCardBiography biography={biography} />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center">
              {/* Buttons aligned to the left */}
              <Stack
                spacing={1.5}
                direction="row"
                flexWrap="wrap"
                justifyContent="flex-start"
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                <ArtistPopover
                  artistId={artistId}
                  name={name}
                  slug={slug}
                  website={website}
                  instagram={instagram}
                  facebook={facebook}
                  editDialog={editDialog}
                  createdBy={createdBy}
                />
              </Stack>

              {/* Other items aligned to the right */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                flexGrow={1} // Ensures this Stack takes remaining space
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                {fBirthdate(birthDate, deathDate)}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Box>
    </ErrorBoundary>
  );
}
