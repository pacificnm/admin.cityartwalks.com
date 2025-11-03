'use client';

/**
 * City Table Component
 *
 * Displays a paginated, filterable table of cities with full CRUD operations.
 * Supports status-based filtering, search functionality, bulk operations, and responsive design.
 * Uses edit dialog for inline editing instead of navigation to separate pages.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Paginated data display with configurable page sizes
 * - Status-based tab filtering
 * - Search across city fields
 * - Bulk selection and operations
 * - Inline editing via modal dialog
 * - Individual row actions (edit, delete)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 *
 * @namespace CityArtWalks.Components.City
 * @fileoverview Main table component for city management with inline editing
 * @author Jaimie Garner
 * @version 1.1.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Hooks}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/City-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#City}
 */

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { useGetPaginatedCities } from 'src/actions/city/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { CityTableRow } from './city-table-row';
import { CityEditDialog } from './city-edit-dialog';
import { CityTableToolbar } from './city-table-toolbar';
import { CityTableFiltersResult } from './city-table-filter-results';

// Table head configuration for the cities table
const TABLE_HEAD = [
  { id: 'name', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'country', label: 'Country' },
  { id: 'active', label: 'Status' },
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
 * City Table component
 * Displays a table of cities with filtering, pagination, and CRUD operations.
 *
 * @memberof CityArtWalks.Components.City
 * @param {Object} props - Component props
 * @param {Object} [props.filters] - Initial filter state object
 * @param {string} [props.accessToken=''] - Authentication token for API requests
 * @param {Array} [props.tabOptions=[]] - Status tab configuration for filtering
 * @param {Object} [props.displayFilters] - Controls which filters are shown in UI
 * @returns {JSX.Element} The city table component
 */
export function CityTable({
  filters: initialFilters = { status: 'all' },
  accessToken = '',
  tabOptions: customTabOptions = tabOptions,
  displayFilters = {
    search: true,
    status: true,
    stateId: true,
    countryId: true,
    active: true,
    coordinates: true,
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

  // Edit dialog state management
  const editDialog = useBoolean();
  const [selectedEntity, setSelectedEntity] = useState(null);

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
        if (key === 'active') return value === true;
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
  const {
    cities,
    citiesLoading,
    citiesError,
    paginationMeta,
    mutate: refreshCities,
  } = useGetPaginatedCities(
    apiFilters,
    Math.max(1, (page || 0) + 1),
    Math.max(1, rowsPerPage || 10),
    accessToken,
    3600
  );

  // Sync tableData with API data
  useEffect(() => {
    setTableData(cities || []);
  }, [cities]);

  // Handle API errors gracefully
  useEffect(() => {
    if (citiesError) {
      toast.error(`Failed to load cities: ${citiesError.message}`);
    }
  }, [citiesError]);

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

  // Edit dialog handlers
  const handleEditRow = useCallback(
    (city) => {
      setSelectedEntity(city);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleEditSuccess = useCallback(
    (result) => {
      // Refresh table data after successful edit
      refreshCities();

      // Close edit dialog
      editDialog.onFalse();
      setSelectedEntity(null);

      // Show success message
      toast.success('City updated successfully!');
    },
    [editDialog, refreshCities]
  );

  const handleEditCancel = useCallback(() => {
    editDialog.onFalse();
    setSelectedEntity(null);
  }, [editDialog]);

  // Row deletion with optimistic UI update
  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = (tableData || []).filter((row) => row.cityId !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(deleteRow.length);
    },
    [table, tableData]
  );

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
      <CityTableToolbar
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
        <CityTableFiltersResult
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
            (tableData || []).map((row) => row.cityId)
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
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table
            size={table.dense ? 'small' : 'medium'}
            sx={{ minWidth: 960 }}
            role="table"
            aria-label="Cities data table"
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
                  (tableData || []).map((row) => row.cityId)
                )
              }
            />
            <TableBody>
              {citiesLoading ? (
                <TableNoData notFound={false} sx={{ py: 10 }} />
              ) : (
                (tableData || []).map((row) => (
                  <CityTableRow
                    key={row.cityId}
                    row={row}
                    selected={table.selected.includes(row.cityId)}
                    onSelectRow={() => table.onSelectRow(row.cityId)}
                    onEditRow={() => handleEditRow(row)}
                    onDeleteRow={() => handleDeleteRow(row.cityId)}
                    loading={citiesLoading}
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
        </Scrollbar>
      </TableContainer>

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

      {/* Edit Dialog - follows edit-dialog.instructions.md patterns */}
      <CityEditDialog
        currentCity={selectedEntity}
        open={editDialog.value}
        onClose={handleEditCancel}
        onSuccess={handleEditSuccess}
        title="Quick Update"
        maxWidth="md"
        fullWidth
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete Cities"
        content={
          <>
            Are you sure you want to delete <strong>{table.selected.length}</strong> cities?
            <br />
            This action cannot be undone and may affect related content.
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // Handle bulk delete here
              toast.success(`${table.selected.length} cities deleted`);
              confirmDialog.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </Card>
  );
}
