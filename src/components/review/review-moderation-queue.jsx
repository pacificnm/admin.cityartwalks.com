/**
 * Review Moderation Queue Component
 *
 * This component provides an admin interface for reviewing flagged and pending reviews.
 * It displays reviews requiring moderation with actions to approve, reject, or delete.
 * Includes filtering, sorting, and bulk actions for efficient moderation workflows.
 *
 * @namespace CityArtWalks.Components.Review
 * @fileoverview Admin moderation queue for review management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Forms} Form/Field - Form components
 * @requires {@link https://github.com/pacificnm/cityartwalks.com/wiki/Auth} useAuthContext - Authentication context
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Moderation} - Moderation documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Admin-Interface} - Admin interface documentation
 */

'use client';

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import { Card, Chip, Stack, Table, TableBody, Typography, TableContainer } from '@mui/material';

import { debugLog, debugError } from 'src/lib/debug';
import {
  useModerateReview,
  useRetryAIModeration,
  useRecordManualOverride,
  useGetReviewsForModeration,
} from 'src/actions/review/hooks';

import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useAuthContext } from 'src/auth/hooks';

import {
  ReviewBulkActions,
  ReviewModerationRow,
  ReviewModerationToolbar,
  ReviewConfirmationDialog,
  ReviewBulkOverrideDialog,
} from './moderation';

// ----------------------------------------------------------------------

/**
 * Table head configuration for the moderation queue
 * @constant {Array<Object>} TABLE_HEAD
 */
const TABLE_HEAD = [
  { id: 'comment', label: 'Comment', width: 280 },
  { id: 'rating', label: 'Rating', width: 100 },
  { id: 'entity', label: 'Content', width: 180 },
  { id: 'user', label: 'Author', width: 140 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'aiDecision', label: 'AI Decision', width: 160 },
  { id: 'manualOverride', label: 'Manual Override', width: 160 },
  { id: 'flagReason', label: 'Flag Reason', width: 140 },
  { id: 'createdAt', label: 'Created', width: 120 },
  { id: 'actions', label: 'Actions', width: 180, align: 'center' },
];

/**
 * Status configuration for review moderation
 * @constant {Object} STATUS_CONFIG
 */
const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Review',
    color: 'warning',
    icon: 'solar:clock-circle-bold',
  },
  REVIEW: {
    label: 'Flagged',
    color: 'error',
    icon: 'solar:danger-triangle-bold',
  },
  ACTIVE: {
    label: 'Approved',
    color: 'success',
    icon: 'solar:check-circle-bold',
  },
  DELETED: {
    label: 'Rejected',
    color: 'default',
    icon: 'solar:close-circle-bold',
  },
};

/**
 * Review Moderation Queue Component
 *
 * @memberof CityArtWalks.Components.Review
 * @function ReviewModerationQueue
 * @param {Object} props - Component props
 * @param {Function} [props.onReviewUpdate] - Callback when review is updated
 * @param {boolean} [props.showBulkActions=true] - Whether to show bulk action buttons
 * @returns {JSX.Element} The rendered moderation queue component
 */
