/**
 * @file owner-review-table.jsx
 * @description Review management table for content owners to manage reviews of their content
 * @author Jaimie Garner
 * @version 1.0.0
 * @namespace CityArtWalks.Components.Review.OwnerReviewTable
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Model} - Review model documentation
 */

'use client';

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

// Simple text shortening utility
const fShortenText = (text, length = 60) => {
  if (!text || text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};
import { fDate, fDateTime } from 'src/utils/format-time';

import { debugLog, debugError } from 'src/lib/debug';
import { useBulkFlagReviews } from 'src/actions/review/hooks';

import { toast } from 'src/components/snackbar';
import { StarIcon } from 'src/components/icons';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { OwnerBulkActions } from 'src/components/review/owner-bulk-actions';
import ReviewErrorBoundary from 'src/components/review/review-error-boundary';
import { ReviewQuickActions } from 'src/components/review/review-quick-actions';
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
 * @memberof CityArtWalks.Components.Review.OwnerReviewTable
 * @description Table head configuration for owner review management
 * @constant {Array<Object>} TABLE_HEAD
 */
const TABLE_HEAD = [
  { id: 'content', label: 'Content' },
  { id: 'review', label: 'Review' },
  { id: 'reviewer', label: 'Reviewer' },
  { id: 'rating', label: 'Rating', width: 100 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'createdAt', label: 'Date', width: 140 },
  { id: 'actions', label: 'Actions', width: 88 },
];

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewTable
 * @description Get status color for review status chips
 * @function getStatusColor
 * @param {string} status - Review status
 * @returns {string} Material-UI color name
 */
function getStatusColor(status) {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'REJECTED':
      return 'error';
    case 'REVIEW':
      return 'info';
    case 'BANNED':
      return 'error';
    case 'DELETED':
      return 'default';
    default:
      return 'default';
  }
}

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewTable
 * @description Table row component for owner review management
 * @function OwnerReviewTableRow
 * @param {Object} props - Component props
 * @param {Object} props.review - Review data
 * @param {boolean} props.selected - Selection state
 * @param {Function} props.onSelectRow - Row selection handler
 * @param {Function} props.onFlagReview - Flag review handler
 * @returns {JSX.Element} Table row component
 */
function OwnerReviewTableRow({ review, selected, onSelectRow, onFlagReview }) {
  const [flagging, setFlagging] = useState(false);

  // Handle flag review
  const handleFlag = useCallback(async () => {
    if (flagging) return;

    setFlagging(true);
    try {
      await onFlagReview(review.reviewId);
      toast.success('Review flagged for moderation');
    } catch (error) {
      debugError('CityArtWalks.Components.Review.OwnerReviewTable.handleFlag', error);
      toast.error('Failed to flag review');
    } finally {
      setFlagging(false);
    }
  }, [review.reviewId, onFlagReview, flagging]);

  // Determine content info
  const contentInfo = useMemo(() => {
    if (review.ArtPiece) {
      return {
        type: 'Art Piece',
        name: review.ArtPiece.title,
        image: review.ArtPiece.mainImage,
      };
    }
    if (review.Artist) {
      return {
        type: 'Artist',
        name: review.Artist.name,
        image: review.Artist.profileImage,
      };
    }
    if (review.Path) {
      return {
        type: 'Path',
        name: review.Path.title,
        image: review.Path.coverImage,
      };
    }
    if (review.Image) {
      return {
        type: 'Image',
        name: review.Image.title || 'Untitled',
        image: review.Image.imageUrl,
      };
    }
    return {
      type: 'Unknown',
      name: 'Unknown Content',
      image: null,
    };
  }, [review]);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ 'aria-labelledby': `review-${review.reviewId}` }}
        />
      </TableCell>

      {/* Content */}
      <TableCell>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={contentInfo.image} variant="rounded" sx={{ width: 40, height: 40 }}>
            <Iconify icon="solar:gallery-bold-duotone" width={20} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" noWrap>
              {contentInfo.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {contentInfo.type}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Review */}
      <TableCell sx={{ maxWidth: 200 }}>
        <Typography variant="body2" noWrap>
          {fShortenText(review.comment, 60)}
        </Typography>
      </TableCell>

      {/* Reviewer */}
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={review.User?.image} sx={{ width: 32, height: 32 }}>
            {review.User?.name?.charAt(0) || 'A'}
          </Avatar>
          <Typography variant="body2">{review.User?.name || 'Anonymous'}</Typography>
        </Box>
      </TableCell>

      {/* Rating */}
      <TableCell>
        <Box display="flex" alignItems="center" gap={0.5}>
          <StarIcon sx={{ color: 'warning.main', width: 16 }} />
          <Typography variant="body2" fontWeight="bold">
            {review.rating}
          </Typography>
        </Box>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Chip
          size="small"
          variant="soft"
          color={getStatusColor(review.status)}
          label={review.status}
        />
      </TableCell>

      {/* Date */}
      <TableCell>
        <Typography variant="body2">{fDate(review.createdAt)}</Typography>
        <Typography variant="caption" color="text.secondary">
          {fDateTime(review.createdAt).split(' ')[1]}
        </Typography>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Flag for Review">
            <IconButton
              size="small"
              onClick={handleFlag}
              disabled={flagging || review.status === 'REVIEW'}
              color={review.status === 'REVIEW' ? 'warning' : 'default'}
            >
              <Iconify icon="solar:flag-bold-duotone" width={18} />
            </IconButton>
          </Tooltip>

          <ReviewQuickActions review={review} onFlag={onFlagReview} size="small" />
        </Stack>
      </TableCell>
    </TableRow>
  );
}

