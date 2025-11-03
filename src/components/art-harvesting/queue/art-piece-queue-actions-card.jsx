/**
 * @file art-piece-queue-actions-card.jsx
 * @description Actions card component for art piece queue detail view providing quick action buttons
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue.ActionsCard
 * @author Generated
 * @version 1.1.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Harvesting} - Art harvesting pipeline documentation
 */

'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { debugError } from 'src/lib/debug';

/**
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue.ActionsCard
 * @function ArtPieceQueueActionsCard
 * @description React component that displays quick action buttons for art piece queue items.
 * Provides approve, reject, and review actions with loading states and proper error handling.
 *
 * Features:
 * - Quick action buttons for common queue operations
 * - Loading states during async operations
 * - Disabled states based on current item status
 * - Error handling with debug logging
 * - Responsive card layout
 *
 * @param {Object} props - Component props
 * @param {Object} props.artPieceQueue - Art piece queue data object
 * @param {number} props.artPieceQueue.artPieceQueueId - Unique identifier for the queue item
 * @param {string} props.artPieceQueue.status - Current status of the queue item
 * @param {Function} props.onVerificationAction - Handler function for verification actions
 * @param {string} props.onVerificationAction.action - Action type (APPROVED, REJECTED, REVIEWING)
 * @param {string} props.onVerificationAction.notes - Optional notes for the action
 * @returns {JSX.Element} The rendered actions card component
 *
 * @example
 * <ArtPieceQueueActionsCard
 *   artPieceQueue={queueItem}
 *   onVerificationAction={handleVerificationAction}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Harvesting} - Art harvesting pipeline documentation
 */
export function ArtPieceQueueActionsCard({ artPieceQueue, onVerificationAction }) {
  const [loading, setLoading] = useState(false);

  /**
   * @memberof CityArtWalks.Components.ArtHarvesting.Queue.ActionsCard.ArtPieceQueueActionsCard
   * @function handleAction
   * @description Handles action button clicks with loading state and error handling
   * @param {string} action - The action type to perform
   * @param {string} notes - Optional notes for the action
   * @async
   * @private
   */
  const handleAction = async (action, notes) => {
    setLoading(true);
    try {
      await onVerificationAction(action, notes);
    } catch (error) {
      debugError(
        'CityArtWalks.Components.ArtHarvesting.Queue.ActionsCard.ArtPieceQueueActionsCard.handleAction',
        'Failed to execute queue action',
        {
          action,
          notes,
          artPieceQueueId: artPieceQueue?.artPieceQueueId,
          error: error.message,
        }
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Stack spacing={1}>
        <Button
          variant="outlined"
          size="small"
          color="success"
          onClick={() => handleAction('APPROVED', '')}
          disabled={artPieceQueue.status === 'APPROVED' || loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          Approve Item
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleAction('REJECTED', 'Item rejected')}
          disabled={artPieceQueue.status === 'REJECTED' || loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          Reject Item
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="warning"
          onClick={() => handleAction('REVIEWING', 'Item under review')}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          Review
        </Button>
      </Stack>
    </Card>
  );
}
