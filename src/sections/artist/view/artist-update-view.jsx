/**
 * @version 1.0.0
 * @author jaimie garner
 * @namespace CityArtWalks.Sections.Artist.View.ArtistUpdateView
 */

'use client';

import { Container, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { BackToTop } from 'src/components/animate/back-to-top';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';
/**
 * @memberof CityArtWalks.Sections.Artist.View.ArtistUpdateView
 * @function ArtistUpdateView
 * @description A view component for updating artist details.
 * This component displays a scroll progress indicator, a "back to top" button, and a breadcrumb navigation
 * based on the artist's details. It adjusts the layout for small screens using a media query.
 *
 * @param {Object} props - The component properties.
 * @param {Object} props.artist - The artist object containing the details for the update.
 * @param {number} props.artist.artistId - The unique identifier of the artist.
 * @param {string} props.artist.name - The name of the artist.
 * @returns {JSX.Element} The rendered artist update view.
 *
 * @example
 * // Example usage of ArtistUpdateView
 * import ArtistUpdateView from './ArtistUpdateView';
 *
 * const artist = { artistId: 1, name: 'John Doe' };
 *
 * export default function App() {
 *   return <ArtistUpdateView artist={artist} />;
 * }
 */
export function ArtistUpdateView({ artist }) {
  const { artistId, name } = artist;
  const pageProgress = useScrollProgress();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Check for small screens
  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />
      <BackToTop />
      <Container maxWidth={false} sx={{ mb: 4 }}>
        {!isSmallScreen && (
          <CustomBreadcrumbs
            heading="Update Artist"
            links={[
              { name: 'Home', href: paths.home },
              { name: 'Art', href: paths.art.home },
              { name: 'Artist', href: paths.art.artist.list },
              { name: 'update', href: paths.art.artist.update(artistId) },
              { name },
            ]}
            sx={{ mb: 3 }}
          />
        )}
      </Container>
    </>
  );
}