export function ReviewModerationQueue({ onReviewUpdate, showBulkActions = true }) {
  const table = useTable({ defaultOrderBy: 'createdAt' });
  const confirm = useBoolean();

  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAction, setSelectedAction] = useState(null);
  const [bulkOverrideDialogOpen, setBulkOverrideDialogOpen] = useState(false);
  const [bulkActionProgress, setBulkActionProgress] = useState({
    show: false,
    completed: 0,
    total: 0,
  });

  // Enhanced filters
  const [filters, setFilters] = useState({
    search: '',
    aiDecision: 'all', // all, approved, rejected, none
    hasOverride: 'all', // all, yes, no
    flagged: 'all', // all, yes, no
    rating: 'all', // all, 1, 2, 3, 4, 5
    dateFrom: null,
    dateTo: null,
  });

  // Fetch reviews requiring moderation
  const { accessToken, user } = useAuthContext();

  // Fetch reviews requiring moderation
  const {
    reviews,
    paginationMeta,
    mutate: refetchReviews,
  } = useGetReviewsForModeration(
    {
      page: table.page + 1, // API expects 1-based pagination
      limit: table.rowsPerPage,
      status: filterStatus === 'all' ? null : filterStatus,
    },
    accessToken
  );

  const moderateReview = useModerateReview(accessToken);
  const recordManualOverride = useRecordManualOverride(accessToken);
  const retryAIModeration = useRetryAIModeration(accessToken);

  const totalCount = paginationMeta?.total || 0;

  /**
   * Handles review status update
   */
  const handleUpdateStatus = useCallback(
    async (reviewId, newStatus, reason = null) => {
      try {
        debugLog(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleUpdateStatus',
          `Updating review ${reviewId} to status: ${newStatus}`,
          { reviewId, newStatus, reason }
        );

        const payload = {
          decision: newStatus,
          notes: reason || '',
        };
        await moderateReview(reviewId, payload);

        // Refresh the data
        await refetchReviews();

        // Notify parent component
        if (onReviewUpdate) {
          onReviewUpdate(reviewId, newStatus);
        }

        const statusLabel = STATUS_CONFIG[newStatus]?.label || newStatus;
        toast.success(`Review ${statusLabel.toLowerCase()} successfully`);

        debugLog(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleUpdateStatus',
          `Successfully updated review ${reviewId}`
        );
      } catch (error) {
        debugError(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleUpdateStatus',
          error
        );
        toast.error(`Failed to update review: ${error.message}`);
      }
    },
    [refetchReviews, onReviewUpdate, moderateReview]
  );

  /**
   * Handles retry AI moderation for a review
   */
  const handleRetryAI = useCallback(
    async (reviewId) => {
      try {
        debugLog(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleRetryAI',
          `Retrying AI moderation for review ${reviewId}`
        );

        const result = await retryAIModeration(reviewId);
        console.log('handleRetryAI - result from retryAIModeration:', result);

        // Refresh the data to show updated AI results
        await refetchReviews();

        toast.success('AI moderation retry completed successfully');

        debugLog(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleRetryAI',
          `Successfully retried AI for review ${reviewId}`,
          { result }
        );

        return result;
      } catch (error) {
        debugError('CityArtWalks.Components.Review.ReviewModerationQueue.handleRetryAI', error);
        toast.error(`Failed to retry AI moderation: ${error.message}`);
        throw error;
      }
    },
    [retryAIModeration, refetchReviews]
  );

  /**
   * Handles bulk actions on selected reviews with progress tracking
   */
  const handleBulkAction = useCallback(
    async (action, options = {}) => {
      const selectedIds = table.selected;
      const { withProgress = true, notes = 'Bulk action performed' } = options;

      if (selectedIds.length === 0) {
        toast.warning('Please select reviews to perform bulk action');
        return;
      }

      try {
        debugLog(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleBulkAction',
          `Performing bulk ${action} on ${selectedIds.length} reviews`,
          { action, selectedIds, options }
        );

        if (withProgress) {
          setBulkActionProgress({ show: true, completed: 0, total: selectedIds.length });
        }

        // Process reviews sequentially to avoid overwhelming the server
        const results = [];
        const errors = [];

        for (let i = 0; i < selectedIds.length; i++) {
          const reviewId = selectedIds[i];
          try {
            const result = await moderateReview(reviewId, {
              action,
              notes,
            });
            results.push({ reviewId, result });

            if (withProgress) {
              setBulkActionProgress((prev) => ({ ...prev, completed: i + 1 }));
            }
          } catch (error) {
            errors.push({ reviewId, error: error.message });
            debugError(
              'CityArtWalks.Components.Review.ReviewModerationQueue.handleBulkAction',
              `Failed to process review ${reviewId}: ${error.message}`
            );
          }
        }

        // Hide progress indicator
        if (withProgress) {
          setBulkActionProgress({ show: false, completed: 0, total: 0 });
        }

        // Refresh data and clear selection
        await refetchReviews();
        table.onSelectAllRows(false, []);

        // Show results
        const successCount = results.length;
        const errorCount = errors.length;
        const actionLabel = STATUS_CONFIG[action]?.label || action;

        if (errorCount === 0) {
          toast.success(`${successCount} reviews ${actionLabel.toLowerCase()} successfully`);
        } else if (successCount === 0) {
          toast.error(`Failed to ${actionLabel.toLowerCase()} ${errorCount} reviews`);
        } else {
          toast.warning(
            `${successCount} reviews ${actionLabel.toLowerCase()} successfully, ${errorCount} failed`
          );
        }
      } catch (error) {
        setBulkActionProgress({ show: false, completed: 0, total: 0 });
        debugError('CityArtWalks.Components.Review.ReviewModerationQueue.handleBulkAction', error);
        toast.error(`Bulk action failed: ${error.message}`);
        throw error;
      }
    },
    [table, refetchReviews, moderateReview]
  );

  /**
   * Handles manual override of AI decisions
   */
  const handleManualOverride = useCallback(
    async (reviewId, overrideData) => {
      try {
        debugLog(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleManualOverride',
          `Recording manual override for review ${reviewId}`,
          { reviewId, overrideData }
        );

        // Map override decision to review status
        const statusMap = {
          APPROVE: 'ACTIVE',
          REJECT: 'DELETED',
          DELETE: 'DELETED',
        };

        // Record the manual override with the appropriate status
        const finalOverrideData = {
          ...overrideData,
          adminUserId: user?.userId,
          newStatus: statusMap[overrideData.decision] || 'REVIEW',
        };
        await recordManualOverride(reviewId, finalOverrideData);

        // Refresh the data
        await refetchReviews();

        debugLog(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleManualOverride',
          `Successfully recorded manual override for review ${reviewId}`
        );
      } catch (error) {
        debugError(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleManualOverride',
          error
        );
        throw error; // Re-throw to let the dialog handle the error display
      }
    },
    [recordManualOverride, refetchReviews, user?.userId]
  );

  /**
   * Handles bulk manual override with reasoning
   */
  const handleBulkOverride = useCallback(
    async (overrideData) => {
      const selectedIds = table.selected;

      if (selectedIds.length === 0) {
        toast.warning('Please select reviews to perform bulk override');
        return;
      }

      try {
        debugLog(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleBulkOverride',
          `Performing bulk override on ${selectedIds.length} reviews`,
          { selectedIds, overrideData }
        );

        setBulkActionProgress({ show: true, completed: 0, total: selectedIds.length });

        const results = [];
        const errors = [];

        for (let i = 0; i < selectedIds.length; i++) {
          const reviewId = selectedIds[i];
          try {
            // Record the manual override
            await recordManualOverride(reviewId, {
              ...overrideData,
              adminUserId: user?.userId,
            });

            // Update the review status based on the override decision
            let newStatus;
            switch (overrideData.decision) {
              case 'APPROVE':
                newStatus = 'ACTIVE';
                break;
              case 'REJECT':
              case 'DELETE':
                newStatus = 'DELETED';
                break;
              default:
                newStatus = 'PENDING';
            }

            await moderateReview(reviewId, {
              action: newStatus,
              notes: `Bulk manual override: ${overrideData.reason}`,
            });

            results.push({ reviewId });
            setBulkActionProgress((prev) => ({ ...prev, completed: i + 1 }));
          } catch (error) {
            errors.push({ reviewId, error: error.message });
            debugError(
              'CityArtWalks.Components.Review.ReviewModerationQueue.handleBulkOverride',
              `Failed to override review ${reviewId}: ${error.message}`
            );
          }
        }

        setBulkActionProgress({ show: false, completed: 0, total: 0 });

        // Refresh data and clear selection
        await refetchReviews();
        table.onSelectAllRows(false, []);

        // Show results
        const successCount = results.length;
        const errorCount = errors.length;

        if (errorCount === 0) {
          toast.success(`${successCount} reviews overridden successfully`);
        } else if (successCount === 0) {
          toast.error(`Failed to override ${errorCount} reviews`);
        } else {
          toast.warning(`${successCount} reviews overridden successfully, ${errorCount} failed`);
        }
      } catch (error) {
        setBulkActionProgress({ show: false, completed: 0, total: 0 });
        debugError(
          'CityArtWalks.Components.Review.ReviewModerationQueue.handleBulkOverride',
          error
        );
        toast.error(`Bulk override failed: ${error.message}`);
        throw error;
      }
    },
    [table, recordManualOverride, moderateReview, refetchReviews, user?.userId]
  );

  /**
   * Handles filter changes
   */
  const handleFilterChange = useCallback(
    (field, value) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
      table.onResetPage(); // Reset to first page when filtering
    },
    [table]
  );

  /**
   * Clears all filters
   */
  const handleClearFilters = useCallback(() => {
    setFilterStatus('all');
    setFilters({
      search: '',
      aiDecision: 'all',
      hasOverride: 'all',
      flagged: 'all',
      rating: 'all',
      dateFrom: null,
      dateTo: null,
    });
    table.onResetPage();
  }, [table]);

  /**
   * Confirms and executes bulk action
   */
  const handleConfirmBulkAction = useCallback(
    (action) => {
      setSelectedAction(action);
      confirm.onTrue();
    },
    [confirm]
  );

  /**
   * Executes confirmed bulk action
   */
  const handleExecuteBulkAction = useCallback(async () => {
    if (selectedAction) {
      await handleBulkAction(selectedAction);
      setSelectedAction(null);
    }
    confirm.onFalse();
  }, [selectedAction, handleBulkAction, confirm]);

  const dataFiltered = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    let filtered = [...reviews];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((review) => review.status === filterStatus);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.comment?.toLowerCase().includes(searchLower) ||
          review.User?.name?.toLowerCase().includes(searchLower) ||
          review.User?.email?.toLowerCase().includes(searchLower) ||
          review.aiModerationReason?.toLowerCase().includes(searchLower) ||
          review.overrideReason?.toLowerCase().includes(searchLower) ||
          review.flagReason?.toLowerCase().includes(searchLower)
      );
    }

    // Apply AI decision filter
    if (filters.aiDecision !== 'all') {
      switch (filters.aiDecision) {
        case 'approved':
          filtered = filtered.filter((review) => review.aiModerationApproved === true);
          break;
        case 'rejected':
          filtered = filtered.filter((review) => review.aiModerationApproved === false);
          break;
        case 'none':
          filtered = filtered.filter((review) => review.aiModerationApproved === null);
          break;
        default:
          // Keep all reviews if invalid filter value
          break;
      }
    }

    // Apply override filter
    if (filters.hasOverride !== 'all') {
      filtered = filtered.filter((review) =>
        filters.hasOverride === 'yes'
          ? review.manualOverride === true
          : review.manualOverride !== true
      );
    }

    // Apply flagged filter
    if (filters.flagged !== 'all') {
      filtered = filtered.filter((review) =>
        filters.flagged === 'yes'
          ? review.requiresManualReview === true
          : review.requiresManualReview !== true
      );
    }

    // Apply rating filter
    if (filters.rating !== 'all') {
      filtered = filtered.filter((review) => review.rating === parseInt(filters.rating));
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((review) => new Date(review.createdAt) >= filters.dateFrom);
    }
    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter((review) => new Date(review.createdAt) <= endOfDay);
    }

    return filtered;
  }, [reviews, filterStatus, filters]);

  const canReset =
    filterStatus !== 'all' ||
    filters.search !== '' ||
    filters.aiDecision !== 'all' ||
    filters.hasOverride !== 'all' ||
    filters.flagged !== 'all' ||
    filters.rating !== 'all' ||
    filters.dateFrom !== null ||
    filters.dateTo !== null;

  const notFound = !dataFiltered.length && canReset;

  // Smart suggestions based on selected reviews and AI decisions
  const selectedReviews = useMemo(
    () => dataFiltered.filter((review) => table.selected.includes(review.reviewId)),
    [dataFiltered, table.selected]
  );

  const bulkActionSuggestions = useMemo(() => {
    if (selectedReviews.length === 0) return null;

    const aiApproved = selectedReviews.filter((r) => r.aiModerationApproved === true).length;
    const aiRejected = selectedReviews.filter((r) => r.aiModerationApproved === false).length;
    const noAiDecision = selectedReviews.filter((r) => r.aiModerationApproved === null).length;
    const alreadyOverridden = selectedReviews.filter((r) => r.manualOverride === true).length;

    return {
      total: selectedReviews.length,
      aiApproved,
      aiRejected,
      noAiDecision,
      alreadyOverridden,
      suggestion: aiApproved > aiRejected ? 'APPROVE' : aiRejected > aiApproved ? 'REJECT' : null,
    };
  }, [selectedReviews]);

  return (
    <>
      <Card>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
          <Typography variant="h4">Review Moderation Queue</Typography>

          <Stack direction="row" spacing={1}>
            <Chip label={`${totalCount} Total`} variant="outlined" size="small" />
            {filterStatus !== 'all' && (
              <Chip
                label={`${dataFiltered.length} ${STATUS_CONFIG[filterStatus]?.label || filterStatus}`}
                color={STATUS_CONFIG[filterStatus]?.color || 'default'}
                size="small"
              />
            )}
          </Stack>
        </Stack>

        {/* Enhanced Filter Toolbar */}
        <ReviewModerationToolbar
          filters={filters}
          filterStatus={filterStatus}
          canReset={canReset}
          totalCount={totalCount}
          filteredCount={dataFiltered.length}
          onFilterChange={handleFilterChange}
          onStatusChange={setFilterStatus}
          onClearFilters={handleClearFilters}
        />

        {/* Enhanced Bulk Actions */}
        <ReviewBulkActions
          show={showBulkActions}
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          dataFiltered={dataFiltered}
          bulkActionSuggestions={bulkActionSuggestions}
          bulkActionProgress={bulkActionProgress}
          onSelectAllRows={table.onSelectAllRows}
          onBulkAction={handleConfirmBulkAction}
          onOverrideDialogOpen={setBulkOverrideDialogOpen}
        />

        {/* Table */}
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
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
                    dataFiltered.map((row) => row.reviewId)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ReviewModerationRow
                      key={row.reviewId}
                      row={row}
                      selected={table.selected.includes(row.reviewId)}
                      onSelectRow={() => table.onSelectRow(row.reviewId)}
                      onUpdateStatus={handleUpdateStatus}
                      onManualOverride={handleManualOverride}
                      onRetryAI={handleRetryAI}
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 52 : 72}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {/* Pagination */}
        <TablePaginationCustom
          count={totalCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      {/* Enhanced Confirmation Dialog */}
      <ReviewConfirmationDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        onConfirm={handleExecuteBulkAction}
        selectedAction={selectedAction}
        selectedCount={table.selected.length}
        bulkActionSuggestions={bulkActionSuggestions}
        isProcessing={bulkActionProgress.show}
      />

      {/* Bulk Override Dialog */}
      <ReviewBulkOverrideDialog
        open={bulkOverrideDialogOpen}
        onClose={() => setBulkOverrideDialogOpen(false)}
        selectedReviews={selectedReviews}
        bulkActionSuggestions={bulkActionSuggestions}
        onSubmit={handleBulkOverride}
        isLoading={bulkActionProgress.show}
      />
    </>
  );
}
