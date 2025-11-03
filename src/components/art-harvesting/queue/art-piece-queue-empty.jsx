/**
 * @file art-piece-queue-empty.jsx
 * @description Empty state component for art piece queue detail view
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

/**
 * ArtPieceQueueEmpty component
 * Displays empty state when queue item is not found
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Queue item ID
 * @returns {JSX.Element} The empty state component
 */
export function ArtPieceQueueEmpty({ id }) {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <p>Queue item not found</p>
        <p>ID: {id}</p>
      </Box>
    </Card>
  );
}
