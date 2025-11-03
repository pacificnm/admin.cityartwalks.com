'use client';

import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { UserFilter } from 'src/components/filters';
import { CustomPopover } from 'src/components/custom-popover';
import { SearchIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Simple Image Table Toolbar component for use with controlled ImageTable
 * This toolbar receives props from parent and doesn't manage its own state
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onSearchChange - Search change handler
 * @param {string} props.search - Current search value
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Function} props.onClearFilters - Clear filters handler
 * @param {Function} props.onResetPage - Reset page handler
 * @param {Object} props.displayFilters - Which filters to display
 * @returns {JSX.Element} The toolbar component
 */
export function ImageTableToolbarSimple({
  filters = {},
  onSearchChange,
  search = '',
  onFilterChange,
  onClearFilters,
  onResetPage,
  displayFilters = {},
  accessToken = '',
}) {
  const menuActions = usePopover();

  const handleSearchInputChange = useCallback(
    (event) => {
      onSearchChange?.(event);
    },
    [onSearchChange]
  );

  const handleFilterToggle = useCallback(
    (filterKey, value) => {
      onResetPage?.();
      onFilterChange?.(filterKey, value);
    },
    [onFilterChange, onResetPage]
  );

  const handleClearAllFilters = useCallback(() => {
    onResetPage?.();
    onClearFilters?.();
  }, [onClearFilters, onResetPage]);

  const hasFilters =
    Object.values(filters).some(
      (value) =>
        value !== '' && value !== null && value !== undefined && value !== false && value !== 0
    ) || !!search;

  // File size options in bytes
  const fileSizeOptions = [
    { value: 0, label: 'Any Size' },
    { value: 102400, label: '> 100 KB' },
    { value: 512000, label: '> 500 KB' },
    { value: 1048576, label: '> 1 MB' },
    { value: 5242880, label: '> 5 MB' },
    { value: 10485760, label: '> 10 MB' },
    { value: 20971520, label: '> 20 MB' },
  ];

  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Search Input */}
      {(!displayFilters || displayFilters.search) && (
        <TextField
          fullWidth
          value={search}
          onChange={handleSearchInputChange}
          placeholder="Search images..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { md: 240 } }}
        />
      )}

      {/* File Size Filter */}
      {(!displayFilters || displayFilters.fileSize) && (
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="file-size-label">Min Size</InputLabel>
          <Select
            labelId="file-size-label"
            id="file-size-select"
            value={filters.minFileSize || 0}
            label="Min Size"
            onChange={(event) => handleFilterToggle('minFileSize', event.target.value)}
          >
            {fileSizeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* User Filter */}
      {(!displayFilters || displayFilters.createdBy) && (
        <UserFilter
          value={filters.createdBy}
          onChange={(user) => handleFilterToggle('createdBy', user?.userId || null)}
          onClear={() => handleFilterToggle('createdBy', null)}
          label="Created By"
          placeholder="Filter by creator..."
          accessToken={accessToken}
          sx={{ minWidth: 200 }}
        />
      )}

      {/* Featured Filter Toggle */}
      {(!displayFilters || displayFilters.featured) && (
        <FormControlLabel
          control={
            <Switch
              checked={!!filters.featured}
              onChange={(event) => handleFilterToggle('featured', event.target.checked)}
              color="primary"
            />
          }
          label="Featured Only"
          sx={{ ml: { md: 'auto' } }}
        />
      )}

      {/* Action Menu */}
      <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
        <VerticalFillIcon />
      </IconButton>

      {/* Actions Menu Popover */}
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              handleClearAllFilters();
              menuActions.onClose();
            }}
            disabled={!hasFilters}
          >
            <DeleteIcon />
            Clear Filters
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </Box>
  );
}
