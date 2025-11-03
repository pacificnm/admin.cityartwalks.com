'use client';

import Link from 'next/link';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

/**
 * Renders an image with a link based on the provided data.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data used to determine the image type and link destination.
 * @returns {JSX.Element} The rendered image with a link.
 */
export function ImageTypeLink({ data }) {
  let title = 'unknown image';
  let path = '#';
  let display = 'unknown image';

  const { artistId, artPieceId, created_by: userId } = data;

  if (!artistId && !artPieceId && !userId) {
    title = 'unknown image';
  }

  if (userId && !artistId && !artPieceId) {
    title = 'profile image';
    path = paths.dashboard.user.view(userId);
    display = data.createdBy.name;
  }

  if (artistId && !artPieceId) {
    title = 'artist image';
    path = paths.dashboard.artist.view(data.artist.slug);
    display = data.artist.name;
  }

  if (artPieceId && artistId) {
    title = 'art piece image';
    path = paths.dashboard.artPiece.view(data.piece.slug);
    display = `${data.artist.name} - ${data.piece.title}`;
  }

  return (
    <Link href={path} style={{ textDecoration: 'none' }} title={title}>
      {display}
    </Link>
  );
}
