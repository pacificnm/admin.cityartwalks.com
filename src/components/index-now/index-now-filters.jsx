'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';

import { debugLog } from 'src/lib/debug';

import { SearchIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * IndexNow Submission Filters Component
 *
 * Provides comprehensive filtering interface for IndexNow submissions:
 * - Search by URL, entity ID, or response details
 * - Status filtering (pending, submitted, success, failed)
 * - Entity type filtering (artist, art piece, path, post)
 * - Action type filtering (created, updated, deleted)
 * - Date range filtering for submission history
 *
 * @memberof CityArtWalks.Sections.IndexNowSubmission.Components
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Filters|IndexNow Filters Documentation}
 */
export function IndexNowFilters({ filters, onFiltersChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = useCallback(
    (field, value) => {
      const updatedFilters = { ...localFilters, [field]: value };
      setLocalFilters(updatedFilters);

      debugLog('IndexNowFilters.handleFilterChange', 'Filter updated', { field, value });
      onFiltersChange(updatedFilters);
    },
    [localFilters, onFiltersChange]
  );

  const handleReset = useCallback(() => {
    const resetFilters = {
      status: 'all',
      entityType: 'all',
      action: 'all',
      dateRange: 'all',
      searchQuery: '',
    };

    setLocalFilters(resetFilters);
    debugLog('IndexNowFilters.handleReset', 'Filters reset');
    onFiltersChange(resetFilters);
  }, [onFiltersChange]);

  return (
    <Card>
      <CardHeader title="Filters" />

      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Search */}
          <TextField
            fullWidth
            label="Search"
            placeholder="Search by URL, entity ID, or response..."
            value={localFilters.searchQuery}
            onChange={(event) => handleFilterChange('searchQuery', event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size={20} />
                </InputAdornment>
              ),
            }}
          />

          {/* Filter Row */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {/* Status Filter */}
            <TextField
              select
              label="Status"
              value={localFilters.status}
              onChange={(event) => handleFilterChange('status', event.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="SUBMITTED">Submitted</MenuItem>
              <MenuItem value="SUCCESS">Success</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </TextField>

            {/* Entity Type Filter */}
            <TextField
              select
              label="Entity Type"
              value={localFilters.entityType}
              onChange={(event) => handleFilterChange('entityType', event.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="ARTIST">Artist</MenuItem>
              <MenuItem value="ART_PIECE">Art Piece</MenuItem>
              <MenuItem value="PATH">Path</MenuItem>
              <MenuItem value="POST">Post</MenuItem>
            </TextField>

            {/* Action Filter */}
            <TextField
              select
              label="Action"
              value={localFilters.action}
              onChange={(event) => handleFilterChange('action', event.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Actions</MenuItem>
              <MenuItem value="CREATED">Created</MenuItem>
              <MenuItem value="UPDATED">Updated</MenuItem>
              <MenuItem value="DELETED">Deleted</MenuItem>
            </TextField>

            {/* Date Range Filter */}
            <TextField
              select
              label="Date Range"
              value={localFilters.dateRange}
              onChange={(event) => handleFilterChange('dateRange', event.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
            </TextField>

            {/* Reset Button */}
            <Button variant="outlined" onClick={handleReset} sx={{ minWidth: 100 }}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
