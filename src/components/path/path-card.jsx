/**
 * @namespace CityArtWalks.Components.Path.PathCard
 * @version 1.0.0
 * @author jaimie garner
 */

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

import ErrorBoundary from 'src/components/error/error-boundary';

import { OwnerGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

import { PathFollowers } from './path-followers';
import { PathCardTitle } from './path-card-title';
import { PathCardAvatar } from './path-card-avatar';
import { PathCardDescription } from './path-card-description';

/**
 * @memberof CityArtWalks.Components.Path.PathCard
 * @description PathCard component displays a card with information about a specific path.
 * @function PathCard
 * @param {Object} props - The properties object.
 * @param {string} props.pathId - The unique identifier for the path.
 * @param {string} props.title - The title of the path.
 * @param {string} props.description - The description of the path.
 * @param {string} props.imageUrl - The URL of the image associated with the path.
 * @param {number} props.favoriteCount - The number of times the path has been marked as favorite.
 * @param {number} props.pieceCount - The number of pieces in the path.
 * @param {number} props.viewCount - The number of times the path has been viewed.
 * @param {string} [props.status] - The status of the path (ACTIVE, DRAFT, REVIEW, etc.).
 * @param {string|number} [props.createdBy] - The user ID who created the path.
 * @returns {JSX.Element} The rendered PathCard component.
 */
export function PathCard({
  pathId,
  title,
  description,
  imageUrl,
  favoriteCount,
  pieceCount,
  viewCount,
  reviewCount,
  status,
  createdBy,
}) {
  const { user } = useAuthContext();

  // Check if current user owns this path
  const isOwner = user && createdBy && Number(user.userId) === Number(createdBy);

  // Define colors based on status (same logic as ArtPieceCard)
  const getStatusColors = (statusValue) => {
    switch (statusValue?.toUpperCase()) {
      case 'ACTIVE':
        return {
          chipColor: 'success',
        };
      case 'PENDING':
        return {
          chipColor: 'warning',
        };
      default:
        return {
          chipColor: 'error',
        };
    }
  };

  const { chipColor } = getStatusColors(status);
  return (
    <ErrorBoundary>
      <Card sx={{ textAlign: 'center', position: 'relative' }} data-cy="artist-card">
        {/* Status pill for owners */}
        {isOwner && status && (
          <OwnerGuard userId={createdBy}>
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              <Chip
                label={status || 'Unknown'}
                color={chipColor}
                size="small"
                variant="filled"
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          </OwnerGuard>
        )}

        <PathCardAvatar pathId={pathId} title={title} imageUrl={imageUrl} />
        <PathCardTitle title={title} />
        <PathCardDescription description={description} />
        <Divider sx={{ borderStyle: 'dashed' }} />
        <PathFollowers
          favoriteCount={favoriteCount}
          pieceCount={pieceCount}
          viewCount={viewCount}
          reviewCount={reviewCount}
        />
      </Card>
    </ErrorBoundary>
  );
}

/**
 * @memberof CityArtWalks.Components.Path.PathCard
 * @prop {string} pathId - The unique identifier for the path. This prop is required.
 * @prop {string} title - The title of the path. This prop is required.
 * @prop {string} description - The description of the path. This prop is required.
 * @prop {string} imageUrl - The URL of the image associated with the path. This prop is required.
 * @prop {number} favoriteCount - The number of times the path has been marked as favorite. This prop is optional.
 * @prop {number} pieceCount - The number of pieces in the path. This prop is optional.
 * @prop {number} viewCount - The number of times the path has been viewed. This prop is optional.
 * @prop {string} [status] - The status of the path. This prop is optional.
 * @prop {string|number} [createdBy] - The user ID who created the path. This prop is optional.
 */
PathCard.propTypes = {
  pathId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  favoriteCount: PropTypes.number,
  pieceCount: PropTypes.number,
  viewCount: PropTypes.number,
  reviewCount: PropTypes.number,
  status: PropTypes.string,
  createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
