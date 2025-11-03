'use client';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fTime, formatStr } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { TableEmptyRows } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { EditIcon, DeleteIcon, VerticalFillIcon } from 'src/components/icons';

/**
 * Path Table Row component for displaying individual path records
 *
 * @param {Object} props - Component props
 * @param {Object} props.row - Path data object
 * @param {boolean} props.selected - Whether the row is selected
 * @param {Function} props.onSelectRow - Handler for row selection
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {string} props.editHref - URL for editing the path
 * @param {boolean} props.loading - Loading state
 * @returns {JSX.Element} The table row component
 */
export function PathTableRow({ row, selected, onSelectRow, onDeleteRow, editHref, loading }) {
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
        <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
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
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  if (loading) return <TableEmptyRows />;

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        sx={{
          ...(row.featured && {
            backgroundColor: 'info.lighter',
            '&:hover': {
              backgroundColor: 'info.light',
            },
          }),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                'aria-label': `${row.id} checkbox`,
              },
            }}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt={row.title || 'No Title'}
              src={row.imageUrl || '/assets/images/mock/cover/cover-1.webp'}
            />
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={paths.path.details(row.id)}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.title}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.description || 'No Description'}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled', typography: 'caption' }}>
                {row.countryId ? ` ${row.Country?.name}` : ''}{' '}
                {row.stateId ? `, ${row.State?.name}` : ''}{' '}
                {row.cityId ? `, ${row.City?.name}` : ''}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell>{row.distance ? `${row.distance} km` : 'N/A'}</TableCell>
        <TableCell>{row.duration ? `${row.duration} min` : 'N/A'}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'ACTIVE' && 'success') ||
              (row.status === 'PENDING' && 'warning') ||
              (row.status === 'BANNED' && 'error') ||
              (row.status === 'REJECTED' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>
        <TableCell>
          <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
            Created: {fTime(row.createdAt, formatStr.dateTime)}
            <br />
            Updated: {fTime(row.updatedAt, formatStr.dateTime)}
          </Box>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <VerticalFillIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
