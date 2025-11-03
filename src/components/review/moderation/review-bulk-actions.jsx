/**
 * Review Bulk Actions Component
 *
 * Bulk actions interface for review moderation with progress tracking.
 * Includes smart AI suggestions, action buttons, and progress display.
 *
 * @namespace CityArtWalks.Components.Review.Moderation.ReviewBulkActions
 * @fileoverview Bulk actions interface for review moderation
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Review-Moderation} - Moderation documentation
 */

'use client';

import PropTypes from 'prop-types';

import { Box, Chip, Stack, Button, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { TableSelectedAction } from 'src/components/table';

/**
 * @memberof CityArtWalks.Components.Review.Moderation.ReviewBulkActions
 * @function ReviewBulkActions
 * @description Bulk actions interface with AI suggestions and progress tracking
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.show - Whether to show the bulk actions
 * @param {boolean} props.dense - Whether to use dense table layout
 * @param {number} props.numSelected - Number of selected items
 * @param {number} props.rowCount - Total number of rows
 * @param {Array} props.dataFiltered - Filtered data array
 * @param {Object} props.bulkActionSuggestions - AI suggestions for bulk actions
 * @param {Object} props.bulkActionProgress - Progress tracking object
 * @param {Function} props.onSelectAllRows - Function to handle select all rows
 * @param {Function} props.onBulkAction - Function to handle bulk actions
 * @param {Function} props.onOverrideDialogOpen - Function to open override dialog
 * @returns {JSX.Element} The rendered bulk actions component
 *
 * @example
 * <ReviewBulkActions
 *   show={showBulkActions}
 *   dense={table.dense}
 *   numSelected={table.selected.length}
 *   rowCount={dataFiltered.length}
 *   dataFiltered={dataFiltered}
 *   bulkActionSuggestions={bulkActionSuggestions}
 *   bulkActionProgress={bulkActionProgress}
 *   onSelectAllRows={handleSelectAllRows}
 *   onBulkAction={handleConfirmBulkAction}
 *   onOverrideDialogOpen={setBulkOverrideDialogOpen}
 * />
 */
export function ReviewBulkActions({
  show,
  dense,
  numSelected,
  rowCount,
  dataFiltered,
  bulkActionSuggestions,
  bulkActionProgress,
  onSelectAllRows,
  onBulkAction,
  onOverrideDialogOpen,
}) {
  if (!show) return null;

  return (
    <>
      {/* Enhanced Bulk Actions */}
      <TableSelectedAction
        dense={dense}
        numSelected={numSelected}
        rowCount={rowCount}
        onSelectAllRows={(checked) =>
          onSelectAllRows(
            checked,
            dataFiltered.map((row) => row.reviewId)
          )
        }
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Smart Suggestion Chip */}
            {bulkActionSuggestions && bulkActionSuggestions.suggestion && (
              <Chip
                size="small"
                label={`AI suggests: ${bulkActionSuggestions.suggestion}`}
                color={bulkActionSuggestions.suggestion === 'APPROVE' ? 'success' : 'error'}
                variant="outlined"
                icon={<Iconify icon="solar:brain-bold" />}
              />
            )}

            {/* Basic Actions */}
            <Button
              size="small"
              color="success"
              variant="contained"
              startIcon={<Iconify icon="solar:check-circle-bold" />}
              onClick={() => onBulkAction('ACTIVE')}
              disabled={bulkActionProgress.show}
            >
              Approve ({bulkActionSuggestions?.aiApproved || 0})
            </Button>

            <Button
              size="small"
              color="error"
              variant="contained"
              startIcon={<Iconify icon="solar:close-circle-bold" />}
              onClick={() => onBulkAction('DELETED')}
              disabled={bulkActionProgress.show}
            >
              Reject ({bulkActionSuggestions?.aiRejected || 0})
            </Button>

            {/* Advanced Actions */}
            <Button
              size="small"
              color="warning"
              variant="outlined"
              startIcon={<Iconify icon="solar:user-check-bold" />}
              onClick={() => onOverrideDialogOpen(true)}
              disabled={bulkActionProgress.show || !numSelected}
            >
              Override
            </Button>

            <Button
              size="small"
              color="info"
              variant="outlined"
              startIcon={<Iconify icon="solar:clock-circle-bold" />}
              onClick={() => onBulkAction('PENDING')}
              disabled={bulkActionProgress.show}
            >
              Mark Pending
            </Button>
          </Stack>
        }
      />

      {/* Bulk Action Progress */}
      {bulkActionProgress.show && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Processing {bulkActionProgress.completed} of {bulkActionProgress.total} reviews...
            </Typography>
            <Box sx={{ width: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <Box
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 'grey.200',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        backgroundColor: 'primary.main',
                        borderRadius: 2,
                        width: `${(bulkActionProgress.completed / bulkActionProgress.total) * 100}%`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                  {Math.round((bulkActionProgress.completed / bulkActionProgress.total) * 100)}%
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
}

ReviewBulkActions.propTypes = {
  show: PropTypes.bool.isRequired,
  dense: PropTypes.bool.isRequired,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  dataFiltered: PropTypes.arrayOf(
    PropTypes.shape({
      reviewId: PropTypes.number.isRequired,
    })
  ).isRequired,
  bulkActionSuggestions: PropTypes.shape({
    suggestion: PropTypes.string,
    aiApproved: PropTypes.number,
    aiRejected: PropTypes.number,
  }),
  bulkActionProgress: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    completed: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
  onSelectAllRows: PropTypes.func.isRequired,
  onBulkAction: PropTypes.func.isRequired,
  onOverrideDialogOpen: PropTypes.func.isRequired,
};
