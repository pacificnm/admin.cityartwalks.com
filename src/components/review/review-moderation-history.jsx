/**
 * Review Moderation History Component
 *
 * This component provides a comprehensive view of all moderation activities including
 * AI decisions, manual overrides, bulk operations, and detailed audit trails.
 * Features advanced filtering, search, and timeline visualization.
 *
 * @namespace CityArtWalks.Components.Review
 * @fileoverview Comprehensive moderation history interface for admin users
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

import { useMemo, useState, useCallback } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Card,
  Chip,
  Stack,
  Table,
  Button,
  Avatar,
  Dialog,
  Select,
  Tooltip,
  TableRow,
  MenuItem,
  TableCell,
  TableBody,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  TableContainer,
} from '@mui/material';

import { useGetModerationHistory } from 'src/actions/review/hooks';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ViewIcon, StarIcon, RestartIcon } from 'src/components/icons';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * Table head configuration for the moderation history
 * @constant {Array<Object>} TABLE_HEAD
 */
const TABLE_HEAD = [
  { id: 'review', label: 'Review', width: 300 },
  { id: 'entity', label: 'Content', width: 200 },
  { id: 'author', label: 'Author', width: 150 },
  { id: 'moderationType', label: 'Moderation', width: 120 },
  { id: 'action', label: 'Action', width: 200 },
  { id: 'moderator', label: 'Moderator', width: 150 },
  { id: 'timestamp', label: 'Date', width: 140 },
  { id: 'details', label: 'Details', width: 100, align: 'center' },
];

/**
 * Moderation type configuration
 * @constant {Object} MODERATION_TYPE_CONFIG
 */
const MODERATION_TYPE_CONFIG = {
  AI: {
    label: 'AI Moderation',
    color: 'info',
    icon: 'solar:brain-bold',
  },
  MANUAL: {
    label: 'Manual Override',
    color: 'warning',
    icon: 'solar:user-check-bold',
  },
  BULK: {
    label: 'Bulk Action',
    color: 'secondary',
    icon: 'solar:users-group-two-rounded-bold',
  },
  UNKNOWN: {
    label: 'System Action',
    color: 'default',
    icon: 'solar:settings-bold',
  },
};

/**
 * Status configuration for review statuses
 * @constant {Object} STATUS_CONFIG
 */
const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Approved',
    color: 'success',
    icon: 'solar:check-circle-bold',
  },
  DELETED: {
    label: 'Rejected',
    color: 'error',
    icon: 'solar:close-circle-bold',
  },
  PENDING: {
    label: 'Pending',
    color: 'warning',
    icon: 'solar:clock-circle-bold',
  },
  REVIEW: {
    label: 'Under Review',
    color: 'info',
    icon: 'solar:eye-bold',
  },
};

/**
 * Moderation History Detail Dialog Component
 */
