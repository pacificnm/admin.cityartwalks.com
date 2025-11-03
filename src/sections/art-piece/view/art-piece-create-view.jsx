/**
 * @namespace CityArtWalks.Sections.ArtPiece.View.ArtPieceCreateView
 * @version 1.0.0
 * @author jaimie garner
 * @fileoverview View component for creating new art pieces with location-based defaults and artist context
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Views} - View component patterns
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form integration documentation
 */

'use client';

import PropTypes from 'prop-types';

import { Container, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';

import { ArtPieceForm } from 'src/forms/art-piece';
import { useGetGeoLocation } from 'src/actions/geo-location/hooks';

import { ErrorView } from 'src/components/error';
import { BackToTop } from 'src/components/animate/back-to-top';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

import { ArtPieceCreateSkeleton } from '..';

/**
 * @memberof CityArtWalks.Sections.ArtPiece.View.ArtPieceCreateView
 * @function ArtPieceCreateView
 * @description View component for creating new art pieces with artist context and location-based defaults.
 *
 * This component provides a complete interface for creating new art pieces, including:
 * - Artist context validation and display
 * - Geographic location detection for default coordinates
 * - Responsive breadcrumb navigation
 * - Role-based access control
 * - Loading and error state handling
 *
 * The component integrates with the ArtPieceForm to handle the actual form submission
 * and validation, while providing the necessary context and navigation structure.
 *
 * @param {Object} props - Component props
 * @param {Object} props.artist - Artist data containing name, slug, and artistId
 * @param {string} props.artist.name - Artist's display name for breadcrumbs and UI
 * @param {string} props.artist.slug - Artist's URL slug for navigation links
 * @param {number|string} props.artist.artistId - Artist's unique identifier for form submission
 *
 * @returns {JSX.Element} The rendered art piece creation view with form, navigation, and loading states
 *
 * @throws {Error} When artist data is missing or invalid
 * @throws {Error} When geolocation services fail
 *
 * @example
 * // Basic usage with artist data
 * const artist = {
 *   name: 'Vincent van Gogh',
 *   slug: 'vincent-van-gogh',
 *   artistId: 123
 * };
 *
 * <ArtPieceCreateView artist={artist} />
 *
 * @example
 * // Renders loading state when geolocation is being fetched
 * // Renders error state if geolocation fails
 * // Renders not found state if artist is null/undefined
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPiece} - ArtPiece entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Artist} - Artist entity documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Views} - View component patterns
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} - Form integration documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Geolocation} - Geolocation service documentation
 */
export function ArtPieceCreateView({ artist }) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const pageProgress = useScrollProgress();

  const { accessToken } = useAuthContext();
  const { location, locationLoading, locationError } = useGetGeoLocation(accessToken);

  // Extract artist properties only if artist is provided
  const name = artist?.name;
  const slug = artist?.slug;
  const artistId = artist?.artistId;

  // If artist is provided, validate required properties
  if (artist && (!name || !slug || !artistId)) {
    return <ErrorView message="Invalid artist data. Missing required properties." />;
  }

  // Handle loading states
  if (locationLoading) {
    return <ArtPieceCreateSkeleton />;
  }

  // Handle geolocation errors
  if (locationError) {
    return <ErrorView message="There was an error loading location data for the art piece form." />;
  }

  return (
    <>
      <ScrollProgress
        data-cy="scroll-progress"
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />
      <BackToTop data-cy="back-to-top" />
      <RoleBasedGuard
        allowedRoles={['MEMBER', 'ADMIN']}
        displayMode="view"
        protecting="ArtPieceCreateView"
      >
        <Container maxWidth={false} sx={{ mb: 4 }}>
          {!isSmallScreen && artist && (
            <CustomBreadcrumbs
              data-cy="breadcrumbs"
              heading="Create Artwork"
              links={[
                { name: 'Home', href: paths.home },
                { name: 'Art', href: paths.art.home },
                { name: 'Artists', href: paths.art.artist.list },
                { name, href: paths.art.artist.details(slug) },
                { name: 'Artwork', href: paths.art.artist.artwork.list(slug) },
                { name: 'Create' },
              ]}
              sx={{ mb: 3 }}
            />
          )}
          {!isSmallScreen && !artist && (
            <CustomBreadcrumbs
              data-cy="breadcrumbs"
              heading="Create Artwork"
              links={[
                { name: 'Home', href: paths.home },
                { name: 'Art', href: paths.art.home },
                { name: 'Create' },
              ]}
              sx={{ mb: 3 }}
            />
          )}
          <ArtPieceForm
            currentArtPiece={null}
            artistId={artistId}
            slug={slug}
            location={location}
          />
        </Container>
      </RoleBasedGuard>
    </>
  );
}

/**
 * @memberof CityArtWalks.Sections.ArtPiece.View.ArtPieceCreateView
 * @prop {Object} artist - Artist data containing name, slug, and artistId. This prop is required.
 * @prop {string} artist.name - Artist's display name for breadcrumbs and UI. This prop is required.
 * @prop {string} artist.slug - Artist's URL slug for navigation links. This prop is required.
 * @prop {number|string} artist.artistId - Artist's unique identifier for form submission. This prop is required.
 */
ArtPieceCreateView.propTypes = {
  artist: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    artistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
};
