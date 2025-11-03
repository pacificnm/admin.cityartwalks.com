/**
 * @namespace CityArtWalks.Components.ArtPieceTag.ArtPieceTagTableToolbar
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
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { PrintIcon, SearchIcon, CheckCircleIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * ArtPieceTag Table Toolbar Component
 *
 * Provides comprehensive filtering, searching, and action capabilities for the art piece tag table.
 * Integrates with the parent table component for state management and includes responsive
 * design patterns for optimal user experience across devices.
 *
 * Features:
 * - Real-time search functionality for tag names and descriptions
 * - Status filter dropdown for active/inactive filtering
 * - Bulk action menu (print, import, export)
 * - Responsive layout design
 * - Conditional filter display
 * - Sort options for tag management
 *
 * @namespace CityArtWalks.Components.ArtPieceTag
 * @fileoverview Table toolbar component for art piece tag filtering and actions
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for form controls
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Table filtering guidelines
 */

/**
 * ArtPieceTag Table Toolbar component
 * Provides filtering, searching, and action capabilities for the art piece tag table.
 *
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
 * <ArtPieceTagTableToolbar
 *   filters={filters}
 *   onResetPage={() => setPage(0)}
 *   onFilterChange={handleFilterChange}
 *   onSearchChange={handleSearchChange}
 *   search={search}
 *   onClearFilters={handleClearFilters}
 *   displayFilters={{
 *     search: true,
 *     active: true,
 *     toolMenu: true
 *   }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceTag} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Art-Piece-Tag-Model} - ArtPieceTag model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Table filtering guidelines
 */
export function ArtPieceTagTableToolbar({
  filters,
  onResetPage,
  onFilterChange,
  onSearchChange,
  search,
  onClearFilters,
  displayFilters = {
    search: true,
    active: true,
    toolMenu: true,
  },
}) {
  // Action menu popover state
  const menuActions = usePopover();

  /**
   * Renders the action menu popover with bulk operations
   * @memberof CityArtWalks.Components.ArtPieceTag
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
            // Handle print action for tags
            console.log('Print art piece tags');
            menuActions.onClose();
          }}
        >
          <PrintIcon />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle import action for tags
            console.log('Import art piece tags');
            menuActions.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle export action for tags
            console.log('Export art piece tags');
            menuActions.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle bulk activation/deactivation
            console.log('Bulk status toggle for tags');
            menuActions.onClose();
          }}
        >
          <CheckCircleIcon />
          Bulk Status
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
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            gap: 1,
            width: 1,
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {/* Search Input */}
          {(!displayFilters || displayFilters.search) && (
            <TextField
              fullWidth
              value={search}
              onChange={onSearchChange}
              placeholder="Search art piece tags..."
              aria-label="Search art piece tags"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* Status Filter Dropdown */}
          {(!displayFilters || displayFilters.status) && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.active || 'all'}
                onChange={(event) => {
                  onResetPage && onResetPage();
                  onFilterChange('active', event.target.value);
                }}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
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
