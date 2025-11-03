/**
 * @namespace CityArtWalks.Components.Artist.ArtistStaticMap
 * @version 1.0.0
 * @author jaimie garner
 */

import Link from 'next/link';
import Image from 'next/image';

import { Box, Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ArtistEmpty } from '.';

/**
 * @memberof CityArtWalks.Components.Artist.ArtistStaticMap
 * @function ArtistStaticMap
 * @description Renders a static map image for an artist's location.
 * Displays a skeleton loader if the map URL is not provided.
 *
 * @param {Object} props - The component props.
 * @param {string} props.name - The name of the artist, used for the `alt` text of the image.
 * @param {string} props.staticMapUrl - The URL of the static map image. If not provided, a skeleton loader is shown.
 * @param {string} props.slug - The unique slug of the artist, used for generating the link to their artwork list.
 * @param {number} [props.width=380] - The width of the static map image.
 * @param {number} [props.height=380] - The height of the static map image.
 * @param {Object} [props.other] - Additional props to pass to the `Image` component.
 * @returns {JSX.Element} The rendered ArtistStaticMap component.
 *
 * @example
 * // Usage example
 * import { ArtistStaticMap } from './ArtistStaticMap';
 *
 * function App() {
 *   return (
 *     <ArtistStaticMap
 *       name="Vincent van Gogh"
 *       staticMapUrl="/maps/van-gogh-map.jpg"
 *       slug="vincent-van-gogh"
 *       width={400}
 *       height={400}
 *     />
 *   );
 * }
 */
export function ArtistStaticMap({
  name,
  staticMapUrl,
  slug,
  width = 380,
  height = 380,
  link,
  ...other
}) {
  if (staticMapUrl === null || staticMapUrl == 'null') {
    return (
      <ArtistEmpty title="No Art Pieces" description="This artist does not have any art pieces." />
    );
  }

  if (!link) {
    return (
      <Card>
        <Box
          {...other}
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: `${width} / ${height}`,
            minHeight: 100,
            ...other?.sx,
          }}
        >
          <Image
            src={staticMapUrl}
            alt={name}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>
      </Card>
    );
  }

  return (
    <Card>
      <Box
        {...other}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${width} / ${height}`,
          minHeight: 100,
          ...other?.sx,
        }}
      >
        <Link href={paths.art.artist.artwork.list(slug)} data-cy="artist-static-map-link">
          <Image
            src={staticMapUrl}
            alt={name}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </Link>
      </Box>
    </Card>
  );
}
