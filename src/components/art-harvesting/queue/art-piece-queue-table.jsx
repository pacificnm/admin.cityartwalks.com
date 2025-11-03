/**
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue.Table
 * @file art-piece-queue-table.jsx
 * @description Main table component for managing art piece queue items.
 * Provides comprehensive queue management interface with filtering, sorting,
 * bulk operations, and detailed queue item views.
 *
 * Features:
 * - Paginated table with sorting and filtering
 * - Status-based filtering (ALL, PENDING, PROCESSING, REVIEWING, APPROVED, REJECTED, PUBLISHED, ERROR)
 * - Bulk selection and operations
 * - Individual queue item management
 * - Status indicator labels and progress tracking
 * - Integrated dialog views for detailed editing
 * - Real-time data synchronization
 *
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueTable
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { debugLog } from 'src/lib/debug';
import {
  useDeleteArtPieceQueue,
  useGetPaginatedArtPieceQueues,
} from 'src/actions/art-piece-queue/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { DeleteIcon } from 'src/components/icons';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ArtPieceQueueDialog } from 'src/components/art-harvesting/queue/art-piece-queue-dialog';
import { ArtPieceQueueTableRow } from 'src/components/art-harvesting/queue/art-piece-queue-table-row';
import { ArtPieceQueueTableToolbar } from 'src/components/art-harvesting/queue/art-piece-queue-table-toolbar';
import { ArtPieceQueueTableFiltersResult } from 'src/components/art-harvesting/queue/art-piece-queue-table-filters-result';
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
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue.Table
 * @constant TABLE_HEAD
 * @description Table head configuration for the art piece queue table.
 * Based on database schema and UI requirements for art piece queue management and processing workflow.
 * Displays key fields necessary for efficient queue processing and status tracking.
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 */
const TABLE_HEAD = [
  { id: 'title', label: 'Title' }, // Primary display field
  { id: 'artistName', label: 'Artist' }, // Artist information
  { id: 'status', label: 'Status' }, // Processing status
  { id: 'city', label: 'Location' }, // Geographic location
  { id: 'sourceUrl', label: 'Source URL', width: 200 }, // Original URL (truncated display)
  { id: 'createdBy', label: 'Created By' }, // User relationship
  { id: 'createdAt', label: 'Date Created' }, // Timestamp field
  { id: '', width: 88 }, // Actions column
];

/**
 * Gets the appropriate Material-UI color for queue status values
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue
 * @param {string} status - The status value from entity
 * @returns {string} Material-UI color name
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'PROCESSING':
      return 'info';
    case 'REVIEWING':
      return 'secondary';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    case 'PUBLISHED':
      return 'primary';
    case 'ERROR':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * ArtPieceQueue Table Component
 *
 * Displays a paginated, filterable table of art piece queue items with full CRUD operations.
 * Supports status filtering, search functionality, bulk operations, and responsive design.
 * Integrates with the CityArtWalks Actions layer for data fetching and state management.
 *
 * Features:
 * - Paginated data display with configurable page sizes
 * - Status tab filtering (PENDING, PROCESSING, REVIEWING, APPROVED, REJECTED, PUBLISHED, ERROR)
 * - Search across titles, artist names, and locations
 * - Bulk selection and operations
 * - Individual row actions (edit, delete, view)
 * - Responsive design with Material-UI components
 * - Optimistic UI updates for better UX
 * - Status highlighting
 *
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @fileoverview Main table component for art piece queue management
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 * @requires src/actions/art-piece-queue/hooks - Actions layer for queue operations
 * @requires src/components/table - Reusable table components
 *
 * @memberof CityArtWalks.Components.ArtHarvesting.Queue
 * @function ArtPieceQueueTable
 * @param {Object} props - Component properties
 * @param {string} [props.accessToken=''] - Bearer token for API authorization
 * @param {Object} [props.filters={}] - Initial filter configuration
 * @param {Array} [props.tabOptions=[]] - Tab filter options for status filtering
 * @param {Object} [props.displayFilters={}] - Filter display configuration
 * @param {boolean} [props.displayFilters.search=false] - Show search filter
 * @param {boolean} [props.displayFilters.status=false] - Show status filter
 * @param {boolean} [props.displayFilters.toolMenu=false] - Show toolbar menu
 * @returns {JSX.Element} Rendered table component with pagination and filtering
 *
 * @example
 * <ArtPieceQueueTable
 *   accessToken={userToken}
 *   filters={{ status: 'PENDING' }}
 *   tabOptions={[
 *     { value: 'all', label: 'All' },
 *     { value: 'PENDING', label: 'Pending' },
 *     { value: 'APPROVED', label: 'Approved' }
 *   ]}
 *   displayFilters={{
 *     search: true,
 *     status: true,
 *     toolMenu: true
 *   }}
 * />
 */
