'use client';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { formatDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Notification Table Row component
 * Displays a single notification row with all its data and actions
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - The notification data
 * @param {boolean} props.selected - Whether the row is selected
 * @param {Function} props.onSelectRow - Handler for row selection
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {string} props.editHref - URL for editing the notification
 * @param {boolean} props.loading - Whether the row is loading
 * @returns {JSX.Element} The notification table row component
 */
export function NotificationTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  editHref,
  loading,
}) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem component={Link} href={editHref} onClick={menuActions.onClose}>
          <EditIcon />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle mark as read/unread
            menuActions.onClose();
          }}
        >
          <Iconify icon={row.isRead ? 'solar:eye-closed-bold' : 'solar:eye-bold'} />
          Mark as {row.isRead ? 'Unread' : 'Read'}
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
      title="Delete Notification"
      content="Are you sure you want to delete this notification?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  const renderPrimary = (
    <TableCell padding="checkbox">
      <Checkbox
        checked={selected}
        onClick={onSelectRow}
        inputProps={{ id: `row-checkbox-${row.notificationId}`, 'aria-label': `Row checkbox` }}
      />
    </TableCell>
  );

  const renderTitle = (
    <TableCell>
      <Box sx={{ maxWidth: 200 }}>
        <Typography variant="subtitle2" noWrap>
          {row.title || 'No title'}
        </Typography>
      </Box>
    </TableCell>
  );

  const renderMessage = (
    <TableCell>
      <Box sx={{ maxWidth: 300 }}>
        <Typography variant="body2" noWrap>
          {row.message || 'No message'}
        </Typography>
      </Box>
    </TableCell>
  );

  const renderType = (
    <TableCell>
      <Chip
        size="small"
        variant="soft"
        label={row.type || 'info'}
        color={
          (row.type === 'success' && 'success') ||
          (row.type === 'warning' && 'warning') ||
          (row.type === 'error' && 'error') ||
          'info'
        }
      />
    </TableCell>
  );

  const renderUser = (
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar src={row.user?.image} alt={row.user?.name} sx={{ width: 32, height: 32 }} />
        <Box>
          <Typography variant="body2" noWrap>
            {row.user?.name || 'Unknown User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.user?.email || 'No email'}
          </Typography>
        </Box>
      </Box>
    </TableCell>
  );

  const renderReadStatus = (
    <TableCell>
      <Chip
        size="small"
        variant="soft"
        label={row.isRead ? 'Read' : 'Unread'}
        color={row.isRead ? 'success' : 'warning'}
      />
    </TableCell>
  );

  const renderCreatedAt = (
    <TableCell>
      <Typography variant="body2">{formatDate(row.createdAt)}</Typography>
    </TableCell>
  );

  const renderActions = (
    <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
      <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
        <VerticalFillIcon />
      </IconButton>
    </TableCell>
  );

  return (
    <>
      <TableRow hover selected={selected} sx={!row.isRead ? { bgcolor: 'action.hover' } : {}}>
        {renderPrimary}
        {renderTitle}
        {renderMessage}
        {renderType}
        {renderUser}
        {renderReadStatus}
        {renderCreatedAt}
        {renderActions}
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
