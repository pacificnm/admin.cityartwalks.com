'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { debugLog } from 'src/lib/debug';

import {
  FilterIcon,
  DeleteIcon,
  ArrowUpIcon,
  MagnifierIcon,
  ArrowDownIcon,
} from 'src/components/icons';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
  { value: 'bounced', label: 'Bounced' },
];

const TEMPLATE_OPTIONS = [
  { value: 'all', label: 'All Templates' },
  { value: 'welcome', label: 'Welcome Email' },
  { value: 'weekly_digest', label: 'Weekly Digest' },
  { value: 'password_reset', label: 'Password Reset' },
  { value: 'new_art_notification', label: 'New Art Notification' },
  { value: 'path_approved', label: 'Path Approved' },
  { value: 'artist_welcome', label: 'Artist Welcome' },
  { value: 'comment_notification', label: 'Comment Notification' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'verify_email', label: 'Email Verification' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_90_days', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
];

// ----------------------------------------------------------------------

export function EmailFilters({ filters, onFilterChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customDateFrom, setCustomDateFrom] = useState(null);
  const [customDateTo, setCustomDateTo] = useState(null);

  const handleFilterUpdate = useCallback(
    (key, value) => {
      const updatedFilters = { ...filters, [key]: value };
      debugLog('EmailFilters.handleFilterUpdate', 'Filter updated', { key, value });
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  const handleSearchChange = useCallback(
    (event) => {
      handleFilterUpdate('searchQuery', event.target.value);
    },
    [handleFilterUpdate]
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      status: 'all',
      template: 'all',
      dateRange: 'all',
      searchQuery: '',
    };
    setCustomDateFrom(null);
    setCustomDateTo(null);
    debugLog('EmailFilters.handleClearFilters', 'Filters cleared');
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  const handleCustomDateChange = useCallback(() => {
    if (customDateFrom && customDateTo) {
      const updatedFilters = {
        ...filters,
        dateRange: 'custom',
        customDateFrom,
        customDateTo,
      };
      debugLog('EmailFilters.handleCustomDateChange', 'Custom date range set', {
        from: customDateFrom,
        to: customDateTo,
      });
      onFilterChange(updatedFilters);
    }
  }, [filters, customDateFrom, customDateTo, onFilterChange]);

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.template !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.searchQuery !== '';

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          {/* Basic Filters */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Search emails..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifierIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterUpdate('status', e.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={showAdvanced ? <ArrowUpIcon /> : <ArrowDownIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Advanced
            </Button>

            {hasActiveFilters && (
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleClearFilters}
                color="error"
              >
                Clear
              </Button>
            )}
          </Stack>

          {/* Advanced Filters */}
          <Collapse in={showAdvanced}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Template</InputLabel>
                  <Select
                    value={filters.template}
                    label="Template"
                    onChange={(e) => handleFilterUpdate('template', e.target.value)}
                  >
                    {TEMPLATE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={filters.dateRange}
                    label="Date Range"
                    onChange={(e) => handleFilterUpdate('dateRange', e.target.value)}
                  >
                    {DATE_RANGE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* Custom Date Range */}
              {filters.dateRange === 'custom' && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <DatePicker
                    label="From Date"
                    value={customDateFrom}
                    onChange={setCustomDateFrom}
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                  <DatePicker
                    label="To Date"
                    value={customDateTo}
                    onChange={setCustomDateTo}
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleCustomDateChange}
                    disabled={!customDateFrom || !customDateTo}
                  >
                    Apply
                  </Button>
                </Stack>
              )}

              {/* Filter Summary */}
              {hasActiveFilters && (
                <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FilterIcon sx={{ color: 'action.active' }} />
                    <Box>
                      {filters.status !== 'all' && (
                        <span>
                          Status: {STATUS_OPTIONS.find((o) => o.value === filters.status)?.label}{' '}
                          •{' '}
                        </span>
                      )}
                      {filters.template !== 'all' && (
                        <span>
                          Template:{' '}
                          {TEMPLATE_OPTIONS.find((o) => o.value === filters.template)?.label} •{' '}
                        </span>
                      )}
                      {filters.dateRange !== 'all' && (
                        <span>
                          Date:{' '}
                          {DATE_RANGE_OPTIONS.find((o) => o.value === filters.dateRange)?.label}{' '}
                          •{' '}
                        </span>
                      )}
                      {filters.searchQuery && (
                        <span>Search: &quot;{filters.searchQuery}&quot;</span>
                      )}
                    </Box>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
