'use client';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Accordion from '@mui/material/Accordion';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { fDate } from 'src/utils/format-time';

import { ReviewsForm } from 'src/forms/reviews/reviews-form';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import {
  EditIcon,
  DeleteIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  VerticalFillIcon,
} from 'src/components/icons';

import ReviewErrorBoundary from './review-error-boundary';

/**
 * Review Table Row component
 * Displays a single review row with all its data and actions
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - The review data
 * @param {boolean} props.selected - Whether the row is selected
 * @param {Function} props.onSelectRow - Handler for row selection
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {string} props.editHref - URL for editing the review
 * @param {boolean} props.loading - Whether the row is loading
 * @returns {JSX.Element} The review table row component
 */
export function ReviewTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  editHref,
  loading,
  showActions = true,
  showAIFeedback = false,
}) {
  const confirm = useBoolean();
  const editDialog = useBoolean();
  const popover = useBoolean();
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.reviewId}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ maxWidth: 400 }}>
          <Typography variant="body2" noWrap>
            {row.comment || 'No comment'}
          </Typography>
          {showAIFeedback && row.status === 'REJECTED' && row.aiModerationReason && (
            <Box sx={{ mt: 1, p: 1, bgcolor: 'warning.lighter', borderRadius: 1 }}>
              <Typography variant="caption" color="warning.dark" sx={{ fontWeight: 'bold' }}>
                Moderator Feedback:
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                {row.aiModerationReason}
              </Typography>
              {row.aiModerationSuggestions && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  <strong>Suggestions:</strong>{' '}
                  {Array.isArray(row.aiModerationSuggestions)
                    ? row.aiModerationSuggestions.join(', ')
                    : row.aiModerationSuggestions}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <Rating value={row.rating || 0} readOnly size="small" />
        <Typography variant="caption" sx={{ ml: 1 }}>
          ({row.rating || 0})
        </Typography>
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={row.artPiece?.imageUrl || row.ArtPiece?.imageUrl}
            alt={row.artPiece?.title || row.ArtPiece?.title}
            sx={{ width: 32, height: 32 }}
          />
          <Box>
            <Typography variant="body2" noWrap>
              {row.artPiece?.title || row.ArtPiece?.title || 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.artPiece?.Artist?.name || row.ArtPiece?.Artist?.name || 'Unknown Artist'}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={row.user?.image || row.User?.image}
            alt={row.user?.name || row.User?.name}
            sx={{ width: 32, height: 32 }}
          />
          <Box>
            <Typography variant="body2" noWrap>
              {row.user?.name || row.User?.name || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.user?.email || row.User?.email || 'No email'}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'ACTIVE' && 'success') ||
            (row.status === 'PENDING' && 'warning') ||
            (row.status === 'REJECTED' && 'error') ||
            (row.status === 'FLAGGED' && 'error') ||
            (row.status === 'DELETED' && 'default') ||
            'default'
          }
        >
          {row.status || 'Unknown'}
        </Label>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{fDate(row.createdAt)}</Typography>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {showActions && (
          <>
            <Tooltip title="Edit Review" placement="top" arrow>
              <IconButton onClick={editDialog.onTrue} color="default">
                <EditIcon />
              </IconButton>
            </Tooltip>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <VerticalFillIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <ReviewErrorBoundary
      name="ReviewTableRow"
      context="displaying_table_row"
      variant="inline"
      title="Table Row Error"
      description="Unable to display this review row."
    >
      {renderPrimary}

      {showActions && (
        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          slotProps={{ arrow: { placement: 'right-top' } }}
        >
          <MenuList>
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon />
              Delete
            </MenuItem>

            <MenuItem
              onClick={() => {
                editDialog.onTrue();
                popover.onClose();
              }}
            >
              <EditIcon />
              Edit
            </MenuItem>
          </MenuList>
        </CustomPopover>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.value} onClose={editDialog.onFalse} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Review
          {showAIFeedback && row.status === 'REJECTED' && row.aiModerationReason && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 'bold' }}>
                Moderator Feedback:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {row.aiModerationReason}
              </Typography>
              {row.aiModerationSuggestions && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  <strong>Suggestions:</strong>{' '}
                  {Array.isArray(row.aiModerationSuggestions)
                    ? row.aiModerationSuggestions.join(', ')
                    : row.aiModerationSuggestions}
                </Typography>
              )}
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <ReviewsForm
              entityType={
                row.artPieceId
                  ? 'ART_PIECE'
                  : row.artistId
                    ? 'ARTIST'
                    : row.imageId
                      ? 'IMAGE'
                      : row.pathId
                        ? 'PATH'
                        : row.pathMapId
                          ? 'PATH_MAP'
                          : 'ART_PIECE'
              }
              entityId={
                row.artPieceId || row.artistId || row.imageId || row.pathId || row.pathMapId
              }
              entityName={
                row.ArtPiece?.title ||
                row.Artist?.name ||
                row.Image?.caption ||
                row.Path?.title ||
                'Unknown'
              }
              currentReview={row}
              onSuccess={(result) => {
                setApiResponse(result);
                setApiError(null);
                // Keep dialog open to show the response
                // editDialog.onFalse();
              }}
              onError={(error) => {
                setApiError(error);
                setApiResponse(null);
                // Keep dialog open to show the error
              }}
              onCancel={() => {
                setApiResponse(null);
                setApiError(null);
                editDialog.onFalse();
              }}
              showEntityInfo
            />
          </Box>

          {/* API Response Debug Section */}
          {(apiResponse || apiError) && (
            <Accordion>
              <AccordionSummary
                expandIcon={<ChevronDownIcon />}
                sx={{
                  bgcolor: apiError ? 'error.lighter' : 'success.lighter',
                  '& .MuiAccordionSummary-content': { my: 1 },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Iconify
                    icon={apiError ? 'solar:danger-triangle-bold' : 'solar:check-circle-bold'}
                    sx={{ color: apiError ? 'error.main' : 'success.main' }}
                  />
                  {apiError ? 'API Error Response' : 'API Success Response'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Alert severity={apiError ? 'error' : 'success'} sx={{ mb: 2 }}>
                  {apiError
                    ? 'Request failed - see details below'
                    : 'Request succeeded - see details below'}
                </Alert>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    maxHeight: '400px',
                    overflow: 'auto',
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {JSON.stringify(apiError || apiResponse, null, 2)}
                  </pre>
                </Box>

                {apiResponse && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <IconButton
                      onClick={() => {
                        setApiResponse(null);
                        setApiError(null);
                        editDialog.onFalse();
                      }}
                      variant="contained"
                      color="primary"
                    >
                      <CheckCircleIcon />
                      Close & Refresh
                    </IconButton>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          )}
        </DialogContent>
      </Dialog>
    </ReviewErrorBoundary>
  );
}
