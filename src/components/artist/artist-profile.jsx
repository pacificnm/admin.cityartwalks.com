/**
 * @namespace CityArtWalks.Components.Artist.ArtistProfile
 * @version 1.0.0
 * @author jaimie garner
 */

import React from 'react';

import Grid from '@mui/material/Grid';
import { Box, Stack } from '@mui/material';

import { ArtistAbout } from 'src/components/artist/artist-about';
import { ArtistDetails } from 'src/components/artist/artist-details';
import { ArtistFollowers } from 'src/components/artist/artist-followers';
import { ArtistLocationsDisplay } from 'src/components/artist/artist-locations-display';

import { ArtistImage } from '.';
import ErrorBoundary from '../error/error-boundary';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistProfile
 * @function ArtistProfile
 * @description Renders a detailed artist profile, including biography, a static map of the artist's location,
 * birth and death dates, and follower statistics.
 *
 * @param {Object} props - The component props.
 * @param {string} props.artistId - The unique ID of the artist.
 * @param {string} props.name - The name of the artist, used for display and the static map `alt` text.
 * @param {string} [props.staticMapUrl] - The URL of the static map image representing the artist's location.
 * @param {string} props.slug - The unique slug of the artist, used for navigation.
 * @param {string} [props.biography] - The biography or description of the artist.
 * @param {string} [props.birthDate] - The birth date of the artist in ISO 8601 format (e.g., "1853-03-30").
 * @param {string} [props.deathDate] - The death date of the artist in ISO 8601 format (e.g., "1890-07-29").
 * @param {Object} [props.other] - Additional props to pass to the outer `Box` component.
 * @returns {JSX.Element} The rendered ArtistProfile component.
 *
 * @example
 * // Usage example
 * import { ArtistProfile } from './ArtistProfile';
 *
 * function App() {
 *   return (
 *     <ArtistProfile
 *       artistId="123"
 *       name="Vincent van Gogh"
 *       staticMapUrl="/maps/van-gogh-map.jpg"
 *       slug="vincent-van-gogh"
 *       biography="Vincent van Gogh was a Dutch post-impressionist painter..."
 *       birthDate="1853-03-30"
 *       deathDate="1890-07-29"
 *     />
 *   );
 * }
 */
export function ArtistProfile(props) {
  const {
    artistId,
    name,
    slug,
    biography,
    birthDate,
    deathDate,
    favoriteCount,
    pieceCount,
    viewCount,
    imageUrl,
    website,
    instagram,
    facebook,
    editDialog,
    createdBy,
    createdAt,
    updatedAt,
    nationality,
    featured,
    status,
    country,
    state,
    city,
    ...other
  } = props;
  return (
    <ErrorBoundary>
      <Box data-cy="artist-profile" {...other}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ArtistAbout
              name={name}
              artistId={artistId}
              slug={slug}
              biography={biography}
              birthDate={birthDate}
              deathDate={deathDate}
              website={website}
              instagram={instagram}
              facebook={facebook}
              editDialog={editDialog}
              createdBy={createdBy}
              data-cy="artist-about"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <ArtistFollowers
                favoriteCount={favoriteCount}
                pieceCount={pieceCount}
                viewCount={viewCount}
                data-cy="artist-followers"
              />
              <ArtistImage
                imageUrl={imageUrl}
                title={name}
                width={200}
                height={300}
                artistId={artistId}
                createdBy={createdBy}
              />
              <ArtistDetails
                artistId={artistId}
                createdBy={createdBy}
                createdAt={createdAt}
                updatedAt={updatedAt}
                birthDate={birthDate}
                deathDate={deathDate}
                nationality={nationality}
                website={website}
                facebook={facebook}
                instagram={instagram}
                viewCount={viewCount}
                featured={featured}
                status={status}
                country={country}
                state={state}
                city={city}
                artPieceCount={pieceCount}
                favoriteCount={favoriteCount}
              />
              <ArtistLocationsDisplay artistId={artistId} data-cy="artist-locations" />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ErrorBoundary>
  );
}
