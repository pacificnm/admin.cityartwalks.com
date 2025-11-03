'use client';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { PrintIcon, SearchIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Notification Table Toolbar component for filtering and searching notifications
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state
 * @param {Function} props.onResetPage - Handler to reset pagination
 * @param {Function} props.onFilterChange - Handler for filter changes
 * @param {Function} props.onSearchChange - Handler for search input changes
 * @param {string} props.search - Current search value
 * @param {Function} props.onClearFilters - Handler to clear all filters
 * @param {Object} props.displayFilters - Object defining which filters should be displayed
 * @returns {JSX.Element} The table toolbar component
 */
export function NotificationTableToolbar({
  filters,
  onResetPage,
  onFilterChange,
  onSearchChange,
  search,
  onClearFilters,
  displayFilters,
}) {
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <PrintIcon />
          Print
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: 'flex',
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {(!displayFilters || displayFilters.search) && (
            <TextField
              fullWidth
              value={search}
              onChange={onSearchChange}
              placeholder="Search notifications..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {(!displayFilters || displayFilters.type) && (
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type || 'all'}
                onChange={(event) => onFilterChange('type', event.target.value)}
                label="Type"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>
          )}

          {(!displayFilters || displayFilters.isRead) && (
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Read Status</InputLabel>
              <Select
                value={filters.isRead || 'all'}
                onChange={(event) => onFilterChange('isRead', event.target.value)}
                label="Read Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Read</MenuItem>
                <MenuItem value="false">Unread</MenuItem>
              </Select>
            </FormControl>
          )}

          {(!displayFilters || displayFilters.toolMenu) && (
            <IconButton onClick={menuActions.onOpen}>
              <VerticalFillIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {renderMenuActions()}
    </>
  );
}
