/**
 * @version 1.0.0
 * @namespace CityArtWalks.Components.EmailTemplate.EmailTemplateTableFiltersResult
 */

'use client';

import { useCallback } from 'react';

import { Box, Chip, Stack, Button } from '@mui/material';

import { CloseIcon, DeleteIcon } from 'src/components/icons';

// ----------------------------------------------------------------------

/**
 * @memberof CityArtWalks.Components.EmailTemplate.EmailTemplateTableFiltersResult
 * @description Displays active filters and results count for email template table
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilters - Filter change handler
 * @param {Function} props.onResetFilters - Reset filters handler
 * @param {number} props.results - Number of filtered results
 * @param {Object} props.sx - Additional styles
 * @returns {JSX.Element} The rendered component
 */
export function EmailTemplateTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}) {
  const handleRemoveKeyword = useCallback(() => {
    onFilters('name', '');
  }, [onFilters]);

  const handleRemoveCategory = useCallback(() => {
    onFilters('category', 'all');
  }, [onFilters]);

  const handleRemoveStatus = useCallback(() => {
    onFilters('status', 'all');
  }, [onFilters]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          templates found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.name && (
          <Chip
            size="small"
            label={`Keyword: ${filters.name}`}
            onDelete={handleRemoveKeyword}
            deleteIcon={<CloseIcon />}
          />
        )}

        {filters.category !== 'all' && (
          <Chip
            size="small"
            label={`Category: ${filters.category}`}
            onDelete={handleRemoveCategory}
            deleteIcon={<CloseIcon />}
          />
        )}

        {filters.status !== 'all' && (
          <Chip
            size="small"
            label={`Status: ${filters.status}`}
            onDelete={handleRemoveStatus}
            deleteIcon={<CloseIcon />}
          />
        )}

        <Button color="error" onClick={onResetFilters} startIcon={<DeleteIcon />}>
          Clear all
        </Button>
      </Stack>
    </Stack>
  );
}
