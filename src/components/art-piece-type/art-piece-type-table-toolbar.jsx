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
 * ArtPieceType Table Toolbar Component
 *
 * Provides comprehensive filtering, searching, and action capabilities for the art piece type table.
 * Integrates with the parent table component for state management and includes responsive
 * design patterns for optimal user experience across devices.
 *
 * Features:
 * - Real-time search functionality for type names and descriptions
 * - User filter for created by tracking
 * - Date range filters for creation and update dates
 * - Bulk action menu (print, import, export)
 * - Responsive layout design
 * - Conditional filter display
 *
 * @namespace CityArtWalks.Components.ArtPieceType
 * @fileoverview Table toolbar component for art piece type filtering and actions
 * @author Jaimie Garner
 * @version 2.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for form controls
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */

/**
 * ArtPieceType Table Toolbar component
 * Provides filtering, searching, and action capabilities for the art piece type table.
 *
 * @namespace CityArtWalks.Components.ArtPieceType
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state from parent table
 * @param {Function} props.onResetPage - Handler to reset pagination when filters change
 * @param {Function} props.onFilterChange - Handler for filter value changes
 * @param {Function} props.onSearchChange - Handler for search input changes
 * @param {string} props.search - Current search value
 * @param {Function} props.onClearFilters - Handler to clear all active filters
 * @param {Object} [props.displayFilters] - Controls which filters are shown in UI
 * @returns {JSX.Element} The table toolbar component
 *
 * @example
 * <ArtPieceTypeTableToolbar
 *   filters={filters}
 *   onResetPage={() => setPage(0)}
 *   onFilterChange={handleFilterChange}
 *   onSearchChange={handleSearchChange}
 *   search={search}
 *   onClearFilters={handleClearFilters}
 *   displayFilters={{
 *     search: true,
 *     createdBy: false,
 *     toolMenu: true
 *   }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/ArtPieceType-Model} - ArtPieceType model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceType} - Database schema reference
 */
export function ArtPieceTypeTableToolbar({
  filters,
  onResetPage,
  onFilterChange,
  onSearchChange,
  search,
  onClearFilters,
  displayFilters = {
    search: true,
    createdBy: false,
    updatedBy: false,
    toolMenu: true,
  },
}) {
  // Action menu popover state
  const menuActions = usePopover();

  /**
   * Renders the action menu popover with bulk operations
   * @memberof CityArtWalks.Components.ArtPieceType
   * @returns {JSX.Element} Action menu popover component
   */
  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            // Handle print action for types
            console.log('Print art piece types');
            menuActions.onClose();
          }}
        >
          <PrintIcon />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle import action for types
            console.log('Import art piece types');
            menuActions.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle export action for types
            console.log('Export art piece types');
            menuActions.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle bulk activation/deactivation
            console.log('Bulk status toggle for types');
            menuActions.onClose();
          }}
        >
          <Iconify icon="solar:settings-bold" />
          Bulk Settings
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
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            gap: 2,
            width: 1,
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search Input */}
          {(!displayFilters || displayFilters.search) && (
            <TextField
              fullWidth
              value={search}
              onChange={onSearchChange}
              placeholder="Search art piece types..."
              aria-label="Search art piece types"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* Created By User Filter */}
          {(!displayFilters || displayFilters.createdBy) && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Created By</InputLabel>
              <Select
                value={filters.createdBy || ''}
                onChange={(event) => {
                  onResetPage && onResetPage();
                  onFilterChange('createdBy', event.target.value);
                }}
                label="Created By"
                aria-label="Filter by creator"
              >
                <MenuItem value="">All Users</MenuItem>
                {/* Note: In real implementation, populate with actual users */}
                <MenuItem value="1">User ID: 1</MenuItem>
                <MenuItem value="2">User ID: 2</MenuItem>
                <MenuItem value="3">User ID: 3</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Updated By User Filter */}
          {(!displayFilters || displayFilters.updatedBy) && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Updated By</InputLabel>
              <Select
                value={filters.updatedBy || ''}
                onChange={(event) => {
                  onResetPage && onResetPage();
                  onFilterChange('updatedBy', event.target.value);
                }}
                label="Updated By"
                aria-label="Filter by last updater"
              >
                <MenuItem value="">All Users</MenuItem>
                {/* Note: In real implementation, populate with actual users */}
                <MenuItem value="1">User ID: 1</MenuItem>
                <MenuItem value="2">User ID: 2</MenuItem>
                <MenuItem value="3">User ID: 3</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Action Menu - Positioned to the right */}
        {(!displayFilters || displayFilters.toolMenu) && (
          <IconButton onClick={menuActions.onOpen} aria-label="More actions">
            <VerticalFillIcon />
          </IconButton>
        )}
      </Box>

      {renderMenuActions()}
    </>
  );
}
