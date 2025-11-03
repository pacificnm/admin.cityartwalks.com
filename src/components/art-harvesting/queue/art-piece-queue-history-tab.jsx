/**
 * @file art-piece-queue-history-tab.jsx
 * @description History tab component for art piece queue detail view
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

/**
 * ArtPieceQueueHistoryTab component
 * Provides history panel for art piece queue items
 *
 * @param {Object} props - Component props
 * @param {Object} props.artPieceQueue - Art piece queue data
 * @returns {JSX.Element} The history tab component
 */
export function ArtPieceQueueHistoryTab({ artPieceQueue }) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Verification History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Track all verification actions and status changes for this queue item.
        </Typography>
        <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2">{fDateTime(artPieceQueue.createdAt)}</Typography>
              <Typography variant="body2" color="text.secondary">
                Queue item created
                {artPieceQueue.CreatedByUser &&
                  ` by ${artPieceQueue.CreatedByUser.firstName} ${artPieceQueue.CreatedByUser.lastName}`}
              </Typography>
            </Box>
            {artPieceQueue.updatedAt !== artPieceQueue.createdAt && (
              <Box>
                <Typography variant="subtitle2">{fDateTime(artPieceQueue.updatedAt)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status updated to {artPieceQueue.status}
                </Typography>
              </Box>
            )}
          </Stack>
        </Card>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            TODO: Implement VerificationHistory component with:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2 }}>
            <li>Complete timeline of verification actions</li>
            <li>Comments and notes history with timestamps</li>
            <li>Status change tracking with user attribution</li>
            <li>Activity log with detailed change records</li>
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
