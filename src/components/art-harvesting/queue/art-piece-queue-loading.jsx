/**
 * @file art-piece-queue-loading.jsx
 * @description Loading state component for art piece queue detail view
 * @author Generated
 * @version 1.0.0
 */

'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

/**
 * ArtPieceQueueLoading component
 * Displays loading state for art piece queue items
 *
 * @returns {JSX.Element} The loading component
 */
export function ArtPieceQueueLoading() {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ py: 4, textAlign: 'center' }}>Loading queue item details...</Box>
    </Card>
  );
}
