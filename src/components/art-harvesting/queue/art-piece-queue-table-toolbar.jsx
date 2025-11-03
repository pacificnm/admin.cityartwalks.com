/**
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueTableToolbar
 * @version 1.0.0
 * @author jaimie garner
 */

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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { PrintIcon, SearchIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * ArtPieceQueue Table Toolbar Component
 *
 * Provides comprehensive filtering, searching, and action capabilities for the art piece queue table.
 * Integrates with the parent table component for state management and includes responsive
 * design patterns for optimal user experience across devices.
 *
 * Features:
 * - Real-time search functionality for titles, artists, and locations
 * - Status filter dropdown for queue status filtering
 * - Bulk action menu (print, import, export)
 * - Responsive layout design
 * - Conditional filter display
 *
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @fileoverview Table toolbar component for art piece queue filtering and actions
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for form controls
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Table filtering guidelines
 */
export function ArtPieceQueueTableToolbar({ filters, onFilters, canReset, onResetFilters }) {
  const popover = usePopover();

  const handleFilterSearch = (event) => {
    onFilters('search', event.target.value);
  };

  const handleFilterStatus = (event) => {
    onFilters('status', event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          value={filters.search}
          onChange={handleFilterSearch}
          placeholder="Search queue items..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={handleFilterStatus}
            input={<OutlinedInput label="Status" />}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PROCESSING">Processing</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
            <MenuItem value="PUBLISHED">Published</MenuItem>
            <MenuItem value="ERROR">Error</MenuItem>
          </Select>
        </FormControl>

        <IconButton onClick={popover.onOpen}>
          <VerticalFillIcon />
        </IconButton>
      </Box>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              /* TODO: Implement print */ popover.onClose();
            }}
          >
            <PrintIcon />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              /* TODO: Implement import */ popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              /* TODO: Implement export */ popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