/**
 * @memberof CityArtWalks.Components.Review.OwnerReviewTable
 * @description Main review management table for content owners
 * @function OwnerReviewTable
 * @param {Object} props - Component props
 * @param {Array} props.reviews - Array of reviews
 * @param {Object} props.pagination - Pagination metadata
 * @param {Object} props.summary - Review summary data
 * @param {boolean} [props.loading] - Loading state
 * @param {Error} [props.error] - Error state
 * @param {Object} [props.contentFilter] - Current content filter
 * @returns {JSX.Element} Owner review management table
 */
export function OwnerReviewTable({
  reviews = [],
  pagination = {},
  summary = {},
  loading = false,
  error = null,
  contentFilter = {},
}) {
  const table = useTable({
    defaultRowsPerPage: 10,
  });

  const confirm = useBoolean();

  const { bulkFlag, isLoading: bulkFlagging } = useBulkFlagReviews();

  // Handle single review flag
  const handleFlagReview = useCallback(
    async (reviewId) => {
      debugLog(
        'CityArtWalks.Components.Review.OwnerReviewTable.handleFlagReview',
        `Flagging review: ${reviewId}`
      );

      try {
        await bulkFlag(
          [reviewId],
          'INAPPROPRIATE_CONTENT',
          'Content owner flagged this review for moderation'
        );
        toast.success('Review flagged for moderation');
      } catch (flagError) {
        debugError('CityArtWalks.Components.Review.OwnerReviewTable.handleFlagReview', flagError);
        toast.error('Failed to flag review');
      }
    },
    [bulkFlag]
  );

  // Handle bulk flag
  const handleBulkFlag = useCallback(async () => {
    const selectedIds = table.selected;
    if (selectedIds.length === 0) return;

    debugLog(
      'CityArtWalks.Components.Review.OwnerReviewTable.handleBulkFlag',
      `Bulk flagging ${selectedIds.length} reviews`
    );

    try {
      await bulkFlag(selectedIds, 'INAPPROPRIATE_CONTENT', 'Bulk flag operation by content owner');
      table.onSelectAllRows(false, []);
      confirm.onFalse();
      toast.success(`Successfully flagged ${selectedIds.length} reviews`);
    } catch (flagError) {
      debugError('CityArtWalks.Components.Review.OwnerReviewTable.handleBulkFlag', flagError);
      toast.error('Failed to flag reviews');
    }
  }, [bulkFlag, table, confirm]);

  // Table data with pagination
  const tableData = useMemo(() => {
    const startIndex = table.page * table.rowsPerPage;
    return reviews.slice(startIndex, startIndex + table.rowsPerPage);
  }, [reviews, table.page, table.rowsPerPage]);

  const notFound = !loading && reviews.length === 0;

  if (error) {
    return <Alert severity="error">Failed to load reviews: {error.message}</Alert>;
  }

  return (
    <ReviewErrorBoundary>
      <Card>
        {/* Bulk Actions */}
        {table.selected.length > 0 && (
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={reviews.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                reviews.map((row) => row.reviewId)
              )
            }
            action={
              <OwnerBulkActions
                selected={table.selected}
                onBulkFlag={() => confirm.onTrue()}
                disabled={bulkFlagging}
              />
            }
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={reviews.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  reviews.map((row) => row.reviewId)
                )
              }
            />

            <TableBody>
              {tableData.map((row) => (
                <OwnerReviewTableRow
                  key={row.reviewId}
                  review={row}
                  selected={table.selected.includes(row.reviewId)}
                  onSelectRow={() => table.onSelectRow(row.reviewId)}
                  onFlagReview={handleFlagReview}
                />
              ))}

              <TableEmptyRows
                height={table.dense ? 52 : 72}
                emptyRows={emptyRows(table.page, table.rowsPerPage, reviews.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={pagination.total || reviews.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      {/* Bulk Flag Confirmation */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Flag Reviews"
        content={
          <Box>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to flag {table.selected.length} selected review
              {table.selected.length > 1 ? 's' : ''} for moderation?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Flagged reviews will be sent to administrators for review. This action cannot be
              undone.
            </Typography>
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={handleBulkFlag}
            disabled={bulkFlagging}
            startIcon={bulkFlagging && <Iconify icon="svg-spinners:8-dots-rotate" />}
          >
            {bulkFlagging ? 'Flagging...' : 'Flag Reviews'}
          </Button>
        }
      />
    </ReviewErrorBoundary>
  );
}

export default OwnerReviewTable;