export function ArtPieceQueueTable({
  accessToken = '',
  filters: initialFilters = {},
  tabOptions = [],
  displayFilters = {},
}) {
  const table = useTable();
  const confirmDialog = useBoolean();

  // Filter state - initialize with props
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    ...initialFilters,
  });

  // Dialog state for edit operations
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // Data fetching hook - correct parameter order: (filters, page, rowsPerPage, token)
  const { artPieceQueues, artPieceQueuesLoading, artPieceQueuesError, paginationMeta, mutate } =
    useGetPaginatedArtPieceQueues(filters, table.page + 1, table.rowsPerPage, accessToken);

  // Delete operation hook - now implemented
  const deleteArtPieceQueue = useDeleteArtPieceQueue(accessToken);

  const dataFiltered = artPieceQueues || [];
  const canReset = filters.search || filters.status !== 'all';

  // Filter handlers
  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
    });
  }, []);

  // CRUD handlers
  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await deleteArtPieceQueue(id);
        toast.success('Queue item deleted successfully');
        // Note: Cache invalidation is handled automatically by the delete hook
      } catch (error) {
        const { debugError } = await import('src/lib/debug');
        debugError(
          'CityArtWalks.Components.ArtHarvesting.Queue.Table.ArtPieceQueueTable.handleDeleteRow',
          'Failed to delete queue item',
          error,
          { queueItemId: id, errorMessage: error.message }
        );
        toast.error('Failed to delete queue item');
      }
    },
    [deleteArtPieceQueue]
  );

  const handleDeleteRows = useCallback(async () => {
    const deleteRows = table.selected;
    try {
      await Promise.all(deleteRows.map((id) => deleteArtPieceQueue(id)));
      toast.success(`${deleteRows.length} queue items deleted successfully`);
      // Note: Cache invalidation is handled automatically by the delete hook
      table.onUpdatePageDeleteRows({
        totalRowsInPage: dataFiltered.length,
        totalRowsFiltered: dataFiltered.length,
      });
    } catch (error) {
      const { debugError } = await import('src/lib/debug');
      debugError(
        'CityArtWalks.Components.ArtHarvesting.Queue.Table.ArtPieceQueueTable.handleDeleteRows',
        'Failed to delete queue items in bulk',
        error,
        {
          selectedIds: deleteRows,
          selectedCount: deleteRows.length,
          errorMessage: error.message,
        }
      );
      toast.error('Failed to delete some queue items');
    }
  }, [dataFiltered.length, table, deleteArtPieceQueue]);

  const handleEditRow = useCallback((row) => {
    setCurrentEditItem(row);
    setEditDialogOpen(true);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false);
    setCurrentEditItem(null);
  }, []);

  const handleEditSuccess = useCallback(
    (result) => {
      debugLog('[ArtPieceQueue.Edit.Success]', result);
      setEditDialogOpen(false);
      setCurrentEditItem(null);
      mutate(); // Refresh the data
    },
    [mutate]
  );

  const renderTabLabel = (value, label) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Label
        variant={
          (value === 'all' && filters.status === 'all') || filters.status === value
            ? 'filled'
            : 'soft'
        }
        color={getStatusColor(value)}
      >
        {label}
      </Label>
    </Box>
  );

  // Show error state if there's an error fetching data
  if (artPieceQueuesError) {
    return (
      <Card>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Iconify
            icon="solar:danger-bold"
            sx={{ mb: 1, color: 'error.main', width: 32, height: 32 }}
          />
          <Box sx={{ typography: 'h6', mb: 1 }}>Failed to load queue items</Box>
          <Box sx={{ typography: 'body2', color: 'text.secondary', mb: 2 }}>
            {artPieceQueuesError.message || 'An error occurred while fetching the queue items.'}
          </Box>
          <Button
            variant="outlined"
            onClick={() => mutate()}
            startIcon={<Iconify icon="solar:refresh-bold" />}
          >
            Try Again
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <Card>
        {displayFilters.status && tabOptions.length > 0 && (
          <Tabs
            value={filters.status}
            onChange={(_, newValue) => handleFilters('status', newValue)}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {tabOptions.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={renderTabLabel(tab.value, tab.label)}
                sx={{
                  '&:not(:last-of-type)': {
                    mr: 3,
                  },
                }}
              />
            ))}
          </Tabs>
        )}

        {displayFilters.search && (
          <ArtPieceQueueTableToolbar
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />
        )}

        {canReset && (
          <ArtPieceQueueTableFiltersResult
            filters={filters}
            totalResults={paginationMeta.total}
            onResetFilters={handleResetFilters}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered?.length || 0}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                (dataFiltered || []).map((row) => row.artPieceQueueId)
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

          <Table
            size={table.dense ? 'small' : 'medium'}
            sx={{ minWidth: 960 }}
            role="table"
            aria-label="Art piece queue data table"
          >
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={TABLE_HEAD}
              rowCount={dataFiltered?.length || 0}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  (dataFiltered || []).map((row) => row.artPieceQueueId)
                )
              }
            />

            <TableBody>
              {artPieceQueuesLoading ? (
                <TableNoData notFound={false} sx={{ py: 10 }} />
              ) : (
                (dataFiltered || []).map((row) => (
                  <ArtPieceQueueTableRow
                    key={row.artPieceQueueId}
                    row={row}
                    selected={table.selected.includes(row.artPieceQueueId)}
                    onSelectRow={() => table.onSelectRow(row.artPieceQueueId)}
                    onDeleteRow={() => handleDeleteRow(row.artPieceQueueId)}
                    onEditRow={() => handleEditRow(row)}
                    loading={artPieceQueuesLoading}
                  />
                ))
              )}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, paginationMeta?.total || 0)}
              />

              <TableNoData
                notFound={!(dataFiltered || []).length && (canReset || !!filters.search)}
              />
            </TableBody>
          </Table>
        </Box>
      </Card>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={paginationMeta.total}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete Queue Items"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmDialog.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />

      <ArtPieceQueueDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        onSuccess={handleEditSuccess}
        currentArtPieceQueue={currentEditItem}
        title={currentEditItem ? 'Edit Queue Item' : 'Create Queue Item'}
      />
    </>
  );
}
