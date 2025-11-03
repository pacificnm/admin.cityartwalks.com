'use client';

/**
 * Country Table Toolbar Component
 *
 * Provides comprehensive filtering, searching, and action capabilities for the country table.
 * Integrates with the parent table component for state management and includes responsive
 * design patterns for optimal user experience across devices.
 *
 * Features:
 * - Real-time search functionality
 * - Country-specific filter controls (featured, active, createdBy, updatedBy)
 * - Bulk action menu (print, import, export)
 * - Responsive layout design
 * - Conditional filter display via displayFilters prop
 *
 * @namespace CityArtWalks.Components.Country
 * @fileoverview Table toolbar component for country filtering and actions
 * @author Jaimie Garner
 * @version 1.0.1
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Country}
 */

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

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { PrintIcon, SearchIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Country Table Toolbar component
 * Provides filtering, searching, and action capabilities for the country table.
 *
 * @memberof CityArtWalks.Components.Country
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state from parent table
 * @param {Function} props.onResetPage - Handler to reset pagination when filters change
 * @param {Function} props.onFilterChange - Handler for filter value changes
 * @param {Function} props.onSearchChange - Handler for search input changes
 * @param {string} props.search - Current search value
 * @param {Function} props.onClearFilters - Handler to clear all active filters
 * @param {Object} [props.displayFilters] - Controls which filters are shown in UI
 * @returns {JSX.Element} The table toolbar component
 */
export function CountryTableToolbar({
  filters,
  onResetPage,
  onFilterChange,
  onSearchChange,
  search,
  onClearFilters,
  displayFilters = {
    search: true,
    featured: true,
    active: true,
    createdBy: true,
    updatedBy: true,
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
        placeholder="Search countries..."
        aria-label="Search countries"
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

  // Featured filter toggle
  const renderFeaturedFilter = () =>
    (!displayFilters || displayFilters.featured) && (
      <FormControlLabel
        control={
          <Switch
            checked={filters.featured || false}
            onChange={(event) => {
              onResetPage && onResetPage();
              onFilterChange('featured', event.target.checked);
            }}
            color="info"
            aria-label="Filter by featured countries"
          />
        }
        label="Featured"
        sx={{ minWidth: 'auto', mr: 1 }}
      />
    );

  // Active filter dropdown
  const renderActiveFilter = () =>
    (!displayFilters || displayFilters.active) && (
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Active</InputLabel>
        <Select
          value={
            typeof filters.active === 'boolean' ? (filters.active ? 'active' : 'inactive') : ''
          }
          onChange={(event) => {
            onResetPage && onResetPage();
            const value = event.target.value;
            onFilterChange(
              'active',
              value === 'active' ? true : value === 'inactive' ? false : undefined
            );
          }}
          label="Active"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    );

  // Created By filter (simple ID select)
  const renderCreatedByFilter = () =>
    (!displayFilters || displayFilters.createdBy) && (
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Created By</InputLabel>
        <Select
          value={filters.createdBy || ''}
          onChange={(event) => {
            onResetPage && onResetPage();
            onFilterChange('createdBy', event.target.value);
          }}
          label="Created By"
        >
          <MenuItem value="">All Users</MenuItem>
          {/* Populate with actual user IDs or names if available */}
        </Select>
      </FormControl>
    );

  // Updated By filter (simple ID select)
  const renderUpdatedByFilter = () =>
    (!displayFilters || displayFilters.updatedBy) && (
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Updated By</InputLabel>
        <Select
          value={filters.updatedBy || ''}
          onChange={(event) => {
            onResetPage && onResetPage();
            onFilterChange('updatedBy', event.target.value);
          }}
          label="Updated By"
        >
          <MenuItem value="">All Users</MenuItem>
          {/* Populate with actual user IDs or names if available */}
        </Select>
      </FormControl>
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
        <MenuItem
          onClick={() => {
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
          {renderFeaturedFilter()}
          {renderActiveFilter()}
          {renderCreatedByFilter()}
          {renderUpdatedByFilter()}

          {(!displayFilters || displayFilters.toolMenu) && (
            <IconButton onClick={menuActions.onOpen} aria-label="Open actions menu">
              <VerticalFillIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {renderMenuActions()}
    </>
  );
}
