'use client';

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useGetPaginatedNotifications } from 'src/actions/notification/hooks';

import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { NotificationTableRow } from 'src/components/notification/notification-table-row';
import { NotificationTableToolbar } from 'src/components/notification/notification-table-toolbar';
import { NotificationTableFiltersResult } from 'src/components/notification/notification-table-filters-result';
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
 * Table head configuration for the notifications table
 * @constant {Array<Object>} TABLE_HEAD
 */
const TABLE_HEAD = [
  { id: 'title', label: 'Title' },
  { id: 'message', label: 'Message' },
  { id: 'type', label: 'Type' },
  { id: 'user', label: 'User' },
  { id: 'read', label: 'Read Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: '', width: 88 },
];

/**
 * Notification Table component
 * Displays a table of notifications with filtering, pagination, and CRUD operations.
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Filter state object (e.g., {type: 'all'})
 * @param {string} props.accessToken - Authentication token
 * @param {Array} props.tabOptions - Tab options for type filtering
 * @param {Object} props.displayFilters - Object defining which filters should be displayed
 * @returns {JSX.Element} The notification table component
 */
export function NotificationTable({
  filters: initialFilters = {},
  accessToken = '',
  tabOptions = [],
  displayFilters = { search: true, type: true, isRead: true },
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
      if (key === 'type') return value !== 'all';
      if (key === 'isRead') return value !== 'all';
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }) || !!search;

  const notFound = !tableData.length && (canReset || !!search);

  const safeSearch = typeof search === 'string' ? search : '';

  // Prepare API filters - filter out 'all' and empty values
  const apiFilters = useMemo(() => {
    const baseFilters = {
      ...filters,
      search: safeSearch,
    };

    // Remove 'all' type - when type is 'all', we don't send any type filter
    if (baseFilters.type === 'all') {
      delete baseFilters.type;
    }

    // Remove 'all' isRead - when isRead is 'all', we don't send any isRead filter
    if (baseFilters.isRead === 'all') {
      delete baseFilters.isRead;
    }

    // Remove empty string values to avoid unnecessary filtering
    return Object.fromEntries(
      Object.entries(baseFilters).filter(
        ([key, value]) => value !== '' && value !== null && value !== undefined
      )
    );
  }, [filters, safeSearch]);

  // Fetch notifications - Convert page from 0-based to 1-based for API
  const { notifications, notificationsLoading, paginationMeta } = useGetPaginatedNotifications({
    page: page + 1, // Convert 0-based to 1-based
    rowsPerPage,
    search: safeSearch,
    type: apiFilters.type || null,
    isRead: apiFilters.isRead || null,
    createdBy: apiFilters.createdBy || null,
    token: accessToken,
    revalidate: 3600,
  });

  // Keep tableData in sync with API
  useEffect(() => {
    setTableData(notifications || []);
  }, [notifications]);

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
    const defaultFilters = { ...initialFilters };
    setFilters(defaultFilters);
    setSearch('');
    setPage(0);
  }, [initialFilters]);

  // Handler for filter changes from toolbar
  const handleFilterChange = useCallback((filterKeyOrObject, filterValue) => {
    if (typeof filterKeyOrObject === 'string') {
      // Single filter change
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
      <NotificationTableToolbar
        filters={filters}
        onResetPage={() => setPage(0)}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        search={safeSearch}
        onClearFilters={handleClearFilters}
        displayFilters={displayFilters}
      />

      {(canReset || !!safeSearch) && (
        <NotificationTableFiltersResult
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
            tableData.map((row) => row.notificationId)
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
              tableData.map((row) => row.notificationId)
            )
          }
        />
        <TableBody>
          {tableData.map((row) => (
            <NotificationTableRow
              key={row.notificationId}
              row={row}
              selected={table.selected.includes(row.notificationId)}
              onSelectRow={() => table.onSelectRow(row.notificationId)}
              onDeleteRow={() => handleDeleteRow(row.notificationId)}
              editHref={paths.dashboard.notifications.details(row.notificationId)}
              loading={notificationsLoading}
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
