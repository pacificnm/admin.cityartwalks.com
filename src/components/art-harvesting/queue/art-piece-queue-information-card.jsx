/**
 * @file art-piece-queue-information-card.jsx
 * @description Information card component for art piece queue detail view
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * ArtPieceQueueInformationCard component
 * Displays related information for art piece queue items
 *
 * @param {Object} props - Component props
 * @param {Object} props.artPieceQueue - Art piece queue data
 * @returns {JSX.Element} The information card component
 */
export function ArtPieceQueueInformationCard({ artPieceQueue }) {
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Related Information
      </Typography>
      <Stack spacing={2}>
        {artPieceQueue.harvestBatchId && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Harvest Batch
            </Typography>
            <Typography variant="body1">#{artPieceQueue.harvestBatchId}</Typography>
          </Box>
        )}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Source Domain
          </Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
            {artPieceQueue.sourceUrl ? new URL(artPieceQueue.sourceUrl).hostname : '-'}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
