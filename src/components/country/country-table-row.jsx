'use client';

/**
 * Country Table Row Component
 *
 * Displays individual country records within a table with interactive features including
 * selection capabilities, action menus, and delete confirmations. Integrates with the
 * parent table component for state management and data operations.
 *
 * Features:
 * - Row selection with checkbox
 * - Action menu with edit and delete options
 * - Delete confirmation dialog
 * - Status color coding
 * - Featured item highlighting
 * - Loading state handling
 * - Accessibility support
 *
 * @namespace CityArtWalks.Components.Country
 * @fileoverview Table row component for country management
 * @author Jaimie Garner
 * @version 1.0.0
 *
 * @requires React - React library for component creation
 * @requires @mui/material - Material-UI components for table structure
 * @requires minimal-shared - Shared utilities and hooks
 *
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Components}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Country-Model}
 * @see {@link https://github.com/pacificnm/cityartwalks.com/wiki/Schema#Country}
 */

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
 * Country Table Row component
 * Displays individual country records within a table with actions and selection capabilities.
 *
 * @memberof CityArtWalks.Components.Country
 * @param {Object} props - Component props
 * @param {Object} props.row - Country data object from database
 * @param {boolean} props.selected - Whether the row is currently selected
 * @param {Function} props.onSelectRow - Handler for row selection toggle
 * @param {Function} props.onDeleteRow - Handler for row deletion
 * @param {Function} [props.onEditRow] - Handler for row editing (opens edit dialog)
 * @param {string} [props.editHref] - URL for editing the country (legacy, use onEditRow instead)
 * @param {boolean} [props.loading=false] - Loading state for the row
 * @param {Function} props.getStatusColor - Function to get status color mapping
 * @returns {JSX.Element} The table row component
 */
export function CountryTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  editHref,
  loading = false,
  getStatusColor,
}) {
  // Action menu popover state
  const menuActions = usePopover();

  // Delete confirmation dialog state
  const confirmDialog = useBoolean();

  // Early return for loading state
  if (loading) return <TableEmptyRows />;

  // Action menu popover
  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          {...(onEditRow
            ? {
                onClick: () => {
                  onEditRow();
                  menuActions.onClose();
                },
              }
            : {
                component: RouterLink,
                href: editHref,
              })}
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

  // Delete confirmation dialog
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Country"
      content={`Are you sure you want to delete "${row.name}"?`}
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
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        role="row"
        sx={{
          ...(row.featured && {
            backgroundColor: 'info.lighter',
            '&:hover': {
              backgroundColor: 'info.light',
            },
          }),
        }}
      >
        {/* Selection Checkbox */}
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.countryId}-checkbox`,
                'aria-label': `${row.name || row.countryId} checkbox`,
              },
            }}
          />
        </TableCell>

        {/* Country Name and Avatar */}
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.name || 'No Name'} src={row.imageUrl || undefined}>
              {!row.imageUrl && row.name?.[0]?.toUpperCase()}
            </Avatar>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={paths.dashboard.location.countryDetails(row.countryId)}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.description || 'No Description'}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        {/* Active */}
        <TableCell>
          <Label
            variant="soft"
            color={getStatusColor ? getStatusColor(row.active) : row.active ? 'success' : 'default'}
          >
            {row.active ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        {/* Featured */}
        <TableCell>
          <Label variant="soft" color={row.featured ? 'info' : 'default'}>
            {row.featured ? 'Yes' : 'No'}
          </Label>
        </TableCell>

        {/* Created By */}
        <TableCell>{row.createdBy || 'N/A'}</TableCell>

        {/* Updated By */}
        <TableCell>{row.updatedBy || 'N/A'}</TableCell>

        {/* Created/Updated Dates */}
        <TableCell>
          <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
            Created: {row.createdAt ? fTime(row.createdAt, formatStr.dateTime) : 'Unknown'}
            <br />
            Updated: {row.updatedAt ? fTime(row.updatedAt, formatStr.dateTime) : 'Unknown'}
          </Box>
        </TableCell>

        {/* Actions */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
              aria-label="Open country actions menu"
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
