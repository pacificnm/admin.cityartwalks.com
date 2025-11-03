/**
 * @file artist-card-list.jsx
 * @description Artist card list component that renders a responsive grid of artist cards with error boundary
 * @namespace CityArtWalks.Components.Artist.ArtistCardList
 * @version 2.0.0
 * @author Jaimie Garner
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Analytics-Hooks} - Hooks documentation
 */

'use client';

import Box from '@mui/material/Box';

import { ArtistCard, ArtistEmpty } from 'src/components/artist';

import ErrorBoundary from '../error/error-boundary';

/**
 * ArtistCardList component renders a responsive grid of artist cards.
 * Displays artist information in card format with error boundary protection.
 * Shows empty state when no artists are provided.
 *
 * @function ArtistCardList
 * @memberof CityArtWalks.Components.Artist.ArtistCardList
 * @param {Object} props - The component properties
 * @param {Array<Object>} props.artists - Array of artist objects to display
 * @param {number} props.artists[].artistId - Unique identifier for the artist
 * @param {string} props.artists[].slug - URL-friendly artist identifier
 * @param {string} props.artists[].name - Artist's display name
 * @param {string} [props.artists[].biography] - Artist's biography text
 * @param {string} [props.artists[].imageUrl] - URL to artist's profile image
 * @param {string} [props.artists[].status] - Artist status (ACTIVE, PENDING, etc.)
 * @param {string} [props.artists[].createdBy] - ID of user who created the artist entry
 * @param {number} [props.artists[].viewCount] - Number of times artist has been viewed
 * @param {Object} [props.artists[]._count] - Count object with related data
 * @param {number} [props.artists[]._count.Image] - Number of images associated with artist
 * @param {number} [props.artists[]._count.ArtPiece] - Number of art pieces by artist
 * @param {string} [props.gridTemplateColumns] - CSS grid template columns for responsive layout
 * @returns {JSX.Element} Responsive grid of artist cards or empty state component
 *
 * @example
 * // Basic usage with artist data
 * const artists = [
 *   {
 *     artistId: 1,
 *     name: 'Claude Monet',
 *     slug: 'claude-monet',
 *     biography: 'French impressionist painter',
 *     imageUrl: '/images/monet.jpg',
 *     status: 'ACTIVE',
 *     viewCount: 1250,
 *     _count: { Image: 5, ArtPiece: 12 }
 *   }
 * ];
 *
 * <ArtistCardList artists={artists} />
 *
 * @example
 * // Custom grid layout
 * <ArtistCardList
 *   artists={artists}
 *   gridTemplateColumns="repeat(4, 1fr)"
 * />
 *
 * @description Features:
 * - Responsive CSS Grid layout
 * - Error boundary protection
 * - Empty state handling
 * - Artist data filtering (removes invalid entries)
 * - Supports custom grid layouts
 * - Displays artist metrics (view count, piece count, etc.)
 */
export function ArtistCardList({
  artists,
  gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))',
}) {
  if (!artists || artists.length === 0) return <ArtistEmpty />;
  return (
    <ErrorBoundary>
      <Box
        data-cy="artist-card-list"
        gap={3}
        display="grid"
        gridTemplateColumns={gridTemplateColumns}
      >
        {artists
          .filter((artist) => artist && artist.artistId)
          .map((artist, index) => (
            <ArtistCard
              key={artist.artistId || index}
              artistId={artist.artistId}
              slug={artist.slug}
              name={artist.name}
              biography={artist.biography}
              imageUrl={artist.imageUrl}
              favoriteCount={artist?._count?.Image || 0}
              pieceCount={artist?._count?.ArtPiece || 0}
              viewCount={artist.viewCount}
              status={artist.status}
              createdBy={artist.createdBy}
              uploadable={false}
            />
          ))}
      </Box>
    </ErrorBoundary>
  );
}
