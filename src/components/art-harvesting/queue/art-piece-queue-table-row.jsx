/**
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue.ArtPieceQueueTableRow
 * @version 1.0.0
 * @author jaimie garner
 */

'use client';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

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
 * ArtPieceQueue Table Row Component
 *
 * Displays individual art piece queue records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with edit and delete options
 * - Edit action triggers parent dialog (inline editing)
 * - Delete confirmation dialog
 * - Status color coding
 * - Loading state handling
 * - Accessibility support
 * - Art piece title with artist information
 *
 * @namespace CityArtWalks.Components.ArtHarvesting.Queue
 * @fileoverview Table row component for art piece queue management
 * @author jaimie garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components} - Component documentation
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#ArtPieceQueue} - Database schema reference
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Table-Filter-Results-Guidelines} - Table filtering guidelines
 */

/**
 * ArtPieceQueue Table Row component
 * Displays individual art piece queue records within a table with actions and selection capabilities.
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - ArtPieceQueue data object from database
 * @param {boolean} props.selected - Whether the row is currently selected
 * @param {Function} props.onSelectRow - Handler for row selection toggle
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {Function} props.onEditRow - Handler for row editing (opens edit dialog)
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @param {boolean} [props.deleting=false] - Whether this specific row is being deleted
 * @returns {JSX.Element} The table row component
 *
 * @example
 * <ArtPieceQueueTableRow
 *   row={queueData}
 *   selected={table.selected.includes(queueData.artPieceQueueId)}
 *   onSelectRow={() => table.onSelectRow(queueData.artPieceQueueId)}
 *   onDeleteRow={() => handleDeleteRow(queueData.artPieceQueueId)}
 *   onEditRow={() => handleEditRow(queueData)}
 *   loading={false}
 *   deleting={deletingId === queueData.artPieceQueueId}
 * />
 */
export function ArtPieceQueueTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  loading = false,
  deleting = false,
}) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();

  const {
    artPieceQueueId,
    title,
    artistName,
    status,
    city,
    state,
    country,
    createdAt,
    CreatedByUser,
    imageUrls,
  } = row || {};

  // Format location display
  const location = [city, state, country].filter(Boolean).join(', ') || 'Unknown Location';

  // Get first image URL if available
  const primaryImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            onEditRow();
            menuActions.onClose();
          }}
        >
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

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Queue Item"
      content="Are you sure you want to delete this queue item?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDeleteRow();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${artPieceQueueId}` }}
          />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            {primaryImage && (
              <Avatar
                alt={title}
                src={primaryImage}
                variant="rounded"
                sx={{ width: 48, height: 48 }}
              />
            )}
            <Box>
              <Link
                component={RouterLink}
                href={paths.dashboard.harvesting.queueDetails(artPieceQueueId)}
                color="inherit"
                underline="hover"
              >
                <Typography variant="subtitle2" noWrap sx={{ maxWidth: 240 }}>
                  {title || 'Untitled'}
                </Typography>
              </Link>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {artistName || 'Unknown Artist'}
          </Typography>
        </TableCell>

        <TableCell>
          <Label color={getStatusColor(status)}>{status || 'PENDING'}</Label>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
            {location}
          </Typography>
        </TableCell>

        <TableCell>
          {CreatedByUser ? (
            <Stack>
              <Typography variant="body2">
                {CreatedByUser.firstName} {CreatedByUser.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {CreatedByUser.email}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              System
            </Typography>
          )}
        </TableCell>

        <TableCell>
          <Stack>
            <Typography variant="caption">{createdAt ? fDateTime(createdAt) : '-'}</Typography>
          </Stack>
        </TableCell>

        <TableCell align="right">
          <IconButton color={menuActions.open ? 'primary' : 'default'} onClick={menuActions.onOpen}>
            <VerticalFillIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
