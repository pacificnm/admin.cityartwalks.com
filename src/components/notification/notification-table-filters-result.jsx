'use client';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { DeleteIcon } from 'src/components/icons';

/**
 * Notification Table Filters Result component
 * Displays active filters and allows clearing them
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {number} props.totalResults - Total number of results
 * @param {Function} props.onResetPage - Handler to reset pagination
 * @param {Function} props.onClearFilters - Handler to clear all filters
 * @param {Function} props.onFilterChange - Handler for filter changes
 * @param {string} props.search - Current search value
 * @param {Object} props.displayFilters - Object defining which filters should be displayed
 * @param {Object} props.sx - Custom styles
 * @returns {JSX.Element} The filters result component
 */
export function NotificationTableFiltersResult({
  filters,
  totalResults,
  onResetPage,
  onClearFilters,
  onFilterChange,
  search,
  displayFilters,
  sx,
  ...other
}) {
  const handleRemoveKeyword = useCallback(() => {
    onFilterChange('', '');
  }, [onFilterChange]);

  const handleRemoveType = useCallback(() => {
    onFilterChange('type', 'all');
  }, [onFilterChange]);

  const handleRemoveIsRead = useCallback(() => {
    onFilterChange('isRead', 'all');
  }, [onFilterChange]);

  const handleRemoveCreatedBy = useCallback(() => {
    onFilterChange('createdBy', '');
  }, [onFilterChange]);

  return (
    <Stack spacing={1.5} sx={sx} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {search && (
          <Block label="Keyword:">
            <Chip size="small" label={search} onDelete={handleRemoveKeyword} />
          </Block>
        )}

        {filters.type && filters.type !== 'all' && (
          <Block label="Type:">
            <Chip size="small" label={filters.type} onDelete={handleRemoveType} />
          </Block>
        )}

        {filters.isRead && filters.isRead !== 'all' && (
          <Block label="Read Status:">
            <Chip
              size="small"
              label={filters.isRead === 'true' ? 'Read' : 'Unread'}
              onDelete={handleRemoveIsRead}
            />
          </Block>
        )}

        {filters.createdBy && (
          <Block label="Created By:">
            <Chip size="small" label={filters.createdBy} onDelete={handleRemoveCreatedBy} />
          </Block>
        )}

        <Button color="error" onClick={onClearFilters} startIcon={<DeleteIcon />}>
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

/**
 * Block component for displaying filter labels
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The block component
 */
function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={[
        {
          p: 1,
          borderRadius: 1,
          overflow: 'hidden',
          borderStyle: 'dashed',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
