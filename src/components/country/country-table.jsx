'use client';

/**
 * Country Table Component
 *
 * Displays a paginated, filterable table of countries with full CRUD operations.
 * Supports status-based tab filtering, search functionality, bulk selection, and responsive design.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Paginated data display with configurable page sizes
 * - Status-based tab filtering
 * - Search across country fields
 * - Bulk selection and actions
 * - Individual row actions (edit, delete)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 *
 * @namespace CityArtWalks.Components.Country
 * @fileoverview Main table component for country management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Country}
 */

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { useGetPaginatedCountries } from 'src/actions/country/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { CountryTableRow } from 'src/components/country/country-table-row';
import { CountryEditDialog } from 'src/components/country/country-edit-dialog';
import { CountryTableToolbar } from 'src/components/country/country-table-toolbar';
import { CountryTableFiltersResult } from 'src/components/country/country-table-filters-result';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

// Table head configuration for the countries table
const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'active', label: 'Active' }, // <-- replace status with active
  { id: 'featured', label: 'Featured' },
  { id: 'createdBy', label: 'Created By' },
  { id: 'updatedBy', label: 'Updated By' },
  { id: 'createdAt', label: 'Created At' },
  { id: '', width: 88 },
];

// Tab options for active/inactive
const tabOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'BANNED':
      return 'error';
    case 'REJECTED':
      return 'error';
    case 'DELETED':
      return 'default';
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'all':
      return 'default';
    case true:
      return 'success';
    case false:
      return 'default';
    default:
      return 'default';
  }
};

/**
 * Country Table component
 * Displays a table of countries with filtering, pagination, and CRUD operations.
 *
 * @memberof CityArtWalks.Components.Country
 * @param {Object} props - Component props
 * @param {Object} [props.filters] - Initial filter state object
 * @param {string} [props.accessToken=''] - Authentication token for API requests
 * @param {Array} [props.tabOptions=[]] - Status tab configuration for filtering
 * @param {Object} [props.displayFilters] - Controls which filters are shown in UI
 * @returns {JSX.Element} The country table component
 */
