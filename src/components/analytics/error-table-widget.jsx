'use client';

import { useState } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useDeleteAnalytics, useErrorsAnalytics } from 'src/actions/analytics/hooks';

import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { TableHeadCustom, TablePaginationCustom } from 'src/components/table';

const HEAD_CELLS = [
  { id: 'analyticsId', label: 'ID' },
  { id: 'timestamp', label: 'Time' },
  { id: 'event', label: 'Event' },
  { id: 'path', label: 'Path' },
  { id: 'userId', label: 'User' },
  { id: 'actions', label: '', align: 'right' },
];

import { ErrorBoundary } from 'src/components/error/';
import { EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * ErrorTableWidget displays a paginated, interactive table of recent analytics error events.
 * Includes delete functionality, loading state, and error boundary protection.
 *
 * @component
 * @returns {JSX.Element}
 */
export function ErrorTableWidget() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Use key to force SWR remount on delete
  const [refreshKey, setRefreshKey] = useState(0);

  // Debug user authentication and roles
  const {
    data,
    paginationMeta = { total: 0, page, rowsPerPage },
    isLoading,
    mutate,
  } = useErrorsAnalytics(page, rowsPerPage, '', refreshKey);
  const handleTableRefresh = () => {
    setRefreshKey((k) => k + 1);
    if (typeof mutate === 'function') mutate();
  };

  return (
    <Card>
      <CardHeader
        title="Error Logs"
        subheader="Recent error events"
        sx={{ mb: 3 }}
        action={
          isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Box component="span" sx={{ typography: 'body2' }}>
                Loading...
              </Box>
            </Box>
          ) : null
        }
      />
      <ErrorBoundary>
        <Scrollbar sx={{ minHeight: 402 }}>
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headCells={HEAD_CELLS} />
            <TableBodyCustom
              data={Array.isArray(data?.data) ? data.data : []}
              mutate={handleTableRefresh}
            />
          </Table>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <TablePaginationCustom
            count={paginationMeta.total}
            page={page - 1} // MUI TablePagination is 0-based
            rowsPerPage={rowsPerPage}
            onPageChange={(event, newPage) => setPage(newPage + 1)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(1);
            }}
            rowsPerPageOptions={[5, 10, 15, 20]}
          />
        </Box>
      </ErrorBoundary>
    </Card>
  );
}

// ----------------------------------------------------------------------

/**
 * TableBodyCustom renders the table body content with error handling for data format.
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of error data
 * @param {Function} props.mutate - SWR mutate function
 */
function TableBodyCustom({ data, mutate, ...other }) {
  // Ensure data is an array and handle empty/invalid data states
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={HEAD_CELLS.length} align="center">
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <TableBody>
      {data.map((row) => (
        <RowItem key={row.analyticsId} row={row} mutate={mutate} />
      ))}
    </TableBody>
  );
}

/**
 * RowItem renders a single row in the error table, including actions for edit and delete.
 *
 * @param {Object} props
 * @param {Object} props.row - Analytics error record for this row
 * @param {Function} props.mutate - Function to refresh/reload the table data after actions
 * @returns {JSX.Element}
 */
function RowItem({ row, mutate }) {
  const menuActions = usePopover();
  const quickEditForm = useBoolean();
  const confirmDialog = useBoolean();
  const menu = usePopover();
  const { deleteAnalytics } = useDeleteAnalytics();

  const handleDelete = async (analyticsId) => {
    try {
      await deleteAnalytics(analyticsId);
      toast.success(`Deleted Analytics error: ${analyticsId || 'Unknown'}`);
      if (typeof mutate === 'function') mutate(); // Only call if mutate is a function
    } catch (error) {
      console.error('Failed to delete analytics error:', error);
      toast.error('Failed to delete analytics error.');
    }
    menu.onClose();
  };

  const renderQuickEditForm = () => <>{/* Placeholder for quick edit form */}</>;

  const renderConfirmDialog = (dataRow) => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete{' '}
          <strong>
            {' '}
            {dataRow.analyticsId} - {dataRow.data?.message}{' '}
          </strong>{' '}
          items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDelete(dataRow.analyticsId);
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <EditIcon />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <TableRow>
        <TableCell>{row.analyticsId || '—'}</TableCell>
        <TableCell>{row.timestamp ? new Date(row.timestamp).toLocaleString() : '—'}</TableCell>
        <TableCell>{row.event || row.data?.message || '—'}</TableCell>
        <TableCell>{row.path || row.data?.location || '—'}</TableCell>
        <TableCell>{row.userId || row.User?.name || '—'}</TableCell>
        <TableCell align="right" sx={{ pr: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Quick edit" placement="top" arrow>
              <IconButton
                color={quickEditForm.value ? 'inherit' : 'default'}
                onClick={quickEditForm.onTrue}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <VerticalFillIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderQuickEditForm(row)}
      {renderMenuActions()}
      {renderConfirmDialog(row)}
    </>
  );
}
