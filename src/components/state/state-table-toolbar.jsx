/**
 * State Table Toolbar Component
 *
 * Provides comprehensive filtering, searching, and action capabilities for the State table.
 * Integrates with the parent table component for state management and includes responsive
 * design patterns for optimal user experience across devices.
 *
 * Features:
 * - Real-time search functionality
 * - Country filter (countryId)
 * - Bulk action menu (print, import, export)
 * - Responsive layout design
 * - Conditional filter display
 *
 * @namespace CityArtWalks.Components.State
 * @fileoverview Table toolbar component for State filtering and actions
 * @author Jaimie Garner
 * @version 1.0.1
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for form controls
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model} - State model documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State} - Database schema reference
 */

'use client';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { CountrySelect } from 'src/components/country-select';
import { PrintIcon, SearchIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * State Table Toolbar component
 * Provides filtering, searching, and action capabilities for the State table.
 *
 * @memberof CityArtWalks.Components.State
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
 * <StateTableToolbar
 *   filters={filters}
 *   onResetPage={() => setPage(0)}
 *   onFilterChange={handleFilterChange}
 *   onSearchChange={handleSearchChange}
 *   search={search}
 *   onClearFilters={handleClearFilters}
 *   displayFilters={{
 *     search: true,
 *     countryId: true,
 *     toolMenu: true
 *   }}
 * />
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
 */
export function StateTableToolbar({
  filters,
  onResetPage,
  onFilterChange,
  onSearchChange,
  search,
  onClearFilters,
  displayFilters = {
    search: true,
    countryId: true,
    toolMenu: true,
  },
}) {
  // Action menu popover state
  const menuActions = usePopover();

  // Search input field
  const renderSearchInput = () =>
    (!displayFilters || displayFilters.search) && (
      <TextField
        fullWidth
        value={search}
        onChange={onSearchChange}
        placeholder="Search states..."
        aria-label="Search states"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 220 }}
      />
    );

  // Country filter select
  const renderCountryFilter = () =>
    (!displayFilters || displayFilters.countryId) && (
      <CountrySelect
        value={filters.countryId || ''}
        onChange={(event) => {
          onFilterChange('countryId', event.target.value);
          onResetPage && onResetPage();
        }}
        label="Country"
        placeholder="All Countries"
        sx={{ minWidth: 180 }}
      />
    );

  // Action menu popover
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
            menuActions.onClose();
          }}
        >
          <PrintIcon />
          Print
        </MenuItem>
        <MenuItem
          onClick={() => {
            menuActions.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>
        <MenuItem
          onClick={() => {
            menuActions.onClose();
          }}
        >
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
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {renderSearchInput()}
          {renderCountryFilter()}

          {/* Action Menu */}
          {(!displayFilters || displayFilters.toolMenu) && (
            <IconButton onClick={menuActions.onOpen} aria-label="Open actions menu" sx={{ ml: 1 }}>
              <VerticalFillIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {renderMenuActions()}
    </>
  );
}
