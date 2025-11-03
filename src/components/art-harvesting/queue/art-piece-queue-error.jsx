/**
 * @file art-piece-queue-error.jsx
 * @description Error state component for art piece queue detail view
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

/**
 * ArtPieceQueueError component
 * Displays error state for art piece queue items
 *
 * @param {Object} props - Component props
 * @param {Object} props.error - Error object
 * @param {string} props.id - Queue item ID
 * @returns {JSX.Element} The error component
 */
export function ArtPieceQueueError({ error, id }) {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <p>Error loading queue item: {error.message}</p>
        <p>ID: {id}</p>
      </Box>
    </Card>
  );
}