export function CountryTable({
  filters: initialFilters = { status: 'all' },
  accessToken = '',
  tabOptions: customTabOptions = tabOptions,
  displayFilters = {
    search: true,
    status: true,
    featured: true,
    createdBy: true,
    updatedBy: true,
  },
}) {
  // Pagination state - 0-based for Material-UI components
  const [page, setPage] = useState(() => Math.max(0, 0));
  const [rowsPerPage, setRowsPerPage] = useState(() => Math.max(1, 10));

  // Filter and search state
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');

  // Table utilities and selection state
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState([]);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);

  // Update filters when initialFilters change (prevent infinite loop)
  useEffect(() => {
    setFilters((prev) => {
      // Only update if initialFilters is different from current filters
      const keys = Object.keys(initialFilters);
      for (const key of keys) {
        if (initialFilters[key] !== prev[key]) {
          return { ...initialFilters };
        }
      }
      return prev;
    });
  }, [initialFilters]);

  // Reset detection
  const canReset = useMemo(
    () =>
      Object.entries(filters).some(([key, value]) => {
        if (key === 'status') return value !== 'all';
        if (key === 'featured') return value === true;
        if (Array.isArray(value)) return value.length > 0;
        return value !== '' && value !== null && value !== undefined;
      }) || !!search,
    [filters, search]
  );

  // Defensive programming for tab value
  const safeTab = ['all', 'active', 'inactive'].includes(filters.activeTab)
    ? filters.activeTab
    : 'all';
  const safeSearch = typeof search === 'string' ? search : '';

  // Prepare API filters
  const apiFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: safeSearch,
    };
    if (safeTab === 'active') baseFilters.active = true;
    else if (safeTab === 'inactive') baseFilters.active = false;
    else delete baseFilters.active;
    return Object.fromEntries(
      Object.entries(baseFilters).filter(
        ([key, value]) => value !== '' && value !== null && value !== undefined
      )
    );
  }, [filters, safeTab, safeSearch]);

  // Fetch data using hook (convert page from 0-based to 1-based)
  const { countries, countriesLoading, countriesError, paginationMeta } = useGetPaginatedCountries(
    apiFilters,
    Math.max(1, (page || 0) + 1),
    Math.max(1, rowsPerPage || 10),
    accessToken,
    3600
  );

  // Sync tableData with API data
  useEffect(() => {
    setTableData(countries || []);
  }, [countries]);

  // Handle API errors gracefully
  useEffect(() => {
    if (countriesError) {
      toast.error(`Failed to load countries: ${countriesError.message}`);
    }
  }, [countriesError]);

  // Search input handler
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearch(value);
    setPage(0);
  }, []);

  // Filter reset handler
  const handleClearFilters = useCallback(() => {
    const defaultFilters = { ...initialFilters, status: 'all' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
  }, [initialFilters]);

  // Tab change handler
  const handleFilterTab = useCallback((event, newValue) => {
    setFilters((prev) => ({ ...prev, activeTab: newValue }));
    setPage(0);
  }, []);

  // Generic filter change handler
  const handleFilterChange = useCallback((filterKeyOrObject, filterValue) => {
    if (typeof filterKeyOrObject === 'string') {
      setFilters((prev) => ({ ...prev, [filterKeyOrObject]: filterValue }));
    } else {
      setFilters((prev) => ({ ...prev, ...filterKeyOrObject }));
    }
    setPage(0);
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((event, newPage) => {
    const safePage = Math.max(0, parseInt(newPage, 10) || 0);
    setPage(safePage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const safeRowsPerPage = Math.max(1, parseInt(event.target.value, 10) || 10);
    setRowsPerPage(safeRowsPerPage);
    setPage(0);
  }, []);

  // Row deletion with optimistic UI update
  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = (tableData || []).filter((row) => row.countryId !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(deleteRow.length);
    },
    [table, tableData]
  );

  // Edit dialog handlers
  const handleEditRow = useCallback((country) => {
    setEditingCountry(country);
    setEditDialogOpen(true);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false);
    setEditingCountry(null);
  }, []);

  const handleEditSuccess = useCallback((result) => {
    // Update the table data with the edited country
    if (result && result.countryData) {
      setTableData((prev) =>
        prev.map((country) =>
          country.countryId === result.countryData.countryId ? result.countryData : country
        )
      );
    }
    toast.success('Country updated successfully!');
  }, []);

  // Table not found state
  const notFound = !(tableData || []).length && (canReset || !!search);

  return (
    <Card>
      {/* Status Tabs */}
      {(!displayFilters || displayFilters.status) && (
        <Tabs
          value={safeTab}
          onChange={handleFilterTab}
          sx={[
            (theme) => ({
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 rgba(128,128,128,0.08)`,
            }),
          ]}
        >
          {tabOptions.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={safeTab === tab.value ? 'filled' : 'soft'}
                  color={getStatusColor(tab.value)}
                >
                  {tab.value === 'all' ? paginationMeta?.total || 0 : ''}
                </Label>
              }
            />
          ))}
        </Tabs>
      )}

      {/* Filter Toolbar */}
      <CountryTableToolbar
        filters={filters}
        onResetPage={() => setPage(0)}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        search={safeSearch}
        onClearFilters={handleClearFilters}
        displayFilters={displayFilters}
      />

      {/* Active Filters Display */}
      {(canReset || !!safeSearch) && (
        <CountryTableFiltersResult
          filters={filters}
          totalResults={paginationMeta?.total || tableData.length}
          onResetPage={() => setPage(0)}
          onClearFilters={handleClearFilters}
          onFilterChange={handleFilterChange}
          search={safeSearch}
          displayFilters={displayFilters}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      {/* Bulk Actions */}
      <TableSelectedAction
        dense={table.dense}
        numSelected={table.selected.length}
        rowCount={tableData?.length || 0}
        onSelectAllRows={(checked) =>
          table.onSelectAllRows(
            checked,
            (tableData || []).map((row) => row.countryId)
          )
        }
        action={
          <Tooltip title="Delete">
            <IconButton color="primary" onClick={confirmDialog.onTrue}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        }
      />

      {/* Main Table */}
      <Table
        size={table.dense ? 'small' : 'medium'}
        sx={{ minWidth: 960 }}
        role="table"
        aria-label="Countries data table"
      >
        <TableHeadCustom
          order={table.order}
          orderBy={table.orderBy}
          headCells={TABLE_HEAD}
          rowCount={tableData?.length || 0}
          numSelected={table.selected.length}
          onSort={table.onSort}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              (tableData || []).map((row) => row.countryId)
            )
          }
        />
        <TableBody>
          {countriesLoading ? (
            <TableNoData notFound={false} sx={{ py: 10 }} />
          ) : (
            (tableData || []).map((row) => (
              <CountryTableRow
                key={row.countryId}
                row={row}
                selected={table.selected.includes(row.countryId)}
                onSelectRow={() => table.onSelectRow(row.countryId)}
                onDeleteRow={() => handleDeleteRow(row.countryId)}
                onEditRow={() => handleEditRow(row)}
                loading={countriesLoading}
                getStatusColor={getStatusColor}
              />
            ))
          )}
          <TableEmptyRows
            height={table.dense ? 56 : 76}
            emptyRows={emptyRows(page, rowsPerPage, paginationMeta?.total || 0)}
          />
          <TableNoData notFound={notFound} />
        </TableBody>
      </Table>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* Pagination */}
      <Box sx={{ p: 2, textAlign: 'right' }}>
        <TablePaginationCustom
          count={paginationMeta?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
      </Box>

      {/* Edit Dialog */}
      <CountryEditDialog
        currentCountry={editingCountry}
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
}
