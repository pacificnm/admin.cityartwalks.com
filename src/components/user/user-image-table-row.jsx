'use client';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

import { UserAdminAnalyticsQuickEdit } from './user-admin-analytics-quick-edit';

// ----------------------------------------------------------------------

export function UserImageTableRow({ row, selected, editHref, onSelectRow, onDeleteRow, mutate }) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <EditIcon />
            Edit
          </MenuItem>
        </li>

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
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.imageId}-checkbox`,
                'aria-label': `${row.imageId} checkbox`,
              },
            }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.caption} src={row.url} />
          </Box>
        </TableCell>
        <TableCell>{row.caption}</TableCell>
        <TableCell>{row?.Artist?.name || 'n/a'}</TableCell>
        <TableCell>{row?.ArtPiece?.title || 'n/a'}</TableCell>
        <TableCell>{row?.Path?.title || 'n/a'}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell align="right">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
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
      <UserAdminAnalyticsQuickEdit
        currentAnalytics={row}
        open={quickEditForm.value}
        onClose={quickEditForm.onFalse}
        mutate={mutate}
      />
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
