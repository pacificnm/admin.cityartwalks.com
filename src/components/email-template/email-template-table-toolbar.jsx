/**
 * @version 1.0.0
 * @namespace CityArtWalks.Components.EmailTemplate.EmailTemplateTableToolbar
 */

'use client';

import { useCallback } from 'react';

import {
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

import { debugLog } from 'src/lib/debug';

import { DeleteIcon, MagnifierIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Components.EmailTemplate.EmailTemplateTableToolbar
 * @description Toolbar component for email template table with filters and search
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilters - Filter change handler
 * @param {boolean} props.canReset - Whether filters can be reset
 * @param {Function} props.onResetFilters - Reset filters handler
 * @returns {JSX.Element} The rendered component
 */
export function EmailTemplateTableToolbar({ filters, onFilters, canReset, onResetFilters }) {
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterCategory = useCallback(
    (event) => {
      onFilters('category', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event) => {
      onFilters('status', event.target.value);
    },
    [onFilters]
  );

  const handleReset = useCallback(() => {
    debugLog('EmailTemplateTableToolbar.handleReset', 'Resetting filters');
    onResetFilters();
  }, [onResetFilters]);

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category}
          onChange={handleFilterCategory}
          input={<OutlinedInput label="Category" />}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="contact">Contact</MenuItem>
          <MenuItem value="notification">Notification</MenuItem>
          <MenuItem value="marketing">Marketing</MenuItem>
          <MenuItem value="system">System</MenuItem>
          <MenuItem value="transactional">Transactional</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 160 },
        }}
      >
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Status" />}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Search templates..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifierIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {canReset && (
          <Button
            color="error"
            sx={{ flexShrink: 0 }}
            onClick={handleReset}
            startIcon={<DeleteIcon />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
