import { Chip } from '@mui/material';
//----------------------------------------------------------------------

/**
 * Renders the appropriate type of image based on the provided props.
 * @param {Object} props - The component props.
 * @param {string} props.artistId - The ID of the artist.
 * @param {string} props.artPieceId - The ID of the art piece.
 * @param {string} props.userId - The ID of the user.
 * @returns {JSX.Element} - The rendered image type.
 */
export function ImageType({ artistId, artPieceId, userId }) {
  let type = 'unknown image';

  if (!artistId && !artPieceId && !userId) {
    type = 'unknown image';
  }

  if (userId && !artistId && !artPieceId) {
    type = 'profile image';
  }

  if (artistId && !artPieceId) {
    type = 'artist image';
  }

  if (artPieceId && artistId) {
    type = 'art piece image';
  }

  return <Chip label={type} />;
}
