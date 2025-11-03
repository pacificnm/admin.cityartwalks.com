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

import { paths } from 'src/routes/paths';

import { useGetPaginatedPaths } from 'src/actions/path/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { PathTableRow } from 'src/components/path/path-table-row';
import { PathTableToolbar } from 'src/components/path/path-table-toolbar';
import { PathTableFiltersResult } from 'src/components/path/path-table-filters-result';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

/**
 * Table head configuration for the paths table
 * @constant {Array<Object>} TABLE_HEAD
 */
const TABLE_HEAD = [
  { id: 'title', label: 'Title' },
  { id: 'distance', label: 'Distance' },
  { id: 'duration', label: 'Duration' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: '', width: 88 },
];

/**
 * Path Table component
 * Displays a table of paths with filtering, pagination, and CRUD operations.
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Filter state object (e.g., {status: 'ACTIVE'})
 * @param {string} props.accessToken - Authentication token
 * @param {Array} props.tabOptions - Tab options for status filtering
 * @param {Object} props.displayFilters - Object defining which filters should be displayed
 * @returns {JSX.Element} The path table component
 */
export function PathTable({
  filters: initialFilters = { status: 'all' },
  accessToken = '',
  tabOptions = [],
  displayFilters = { search: true, featured: true, createdBy: false, status: true },
}) {
  // set pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // set up filters and search - merge initial filters with local state
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');

  // set up table data and hooks
  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState([]);

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Determine if we can reset based on any non-default filter values
  const canReset =
    Object.entries(filters).some(([key, value]) => {
      if (key === 'status') return value !== 'all';
      if (key === 'featured') return value === true; // Featured filter is active when explicitly set to true
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }) || !!search;

  const notFound = !tableData.length && (canReset || !!search);

  // Defensive: always ensure filters.status is a valid tab value
  const validTabValues = tabOptions.map((opt) => opt.value);
  const safeTab = validTabValues.includes(filters.status) ? filters.status : 'all';
  const safeSearch = typeof search === 'string' ? search : '';

  // Prepare API filters - filter out 'all' status and empty values
  const apiFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: safeSearch,
    };

    // Remove 'all' status - when status is 'all', we don't send any status filter
    if (safeTab === 'all') {
      delete baseFilters.status;
    } else {
      baseFilters.status = safeTab;
    }

    // Remove empty string values to avoid unnecessary filtering
    // Special handling for boolean values like 'featured' which can be false
    return Object.fromEntries(
      Object.entries(baseFilters).filter(([key, value]) => {
        if (key === 'featured') return value === true || value === false; // Keep boolean values
        return value !== '' && value !== null && value !== undefined;
      })
    );
  }, [filters, safeTab, safeSearch]);

  // Fetch paths - Convert page from 0-based to 1-based for API
  const {
    paths: pathsData,
    pathsLoading,
    paginationMeta,
  } = useGetPaginatedPaths({
    page: page + 1, // Convert 0-based to 1-based
    rowsPerPage,
    search: safeSearch,
    status: safeTab === 'all' ? '' : safeTab,
    featured: apiFilters.featured || false,
    created_by: apiFilters.createdBy || null,
    countryId: apiFilters.countryId || null,
    stateId: apiFilters.stateId || null,
    cityId: apiFilters.cityId || null,
    token: accessToken,
    revalidate: 3600,
  });

  // Keep tableData in sync with API
  useEffect(() => {
    setTableData(pathsData || []);
  }, [pathsData]);

  // Handle single Delete Row
  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(deleteRow.length);
    },
    [table, tableData]
  );

  // Handler for search input
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearch(value);
    setPage(0);
  }, []);

  // Handler for clearing filters and search
  const handleClearFilters = useCallback(() => {
    // Reset to default values, preserving any base filters from props
    const defaultFilters = { ...initialFilters, status: 'all' };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
  }, [initialFilters]);

  // Handler for changing tab value
  const handleFilterTab = useCallback((event, newValue) => {
    setFilters((prev) => ({ ...prev, status: newValue }));
    setPage(0);
  }, []);

  // Handler for filter changes from toolbar
  const handleFilterChange = useCallback((filterKeyOrObject, filterValue) => {
    if (typeof filterKeyOrObject === 'string') {
      // Single filter change (e.g., from featured slider)
      setFilters((prev) => ({ ...prev, [filterKeyOrObject]: filterValue }));
    } else {
      // Multiple filter changes (object)
      setFilters((prev) => ({ ...prev, ...filterKeyOrObject }));
    }
    setPage(0);
  }, []);

  // Handler for pagination changes
  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return (
    <Card>
      {(!displayFilters || displayFilters.status) && (
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
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 'ACTIVE' && 'success') ||
                    (tab.value === 'PENDING' && 'warning') ||
                    (tab.value === 'BANNED' && 'error') ||
                    (tab.value === 'REJECTED' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' ? paginationMeta?.total || 0 : ''}
                </Label>
              }
            />
          ))}
        </Tabs>
      )}

      <PathTableToolbar
        filters={filters}
        onResetPage={() => setPage(0)}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        search={safeSearch}
        onClearFilters={handleClearFilters}
        displayFilters={displayFilters}
      />

      {(canReset || !!safeSearch) && (
        <PathTableFiltersResult
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

      <TableSelectedAction
        dense={table.dense}
        numSelected={table.selected.length}
        rowCount={tableData.length}
        onSelectAllRows={(checked) =>
          table.onSelectAllRows(
            checked,
            tableData.map((row) => row.pathId)
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

      <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
        <TableHeadCustom
          order={table.order}
          orderBy={table.orderBy}
          headCells={TABLE_HEAD}
          rowCount={tableData.length}
          numSelected={table.selected.length}
          onSort={table.onSort}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.pathId)
            )
          }
        />
        <TableBody>
          {tableData.map((row) => (
            <PathTableRow
              key={row.pathId}
              row={row}
              selected={table.selected.includes(row.pathId)}
              onSelectRow={() => table.onSelectRow(row.pathId)}
              onDeleteRow={() => handleDeleteRow(row.pathId)}
              editHref={paths.path.update(row.slug)}
              loading={pathsLoading}
            />
          ))}
          <TableEmptyRows
            height={table.dense ? 56 : 56 + 20}
            emptyRows={emptyRows(page, rowsPerPage, paginationMeta?.total || 0)}
          />
          <TableNoData notFound={notFound} />
        </TableBody>
      </Table>

      <Divider sx={{ borderStyle: 'dashed' }} />

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
  );
}
