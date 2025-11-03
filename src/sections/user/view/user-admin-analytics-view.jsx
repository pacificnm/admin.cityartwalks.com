'use client';

import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useAnalyticsWithFilters } from 'src/actions/analytics/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { DeleteIcon } from 'src/components/icons';
import { Scrollbar } from 'src/components/scrollbar';
import {
  UserAnalyticsTableRow,
  UserAnalyticsTableToolbar,
  UserAnalyticsTableFiltersResult,
} from 'src/components/user';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'sign_in', label: 'Sign In' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'page_view', label: 'Page View' },
  { value: 'time_on_page', label: 'Time On Page' },
  { value: 'error_event', label: 'Error' },
];

const TABLE_HEAD = [
  { id: 'analyticsId', label: 'ID', align: 'left' },
  { id: 'timestamp', label: 'Time', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'event', label: 'Event', align: 'left' },
  { id: 'message', label: 'Message', align: 'left' },
  { id: 'path', label: 'Path', align: 'left' },
  { id: 'userId', label: 'User', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'left' },
];

export function UserAdminAnalyticsView({ userId }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ userId, dateRange: [null, null], path: '' });

  // Defensive: always ensure filters.event is a valid tab value
  const validEventValues = STATUS_OPTIONS.map((opt) => opt.value);
  const safeEvent = validEventValues.includes(filters.event) ? filters.event : 'all';
  const safePath = typeof filters.path === 'string' ? filters.path : '';

  // Remove event if it's 'all' before passing to the hook
  const filtersForApi = { ...filters };
  if (filtersForApi.event === 'all') {
    delete filtersForApi.event;
  }
  // Normalize dateRange to JS Date with correct times for API
  if (Array.isArray(filtersForApi.dateRange)) {
    let [start, end] = filtersForApi.dateRange;
    if (
      start &&
      typeof start === 'object' &&
      typeof start.isValid === 'function' &&
      start.isValid()
    ) {
      start = start.startOf('day').toDate();
    }
    if (end && typeof end === 'object' && typeof end.isValid === 'function' && end.isValid()) {
      end = end.endOf('day').toDate();
    }
    filtersForApi.startDate = start || undefined;
    filtersForApi.endDate = end || undefined;
    delete filtersForApi.dateRange;
  }

  const {
    data,
    paginationMeta = { total: 0, page, rowsPerPage },
    refreshAnalytics,
  } = useAnalyticsWithFilters(page, rowsPerPage, filtersForApi);

  const table = useTable();
  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState([]);

  const canReset =
    (Array.isArray(filters.role) && filters.role.length > 0) ||
    filters.event !== 'all' ||
    !!filters.path;
  // notFound should consider both filters and path
  const notFound = !tableData.length && canReset;

  // Keep tableData in sync with API data - ensure it's always an array
  useEffect(() => {
    setTableData(Array.isArray(data) ? data : []);
  }, [data]);

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(deleteRow.length);
    },
    [table, tableData]
  );

  // Handler for changing role filter (multi-select)
  const handleFilterRole = useCallback((event) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, role: Array.isArray(value) ? value : [value] }));
    setPage(0);
  }, []);

  // Handler for changing status filter (tabs)
  const handleFilterStatus = useCallback((event, newValue) => {
    setFilters((prev) => ({ ...prev, event: newValue })); // Send 'event' param to API
    setPage(0);
  }, []);

  // Handler for search input (now sets filters.path)
  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setFilters((prev) => ({ ...prev, path: value }));
    setPage(0);
  }, []);

  // Handler for changing date range (from toolbar)
  const handleDateRangeChange = useCallback((newRange) => {
    // Store as dayjs objects (or whatever the DatePicker provides)
    setFilters((prev) => ({ ...prev, dateRange: newRange }));
    setPage(0);
  }, []);

  // Handler for clearing filters and search
  const handleClearFilters = useCallback(() => {
    setFilters({ userId: 8, dateRange: [null, null], path: '', event: 'all' }); // Reset all filters to initial state, no role
    setPage(1); // Set to first page (1-based)
    setTimeout(() => {
      refreshAnalytics();
    }, 0); // Force SWR refetch after state update
  }, [refreshAnalytics]);

  // Helper: check if any filters are active (not default)
  const hasActiveFilters = !!(
    (filters.event && filters.event !== 'all') ||
    (filters.path && filters.path.trim() !== '') ||
    (Array.isArray(filters.dateRange) && filters.dateRange[0] && filters.dateRange[1])
  );

  return (
    <Card>
      <Tabs
        value={safeEvent}
        onChange={handleFilterStatus}
        sx={[
          (theme) => ({
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }),
        ]}
      >
        {STATUS_OPTIONS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={tab.label}
            icon={
              <Label
                variant={((tab.value === 'all' || tab.value === safeEvent) && 'filled') || 'soft'}
                color={
                  (tab.value === 'sign_in' && 'info') ||
                  (tab.value === 'bounce' && 'warning') ||
                  (tab.value === 'page_view' && 'success') ||
                  (tab.value === 'time_on_page' && 'success') ||
                  (tab.value === 'error_event' && 'error') ||
                  'default'
                }
              >
                {tab.value === 'all' ? paginationMeta.total : ''}
              </Label>
            }
          />
        ))}
      </Tabs>
      <UserAnalyticsTableToolbar
        filters={{ state: filters, setState: setFilters }}
        onResetPage={() => setPage(0)}
        options={{ events: ['all', 'error', 'warning', 'info'] }}
        onFilterChange={setFilters}
        onRoleChange={handleFilterRole}
        onStatusChange={handleFilterStatus}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        search={safePath}
        onClearFilters={handleClearFilters}
      />
      {hasActiveFilters && (
        <UserAnalyticsTableFiltersResult
          filters={{ state: filters, setState: setFilters }}
          totalResults={paginationMeta.total}
          onResetPage={() => setPage(0)}
          onClearFilters={handleClearFilters}
          sx={{ p: 2.5, pt: 0 }}
          search={safePath}
        />
      )}
      <Box sx={{ position: 'relative' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.userId)
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
        <Scrollbar>
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
                  tableData.map((row) => row.userId)
                )
              }
            />

            <TableBody>
              {tableData.map((row) => (
                <UserAnalyticsTableRow
                  key={row.analyticsId}
                  row={row}
                  selected={table.selected.includes(row.userId)}
                  onSelectRow={() => table.onSelectRow(row.userId)}
                  onDeleteRow={() => handleDeleteRow(row.userId)}
                  editHref={paths.user.edit(row.userId)}
                  refreshAnalytics={refreshAnalytics}
                />
              ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <TablePaginationCustom
            count={paginationMeta.total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
          />
        </Box>
      </Box>
    </Card>
  );
}
