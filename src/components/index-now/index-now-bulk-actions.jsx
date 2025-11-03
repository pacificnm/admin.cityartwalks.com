'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { debugLog } from 'src/lib/debug';

import { DeleteIcon, RefreshIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * IndexNow Bulk Actions Component
 *
 * Provides bulk operation interface for selected IndexNow submissions:
 * - Bulk retry for failed submissions
 * - Bulk deletion of submissions
 * - Bulk status updates and queue management
 * - Progress tracking for bulk operations
 *
 * @memberof CityArtWalks.Sections.IndexNowSubmission.Components
 */
export function IndexNowBulkActions({ selectedIds, onBulkAction, onClearSelection }) {
  const [processing, setProcessing] = useState(false);

  const handleBulkRetry = async () => {
    debugLog('IndexNowBulkActions.handleBulkRetry', 'Bulk retry initiated', {
      count: selectedIds.length,
    });
    setProcessing(true);
    try {
      await onBulkAction('retry');
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} submissions?`)) {
      return;
    }

    debugLog('IndexNowBulkActions.handleBulkDelete', 'Bulk delete initiated', {
      count: selectedIds.length,
    });
    setProcessing(true);
    try {
      await onBulkAction('delete');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControlLabel
              control={<Checkbox checked />}
              label={`${selectedIds.length} submission${selectedIds.length === 1 ? '' : 's'} selected`}
              onChange={onClearSelection}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleBulkRetry}
              disabled={processing}
            >
              Retry Selected
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
              disabled={processing}
            >
              Delete Selected
            </Button>

            <Button variant="text" onClick={onClearSelection} disabled={processing}>
              Clear Selection
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
