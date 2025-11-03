/**
 * State Table Component
 *
 * Displays a paginated, filterable table of States with full CRUD operations.
 * Supports active-based filtering, search functionality, bulk operations, and responsive design.
 * Uses StateEditDialog for inline editing instead of navigation to separate pages.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Paginated data display with configurable page sizes
 * - Active-based tab filtering (Active/Inactive)
 * - Search across relevant entity fields
 * - Bulk selection and operations
 * - Inline editing via modal dialog
 * - Individual row actions (edit, delete)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 *
 * @namespace CityArtWalks.Components.State
 * @fileoverview Main table component for State management with inline editing
 * @author Jaimie Garner
 * @version 1.1.1
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#State}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/State-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link edit-dialog.instructions.md}
 */

'use client';

import { varAlpha } from 'minimal-shared/utils';
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

import { useGetPaginatedStates } from 'src/actions/state/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { StateTableRow } from 'src/components/state/state-table-row';
import { StateEditDialog } from 'src/components/state/state-edit-dialog';
import { StateTableToolbar } from 'src/components/state/state-table-toolbar';
import { StateTableFiltersResult } from 'src/components/state/state-table-filters-result';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

// Table head configuration for the States table
const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'countryId', label: 'Country' },
  { id: 'active', label: 'Active', width: 100 },
  { id: 'location', label: 'Location', width: 120 },
  { id: 'createdAt', label: 'Create/Update', width: 180 },
  { id: '', width: 88 }, // Actions column
];

// Active tab options for filtering
const tabOptions = [
  { value: 'all', label: 'All' },
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

// Gets the appropriate Material-UI color for active values
const getActiveColor = (active) => (active === true ? 'success' : 'default');

export function StateTable({
  filters: initialFilters = { active: 'all' },
  accessToken = '',
  displayFilters = { search: true, active: true, countryId: true },
}) {
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Reset detection
  const canReset =
    Object.entries(filters).some(([key, value]) => {
      if (key === 'active') return value === true || value === false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }) || !!search;

  // Defensive programming for tab values
  const validTabValues = tabOptions.map((opt) => opt.value);
  const safeTab = validTabValues.includes(filters.active) ? filters.active : 'all';
  const safeSearch = typeof search === 'string' ? search : '';

  // Prepare API filters
  const apiFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: safeSearch,
    };
    if (safeTab === 'all') {
      delete baseFilters.active;
    } else {
      baseFilters.active = safeTab;
    }
    return Object.fromEntries(
      Object.entries(baseFilters).filter(([key, value]) => {
        if (key === 'active') return value === true || value === false;
        return value !== '' && value !== null && value !== undefined;
      })
    );
  }, [filters, safeTab, safeSearch]);

  // Fetch data using hook
  const {
    states,
    statesLoading,
    statesError,
    paginationMeta,
    mutate: refreshStates,
  } = useGetPaginatedStates(
    apiFilters,
    Math.max(1, page + 1),
    Math.max(1, rowsPerPage),
    accessToken,
    3600
  );

  // Sync tableData with API data
  useEffect(() => {
    setTableData(states || []);
  }, [states]);

  // Handle API errors gracefully
  useEffect(() => {
    if (statesError) {
      toast.error(`Failed to load states: ${statesError.message}`);
    }
  }, [statesError]);

  // Search input handler
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearch(value);
    setPage(0);
  }, []);

  // Filter reset handler
  const handleClearFilters = useCallback(() => {
    const defaultFilters = { ...initialFilters, active: 'all' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
  }, [initialFilters]);

  // Tab change handler
  const handleFilterTab = useCallback((event, newValue) => {
    setFilters((prev) => ({ ...prev, active: newValue }));
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
    setPage(Math.max(0, parseInt(newPage, 10) || 0));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(Math.max(1, parseInt(event.target.value, 10) || 10));
    setPage(0);
  }, []);

  // Edit dialog handlers
  const handleEditRow = useCallback(
    (entity) => {
      console.log('handleEditRow called with entity:', entity); // Debug log
      setSelectedEntity(entity);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleEditSuccess = useCallback(
    (result) => {
      refreshStates();
      editDialog.onFalse();
      setSelectedEntity(null);
      toast.success('State updated successfully!');
    },
    [editDialog, refreshStates]
  );

  const handleEditCancel = useCallback(() => {
    editDialog.onFalse();
    setSelectedEntity(null);
  }, [editDialog]);

  // Row deletion with optimistic UI update
  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = (tableData || []).filter((row) => row.stateId !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(deleteRow.length);
    },
    [table, tableData]
  );

  // Defensive programming for empty state
  const notFound = !(tableData || []).length && (canReset || !!search);

  return (
    <>
      <Card>
        {/* Active Tabs */}
        {displayFilters.active !== false && (
          <Tabs
            value={safeTab}
            onChange={handleFilterTab}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {tabOptions.map((tab) => (
              <Tab
                key={String(tab.value)}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.active) && 'filled') || 'soft'
                    }
                    color={getActiveColor(tab.value)}
                  >
                    {tab.value === 'all' ? paginationMeta?.total || 0 : ''}
                  </Label>
                }
              />
            ))}
          </Tabs>
        )}

        {/* Filter Toolbar */}
        <StateTableToolbar
          filters={filters}
          onResetPage={() => setPage(0)}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          search={search}
          onClearFilters={handleClearFilters}
          displayFilters={displayFilters}
        />

        {/* Active Filters Display */}
        {(canReset || !!safeSearch) && (
          <StateTableFiltersResult
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
              (tableData || []).map((row) => row.stateId)
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
          aria-label="States data table"
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
                (tableData || []).map((row) => row.stateId)
              )
            }
          />
          <TableBody>
            {statesLoading ? (
              <TableNoData notFound={false} sx={{ py: 10 }} />
            ) : (
              (tableData || []).map((row) => (
                <StateTableRow
                  key={row.stateId}
                  row={row}
                  selected={table.selected.includes(row.stateId)}
                  onSelectRow={() => table.onSelectRow(row.stateId)}
                  onEditRow={() => handleEditRow(row)}
                  onDeleteRow={() => handleDeleteRow(row.stateId)}
                  loading={statesLoading}
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
      </Card>

      {/* Edit Dialog */}
      <StateEditDialog
        currentState={selectedEntity}
        open={editDialog.value}
        onClose={handleEditCancel}
        onSuccess={handleEditSuccess}
        title="Edit State"
        maxWidth="md"
        fullWidth
      />
    </>
  );
}
