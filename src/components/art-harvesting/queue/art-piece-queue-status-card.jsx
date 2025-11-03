/**
 * @file art-piece-queue-status-card.jsx
 * @description Status card component for art piece queue detail view
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

/**
 * Gets the appropriate Material-UI color for queue status values
 * @param {string} status - The status value from entity
 * @returns {string} Material-UI color name
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'PROCESSING':
      return 'info';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    case 'PUBLISHED':
      return 'primary';
    case 'ERROR':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * ArtPieceQueueStatusCard component
 * Displays status information for art piece queue items
 *
 * @param {Object} props - Component props
 * @param {Object} props.artPieceQueue - Art piece queue data
 * @returns {JSX.Element} The status card component
 */
export function ArtPieceQueueStatusCard({ artPieceQueue }) {
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Status Information
      </Typography>
      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Status
          </Typography>
          <Chip
            label={artPieceQueue.status || 'PENDING'}
            color={getStatusColor(artPieceQueue.status)}
            size="small"
          />
        </Box>
        {artPieceQueue.status === 'PUBLISHED' &&
          artPieceQueue.artPieceId &&
          artPieceQueue.ArtPiece &&
          artPieceQueue.ArtPiece.Artist &&
          artPieceQueue.ArtPiece.slug &&
          artPieceQueue.ArtPiece.Artist.slug && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Published Art Piece
              </Typography>
              <Button
                component={RouterLink}
                href={paths.art.artist.artwork.details(
                  artPieceQueue.ArtPiece.Artist.slug,
                  artPieceQueue.ArtPiece.slug
                )}
                variant="outlined"
                size="small"
                color="primary"
              >
                View Art Piece
              </Button>
            </Box>
          )}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Created
          </Typography>
          <Typography variant="body1">
            {artPieceQueue.createdAt ? fDateTime(artPieceQueue.createdAt) : '-'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Updated
          </Typography>
          <Typography variant="body1">
            {artPieceQueue.updatedAt ? fDateTime(artPieceQueue.updatedAt) : '-'}
          </Typography>
        </Box>
        {artPieceQueue.CreatedByUser && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created By
            </Typography>
            <Typography variant="body1">
              {artPieceQueue.CreatedByUser.firstName} {artPieceQueue.CreatedByUser.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {artPieceQueue.CreatedByUser.email}
            </Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
