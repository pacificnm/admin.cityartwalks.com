'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { useBoolean } from 'src/hooks/use-boolean';

import { subscribeToIndexNowProcess, subscribeToIndexNowListRefresh } from 'src/utils/cache-events';

import { debugLog } from 'src/lib/debug';
import {
  useProcessIndexNowSubmission,
  useGetPaginatedIndexNowSubmissions,
} from 'src/actions/index-now-submission/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { IndexLoading, IndexNowTableRow } from 'src/components/index-now';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * Table head configuration for IndexNow submissions table
 * Based on IndexNowSubmission database schema and UI requirements
 *
 * @constant {Array<Object>} TABLE_HEAD
 * @memberof CityArtWalks.Components.IndexNow
 */
const TABLE_HEAD = [
  { id: 'indexNowSubmissionId', label: 'ID', width: 100 },
  { id: 'url', label: 'URL', width: 250 },
  { id: 'entityType', label: 'Entity', width: 120 },
  { id: 'action', label: 'Action', width: 100 },
  { id: 'status', label: 'Status', width: 110 },
  { id: 'createdAt', label: 'Created', width: 160 },
  { id: 'submittedAt', label: 'Submitted', width: 160 },
  { id: 'responseCode', label: 'Response', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

/**
 * IndexNow Submissions List Table
 *
 * Displays paginated table of IndexNow submissions with:
 * - Status, entity type, and action filtering
 * - Multi-select functionality for bulk operations
 * - Real-time status updates and submission tracking
 * - Integration with proper table components
 *
 * @memberof CityArtWalks.Components.IndexNow
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/IndexNow-Table|IndexNow Table Documentation}
 */
export function IndexNowListTable({ filters, onSelectSubmissions, refreshKey }) {
  const { accessToken } = useAuthContext();
  const processSubmission = useProcessIndexNowSubmission(accessToken);

  // Table state management using shared table hook
  const table = useTable({
    defaultRowsPerPage: 25,
  });

  // Delete confirmation dialog state
  const confirm = useBoolean();

  // Processing state for individual submissions
  const [processing, setProcessing] = useState(new Set());

  // Build filters for the hook
  const hookFilters = useMemo(
    () => ({
      search: filters.searchQuery || '',
      status: filters.status !== 'all' ? filters.status : '',
      entityType: filters.entityType !== 'all' ? filters.entityType : '',
      action: filters.action !== 'all' ? filters.action : '',
    }),
    [filters]
  );

  const {
    indexNowSubmissions: submissions,
    paginationMeta,
    indexNowSubmissionsLoading: loading,
    mutate: refreshSubmissions,
  } = useGetPaginatedIndexNowSubmissions(
    hookFilters,
    table.page + 1,
    table.rowsPerPage,
    accessToken ?? '',
    600,
    refreshKey
  );

  // Memoize submissions and total count
  const dataFiltered = useMemo(() => submissions || [], [submissions]);
  const totalCount = useMemo(() => paginationMeta?.totalCount || 0, [paginationMeta?.totalCount]);

  // Set up event listeners for cross-component cache invalidation
  useEffect(() => {
    const unsubscribeProcess = subscribeToIndexNowProcess((submissionId, eventData) => {
      debugLog(
        'IndexNowListTable.cacheEvent.process',
        `Received process event for submission ${submissionId}`,
        eventData
      );
      // Refresh the list when any submission is processed from other components
      refreshSubmissions();
    });

    const unsubscribeRefresh = subscribeToIndexNowListRefresh((eventData) => {
      debugLog('IndexNowListTable.cacheEvent.refresh', 'Received list refresh event', eventData);
      // Refresh the list when explicitly requested
      refreshSubmissions();
    });

    return () => {
      unsubscribeProcess();
      unsubscribeRefresh();
    };
  }, [refreshSubmissions]);

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const notFound = !dataFiltered.length && !loading;

  const handleProcessSubmission = useCallback(
    async (submissionId) => {
      try {
        setProcessing((prev) => new Set(prev).add(submissionId));

        const result = await processSubmission(submissionId);

        if (result.success) {
          debugLog('IndexNow.processSubmission.success', `Processed submission ${submissionId}`);
          toast.success('IndexNow submission processed successfully');
          // Note: Cache invalidation is handled by the processSubmission hook automatically
        }
      } catch (error) {
        debugLog('IndexNow.processSubmission.error', error.message);
        console.error('Failed to process submission:', error.message);
        toast.error(`Failed to process submission: ${error.message}`);
      } finally {
        setProcessing((prev) => {
          const newSet = new Set(prev);
          newSet.delete(submissionId);
          return newSet;
        });
      }
    },
    [processSubmission]
  );

  /**
   * Handles bulk processing of selected submissions
   */
  const handleBulkProcess = useCallback(async () => {
    try {
      const processPromises = table.selected.map((id) => processSubmission(id));
      await Promise.all(processPromises);
      table.onSelectAllRows(false, []);
      toast.success(`${table.selected.length} submissions processed successfully`);
      confirm.onFalse();
    } catch (bulkProcessError) {
      console.error('Bulk process failed:', bulkProcessError);
      toast.error('Failed to process submissions');
    }
  }, [processSubmission, table, confirm]);

  // Update parent component with selected IDs
  useEffect(() => {
    onSelectSubmissions(table.selected);
  }, [table.selected, onSelectSubmissions]);

  if (loading) {
    return <IndexLoading dense={table.dense} rowsPerPage={table.rowsPerPage} />;
  }

  return (
    <Card>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.indexNowSubmissionId)
            )
          }
          action={
            <Button
              size="small"
              color="primary"
              variant="contained"
              startIcon={<Iconify icon="solar:share-bold" />}
              onClick={confirm.onTrue}
            >
              Process ({table.selected.length})
            </Button>
          }
        />

        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.indexNowSubmissionId)
                )
              }
            />

            <TableBody>
              {dataInPage.sort(getComparator(table.order, table.orderBy)).map((row) => (
                <IndexNowTableRow
                  key={row.indexNowSubmissionId}
                  submission={row}
                  selected={table.selected.includes(row.indexNowSubmissionId)}
                  isProcessing={processing.has(row.indexNowSubmissionId)}
                  onSelect={() => table.onSelectRow(row.indexNowSubmissionId)}
                  onProcess={handleProcessSubmission}
                />
              ))}

              <TableEmptyRows
                height={table.dense ? 56 : 76}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={totalCount}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Process Submissions"
        content={
          <>
            Are you sure you want to process <strong>{table.selected.length}</strong> submissions?
            <br />
            This will submit them to the IndexNow API.
          </>
        }
        action={
          <Button variant="contained" color="primary" onClick={handleBulkProcess}>
            Process
          </Button>
        }
      />
    </Card>
  );
}