function ModerationDetailDialog({ open, onClose, historyItem }) {
  if (!historyItem) return null;

  const moderationConfig =
    MODERATION_TYPE_CONFIG[historyItem.moderationType] || MODERATION_TYPE_CONFIG.UNKNOWN;
  const statusConfig = STATUS_CONFIG[historyItem.status] || STATUS_CONFIG.PENDING;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:document-text-bold" />
          <Typography variant="h6">Moderation Details</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Review Information */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Review Information
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Comment:</strong> {historyItem.comment || 'No comment provided'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Rating:</strong> {historyItem.rating}/5 stars
              </Typography>
              <Typography variant="body2">
                <strong>Review ID:</strong> {historyItem.reviewId}
              </Typography>
            </Box>
          </Box>

          {/* Content Information */}
          {historyItem.entityInfo && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Content Details
              </Typography>
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Type:</strong> {historyItem.entityInfo.type.replace('_', ' ')}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {historyItem.entityInfo.name}
                </Typography>
                <Typography variant="body2">
                  <strong>ID:</strong> {historyItem.entityInfo.id}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Moderation Details */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Moderation Action
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                label={moderationConfig.label}
                color={moderationConfig.color}
                icon={<Iconify icon={moderationConfig.icon} />}
                variant="soft"
              />
              <Chip
                label={statusConfig.label}
                color={statusConfig.color}
                icon={<Iconify icon={statusConfig.icon} />}
                variant="soft"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {historyItem.actionSummary}
            </Typography>
          </Box>

          {/* AI Moderation Details */}
          {historyItem.aiModerationApproved !== null && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                AI Analysis
              </Typography>
              <Box sx={{ bgcolor: 'info.lighter', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Decision:</strong>{' '}
                  {historyItem.aiModerationApproved ? 'Approved' : 'Rejected'}
                </Typography>
                {historyItem.aiModerationReason && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Reason:</strong> {historyItem.aiModerationReason}
                  </Typography>
                )}
                {historyItem.aiModerationModel && (
                  <Typography variant="body2">
                    <strong>Model:</strong> {historyItem.aiModerationModel}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Manual Override Details */}
          {historyItem.manualOverride && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Manual Override
              </Typography>
              <Box sx={{ bgcolor: 'warning.lighter', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Decision:</strong> {historyItem.overrideDecision}
                </Typography>
                {historyItem.overrideReason && (
                  <Typography variant="body2">
                    <strong>Reason:</strong> {historyItem.overrideReason}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Moderator Information */}
          {historyItem.moderatorInfo && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Moderator
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={historyItem.moderatorInfo.profileImageUrl}
                  sx={{ width: 40, height: 40 }}
                >
                  {historyItem.moderatorInfo.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {historyItem.moderatorInfo.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {historyItem.moderatorInfo.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Timestamps */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Timeline
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Created:</strong> {new Date(historyItem.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Last Updated:</strong> {new Date(historyItem.updatedAt).toLocaleString()}
              </Typography>
              {historyItem.overrideTimestamp && (
                <Typography variant="body2">
                  <strong>Override Time:</strong>{' '}
                  {new Date(historyItem.overrideTimestamp).toLocaleString()}
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Review Moderation History Component
 *
 * @memberof CityArtWalks.Components.Review
 * @function ReviewModerationHistory
 * @returns {JSX.Element} The rendered moderation history component
 */
export function ReviewModerationHistory() {
  const table = useTable({ defaultOrderBy: 'updatedAt', defaultOrder: 'desc' });

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    moderationType: '',
    search: '',
    dateFrom: null,
    dateTo: null,
  });

  const [detailDialog, setDetailDialog] = useState({ open: false, item: null });

  // Authentication
  const { accessToken } = useAuthContext();

  // Prepare query options
  const queryOptions = useMemo(
    () => ({
      page: table.page + 1,
      limit: table.rowsPerPage,
      sortBy: table.orderBy,
      sortOrder: table.order,
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== '' && value !== null && value !== undefined
        )
      ),
      // Convert dates to ISO strings
      ...(filters.dateFrom && { dateFrom: filters.dateFrom.toISOString() }),
      ...(filters.dateTo && { dateTo: filters.dateTo.toISOString() }),
    }),
    [table.page, table.rowsPerPage, table.orderBy, table.order, filters]
  );

  // Fetch moderation history
  const {
    history,
    historyLoading,
    paginationMeta,
    filters: availableFilters,
  } = useGetModerationHistory(queryOptions, accessToken);

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
    setFilters({
      status: '',
      moderationType: '',
      search: '',
      dateFrom: null,
      dateTo: null,
    });
    table.onResetPage();
  }, [table]);

  /**
   * Opens detail dialog for a history item
   */
  const handleViewDetails = useCallback((item) => {
    setDetailDialog({ open: true, item });
  }, []);

  const hasFilters = Object.values(filters).some(
    (value) => value !== '' && value !== null && value !== undefined
  );

  const notFound = !historyLoading && !history.length;

  return (
    <Card>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <Typography variant="h4">Moderation History</Typography>

        <Stack direction="row" spacing={1}>
          <Chip label={`${paginationMeta.total} Total Records`} variant="outlined" size="small" />
          {hasFilters && (
            <Chip label="Filtered" color="primary" size="small" onDelete={handleClearFilters} />
          )}
        </Stack>
      </Stack>

      {/* Filter Controls */}
      <Stack spacing={2} sx={{ px: 3, pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search reviews, reasons, comments..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <Iconify icon="solar:magnifer-bold" sx={{ mr: 1 }} />,
            }}
            sx={{ minWidth: 240 }}
          />

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {availableFilters.availableStatuses?.map((status) => (
                <MenuItem key={status} value={status}>
                  {STATUS_CONFIG[status]?.label || status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Moderation Type Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Moderation</InputLabel>
            <Select
              value={filters.moderationType}
              label="Moderation"
              onChange={(e) => handleFilterChange('moderationType', e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              {availableFilters.availableModerationTypes?.map((type) => (
                <MenuItem key={type} value={type}>
                  {MODERATION_TYPE_CONFIG[type]?.label || type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Range */}
          <DatePicker
            label="From Date"
            value={filters.dateFrom}
            onChange={(date) => handleFilterChange('dateFrom', date)}
            slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
          />

          <DatePicker
            label="To Date"
            value={filters.dateTo}
            onChange={(date) => handleFilterChange('dateTo', date)}
            slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
          />

          {/* Clear Filters */}
          {hasFilters && (
            <Button size="small" onClick={handleClearFilters} startIcon={<RestartIcon />}>
              Clear
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Table */}
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1400 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {history
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <ModerationHistoryRow
                    key={row.reviewId}
                    row={row}
                    onViewDetails={() => handleViewDetails(row)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 52 : 72}
                emptyRows={emptyRows(table.page, table.rowsPerPage, history.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {/* Pagination */}
      <TablePaginationCustom
        count={paginationMeta.total}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />

      {/* Detail Dialog */}
      <ModerationDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, item: null })}
        historyItem={detailDialog.item}
      />
    </Card>
  );
}

/**
 * Individual moderation history row component
 */
function ModerationHistoryRow({ row, onViewDetails }) {
  const moderationConfig =
    MODERATION_TYPE_CONFIG[row.moderationType] || MODERATION_TYPE_CONFIG.UNKNOWN;
  const statusConfig = STATUS_CONFIG[row.status] || STATUS_CONFIG.PENDING;

  return (
    <TableRow hover>
      {/* Review */}
      <TableCell>
        <Box sx={{ maxWidth: 280 }}>
          <Typography variant="body2" noWrap fontWeight="medium">
            {row.comment || 'No comment provided'}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ color: 'warning.main', width: 16 }} />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {row.rating}/5
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              ID: {row.reviewId}
            </Typography>
          </Stack>
        </Box>
      </TableCell>

      {/* Entity */}
      <TableCell>
        {row.entityInfo ? (
          <Box>
            <Typography variant="body2" fontWeight="medium" noWrap>
              {row.entityInfo.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.entityInfo.type.replace('_', ' ')}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Unknown
          </Typography>
        )}
      </TableCell>

      {/* Author */}
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src={row.User?.profileImageUrl} sx={{ width: 32, height: 32 }}>
            {row.User?.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" noWrap>
              {row.User?.name || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.User?.email}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      {/* Moderation Type */}
      <TableCell>
        <Chip
          size="small"
          label={moderationConfig.label}
          color={moderationConfig.color}
          variant="soft"
          icon={<Iconify icon={moderationConfig.icon} />}
        />
      </TableCell>

      {/* Action */}
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            label={statusConfig.label}
            color={statusConfig.color}
            variant="soft"
            icon={<Iconify icon={statusConfig.icon} />}
          />
          {row.manualOverride && (
            <Chip size="small" label="Override" color="warning" variant="outlined" />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {row.actionSummary}
        </Typography>
      </TableCell>

      {/* Moderator */}
      <TableCell>
        {row.moderatorInfo ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src={row.moderatorInfo.profileImageUrl} sx={{ width: 28, height: 28 }}>
              {row.moderatorInfo.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" noWrap>
                {row.moderatorInfo.name}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Chip
            size="small"
            label="System"
            variant="outlined"
            icon={<Iconify icon="solar:cpu-bolt-bold" />}
          />
        )}
      </TableCell>

      {/* Timestamp */}
      <TableCell>
        <Tooltip title={new Date(row.updatedAt).toLocaleString()}>
          <Typography variant="body2">{new Date(row.updatedAt).toLocaleDateString()}</Typography>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">
          {new Date(row.updatedAt).toLocaleTimeString()}
        </Typography>
      </TableCell>

      {/* Details */}
      <TableCell align="center">
        <IconButton size="small" onClick={onViewDetails} title="View Details">
          <ViewIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
